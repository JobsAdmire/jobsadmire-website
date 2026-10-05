/**
 * The Work Permit page's markup-only structures as package-id tables (docs/CONTENT-MODEL.md
 * § Collections: Phase A reads these shapes from the page's own ids — the package ships no
 * per-page JSON for them). Pure data with no runtime import, so the sections and the tests
 * share one source; `__tests__/tables.test.ts` proves every id exists in both bundles before a
 * dev-mode `makeTf` throw — or a silent '' in production — can. A sentence is split into
 * fragments only where the package itself splits it (W23); `sp()` joins them.
 */

/** One package fragment: `strong` renders in bold ink, `muted` in the tertiary grey. */
export type Frag = { id: string; strong?: boolean; muted?: boolean };

/** Hero benefit rows — bold lead + rest. `wp.030` is "{placed} permits filed": the `placed`
 *  metric through `makeTf` (W1/D17), never a typed 470. */
export const HERO_BENEFITS: readonly (readonly [string, string])[] = [
  ['wp.028', 'wp.029'],
  ['wp.030', 'wp.031'],
  ['wp.032', 'wp.033'],
];

export type ChipIcon = 'clock' | 'doc' | 'users';
/** Hero stat chips. The design's fourth ("₺100,000+ fine without a permit") has no figure id
 *  and `RateConfig` carries no fine — dropped (named delta 2; `wp.052` is unread). The third
 *  (`wp.050` + `wp.051`, "1 : 5 ratio — checked from month 7") renders as authored: W2 makes
 *  the timing counsel's question and keeps the claim out of the wizard only. */
export const HERO_CHIPS: readonly { icon: ChipIcon; strongId: string; restId: string }[] = [
  { icon: 'clock', strongId: 'wp.046', restId: 'wp.047' },
  { icon: 'doc', strongId: 'wp.048', restId: 'wp.049' },
  { icon: 'users', strongId: 'wp.050', restId: 'wp.051' },
];

/** The jump nav — every hash is an id this page renders (the page e2e checks each once). */
export const JUMP_LINKS: readonly { hash: string; labelId: string }[] = [
  { hash: '#eligibility', labelId: 'wp.057' },
  { hash: '#routes', labelId: 'wp.058' },
  { hash: '#rules', labelId: 'wp.059' },
  { hash: '#muafiyet', labelId: 'wp.060' },
  { hash: '#timeline', labelId: 'wp.061' },
  { hash: '#costs', labelId: 'wp.062' },
  { hash: '#documents', labelId: 'wp.063' },
  { hash: '#faq', labelId: 'wp.064' },
];

export type RouterKey = 'hire' | 'permitOnly' | 'partner' | 'calculator';
/** "Which one are you?" — `href` is the internal pathname; `null` is the permit-only door, the
 *  design's prefilled WhatsApp chat. */
export const ROUTER_CARDS: readonly {
  key: RouterKey;
  href: '/hire-workers' | '/partner-with-us' | '/hiring-cost-calculator' | null;
  titleId: string;
  bodyId: string;
  ctaId: string;
}[] = [
  { key: 'hire', href: '/hire-workers', titleId: 'wp.085', bodyId: 'wp.086', ctaId: 'wp.087' },
  { key: 'permitOnly', href: null, titleId: 'wp.088', bodyId: 'wp.089', ctaId: 'wp.090' },
  {
    key: 'partner',
    href: '/partner-with-us',
    titleId: 'wp.091',
    bodyId: 'wp.092',
    ctaId: 'wp.093',
  },
  {
    key: 'calculator',
    href: '/hiring-cost-calculator',
    titleId: 'wp.094',
    bodyId: 'wp.095',
    ctaId: 'wp.096',
  },
];

