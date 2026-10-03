import type { Href } from '@/i18n/navigation';
import type { Locale, pathnames } from '@/i18n/routing';

/** W17: pages cannot pass props to the group layouts, so the header's per-page CTAs come from
 *  this route-keyed table, read by `HeaderCtas` through next-intl's `usePathname()` (the
 *  internal key — SSR-consistent, so no hydration mismatch and no context store, for a STATIC
 *  key only). Ids are the package's own per-page nav-CTA strings (R15/W23); the anchors are
 *  the design's own ids — THE PAGE TASK OWNING A STATIC KEY MUST RENDER THAT ELEMENT ID, or
 *  edit its entry here. A dynamic key (one containing `[`, e.g. `/careers/[slug]`) MUST NOT
 *  get an entry: the prerendered TR HTML and the browser disagree on a dynamic route's
 *  internal key, so it falls back to `DEFAULT_CTAS` on both sides instead (W121). */
export type CtaVariant = 'primary' | 'danger';
/** `tailFirst`: the locales in which the tail renders BEFORE the label (QA W220 V-03, W222 (4)).
 *  The package translates some split CTAs so label + tail read in that language's order
 *  (home.014/015 "Talep" + "Oluştur", contact.015/016 "Bir mesaj" + "gönderin"); three pairs are
 *  left in English order — verify.015/016 ("Bildir" + "sahtekârı"), wp.016/017 ("Başvurun" + "izin
 *  için") and partner.017/018 ("Başvurun" + "iş ortaklığı için") — so in Turkish the object or the
 *  postpositional phrase precedes the verb and the tail opens the label (the overrides capitalise
 *  it: "Sahtekârı Bildir", "İzin İçin Başvurun", "İş Ortaklığı İçin Başvurun"). The design's short
 *  form (the label alone at 901–1100) and the EN labels are untouched. */
export type CtaLink = {
  labelId: string;
  tailId?: string;
  href: Href;
  variant?: CtaVariant;
  tailFirst?: readonly Locale[];
};
/** `secondary` left out → the default secondary; `null` → no secondary on that page. */
export type PageCtas = { primary: CtaLink; secondary?: CtaLink | null };

const HIRE: CtaLink = { labelId: 'home.002', href: '/hire-workers' };

export const DEFAULT_CTAS: PageCtas = {
  // "Request" + "Workers" — the tail is `xl`-only, as the design hides `.ja-cta-long` ≤1100
  primary: {
    labelId: 'home.014',
    tailId: 'home.015',
    href: { pathname: '/hire-workers', hash: '#request-form' },
  },
  secondary: { labelId: 'home.008', href: '/partner-with-us' },
};

export const CTA_BY_PATHNAME: Partial<Record<keyof typeof pathnames, PageCtas>> = {
  '/': {
    primary: {
      labelId: 'home.014',
      tailId: 'home.015',
      href: { pathname: '/', hash: '#proposal' },
    },
  },
  '/hiring-cost-calculator': {
    primary: {
      labelId: 'calc.324',
      href: { pathname: '/hiring-cost-calculator', hash: '#calculator' },
    },
    secondary: HIRE,
  },
  '/partner-with-us': {
    // "Apply" + "to partner"; TR "İş Ortaklığı İçin Başvurun" — the tail first (W222 (4), P-10)
    primary: {
      labelId: 'partner.017',
      tailId: 'partner.018',
      href: { pathname: '/partner-with-us', hash: '#tracks' },
      tailFirst: ['tr'],
    },
    secondary: HIRE,
  },
  '/work-permit': {
    // "Apply" + "for a permit"; TR "İzin İçin Başvurun" — the tail first (W222 (4), WP-08)
    primary: {
      labelId: 'wp.016',
      tailId: 'wp.017',
      href: { pathname: '/work-permit', hash: '#permit-cta' },
      tailFirst: ['tr'],
    },
  },
  '/contact': {
    primary: {
      labelId: 'contact.015',
      tailId: 'contact.016',
      href: { pathname: '/contact', hash: '#message' },
    },
    secondary: HIRE,
  },
  '/verify': {
    // the design's red "Report an Impostor" — the only danger-face CTA in the chrome; TR reads
    // "Sahtekârı Bildir" (object + verb — the tail first, W220 V-03; the override capitalises it)
    primary: {
      labelId: 'verify.015',
      tailId: 'verify.016',
      href: { pathname: '/verify', hash: '#report' },
      variant: 'danger',
      tailFirst: ['tr'],
    },
    secondary: HIRE,
  },
  '/available-workers': {
    // One label, no tail (QA W221 W-08): the design's "See" + "Candidates" split read as a footnote
    // "Bkz." pill on Turkish phones once the tail hid; availworkers.016 is overridden to the whole
    // phrase ("Adayları gör" / "See candidates") instead of borrowing the nav label home.003.
    primary: {
      labelId: 'availworkers.016',
      href: { pathname: '/available-workers', hash: '#pool' },
    },
  },
};

export type ResolvedCta = {
  label: string;
  tail?: string;
  href: Href;
  variant: CtaVariant;
  /** Render the tail before the label in this locale (W220 V-03). */
  tailFirst: boolean;
};
export type ResolvedPageCtas = { primary: ResolvedCta; secondary?: ResolvedCta };
export type CtaTable = {
  defaults: ResolvedPageCtas;
  byPathname: Partial<Record<keyof typeof pathnames, ResolvedPageCtas>>;
};

/** Resolves every label once on the server (Header) so the client island receives strings; the
 *  locale decides each CTA's tail order (`tailFirst`). */
export function resolveCtas(t: (id: string) => string, locale: Locale): CtaTable {
  const one = (c: CtaLink): ResolvedCta => ({
    label: t(c.labelId),
    ...(c.tailId ? { tail: t(c.tailId) } : {}),
    href: c.href,
    variant: c.variant ?? 'primary',
    tailFirst: c.tailFirst?.includes(locale) ?? false,
  });
  const defaultSecondary = DEFAULT_CTAS.secondary ? one(DEFAULT_CTAS.secondary) : undefined;
  const page = (p: PageCtas): ResolvedPageCtas => ({
    primary: one(p.primary),
    ...(p.secondary === undefined
      ? defaultSecondary
        ? { secondary: defaultSecondary }
        : {}
      : p.secondary === null
        ? {}
        : { secondary: one(p.secondary) }),
  });
  const byPathname: CtaTable['byPathname'] = {};
  for (const [key, value] of Object.entries(CTA_BY_PATHNAME) as [
    keyof typeof pathnames,
    PageCtas,
  ][]) {
    byPathname[key] = page(value);
  }
  return { defaults: page(DEFAULT_CTAS), byPathname };
}

/** Pure lookup: the internal pathname key (or `null` outside the router) → that page's CTAs. */
export function ctasFor(table: CtaTable, pathname: string | null): ResolvedPageCtas {
  if (pathname && Object.hasOwn(table.byPathname, pathname)) {
    return table.byPathname[pathname as keyof typeof pathnames]!;
  }
  return table.defaults;
}
