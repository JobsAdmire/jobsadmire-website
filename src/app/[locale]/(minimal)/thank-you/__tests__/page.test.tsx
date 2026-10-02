import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { Locale } from '@/i18n/routing';
import { renderWithIntl } from '@/test/render';
import { BundleSchema, type Bundle } from '../../../../../../contract/website-bundle.v1';

// Final pass D3 (W178, T13 note): `container-site max-w-[720px]` on ONE element never narrowed
// anything — `.container-site` is unlayered (W178) and its own `max-width: var(--container-max)`
// beats the layered utility — so the 720 px reading column sits on an inner wrapper, centred.
// The page is rendered whole (the partner page test's pattern): the LOCAL bundle from disk, the
// request scope stubbed, the conversion ping out of scope.
vi.mock('next-intl/server', () => ({
  setRequestLocale: () => {},
  getTranslations: async () => (key: string) => key,
}));
vi.mock('@/analytics/ConversionPing', () => ({ ConversionPing: () => null }));
vi.mock('@/content/adapter', async (importOriginal) => {
  const real = await importOriginal<typeof import('@/content/adapter')>();
  const bundles = new Map<Locale, Bundle>();
  return {
    ...real,
    getBundle: async (locale: Locale) => {
      let bundle = bundles.get(locale);
      if (!bundle) {
        const path = join(process.cwd(), 'src', 'content', 'local', `bundle.${locale}.json`);
        bundle = BundleSchema.parse(JSON.parse(readFileSync(path, 'utf8')));
        bundles.set(locale, bundle);
      }
      return bundle;
    },
  };
});

import ThankYou from '../page';

describe('Thank-you page — the 720 px column is an inner wrapper inside the container (D3)', () => {
  it('the container carries no max-width class; the h1 sits in a centred max-w-[720px] wrapper', async () => {
    const jsx = await ThankYou({
      params: Promise.resolve({ locale: 'tr' }),
      searchParams: Promise.resolve({ form: 'hire' }),
    });
    renderWithIntl(jsx, { locale: 'tr' });
    const h1 = screen.getByTestId('page-h1');
    const container = h1.closest('.container-site')!;
    expect(container).not.toBeNull();
    expect(container.className.split(/\s+/)).not.toContain('max-w-[720px]');
    const column = h1.parentElement!;
    expect(column).not.toBe(container);
    expect(column).toHaveClass('mx-auto', 'max-w-[720px]');
    expect(container).toContainElement(column);
  });
});
