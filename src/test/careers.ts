import { PublicOpeningSchema, type PublicOpening } from '@/lib/careers-pure';

/** One opening exactly as `GET /api/careers/openings[/:slug]` sends it (`shapePublicOpening`,
 *  Operations apps/backend/src/modules/careers-public/careers-public.service.ts): the
 *  Uzbekistan representative role, salary shown, posted 15 September 2026. */
export const OPENING_WIRE = {
  slug: 'country-representative-uzbekistan',
  title: 'Country Representative — Uzbekistan',
  country: 'UZ',
  city: 'Tashkent',
  cities: ['Tashkent'],
  category: 'COUNTRY_REPRESENTATIVE',
  employmentArrangement: 'PERMANENT',
  employmentArrangements: ['PERMANENT'],
  workMode: 'REMOTE',
  workModes: ['REMOTE'],
  description:
    'Own the whole JobsAdmire pipeline in Uzbekistan — partners, candidates and quality.\n\nThe work:\n- Find and manage licensed partner agencies\n- Run first interviews\n\nThe profile:\n- A working network among agencies',
  salaryMin: '800',
  salaryMax: '1200',
  salaryCurrency: 'USD',
  salaryPayType: 'RANGE',
  salaryPeriod: 'MONTH',
  salaryVisible: true,
  payCurrency: 'USD',
  portfolioRequired: false,
  requiredLanguage: 'Uzbek',
  requiredLanguages: ['Uzbek', 'Russian', 'English'],
  postedAt: '2026-09-15T08:00:00.000Z',
};

export const OPENING: PublicOpening = PublicOpeningSchema.parse(OPENING_WIRE);

export const opening = (over: Partial<PublicOpening> = {}): PublicOpening => ({
  ...OPENING,
  ...over,
});
