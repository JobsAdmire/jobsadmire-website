import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { runInNewContext } from 'node:vm';
import { z } from 'zod';
import { BundleSchema, type Bundle, type NavItem } from '../contract/website-bundle.v1';
import {
  BLOG_NAV_THRESHOLD,
  CollectionSchemas,
  METRIC_KEYS,
  PAGE_KEYS,
  type BlogCategory,
  type BlogPost,
  type CalculatorRole,
  type CollectionKey,
  type Country,
  type Metric,
  type MetricKey,
  type Office,
  type PageKey,
  type RateConfig,
  type Sector,
  type SourceCountry,
} from '../src/content/collections';
import { findHardTypedMetrics, parseMetricLiteral } from '../src/content/lint';

const ROOT = join(__dirname, '..');
const PKG = join(ROOT, 'design-package', 'strings');
const DESIGN = join(ROOT, 'design-package', 'design');
const OUT = join(ROOT, 'src', 'content', 'local');

type Locale = 'tr' | 'en';
const LOCALES: readonly Locale[] = ['en', 'tr'];
type PageSeo = Bundle['pages'][string];

type Row = {
  id: string;
  en: string;
  tr: string;
  k?: string;
  sec?: string;
  rev: string;
  legal?: boolean;
};
type PageFile = { page: string; route: string; strings: Row[] };

type Edit = 'override' | 'turkiye' | 'placeholder';
export type CatalogueRow = {
  page: string;
  sec: string;
  legal: boolean;
  rev: string;
  k?: string;
  /** the package's own rev, kept when the importer changed the English (`rev` is then recomputed) */
  packageRev?: string;
  edits?: Edit[];
};
export type ImportReport = {
  overrides: Array<{ id: string; locale: Locale; before: string; after: string; reason: string }>;
  turkiye: number;
  placeholders: Array<{ id: string; key: MetricKey; en: string; tr: string }>;
  blog: { rows: number; trBodies: number; navVisible: boolean };
};

const PAGE_FILES = [
  'homepage',
  'hireworkers',
  'calculator',
  'partner',
  'workpermit',
  'about',
  'verify',
  'jointeam',
  'contact',
  'availworkers',
  'success',
  'blog',
  'blogarticle',
  'crmlogin',
  'terms',
];

const decode = (s: string) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&middot;/g, '·')
    .replace(/&nbsp;/g, ' ');

/** The package's `rev`: djb2 over the English source, base-36 (docs/translation-process.md). */
export function rev(en: string): string {
  let h = 5381;
  for (const c of en) h = ((h * 33) ^ c.charCodeAt(0)) >>> 0;
  return h.toString(36);
}

/** README "Contact constants" + "Nav item order" — hand-typed data, section 1 of 2. */
const SETTINGS = {
  siteUrl: 'https://www.jobsadmire.com',
  phone: '+905011240340',
  phoneDisplay: '+90 501 124 03 40',
  partnershipsPhone: '+905533832549',
  email: 'info@jobsadmire.com',
  careersEmail: 'careers@jobsadmire.com',
  whatsappNumber: '905011240340',
  telegramUrl: 'https://t.me/jobsadmire',
  social: {
    instagram: 'https://instagram.com/jobsadmire',
    tiktok: 'https://tiktok.com/@jobsadmire',
    linkedin: 'https://linkedin.com/company/jobsadmire',
    facebook: 'https://facebook.com/jobsadmire',
  },
  licence: { permitNo: '1730', lawRef: '4904', taxNo: '48422122' },
  storeLinks: {
    android: 'https://play.google.com/store/apps/details?id=com.jobsadmire.portal',
    ios: null,
  },
  portal: {
    loginPath: '/auth/login',
    forgotPath: '/auth/forgot-password',
    host: 'https://portal.jobsadmire.com',
  },
  maps: {
    antalya:
      'https://www.google.com/maps/search/?api=1&query=Adnan+Menderes+Blv.+No+7%2F6+Muratpa%C5%9Fa+Antalya',
    karachi: 'https://www.google.com/maps/search/?api=1&query=Shahrah-e-Faisal+Karachi',
  },
  analytics: { ga4Id: null, gtmId: null, adsId: null, adsConversionLabel: null, consentMode: true },
  turnstileSiteKey: null,
} as const;

// ---------------------------------------------------------------------------------------------
// Hand-typed data, section 2 of 2: nav groups, metrics (W1), rate config + roles (W2), source
// countries (W1: source-map.js + Sri Lanka), offices (W7: Karachi = sourcing), sectors, pages,
// the one article body (W28). Every labelId below is a package id the strings already carry —
// never an invented one (W9); the importer refuses any *Id that is not in the catalogue.
// ---------------------------------------------------------------------------------------------

type NavRow = { href: string; labelId: string; external?: boolean; blog?: boolean };
const PORTAL_LOGIN = `${SETTINGS.portal.host}${SETTINGS.portal.loginPath}`;
// desktop nav in README order; labels are the Homepage nav ids (home.001..011)
const DESKTOP: NavRow[] = [
  { href: '/hire-workers', labelId: 'home.002' },
  { href: '/available-workers', labelId: 'home.003' },
  { href: '/work-permit', labelId: 'home.004' },
  { href: '/hiring-cost-calculator', labelId: 'home.005' },
  { href: '/about', labelId: 'home.001' },
  { href: '/success-stories', labelId: 'home.006' },
  { href: '/blog', labelId: 'home.010', blog: true },
  { href: '/verify', labelId: 'home.011' },
  { href: '/partner-with-us', labelId: 'home.008' },
  { href: '/careers', labelId: 'home.009' },
  { href: '/contact', labelId: 'home.007' },
];
/**
 * All nine schema groups. The four empty ones are settings-driven, not route lists (R15):
 * slimBarLeft = licence chip + phone + e-mail, footerContact = phone/e-mail/Telegram + the
 * `offices` collection, mobileBottomBar = tel: + wa.me from settings, socialRail = settings.social.
 * The portal login row (home.012, external) lives here and nowhere else (W36). Rows flagged
 * `blog` are emitted only once the blog nav threshold is met (W4).
 */
