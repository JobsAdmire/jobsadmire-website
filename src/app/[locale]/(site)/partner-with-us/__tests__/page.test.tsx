import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { Locale } from '@/i18n/routing';
import { renderWithIntl } from '@/test/render';
import { BundleSchema, type Bundle } from '../../../../../../contract/website-bundle.v1';

// Owner 2026-10-06 (W247): the partner logo band is gone — only client logos are shown (on Hire
// Workers). The page is rendered whole with the LOCAL bundle from disk (never imported — D23), a
// request scope stubbed and the server actions out of scope.

vi.mock('next-intl/server', () => ({
  setRequestLocale: () => {},
  getTranslations: async () => (key: string) => key,
}));
vi.mock('../actions', () => ({
  submitHrAgency: vi.fn(),
  submitSourcingPartner: vi.fn(),
  submitInstitute: vi.fn(),
}));
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

import PartnerWithUs from '../page';

describe('Partner page — no partner logo band (owner 2026-10-06, W247)', () => {
  it.each(['tr', 'en'] as const)(
    '%s: no logo band, no logo slots, no "25+" figure',
    async (locale) => {
      const jsx = await PartnerWithUs({ params: Promise.resolve({ locale }) });
      const { container } = renderWithIntl(jsx, { locale });
      expect(screen.queryByTestId('partner-logos')).toBeNull();
      expect(container.querySelector('[data-placeholder^="logo-"]')).toBeNull();
      expect(container).not.toHaveTextContent('25+');
    },
  );
});
