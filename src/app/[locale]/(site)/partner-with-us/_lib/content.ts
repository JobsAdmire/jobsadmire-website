import type { TrackKey } from './tracks';

/**
 * Every package id the Partner With Us page reads, by section — read through `makeTf` (D17:
 * partner.059, 077, 078, 087, 140, 159 and 186 carry `{metric}` placeholders). NOT here, on
 * purpose: the chrome's own ids (partner.001, 003–007, 009–015, 019–022, 191–221 — the layout
 * renders the canonical `home.*` ids, R15), the header CTA pair partner.017/018
 * (`CTA_BY_PATHNAME`, W17), the hero photo alt partner.034 (gradient hero, §10 #4), the inline
 * success banner partner.088/089 (D13), the KVKK sentence partner.090/091 (W79), the "City,
 * country" box partner.135 (the ISO-2 select carries the country) and the store micro-copy
 * partner.162/163 (`StoreBadges` reads contact.143/144 + hire.240/241, W7). partner.002/008/016
 * ARE read: the Hire Workers link inside the chain sentence the package splits around it (W23)
 * and this page's own crumbs (W109); so are the captions of the design's sample 5+/20+/25+
 * figures partner.037/039/045 (parity 2026-10-05: shown with the `SampleTag`).
 */

/** A package-string reader: `makeTf(bundle, locale)`. */
export type Tf = (id: string) => string;
type Pair = readonly [string, string];

export const HERO_IDS = {
  crumbHome: 'partner.016',
  crumbSelf: 'partner.008',
  h1: 'partner.023',
  leadDesk: 'partner.024',
  leadMob: 'partner.025',
  ticks: [
    ['partner.026', 'partner.027'],
    ['partner.028', 'partner.029'],
  ],
  ctaTracks: 'partner.030',
  ctaWhatsApp: 'partner.031',
  speakLead: 'partner.032',
  speakTail: 'partner.033',
} as const;

/** "Our network today": the design's four rows in its order (Partner With Us ll. 518–537). The
 *  HR-agency and sourcing-partner rows have no signed metric (W1): they show the design's sample
 *  figures (`data-target` 5 / 20) as page-local constants beside the `SampleTag` (owner
 *  2026-10-05, D23 — never a fixture); the countries and placed rows read their signed metric and
 *  drop out while it is empty. `tone` is the design's figure colour (contrast-safe, D20). */
export const NETWORK_IDS = {
  heading: 'partner.035',
  live: 'partner.036',
  footnote: 'partner.046',
  rows: [
    {
      key: 'agencies',
      sample: { value: 5, suffix: '+' },
      tone: 'blue',
      deskId: 'partner.037',
      mobId: 'partner.038',
    },
    {
      key: 'sourcing',
      sample: { value: 20, suffix: '+' },
      tone: 'green',
      deskId: 'partner.039',
      mobId: 'partner.040',
    },
    {
      key: 'countries',
      metric: 'countries',
      tone: 'indigo',
      deskId: 'partner.041',
      mobId: 'partner.042',
    },
    { key: 'placed', metric: 'placed', tone: 'amber', deskId: 'partner.043', mobId: 'partner.044' },
  ],
} as const;

/** The logo band's caption (partner.045) beside the design's sample "25+" figure. */
export const LOGOS_IDS = { caption: 'partner.045' } as const;

export const CHAIN_IDS = {
  heading: 'partner.047',
  introLead: 'partner.048',
  introLink: 'partner.002', // the package splits the sentence around its Hire Workers link (W23)
  introTail: 'partner.049',
  nodes: [
    { tone: 'supply', eyebrow: 'partner.050', title: 'partner.051', body: 'partner.052' },
    { tone: 'core', eyebrow: 'partner.053', title: 'partner.054', body: 'partner.055' },
    { tone: 'demand', eyebrow: 'partner.056', title: 'partner.057', body: 'partner.058' },
  ],
} as const;

/** The sticky bar: partner.059 is re-authored to `{replySlaHours}` (W87). */
export const STICKY_IDS = {
  message: 'partner.059',
  call: 'partner.060',
  whatsapp: 'partner.031',
  tracks: 'partner.030',
} as const;

export const TRACKS_IDS = {
  heading: 'partner.061',
  introDesk: 'partner.062',
  introMob: 'partner.063',
  choose: 'partner.064', // the radiogroup's legend — "1 Who are you?" on phones
  apply: 'partner.070', // "2 Your application" on phones
  cardCta: 'partner.066',
  cards: {
    hr: { title: 'partner.038', body: 'partner.065' },
    sourcing: { title: 'partner.040', body: 'partner.067' },
    institute: { title: 'partner.068', body: 'partner.069' },
  },
} as const;

/** What every panel shares. partner.087 carries `{replySlaHours}`. */
export const PANEL_SHARED = {
  jump: 'partner.074',
  asksHeading: 'partner.082',
  sla: 'partner.087',
  submit: 'partner.092',
} as const;

export type PanelCopy = {
  eyebrow: string;
  heading: string;
  lead: string;
  benefits: readonly Pair[];
  asks: readonly string[];
  formTitle: string;
};