const NAV_GROUPS: Record<NavItem['group'], NavRow[]> = {
  desktopNav: DESKTOP,
  hamburger: [...DESKTOP, { href: PORTAL_LOGIN, labelId: 'home.012', external: true }],
  slimBarLeft: [],
  slimBarRight: [
    { href: '/blog', labelId: 'home.013', blog: true },
    { href: '/careers', labelId: 'home.009' },
    { href: '/verify', labelId: 'home.011' },
    { href: PORTAL_LOGIN, labelId: 'home.012', external: true },
  ],
  footerEmployers: [
    { href: '/hire-workers', labelId: 'home.002' },
    { href: '/available-workers', labelId: 'home.003' },
    { href: '/hiring-cost-calculator', labelId: 'home.005' },
    { href: '/work-permit', labelId: 'home.004' },
    { href: '/verify', labelId: 'home.011' },
    { href: PORTAL_LOGIN, labelId: 'home.012', external: true },
  ],
  footerCompany: [
    { href: '/about', labelId: 'home.001' },
    { href: '/success-stories', labelId: 'home.006' },
    { href: '/blog', labelId: 'home.013', blog: true },
    { href: '/partner-with-us', labelId: 'home.008' },
    { href: '/careers', labelId: 'home.009' },
    { href: '/contact', labelId: 'home.007' },
  ],
  footerContact: [],
  mobileBottomBar: [],
  socialRail: [],
};

export function buildNav(blogVisible: boolean): NavItem[] {
  const out: NavItem[] = [];
  for (const [group, rows] of Object.entries(NAV_GROUPS) as [NavItem['group'], NavRow[]][])
    rows
      .filter((r) => blogVisible || !r.blog)
      .forEach((r, order) =>
        out.push({
          group,
          order,
          labelId: r.labelId,
          href: r.href,
          external: r.external === true,
          visibleOn: ['desktop', 'mobile'],
        }),
      );
  return out;
}

/** W1 (spec §10 row 2 auto-defaults). `sectors` is filled from the sectors table below. */
const METRIC_TABLE: Record<Exclude<MetricKey, 'sectors'>, Omit<Metric, 'key'>> = {
  placed: { value: 470, text: null, suffix: '+', labelId: 'home.050', unitId: null },
  employers: { value: 22, text: null, suffix: '+', labelId: 'hire.073', unitId: null },
  countries: { value: 13, text: null, suffix: '', labelId: 'home.051', unitId: null },
  permitDays: { value: 45, text: null, suffix: '', labelId: 'home.052', unitId: 'home.206' },
  firstDayWeeks: { value: null, text: '6–8', suffix: '', labelId: 'home.117', unitId: null },
  firstDayWeeksInCountry: { value: null, text: '4–6', suffix: '', labelId: null, unitId: null },
  replySlaHours: { value: 4, text: null, suffix: '', labelId: null, unitId: null },
  homepageReplyHours: { value: 24, text: null, suffix: '', labelId: null, unitId: null },
};

/** W2 — the one calculator model; figures from the design's page script (Hiring Cost
 *  Calculator.dc.html lines 1730–1733, 2590–2592). Owner sign-off §10 row 7 auto-defaulted;
 *  review every January. Task 9's engine is the only consumer of the arithmetic. */
const RATE_CONFIG: RateConfig = {
  version: '2026-01',
  effectiveFrom: '2026-01-01',
  reviewDueAt: '2026-12-20',
  updatedAt: '2026-01-15',
  currency: 'TRY',
  legalMinGross: 33030,
  sgkEmployerRate: 0.2175,
  sgkRates: { manufacturing: 0.1875, other: 0.2175, none: 0.2375 },
  supportMonthly: 1270,
  permitFeeTRY: 16000,
  flightTRY: 12000,
  housingMonthlyTRY: 5000,
  quotaRatio: 5,
};

type Industry = NonNullable<CalculatorRole['industry']>;
const INDUSTRY_LABEL: Record<Industry, string> = {
  factory: 'calc.551',
  construction: 'calc.554',
  hotel: 'calc.552',
  agriculture: 'calc.553',
};
/** The calculator page's `roles()` table (design lines 1835–1846), verified by the importer
 *  test against the HTML. Labels: calc.541–548/555 where the page has one, else the Hire
 *  Workers chip with the same English (hire.093 CNC, hire.107 Waiter, hire.112 Greenhouse). */
const ROLE_TABLE: Array<[string, string, Industry, number, number, number]> = [
  ['welder', 'calc.555', 'factory', 45000, 70000, 1.5],
  ['cnc', 'hire.093', 'factory', 45000, 65000, 1.5],
  ['machine', 'calc.544', 'factory', 38000, 52000, 1],
  ['textile', 'calc.541', 'factory', 36000, 50000, 1],
  ['electrician', 'calc.545', 'construction', 45000, 62000, 1.5],
  ['plumber', 'calc.546', 'construction', 42000, 58000, 1.5],
  ['labourer', 'calc.542', 'construction', 33030, 44000, 1],
  ['cook', 'calc.548', 'hotel', 50000, 78000, 1.5],
  ['waiter', 'hire.107', 'hotel', 35000, 48000, 1],
  ['housekeeping', 'calc.547', 'hotel', 33030, 44000, 1],
  ['steward', 'calc.543', 'hotel', 33030, 45000, 1],
  ['greenhouse', 'hire.112', 'agriculture', 33030, 42000, 1],
];
const groupOf = (multiplier: number): CalculatorRole['group'] =>
  multiplier >= 2 ? 'specialist' : multiplier >= 1.5 ? 'skilled' : 'general';
