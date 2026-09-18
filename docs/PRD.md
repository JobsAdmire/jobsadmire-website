# PRD — JobsAdmire Website

Source of truth for every decision cited here: `docs/superpowers/specs/2026-09-18-website-programme-design.md` (decisions D1–D28). This doc states what applies to the website's product surface; it does not duplicate the plan's rationale.

## 1. Audiences

Per `design-package/docs/project-brief.md`:

1. **Turkish employers** (hotels, factories, farms, construction, logistics) who need workers — the main conversion path.
2. **Overseas partners** — recruitment agencies, sourcing agents, training institutes supplying candidates.
3. A quieter third audience: workers (never sold to directly — placement runs only through verified partners) and employers verifying whether a person claiming to represent JobsAdmire actually does.

## 2. Pages, routes, forms

Turkish is the root locale (no prefix); English is under `/en` (D1, D16). TR slugs are **locked** (D16). EN slugs follow `src/i18n/routing.ts` (the WP1 plan is authoritative); the 14 core pages use the design package's own English route table. EN slugs for legal/thank-you/newsletter routes are **not enumerated in the plan** — marked "proposed" below; confirm alongside owner input §10 item 8 (decide-by WP1 day 3).

| #   | Page                          | TR slug (root)                             | EN slug (`/en/…`)            | Forms carried                                                                           |
| --- | ----------------------------- | ------------------------------------------ | ---------------------------- | --------------------------------------------------------------------------------------- |
| 1   | Homepage                      | `/`                                        | `/en`                        | Hero lead form (`INQUIRY`)                                                              |
| 2   | Hire Workers                  | `/isci-talebi`                             | `/en/hire-workers`           | Detailed employer request form (`INQUIRY`)                                              |
| 3   | Hiring Cost Calculator        | `/maliyet-hesaplayici`                     | `/en/hiring-cost-calculator` | Calculator quote capture (`CALCULATOR_QUOTE`)                                           |
| 4   | Partner With Us               | `/ortak-olun`                              | `/en/partner-with-us`        | Partner inquiry form (`INQUIRY`)                                                        |
| 5   | Work Permit                   | `/calisma-izni`                            | `/en/work-permit`            | none (explainer)                                                                        |
| 6   | About Us                      | `/hakkimizda` (+ `#lisans` licence anchor) | `/en/about`                  | none                                                                                    |
| 7   | Verify Representative         | `/temsilci-dogrulama`                      | `/en/verify`                 | Fraud report (`FRAUD_REPORT`); empty-state register at launch (D9 v1)                   |
| 8   | Join Our Team (careers index) | `/kariyer`                                 | `/en/join-our-team`          | Staff application via careers detail (`CAREERS_APPLY`)                                  |
| —   | Careers detail                | `/kariyer/[slug]`                          | `/en/join-our-team/[slug]`   | Staff application (`CAREERS_APPLY`); `JobPosting` JSON-LD (D15)                         |
| 9   | Contact Us                    | `/iletisim`                                | `/en/contact`                | Message form (`INQUIRY`), site-visit request (`VISIT`), callback (`CALLBACK`)           |
| 10  | Available Workers             | `/adaylar`                                 | `/en/available-workers`      | Aggregate stats section (no per-profile cards at launch, D2) + request form (`INQUIRY`) |
| 11  | Success Stories               | `/basari-hikayeleri`                       | `/en/success-stories`        | none — CMS cards, no proof scans at launch (D9 v1)                                      |
| 12  | Blog index                    | `/blog`                                    | `/en/blog`                   | Newsletter signup (`NEWSLETTER`)                                                        |
| 13  | Blog article                  | `/blog/[slug]`                             | `/en/blog/[slug]`            | Newsletter signup (`NEWSLETTER`)                                                        |
| 14  | Portal entry (CRM Login)      | `/portal-girisi`                           | `/en/portal-login`           | none — links out to portal.jobsadmire.com only                                          |
| —   | Privacy                       | `/gizlilik`                                | `/en/privacy`                | none                                                                                    |
| —   | Terms                         | `/kullanim-kosullari`                      | `/en/terms`                  | none                                                                                    |
| —   | KVKK notice                   | `/kvkk`                                    | `/en/kvkk`                   | none                                                                                    |
| —   | Cookie policy                 | `/cerez-politikasi`                        | `/en/cookie-policy`          | none                                                                                    |
| —   | Thank-you                     | `/tesekkurler?form=<key>`                  | `/en/thank-you?form=<key>`   | none — conversion page, D13                                                             |
| —   | Newsletter confirm            | `/abone-onay`                              | `/en/newsletter/confirm`     | RFC 8058                                                                                |
| —   | Newsletter unsubscribe        | `/abonelikten-cik`                         | `/en/newsletter/unsubscribe` | RFC 8058 one-click                                                                      |

All 14 core pages must exist before launch — the shared header/footer links to every one of them (design-package README).