/** One panel per track (partner.077 → `{countries}`, 078 → `{homepageReplyHours}`, W87). */
export const PANEL_COPY: Record<TrackKey, PanelCopy> = {
  hr: {
    eyebrow: 'partner.071',
    heading: 'partner.072',
    lead: 'partner.073',
    benefits: [
      ['partner.075', 'partner.076'],
      ['partner.077', 'partner.078'],
      ['partner.079', 'partner.080'],
      ['partner.028', 'partner.081'],
    ],
    asks: ['partner.083', 'partner.084', 'partner.085'],
    formTitle: 'partner.086',
  },
  sourcing: {
    eyebrow: 'partner.099',
    heading: 'partner.100',
    lead: 'partner.101',
    benefits: [
      ['partner.102', 'partner.103'],
      ['partner.104', 'partner.105'],
      ['partner.106', 'partner.107'],
      ['partner.108', 'partner.109'],
    ],
    asks: ['partner.110', 'partner.111', 'partner.112'],
    formTitle: 'partner.113',
  },
  institute: {
    eyebrow: 'partner.119',
    heading: 'partner.120',
    lead: 'partner.121',
    benefits: [
      ['partner.122', 'partner.123'],
      ['partner.124', 'partner.125'],
      ['partner.126', 'partner.127'],
      ['partner.128', 'partner.129'],
    ],
    asks: ['partner.130', 'partner.131', 'partner.132'],
    formTitle: 'partner.133',
  },
};

/** The package's field labels, passed to `Field` as `label` (W115) — in the design's
 *  placeholder-only face (SHARED 4.1) each label is visually hidden and its words are the
 *  field's placeholder. Exactly the design's fields, in its pairs (parity 2026-10-05): the
 *  optional `candidatesPerYear` and the institute's optional `city` the design never shows are
 *  not rendered (the `trades` box asks for the volume in its own words). */
export const FIELD_LABELS = {
  hr: {
    company: 'partner.093',
    name: 'partner.094',
    city: 'partner.095',
    email: 'partner.096',
    phone: 'partner.097',
    message: 'partner.098',
  },
  sourcing: {
    company: 'partner.093',
    name: 'partner.094',
    country: 'partner.115',
    licence: 'partner.116',
    email: 'partner.117',
    phone: 'partner.097',
    trades: 'partner.118',
  },
  institute: {
    company: 'partner.134',
    name: 'partner.094',
    country: 'partner.115',
    email: 'partner.117',
    phone: 'partner.097',
    trades: 'partner.136',
  },
} as const;

/** The sourcing form's licence/no-fee declaration (legal — rendered verbatim). */
export const DECLARATION_ID = 'partner.114';

/** partner.140 carries `{replySlaHours}`; step 4's "Full access" pill is its `when`. */
export const PROCESS_IDS = {
  heading: 'partner.137',
  intro: 'partner.138',
  steps: [
    { n: 1, titleId: 'partner.139', bodyId: 'partner.140', whenId: null },
    { n: 2, titleId: 'partner.141', bodyId: 'partner.142', whenId: null },
    { n: 3, titleId: 'partner.143', bodyId: 'partner.144', whenId: null },
    { n: 4, titleId: 'partner.145', bodyId: 'partner.147', whenId: 'partner.146' },
  ],
} as const;

/** partner.159 is `{placed} placements` (W1). */
export const PORTAL_IDS = {
  eyebrow: 'partner.148',
  heading: 'partner.149',
  lead: 'partner.150',
  features: [
    ['partner.151', 'partner.152'],
    ['partner.153', 'partner.154'],
    ['partner.155', 'partner.156'],
    ['partner.157', 'partner.158'],
  ],
  claimLead: 'partner.159',
  claimTail: 'partner.160',
  mobileLine: 'partner.161',
  addressBar: 'partner.164',
  screenAlt: 'partner.165',
  mobileAlt: 'partner.166',
} as const;

export const FAQ_IDS = {
  eyebrow: 'partner.167',
  heading: 'partner.168',
  lead: 'partner.169',
  pairs: [
    ['partner.170', 'partner.171'],
    ['partner.172', 'partner.173'],
    ['partner.174', 'partner.175'],
    ['partner.176', 'partner.177'],
    ['partner.178', 'partner.179'],
    ['partner.180', 'partner.181'],
  ],
  askTitle: 'partner.182',
  askBody: 'partner.183',
  askWhatsApp: 'partner.184',
  askCall: 'partner.185',
  /** The ask card's e-mail row (W83 takes an id): the page's own "E-posta"/"Email" (delta 13). */
  askEmail: 'partner.117',
} as const;

/** partner.186 carries `{replySlaHours}`. */
export const CLOSING_IDS = {
  badge: 'partner.186',
  heading: 'partner.187',
  body: 'partner.188',
  primary: 'partner.189',
  legal: 'partner.190',
} as const;

/** The page record `pages.partner` names these; `generateMetadata` repeats them as fallbacks. */
export const SEO_IDS = { title: 'partner.222', description: 'partner.223' } as const;

const collect = (value: unknown, out: string[]): string[] => {
  if (typeof value === 'string') {
    if (/^partner\.\d{3}$/.test(value)) out.push(value);
  } else if (Array.isArray(value)) value.forEach((v) => collect(v, out));
  else if (value && typeof value === 'object')
    Object.values(value as Record<string, unknown>).forEach((v) => collect(v, out));
  return out;
};

/** Every package id the page resolves at render time, sorted and de-duplicated. */
export const PARTNER_PACKAGE_IDS: readonly string[] = [
  ...new Set(
    collect(
      [
        HERO_IDS,
        NETWORK_IDS,
        LOGOS_IDS,
        CHAIN_IDS,
        STICKY_IDS,
        TRACKS_IDS,
        PANEL_SHARED,
        PANEL_COPY,
        FIELD_LABELS,
        DECLARATION_ID,
        PROCESS_IDS,
        PORTAL_IDS,
        FAQ_IDS,
        CLOSING_IDS,
        SEO_IDS,
      ],
      [],
    ),
  ),
].sort();

/** `sys.partner.*` (W9/W23) — read on the server through `getTranslations('sys')`, never `t()`. */
export const PARTNER_SYS_KEYS = [
  'whatsapp.prefill',
  'faq.whatsappText',
  'faq.emailSubject',
  'logos.slot',
] as const;
