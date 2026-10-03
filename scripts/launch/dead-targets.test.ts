import { describe, expect, it, vi } from 'vitest';
import { CTA_BY_PATHNAME, DEFAULT_CTAS } from '@/design/chrome/ctas';
import { getPathname } from '@/i18n/navigation';
import type { StaticPathname } from '@/lib/seo/routes';
import {
  ctaAnchorTargets,
  deadTargets,
  fetchRoute,
  hasElementId,
  internalHrefs,
  missingCtaAnchor,
  missingCtaAnchors,
} from './dead-targets';

/** The launch check's own localizer: the routing table's per-locale path for an internal one. */
const localize = (locale: 'tr' | 'en', pathname: string) =>
  getPathname({ locale, href: pathname as StaticPathname });

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

// W158 (N1): the anchor sweep walks DEFAULT_CTAS as well as CTA_BY_PATHNAME, primary and
// secondary, and fetches the page each link points at — never the table key it sits under.
describe('ctaAnchorTargets + missingCtaAnchors (W158)', () => {
  // RED fixture (N1): the real CTA tables against a site where every page carries every anchor
  // id except /isci-talebi, which lacks DEFAULT_CTAS.primary's #request-form — the header's
  // default CTA on every page without a table entry, and the one the review's I6 probe named.
  it('reports a DEFAULT_CTAS anchor missing on /isci-talebi', async () => {
    const targets = ctaAnchorTargets({ defaults: DEFAULT_CTAS, byPathname: CTA_BY_PATHNAME });
    const everyId = [...new Set(targets.map((t) => t.id)), 'request-form']
      .map((id) => `<section id="${id}"></section>`)
      .join('');
    const f = vi.fn(async (input: string | URL) => {
      const path = new URL(input).pathname;
      return new Response(path === '/isci-talebi' ? '<main>no anchor here</main>' : everyId, {
        status: 200,
      });
    }) as unknown as typeof fetch;

    expect(await missingCtaAnchors('https://example.test', targets, localize, f)).toEqual([
      'DEFAULT_CTAS.primary (/hire-workers#request-form): tr /isci-talebi → missing id="request-form" (status 200)',
    ]);
    // the EN twin was checked too, on its own localized path, and carries the id
    expect(f).toHaveBeenCalledWith('https://example.test/en/hire-workers', expect.anything());
  });

  it('fetches the page the link points at, not the table key it sits under', async () => {
    const targets = ctaAnchorTargets({
      defaults: { primary: { href: '/hire-workers' } },
      byPathname: { '/': { primary: { href: { pathname: '/contact', hash: '#message' } } } },
    });
    expect(targets).toEqual([
      { source: "CTA_BY_PATHNAME['/'].primary", pathname: '/contact', id: 'message' },
    ]);
    const f = vi.fn(
      async () => new Response('<form id="message"></form>', { status: 200 }),
    ) as unknown as typeof fetch;
    expect(await missingCtaAnchors('https://example.test', targets, localize, f)).toEqual([]);
    expect((f as unknown as ReturnType<typeof vi.fn>).mock.calls.map(([url]) => url)).toEqual([
      'https://example.test/iletisim',
      'https://example.test/en/contact',
    ]);
  });

  it('walks primary AND secondary of every table and skips a plain page link (no hash)', () => {
    expect(
      ctaAnchorTargets({
        defaults: {
          primary: { href: { pathname: '/hire-workers', hash: '#request-form' } },
          secondary: { href: '/partner-with-us' },
        },
        byPathname: {
          '/verify': {
            primary: { href: { pathname: '/verify', hash: '#report' } },
            secondary: { href: { pathname: '/contact', hash: 'message' } },
          },
          '/about': { primary: { href: '/about' }, secondary: null },
        },
      }),
    ).toEqual([
      { source: 'DEFAULT_CTAS.primary', pathname: '/hire-workers', id: 'request-form' },
      { source: "CTA_BY_PATHNAME['/verify'].primary", pathname: '/verify', id: 'report' },
      { source: "CTA_BY_PATHNAME['/verify'].secondary", pathname: '/contact', id: 'message' },
    ]);
  });
});
