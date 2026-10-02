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
  { path: '/iletisim', indexable: true },
  { path: '/en/contact', indexable: true },
  // The conversion page (D13): nobody lands on it cold, so Lighthouse never audits it.
  { path: '/tesekkurler?form=hire', indexable: false },
  // T13 — the portal door: noindex (W8), swept by axe/width/placeholder/headers, never Lighthouse.
  { path: '/portal-girisi', indexable: false },
  { path: '/en/portal-login', indexable: false },
  // T13 — the four legal pages: indexable, so Lighthouse audits all eight (W145 budgets apply).
  { path: '/gizlilik', indexable: true },
  { path: '/en/privacy', indexable: true },
  { path: '/kullanim-kosullari', indexable: true },
  { path: '/en/terms', indexable: true },
  { path: '/kvkk', indexable: true },
  { path: '/en/kvkk', indexable: true },
  { path: '/cerez-politikasi', indexable: true },
  { path: '/en/cookie-policy', indexable: true },
  // T13 — the newsletter one-shots: noindex, with a DUMMY token so the sweeps see the
  // click-to-forward state (never a real subscriber's token — the Ops routes ignore the class).
  { path: '/abone-onay?token=e2e-dummy-token-0000000000', indexable: false },
  { path: '/en/newsletter/confirm?token=e2e-dummy-token-0000000000', indexable: false },
  { path: '/abonelikten-cik?token=e2e-dummy-token-0000000000', indexable: false },
  { path: '/en/newsletter/unsubscribe?token=e2e-dummy-token-0000000000', indexable: false },
  { path: '/maliyet-hesaplayici', indexable: true },
  { path: '/en/hiring-cost-calculator', indexable: true },
  { path: '/calisma-izni', indexable: true },
  { path: '/en/work-permit', indexable: true },
  { path: '/ortak-olun', indexable: true },
  { path: '/en/partner-with-us', indexable: true },
  { path: '/hakkimizda', indexable: true },
  { path: '/en/about', indexable: true },
  { path: '/adaylar', indexable: true },
  { path: '/en/available-workers', indexable: true },
  { path: '/basari-hikayeleri', indexable: true },
  { path: '/en/success-stories', indexable: true },
  { path: '/temsilci-dogrulama', indexable: true },
  { path: '/en/verify', indexable: true },
  { path: '/kariyer', indexable: true },
  { path: '/en/careers', indexable: true },
  // T12: the blog index — noindex (W4): axe, the width sweep and the placeholder counter sweep
  // it; Lighthouse and the sitemap never do. The TR index is the W6 empty state.
  { path: '/blog', indexable: false },
  { path: '/en/blog', indexable: false },
  // T12 (B-14): the one written article (EN; TR has no body — W4). Pinned to the committed bundle
  // by src/app/[locale]/(site)/blog/__tests__/gate-row.test.ts.
  { path: '/en/blog/turkey-work-permit-process-employer-guide', indexable: false },
  // T15 (W21): the EN twin of the WP2a conversion-page row — noindex, never audited by Lighthouse.
  { path: '/en/thank-you?form=hire', indexable: false },
];

export const GATE_ROUTES: readonly string[] = GATE_ROUTE_TABLE.map((r) => r.path);

export const INDEXABLE_GATE_ROUTES: readonly string[] = GATE_ROUTE_TABLE.filter(
  (r) => r.indexable,
).map((r) => r.path);
