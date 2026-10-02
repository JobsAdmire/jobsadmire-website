import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import type { Locale } from '@/i18n/routing';
import type { PublicOpening } from '@/lib/careers-pure';
import { OPENING, opening } from '@/test/careers';
import { renderWithIntl } from '@/test/render';
import { BundleSchema, type Bundle } from '../../../../../../../contract/website-bundle.v1';

// The page is rendered whole (the verify page test's pattern): `getBundle` is the committed LOCAL
// bundle read from disk (never imported — D23), `getOpening` is the fixture opening a case sets,
// `setRequestLocale`/`getTranslations` need a Next request scope the test has not got, and the
// server action is not part of what this file proves. What it proves is the JobPosting node the
// page emits for the opening it was given (W205 ⚠️2, final pass P2-1).
const state = vi.hoisted(() => ({ opening: null as PublicOpening | null }));

vi.mock('next-intl/server', () => ({
  setRequestLocale: () => {},
  getTranslations: async () => (key: string) => key,
}));
vi.mock('../actions', () => ({ submitCareersApplication: vi.fn() }));
vi.mock('@/lib/careers', () => ({
  getOpening: async () => state.opening,
  listOpenings: async () => (state.opening ? [state.opening] : []),
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

import CareerDetailPage from '../page';

type JobPostingNode = {
  '@type': string;
  jobLocationType?: string;
  applicantLocationRequirements?: unknown;
  jobLocation: { address: Record<string, string> };
};

async function jobPostingOf(o: PublicOpening): Promise<JobPostingNode> {
  state.opening = o;
  const jsx = await CareerDetailPage({ params: Promise.resolve({ locale: 'en', slug: o.slug }) });
  const { container, unmount } = renderWithIntl(jsx, { locale: 'en' });
  const scripts = [...container.querySelectorAll('script[type="application/ld+json"]')];
  const nodes = scripts.map((s) => JSON.parse(s.innerHTML) as JobPostingNode);
  unmount();
  const job = nodes.filter((n) => n['@type'] === 'JobPosting');
  expect(job).toHaveLength(1);
  return job[0];
}

describe('careers detail — the JobPosting node the page emits (W205 ⚠️2)', () => {
  it('a REMOTE-only opening is TELECOMMUTE, with no invented applicant countries', async () => {
    expect(OPENING.workModes).toEqual(['REMOTE']);
    const j = await jobPostingOf(OPENING);
    expect(j.jobLocationType).toBe('TELECOMMUTE');
    expect('applicantLocationRequirements' in j).toBe(false);
    expect(j.jobLocation.address).toEqual({
      '@type': 'PostalAddress',
      addressLocality: 'Tashkent',
      addressCountry: 'UZ',
    });
  });

  it('an ON_SITE opening and a mixed-mode one carry no jobLocationType', async () => {
    const onSite = await jobPostingOf(
      opening({ slug: 'on-site', workMode: 'ON_SITE', workModes: ['ON_SITE'] }),
    );
    expect('jobLocationType' in onSite).toBe(false);
    const mixed = await jobPostingOf(
      opening({ slug: 'mixed', workMode: 'REMOTE', workModes: ['REMOTE', 'HYBRID'] }),
    );
    expect('jobLocationType' in mixed).toBe(false);
  });

  it('a city-less opening emits the country alone — never the country name as addressLocality', async () => {
    const j = await jobPostingOf(opening({ slug: 'india', country: 'IN', city: null, cities: [] }));
    expect(j.jobLocation.address).toEqual({ '@type': 'PostalAddress', addressCountry: 'IN' });
  });
});
