import type { Href } from '@/i18n/navigation';
import type { pathnames } from '@/i18n/routing';

/** W17: pages cannot pass props to the group layouts, so the header's per-page CTAs come from
 *  this route-keyed table, read by `HeaderCtas` through next-intl's `usePathname()` (the
 *  internal key — SSR-consistent, so no hydration mismatch and no context store). Ids are the
 *  package's own per-page nav-CTA strings (R15/W23); the anchors are the design's own ids —
 *  THE PAGE TASK OWNING A KEY MUST RENDER THAT ELEMENT ID, or edit its entry here. */
export type CtaVariant = 'primary' | 'danger';
export type CtaLink = { labelId: string; tailId?: string; href: Href; variant?: CtaVariant };
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
    primary: {
      labelId: 'partner.017',
      tailId: 'partner.018',
      href: { pathname: '/partner-with-us', hash: '#tracks' },
    },
    secondary: HIRE,
  },
  '/work-permit': {
    primary: {
      labelId: 'wp.016',
      tailId: 'wp.017',
      href: { pathname: '/work-permit', hash: '#permit-cta' },
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
    // the design's red "Report an Impostor" — the only danger-face CTA in the chrome
    primary: {
      labelId: 'verify.015',
      tailId: 'verify.016',
      href: { pathname: '/verify', hash: '#report' },
      variant: 'danger',
    },
    secondary: HIRE,
  },
  '/available-workers': {
    // "See" + "Candidates": the tail is the canonical nav label (home.003), not a page copy
    primary: {
      labelId: 'availworkers.016',
      tailId: 'home.003',
      href: { pathname: '/available-workers', hash: '#pool' },
    },
  },
};

export type ResolvedCta = { label: string; tail?: string; href: Href; variant: CtaVariant };
export type ResolvedPageCtas = { primary: ResolvedCta; secondary?: ResolvedCta };
export type CtaTable = {
  defaults: ResolvedPageCtas;
  byPathname: Partial<Record<keyof typeof pathnames, ResolvedPageCtas>>;
};

/** Resolves every label once on the server (Header) so the client island receives strings. */
export function resolveCtas(t: (id: string) => string): CtaTable {
  const one = (c: CtaLink): ResolvedCta => ({
    label: t(c.labelId),
    ...(c.tailId ? { tail: t(c.tailId) } : {}),
    href: c.href,
    variant: c.variant ?? 'primary',
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
