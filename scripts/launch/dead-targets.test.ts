import { describe, expect, it, vi } from 'vitest';
import {
  deadTargets,
  fetchRoute,
  hasElementId,
  internalHrefs,
  missingCtaAnchor,
} from './dead-targets';

describe('internalHrefs', () => {
  it('collects internal hrefs, dropping /_next/, external hosts, hashes and duplicates', () => {
    const html = `
      <a href="/hire-workers">A</a>
      <a href="/hire-workers">A again</a>
      <link rel="stylesheet" href="/_next/static/x.css">
      <a href="#proposal">jump</a>
      <a href="https://wa.me/905551234567">whatsapp</a>
      <a href='/partner-with-us'>single-quoted</a>
    `;
    expect(internalHrefs(html)).toEqual(['/hire-workers', '/partner-with-us']);
  });

  it('ignores an href-shaped substring inside a script tag (the RSC flight payload)', () => {
    const html = '<script>self.__next_f.push([1,"...\\"href\\":\\"/not-a-link\\"..."])</script>';
    expect(internalHrefs(html)).toEqual([]);
  });

  it('ignores one inside an HTML comment', () => {
    expect(internalHrefs('<!-- <a href="/commented-out">x</a> -->')).toEqual([]);
  });
});

describe('hasElementId', () => {
  it('finds a real element id in either quote style', () => {
    expect(hasElementId('<section id="proposal">', 'proposal')).toBe(true);
    expect(hasElementId(`<section id='proposal'>`, 'proposal')).toBe(true);
  });

  it('does not match a different id or a same-prefix id', () => {
    expect(hasElementId('<section id="proposal-2">', 'proposal')).toBe(false);
    expect(hasElementId('<section id="other">', 'proposal')).toBe(false);
  });
});

describe('fetchRoute', () => {
  it('never follows a redirect — a 3xx is reported as-is, not chased', async () => {
    const mock = vi.fn(async () => new Response(null, { status: 308 }));
    const { status, html } = await fetchRoute(
      'https://example.test',
      '/legacy',
      mock as unknown as typeof fetch,
    );
    expect(status).toBe(308);
    expect(html).toBe('');
    const [url, init] = mock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe('https://example.test/legacy');
    expect(init.redirect).toBe('manual');
  });

  it('reports no response, not a throw, on a network failure', async () => {
    const f = vi.fn().mockRejectedValue(new Error('ECONNREFUSED')) as unknown as typeof fetch;
    expect(await fetchRoute('https://example.test', '/', f)).toEqual({ status: null, html: '' });
  });
});

// RED fixture (T3-4/W152): proves the sweep names a dead link by path — this is the case the
// review's probe found live (12 chrome hrefs 404 against the WP1 placeholder pages).
describe('deadTargets (RED fixture: a page with one live and one dead link)', () => {
  it('reports the 404 and clears the 200', async () => {
    const pages: Record<string, { status: number; body: string }> = {
      '/': {
        status: 200,
        body: '<a href="/hire-workers">ok</a><a href="/nowhere">dead</a>',
      },
      '/hire-workers': { status: 200, body: '<p>fine</p>' },
      '/nowhere': { status: 404, body: '' },
    };
    const f = vi.fn(async (input: string | URL) => {
      const path = new URL(input).pathname;
      const page = pages[path];
      return new Response(page?.body ?? '', { status: page?.status ?? 404 });
    }) as unknown as typeof fetch;

    const dead = await deadTargets('https://example.test', ['/'], f);
    expect(dead).toEqual(['/nowhere → 404']);
    // The live link was fetched too (to prove it clears), never listed.
    expect(f).toHaveBeenCalledWith('https://example.test/hire-workers', expect.anything());
  });

  it('is empty when every collected href answers 200', async () => {
    const f = vi.fn(
      async () => new Response('<p>fine</p>', { status: 200 }),
    ) as unknown as typeof fetch;
    expect(await deadTargets('https://example.test', ['/'], f)).toEqual([]);
  });
});

describe('missingCtaAnchor', () => {
  it('flags a page that answers 200 without the anchor id', async () => {
    const f = vi.fn(
      async () => new Response('<main>no anchor here</main>', { status: 200 }),
    ) as unknown as typeof fetch;
    const line = await missingCtaAnchor('https://example.test', 'tr', '/', 'proposal', f);
    expect(line).toBe('tr / → missing id="proposal" (status 200)');
  });

  it('flags a page that does not answer 200 at all', async () => {
    const f = vi.fn(async () => new Response('', { status: 404 })) as unknown as typeof fetch;
    const line = await missingCtaAnchor('https://example.test', 'en', '/en', 'proposal', f);
    expect(line).toBe('en /en → missing id="proposal" (status 404)');
  });

  it('clears a page that carries the anchor', async () => {
    const f = vi.fn(
      async () => new Response('<section id="proposal">x</section>', { status: 200 }),
    ) as unknown as typeof fetch;
    expect(await missingCtaAnchor('https://example.test', 'tr', '/', 'proposal', f)).toBeNull();
  });
});