/** Standard permit vs e-Muafiyet: the criterion label and each side's fragments. */
export type CompareRow = { labelId: string; permit: readonly Frag[]; exempt: readonly Frag[] };
export const COMPARE_ROWS: readonly CompareRow[] = [
  {
    labelId: 'wp.110',
    permit: [{ id: 'wp.108' }, { id: 'wp.109', strong: true }],
    exempt: [{ id: 'wp.111' }, { id: 'wp.112', strong: true }],
  },
  {
    labelId: 'wp.115',
    permit: [{ id: 'wp.113', strong: true }, { id: 'wp.114' }],
    exempt: [{ id: 'wp.116', strong: true }, { id: 'wp.117' }],
  },
  {
    labelId: 'wp.120',
    permit: [{ id: 'wp.118', strong: true }, { id: 'wp.119' }],
    exempt: [{ id: 'wp.121', strong: true }, { id: 'wp.122' }],
  },
  {
    labelId: 'wp.125',
    permit: [{ id: 'wp.123' }, { id: 'wp.124', strong: true }],
    exempt: [{ id: 'wp.126' }, { id: 'wp.127', strong: true }, { id: 'wp.128' }],
  },
  {
    labelId: 'wp.132',
    permit: [{ id: 'wp.129' }, { id: 'wp.130', strong: true }, { id: 'wp.131' }],
    exempt: [{ id: 'wp.133' }, { id: 'wp.130', strong: true }, { id: 'wp.134' }],
  },
];

/** The featured fixed-term ("Süreli") card's three bullets. */
export const FIXED_TERM_BULLETS: readonly (readonly Frag[])[] = [
  [{ id: 'wp.167' }, { id: 'wp.168', strong: true }, { id: 'wp.169' }],
  [{ id: 'wp.170' }, { id: 'wp.130', strong: true }, { id: 'wp.171' }],
  [{ id: 'wp.172' }, { id: 'wp.173', strong: true }, { id: 'wp.174' }],
];
/** "Other types — special cases only": name + rest. */
export const OTHER_PERMIT_TYPES: readonly (readonly [string, string])[] = [
  ['wp.176', 'wp.177'],
  ['wp.178', 'wp.179'],
  ['wp.180', 'wp.181'],
  ['wp.182', 'wp.183'],
];

/** "Working without a permit costs" — legal-flagged lines, rendered verbatim (WP-C). */
export const PENALTY_IDS: readonly string[] = ['wp.196', 'wp.197', 'wp.198', 'wp.199'];
/** "What the Ministry checks before approving" — six numbered rules (`wp.194` says "all six"). */
export const RULES: readonly { titleId: string; bodyId: string }[] = [
  { titleId: 'wp.200', bodyId: 'wp.201' },
  { titleId: 'wp.202', bodyId: 'wp.203' },
  { titleId: 'wp.204', bodyId: 'wp.205' },
  { titleId: 'wp.206', bodyId: 'wp.207' },
  { titleId: 'wp.208', bodyId: 'wp.209' },
  { titleId: 'wp.210', bodyId: 'wp.211' },
];

export type ExemptionIcon = 'wrench' | 'globe' | 'leaf' | 'award' | 'package';
/** Article-48 categories: duration badge, title, body. */
export const EXEMPTION_CARDS: readonly {
  icon: ExemptionIcon;
  badgeId: string;
  titleId: string;
  bodyId: string;
}[] = [
  { icon: 'wrench', badgeId: 'wp.219', titleId: 'wp.220', bodyId: 'wp.221' },
  { icon: 'globe', badgeId: 'wp.219', titleId: 'wp.222', bodyId: 'wp.223' },
  { icon: 'leaf', badgeId: 'wp.224', titleId: 'wp.225', bodyId: 'wp.226' },
  { icon: 'award', badgeId: 'wp.227', titleId: 'wp.228', bodyId: 'wp.229' },
  { icon: 'package', badgeId: 'wp.219', titleId: 'wp.230', bodyId: 'wp.231' },
];
/** Deadline / Fees / Rights / Cooldown. */
export const EXEMPTION_FACTS: readonly { labelId: string; strongId: string; restId: string }[] = [
  { labelId: 'wp.234', strongId: 'wp.235', restId: 'wp.236' },
  { labelId: 'wp.237', strongId: 'wp.238', restId: 'wp.239' },
  { labelId: 'wp.240', strongId: 'wp.241', restId: 'wp.242' },
  { labelId: 'wp.243', strongId: 'wp.244', restId: 'wp.245' },
];

export type StepIcon = 'doc' | 'pie' | 'file' | 'check';
/** "How we get a permit approved" — the last step carries the "SGK day one" badge. */
export const PROCESS_STEPS: readonly {
  icon: StepIcon;
  titleId: string;
  bodyId: string;
  badgeId?: string;
}[] = [
  { icon: 'doc', titleId: 'wp.248', bodyId: 'wp.249' },
  { icon: 'pie', titleId: 'wp.250', bodyId: 'wp.251' },
  { icon: 'file', titleId: 'wp.252', bodyId: 'wp.253' },
  { icon: 'check', titleId: 'wp.254', bodyId: 'wp.256', badgeId: 'wp.255' },
];