const ROLES: CalculatorRole[] = [
  ...ROLE_TABLE.map(([key, labelId, industry, salaryMin, salaryMax, multiplier]) => ({
    key,
    labelId,
    multiplier,
    group: groupOf(multiplier),
    preset: false,
    industry,
    industryLabelId: INDUSTRY_LABEL[industry],
    salaryMin,
    salaryMax,
  })),
  // W2: the homepage teaser's three named presets, from the same table (home.240–242)
  ...(
    [
      ['generalPreset', 'home.240', 1],
      ['skilledPreset', 'home.241', 1.5],
      ['specialistPreset', 'home.242', 2],
    ] as Array<[string, string, number]>
  ).map(([key, labelId, multiplier]) => ({
    key,
    labelId,
    multiplier,
    group: groupOf(multiplier),
    preset: true,
    industry: null,
    industryLabelId: null,
    salaryMin: null,
    salaryMax: null,
  })),
];

/** source-map.js name → ISO2 + package name id (jt.289–301 / verify.262); Senegal has no id,
 *  its name comes from scripts/data/countries.json like every dial code (W25). */
const COUNTRY_TABLE: Record<string, { code: string; nameId: string | null }> = {
  Pakistan: { code: 'PK', nameId: 'jt.290' },
  Nepal: { code: 'NP', nameId: 'jt.292' },
  India: { code: 'IN', nameId: 'jt.291' },
  Uzbekistan: { code: 'UZ', nameId: 'jt.289' },
  Kyrgyzstan: { code: 'KG', nameId: 'jt.294' },
  Turkmenistan: { code: 'TM', nameId: 'jt.295' },
  Philippines: { code: 'PH', nameId: 'jt.301' },
  Indonesia: { code: 'ID', nameId: 'jt.300' },
  Russia: { code: 'RU', nameId: 'jt.293' },
  Mali: { code: 'ML', nameId: 'jt.297' },
  Senegal: { code: 'SN', nameId: null },
  Cameroon: { code: 'CM', nameId: 'jt.296' },
  'Sri Lanka': { code: 'LK', nameId: 'verify.262' },
};
/** W1: the 13th source country; source-map.js has no coordinates for it. */
const SRI_LANKA = { name: 'Sri Lanka', lon: 80.7, lat: 7.9 };

const emojiFlag = (code: string) =>
  String.fromCodePoint(...[...code].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));

/** Contact page office cards (contact.096–108, footer rows home.196/197). One number, one
 *  inbox for both — the package carries no Karachi-specific contact. `hours.days` are JS
 *  getDay() numbers, 0 = Sunday (W43). */
const OFFICES: Office[] = [
  {
    key: 'antalya',
    kind: 'hq',
    cityId: 'contact.096',
    labelId: 'contact.099',
    addressId: 'contact.133',
    addressLine2Id: 'contact.134',
    hoursId: 'contact.100',
    footerLabelId: 'home.196',
    phone: SETTINGS.phone,
    whatsapp: SETTINGS.whatsappNumber,
    email: SETTINGS.email,
    hours: { tz: 'Europe/Istanbul', days: [1, 2, 3, 4, 5], open: '09:00', close: '18:00' },
    mapUrl: SETTINGS.maps.antalya,
  },
  {
    key: 'karachi',
    kind: 'sourcing',
    cityId: 'contact.097',
    labelId: 'contact.104',
    addressId: 'contact.105',
    addressLine2Id: 'contact.103',
    hoursId: 'contact.106',
    footerLabelId: 'home.197',
    phone: SETTINGS.phone,
    whatsapp: SETTINGS.whatsappNumber,
    email: SETTINGS.email,
    hours: { tz: 'Asia/Karachi', days: [1, 2, 3, 4, 5, 6], open: '10:00', close: '19:00' },
    mapUrl: SETTINGS.maps.karachi,
  },
];

/** Hire Workers industries (hire.076–082, subtitles hire.083–088). Keys are the stable
 *  option values every form sends (W3); 'other' has no subtitle and is not a served sector. */
const SECTORS: Sector[] = [
  { key: 'factory', labelId: 'hire.076', subtitleId: 'hire.083', icon: 'factory' },
  { key: 'construction', labelId: 'hire.077', subtitleId: 'hire.084', icon: 'construction' },
  { key: 'tourism', labelId: 'hire.078', subtitleId: 'hire.085', icon: 'tourism' },
  { key: 'agriculture', labelId: 'hire.079', subtitleId: 'hire.086', icon: 'agriculture' },
  { key: 'textile', labelId: 'hire.080', subtitleId: 'hire.087', icon: 'textile' },
  { key: 'logistics', labelId: 'hire.081', subtitleId: 'hire.088', icon: 'logistics' },
  { key: 'other', labelId: 'hire.082', subtitleId: null, icon: 'other' },
];

