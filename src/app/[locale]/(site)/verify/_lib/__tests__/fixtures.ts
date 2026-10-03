import type { Founder } from '@/content/collections';
import type { Representative } from '../register';

/** v1.1 register rows — fixture data, no real person (the design's staff-data strings are never
 *  a source: verify.148–197 / 240–258 are sample rows translated as copy). */
export const FOUNDER_REP: Representative = {
  id: 'JA-REP-001',
  name: 'Founder Example',
  role: 'Founder · sole signatory',
  level: 'founder',
  desk: null,
  city: 'Antalya',
  country: 'TR',
  languages: ['tr', 'en'],
  contact: '+905011240340',
  validUntil: null,
  reportsTo: null,
  since: '2022-01',
  status: 'active',
  canSign: true,
  photo: null,
  updatedAt: '2026-07-29T08:00:00.000Z',
};

export const OFFICE_REP: Representative = {
  ...FOUNDER_REP,
  id: 'JA-OPS-004',
  name: 'Office Example',
  role: 'Operations',
  level: 'office',
  desk: 'Operations',
  canSign: false,
  reportsTo: 'JA-REP-001',
  since: '2023-03',
  updatedAt: '2026-06-01T08:00:00.000Z',
};

export const FORMER_REP: Representative = {
  ...FOUNDER_REP,
  id: 'JA-REP-018',
  name: 'Former Example',
  role: 'Coordinator',
  level: 'coordinator',
  city: 'Lahore',
  country: 'PK',
  status: 'former',
  canSign: false,
  since: null,
  updatedAt: '2026-02-14T00:00:00.000Z',
};

/** The W86 `founder` row once §10 row 3 clears — fixture data (the committed row is unpublished). */
export const PUBLISHED_FOUNDER: Founder = {
  name: 'Founder Example',
  titleId: 'about.047',
  photoSrc: null,
  published: true,
};
