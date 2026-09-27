// @vitest-environment node
import { describe, expect, it, vi } from 'vitest';

// The renderer is mocked: this test proves the handler's contract (validation, cache
// contract, content-type, font bytes handed over) without rasterising anything.
const seen = vi.hoisted(() => ({
  calls: [] as { element: unknown; options: Record<string, unknown> }[],
}));

vi.mock('next/og', () => ({
  ImageResponse: class extends Response {
    constructor(element: unknown, options: Record<string, unknown>) {
      super(new Uint8Array([0x89, 0x50, 0x4e, 0x47]), {
        status: 200,
        headers: { 'content-type': 'image/png' },
      });
      seen.calls.push({ element, options });
    }
  },
}));

// `@/content/adapter` is `server-only` and loads the generated bundles; the route gets the
// parsed golden fixture instead (R13/R23) — one page record (`home`), 20 strings.
vi.mock('@/content/adapter', async () => {
  const { BundleSchema } = await import('../../../../../contract/website-bundle.v1');
  const fixture = (await import('../../../../../contract/website-bundle.v1.fixture.json')).default;
  const bundle = BundleSchema.parse(fixture);
  return { getBundle: async () => bundle };
});

// `getTranslations` needs a request scope; the route only calls `has()` and `t()` on `sys`.
vi.mock('next-intl/server', () => ({
  getTranslations: async () =>
    Object.assign((key: string) => `sys:${key}`, {
      has: (key: string) => key === 'seo.calc.title',
    }),
}));

import { GET } from './route';

const ctx = (locale: string, pageKey: string) => ({ params: Promise.resolve({ locale, pageKey }) });
const req = new Request('https://www.jobsadmire.com/og/tr/home.png');
const lastElement = () => JSON.stringify(seen.calls.at(-1)!.element);

describe('GET /og/[locale]/[pageKey]', () => {
  it('answers a PNG for a known page in a known locale, from the bundle page record', async () => {
    const res = await GET(req, ctx('tr', 'home.png'));
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toBe('image/png');
    const last = seen.calls.at(-1)!;
    // home.017 / home.018 of the TR fixture — the record's own SEO strings
    expect(lastElement()).toContain(
      'İŞKUR lisanslı · sözleşmeler kurucu imzasıyla · işçiden ücret alınmaz',
    );
    expect(lastElement()).toContain('Nitelikli işçi.');
    const fonts = last.options.fonts as { name: string; weight: number; data: Buffer }[];
    expect(fonts[0].name).toBe('Archivo');
    expect(fonts[0].weight).toBe(700);
    expect(fonts[0].data.length).toBe(192180);
    expect(last.options.width).toBe(1200);
    expect(last.options.height).toBe(630);
    expect(last.options.headers).toEqual({
      'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
    });
  });

  it('falls back to sys.seo.<pageKey>.title, then the wordmark; subline = sys.seo.ogTagline (W38)', async () => {
    await GET(req, ctx('en', 'calc.png'));
    expect(lastElement()).toContain('sys:seo.calc.title');
    expect(lastElement()).toContain('sys:seo.ogTagline');
    await GET(req, ctx('en', 'hire.png'));
    expect(lastElement()).not.toContain('sys:seo.hire.title');
    expect(lastElement()).toContain('sys:seo.ogTagline');
    // the wordmark header plus the title fallback — never home.188
    expect(lastElement().match(/JobsAdmire/g)).toHaveLength(2);
    expect(lastElement()).not.toContain('home.188');
  });

  it('404s an unknown locale, a key outside OG_PAGE_KEYS, and a missing .png suffix', async () => {
    const before = seen.calls.length;
    expect((await GET(req, ctx('de', 'home.png'))).status).toBe(404);
    expect((await GET(req, ctx('tr', 'nope.png'))).status).toBe(404);
    expect((await GET(req, ctx('tr', 'home'))).status).toBe(404);
    expect((await GET(req, ctx('tr', 'home.jpg'))).status).toBe(404);
    expect(seen.calls.length).toBe(before);
  });
});