/** blog-posts.js categories → stable keys + the homepage's category label ids. */
const BLOG_CATEGORY: Record<string, BlogCategory> = {
  'Work Permits': 'workPermits',
  'İş İzinleri': 'workPermits',
  Recruitment: 'recruitment',
  'İşe Alım': 'recruitment',
  Compliance: 'compliance',
  Mevzuat: 'compliance',
  'Market News': 'marketNews',
  'Piyasa Haberleri': 'marketNews',
};
const BLOG_CATEGORY_LABEL: Record<BlogCategory, string> = {
  workPermits: 'home.263',
  recruitment: 'home.265',
  compliance: 'home.264',
  marketNews: 'home.262',
};
/** TR slug → the EN article it translates (blog-posts.js carries no link between them). */
const BLOG_TRANSLATIONS: Record<string, string> = {
  'yabanci-isciler-calisma-izni-rehberi': 'turkey-work-permit-process-employer-guide',
  'pakistandan-isci-istihdami': 'hiring-from-pakistan-turkish-employers',
  'iskur-ozel-istihdam-burolari-kurallari': 'iskur-rules-private-employment-agencies',
  'turkiye-de-isgucu-acigi': 'turkey-labor-shortage-factories-hiring-overseas',
};

/**
 * W28: the one written article. blog-posts.js carries no body text — the body lives in the
 * Blog Article design page as package ids (blogarticle.025–063), so it is composed here into
 * Markdown from those ids (W9: no minted ids; the strings stay in the catalogue with their
 * rev). Structure follows the design: intro, "Key takeaways" callout, H2 sections, the two
 * stat cards, document list, numbered steps, warning list, closing quote. The FAQ block
 * (blogarticle.065/124–132), author box and CTAs are page chrome, not body.
 */
type BodyBlock =
  | { kind: 'p'; id: string }
  | { kind: 'h2'; id: string }
  | { kind: 'fragments'; ids: string[]; bold: string }
  | { kind: 'callout'; titleId: string; itemIds: string[] }
  | { kind: 'leads'; pairs: Array<[string, string]> }
  | { kind: 'ul'; ids: string[] }
  | { kind: 'ol'; pairs: Array<[string, string]> }
  | { kind: 'quote'; id: string };
const ba = (n: number) => `blogarticle.${String(n).padStart(3, '0')}`;
const ARTICLE_BODY: Record<string, BodyBlock[]> = {
  'turkey-work-permit-process-employer-guide': [
    { kind: 'p', id: ba(25) },
    { kind: 'callout', titleId: ba(26), itemIds: [ba(27), ba(28), ba(29), ba(30)] },
    { kind: 'h2', id: ba(31) },
    { kind: 'fragments', ids: [ba(32), ba(33), ba(34)], bold: ba(33) },
    {
      kind: 'leads',
      pairs: [
        [ba(35), ba(36)],
        [ba(37), ba(38)],
      ],
    },
    { kind: 'p', id: ba(39) },
    { kind: 'h2', id: ba(40) },
    { kind: 'ul', ids: [ba(41), ba(42), ba(43), ba(44), ba(45), ba(46)] },
    { kind: 'h2', id: ba(47) },
    {
      kind: 'ol',
      pairs: [
        [ba(48), ba(49)],
        [ba(50), ba(51)],
        [ba(52), ba(53)],
        [ba(54), ba(55)],
        [ba(56), ba(57)],
      ],
    },
    { kind: 'h2', id: ba(58) },
    { kind: 'ul', ids: [ba(59), ba(60), ba(61), ba(62)] },
    { kind: 'quote', id: ba(63) },
  ],
};
/** Package fragments joined into one sentence: a space between fragments unless the next one
 *  starts with punctuation (EN `employer` + `, not the worker`; TR `işveren` + `yapar`). */
const joinFragments = (parts: string[]) =>
  parts.reduce((acc, p) => (acc === '' || /^[,.;:!?)]/.test(p) ? `${acc}${p}` : `${acc} ${p}`), '');
function renderBody(blocks: BodyBlock[], t: (id: string) => string): string {
  const out: string[] = [];
  for (const b of blocks) {
    switch (b.kind) {
      case 'p':
        out.push(t(b.id));
        break;
      case 'h2':
        out.push(`## ${t(b.id)}`);
        break;
      case 'fragments':
        out.push(joinFragments(b.ids.map((id) => (id === b.bold ? `**${t(id)}**` : t(id)))));
        break;
      case 'callout':
        out.push(
          [`> **${t(b.titleId)}**`, '>', ...b.itemIds.map((id) => `> - ${t(id)}`)].join('\n'),
        );
        break;
      case 'leads':
        out.push(b.pairs.map(([a, c]) => `**${t(a)}** — ${t(c)}`).join('\n\n'));
        break;
      case 'ul':
        out.push(b.ids.map((id) => `- ${t(id)}`).join('\n'));
        break;
      case 'ol':
        out.push(b.pairs.map(([a, c], i) => `${i + 1}. **${t(a)}** ${t(c)}`).join('\n'));
        break;
      case 'quote':
        out.push(`> ${t(b.id)}`);
        break;
    }
  }
  return out.join('\n\n');
}

/** Package SEO ids exist only for Hire Workers and Partner; '' = "no package string", the page
 *  passes its `sys.seo.<pageKey>.*` copy as the buildMetadata fallback (W23/W38). Robots per W4/W8. */
const PAGE_TABLE: Record<
  PageKey,
  Pick<PageSeo, 'titleId' | 'descriptionId' | 'robots' | 'jsonLd'>
