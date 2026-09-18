# SEO — JobsAdmire Website

Full context: `docs/PRD.md` §4, `docs/ARCHITECTURE.md`. Redirects have their own doc: `docs/redirects.md`.

## Metadata

`generateMetadata` per page, sourced from the content bundle (package fields in Phase A, Ops CMS fields in Phase B) — title, description, canonical, OG/Twitter fields. No hard-typed metadata in page components; it all traces back to the string/collection catalogue so a content edit doesn't need a code change.

## hreflang / x-default

`alternates.languages` on every page: `tr` (root), `en` (`/en/...`), and `x-default = tr` (the business is Turkish-market-first). Every page also sets its own self-reference in `alternates.languages` — a page missing its own locale in the alternates map is a defect, not a shortcut.

## Sitemap

`app/sitemap.ts`, generated from the **tagged content bundle** (the `sitemap` ISR tag from `docs/ARCHITECTURE.md`), with `revalidate` set so a newly published page appears without a full redeploy. Submitted to GSC at Phase A cutover (WP7a).

## Robots

`app/robots.ts`. Disallow: preview deployments (enforced by `noindex` + Deployment Protection, not robots alone — robots is not access control), `/tesekkurler`, newsletter confirm/unsubscribe, the portal-entry page. Allow everything else. A **verified-crawler allowlist** exists at the Firewall layer (Vercel Firewall rate rules, D13) so legitimate high-frequency crawlers (Googlebot etc.) are never rate-limited into 429s — this was one of the old site's measured failure modes and is one of the three numbers watched in the 12-week post-launch window below.

## JSON-LD

| Type                                | Where                                                | Purpose                                                                                                                                                                                                                                                                                                       |
| ----------------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Organization` / `EmploymentAgency` | Every page (site-wide script)                        | Permit No. 1730, tax id, `sameAs` social links                                                                                                                                                                                                                                                                |
| `WebSite`                           | Homepage                                             | Site-level search-action eligibility                                                                                                                                                                                                                                                                          |
| `BreadcrumbList`                    | Every non-homepage page                              | Navigation context for search results                                                                                                                                                                                                                                                                         |
| `Article` / `BlogPosting`           | Blog article pages                                   | Standard article rich-result eligibility                                                                                                                                                                                                                                                                      |
| `JobPosting`                        | Careers **detail** only, never the index             | Valid rich-result eligibility for open roles (D15)                                                                                                                                                                                                                                                            |
| `FAQPage`                           | Pages carrying FAQ blocks (~73 pairs in the package) | **AEO signal only — not pursued as a Google rich result.** Google has restricted FAQPage rich results to a narrow set of authoritative sites; this markup exists to help LLM-based answer engines (GEO/AEO), not to win a SERP rich snippet. Do not build or QA against rich-result appearance for this type. |

## OG images

Generated via `next/og` (Node runtime, not Edge — font bytes are bundled, not fetched at request time), one per page, ISR-cached alongside the page's own content tag so a content change regenerates the OG image without a redeploy.

## Redirects policy (summary)

Full rules, the GSC-joined disposition process, and the expected-loss forecast live in `docs/redirects.md`. Headline: every legacy URL with any click in the 16-month GSC export gets a single-hop, permanent redirect to the nearest relevant live page; zero-click URLs get `410`; unbounded legacy spaces (`/blog/*`, `/job-detail/*`, `/profile/*`) are `410` outright rather than individually mapped.

## 12-week post-launch watch

Starting at Phase A cutover (WP7a), checkpoints at week 1, 2, 4, 8, 12, tracking three numbers:

1. **GSC clicks** for 20 nominated Turkish employer-intent queries.
2. **GSC Crawl Stats 429s** — should be zero; any non-zero count means the crawler allowlist has a gap.
3. **Vercel Web Analytics sessions vs. forecast** — the consent-independent traffic truth (see `docs/ANALYTICS.md`), compared against the expected-loss forecast signed at Gate A.

A weekly three-way reconciliation (form submissions vs. `generate_lead` events vs. Ads conversions) runs alongside this watch — see `docs/ANALYTICS.md`.
