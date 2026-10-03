# WP2b final pass — brief (controller, 2026-10-02; runs before T15 per W184)

Every one of the 14 designed pages is built (W206). This pass closes the items the task reviews deferred to "the final pixel pass" / "the final review", in two parts that share ONE proof (W164/W126):

- **Part 2 — code, SEO, tests** (Fable; runs concurrently with T14; NO build, NO gate, NO dev server — the FULL low-memory verify line is its stop condition; its changes are proven by Part 1's proof).
- **Part 1 — pixel, layout, CLS** (Fable; runs after T14 reports; ends with the single proof: one capped build, one `next start` (long limit, W197), the gate split into Playwright and Lighthouse halves over all 34 URLs (W200 `rm -rf .lighthouseci lighthouse-report` first), `npm run js-size`, pixel for the four D27 pages (two-iteration cap each), server killed, report folders deleted).

Rules for both: `.superpowers/sdd/wp2b/IMPLEMENTER.md` (memory rule, by-path staging, no push/stash/rewrite, no `sleep`, W181 icons, W195 prefetch, W177 trailer = your own model, stop-and-report conditions, report shape). Rulings W162–W210 override the task files. No copy changes (WP-C items stay on the owner's sheet). Imports by module path, verified against the real module. Failing test first for every behaviour change; class strings judged against `src/test/class-collisions.ts` (W119/W122/W155); the 11 px desktop floor (W190) on every new `xl:` twin; `role="img"` mocks exempt (W191). Deltas from the design are recorded by name under D19/D20 in `docs/ARCHITECTURE.md` (sentence-anchored) and in the ledger row `Final pass` of `docs/superpowers/plans/2026-09-20-wp2b-pages.md`.

Anchors: `S/` = `src/app/[locale]/(site)/`, `D/` = `src/design/`. Line numbers are from HEAD cae0b7d and may drift — search by the quoted token.

## Part 2 — code, SEO, tests (Fable, now)

Do not touch T14's files while it runs: `src/analytics/**`, `e2e/thank-you.spec.ts`, `src/app/[locale]/(minimal)/thank-you/**`, `src/forms/client/FallbackPanel*`, `scripts/door-smoke*`, `e2e/forms/**`, `docs/ANALYTICS.md`, `docs/INTEGRATIONS.md`, `docs/OPERATING.md`, `package.json`. Before staging any shared file run `git diff <file>` and stage only if every hunk is yours.

| # | Item | Anchor | Acceptance |
|---|---|---|---|
| P2-1 | `jobPostingJsonLd` gains optional `remote` → `jobLocationType: 'TELECOMMUTE'` (+ `applicantLocationRequirements` only if the opening carries applicant countries — never invent one); `jobLocation.city` optional (no country name as `addressLocality`); the careers detail page passes `remote` when `workModesOf(opening)` is exactly `['REMOTE']`. Read W205 ⚠️2 and `.superpowers/sdd/wp2b/task-11-review.md` for the agreed shape. | `src/lib/seo/jsonld.ts` ~l.146–176; `S/careers/[slug]/page.tsx` ~l.120 | `jsonld.test` pins remote / on-site / mixed; `page.test` pins the pass-through |
| P2-2 | Kernel `Field` renders no empty placeholder `<option>` for a single-option locked select (W205 ⚠️3). Skip if `git log --oneline -3 -- src/forms/client/Field.tsx` shows T14 did it. | `src/forms/client/Field.tsx` ~l.120 | `Field.test` pins one `<option>` for a locked single-option select, the placeholder for ≥ 2 options |
| P2-3 | Hoist the duplicated partner-line helper to `src/lib/contact/partner-line.ts` (`formatPhoneDisplay`/`displayPhone` → one name, `partnerLineOf`); both pages import it by path; delete the two copies; both test files import the hoisted module; comments follow W208 (`partnershipsPhone` is `null` today, the main line serves). | `S/contact/_lib/phone.ts`; `S/partner-with-us/_lib/partner-line.ts` + their tests | tests green; `grep -rn 'partnerLineOf' src` shows one definition |
| P2-4 | Unsubscribe route: streamed 4 KB cap (`readCapped`) like `/api/form-beacon`, hoisted to `src/lib/http/read-capped.ts` and used by both routes (the declared-length 413 stays). | `src/app/api/newsletter/unsubscribe/route.ts` ~l.29; `src/app/api/form-beacon/route.ts` ~l.35 | route tests: a 4 KB+1 body without `content-length` → 413 |
| P2-5 | The 11 px desktop type-floor pin test (W190 I1/W191): a static scan of `text-[Npx]` literals (plain and `xl:`) in `src/app` + `src/design`, failing on any computed desktop size < 11 px; `role="img"` mock components exempt by an explicit allowlist of files, each with a one-line reason. | new `src/test/type-floor.test.ts` | green at HEAD; the allowlist is minimal |
| P2-6 | Pixel-harness hardening (W190 optional): pin the weight list in `font-config.test.ts`; `scripts/pixel-compare.ts` warns (stderr) when no CSS rule was rewritten. | `scripts/pixel-compare.ts` ~l.247–256; the `font-config.test.ts` next to the layout | tests green |
| P2-7 | Partner page: stop importing `Logos`/`LogoMarquee` while the bundle has no logos (W193/W194 A2): server-side branch with `next/dynamic` (`ssr` default) or a server `await import()` inside the branch — the client chunk must not ship when `logos.length === 0`; pin with a test that renders the page with an empty `logos` array and asserts the island is absent, plus a static test that the page module has no top-level import of `Logos`. | `S/partner-with-us/page.tsx` ~l.14, 21, 111; `_sections/Logos.tsx` | tests green; `/ortak-olun` -642 B gz recorded by Part 1's js-size |
| P2-8 | OG `images` carry `{ url, width: 1200, height: 630, alt }` (alt = the page title) on `openGraph` and `twitter` (WP2a T4-4 P3). | `src/lib/seo/metadata.ts` ~l.74–82 | `metadata.test` pins the shape for a static page and the blog article (W169 reuse) |
| P2-9 | Font-cmap unit test for OG titles (WP2a T4-4 P5): every `sys.seo.*.title` and `sys.blog.article.metaTitle` glyph exists in the vendored Archivo Bold cmap (opentype parse or a byte-level cmap read — no new dependency unless already present). Time-box 30 min; if the cmap read needs a dependency, record it as open instead. | `src/app/og/**` tests | green or recorded |
| P2-10 | E2/E3 are CONDITIONAL on measurements — do nothing; Part 1 decides with local js-size against the W210 thresholds. | — | — |

Commit per item (or per two related items) with the verify line green: `npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1`. Report: `.superpowers/sdd/wp2b/final-pass-part2-report.md` (status, commits table, per-item evidence, files vs this table, concerns), and return the status line, HEAD, suite size, one line per concern.

## Part 1 — pixel, layout, CLS (Fable, after T14; single proof)

### A — chrome and hero (all pages)
| # | Item | Anchor | Source |
|---|---|---|---|
| A1 | Home hero grid and stats leave `container-site` for `mx-auto w-full px-5 xs:px-12 xl:max-w-[960px] xl:px-9` (48 px gutters at 461–900; 888 px content in the 960 box from 1101). | `S/_home/sections/Hero.tsx` ~l.49, 94 | W184, W185 A1 |
| A2 | Header side padding below 901: design 14 px (12 px ≤ 460), site 20 px. | `src/app/globals.css` `--gutter-nav` ~l.94; `D/chrome/Header.tsx` ~l.47 | W184 |
| A3 | Pin the header logo aspect ratio from `BRAND.logo`'s own dimensions (≤ 1 px width settle). | `D/chrome/Header.tsx` `LOGO`/`<Image>` | W184 |
| A4 | Phones: the design keeps the logo fixed and caps the CTA (`max-w-[185px]`, 10 px gap ≤ 460); the site shrinks the logo (82 % TR / 67 % EN on Calc at 390). **Decision W210: follow the design** — fixed logo, capped CTA, label wraps; verify in `design-package/design/*.dc.html` how the TR label behaves at 390 and match it. | `D/chrome/Header.tsx` ~l.47–48; `D/chrome/HeaderCtas.tsx` ~l.10 | W185 A2, W190 A3, T3 report |
| A5 | Header at 901–1100 may wrap to two lines (≈ 113 px) above the hero card's `scroll-mt-[90px]`: measure in the proof browser at 901/1000/1100, raise `scroll-mt` if needed, compare header row heights with the design (W184 rows: logo 30/34/25.5 px). | `S/_home/components/HeroLeadForm.tsx` ~l.91; `Header.tsx` | T1b M6, W206 |
| A6 | Footer legal-row divider spans the gutters: move `border-t border-white/15 py-5 flex…` to an inner div inside `container-site`. | `D/chrome/Footer.tsx` ~l.194 | T1b M7 |
| A7 | **Decision W210: adopt the design's ≤ 600 px rule** (h1 32 px, h2 25 px, letter-spacing -0.4 px) as `max-[601px]:` variants (never `max-sm:`), recorded under D19. Apply to the Calc hero h1, the Hire industries/compare/process h2s, `FaqBlock`'s h2 (-1.6 px / 1.05 / 24 px ≤ 700 per the design). | `S/hiring-cost-calculator/_sections/Hero.tsx` ~l.68; `S/hire-workers/_sections/*`; `D/blocks/FaqBlock.tsx` ~l.79; `docs/ARCHITECTURE.md` D19 | W189 A6/A7, W190 A1b, T2 I1 |
| A8 | `ImageSlot` gains an additive cover mode (W189 A3/A5): a fixed-height box (`h-[…]` per breakpoint from props) that the image covers, independent of the text column's height (W187). Use it for the blog cover (C1) and wire it, dormant, on `v4-hero`/`hw-hero` (`HERO_SRC` stays `null`; no visual change until a photo exists). Check the Home hero box is width-driven, not text-driven. | `D/blocks/ImageSlot.tsx`; `S/_home/sections/Hero.tsx` ~l.30–40; `S/hire-workers/_sections/Hero.tsx` | W187, W189 A3/A5 |

### B — page-level ×0.75 desktop step (from 1101; W190 A1a class)
| # | Item | Anchor |
|---|---|---|
| B1 | Calc: `xl:` twins for paddings, gaps and small type (page ≈ 15–18 % taller than the design at 1440; 180 `text-[Npx]` literals vs 41 twins today) + a route-local pin test with the 11 px floor. | `S/hiring-cost-calculator/_components/{card-ui,CalculatorSkeleton,CalculatorIsland,SalaryGuideView,QuotaView,PassCheckView}.tsx`; `_sections/{content,ui}.tsx` |
| B2 | Partner: twins for `p-7`, `px-6 py-6`, `lg:p-12`, `text-[24px]`, shadows. | `S/partner-with-us/_sections/*`, `_components/*` |
| B3 | About: `lg:pt-[70px] lg:pb-[88px]` → `xl:pt-[52.5px] xl:pb-[66px]` + twins for tracking, `max-w`, `w-[150px]`, `grid-cols-[7.5rem_1fr]`, gaps; lighten `OfficeCard`'s navy-band shadow on the pale surface (additive prop). | `S/about/page.tsx` ~l.130; `D/blocks/OfficeCard.tsx` ~l.36 |
| B4 | Calc `Stepper`/`RadioChips` ≤ 700 px (50 px / 1fr / 50 px; four equal chips) via an additive `stretch` prop — take it if the design reading is unambiguous, else record as a named D20 delta. | `D/islands/Stepper.tsx`; `D/primitives/RadioChips.tsx` |
| B5 | Re-check the pixel scores after the `#5f6e86` tertiary token (W205) and record the D20 delta line. | `globals.css` ~l.23; `src/design/tokens.ts` ~l.20 |

### C — blog article (`/en/blog/[slug]`; W206/W209)
| # | Item | Anchor |
|---|---|---|
| C1 | Cover height: design fixed 430 px at 701–1100 and 190 px ≤ 700 → the A8 cover mode (never a caller class). | `S/blog/[slug]/page.tsx` ~l.264 |
| C2 | Body/sidebar stack gap at 701–900: `gap-14` → `max-lg:gap-8`. | `S/blog/[slug]/page.tsx` ~l.271 |
| C3 | Page-local literals in `[slug]/page.tsx`, `ArticleBody.tsx`, `_lib/sidebar.ts` get `xl:` twins + a route-local pin test; body 16 vs 16.5 px ≤ 700 and the three-line hero sub at 1440 are accepted if the twins do not fix them — record. | `S/blog/[slug]/**` |

### D — CLS and layout
| # | Item | Anchor | Source |
|---|---|---|---|
| D1 | `Stat` count-up: stack an invisible final-value copy in the same grid cell (CLS 0.0065 About / 0.0035 Home → 0). | `D/primitives/Stat.tsx` ~l.89–91 | W196 A2 |
| D2 | Contact live pills: pure `liveStatusLines()` + invisible stacked lines with `tabular-nums` (exact code in `.superpowers/sdd/wp2b/task-7-review.md`). | `S/contact/_lib/live-status-text.ts`; `_components/LiveStatus.tsx` ~l.41–47; `sections.test.tsx` ~l.153 | W197(c) |
| D3 | Thank-you `container-site max-w-[720px]` never applies (unlayered `.container-site` wins): width limit on an inner wrapper; pin with a test. | `src/app/[locale]/(minimal)/thank-you/page.tsx` ~l.59 | W178, T13 note |

### E — perf budget (decided by Part 1's local js-size; W210 thresholds = preview line − 2,836 B offset, W162)
| # | Item | Condition |
|---|---|---|
| E2 | Gate `StickyCtaBar` on the Verify pages through server `next/dynamic` (≈ 0.7–1.2 KB). | a verify route reads ≥ 189,664 B locally |
| E3 | `/iletisim`: topic-card glyphs as server props → `VisitBooking` behind `LazyIsland` → the callback subtree, in that order, until under the line. | `/iletisim` reads ≥ 191,724 B locally (the stop line) |

### Proof and records
One capped build; one `npm run start` (own background command, 7,200,000 ms limit); Playwright half; `rm -rf .lighthouseci lighthouse-report`; Lighthouse half (34 URLs); `npm run js-size` (every route; the table goes in the report and the ledger); pixel for Home, Hire, Calc, Blog article (EN; two-iteration cap per page; W189 web-font forcing); W194 spot-check `/ortak-olun#track-sourcing`; kill the server; `pgrep` clean; delete `.lighthouseci lighthouse-report playwright-report test-results .pixel`. Stop and report on any gate red you did not predict. Records: `docs/ARCHITECTURE.md` D19 (≤ 600 rule) + D20 named deltas; `docs/SEO.md` only if an LCP element changed; the `Final pass` ledger row; `docs/superpowers/handoff-2026-09-25/wp2a-sdd/progress.md` line is the controller's. Report: `.superpowers/sdd/wp2b/final-pass-part1-report.md`.