> = {
  home: {
    titleId: '',
    descriptionId: '',
    robots: 'index',
    jsonLd: ['organization', 'website', 'faq'],
  },
  hire: {
    titleId: 'hire.264',
    descriptionId: 'hire.265',
    robots: 'index',
    jsonLd: ['breadcrumb', 'faq'],
  },
  calc: { titleId: '', descriptionId: '', robots: 'index', jsonLd: ['breadcrumb', 'faq'] },
  wp: { titleId: '', descriptionId: '', robots: 'index', jsonLd: ['breadcrumb', 'faq'] },
  partner: {
    titleId: 'partner.222',
    descriptionId: 'partner.223',
    robots: 'index',
    jsonLd: ['breadcrumb', 'faq'],
  },
  about: { titleId: '', descriptionId: '', robots: 'index', jsonLd: ['breadcrumb'] },
  contact: { titleId: '', descriptionId: '', robots: 'index', jsonLd: ['breadcrumb', 'faq'] },
  workers: { titleId: '', descriptionId: '', robots: 'index', jsonLd: ['breadcrumb', 'faq'] },
  stories: { titleId: '', descriptionId: '', robots: 'index', jsonLd: ['breadcrumb'] },
  verify: { titleId: '', descriptionId: '', robots: 'index', jsonLd: ['breadcrumb', 'faq'] },
  careers: { titleId: '', descriptionId: '', robots: 'index', jsonLd: ['breadcrumb', 'faq'] },
  careersDetail: {
    titleId: '',
    descriptionId: '',
    robots: 'index',
    jsonLd: ['breadcrumb', 'jobPosting'],
  },
  blog: { titleId: '', descriptionId: '', robots: 'noindex', jsonLd: ['breadcrumb'] },
  blogArticle: {
    titleId: '',
    descriptionId: '',
    robots: 'noindex',
    jsonLd: ['breadcrumb', 'article', 'faq'],
  },
  portal: { titleId: '', descriptionId: '', robots: 'noindex', jsonLd: [] },
  privacy: { titleId: '', descriptionId: '', robots: 'index', jsonLd: ['breadcrumb'] },
  terms: { titleId: '', descriptionId: '', robots: 'index', jsonLd: ['breadcrumb'] },
  kvkk: { titleId: '', descriptionId: '', robots: 'index', jsonLd: ['breadcrumb'] },
  cookiePolicy: { titleId: '', descriptionId: '', robots: 'index', jsonLd: ['breadcrumb'] },
  thankYou: { titleId: '', descriptionId: '', robots: 'noindex', jsonLd: [] },
  newsletterConfirm: { titleId: '', descriptionId: '', robots: 'noindex', jsonLd: [] },
  newsletterUnsubscribe: { titleId: '', descriptionId: '', robots: 'noindex', jsonLd: [] },
};

// ---------------------------------------------------------------------------------------------
// Input files under scripts/ (Prettier-formatted, reviewed by hand)
// ---------------------------------------------------------------------------------------------

const isMetricKey = (k: string): k is MetricKey => (METRIC_KEYS as readonly string[]).includes(k);
const metricLiteral = z
  .string()
  .min(1)
  .refine(
    (l) => {
      try {
        parseMetricLiteral(l);
        return true;
      } catch {
        return false;
      }
    },
    { message: 'one [value] span, nothing else' },
  );
const OverridesSchema = z.record(
  z.string(),
  z
    .object({
      en: z.string().min(1).optional(),
      tr: z.string().min(1).optional(),
      reason: z.string().min(1),
    })
    .refine((o) => o.en !== undefined || o.tr !== undefined, { message: 'needs en or tr' }),
);
const PlaceholdersSchema = z.object({
  // a plain string-keyed record (not z.enum keys) so the type stays `Record<string, string[]>`,
  // which is what `findHardTypedMetrics` takes; the refine keeps the keys honest
  literals: z
    .record(z.string(), z.array(metricLiteral).min(1))
    .refine((o) => Object.keys(o).every(isMetricKey), {
      message: 'keys must be METRIC_KEYS entries',
    }),
  strings: z.record(
    z.string(),
    z
      .array(
        z.object({
          key: z.enum(METRIC_KEYS),
          en: metricLiteral.optional(),
          tr: metricLiteral.optional(),
        }),
      )
      .min(1),
  ),
});
const BaselineSchema = z.record(z.string(), z.string().min(1));
const CountriesFileSchema = z
  .array(
    z.object({
      code: z.string().regex(/^[A-Z]{2}$/),
      en: z.string().min(1),
      tr: z.string().min(1),
      dial: z.string().regex(/^\+\d{1,4}$/),
    }),
  )
  .min(1);
const readJson = (...rel: string[]): unknown =>
  JSON.parse(readFileSync(join(__dirname, ...rel), 'utf8'));

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Replace exactly one occurrence of a metric literal's [value] span with `{key}`; anything
 *  else is an error the maintainer resolves in metric-placeholders.json (pin `en`/`tr`, or fix
 *  the copy). Longest literal first so "13+ countries" wins over "13 countries". */
function reauthor(
  id: string,
  locale: Locale,
  value: string,
  key: MetricKey,
  pinned: string | undefined,
  literals: readonly string[],
): { value: string; literal: string } {
  const candidates = (pinned ? [pinned] : [...literals])
    .map(parseMetricLiteral)
    .sort((a, b) => b.text.length - a.text.length);
  const hit = candidates.find((l) => new RegExp(escapeRegExp(l.text), 'i').test(value));
  if (!hit)
    throw new Error(
      `metric-placeholders.json: ${id} (${locale}) carries no "${key}" literal to replace`,
    );
  const re = new RegExp(
    `(${escapeRegExp(hit.pre)})(${escapeRegExp(hit.span)})(${escapeRegExp(hit.post)})`,
    'gi',
  );
  const count = value.match(re)?.length ?? 0;
  if (count !== 1)
    throw new Error(
      `metric-placeholders.json: ${id} (${locale}) contains "${hit.text}" ${count} times — pin the literal`,
    );
  return { value: value.replace(re, `$1{${key}}$3`), literal: hit.text };
}

