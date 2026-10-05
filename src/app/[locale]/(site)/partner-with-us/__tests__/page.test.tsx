import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Logo } from '@/design/blocks/LogoMarquee';
import type { Locale } from '@/i18n/routing';
import { renderWithIntl } from '@/test/render';
import { BundleSchema, type Bundle } from '../../../../../../contract/website-bundle.v1';

// Owner 2026-10-05 / W6 / W216 (1): the logo band always renders — the design's labelled sample
// slots until consented logos exist, the logos after — a plain import (P2-7's server-side
// `await import()` moved no client bytes: Turbopack groups the `PausableMarquee` client reference
// into the route's eager chunk either way, so it was reverted). The page is rendered whole (the
// verify page test's pattern): the LOCAL bundle from disk (never imported — D23), a request scope
// stubbed, the server actions out of scope; what varies is the logo list the page reads.
const state = vi.hoisted(() => ({ logos: [] as readonly Logo[] }));

vi.mock('next-intl/server', () => ({
  setRequestLocale: () => {},
  getTranslations: async () => (key: string) => key,
}));
vi.mock('../actions', () => ({
  submitHrAgency: vi.fn(),
  submitSourcingPartner: vi.fn(),
  submitInstitute: vi.fn(),
}));
vi.mock('../_lib/logos', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../_lib/logos')>()),
  get PARTNER_LOGOS() {
    return state.logos;
  },
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

beforeEach(() => {
  state.logos = [];
});

describe('Partner page — the logo band (owner 2026-10-05, W6, W216 (1))', () => {
  it('with an empty logo list (Phase A) the band shows the sample slots with the sample tag', async () => {
    const jsx = await PartnerWithUs({ params: Promise.resolve({ locale: 'tr' }) });
    const { container } = renderWithIntl(jsx, { locale: 'tr' });
    const band = screen.getByTestId('partner-logos');
    expect(band.querySelector('[data-sample-tag]')).not.toBeNull();
    expect(container.querySelectorAll('[data-placeholder^="logo-"]').length).toBeGreaterThan(0);
    expect(screen.queryByRole('img', { name: 'Acme Lojistik' })).toBeNull();
  });

  it('with a consented logo the band renders', async () => {
    state.logos = [{ src: '/brand/logos/acme.svg', alt: 'Acme Lojistik', width: 160, height: 60 }];
    const jsx = await PartnerWithUs({ params: Promise.resolve({ locale: 'tr' }) });
    renderWithIntl(jsx, { locale: 'tr' });
    expect(screen.getByTestId('partner-logos')).toBeInTheDocument();
    expect(screen.getAllByRole('img', { name: 'Acme Lojistik' }).length).toBeGreaterThan(0);
    expect(document.querySelector('[data-placeholder^="logo-"]')).toBeNull();
  });
});
