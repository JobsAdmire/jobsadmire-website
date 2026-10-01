/**
 * The ONE gate route list (W21). Every page task appends its two locale paths HERE and nowhere
 * else: axe (`e2e/a11y.spec.ts`) and the width sweep (`e2e/width-sweep.spec.ts`) read
 * `GATE_ROUTES`; Lighthouse (`scripts/gate.sh`, through `node scripts/gate-routes.mjs`), the
 * SEO spec and the routing spec's page-contract loop read `INDEXABLE_GATE_ROUTES`; the launch
 * profile's placeholder counter (`scripts/placeholder-count.ts`) reads `GATE_ROUTES`.
 */
export type GateRoute = {
  /** External path exactly as a visitor types it — TR unprefixed, EN under `/en` (D1). */
  path: string;
  /** `false` for the routes in `NOINDEX_PATHNAMES` (src/lib/seo/routes.ts): swept by axe, the
   *  width sweep and the placeholder counter, never audited by Lighthouse, never expected in the
   *  sitemap, never in the page-contract loop. */
  indexable: boolean;
};

export const GATE_ROUTE_TABLE: readonly GateRoute[] = [
  { path: '/', indexable: true },
  { path: '/en', indexable: true },
  { path: '/isci-talebi', indexable: true },
  { path: '/en/hire-workers', indexable: true },
  // The conversion page (D13): nobody lands on it cold, so Lighthouse never audits it.
  { path: '/tesekkurler?form=hire', indexable: false },
  // T13 — the portal door: noindex (W8), swept by axe/width/placeholder/headers, never Lighthouse.
  { path: '/portal-girisi', indexable: false },
  { path: '/en/portal-login', indexable: false },
];

export const GATE_ROUTES: readonly string[] = GATE_ROUTE_TABLE.map((r) => r.path);

export const INDEXABLE_GATE_ROUTES: readonly string[] = GATE_ROUTE_TABLE.filter(
  (r) => r.indexable,
).map((r) => r.path);
