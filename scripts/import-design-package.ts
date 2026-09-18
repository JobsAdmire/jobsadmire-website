import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(__dirname, '..');
const PKG = join(ROOT, 'design-package', 'strings');
const OUT = join(ROOT, 'src', 'content', 'local');

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

/** README "Contact constants" + "Nav item order" — the only hand-typed data in the importer. */
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

// desktop nav in README order; labels are the Homepage nav ids (home.001..010) + contact
const NAV: Array<{ href: string; labelId: string }> = [
  { href: '/hire-workers', labelId: 'home.002' },
  { href: '/available-workers', labelId: 'home.003' },
  { href: '/work-permit', labelId: 'home.004' },
  { href: '/hiring-cost-calculator', labelId: 'home.005' },
  { href: '/about', labelId: 'home.001' },
  { href: '/success-stories', labelId: 'home.006' },
  { href: '/blog', labelId: 'home.010' },
  { href: '/verify', labelId: 'sys.nav.verify' },
  { href: '/partner-with-us', labelId: 'home.008' },
  { href: '/careers', labelId: 'home.009' },
  { href: '/contact', labelId: 'home.007' },
];

export function buildBundles() {
  const catalogue: Record<
    string,
    { page: string; sec: string; legal: boolean; rev: string; k?: string }
  > = {};
  const strings: Record<'tr' | 'en', Record<string, string>> = { tr: {}, en: {} };
  for (const f of PAGE_FILES) {
    const file = JSON.parse(readFileSync(join(PKG, `${f}.json`), 'utf8')) as PageFile;
    for (const r of file.strings) {
      strings.tr[r.id] = decode(r.tr ?? '');
      strings.en[r.id] = decode(r.en ?? '');
      catalogue[r.id] = {
        page: file.page,
        sec: r.sec ?? '',
        legal: r.legal === true,
        rev: r.rev,
        k: r.k,
      };
    }
  }
  // sys.* ids that the package does not carry (D7 reserved range)
  strings.tr['sys.nav.verify'] = 'Temsilci Doğrulama';
  strings.en['sys.nav.verify'] = 'Verify Representative';
  catalogue['sys.nav.verify'] = { page: 'sys', sec: 'nav', legal: false, rev: 'sys' };

  const mk = (locale: 'tr' | 'en') => ({
    contractVersion: '1.0',
    locale,
    generatedAt: '2026-09-18T00:00:00.000Z',
    strings: strings[locale],
    nav: NAV.map((n, i) => ({
      group: 'desktopNav',
      order: i,
      labelId: n.labelId,
      href: n.href,
      external: false,
      visibleOn: ['desktop', 'mobile'],
    })),
    settings: SETTINGS,
    pages: {},
    collections: {},
    redirects: [],
  });
  return { tr: mk('tr'), en: mk('en'), catalogue };
}

if (require.main === module) {
  const { tr, en, catalogue } = buildBundles();
  mkdirSync(OUT, { recursive: true });
  writeFileSync(join(OUT, 'bundle.tr.json'), JSON.stringify(tr, null, 1));
  writeFileSync(join(OUT, 'bundle.en.json'), JSON.stringify(en, null, 1));
  writeFileSync(join(OUT, 'catalogue.json'), JSON.stringify(catalogue, null, 1));
  console.log(`wrote ${Object.keys(tr.strings).length} strings per locale`);
}