// ---------------------------------------------------------------------------------------------
// Design runtime files (read, never imported by src/**)
// ---------------------------------------------------------------------------------------------

const DesignPostSchema = z.object({
  slug: z.string().min(1),
  lang: z.enum(['en', 'tr']),
  cat: z.string().min(1),
  title: z.string().min(1),
  excerpt: z.string().min(1),
  date: z.string().min(1),
  read: z.string().min(1),
  full: z.boolean().optional(),
});
/** blog-posts.js is an IIFE that writes `window.JA_BLOG_POSTS`; run it in a sandbox. */
function loadBlogPosts() {
  const sandbox: { window: Record<string, unknown> } = { window: {} };
  runInNewContext(readFileSync(join(DESIGN, 'blog-posts.js'), 'utf8'), sandbox);
  return z.array(DesignPostSchema).parse(sandbox.window.JA_BLOG_POSTS);
}

const MONTHS_EN = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december',
];
const MONTHS_TR = [
  'ocak',
  'şubat',
  'mart',
  'nisan',
  'mayıs',
  'haziran',
  'temmuz',
  'ağustos',
  'eylül',
  'ekim',
  'kasım',
  'aralık',
];
/** "June 12, 2026" | "May 2026" | "Haziran 2026" → YYYY-MM-DD (day 01 when the card has none). */
function isoDate(label: string): string {
  const m = label
    .trim()
    .toLowerCase()
    .match(/^([a-zçğıöşü]+)\s+(?:(\d{1,2}),\s+)?(\d{4})$/);
  if (!m) throw new Error(`blog-posts.js: unparseable date "${label}"`);
  const month = MONTHS_EN.indexOf(m[1]) >= 0 ? MONTHS_EN.indexOf(m[1]) : MONTHS_TR.indexOf(m[1]);
  if (month < 0) throw new Error(`blog-posts.js: unknown month in "${label}"`);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${m[3]}-${pad(month + 1)}-${pad(m[2] ? Number(m[2]) : 1)}`;
}
function readMinutes(label: string): number {
  const m = label.match(/^(\d+)\s/);
  if (!m) throw new Error(`blog-posts.js: unparseable read time "${label}"`);
  return Number(m[1]);
}

function buildBlog(strings: Record<Locale, Record<string, string>>): BlogPost[] {
  const posts = loadBlogPosts();
  const rows = new Map<string, BlogPost>();
  for (const p of posts.filter((p) => p.lang === 'en')) {
    const category = BLOG_CATEGORY[p.cat];
    if (!category) throw new Error(`blog-posts.js: unknown category "${p.cat}"`);
    rows.set(p.slug, {
      key: p.slug,
      slug: { en: p.slug, tr: null },
      title: { en: p.title, tr: null },
      excerpt: { en: p.excerpt, tr: null },
      category,
      categoryLabelId: BLOG_CATEGORY_LABEL[category],
      author: 'JobsAdmire',
      publishedAt: isoDate(p.date),
      readMinutes: readMinutes(p.read),
      hasBody: { en: p.full === true, tr: false },
      body: { en: null, tr: null },
    });
  }
  for (const p of posts.filter((p) => p.lang === 'tr')) {
    const row = rows.get(BLOG_TRANSLATIONS[p.slug] ?? '');
    if (!row)
      throw new Error(`blog-posts.js: TR post "${p.slug}" has no entry in BLOG_TRANSLATIONS`);
    // blog-posts.js is the canonical index (W4): a TR card must agree with its EN source
    if (
      isoDate(p.date).slice(0, 7) !== row.publishedAt.slice(0, 7) ||
      readMinutes(p.read) !== row.readMinutes
    )
      throw new Error(
        `blog-posts.js: TR post "${p.slug}" disagrees with "${row.key}" on date/read time`,
      );
    row.slug.tr = p.slug;
    row.title.tr = p.title;
    row.excerpt.tr = p.excerpt;
    row.hasBody.tr = p.full === true;
  }
  // W28: bodies, composed from the (already normalised) package strings of each locale
  const lookup = (locale: Locale) => (id: string) => {
    const v = strings[locale][id];
    if (!v) throw new Error(`ARTICLE_BODY: ${id} is missing or empty in ${locale}`);
    return v;
  };
  for (const row of rows.values()) {
    const blocks = ARTICLE_BODY[row.key];
    if (blocks && !row.hasBody.en && !row.hasBody.tr)
      throw new Error(`ARTICLE_BODY has "${row.key}" but blog-posts.js marks no card full`);
    for (const locale of LOCALES) {
      if (row.hasBody[locale] && !blocks)
        throw new Error(
          `blog-posts.js marks "${row.key}" full in ${locale} but ARTICLE_BODY has no entry`,
        );
      row.body[locale] = row.hasBody[locale] && blocks ? renderBody(blocks, lookup(locale)) : null;
    }
  }
  return [...rows.values()];
}

/** source-map.js's COUNTRIES literal (12 rows; Türkiye is the destination, not a source). */
function loadSourceMap(): Array<{ name: string; lon: number; lat: number }> {
  const src = readFileSync(join(DESIGN, 'source-map.js'), 'utf8');
  const out = [
    ...src.matchAll(/\{ name: "([^"]+)", lon: (-?\d+(?:\.\d+)?), lat: (-?\d+(?:\.\d+)?) \}/g),
  ]
    .map((m) => ({ name: m[1], lon: Number(m[2]), lat: Number(m[3]) }))
    .filter((c) => c.name !== 'Türkiye');
  if (out.length !== 12)
    throw new Error(`source-map.js: expected 12 source countries, found ${out.length}`);
  return out;
}

// ---------------------------------------------------------------------------------------------

export function buildBundles() {
  const catalogue: Record<string, CatalogueRow> = {};
  const strings: Record<Locale, Record<string, string>> = { tr: {}, en: {} };
  const packageEn: Record<string, string> = {};
  for (const f of PAGE_FILES) {
    const file = JSON.parse(readFileSync(join(PKG, `${f}.json`), 'utf8')) as PageFile;
    for (const r of file.strings) {
      strings.tr[r.id] = decode(r.tr ?? '');
      strings.en[r.id] = decode(r.en ?? '');
      packageEn[r.id] = strings.en[r.id];
      catalogue[r.id] = {
        page: file.page,
        sec: r.sec ?? '',
        legal: r.legal === true,
        rev: r.rev,
        k: r.k,
      };
    }
  }
  const markEdit = (id: string, edit: Edit) => {
    const row = catalogue[id];
    if (!row) throw new Error(`unknown string id ${id}`);
    row.edits = [...new Set([...(row.edits ?? []), edit])];
  };
  const report: ImportReport = {
    overrides: [],
    turkiye: 0,
    placeholders: [],
    blog: { rows: 0, trBodies: 0, navVisible: false },
  };

  // 1. W7 / W51 override table
  const overrides = OverridesSchema.parse(readJson('content-overrides.json'));
  for (const [id, o] of Object.entries(overrides)) {
    if (!(id in catalogue)) throw new Error(`content-overrides.json: unknown id ${id}`);
    for (const locale of LOCALES) {
      const after = o[locale];
      if (after === undefined) continue;
      const before = strings[locale][id];
      if (before === after)
        throw new Error(
          `content-overrides.json: ${id}.${locale} already equals the override — drop it`,
        );
      strings[locale][id] = after;
      report.overrides.push({ id, locale, before, after, reason: o.reason });
      markEdit(id, 'override');
    }
  }

  // 2. W7 / README: EN copy says Türkiye, never Turkey (legal-flagged rows included — spelling only)
  for (const id of Object.keys(strings.en)) {
    const before = strings.en[id];
    const after = before.replace(/\bTurkey\b/g, 'Türkiye').replace(/\bTURKEY\b/g, 'TÜRKİYE');
    if (after !== before) {
      strings.en[id] = after;
      report.turkiye++;
      markEdit(id, 'turkiye');
    }
  }

  // 3. W1 / D17: metric literals → {placeholders} (non-legal ids only; legal ids are baselined)
  const placeholders = PlaceholdersSchema.parse(readJson('metric-placeholders.json'));
  const baseline = BaselineSchema.parse(readJson('metric-lint-baseline.json'));
  for (const [id, entries] of Object.entries(placeholders.strings)) {
    if (!(id in catalogue)) throw new Error(`metric-placeholders.json: unknown id ${id}`);
    if (catalogue[id].legal)
      throw new Error(
        `metric-placeholders.json: ${id} is legal-flagged — baseline it instead (W1)`,
      );
    for (const entry of entries) {
      const literals = placeholders.literals[entry.key] ?? [];
      const en = reauthor(id, 'en', strings.en[id], entry.key, entry.en, literals);
      const tr = reauthor(id, 'tr', strings.tr[id], entry.key, entry.tr, literals);
      strings.en[id] = en.value;
      strings.tr[id] = tr.value;
      report.placeholders.push({ id, key: entry.key, en: en.literal, tr: tr.literal });
      markEdit(id, 'placeholder');
    }
  }
  for (const [id, reason] of Object.entries(baseline)) {
    if (!(id in catalogue)) throw new Error(`metric-lint-baseline.json: unknown id ${id}`);
    if (!reason.startsWith('not-a-metric: ') && !catalogue[id].legal)
      throw new Error(
        `metric-lint-baseline.json: ${id} is not legal-flagged — re-author it through metric-placeholders.json`,
      );
  }
  for (const locale of LOCALES) {
    const bad = findHardTypedMetrics(strings[locale], placeholders.literals, baseline);
    if (bad.length)
      throw new Error(
        `hard-typed metric literals remain in ${locale}: ${bad.join(', ')} — add them to scripts/metric-placeholders.json (re-author) or, if legal-flagged, to scripts/metric-lint-baseline.json with a reason`,
      );
  }

  // 4. rev follows the English that is actually emitted (CONTENT-MODEL § Import and round-trip)
  for (const id of Object.keys(catalogue))
    if (strings.en[id] !== packageEn[id]) {
      catalogue[id].packageRev = catalogue[id].rev;
      catalogue[id].rev = rev(strings.en[id]);
    }

  // 5. countries (W25): one file for names and dial codes; source countries join it by code
  const countryRows = CountriesFileSchema.parse(readJson('data', 'countries.json'));
  const seen = new Set<string>();
  for (const c of countryRows) {
    if (seen.has(c.code)) throw new Error(`countries.json: duplicate code ${c.code}`);
    seen.add(c.code);
  }
  const countryOf = (code: string) => {
    const row = countryRows.find((c) => c.code === code);
    if (!row) throw new Error(`countries.json: ${code} is missing`);
    return row;
  };
  countryOf('TR');
  const countries = (locale: Locale): Country[] =>
    countryRows.map((c) => ({ code: c.code, name: c[locale], dial: c.dial }));

  // 6. collections
  const blog = buildBlog(strings);
  const trBodies = blog.filter((p) => p.hasBody.tr).length;
  const navVisible = trBodies >= BLOG_NAV_THRESHOLD;
  report.blog = { rows: blog.length, trBodies, navVisible };
  const metrics: Metric[] = [
    ...(Object.entries(METRIC_TABLE) as [MetricKey, Omit<Metric, 'key'>][]).map(([key, m]) => ({
      key,
      ...m,
    })),
    {
      key: 'sectors',
      value: SECTORS.filter((s) => s.key !== 'other').length,
      text: null,
      suffix: '',
      labelId: 'hire.074',
      unitId: null,
    },
  ];
  const design = loadSourceMap();
  const sourceCountries = (locale: Locale): SourceCountry[] =>
    [...design, SRI_LANKA].map((c) => {
      const meta = COUNTRY_TABLE[c.name];
      if (!meta) throw new Error(`source-map.js: "${c.name}" is not in COUNTRY_TABLE`);
      const row = countryOf(meta.code);
      const name = meta.nameId ? strings[locale][meta.nameId] : row[locale];
      if (!name) throw new Error(`source country ${meta.code}: empty ${locale} name`);
      if (meta.nameId && name !== row[locale])
        throw new Error(
          `countries.json: ${meta.code}.${locale} "${row[locale]}" disagrees with package id ${meta.nameId} "${name}"`,
        );
      return {
        code: meta.code,
        nameId: meta.nameId,
        name,
        dial: row.dial,
        lon: c.lon,
        lat: c.lat,
        flag: emojiFlag(meta.code),
      };
    });
  if (metrics.find((m) => m.key === 'countries')!.value !== [...design, SRI_LANKA].length)
    throw new Error('W1: the countries metric must equal the source-country list length');
  const collectionsFor = (locale: Locale): Bundle['collections'] => {
    const c = {
      metrics,
      rateConfig: [RATE_CONFIG],
      calculatorRoles: ROLES,
      sourceCountries: sourceCountries(locale),
      countries: countries(locale),
      offices: OFFICES,
      sectors: SECTORS,
      blog,
    };
    for (const key of Object.keys(c) as CollectionKey[]) {
      const schema: z.ZodTypeAny = CollectionSchemas[key];
      z.array(schema).parse(c[key]);
      for (const row of c[key] as Record<string, unknown>[])
        for (const [k, v] of Object.entries(row))
          if (/Id$/.test(k) && typeof v === 'string' && !(v in catalogue))
            throw new Error(
              `collection ${key}: ${k} "${v}" is not a catalogue id (W9: never invent ids)`,
            );
    }
    return c;
  };

  // 7. pages + nav
  const pages: Record<string, PageSeo> = {};
  for (const key of PAGE_KEYS) {
    const p = PAGE_TABLE[key];
    for (const id of [p.titleId, p.descriptionId])
      if (id && !(id in catalogue)) throw new Error(`pages.${key}: ${id} is not a catalogue id`);
    pages[key] = { ...p, ogImage: null, canonical: null };
  }
  const nav = buildNav(navVisible);
  for (const n of nav)
    if (!(n.labelId in catalogue))
      throw new Error(`nav ${n.href}: ${n.labelId} is not a catalogue id`);

  const mk = (locale: Locale): Bundle =>
    BundleSchema.parse({
      contractVersion: '1.0',
      locale,
      generatedAt: '2026-09-18T00:00:00.000Z',
      strings: strings[locale],
      nav,
      settings: SETTINGS,
      pages,
      collections: collectionsFor(locale),
      redirects: [],
    });
  return { tr: mk('tr'), en: mk('en'), catalogue, report };
}

if (require.main === module) {
  const { tr, en, catalogue, report } = buildBundles();
  mkdirSync(OUT, { recursive: true });
  writeFileSync(join(OUT, 'bundle.tr.json'), JSON.stringify(tr, null, 1));
  writeFileSync(join(OUT, 'bundle.en.json'), JSON.stringify(en, null, 1));
  writeFileSync(join(OUT, 'catalogue.json'), JSON.stringify(catalogue, null, 1));
  const clip = (s: string, n = 48) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);
  const overrideIds = new Set(report.overrides.map((o) => o.id)).size;
  console.log(
    `content-overrides.json — ${report.overrides.length} locale values overridden (${overrideIds} ids):`,
  );
  console.table(
    report.overrides.map((o) => ({
      id: o.id,
      locale: o.locale,
      before: clip(o.before),
      after: clip(o.after),
      reason: clip(o.reason, 60),
    })),
  );
  console.log(`Türkiye rule — ${report.turkiye} EN values normalised (Turkey → Türkiye)`);
  console.log(`metric placeholders — ${report.placeholders.length} replacements:`);
  console.table(report.placeholders);
  console.log(
    `blog — ${report.blog.rows} articles, ${report.blog.trBodies} Turkish bodies (threshold ${BLOG_NAV_THRESHOLD}) → /blog ${report.blog.navVisible ? 'in' : 'out of'} nav (W4)`,
  );
  console.log(
    `wrote ${Object.keys(tr.strings).length} strings, ${tr.nav.length} nav items, ${Object.keys(tr.pages).length} page records, ${Object.keys(tr.collections).length} collections per locale`,
  );
}