/** The two timing cards. `wp.264`/`wp.274` carry `{firstDayWeeks}`/`{firstDayWeeksInCountry}` —
 *  the metrics through `makeTf` (W1/D17). The design's tab labels (`wp.261`/`262`) label the
 *  ≤ 700 px tab switcher; from 701 px both cards show side by side. */
export type TimelineCard = {
  key: 'abroad' | 'here';
  titleId: string;
  durationId: string;
  rows: readonly (readonly [string, string])[];
  noteId: string | null;
};
export const TIMELINE_CARDS: readonly TimelineCard[] = [
  {
    key: 'abroad',
    titleId: 'wp.263',
    durationId: 'wp.264',
    rows: [
      ['wp.265', 'wp.266'],
      ['wp.267', 'wp.268'],
      ['wp.269', 'wp.270'],
      ['wp.271', 'wp.272'],
    ],
    noteId: null,
  },
  {
    key: 'here',
    titleId: 'wp.273',
    durationId: 'wp.274',
    rows: [
      ['wp.265', 'wp.275'],
      ['wp.276', 'wp.277'],
      ['wp.278', 'wp.279'],
    ],
    noteId: 'wp.280',
  },
];

/** Three cost lines and, by design, no amounts (`wp.282`/`wp.295` — quoted in writing). */
export const COST_CARDS: readonly {
  eyebrowId: string;
  titleId: string;
  body: readonly Frag[];
  ours: boolean;
}[] = [
  {
    eyebrowId: 'wp.283',
    titleId: 'wp.284',
    body: [{ id: 'wp.285' }, { id: 'wp.286', muted: true }, { id: 'wp.287' }],
    ours: false,
  },
  {
    eyebrowId: 'wp.288',
    titleId: 'wp.289',
    body: [{ id: 'wp.290' }, { id: 'wp.291', muted: true }, { id: 'wp.292' }],
    ours: false,
  },
  { eyebrowId: 'wp.293', titleId: 'wp.294', body: [{ id: 'wp.295' }], ours: true },
];

export type DocList = {
  key: 'employer' | 'worker';
  titleId: string;
  items: readonly { id: string; noteId?: string }[];
};
/** Each list's count badge is computed from `items.length` (`sys.wp.documents.count`), never
 *  `wp.300`'s typed "6 docs". */
export const DOC_LISTS: readonly DocList[] = [
  {
    key: 'employer',
    titleId: 'wp.299',
    items: [
      { id: 'wp.301', noteId: 'wp.302' },
      { id: 'wp.303', noteId: 'wp.304' },
      { id: 'wp.305' },
      { id: 'wp.306' },
      { id: 'wp.307', noteId: 'wp.308' },
      { id: 'wp.309', noteId: 'wp.310' },
    ],
  },
  {
    key: 'worker',
    titleId: 'wp.311',
    items: [
      { id: 'wp.312' },
      { id: 'wp.313' },
      { id: 'wp.314' },
      { id: 'wp.315' },
      { id: 'wp.316' },
      { id: 'wp.317' },
    ],
  },
];

/** FAQ pairs in design order. `aId: null` — the design's e-Muafiyet answer was never
 *  catalogued; it lives in `sys.wp.faq.exemptionAnswer` (W9; on the WP-C legal sheet). */
export const FAQ_PAIRS: readonly { id: string; qId: string; aId: string | null }[] = [
  { id: 'q1', qId: 'wp.334', aId: 'wp.335' },
  { id: 'q2', qId: 'wp.336', aId: 'wp.337' },
  { id: 'q3', qId: 'wp.338', aId: 'wp.339' },
  { id: 'q4', qId: 'wp.340', aId: null },
  { id: 'q5', qId: 'wp.341', aId: 'wp.342' },
  { id: 'q6', qId: 'wp.343', aId: 'wp.344' },
  { id: 'q7', qId: 'wp.345', aId: 'wp.346' },
  { id: 'q8', qId: 'wp.347', aId: 'wp.348' },
  { id: 'q9', qId: 'wp.349', aId: 'wp.350' },
];
