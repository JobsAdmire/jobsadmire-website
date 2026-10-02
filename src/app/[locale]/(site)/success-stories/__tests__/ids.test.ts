import { describe, expect, it, vi } from 'vitest';
import { collisionsInTree } from '@/test/class-collisions';
import { renderWithIntl } from '@/test/render';

// `getTranslations`/`setRequestLocale` need a request scope next-intl only establishes inside
// a real Next.js request — proved by `src/app/og/[locale]/[pageKey]/route.test.ts`, which mocks
// the same module for the same reason. `getBundle` needs no mock: `@/content/adapter`'s
// `server-only` import resolves to an empty module under Vitest (R2, `vitest.config.mts`), so
// the real function loads the committed local bundle exactly as the page does, and every id it
// reads below is verified present in `src/content/local/catalogue.json`. The rendered tree DOES
// need `NextIntlClientProvider` (`renderWithIntl`, real messages): `Breadcrumbs` and the other
// shared blocks call plain `useTranslations('sys')`, which — unlike this page's own `getBundle`/
// `getTranslations` calls — has no server-only escape hatch and needs the real provider context
// once rendered through `@testing-library/react` rather than Next's own RSC pipeline.
vi.mock('next-intl/server', () => ({
  setRequestLocale: () => {},
  getTranslations: async () => {
    const { default: tr } = await import('@/messages/tr.json');
    const root = tr.sys as Record<string, unknown>;
    const get = (path: string): unknown =>
      path
        .split('.')
        .reduce<unknown>(
          (o, k) => (o && typeof o === 'object' ? (o as Record<string, unknown>)[k] : undefined),
          root,
        );
    return Object.assign((key: string) => String(get(key) ?? key), {
      raw: (key: string) => String(get(key) ?? key),
      has: (key: string) => get(key) !== undefined,
    });
  },
}));

// A plain static import, not a dynamic one: Vitest hoists every `vi.mock` call above every
// `import` statement at compile time (the same ordering `route.test.ts` relies on), so the
// mock above is already registered by the time this module — and the real `@/content/adapter`
// it pulls in — first loads.
import SuccessStories from '../page';

describe('Success Stories — the page renders its own breadcrumb and anchor ids (W109)', () => {
  it('breadcrumbs: Home → Success Stories (success.022 → success.013), the second crumb current', async () => {
    const jsx = await SuccessStories({ params: Promise.resolve({ locale: 'tr' }) });
    const { container } = renderWithIntl(jsx, { locale: 'tr' });
    const current = container.querySelector('[aria-current="page"]');
    expect(current).toHaveTextContent('Başarı Hikâyeleri');
    const links = container.querySelectorAll('nav a');
    expect(Array.from(links).some((a) => a.textContent === 'Ana Sayfa')).toBe(true);
  });

  it('owns exactly one #cases and one #talk section', async () => {
    const jsx = await SuccessStories({ params: Promise.resolve({ locale: 'tr' }) });
    const { container } = renderWithIntl(jsx, { locale: 'tr' });
    expect(container.querySelectorAll('#cases')).toHaveLength(1);
    expect(container.querySelectorAll('#talk')).toHaveLength(1);
    expect(container.querySelector('[data-testid="stories-closing"]')).toBeInTheDocument();
  });

  it('tags exactly one h1 as page-h1 and the sole data-lcp-slot; the hero photo is a placeholder, never the LCP slot (D26/W55)', async () => {
    const jsx = await SuccessStories({ params: Promise.resolve({ locale: 'tr' }) });
    const { container } = renderWithIntl(jsx, { locale: 'tr' });
    const h1s = container.querySelectorAll('h1');
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveAttribute('data-testid', 'page-h1');
    expect(h1s[0]).toHaveAttribute('data-lcp-slot', 'h1');
    expect(container.querySelectorAll('[data-lcp-slot]')).toHaveLength(1);
    const placeholder = container.querySelector('[data-placeholder="ss-hero"]');
    expect(placeholder).toBeInTheDocument();
    expect(placeholder).not.toHaveAttribute('data-lcp-slot');
    // W119/W122/W155: the real collision checker over the whole rendered page (T9 review M7)
    expect(collisionsInTree(container)).toEqual([]);
  });
});
