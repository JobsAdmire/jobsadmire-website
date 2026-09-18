# SEO — JobsAdmire Website

Full context: `docs/PRD.md` §4, `docs/ARCHITECTURE.md`. Redirects have their own doc: `docs/redirects.md`.

## Metadata

`generateMetadata` per page, sourced from the content bundle (package fields in Phase A, Ops CMS fields in Phase B) — title, description, canonical, OG/Twitter fields. No hard-typed metadata in page components; it all traces back to the string/collection catalogue so a content edit doesn't need a code change.

## hreflang / x-default

`alternates.languages` on every page: `tr` (root), `en` (`/en/...`), and `x-default = tr` (the business is Turkish-market-first). Every page also sets its own self-reference in `alternates.languages` — a page missing its own locale in the alternates map is a defect, not a shortcut. Built by `localeAlternates()`/`absoluteUrl()` (`src/lib/seo/routes.ts`) and consumed by `buildMetadata()` (`src/lib/seo/metadata.ts`).

**`alternateLinks: false`** in `src/i18n/routing.ts` — next-intl's middleware, left at its default, answers every response with its own `Link: rel="alternate"; hreflang=…` header built from the _request host_ (`localhost`, a preview `*.vercel.app`, the apex), which then disagrees with the `<link rel="alternate">` tags above (built from `NEXT_PUBLIC_SITE_URL`). Lighthouse's SEO audit fails on a canonical that points at "another hreflang location" — a real defect the WP1 gate caught (Task 14), not a stylistic choice. Full detail: `docs/ARCHITECTURE.md` § Routing.

## Sitemap

`app/sitemap.ts` — as shipped in WP1, generated from the **static `pathnames` table** (`src/i18n/routing.ts`), not yet the tagged content bundle: it lists every static route in `pathnames` for both locales except the `EXCLUDED` set (`/thank-you`, `/portal-login`, `/newsletter/confirm`, `/newsletter/unsubscribe`) and the dynamic keys (`/careers/[slug]`, `/blog/[slug]`, filtered out by pattern), with `revalidate = 900` — 16 static routes × 2 locales = **32 URLs**. **This currently lists routes that do not exist as pages yet**: only 4 of those 32 (`/`, `/en`, `/isci-talebi`, `/en/hire-workers`) are real; the other 28 404 through the `[...rest]` catch-all today. **This must be gated — either built out or filtered down to real routes — before WP7a submits the sitemap to GSC**; submitting a sitemap full of 404s at cutover is worse than a smaller correct one. Blog and careers-detail entries, read from the bundle under the `sitemap` ISR tag, are WP2 work not yet started.

## Robots

`app/robots.ts`. In any non-production `VERCEL_ENV` (preview, and local dev has no `VERCEL_ENV` at all so it falls through to the same production rules as production — this is fine locally, since nothing crawls localhost): `disallow: '/'` outright — enforced by `noindex` + Deployment Protection too, not robots alone, since robots is not access control. In production: allow everything except `/api/`, `/portal-girisi`, `/en/portal-login`, `/tesekkurler`, `/en/thank-you`, plus a `sitemap:` pointer. **`/abone-onay`/`/abonelikten-cik`/`/en/newsletter/confirm`/`/en/newsletter/unsubscribe` are not yet in the disallow list** — only `sitemap.ts`'s `EXCLUDED` set keeps them out of the sitemap; those routes don't exist yet either, so there's nothing to crawl today, but robots.ts should gain them in the same WP2 change that ships the newsletter pages. A **verified-crawler allowlist** at the Firewall layer (Vercel Firewall rate rules, D13) — so legitimate high-frequency crawlers (Googlebot etc.) are never rate-limited into 429s, one of the old site's measured failure modes — is not yet configured in this repo; it is a WP0/Vercel-project-settings action, tracked as one of the three numbers watched in the 12-week post-launch window below.

## JSON-LD

**Shipped in WP1** (`src/lib/seo/jsonld.ts`): `organizationJsonLd` and `websiteJsonLd`, both rendered site-wide from `[locale]/layout.tsx` via `JsonLdScript.tsx`; `breadcrumbJsonLd` and `faqJsonLd` are written but not yet called from any page. `Article`/`BlogPosting` and `JobPosting` builders don't exist yet — they arrive with the blog and careers-detail pages in WP2. The table below is the full target set:

| Type                                | Where                                                | Purpose                                                                                                                                                                                                                                                                                                       |
| ----------------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Organization` / `EmploymentAgency` | Every page (site-wide script)                        | Permit No. 1730, tax id, `sameAs` social links                                                                                                                                                                                                                                                                |
| `WebSite`                           | Homepage                                             | Site-level search-action eligibility                                                                                                                                                                                                                                                                          |
| `BreadcrumbList`                    | Every non-homepage page                              | Navigation context for search results                                                                                                                                                                                                                                                                         |
| `Article` / `BlogPosting`           | Blog article pages                                   | Standard article rich-result eligibility                                                                                                                                                                                                                                                                      |
| `JobPosting`                        | Careers **detail** only, never the index             | Valid rich-result eligibility for open roles (D15)                                                                                                                                                                                                                                                            |
| `FAQPage`                           | Pages carrying FAQ blocks (~73 pairs in the package) | **AEO signal only — not pursued as a Google rich result.** Google has restricted FAQPage rich results to a narrow set of authoritative sites; this markup exists to help LLM-based answer engines (GEO/AEO), not to win a SERP rich snippet. Do not build or QA against rich-result appearance for this type. |

## OG images

**Not built in WP1.** `buildMetadata()` (`src/lib/seo/metadata.ts`) falls back to a static `/opengraph-image.png` when a page has no `seo.ogImage` — but that file does not exist in `public/` yet, so every WP1 page's `openGraph.images` currently points at a 404. The OG image file (and, per the target design below, a `next/og` generator) arrives in WP2: generated via `next/og` (Node runtime, not Edge — font bytes bundled, not fetched at request time), one per page, ISR-cached alongside the page's own content tag so a content change regenerates the OG image without a redeploy.

## Redirects policy (summary)

Full rules, the GSC-joined disposition process, and the expected-loss forecast live in `docs/redirects.md`. Headline: every legacy URL with any click in the 16-month GSC export gets a single-hop, permanent redirect to the nearest relevant live page; zero-click URLs get `410`; unbounded legacy spaces (`/blog/*`, `/job-detail/*`, `/profile/*`) are `410` outright rather than individually mapped.

## 12-week post-launch watch

Starting at Phase A cutover (WP7a), checkpoints at week 1, 2, 4, 8, 12, tracking three numbers:

1. **GSC clicks** for 20 nominated Turkish employer-intent queries.
2. **GSC Crawl Stats 429s** — should be zero; any non-zero count means the crawler allowlist has a gap.
3. **Vercel Web Analytics sessions vs. forecast** — the consent-independent traffic truth (see `docs/ANALYTICS.md`), compared against the expected-loss forecast signed at Gate A.

A weekly three-way reconciliation (form submissions vs. `generate_lead` events vs. Ads conversions) runs alongside this watch — see `docs/ANALYTICS.md`.
