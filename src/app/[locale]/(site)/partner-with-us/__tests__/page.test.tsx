import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Logo } from '@/design/blocks/LogoMarquee';
import type { Locale } from '@/i18n/routing';
import { renderWithIntl } from '@/test/render';
import { BundleSchema, type Bundle } from '../../../../../../contract/website-bundle.v1';

// W193/W194 A2 (final pass P2-7): while the bundle carries no consented logos, the Partner page
// must not ship the marquee's client chunk (`PausableMarquee`, 642 B gz). The page therefore has
// no top-level import of `Logos`/`LogoMarquee`: the section module is loaded inside the
// `logos.length > 0` branch. The page is rendered whole (the verify page test's pattern): the
// LOCAL bundle from disk (never imported — D23), a request scope stubbed, the server actions out of
// scope; what varies is the logo list the page reads.
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
vi.mock('../_lib/logos', () => ({
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

const PAGE = join(process.cwd(), 'src/app/[locale]/(site)/partner-with-us/page.tsx');

beforeEach(() => {
  state.logos = [];
});

describe('Partner page — the logo band ships only with logos (W193/W194 A2)', () => {
  it('the page module has no top-level import of Logos or LogoMarquee — the section is loaded in the branch', () => {
    const source = readFileSync(PAGE, 'utf8');
    const topLevelImports = source.match(/^import[\s\S]*?from\s+'[^']+';/gm) ?? [];
    expect(topLevelImports.some((l) => /_sections\/Logos'/.test(l))).toBe(false);
    expect(topLevelImports.some((l) => /blocks\/LogoMarquee'/.test(l))).toBe(false);
    expect(source).toMatch(/await import\('\.\/_sections\/Logos'\)/);
  });

  it('with an empty logo list (Phase A) the island is absent from the page', async () => {
    const jsx = await PartnerWithUs({ params: Promise.resolve({ locale: 'tr' }) });
    renderWithIntl(jsx, { locale: 'tr' });
    expect(screen.queryByTestId('partner-logos')).toBeNull();
    expect(screen.queryByRole('img', { name: 'Acme Lojistik' })).toBeNull();
  });

  it('with a consented logo the branch loads the section and the band renders', async () => {
    state.logos = [{ src: '/brand/logos/acme.svg', alt: 'Acme Lojistik', width: 160, height: 60 }];
    const jsx = await PartnerWithUs({ params: Promise.resolve({ locale: 'tr' }) });
    renderWithIntl(jsx, { locale: 'tr' });
    expect(screen.getByTestId('partner-logos')).toBeInTheDocument();
    expect(screen.getAllByRole('img', { name: 'Acme Lojistik' }).length).toBeGreaterThan(0);
  });
});