Form handler types (D11, backed by Operations `POST /api/website/v1/forms/:formKey`): `INQUIRY`, `CAREERS_APPLY`, `NEWSLETTER`, `FRAUD_REPORT`, `CALLBACK`, `VISIT`, `CALCULATOR_QUOTE` — 13–15 form instances across the pages above (the design package's own discovery count; several pages carry more than one instance). Every form has a WhatsApp co-primary/secondary CTA and a visitor-side fallback panel on failure (D11) — never a spinner or fake success.

## 3. i18n rules

- **D1:** Turkish at the root, no `/tr` prefix; other locales prefixed (`/en`, later `/fr`). `localeDetection: false`; language choice persists in cookie `ja_locale` (replaces the design's `localStorage["ja-lang"]`); `?lang=` query param still overrides.
- **D16:** TR/EN slug table above; `pathnames` are static per locale in next-intl config.
- **D18 — number/currency contract:** TR thousands `38.944 ₺` (period, symbol trailing), EN `₺38,944` (comma, symbol leading); percent TR `%21,75` (sign leads), EN `21.75%`. `formatTRY(n, locale)` is tested against the design's worked examples. The ~38 divergent TR strings already in the package are normalised via bulk APPROVE at import.
- **Never translated:** `İŞKUR`, `law No. 4904`, `SGK`, `JobsAdmire`, `Partner Portal`, `ChatAdmire`, the `JA-` ID prefix, `Tax No`. App-store badge micro-copy ("GET IT ON", "DOWNLOAD ON THE") stays English. Both languages keep `Türkiye`, never "Turkey". The company refers to itself as "JobsAdmire", never "we" (formal register, Turkish "siz").
- **Six deliberately-empty Turkish strings** — never fall back to English: `hire.141`, `calc.041`, `calc.154`, `calc.157`, `calc.367`, `jt.107`. See `docs/CONTENT-MODEL.md` for the rendering contract.
- **~160 strings identical in both languages** by design (brand names, the licence chip, Turkish addresses, academic tiers, the reproduced Turkish government permit document) — not untranslated rows, do not "fix."
- French/Russian/Arabic: out of scope for this build (D22). Catalogues exist in the package for FR/RU but are not wired; Arabic was never built.

## 4. SEO / GEO / AEO requirements

Per plan §3.1 (expanded in `docs/SEO.md`):

- `generateMetadata` per page from bundle/package fields; `alternates.languages` for tr/en with `x-default = tr` and self-reference.
- `app/sitemap.ts` generated from the tagged content bundle with `revalidate`; `app/robots.ts`.
- JSON-LD: `Organization`/`EmploymentAgency` (permit 1730, tax id, `sameAs`), `WebSite`, `BreadcrumbList`, `Article`/`BlogPosting`, `JobPosting` (careers detail only), `FAQPage` (AEO signal only — **not** pursued as a Google rich result, per plan §3.1).
- OG images via `next/og` (Node runtime, bundled font bytes, ISR).
- `llms.txt` published at root.
- Facet URLs (filtered Available Workers/Success Stories views) canonicalise to the base page.
- `noindex` on: portal entry, `/tesekkurler`, newsletter confirm/unsubscribe, all preview deployments.

## 5. Accessibility

WCAG 2.2 AA. **Accessibility overrides pixel fidelity where the two conflict** (D20): eyebrow colour `#1073a8` (contrast-safe, not the raw `#1899D5` brand blue), a contrast-token test in `verify`, pause/play on every marquee/ticker, real (not styled-div) dialogs, a skip link, every form input labelled with `aria-live` error regions. The pixel-comparison harness (four nominated pages) tolerates these named deltas plus the `/tesekkurler` navigation delta.

## 6. Performance budget

LCP ≤ 2.5 s, CLS ≤ 0.1, INP ≤ 200 ms (mobile). Content routes ≤ 120 KB gzipped JS. Budget is re-measured once real photography replaces placeholders. One consent-granted `gate` run per work package.

## 7. Analytics / consent

D13 — full schema in `docs/ANALYTICS.md`. Headline requirements: Consent Mode v2 with inline denied defaults, GA4 loaded only through GTM, events on all 14 pages with a parameter allowlist that **excludes any candidate reference**, every form's success path lands on `/tesekkurler?form=<key>` where the Ads conversion fires.

## 8. Legal pages

D14 — Privacy and Terms seeded from the old site's JSON; Cookie policy, KVKK aydınlatma metni, candidate notice (v1.1), and retention policy are counsel-drafted, commissioned in WP0. **Pending §10 item 6** (decide-by: WP0 end for engagement, content freeze for copy; auto-default: Privacy + Terms + a minimal cookie notice ship for Phase A if counsel is late, newsletter and pool cards stay off).

## 9. Out of scope (D22)

FR/RU locales, Arabic/RTL, a third product tile, an iOS app-store badge, a job-seeker board, website login, the Operations→CRM partner receiver, a Vercel Blob media mirror.

Deferred to **v1.1** by default (the scope ladder descends in this order if the budget or content stop rules trip, plan §12): candidate-pool per-profile cards → representatives register → success-story proof images → blog block editor (v1 blog is Markdown, written articles only, out of nav below 6 Turkish bodies) → newsletter → CRM feed.

## 10. Pending / owner-decided items

Values not yet confirmed are marked against the plan's owner-input table (§10):

- Headline metrics (placed count, employer count, country count, permit days, reply SLA) — **pending §10 item 2**, decide-by WP1 end; auto-default 470+ / 22+ / 13 (incl. Sri Lanka + Senegal) / 45 days / 6–8 & 4–6 weeks / 4 working hours.
- Founder name/title, founder/office photo, licence PDFs — **pending §10 item 3**.
- Hero photography for Homepage + Hire Workers — **pending §10 item 4**.
- Blog bodies (who writes, when) — **pending §10 item 5**.
- Rate config 2026 sign-off — **pending §10 item 7**; `reviewDueAt` 2026-12-20 regardless of when sign-off lands.
- TR slug table confirmation, "Karachi" office label, ticker "Now" label, desktop body-small size — **pending §10 item 8**, decide-by WP1 day 3.
- Ads account ownership / final-URL re-pointing — **pending §10 item 9**.
- Second human for alerts — **pending §10 item 10**, no default; required before Gate A.
