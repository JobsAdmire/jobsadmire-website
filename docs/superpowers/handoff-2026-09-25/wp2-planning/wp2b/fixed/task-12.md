### Task 12: Blog index + article — `/blog` · `/en/blog` and `/blog/[slug]` · `/en/blog/[slug]` (written articles only; the D27 pixel page is the article)

**Where this task runs.** Worktree `/Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2`, branch `wp2/foundation` (every foundation name below was read in the code at `016fad0`; re-verified at the 2026-10-01 recheck against `36d6bd9` — no `src/`, `e2e/`, `scripts/`, `contract/` or shared-doc change since). Execution order W99: T1 → T13 → T2 → T3 → … → T11 → **T12** → T14 → T15 — so WP2a Tasks 1–9 and the page tasks T1, T13, T2–T11 are in the tree when this task starts: T1 created `docs/SEO.md`'s `## Pages` table (columns `Page | Route (tr · en) | Title source | Canonical | JSON-LD | LCP slot | Notes`), `docs/ANALYTICS.md`'s `### Page instrumentation (WP2b)` list, the per-page `sys.*` bullet list at the end of `docs/CONTENT-MODEL.md` § `### Adding copy (W9, W23, W54)`, the `## Ledger` table of `docs/superpowers/plans/2026-09-20-wp2b-pages.md` and the `e2e/pages/` folder; T2 renders `id="request-form"` on `/isci-talebi` and `/en/hire-workers`; T13 rewrote the robots sentence of `docs/SEO.md` § Robots to name `/blog` as the one noindex key still waiting for its page. Rules for the whole task: one heavy job at a time (memory rule); never push; never `git stash`; never rewrite a commit (W118); every commit verify-green with the low-memory line `npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1` (never `npm run verify`, `npm test` or `npm run e2e`); run `npx prettier --write <the files the cycle touched>` before that line (the snippets below are not guaranteed prettier-formatted: `printWidth` 100, single quotes, trailing commas); every command runs from the worktree root; commit bodies end with `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`.

**What these pages are in Phase A (W4, W5, W6, W28, W64).** The `blog` collection (`getCollection(bundle, 'blog')`, schema `BlogPostSchema` in `src/content/collections.ts`) holds 22 rows: `{ key, slug: {tr,en}, title: {tr,en}, excerpt: {tr,en}, category, categoryLabelId, author, publishedAt (ISO), readMinutes, hasBody: {tr,en}, body: {tr,en} }`, and `body[locale]` is non-null exactly when `hasBody[locale]` (a schema refine). The one written body is EN — `turkey-work-permit-process-employer-guide` (`body.en`, 2,552 characters of Markdown the importer composed from `blogarticle.025–063`, W64); there are **zero** Turkish bodies; the design's `blog-posts.js` gave only the card index. So: `/en/blog` shows one featured article, `/blog` shows the designed W6 "articles on the way" state with a link to the English index, `/en/blog/turkey-work-permit-process-employer-guide` is the one article, and every other slug — the TR slug of that article included — answers 404. Both routes are `noindex` from their page records (`bundle.pages.blog/blogArticle.robots = 'noindex'`), out of every nav group until `blogNavVisible(bundle)` (six Turkish bodies, `BLOG_NAV_THRESHOLD`, W4 — the chrome already gates the nav; this task only gates the related blocks), out of the sitemap (`NOINDEX_PATHNAMES`) and disallowed in `robots.txt` once their keys leave `UNBUILT_PATHNAMES` (W20/W37). Every hidden section is a component that renders nothing on empty data — nothing designed is deleted: the day a second written article or six Turkish bodies exist, the grid, the tools bar and the related blocks appear without a code change.

**No form.** The design's only form is the newsletter band (both pages). W5: it is hidden on every page until counsel clears (D14 — the door answers 404 for the inactive `newsletter` key); W97: the hidden band renders nothing and no empty `Section` wraps it. So the pages render `<NewsletterBand … active={NEWSLETTER_ACTIVE} />` (`false`, unwrapped — T6's pattern) and this task writes **no** `actions.ts`, no schema, no `FormShell` import (a dormant import would still put the forms kernel's ≈ 7–8 KB gz into the route's client graph — final review §2). The day the band is switched on, its task mounts `FormShell formKey="newsletter"` with `consent: 'checkbox'` + double opt-in (W79) behind an interaction. No catalog field is sent by this task.

**Header CTA and anchors (W17/W121/W152/W158).** Neither blog route has a `CTA_BY_PATHNAME` entry (and `/blog/[slug]` must never get one — a dynamic key hydrates differently on Turkish pages, W121), so the header renders `DEFAULT_CTAS`: primary `home.014` + `home.015` → `{ pathname: '/hire-workers', hash: '#request-form' }` (TR `/isci-talebi#request-form`, EN `/en/hire-workers#request-form`), secondary `home.008` → `/partner-with-us`. The launch sweep checks each anchor on the page its LINK points at (`scripts/launch/dead-targets.ts`), so `id="request-form"` is T2's to render on Hire Workers — the blog pages render no header anchor and edit nothing in `ctas.ts`. Their own in-page targets: `#articles` (index list), `#faq` (the article's FAQ heading, a TOC entry), `#blog-cta` (the closing band on both pages — the sticky bar's `hideNearId`), and the body headings' slug ids (TOC entries).

**Decisions this task records (cite as B-n; written into the docs in Cycles 1, 4 and 5):**

- **B-1 Index-only entries answer 404.** `findWritten(rows, locale, slug)` returns a post only when that locale has a body, a slug and a title; anything else calls `notFound()` (W151: Next 16.3.5 answers the `__next_error__` shell with status 404 and hydrates the chrome-wrapped `(site)/not-found.tsx` — accepted). The design's "In progress / Full guide is being written" panel (`blogarticle.077–080`) and its "Article not found" (`blogarticle.138/139`) are not ported: CONTENT-MODEL § Blog says index-only entries have no article to link to, and the site's own 404 is the one 404.
- **B-2 Related, prev/next and "Most read" render from data and are hidden today.** Related + prev/next render only while `blogNavVisible(bundle)` (W4: "related-article blocks hidden below the threshold") **and** another written same-locale article exists; `RelatedPosts` returns `null` otherwise and owns its `Section` (W97 analogue). "Most read" (`blog.031`, the hero's second float card `blog.030`) has no analytics source in Phase A → not rendered.
- **B-3 Cadence and dated claims are hidden (D17).** `blog.097` ("New article every week"), `blog.093/094` ("Weekly · New post") and `blog.027/028` ("— 2026", "8 min read") have no data row → not rendered. The hero float card is built from the featured row (category label, title, `author`, `formatReadMinutes`). `blog.025/026/032` ("English & Türkçe — 2 languages") render as authored: the site has exactly two locales.
- **B-4 The rotating h1 word (D20, WCAG 2.2.2).** The h1 is `sys.blog.hero.title` rendered with `sys.rich` — `{pre} <word></word>` in EN, `<word></word> {pre}` in TR, because `blog.095` ("Insights for" / "için içgörüler") sits before the word in EN and after it in TR (the package itself splits the sentence, W23). `RotatingWord` (client) renders the first word `sr-only` (what AT and crawlers read) and an `aria-hidden` stack of all five words in one CSS grid cell (only the current one visible — the box is always the widest word, so a rotation never reflows the heading: no CLS). It rotates every 2.6 s only after hydration, never under `prefers-reduced-motion`, and a `RotationToggle` button (Pause/Play, `sys.marquee.pause/play` passed as props) sits **outside** the h1 after the hero ticks, so the heading's name never contains a button label; the two islands share one tiny store (`_lib/rotation.ts`). The five words per locale are `sys.blog.hero.words` (no package id; TR capitalised because the word opens the sentence, as the design does).
- **B-5 The tools bar is dormant in Phase A.** Search (`SearchInput`), topic chips (`RadioChips`; a `BottomSheet` on phones), a reset button, the result count and the no-results panel mount only from `TOOLS_MIN_POSTS` = 6 non-featured written articles — never in Phase A. It is client-only (`next/dynamic` with `ssr: false` inside the `'use client'` `PostFilterLoader`, W13 amended; legal only inside a client module — final review §6) in a slot with a reserved height (no CLS), and filters the server-rendered cards by toggling their `hidden` attribute (no `sys` namespace on the client, W148 — every label arrives resolved). Not ported: the design's in-page EN|TR post toggle (the route locale is the language) and "Load more" (`blog.090` — the written list is short; every match shows). The bar sits at the top of the articles section, not inside the dark hero.
- **B-6 Newsletter (W5/W97).** See "No form" above: `NEWSLETTER_ACTIVE = false`, the band unwrapped, no action/form/FormShell in this task.
- **B-7 LCP = the h1 on both pages.** The index hero slot `blog-hero` and the article cover `blog-cover-<key>` (W103 — the same asset PostCard shows) are named gradient placeholders (§10 row 4 covers only Homepage/Hire Workers photography); D26 forbids a placeholder LCP slot, so `data-lcp-slot="h1"` sits on each h1 and no placeholder carries it. A CSS gradient is not an LCP candidate, so the h1 is also what Lighthouse measures.
- **B-8 Markdown = a hand-written block parser + a server renderer** (`[slug]/_lib/markdown.ts` → `ArticleBody`), no dependency, no HTML string, no sanitiser, no client JS (W28/W64). The grammar is exactly what the importer writes (and what the Phase B editor may write): blank-line-separated blocks; `## ` headings (slug ids for the TOC); paragraphs with `**bold**`; `- ` lists; `1. ` steps; `**lead** — body` rule cards (consecutive ones merge into a 2-up grid); a blockquote whose first line is `**Title**` followed by `- ` items is the Key-takeaways box; any other blockquote is a pull quote. Unknown syntax renders as text. No `{metric}` placeholder exists in a v1 body, so the body is not passed through `fill`.
- **B-9 Breadcrumbs are this page's own ids (W109).** Index: `blog.022` → `/`, `blog.004` → `/blog`. Article: `blogarticle.022` → `/`, `blogarticle.004` → `/blog`, the article's title → itself (`Crumb.href` is required, so the design's text-only category crumb becomes the hero's category pill — accepted page-local by the reconcile rulings). One `Breadcrumbs` per page (one `BreadcrumbList`, one breadcrumb landmark — final review §6 page rule).
- **B-10 FAQ copy the package lacks, numbers from data (D17).** A1 is `sys.blog.faq.a1` with `{permitDays}` ("45") and `{firstDayWeeks}` ("6–8") from `metricValues(bundle, locale)`; Q3 is `sys.blog.faq.q3` with `{ratio}` from `formatInt(getRateConfig(bundle).quotaRatio, locale)` ("5"). The other six FAQ strings are `blogarticle.127–132` (129 legal-flagged, verbatim). One `FaqBlock` per page (one `FAQPage`).
- **B-11 The body's closing CTA sits inside the final quote box.** `blogarticle.064` ("Talk to a permit specialist →") is a `ContactCta` (WhatsApp, `page_cta`, static prefill `sys.whatsapp.prefill` + `sys.blog.whatsapp.permit`) that `ArticleBody` renders inside the last block when it is a quote (the design's box), else after the body.
- **B-12 The mobile collapsible body sections are not ported (D20)** — the body is always expanded; the ≤700 px TOC is a native `<details>` (zero JS) listing the same entries as the desktop scroll-spy TOC.
- **B-13 The JS lazy pass (W13 amended, final review §2).** The article sidebar — `ScrollSpyToc` (string props `remainingSingular`/`remainingPlural`, W85) + `ShareRow` (with `copyFailed`, W133) + `PrintButton` — is ONE `LazyIsland` (W132) behind a `'use client'` binder, with a server fallback that is DOM-identical to the island's first render (a unit test compares the two with `renderToStaticMarkup`); on phones the TOC card is hidden and the share card sits below the body, so the island loads only when scrolled to. The reading-progress bar, the ≤700 px back-to-top button and the sticky CTA bar load on the visitor's first scroll (`next/dynamic` `ssr: false` inside the `'use client'` `ScrollEnhancementsLoader`; before any scroll the bar is at 0 %, the button and the sticky bar are hidden anyway). Lighthouse (mobile, no scroll) therefore fetches none of them. The only eager islands are the index's `RotatingWord` + `RotationToggle` (above the fold). The reading bar is a decorative 3 px `aria-hidden` strip driven by `useScrollProgress`, not the `ProgressBar` island the brief lists: that island is a labelled `role="progressbar"` form-progress control (announcing scroll position is noise), and its fixed 8 px `h-2` track cannot become the design's 3 px strip without a same-property caller class (W122).
- **B-14 Gate routes.** `/blog`, `/en/blog` and `/en/blog/turkey-work-permit-process-employer-guide`, all `indexable: false` (axe, width sweep and the placeholder counter sweep them; Lighthouse and the sitemap never do); no TR article row (0 TR bodies). A unit test pins the article row to the newest written EN slug of the committed bundle, so a content change fails a test, not the gate. `npm run js-size` measures noindex routes only through `--routes` (W94).
- **B-15 Metadata (W124, W38, W169).** Index: `sys.seo.blog.{title,description}` (the record has `''` ids), `localeAlternates('/blog')` (both locales exist). Article: `pageKey: 'blogArticle'` (the template record carries no SEO field, so the article's own values win), title `sys.blog.article.metaTitle` (`{title} | JobsAdmire`), description = the excerpt, `alternates` = only the locales whose body exists (`articleAlternates`), `openGraph: { type: 'article', publishedTime, authors, images }`. The title template deliberately does NOT live at `sys.seo.blogArticle.title` (W169): the OG route renders `sys.seo.<pageKey>.title` with no arguments (`ogTitle` in `src/lib/seo/og.ts`), so a `{title}` template there would print raw on every article's image — instead the article's OG image and its `BlogPosting` image are the index's `/og/<locale>/blog.png` (`openGraph.images`), and a test pins that `sys.seo.blogArticle` does not exist. That is W169's rule for every template page: it reuses its index's OG image through `buildMetadata`'s `openGraph.images`, and its per-item title template lives under `sys.<page>.*` (here `sys.blog.article.metaTitle`), never under `sys.seo.*` (cost if wrong: a generic OG image on the article pages — acceptable).
- **B-16 `PrintButton` (the brief's island list).** A "Print this article" button in the sidebar's share card prints the `.print-isolate` region — a print-only title/byline plus the body (`globals.css`: `body.print-isolating`); the design has no print control, so it is a named delta.

**Design deltas named for the pixel harness (D27; `docs/superpowers/plans/2026-09-20-wp2-pixel-harness.md` classes (a)–(d)):** (a) D20 — CTA faces (`blue-safe` primary, `success` WhatsApp in the sticky bar, `secondary` white primary on the gradient band, ink-text `secondary` in the sidebar card whose gradient darkens to `blue-safe` → `navy` for contrast), `text-blue-safe` for the lead-card leads, the takeaways head and the author badge (the design's `#1899D5` is 3.2:1), the rotating word's Pause/Play button, the as-built `ScrollSpyToc`/`ShareRow`/`StickyCtaBar` faces (pill share buttons with text, the navy sticky bar), the always-expanded mobile body and `<details>` TOC (B-12); (b) W4/W5/W6/W97/W103/W109 — no newsletter band, the W6 TR empty state, no related/prev-next (B-2), no "Most read"/cadence/"2026" pieces (B-2/B-3), no "In progress" panel (B-1), crumbs Home / Blog / title (B-9), `blog-cover-<key>` slot, the print button (B-16), the TOC's FAQ entry `blogarticle.126` and the body headings' own text for the others (the design's short `blogarticle.124/125` are one article's labels), the list styles of B-8 (every `- ` list is one neutral list — a checklist grid when all items are short; the design's amber "mistakes" box needs a grammar marker v1 lacks); (c) capture noise — the rotating word, the fixed progress bar/back-to-top/sticky bar, the FAB and mobile bottom bar, the static hero float card (no float animation), the height of hidden Phase A sections; (d) anything else is a defect, fixed within the two-iteration cap.

**Files:**

Create
- `src/app/[locale]/(site)/blog/_lib/posts.ts` — `TOOLS_MIN_POSTS`, `RELATED_MAX`, `otherLocale`, `isWritten`, `writtenPosts`, `splitFeatured`, `findWritten`, `type ArticleHref`, `articleHref`, `articleAlternates`, `relatedPosts`, `prevNext`, `categoryOptions`, `filterItems` (pure; server callers)
- `src/app/[locale]/(site)/blog/_lib/filter.ts` — `POST_LIST_ID`, `ALL`, `type FilterItem`, `matchKeys`, `countLabel` (pure, client-safe: the tools island imports it)
- `src/app/[locale]/(site)/blog/_lib/rotation.ts` — the shared Pause/Play store (plain module, client-safe)
- `src/app/[locale]/(site)/blog/_lib/scroll-arm.ts` — the first-scroll latch (plain module, client-safe)
- `src/app/[locale]/(site)/blog/_components/RotatingWord.tsx` — `'use client'`
- `src/app/[locale]/(site)/blog/_components/RotationToggle.tsx` — `'use client'`
- `src/app/[locale]/(site)/blog/_components/PostFilter.tsx` — `'use client'` (the dormant tools island)
- `src/app/[locale]/(site)/blog/_components/PostFilterLoader.tsx` — `'use client'` (`next/dynamic`, `ssr: false`)
- `src/app/[locale]/(site)/blog/_components/ScrollEnhancements.tsx` — `'use client'` (progress bar, back-to-top, sticky bar)
- `src/app/[locale]/(site)/blog/_components/ScrollEnhancementsLoader.tsx` — `'use client'` (first-scroll `next/dynamic`)
- `src/app/[locale]/(site)/blog/_components/HeroArt.tsx` — server (no directive)
- `src/app/[locale]/(site)/blog/_components/PostList.tsx` — server
- `src/app/[locale]/(site)/blog/page.tsx`
- `src/app/[locale]/(site)/blog/[slug]/_lib/markdown.ts` — the v1 body grammar (pure)
- `src/app/[locale]/(site)/blog/[slug]/_lib/sidebar.ts` — the class strings and the remaining-time text the sidebar island and its fallback share (pure)
- `src/app/[locale]/(site)/blog/[slug]/_components/ArticleBody.tsx` — server
- `src/app/[locale]/(site)/blog/[slug]/_components/ArticleSidebar.tsx` — `'use client'` (the lazy island)
- `src/app/[locale]/(site)/blog/[slug]/_components/ArticleSidebarFallback.tsx` — server (DOM-identical fallback)
- `src/app/[locale]/(site)/blog/[slug]/_components/ArticleSidebarIsland.tsx` — `'use client'` (`LazyIsland` binder)
- `src/app/[locale]/(site)/blog/[slug]/_components/RelatedPosts.tsx` — server
- `src/app/[locale]/(site)/blog/[slug]/page.tsx`
- Tests: `src/app/[locale]/(site)/blog/__tests__/posts.test.ts`, `…/blog/__tests__/sys-keys.test.ts`, `…/blog/__tests__/islands.test.tsx`, `…/blog/__tests__/index-sections.test.tsx`, `…/blog/__tests__/gate-row.test.ts`, `…/blog/[slug]/__tests__/markdown.test.ts`, `…/blog/[slug]/__tests__/ArticleBody.test.tsx`, `…/blog/[slug]/__tests__/ArticleSidebar.test.tsx`
- `e2e/pages/blog.spec.ts`

Modify
- `src/messages/en.json`, `src/messages/tr.json` — a `blog` member inside the existing `sys.seo` object, and a new `sys.blog` object placed immediately before `sys.form` (T8's convention); identical key sets (Cycle 2)
- `src/lib/seo/routes.ts` — `UNBUILT_PATHNAMES`: delete the line `'/blog',` (Cycle 4) and the line `'/blog/[slug]',` (Cycle 5); nothing else
- `e2e/routes.ts` — `GATE_ROUTE_TABLE`: append `{ path: '/blog', indexable: false }` and `{ path: '/en/blog', indexable: false }` (Cycle 4), then `{ path: '/en/blog/turkey-work-permit-process-employer-guide', indexable: false }` (Cycle 5), as the literal's last entries
- `docs/CONTENT-MODEL.md` — § `## Blog` (the v1 body grammar, Cycle 1) and one bullet in the per-page list at the end of `### Adding copy (W9, W23, W54)` (Cycle 2, W98)
- `docs/SEO.md` — two rows in T1's `## Pages` table (index Cycle 4, article Cycle 5), the § Robots "Today that is …" sentence (Cycle 4), one "**As built (WP2b T12):**" paragraph after the § JSON-LD table (Cycle 5)
- `docs/ANALYTICS.md` — one bullet under `### Page instrumentation (WP2b)` (Cycle 5; no new event, parameter or enum value)
- `docs/ARCHITECTURE.md` — one sentence in § Quality gate (D27) after "**a route above 194,560 B gets a lazy-loading pass before the next page task starts**." (Cycle 5)
- `docs/PRD.md` — §2, the table rows whose page cells are `Blog index` and `Blog article` (their last cells), and the §11 sentence beginning "**Not yet built, by design (WP2 and later):**", edited in place (Cycle 5, W45)
- `docs/superpowers/plans/2026-09-20-wp2b-pages.md` — the T12 row of the `## Ledger` table (Cycle 7)

Test
- Vitest: the eight files above (matched by `vitest.config.mts`'s `src/**/*.test.{ts,tsx}`; `[locale]`, `(site)` and `[slug]` are literal directory names the glob walks), plus the guards this task must keep green: `src/lib/seo/unbuilt.test.ts` (W20 — red while a `page.tsx` and `UNBUILT_PATHNAMES` disagree), `src/lib/seo/routes.test.ts`, `src/app/robots.test.ts`, `src/app/sitemap.test.ts`, `src/messages/messages.test.ts` (TR/EN key parity), `src/messages/voice.test.ts` (W154 over all of `sys.*`), `src/i18n/client-messages.test.ts` (W148 — no client module of this task reads `sys`), `src/design/__tests__/client-imports.test.ts` (W147/W156/W158 — by-path imports, type-only included; no message file or `formatReadMinutes` in the client graph), `src/design/__tests__/class-collisions.test.ts` (W122/W155 — walks `src/app/**`), `src/design/blocks/__tests__/rsc-imports.test.ts` (W125/W130/W134), `scripts/gate-routes.test.ts` (the TR/EN halves of the INDEXABLE rows stay equal — the blog rows are `indexable: false`).
- Playwright: `e2e/pages/blog.spec.ts` (both projects, `mobile` Pixel 7 and `desktop` 1440×900), run inside Cycle 7's gate; `e2e/a11y.spec.ts`, `e2e/width-sweep.spec.ts` and the D26 placeholder counter pick the three routes up from `GATE_ROUTES`; `e2e/seo.spec.ts` keeps asserting that no `/blog` URL is in the sitemap.

**Interfaces:**

Consumes (exact names, verified in the code at `016fad0`; import paths exactly as written — never a barrel, type-only imports included, W125/W134/W147/W156):
- Content: `getBundle(locale)` (`server-only`, React `cache`), `makeT`, `makeTf`, `metricValues` from `@/content/adapter` (`export * from './pure'`) in pages; `makeT`/`makeTf` from `@/content/pure` in components (`makeT(bundle)(id)` throws on an unknown id outside production; `makeTf(bundle, locale)` fills D17 `{metric}` placeholders; `metricValues(bundle, locale): Record<string, string>` — `permitDays` "45", `firstDayWeeks` "6–8"); `getCollection(bundle, 'blog')`, `blogNavVisible(bundle)`, `BLOG_NAV_THRESHOLD` (6), `getRateConfig(bundle)` (`quotaRatio` 5), `type BlogPost`, `type BlogCategory` (`'workPermits' | 'recruitment' | 'compliance' | 'marketNews'`) from `@/content/collections`; `BundleSchema`, `type Bundle` from `contract/website-bundle.v1` (relative: five `..` from `blog/page.tsx`, six from `blog/_components/`, `blog/__tests__/` and `blog/[slug]/page.tsx`, seven from `blog/[slug]/_components/` and `blog/[slug]/__tests__/`). Page records: `pages.blog` = `{ titleId: '', descriptionId: '', ogImage: null, canonical: null, robots: 'noindex', jsonLd: ['breadcrumb'] }`, `pages.blogArticle` = the same with `jsonLd: ['breadcrumb', 'article', 'faq']`. Categories label through `home.262–265` (`categoryLabelId`).
- Blocks (by path): `Breadcrumbs` (`@/design/blocks/Breadcrumbs`; `{ locale, items: Crumb[], tone?: 'light' | 'dark', className? }`, `Crumb = { name: string; href: Href }` — the last crumb renders as `aria-current="page"` text; one `BreadcrumbList`); `PostCard` (`@/design/blocks/PostCard`; `{ bundle, locale, post, variant?: 'card' | 'row' | 'featured', categoryLabel?, coverSrc?, headingLevel?: 2 | 3 }` — renders `null` without a slug/title in the locale, the `featured` variant carries its own `blog.034` pill, the byline is `text-text-tertiary` (W128), the cover is `ImageSlot` `blog-cover-<key>`); `EmptyState` (`@/design/blocks/EmptyState`; `{ title, body?, cta?, tone?, icon?, headingLevel?: 2 | 3, testId?, className? }`, `role="status"`); `ImageSlot` (`@/design/blocks/ImageSlot`; `{ slot, lcp?, src?, alt, width, height, sizes?, className?, priority? }` — no `src` → a gradient `div data-placeholder={slot}` owning `aspect-ratio`, `alt=""` → `aria-hidden`; W129: never a `w-*`/`h-*`/`aspect-*`/`object-*` class — wrap it); `NewsletterBand` (`@/design/blocks/NewsletterBand`; `{ bundle, locale, active, id? = 'newsletter', children? }`, `null` when `active` is false); `ClosingCtaBand` + `type Cta` (`@/design/blocks/ClosingCtaBand`; `{ bundle, locale, titleId, bodyId?, primary: Cta, secondary?: Cta, extra?: Cta[], ticks?: string[], tone?: 'navy' | 'gradient' | 'green', id? }`, `Cta = { label; href: string | Exclude<Href, string>; external?; variant?: ButtonVariant }` — every CTA through `ContactCta` `page_cta`; ticks render `md:hidden`; secondary/extra default to `inverse` on gradient); `ContactCta` (`@/design/blocks/ContactCta`; `{ placement: 'page_cta' | 'office_card', href: string | Exclude<Href, string>, variant?, size?, external?, className?, 'aria-label'?, children }` — `tel:`/`mailto:`/`wa.me` → `ContactLink` (fires `whatsapp_click`/`call_click`/`email_click`), an object href → next-intl `Link` in the button face, W82); `FaqBlock` + `type FaqItem` (`@/design/blocks/FaqBlock`; `{ bundle, locale, items: FaqItem[], id? = 'faq', eyebrowId?, headingId?, bodyId?, askCard?, singleOpen? = true, openFirst?, headingLevel? = 3, footer? }`, `FaqItem = { id, q, a }` resolved strings; no side column when none of `eyebrowId/headingId/bodyId/askCard` is given; one `FAQPage`).
- Primitives (by path): `Section` (`@/design/primitives/Section`; `{ tone: 'light' | 'dark' | 'pale' | 'band', id?, className?, children }` — tones set the surface and `py-16`/`py-10`; a longhand `pb-*`/`pt-*` override is fine, W122; no test-id prop, W113); `Button`, `buttonClassName(variant, size = 'md', className?)`, `type ButtonVariant` (`@/design/primitives/Button`; variants `primary|secondary|ghost|danger|inverse|success|inverse-dark|nav`; no `href` → `<button type="button">`, spreads `data-*`/`onClick`); `RadioChips` + `type RadioChipOption` (`@/design/primitives/RadioChips`, `'use client'`; `{ name, options, value, onChange, legend, legendHidden?, className? }`).
- Islands (by path, every module `'use client'`, W130/W134): `LazyIsland` (`@/design/islands/LazyIsland`; `{ load, props, fallback, rootMargin? = '200px' }` — no `ssr` prop (W132); the fallback renders on the server and until the wrapper nears the viewport, then the island loads once and stays; a rejected `load()` keeps the fallback); `ScrollSpyToc` + `type TocHeading` (`@/design/islands/ScrollSpyToc`; `{ headings, label, heading?, readMinutes?, remainingLabel?, remainingSingular?, remainingPlural?, offsetPx? = 96, className? }` — `<nav aria-label={label}>`, the first heading `aria-current="location"` on the server, the remaining line `(n === 1 ? singular : plural).replace('{n}', n)`); `ShareRow` + `type ShareLabels` (`@/design/islands/ShareRow`; `{ url, title, labels, className? }`, `ShareLabels = { heading, share, whatsapp, linkedin, x, copy, copied, copyFailed? }` — W133; Web Share button only after hydration where `navigator.share` exists); `PrintButton` (`@/design/islands/PrintButton`; `{ label, variant? = 'secondary', className? }` — prints the `.print-isolate` region, itself `print-hidden`); `useScrollProgress` (`@/design/islands/useScrollProgress`; `(): number` 0…1, 0 on the server); `SearchInput` (`@/design/islands/SearchInput`; `{ id, label, value, onChange, placeholder?, clearLabel, resultText?, hideLabel?, className? }`); `BottomSheet` (`@/design/islands/BottomSheet`; `{ open, onClose, title, closeLabel, children, className? }` — renders nothing while closed).
- Chrome (by path): `StickyCtaBar` + `type StickyCta` (`@/design/chrome/StickyCtaBar`, `'use client'`; `{ message, ctas: StickyCta[], showAfterPx? = 700, hideNearId?, live? }`, `StickyCta = { label, href: string | Exclude<Href, string>, variant?, external? }` — every CTA through `ContactCta` `page_cta` (W81), `data-testid="sticky-cta"`, hidden below `lg`); icons `CheckIcon`, `WhatsAppIcon`, `LinkedInIcon`, `XIcon`, `LinkIcon` (`@/design/chrome/icons`, no directive, `aria-hidden` SVGs); `DEFAULT_CTAS`/`CTA_BY_PATHNAME` (`src/design/chrome/ctas.ts`, read only).
- i18n/SEO/contact/format: `routing`, `locales`, `type Locale` (`@/i18n/routing`; pathnames `'/blog': '/blog'`, `'/blog/[slug]': '/blog/[slug]'` — TR at the root, EN under `/en`); `getPathname`, `type Href` (`@/i18n/navigation`); `NextLink` (`next/link`, for the one cross-locale link, as the chrome's `LanguageSwitcher` does); `hasLocale` (`next-intl`); `getTranslations({ locale, namespace })` (with `.rich` and `.raw`), `setRequestLocale` (`next-intl/server`); `buildMetadata({ locale, href, bundle, pageKey, fallbackTitle, fallbackDescription, alternates?, openGraph? })` + `type AlternateTarget` (`string | Exclude<Href, string>`) from `@/lib/seo/metadata` (`''` record ids → the fallbacks; `alternates` → only the given locales plus the page's own and `x-default` = TR when TR exists, else the page's own; `openGraph.type === 'article'` → `publishedTime`/`authors`; `openGraph.images` wins over the generated image); `absoluteUrl(locale, href)`, `pageOgImageUrl(locale, pageKey)`, `UNBUILT_PATHNAMES` (edited) from `@/lib/seo/routes`; `articleJsonLd({ headline, description, url, image, datePublished, dateModified?, authorName, authorType?, publisherSettings, locale })` from `@/lib/seo/jsonld`; `JsonLd` from `@/lib/seo/JsonLdScript`; `waLink(number, text)` from `@/lib/contact`; `formatDate(iso, locale)` from `@/lib/format/date/formatDate` (TR `12 Haziran 2026`, EN `12 June 2026`); `formatReadMinutes(n, locale)` from `@/lib/format/date/formatReadMinutes` (its OWN module — it imports both message files, so server modules only, W158); `formatInt(n, locale)` from `@/lib/format/money`.
- Messages consumed, not added: `sys.nav.breadcrumbs` (the `Breadcrumbs` landmark), `sys.marquee.pause`/`sys.marquee.play` (read on the server, passed to `RotationToggle` as props), `sys.whatsapp.prefill` (the visitor-voice greeting every wa.me prefill starts with).
- Test helpers: `renderWithIntl(ui, { locale? })` (`@/test/render`, the real catalogues); `testBundle({ strings?, collections?, settings? })` and `BLOCK_STRINGS` (`@/test/bundle`; `blog.034/077/081` included); `collisionsInTree(root)` (`@/test/class-collisions`).
- Gate tooling: `GATE_ROUTE_TABLE` (`e2e/routes.ts`), `expectedRobots(baseUrl)` (`e2e/helpers/face.ts`, W135), `npm run gate` (`scripts/gate.sh`: Playwright on both projects, then Lighthouse over `INDEXABLE_GATE_ROUTES`, then `js-size`), `npm run js-size -- --routes=<paths>` (W94 — `lhci collect` over the given routes into `.lighthouseci-extra`, never asserted), `npm run pixel -- --page=blog-article --locale=en --widths=390,900,1440` (`scripts/pixel-compare.ts`: page key `blog-article`, route resolved from the first EN row with a body; `--locale` defaults to `tr`, which has no body and is skipped with exit 0 — W138).
- Ops catalog: nothing — this task sends no form (B-6).

Produces (nothing later tasks import):
- DOM — index: `h1[data-testid="page-h1"][data-lcp-slot="h1"]` holding `[data-testid="hero-word-static"]` (sr-only first word) and `[data-testid="hero-word-live"]` (the aria-hidden stack; the visible word carries `data-current`), `[data-testid="hero-word-toggle"]`, `[data-testid="blog-hero-art"]` (featured only), `section#articles` with `[data-testid="blog-featured"]` + `[data-testid="blog-grid"]` (`ul#blog-grid`, rows `li[data-post-key]`) or `[data-testid="blog-empty-wrap"]` → `[data-testid="blog-empty"]` + `a[data-testid="blog-empty-cta"]`, `[data-testid="blog-tools-slot"]` (≥ 6 non-featured written posts only), `#blog-cta` (closing band), placeholder `blog-hero`, `[data-testid="reading-progress"]` (after the first scroll).
- DOM — article: the h1 as above, `[data-testid="article-lang-note"]` (only when the other locale has a body), placeholder `blog-cover-<key>`, `[data-testid="article-toc-mobile"]` (`details`, ≤700 px), `[data-testid="article-body"]` (`.print-isolate`) with `[data-testid="article-takeaways"]` and `[data-testid="article-quote"]`, body `h2[id]` slugs, `h2#faq` + `#faq-list` (`FaqBlock`), `[data-testid="article-author"]`, `[data-testid="article-sidebar"]` (LazyIsland wrapper + the CTA card) with `[data-testid="article-share"]`, `[data-testid="article-related"]`/`article-prev`/`article-next` (hidden in Phase A), `#blog-cta`, `[data-testid="reading-progress"]`, `[data-testid="back-to-top"]`, `[data-testid="sticky-cta"]` (after scrolling, `lg` up).
- Data contract: the v1 Markdown grammar of B-8 (`[slug]/_lib/markdown.ts`) — what the Phase B editor may write; recorded in `docs/CONTENT-MODEL.md` § Blog (Cycle 1).

**Rulings applied:**
- W1/D17 — no number is typed into copy: FAQ A1/Q3 fill `{permitDays}`/`{firstDayWeeks}`/`{ratio}` from `metricValues`/`getRateConfig`; `blog.045`/`blogarticle.095` (`{homepageReplyHours}`) through `makeTf`; cadence/"2026"/"Most read" claims hidden (B-3); the mobile stats count is `formatInt(written.length)`; the read time and dates come from the row (`formatReadMinutes`, `formatDate`).
- W4 — written articles only (B-1); related/prev-next only from `blogNavVisible` (B-2); `noindex` from the records; the nav stays gated by the chrome; the blog leaves `NOINDEX_PATHNAMES` by hand later (not here).
- W5/W97/D14 — the newsletter band renders nothing, unwrapped; no form, no action, no `FormShell` (B-6).
- W6 — the TR index's designed empty state (`sys.blog.empty.*`) with the link to the English index; the EN index would show the mirror image if EN ever had none.
- W9/W23/W54 — 22 `sys.blog.*`/`sys.seo.blog.*` keys for id-less copy only; every other string is a package id by exact id; the only composed package strings are the package's own splits (`blog.095` around the word, `blog.023` + `blog.024`, `blog.025` + `blog.026`, `blog.091`/`092` after their values, `blogarticle.141` after the minutes).
- W12/W26 — no page event: the wa.me doors (quote CTA, sticky bar, closing band) and the header CTAs go through `ContactCta` → `ContactLink` (`page_cta`); share, copy, print, search and the rotating word fire nothing (not allow-listed).
- W13 amended/W120/W136 — the lazy pass of B-13; the ledger records `npm run js-size` (and `--routes` for these noindex routes, W94).
- W162 — the stop trigger for a LOCAL route figure is **191,724 B** (the binding 194,560 B less the ≈ 2,836 B by which the preview's `npm run js-size` runs above the local build); Cycle 7's 2c stops and reports at or above it, and the controller's binding preview decides at 194,560 B. B-13's planned pass stays: the unsplit article projects above 194,560 B, not into the 190,000–194,560 B band whose passes W162 leaves unwritten in advance; any further lever is the controller's call, scheduled before the next page starts.
- W17/W121/W152/W158 — no `ctas.ts` edit; `DEFAULT_CTAS`'s `#request-form` is checked on `/hire-workers` (T2); the pages render their own `#articles`/`#faq`/`#blog-cta`.
- W19/R31 — both routes in `(site)`; no `<main>` in a page (the layout owns `<main id="main">`).
- W20/W21/W37 — `'/blog'` leaves `UNBUILT_PATHNAMES` with the index page (Cycle 4; robots gains `Disallow: /blog` + `/en/blog`), `'/blog/[slug]'` with the article (Cycle 5; folded onto `/blog`); the three gate rows join `GATE_ROUTE_TABLE` and nowhere else.
- W27/W55/W103/D26 — `blog-hero` and `blog-cover-<key>` are named placeholders; exactly one `data-lcp-slot` per page (the h1), never on a placeholder.
- W28/W64 — the EN body renders through B-8's parser; no importer change (it already writes `body`).
- W33 — PostCard renders nothing without a slug/title in the locale; the pages pass written rows only.
- W38/W124 — index `sys.seo.blog.*` fallbacks; the article's own title/description/canonical/alternates win over the empty template record (B-15).
- W169 — the article is a template page and reuses its index's OG image: its `openGraph.images` and its `BlogPosting` image are `/og/<locale>/blog.png`; the per-article title template is `sys.blog.article.metaTitle` (`sys.<page>.*`), never `sys.seo.blogArticle.*`, and `sys-keys.test.ts` pins `sys.seo.blogArticle` absent in both locales (B-15).
- W76/W95 — every wa.me href carries only a static prefill (`sys.whatsapp.prefill` + `sys.blog.whatsapp.*`, the article title in one — page data, never visitor input).
- W79 — recorded for the newsletter's future activation (checkbox + double opt-in); nothing to wire here.
- W80/W109 — own-page crumbs (`blog.022`/`blog.004`, `blogarticle.022`/`blogarticle.004`); `sys.nav.home` is not needed.
- W81/W82 — the sticky bar keeps the design's WhatsApp + Request Workers buttons (tracked through `ContactCta`); object hrefs `{ pathname: '/hire-workers', hash: '#request-form' }` on the sidebar card, the sticky bar and both closing bands.
- W85/W132/W133 — `ScrollSpyToc` string props inside the client island; `LazyIsland({ load, props, fallback })` with a DOM-identical fallback; `ShareLabels.copyFailed`.
- W91/W104/W135 — the page spec's robots test is face-aware through `expectedRobots` (preview `Disallow: /` is asserted by `e2e/seo.spec.ts`; this spec asserts the production blog rules only on the production face).
- W92 — no door dependency; the e2e is deterministic door-less.
- W94 — `npm run js-size -- --routes=/blog,/en/blog,/en/blog/turkey-work-permit-process-employer-guide` fills the ledger's JS cells.
- W98/W45 — every doc edit appends to T1's shared shapes and anchors on headings/sentences, never line numbers; the ledger row is T1's format.
- W99/W106 — T12 runs after T11; each `page.tsx` lands in one commit with every component it imports (Cycles 3–4 for the index, Cycle 5 for the article).
- W113 — test ids sit on inner `<div>`s (or on a block's own `testId`), never on `Section`.
- W118 — no history rewrite, no `wip` commit, no stash.
- W119/W122/W155 — `hidden` only in prefixed form (`md:hidden`, `max-md:hidden`, `motion-reduce:hidden`) and `hidden print:block` (the base `hidden` with a variant display); no class string sets one property twice at one variant (shorthand + longhand such as `py-16`/`pb-32` is fine); no colour/box class reaches `Button`/`ContactCta` (`w-full`, `mt-3`, `print-hidden`, `motion-reduce:hidden` only); `class-collisions.test.ts` scans every file below and the render tests call `collisionsInTree`.
- W125/W130/W134/W147/W156/W158 — primitives, blocks, islands and the date functions by module path everywhere, type-only imports included; `formatReadMinutes` only in server modules (`HeroArt`, the article page; PostCard is the foundation's); no client module imports a message file, `@/content/*` or `@/lib/format/date/*`; server files never import `@/analytics/useContactClick`.
- W126/W164 — Cycle 7 is the one build + start + gate + `js-size` + pixel run (one capped build per proof attempt); the only second build is 2d's ONE conditional, sequential, scoped re-proof, allowed only for a D27 second pixel iteration or a W13 lazy pass — never a second `npm run gate`. The page e2e's red step is deferred to this proof (Cycle 6 compiles it; no interim build).
- W127/W128 — `success` for the sticky bar's WhatsApp; the gradient band keeps `inverse` for its WhatsApp and wears `secondary` for the primary; PostCard's byline is the block's `text-text-tertiary`.
- W129 — `ImageSlot` sized only by wrappers; no class reaches it.
- W138/W159/D27 — the pixel harness on `blog-article` in EN only (TR has no body — skipped with exit 0), two-iteration cap, like-for-like scores.
- W145/W146 — a localhost run wears the production face (`lighthouserc.local.json` = production: DevTools throttling, three runs, median); GTM stays dark. These routes are noindex, so the gate's Lighthouse never audits them; `js-size --routes` records their script size, LCP and performance medians.
- W148 — no `CLIENT_SYS` change: no client module calls `useTranslations`; every client string arrives as a prop (`sys.raw` for the two `{n}` templates).
- W150 — no D17 dated badge → no `revalidate` export.
- W151 — `notFound()` for unknown and index-only slugs (B-1) answers 404 with the accepted shell.
- W154 — no `sys.blog.*`/`sys.seo.blog.*` string speaks as "we"/"biz" ("JobsAdmire" is the subject; the three wa.me tails are the visitor's first-person singular); package lines in the company's first person ("our"/"we"/"us"/"let's"; TR "biz"/"-imiz"/1pl verbs — `blog.023/024/042/043`, `blogarticle.063/067/072/084/085/092/093/130/132`) render as authored and go on the WP-C sheet (W154 covers `sys.*` only).
- W157/W160 — security headers come from the middleware; nothing for the pages. W161 — no `url` field is sent.
- Final-review §6 drift list — applied: every island/primitive/block/date import by path (the draft's `@/design/islands`, `@/design/blocks`, `@/design/primitives`, `@/lib/format/date` barrel imports are gone); `@/lib/format/date` functions only in server modules; `ScrollSpyToc`'s `{n}` templates through `remainingSingular/Plural` (not `t()`-formatted — `sys.raw` / a composed `{n}` literal); the stale `StickyCtaBar` "foundation gap" deleted (W81 tracks the bar's contact CTAs); the ≈ 195–197 KB projection resolved by B-13 (and by B-6, which keeps `FormShell` out); one `Breadcrumbs` and one `FaqBlock` per page.
- Reconcile check findings for T12 — `sys.home` → own-page crumbs (W80/W109); newsletter `notice` → no form at all now, `checkbox` when activated (W79); untracked sticky-bar WhatsApp → tracked (W81); empty pale band → none (W97); `cover-<key>` → `blog-cover-<key>` (W103); noindex js-size → `--routes` (W94); production-only robots assertion → face-aware (W91/W104); TR pixel run → EN only (W138); `Cta`/`StickyCta`/`EmptyStateCta` string-only hrefs → object hrefs (W82); ScrollSpyToc wrapper → the as-built string props (W85); category crumb → accepted page-local (B-9).
- §10 rows 4/5/6 — gradient placeholders with the LCP rule enforced; `/blog` out of nav below six Turkish bodies; the newsletter off.
- D2/D13/D16/D18/D19/D20/D22/D23/D27 and R6/R15/R18/R20/R22/R28/R53/R56 — no identifiers in analytics; per-locale slugs and alternates; `formatInt`/`formatDate` per locale; unscaled breakpoints (`md` 701, `lg` 901) with `xl:` D19 steps on the article's own type; accessibility over pixels; Markdown v1, block editor v1.1; no fixture import (tests read the bundle with `readFileSync`); the pixel harness on the article; the `(site)` not-found; the chrome's canonical ids; browser facts read after hydration; the reduced-motion control hidden in CSS; same-tab internal links, `noopener` wa.me; a bad row throws in dev and degrades in prod; `/blog/*` is never a 410 prefix.

---

#### Cycle 1 — The data helpers and the v1 body grammar (pure modules, no route yet)

- [ ] **Step 1: Write the failing tests**

`src/app/[locale]/(site)/blog/__tests__/posts.test.ts`:

```ts
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { getCollection, type BlogPost } from '@/content/collections';
import { BundleSchema } from '../../../../../../contract/website-bundle.v1';
import { ALL, countLabel, matchKeys } from '../_lib/filter';
import {
  articleAlternates,
  articleHref,
  categoryOptions,
  filterItems,
  findWritten,
  isWritten,
  otherLocale,
  prevNext,
  relatedPosts,
  splitFeatured,
  writtenPosts,
} from '../_lib/posts';

// R56: the committed bundles are read with readFileSync, never imported (the ESLint rule
// forbids `content/local` under src/**).
const load = (locale: 'tr' | 'en') =>
  BundleSchema.parse(
    JSON.parse(
      readFileSync(join(process.cwd(), 'src/content/local', `bundle.${locale}.json`), 'utf8'),
    ),
  );

/** A full `BlogPost` row (the T0b schema) — override what a case needs. */
const post = (over: Partial<BlogPost> & { key: string }): BlogPost => ({
  slug: { tr: `${over.key}-tr`, en: over.key },
  title: { tr: 'Başlık', en: 'Title' },
  excerpt: { tr: 'Özet', en: 'Excerpt' },
  category: 'workPermits',
  categoryLabelId: 'home.263',
  author: 'JobsAdmire',
  publishedAt: '2026-01-01',
  readMinutes: 5,
  hasBody: { tr: true, en: true },
  body: { tr: 'metin', en: 'text' },
  ...over,
});

describe('the committed bundles (W4, W28, W64)', () => {
  it('EN has exactly one written article, TR has none', () => {
    expect(writtenPosts(getCollection(load('en'), 'blog'), 'en').map((p) => p.key)).toEqual([
      'turkey-work-permit-process-employer-guide',
    ]);
    expect(writtenPosts(getCollection(load('tr'), 'blog'), 'tr')).toEqual([]);
  });

  it('findWritten: the EN slug resolves; its TR slug, an index-only slug and an unknown slug do not (B-1)', () => {
    const en = getCollection(load('en'), 'blog');
    const tr = getCollection(load('tr'), 'blog');
    expect(findWritten(en, 'en', 'turkey-work-permit-process-employer-guide')?.key).toBe(
      'turkey-work-permit-process-employer-guide',
    );
    expect(findWritten(tr, 'tr', 'yabanci-isciler-calisma-izni-rehberi')).toBeNull();
    expect(findWritten(en, 'en', 'hiring-from-pakistan-turkish-employers')).toBeNull();
    expect(findWritten(en, 'en', 'does-not-exist')).toBeNull();
  });

  it('the written article advertises only its own locale — no TR body, no TR hreflang (B-15)', () => {
    const [article] = writtenPosts(getCollection(load('en'), 'blog'), 'en');
    expect(articleAlternates(article)).toEqual({
      en: {
        pathname: '/blog/[slug]',
        params: { slug: 'turkey-work-permit-process-employer-guide' },
      },
    });
  });
});

describe('the pure helpers', () => {
  const a = post({
    key: 'a',
    publishedAt: '2026-03-01',
    category: 'recruitment',
    categoryLabelId: 'home.265',
  });
  const b = post({ key: 'b', publishedAt: '2026-02-01' });
  const c = post({
    key: 'c',
    publishedAt: '2026-02-01',
    hasBody: { tr: false, en: true },
    body: { tr: null, en: 'x' },
  });
  const d = post({
    key: 'd',
    publishedAt: '2026-01-01',
    slug: { tr: null, en: 'd' },
    title: { tr: null, en: 'D' },
  });
  const t = (id: string) => `<${id}>`;

  it('isWritten needs a body, a slug and a title in the locale (CONTENT-MODEL § Blog)', () => {
    expect(isWritten(c, 'tr')).toBe(false);
    expect(isWritten(c, 'en')).toBe(true);
    expect(isWritten(d, 'tr')).toBe(false);
    expect(otherLocale('tr')).toBe('en');
    expect(otherLocale('en')).toBe('tr');
  });

  it('writtenPosts: newest first, a same-day tie keeps the collection order', () => {
    expect(writtenPosts([d, c, b, a], 'en').map((p) => p.key)).toEqual(['a', 'c', 'b', 'd']);
    expect(writtenPosts([d, c, b, a], 'tr').map((p) => p.key)).toEqual(['a', 'b']);
  });

  it('splitFeatured: the newest is featured, the rest is the grid', () => {
    const { featured, rest } = splitFeatured(writtenPosts([a, b, c], 'en'));
    expect(featured?.key).toBe('a');
    expect(rest.map((p) => p.key)).toEqual(['b', 'c']);
    expect(splitFeatured([])).toEqual({ featured: null, rest: [] });
  });

  it('relatedPosts: same category first, never the post itself, capped (B-2)', () => {
    const written = writtenPosts([a, b, c, d], 'en'); // a, b, c, d
    expect(relatedPosts(written, b).map((p) => p.key)).toEqual(['c', 'd', 'a']);
    expect(relatedPosts(written, b, 1).map((p) => p.key)).toEqual(['c']);
  });

  it('prevNext walks the newest-first list', () => {
    const written = writtenPosts([a, b, c, d], 'en');
    expect(prevNext(written, c)).toMatchObject({ prev: { key: 'b' }, next: { key: 'd' } });
    expect(prevNext(written, a).prev).toBeNull();
    expect(prevNext(written, post({ key: 'zzz' }))).toEqual({ prev: null, next: null });
  });

  it('categoryOptions: distinct categories in first-seen order, labels through t()', () => {
    expect(categoryOptions(writtenPosts([a, b, c], 'en'), t)).toEqual([
      { value: 'recruitment', label: '<home.265>' },
      { value: 'workPermits', label: '<home.263>' },
    ]);
  });

  it('articleHref / articleAlternates follow the per-locale slugs (D16)', () => {
    expect(articleHref(b, 'tr')).toEqual({ pathname: '/blog/[slug]', params: { slug: 'b-tr' } });
    expect(articleHref(d, 'tr')).toBeNull();
    expect(articleAlternates(b)).toEqual({
      tr: { pathname: '/blog/[slug]', params: { slug: 'b-tr' } },
      en: { pathname: '/blog/[slug]', params: { slug: 'b' } },
    });
    expect(articleAlternates(c)).toEqual({
      en: { pathname: '/blog/[slug]', params: { slug: 'c' } },
    });
  });

  it('filterItems lower-cases title + excerpt + category in the locale; matchKeys filters them (B-5)', () => {
    const x = post({ key: 'x', title: { tr: 'İŞÇİ Rehberi', en: 'X' } });
    const items = filterItems([x, a], 'tr', t);
    expect(items[0]).toEqual({
      key: 'x',
      category: 'workPermits',
      text: 'işçi rehberi özet <home.263>',
    });
    expect(matchKeys(items, ' REHBER ', ALL, 'tr')).toEqual(['x']);
    expect(matchKeys(items, '', 'recruitment', 'tr')).toEqual(['a']);
    expect(matchKeys(items, '', ALL, 'tr')).toEqual(['x', 'a']);
    expect(matchKeys(items, 'nothing', ALL, 'tr')).toEqual([]);
  });

  it('countLabel picks the singular only for exactly one', () => {
    const forms = { one: '{n} article', other: '{n} articles' };
    expect(countLabel(1, forms)).toBe('1 article');
    expect(countLabel(3, forms)).toBe('3 articles');
    expect(countLabel(0, forms)).toBe('0 articles');
  });
});
```

`src/app/[locale]/(site)/blog/[slug]/__tests__/markdown.test.ts`:

```ts
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { getCollection } from '@/content/collections';
import { BundleSchema } from '../../../../../../../contract/website-bundle.v1';
import { headingId, headings, parseInline, parseMarkdown } from '../_lib/markdown';

const SAMPLE = [
  'Intro paragraph with **bold** inside.',
  '> **Key takeaways**\n>\n> - First point\n> - Second **point**',
  '## Who can hire in Türkiye?',
  '**5 : 1 rule** — Five Turkish employees per foreign worker.',
  '**Capital** — At least the ministry threshold.',
  '- Contract\n- Passport',
  '## Steps',
  '1. **Offer.** Sign it.\n2. **File.** Submit it.',
  '> Closing quote.',
].join('\n\n');

describe('parseInline', () => {
  it('splits **bold** spans and keeps everything else as text', () => {
    expect(parseInline('a **b** c')).toEqual([
      { kind: 'text', text: 'a ' },
      { kind: 'strong', text: 'b' },
      { kind: 'text', text: ' c' },
    ]);
    expect(parseInline('plain')).toEqual([{ kind: 'text', text: 'plain' }]);
    expect(parseInline('<script>x</script>')).toEqual([
      { kind: 'text', text: '<script>x</script>' },
    ]);
  });
});

describe('headingId', () => {
  it('slugifies, folds Turkish letters to ASCII and never collides', () => {
    const used = new Set<string>(['faq']);
    expect(headingId("Documents you'll need", used)).toBe('documents-you-ll-need');
    expect(headingId('Türkiye’de kimler yabancı işçi çalıştırabilir?', used)).toBe(
      'turkiye-de-kimler-yabanci-isci-calistirabilir',
    );
    expect(headingId("Documents you'll need", used)).toBe('documents-you-ll-need-2');
    expect(headingId('FAQ', used)).toBe('faq-2'); // a reserved page id is never reused
    expect(headingId('???', used)).toBe('section');
  });
});

describe('parseMarkdown (the importer grammar, B-8)', () => {
  const blocks = parseMarkdown(SAMPLE);

  it('recognises every block kind in order', () => {
    expect(blocks.map((b) => b.kind)).toEqual(['p', 'callout', 'h2', 'leads', 'ul', 'h2', 'ol', 'quote']);
  });

  it('a blockquote of a bold title line + bullet items is the takeaways callout', () => {
    const callout = blocks[1];
    expect(callout.kind === 'callout' && callout.title).toBe('Key takeaways');
    expect(callout.kind === 'callout' && callout.items).toEqual([
      [{ kind: 'text', text: 'First point' }],
      [
        { kind: 'text', text: 'Second ' },
        { kind: 'strong', text: 'point' },
      ],
    ]);
  });

  it('consecutive "**lead** — body" paragraphs merge into one leads block', () => {
    const leads = blocks[3];
    expect(leads.kind === 'leads' && leads.items.map((i) => i.lead)).toEqual(['5 : 1 rule', 'Capital']);
  });

  it('numbered steps keep their bold lead as the first inline', () => {
    const ol = blocks[6];
    expect(ol.kind === 'ol' && ol.items[0][0]).toEqual({ kind: 'strong', text: 'Offer.' });
  });

  it('any other blockquote is a pull quote', () => {
    const quote = blocks[7];
    expect(quote.kind === 'quote' && quote.inlines).toEqual([{ kind: 'text', text: 'Closing quote.' }]);
  });

  it('headings() lists the h2s with their ids; reserved ids are skipped', () => {
    expect(headings(blocks)).toEqual([
      { id: 'who-can-hire-in-turkiye', text: 'Who can hire in Türkiye?' },
      { id: 'steps', text: 'Steps' },
    ]);
    expect(headings(parseMarkdown('## Steps', ['steps']))).toEqual([{ id: 'steps-2', text: 'Steps' }]);
  });

  it('CRLF, stray blank lines and a heading glued to its paragraph do not change the result', () => {
    expect(parseMarkdown(`${SAMPLE.replace(/\n/g, '\r\n')}\n\n\n`)).toEqual(blocks);
    expect(parseMarkdown('## Title\nText right under it.').map((b) => b.kind)).toEqual(['h2', 'p']);
  });

  it('unknown syntax is text, never markup', () => {
    const [p] = parseMarkdown('<img src=x onerror=alert(1)> [link](https://x)');
    expect(p.kind === 'p' && p.inlines).toEqual([
      { kind: 'text', text: '<img src=x onerror=alert(1)> [link](https://x)' },
    ]);
  });
});

describe('the committed EN body (W64) parses into the design structure', () => {
  const bundle = BundleSchema.parse(
    JSON.parse(readFileSync(join(process.cwd(), 'src/content/local/bundle.en.json'), 'utf8')),
  );
  const row = getCollection(bundle, 'blog').find(
    (p) => p.key === 'turkey-work-permit-process-employer-guide',
  );
  const blocks = parseMarkdown(row?.body.en ?? '', ['faq']);

  it('intro, takeaways, four H2 sections, two lead cards, three lists, five steps, one quote', () => {
    expect(blocks.map((b) => b.kind)).toEqual([
      'p',
      'callout',
      'h2',
      'p',
      'leads',
      'p',
      'h2',
      'ul',
      'h2',
      'ol',
      'h2',
      'ul',
      'quote',
    ]);
    expect(headings(blocks).map((h) => h.id)).toEqual([
      'who-can-hire-foreign-workers-in-turkiye',
      'documents-you-ll-need',
      'the-application-step-by-step',
      'mistakes-that-get-applications-rejected',
    ]);
    const callout = blocks[1];
    expect(callout.kind === 'callout' && callout.items).toHaveLength(4);
    const leads = blocks[4];
    expect(leads.kind === 'leads' && leads.items.map((i) => i.lead)).toEqual([
      '5 : 1 rule',
      'Capital / turnover',
    ]);
    const ol = blocks[9];
    expect(ol.kind === 'ol' && ol.items).toHaveLength(5);
  });

  it('carries no {placeholder} — v1 bodies are not passed through fill (B-8)', () => {
    expect(row?.body.en).not.toMatch(/\{[A-Za-z][A-Za-z0-9]*\}/);
  });
});
```

- [ ] **Step 2: Run to verify they fail**

```bash
NODE_OPTIONS=--max-old-space-size=4096 npx vitest run "src/app/[locale]/(site)/blog" --maxWorkers=1
```

Expected: both files fail to load — `Failed to resolve import "../_lib/posts"` / `"../_lib/filter"` / `"../_lib/markdown"`.

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/blog/_lib/filter.ts`:

```ts
import type { Locale } from '@/i18n/routing';

/** The grid the index tools island filters (B-5) — the server list renders it, the client island
 *  toggles its rows. Kept here, in a module with no runtime imports, because the island imports it:
 *  anything the island reaches is bundled into the client graph (W147/W158). */
export const POST_LIST_ID = 'blog-grid';

/** The chip value that stands for every category (the design's "All", blog.076). */
export const ALL = 'all';

/** One grid row as the island sees it: the post key, its category and the lower-cased words a
 *  visitor can search (title, excerpt, category label — built on the server by `filterItems`). */
export type FilterItem = { key: string; category: string; text: string };

/** The keys of the rows that match a query (trimmed, lower-cased in the page's locale — TR folds
 *  İ/I correctly) and a category. */
export function matchKeys(
  items: readonly FilterItem[],
  query: string,
  category: string,
  locale: Locale,
): string[] {
  const q = query.trim().toLocaleLowerCase(locale);
  return items
    .filter(
      (it) => (category === ALL || it.category === category) && (q === '' || it.text.includes(q)),
    )
    .map((it) => it.key);
}

/** `{n}` templates (read with `sys.raw`, so next-intl never formats them — W148 keeps
 *  `sys.blog` off the client): the singular only for exactly one. */
export function countLabel(n: number, forms: { one: string; other: string }): string {
  return (n === 1 ? forms.one : forms.other).replace('{n}', String(n));
}
```

`src/app/[locale]/(site)/blog/_lib/posts.ts`:

```ts
import type { BlogCategory, BlogPost } from '@/content/collections';
import { locales, type Locale } from '@/i18n/routing';
import type { AlternateTarget } from '@/lib/seo/metadata';
import type { FilterItem } from './filter';

/** B-5: the index tools bar mounts only from this many non-featured written articles (the
 *  design's page size) — never in Phase A. */
export const TOOLS_MIN_POSTS = 6;

/** B-2: the design's related grid shows three cards (the third hidden on phones). */
export const RELATED_MAX = 3;

export const otherLocale = (locale: Locale): Locale => (locale === 'tr' ? 'en' : 'tr');

/** CONTENT-MODEL § Blog (W4): a row is an article in `locale` only when that locale has a body,
 *  a slug and a title — an index-only entry has no article to link to (PostCard also needs the
 *  slug and the title, W33). */
export function isWritten(post: BlogPost, locale: Locale): boolean {
  return post.hasBody[locale] && post.slug[locale] !== null && post.title[locale] !== null;
}

/** The written articles of one locale, newest first; articles published the same day keep the
 *  collection order (`blog-posts.js`'s). ISO dates compare as strings. */
export function writtenPosts(rows: readonly BlogPost[], locale: Locale): BlogPost[] {
  return rows
    .map((post, index) => ({ post, index }))
    .filter(({ post }) => isWritten(post, locale))
    .sort((x, y) =>
      x.post.publishedAt === y.post.publishedAt
        ? x.index - y.index
        : x.post.publishedAt < y.post.publishedAt
          ? 1
          : -1,
    )
    .map(({ post }) => post);
}

/** The featured card is the newest written article; the grid holds the rest. */
export function splitFeatured(written: readonly BlogPost[]): {
  featured: BlogPost | null;
  rest: BlogPost[];
} {
  const [featured = null, ...rest] = written;
  return { featured, rest };
}

/** B-1: the written article behind `slug` in `locale`, or null — an unknown slug and an
 *  index-only entry both answer 404. */
export function findWritten(
  rows: readonly BlogPost[],
  locale: Locale,
  slug: string,
): BlogPost | null {
  return rows.find((p) => p.slug[locale] === slug && isWritten(p, locale)) ?? null;
}

/** The typed dynamic href next-intl's `Link`, `getPathname` and `buildMetadata` take. */
export type ArticleHref = { pathname: '/blog/[slug]'; params: { slug: string } };

export function articleHref(post: BlogPost, locale: Locale): ArticleHref | null {
  const slug = post.slug[locale];
  return slug ? { pathname: '/blog/[slug]', params: { slug } } : null;
}

/** D16 / docs/SEO.md § Per-locale slugs: hreflang only for the locales where this article is
 *  written — `localeAlternates` would advertise the other locale's slug, which 404s (B-1).
 *  `buildMetadata` adds the page's own locale and x-default itself. */
export function articleAlternates(post: BlogPost): Partial<Record<Locale, AlternateTarget>> {
  const out: Partial<Record<Locale, AlternateTarget>> = {};
  for (const locale of locales) {
    const href = isWritten(post, locale) ? articleHref(post, locale) : null;
    if (href) out[locale] = href;
  }
  return out;
}

/** B-2: same category first, then the newest others, never the post itself. */
export function relatedPosts(
  written: readonly BlogPost[],
  post: BlogPost,
  max = RELATED_MAX,
): BlogPost[] {
  const others = written.filter((p) => p.key !== post.key);
  return [
    ...others.filter((p) => p.category === post.category),
    ...others.filter((p) => p.category !== post.category),
  ].slice(0, max);
}

/** Neighbours in the newest-first list: `prev` is the newer article, `next` the older one. */
export function prevNext(
  written: readonly BlogPost[],
  post: BlogPost,
): { prev: BlogPost | null; next: BlogPost | null } {
  const i = written.findIndex((p) => p.key === post.key);
  if (i < 0) return { prev: null, next: null };
  return { prev: written[i - 1] ?? null, next: written[i + 1] ?? null };
}

/** The distinct categories of the written articles, first-seen order, as chip options (labels
 *  through the rows' own `categoryLabelId`, home.262–265). */
export function categoryOptions(
  written: readonly BlogPost[],
  t: (id: string) => string,
): { value: BlogCategory; label: string }[] {
  const seen = new Map<BlogCategory, string>();
  for (const p of written) if (!seen.has(p.category)) seen.set(p.category, t(p.categoryLabelId));
  return [...seen].map(([value, label]) => ({ value, label }));
}

/** B-5: the tools island's rows, built on the server so the island needs no content module. */
export function filterItems(
  posts: readonly BlogPost[],
  locale: Locale,
  t: (id: string) => string,
): FilterItem[] {
  return posts.map((p) => ({
    key: p.key,
    category: p.category,
    text: [p.title[locale], p.excerpt[locale], t(p.categoryLabelId)]
      .filter((s): s is string => Boolean(s))
      .join(' ')
      .toLocaleLowerCase(locale),
  }));
}
```

`src/app/[locale]/(site)/blog/[slug]/_lib/markdown.ts`:

```ts
/**
 * The v1 blog body grammar (docs/CONTENT-MODEL.md § Blog, B-8): exactly what the importer writes
 * today (W64 — the EN body composed from blogarticle.025–063) and what the Phase B editor may
 * write. Blocks are separated by blank lines; inside a block only `**bold**` is markup. Anything
 * else — HTML, links, images — is text: there is no HTML pass-through, so there is nothing to
 * sanitise, and `ArticleBody` emits React nodes, never a string. Pure: no React, no DOM.
 */
export type Inline = { kind: 'text'; text: string } | { kind: 'strong'; text: string };
export type Heading = { id: string; text: string };
export type Block =
  | { kind: 'p'; inlines: Inline[] }
  | { kind: 'h2'; id: string; text: string }
  | { kind: 'ul'; items: Inline[][] }
  | { kind: 'ol'; items: Inline[][] }
  | { kind: 'leads'; items: { lead: string; body: Inline[] }[] }
  | { kind: 'callout'; title: string; items: Inline[][] }
  | { kind: 'quote'; inlines: Inline[] };

const STRONG = /\*\*(.+?)\*\*/g;
// No `s` flag (ES2018; the tsconfig targets ES2017): `[\s\S]` spans the joined lines.
const LEAD = /^\*\*(.+?)\*\*\s+—\s+([\s\S]+)$/;
const UL = /^-\s+/;
const OL = /^\d+\.\s+/;
const CALLOUT_TITLE = /^\*\*(.+)\*\*$/;
const HEADING_LINE = /^(## .*)$/gm;
const DIACRITICS = /[\u0300-\u036f]/g; // combining marks left by NFKD (escaped, never literal)

export function parseInline(text: string): Inline[] {
  const out: Inline[] = [];
  let last = 0;
  for (const m of text.matchAll(STRONG)) {
    const at = m.index ?? 0;
    if (at > last) out.push({ kind: 'text', text: text.slice(last, at) });
    out.push({ kind: 'strong', text: m[1] });
    last = at + m[0].length;
  }
  if (last < text.length || out.length === 0) out.push({ kind: 'text', text: text.slice(last) });
  return out;
}

/** Deterministic ASCII heading ids (the TOC anchors): Turkish letters fold to ASCII so both
 *  locales produce the same id shape; a collision — or a reserved page id such as `faq` — gets a
 *  numeric suffix. */
export function headingId(text: string, used: Set<string>): string {
  const base =
    text
      .toLowerCase()
      .replace(/ı/g, 'i')
      .normalize('NFKD')
      .replace(DIACRITICS, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'section';
  let id = base;
  for (let n = 2; used.has(id); n += 1) id = `${base}-${n}`;
  used.add(id);
  return id;
}

/** A blockquote: `**Title**` + a `- ` list is the takeaways callout; anything else a quote. */
function parseQuote(lines: readonly string[]): Block {
  const groups: string[][] = [[]];
  for (const raw of lines) {
    const line = raw.replace(/^>\s?/, '').trim();
    const current = groups[groups.length - 1];
    if (line === '') {
      if (current.length > 0) groups.push([]);
    } else {
      current.push(line);
    }
  }
  const parts = groups.filter((g) => g.length > 0);
  const title = parts.length === 2 ? CALLOUT_TITLE.exec(parts[0].join(' ')) : null;
  if (title && parts[1].every((line) => UL.test(line))) {
    return {
      kind: 'callout',
      title: title[1],
      items: parts[1].map((line) => parseInline(line.replace(UL, ''))),
    };
  }
  return { kind: 'quote', inlines: parseInline(parts.map((g) => g.join(' ')).join(' ')) };
}

/** Blocks in document order. `reserved` seeds the heading-id set with the page's own ids
 *  (`faq`, `blog-cta`, `main`), so a body heading never shadows one. */
export function parseMarkdown(md: string, reserved: readonly string[] = []): Block[] {
  const used = new Set<string>(reserved);
  const blocks: Block[] = [];
  const chunks = md
    .replace(/\r\n?/g, '\n')
    .replace(HEADING_LINE, '\n$1\n') // a heading is always a block of its own
    .split(/\n\s*\n/)
    .map((chunk) => chunk.trim())
    .filter((chunk) => chunk.length > 0);
  for (const chunk of chunks) {
    const lines = chunk.split('\n').map((line) => line.trim());
    if (lines.length === 1 && lines[0].startsWith('## ')) {
      const text = lines[0].slice(3).trim();
      blocks.push({ kind: 'h2', id: headingId(text, used), text });
    } else if (lines.every((line) => line.startsWith('>'))) {
      blocks.push(parseQuote(lines));
    } else if (lines.every((line) => UL.test(line))) {
      blocks.push({ kind: 'ul', items: lines.map((line) => parseInline(line.replace(UL, ''))) });
    } else if (lines.every((line) => OL.test(line))) {
      blocks.push({ kind: 'ol', items: lines.map((line) => parseInline(line.replace(OL, ''))) });
    } else {
      const joined = lines.join(' ');
      const lead = LEAD.exec(joined);
      const previous = blocks[blocks.length - 1];
      if (lead) {
        const item = { lead: lead[1], body: parseInline(lead[2]) };
        if (previous?.kind === 'leads') previous.items.push(item);
        else blocks.push({ kind: 'leads', items: [item] });
      } else {
        blocks.push({ kind: 'p', inlines: parseInline(joined) });
      }
    }
  }
  return blocks;
}

/** The h2 entries of a parsed body, in order (the TOC). */
export function headings(blocks: readonly Block[]): Heading[] {
  return blocks.flatMap((b) => (b.kind === 'h2' ? [{ id: b.id, text: b.text }] : []));
}
```

`docs/CONTENT-MODEL.md` — in `## Blog`, at the end of the **v1 — Markdown.** paragraph (after the sentence "Blog posts are plain Markdown (`WebsiteBlogPost.body`), rendered server-side, no rich block editor."), append:

```markdown
**The v1 body grammar (WP2 T12, `src/app/[locale]/(site)/blog/[slug]/_lib/markdown.ts`)** is what the importer writes today and what the Phase B editor may write: blocks separated by a blank line; `## ` headings (H2 only — their slugged text is the table-of-contents anchor); paragraphs with `**bold**`; `- ` bullet lists; `1. ` numbered steps (a leading `**bold**` is the step's lead); a paragraph of the form `**lead** — body` is a rule card (consecutive ones form a two-up grid); a blockquote whose first line is `**Title**` followed by `- ` items is the Key-takeaways box; any other blockquote is a pull quote (the article's closing call to action sits inside the last one). Nothing else is markup — no HTML, links or images in v1; unknown syntax renders as text, the renderer emits React nodes (never an HTML string), and no `{metric}` placeholder is filled inside a body. A row is an article in a locale only when that locale has a body, a slug and a title; every other slug of `/blog/[slug]` answers 404, and the index lists written articles only.
```

- [ ] **Step 4: Verify**

```bash
npx prettier --write "src/app/[locale]/(site)/blog/_lib/filter.ts" "src/app/[locale]/(site)/blog/_lib/posts.ts" "src/app/[locale]/(site)/blog/[slug]/_lib/markdown.ts" "src/app/[locale]/(site)/blog/__tests__/posts.test.ts" "src/app/[locale]/(site)/blog/[slug]/__tests__/markdown.test.ts" docs/CONTENT-MODEL.md
NODE_OPTIONS=--max-old-space-size=4096 npx vitest run "src/app/[locale]/(site)/blog" --maxWorkers=1
npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
```

Expected: `posts.test.ts` 12 and `markdown.test.ts` 12 cases green; the full suite green (no route exists yet, so `unbuilt.test.ts` is untouched: `_lib`/`__tests__` folders are never routes — the walker skips `_`-prefixed and non-`page.tsx` entries).

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/blog/_lib/filter.ts" "src/app/[locale]/(site)/blog/_lib/posts.ts" "src/app/[locale]/(site)/blog/[slug]/_lib/markdown.ts" "src/app/[locale]/(site)/blog/__tests__/posts.test.ts" "src/app/[locale]/(site)/blog/[slug]/__tests__/markdown.test.ts" docs/CONTENT-MODEL.md
git commit -F - <<'MSG'
feat(blog): written-articles helpers and the v1 Markdown body grammar (T12 c1)

Pure modules for both blog routes: written articles only (a body, a slug and a
title in the locale — W4/W33), newest first, featured/related/prev-next,
per-locale alternates (D16), the dormant tools filter (B-5), and a hand-written
block parser for the importer's Markdown (W28/W64, B-8 — no HTML string, no
sanitiser, no dependency). The committed EN body parses into the design's
structure; TR has no written article. CONTENT-MODEL § Blog records the grammar.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
MSG
```

---

#### Cycle 2 — The copy: `sys.blog.*` and `sys.seo.blog.*` in both locales

- [ ] **Step 1: Write the failing test**

`src/app/[locale]/(site)/blog/__tests__/sys-keys.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import en from '@/messages/en.json';
import tr from '@/messages/tr.json';

/** Every `sys.*` key the two blog routes read (W9/W23) — both files carry each one. */
const KEYS = [
  'seo.blog.title',
  'seo.blog.description',
  'blog.hero.title',
  'blog.hero.words',
  'blog.index.latest',
  'blog.empty.title',
  'blog.empty.body',
  'blog.empty.cta',
  'blog.tools.search',
  'blog.tools.results.one',
  'blog.tools.results.other',
  'blog.article.metaTitle',
  'blog.article.langNote',
  'blog.article.sections',
  'blog.article.copyFailed',
  'blog.article.print',
  'blog.article.backToTop',
  'blog.faq.a1',
  'blog.faq.q3',
  'blog.whatsapp.article',
  'blog.whatsapp.consult',
  'blog.whatsapp.permit',
] as const;

/** Legitimately identical in both files: a pure template and the design's mixed-language pill. */
const SAME = new Set<string>(['blog.article.metaTitle', 'blog.article.langNote']);

const read = (messages: { sys: unknown }, path: string): unknown =>
  path
    .split('.')
    .reduce<unknown>(
      (node, key) => (node as Record<string, unknown> | undefined)?.[key],
      messages.sys,
    );

const leaves = (node: unknown, prefix: string): string[] =>
  typeof node === 'string'
    ? [prefix]
    : Object.entries((node ?? {}) as Record<string, unknown>).flatMap(([k, v]) =>
        leaves(v, `${prefix}.${k}`),
      );

describe('sys.blog.* and sys.seo.blog.* (T12)', () => {
  it.each(KEYS)('%s exists, non-empty, in both locales', (key) => {
    const e = read(en, key);
    const t = read(tr, key);
    expect(typeof e).toBe('string');
    expect(typeof t).toBe('string');
    expect((e as string).length).toBeGreaterThan(0);
    expect((t as string).length).toBeGreaterThan(0);
    if (!SAME.has(key)) expect(t).not.toBe(e);
  });

  it('sys.blog holds exactly the listed keys in both files', () => {
    const listed = KEYS.filter((k) => k.startsWith('blog.')).sort();
    expect(leaves(read(en, 'blog'), 'blog').sort()).toEqual(listed);
    expect(leaves(read(tr, 'blog'), 'blog').sort()).toEqual(listed);
  });

  it('the h1 template places the word per locale; five words split on | (B-4)', () => {
    expect(read(en, 'blog.hero.title')).toBe('{pre} <word></word>');
    expect(read(tr, 'blog.hero.title')).toBe('<word></word> {pre}');
    for (const m of [en, tr]) {
      expect((read(m, 'blog.hero.words') as string).split('|')).toHaveLength(5);
    }
  });

  it('the templates carry the placeholders the pages fill', () => {
    for (const m of [en, tr]) {
      expect(read(m, 'blog.article.metaTitle')).toBe('{title} | JobsAdmire');
      expect(read(m, 'blog.faq.a1')).toMatch(/\{permitDays\}[\s\S]*\{firstDayWeeks\}/);
      expect(read(m, 'blog.faq.q3')).toMatch(/\{ratio\}:1/);
      expect(read(m, 'blog.whatsapp.article')).toMatch(/\{title\}/);
      expect(read(m, 'blog.article.sections')).toMatch(/plural/);
      expect(read(m, 'blog.tools.results.one')).toMatch(/\{n\}/);
      expect(read(m, 'blog.tools.results.other')).toMatch(/\{n\}/);
    }
  });

  it('keeps the article title template out of sys.seo — the OG route reads sys.seo.<pageKey>.title with no arguments (B-15, W169)', () => {
    expect(read(en, 'seo.blogArticle')).toBeUndefined();
    expect(read(tr, 'seo.blogArticle')).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run to verify it fails**

```bash
NODE_OPTIONS=--max-old-space-size=4096 npx vitest run "src/app/[locale]/(site)/blog/__tests__/sys-keys.test.ts" --maxWorkers=1
```

Expected: every `exists, non-empty` case fails with `expected 'undefined' to be 'string'`, and the key-set, template cases fail the same way (no `sys.blog`, no `sys.seo.blog` yet); the `seo.blogArticle` case already passes.

- [ ] **Step 3: Implement**

`src/messages/en.json` — inside the existing `"seo": { … }` object add a `blog` member (after the members earlier page tasks added), and directly before the line `    "form": {` (four spaces — the `sys.form` object whose first child is `"labels": {`; the nested `form` objects inside T2's `sys.hire`, T8's `sys.workers` and T11's `sys.careers` sit deeper and are not the anchor) add the page namespace:

```json
"seo": {
  "…existing keys unchanged…": "…",
  "blog": {
    "title": "Blog & Guides — Work Permits and Hiring in Türkiye | JobsAdmire",
    "description": "Hiring guides, work permit updates and workforce news for employers in Türkiye, written by the JobsAdmire permit and recruitment team."
  }
},
"…other namespaces unchanged…": "…",
"blog": {
  "hero": {
    "title": "{pre} <word></word>",
    "words": "employers|factories|hotels|farms|builders"
  },
  "index": {
    "latest": "Latest articles"
  },
  "empty": {
    "title": "English articles are on the way",
    "body": "The JobsAdmire permit and recruitment team is preparing its guides for employers. The first articles appear here as soon as they are published.",
    "cta": "Browse the Turkish articles"
  },
  "tools": {
    "search": "Search articles",
    "results": {
      "one": "{n} article",
      "other": "{n} articles"
    }
  },
  "article": {
    "metaTitle": "{title} | JobsAdmire",
    "langNote": "EN · Türkçe'de de var",
    "sections": "{n, plural, one {# section} other {# sections}}",
    "copyFailed": "The link could not be copied — copy it from the address bar instead.",
    "print": "Print this article",
    "backToTop": "Back to top"
  },
  "faq": {
    "a1": "Approval takes about {permitDays} days on average, including the ministry's review, and the whole process up to the first working day usually takes {firstDayWeeks} weeks. A licensed agency checks the file first, so a missing document does not restart the clock.",
    "q3": "Can I hire if I don't meet the {ratio}:1 employee ratio?"
  },
  "whatsapp": {
    "article": "I read “{title}” on your blog and want to hire workers.",
    "consult": "I want a free consultation.",
    "permit": "I need help with work permits."
  }
},
"form": { "…unchanged…": "…" }
```

`src/messages/tr.json` — the same keys at the same places (formal "siz"; the company is "JobsAdmire", never "biz" — W154; the three `whatsapp.*` values are the visitor's own words after `sys.whatsapp.prefill` "Merhaba JobsAdmire, ", hence the lower-case start):

```json
"seo": {
  "…existing keys unchanged…": "…",
  "blog": {
    "title": "Blog ve Rehberler — Türkiye'de Çalışma İzni ve İşe Alım | JobsAdmire",
    "description": "Türkiye'deki işverenler için işe alım rehberleri, çalışma izni güncellemeleri ve iş gücü haberleri; JobsAdmire izin ve işe alım ekibi tarafından hazırlanır."
  }
},
"…other namespaces unchanged…": "…",
"blog": {
  "hero": {
    "title": "<word></word> {pre}",
    "words": "İşverenler|Fabrikalar|Oteller|Çiftlikler|Müteahhitler"
  },
  "index": {
    "latest": "Son yazılar"
  },
  "empty": {
    "title": "Türkçe yazılar hazırlanıyor",
    "body": "JobsAdmire izin ve işe alım ekibi işverenler için rehberlerini hazırlıyor. İlk yazılar yayımlandığında bu sayfada yer alacak.",
    "cta": "İngilizce yazılara göz atın"
  },
  "tools": {
    "search": "Yazılarda arayın",
    "results": {
      "one": "{n} yazı",
      "other": "{n} yazı"
    }
  },
  "article": {
    "metaTitle": "{title} | JobsAdmire",
    "langNote": "EN · Türkçe'de de var",
    "sections": "{n, plural, one {# bölüm} other {# bölüm}}",
    "copyFailed": "Bağlantı kopyalanamadı; adres çubuğundan kopyalayabilirsiniz.",
    "print": "Bu yazıyı yazdırın",
    "backToTop": "Başa dön"
  },
  "faq": {
    "a1": "Onay, bakanlık incelemesi dahil ortalama {permitDays} gün sürer; ilk iş gününe kadar tüm süreç genellikle {firstDayWeeks} hafta alır. Lisanslı bir ajans dosyayı önceden kontrol ettiği için eksik bir belge süreyi baştan başlatmaz.",
    "q3": "{ratio}:1 çalışan oranını sağlamıyorsam işe alım yapabilir miyim?"
  },
  "whatsapp": {
    "article": "blogunuzdaki “{title}” yazısını okudum ve işçi talebinde bulunmak istiyorum.",
    "consult": "ücretsiz danışmanlık almak istiyorum.",
    "permit": "çalışma izinleri konusunda desteğe ihtiyacım var."
  }
},
"form": { "…unchanged…": "…" }
```

Notes for the implementer: (1) only the TR index ever shows `empty.*` in Phase A (the "other" locale is fixed per file — TR's CTA leads to the English index, EN's to the Turkish one); (2) `langNote` is the design's literal EN pill ("EN · Türkçe'de de var" — like PostCard's `blog.077`, the pill speaks to Turkish readers); the TR page uses the package's own `blogarticle.143`, so the TR file's copy of the key is never read; (3) `tools.results.*` hold `{n}` tokens that next-intl never formats — the page reads them with `sys.raw(…)` and `countLabel` fills them on the client (B-5); (4) ICU apostrophes: `'s`, `'t` and `'d` are literal (an apostrophe escapes only before `{`, `}`, `#` or `|`).

`docs/CONTENT-MODEL.md` — append one bullet to the per-page list at the end of `### Adding copy (W9, W23, W54)` (W98):

```markdown
- **Blog index + article (WP2b T12):** `blog.hero.{title,words}` (the rich h1 — `<word></word>` placed per locale around `blog.095`, which sits before the word in EN and after it in TR — and the five rotating words, which have no package id), `blog.index.latest` (the grid's screen-reader heading), `blog.empty.{title,body,cta}` (W6 — the index of a locale with no written article, linking to the other locale's index), `blog.tools.{search,results.one,results.other}` (the dormant tools island; the `{n}` templates are read with `sys.raw` and filled on the client, so `sys.blog` stays off the client — W148), `blog.article.{metaTitle,langNote,sections,copyFailed,print,backToTop}` (`metaTitle` = `{title} | JobsAdmire`, deliberately not `sys.seo.blogArticle.title` (W169), because the OG route renders `sys.seo.<pageKey>.title` without arguments; `langNote` = the design's EN pill, which has no id), `blog.faq.{a1,q3}` (the two FAQ strings the package lacks — `{permitDays}`/`{firstDayWeeks}` from `metricValues`, `{ratio}` from `rateConfig.quotaRatio`), `blog.whatsapp.{article,consult,permit}` (the prefill tails after `sys.whatsapp.prefill`; `article` names the article's title) and `seo.blog.{title,description}` (the `blog` record carries no package SEO string). Deliberately unrendered: the cadence/"2026"/"Most read" ids (`blog.027`–`031`, `093`, `094`, `097`), the in-progress and not-found panels (`blogarticle.077`–`080`, `138`, `139`), the newsletter band's ids until W5 lifts (`blog.036`–`041`, `blogarticle.086`–`091`) and the per-page chrome duplicates (R15).
```

- [ ] **Step 4: Verify**

```bash
npx prettier --write src/messages/en.json src/messages/tr.json "src/app/[locale]/(site)/blog/__tests__/sys-keys.test.ts" docs/CONTENT-MODEL.md
NODE_OPTIONS=--max-old-space-size=4096 npx vitest run "src/app/[locale]/(site)/blog/__tests__/sys-keys.test.ts" src/messages src/i18n --maxWorkers=1
npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
```

Expected: `sys-keys.test.ts` 26 cases green (22 + 4); `src/messages/messages.test.ts` (identical key sets), `src/messages/voice.test.ts` (no "we/us/our", no "biz/bize/ekibimiz…", no first-person-plural verb ending in any new value) and `src/i18n/client-messages.test.ts` (no client module reads `sys.blog`) green; the full suite green.

- [ ] **Step 5: Commit**

```bash
git add src/messages/en.json src/messages/tr.json "src/app/[locale]/(site)/blog/__tests__/sys-keys.test.ts" docs/CONTENT-MODEL.md
git commit -F - <<'MSG'
feat(blog): sys.blog.* and sys.seo.blog.* copy in both locales (T12 c2)

22 keys per locale for the id-less copy of both blog routes (W9/W23): the rich
h1 and its rotating words (B-4), the W6 empty state, the dormant tools labels
({n} templates read raw — W148), the article's meta title (kept out of
sys.seo so the OG route never prints a raw {title}, B-15/W169), the two FAQ
strings the package lacks with their numbers from data (D17, B-10) and the
WhatsApp prefill tails. Formal register, "JobsAdmire" as the subject (W154).

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
MSG
```

---

#### Cycle 3 — The client islands: rotating word + toggle, the dormant tools bar, the first-scroll enhancements

No route yet: these are the index's and the article's client pieces, each imported by module path (W134/W147) and fed resolved strings as props — none calls `useTranslations`, so `CLIENT_SYS` does not change (W148).

- [ ] **Step 1: Write the failing test**

`src/app/[locale]/(site)/blog/__tests__/islands.test.tsx`:

```tsx
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { collisionsInTree } from '@/test/class-collisions';
import { PostFilter, type PostFilterLabels } from '../_components/PostFilter';
import { RotatingWord } from '../_components/RotatingWord';
import { RotationToggle } from '../_components/RotationToggle';
import { ScrollEnhancements } from '../_components/ScrollEnhancements';
import { POST_LIST_ID, type FilterItem } from '../_lib/filter';
import { rotation } from '../_lib/rotation';
import { scrollArm } from '../_lib/scroll-arm';

const WORDS = ['employers', 'factories', 'hotels'];
const current = () =>
  screen.getByTestId('hero-word-live').querySelector('[data-current]')?.textContent;

/** jsdom has no matchMedia (PausableMarquee's guard reads it the same way). */
function mockReducedMotion(reduce: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: reduce && query.includes('prefers-reduced-motion'),
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  });
}

describe('RotatingWord + RotationToggle (B-4 — D20, WCAG 2.2.2)', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    vi.useRealTimers();
    act(() => rotation.reset());
    Reflect.deleteProperty(window, 'matchMedia');
  });

  it('keeps the first word for assistive tech and rotates only the aria-hidden stack', () => {
    mockReducedMotion(false);
    render(
      <h1>
        Insights for <RotatingWord words={WORDS} />
      </h1>,
    );
    expect(screen.getByTestId('hero-word-static')).toHaveTextContent('employers');
    expect(screen.getByTestId('hero-word-live')).toHaveAttribute('aria-hidden', 'true');
    expect(current()).toBe('employers');
    act(() => {
      vi.advanceTimersByTime(2600);
    });
    expect(current()).toBe('factories');
    expect(screen.getByRole('heading', { level: 1 })).toHaveAccessibleName(
      'Insights for employers',
    );
  });

  it('stacks every word in one grid cell, so a rotation never resizes the heading (no CLS)', () => {
    mockReducedMotion(false);
    const { container } = render(<RotatingWord words={WORDS} />);
    const spans = Array.from(screen.getByTestId('hero-word-live').querySelectorAll('span'));
    expect(spans).toHaveLength(3);
    for (const span of spans) expect(span.className).toContain('col-start-1 row-start-1');
    expect(spans.filter((s) => s.className.includes('invisible'))).toHaveLength(2);
    expect(collisionsInTree(container)).toEqual([]);
  });

  it('the toggle — outside the heading — pauses and resumes the rotation', () => {
    mockReducedMotion(false);
    render(
      <>
        <RotatingWord words={WORDS} />
        <RotationToggle pauseLabel="Pause" playLabel="Play" />
      </>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Pause' }));
    act(() => {
      vi.advanceTimersByTime(8000);
    });
    expect(current()).toBe('employers');
    fireEvent.click(screen.getByRole('button', { name: 'Play' }));
    act(() => {
      vi.advanceTimersByTime(2600);
    });
    expect(current()).toBe('factories');
  });

  it('never rotates under prefers-reduced-motion; the toggle is hidden there by CSS (R20)', () => {
    mockReducedMotion(true);
    render(
      <>
        <RotatingWord words={WORDS} />
        <RotationToggle pauseLabel="Pause" playLabel="Play" />
      </>,
    );
    act(() => {
      vi.advanceTimersByTime(8000);
    });
    expect(current()).toBe('employers');
    expect(screen.getByRole('button', { name: 'Pause' }).className).toContain(
      'motion-reduce:hidden',
    );
  });
});

const ITEMS: FilterItem[] = [
  { key: 'a', category: 'workPermits', text: 'work permit guide excerpt work permits' },
  { key: 'b', category: 'recruitment', text: 'hiring from pakistan excerpt recruitment' },
  { key: 'c', category: 'workPermits', text: 'permit renewals excerpt work permits' },
];
const CATEGORIES = [
  { value: 'workPermits', label: 'Work Permits' },
  { value: 'recruitment', label: 'Recruitment' },
];
const LABELS: PostFilterLabels = {
  search: 'Search articles',
  placeholder: 'Search articles…',
  clear: 'Clear search',
  reset: 'Clear',
  all: 'All',
  topic: 'Topic',
  pickTopic: 'Pick a topic',
  close: 'Close',
  noResults: 'No articles match your search.',
  resultsOne: '{n} article',
  resultsOther: '{n} articles',
};

function renderFilter() {
  return render(
    <>
      <ul id={POST_LIST_ID}>
        {ITEMS.map((it) => (
          <li key={it.key} data-post-key={it.key}>
            {it.key}
          </li>
        ))}
      </ul>
      <PostFilter
        listId={POST_LIST_ID}
        locale="en"
        items={ITEMS}
        categories={CATEGORIES}
        labels={LABELS}
      />
    </>,
  );
}
const row = (key: string) => document.querySelector<HTMLElement>(`[data-post-key="${key}"]`)!;

describe('PostFilter (B-5 — the dormant tools island)', () => {
  it('filters the server-rendered rows by query and announces the count', () => {
    const { container } = renderFilter();
    expect(screen.getByText('3 articles')).toBeInTheDocument();
    fireEvent.change(screen.getByRole('searchbox', { name: 'Search articles' }), {
      target: { value: 'PERMIT' },
    });
    expect(row('a').hidden).toBe(false);
    expect(row('b').hidden).toBe(true);
    expect(row('c').hidden).toBe(false);
    expect(screen.getByText('2 articles')).toBeInTheDocument();
    expect(collisionsInTree(container)).toEqual([]);
  });

  it('filters by topic chip and resets both filters', () => {
    renderFilter();
    fireEvent.click(screen.getByLabelText('Recruitment'));
    expect(row('a').hidden).toBe(true);
    expect(row('b').hidden).toBe(false);
    expect(screen.getByText('1 article')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Clear' }));
    for (const key of ['a', 'b', 'c']) expect(row(key).hidden).toBe(false);
  });

  it('shows the no-results panel when nothing matches', () => {
    renderFilter();
    fireEvent.change(screen.getByRole('searchbox', { name: 'Search articles' }), {
      target: { value: 'zzz' },
    });
    expect(screen.getByTestId('blog-no-results')).toHaveTextContent(
      'No articles match your search.',
    );
    for (const key of ['a', 'b', 'c']) expect(row(key).hidden).toBe(true);
  });

  it('picks a topic from the phone sheet and closes it', () => {
    renderFilter();
    fireEvent.click(screen.getByRole('button', { name: 'Topic' }));
    fireEvent.click(within(screen.getByRole('dialog')).getByLabelText('Recruitment'));
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(row('a').hidden).toBe(true);
    expect(row('b').hidden).toBe(false);
  });
});

describe('ScrollEnhancements (B-13)', () => {
  const scrollY = Object.getOwnPropertyDescriptor(window, 'scrollY');
  afterEach(() => {
    Reflect.deleteProperty(document.documentElement, 'scrollHeight');
    if (scrollY) Object.defineProperty(window, 'scrollY', scrollY);
    else Reflect.deleteProperty(window, 'scrollY');
    vi.restoreAllMocks();
  });

  it('renders a decorative progress bar at 0 % and no back-to-top at the top of the page', () => {
    const { container } = render(<ScrollEnhancements backToTopLabel="Back to top" />);
    const bar = screen.getByTestId('reading-progress');
    expect(bar).toHaveAttribute('aria-hidden', 'true');
    expect((bar.firstElementChild as HTMLElement).style.width).toBe('0%');
    expect(screen.queryByTestId('back-to-top')).toBeNull();
    expect(collisionsInTree(container)).toEqual([]);
  });

  it('tracks the scroll and offers back-to-top past 12 %, which moves focus to <main>', () => {
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      configurable: true,
      value: 2768, // jsdom's innerHeight is 768 → 2,000 px of scroll
    });
    render(
      <main id="main" tabIndex={-1}>
        <ScrollEnhancements backToTopLabel="Back to top" />
      </main>,
    );
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 1000 });
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });
    expect(
      (screen.getByTestId('reading-progress').firstElementChild as HTMLElement).style.width,
    ).toBe('50%');
    fireEvent.click(screen.getByRole('button', { name: 'Back to top' }));
    expect(scrollTo).toHaveBeenCalledWith({ top: 0 });
    expect(document.activeElement).toBe(document.getElementById('main'));
  });
});

describe('scrollArm (B-13: the enhancements load on the first scroll)', () => {
  afterEach(() => scrollArm.reset());

  it('is unarmed on the server and before any scroll; one scroll arms it for good', () => {
    expect(scrollArm.isArmedOnServer()).toBe(false);
    expect(scrollArm.isArmed()).toBe(false);
    const onChange = vi.fn();
    const unsubscribe = scrollArm.subscribe(onChange);
    window.dispatchEvent(new Event('scroll'));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(scrollArm.isArmed()).toBe(true);
    unsubscribe();
    window.dispatchEvent(new Event('scroll'));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(scrollArm.isArmed()).toBe(true);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

```bash
NODE_OPTIONS=--max-old-space-size=4096 npx vitest run "src/app/[locale]/(site)/blog/__tests__/islands.test.tsx" --maxWorkers=1
```

Expected: the file fails to load — `Failed to resolve import "../_components/PostFilter"` (and the other five modules).

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/blog/_lib/rotation.ts`:

```ts
/**
 * B-4: the Pause/Play state the rotating hero word and its toggle share. They are two small
 * client islands — the word renders inside the h1, the button after the hero ticks, so the
 * heading's accessible name never contains a button label. Module state behind
 * `useSyncExternalStore`; the server and the hydrating client both read "playing". A plain
 * module (no directive, no React): only the two client islands import it.
 */
let paused = false;
const listeners = new Set<() => void>();

const notify = () => {
  for (const listener of listeners) listener();
};

export const rotation = {
  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  isPaused: (): boolean => paused,
  isPausedOnServer: (): boolean => false,
  toggle(): void {
    paused = !paused;
    notify();
  },
  /** Tests only: back to "playing". */
  reset(): void {
    paused = false;
    notify();
  },
};
```

`src/app/[locale]/(site)/blog/_lib/scroll-arm.ts`:

```ts
/**
 * B-13: the latch `ScrollEnhancementsLoader` waits for — the visitor's first scroll, or a page
 * that is already scrolled when it hydrates (a `#hash` link). Before that nothing the
 * enhancements draw is visible (the reading bar sits at 0 %, the back-to-top button and the
 * sticky bar appear only after scrolling), so their chunk is fetched later and never counts in
 * the first-load audit (Lighthouse does not scroll). Once armed it stays armed for the session.
 * Nothing is armed on the server or during hydration. A plain module: client modules only.
 */
let armed = false;

export const scrollArm = {
  subscribe(onChange: () => void): () => void {
    if (armed) return () => {};
    const arm = () => {
      armed = true;
      onChange();
    };
    window.addEventListener('scroll', arm, { passive: true, once: true });
    return () => window.removeEventListener('scroll', arm);
  },
  isArmed: (): boolean => armed || window.scrollY > 0,
  isArmedOnServer: (): boolean => false,
  /** Tests only. */
  reset(): void {
    armed = false;
  },
};
```

`src/app/[locale]/(site)/blog/_components/RotatingWord.tsx`:

```tsx
'use client';
import { useEffect, useState, useSyncExternalStore } from 'react';
import { rotation } from '../_lib/rotation';

const REDUCE = '(prefers-reduced-motion: reduce)';

// R18 + PausableMarquee's guard: the preference is a browser fact read after hydration, and
// jsdom (or any non-browser runtime) has no matchMedia.
function subscribeReducedMotion(onChange: () => void) {
  if (typeof window.matchMedia !== 'function') return () => {};
  const mq = window.matchMedia(REDUCE);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}
const getReducedMotion = () =>
  typeof window.matchMedia === 'function' && window.matchMedia(REDUCE).matches;
const getReducedMotionOnServer = () => false;

/**
 * B-4 (D20, WCAG 2.2.2): the h1's rotating word. What assistive tech and crawlers read is the
 * first word, `sr-only`; the visible stack is `aria-hidden` and holds every word in one grid
 * cell — only the current one visible — so the box is always the widest word and a rotation
 * never reflows the heading (no layout shift). It rotates every `intervalMs` only after
 * hydration, never under `prefers-reduced-motion`, and stops while `RotationToggle` has paused
 * it. The interval's callback is the only state setter (react-hooks 7: none in an effect body).
 */
export function RotatingWord({ words, intervalMs = 2600 }: { words: string[]; intervalMs?: number }) {
  const reduced = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    getReducedMotionOnServer,
  );
  const paused = useSyncExternalStore(
    rotation.subscribe,
    rotation.isPaused,
    rotation.isPausedOnServer,
  );
  const [index, setIndex] = useState(0);
  const still = reduced || paused || words.length < 2;
  useEffect(() => {
    if (still) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % words.length), intervalMs);
    return () => window.clearInterval(id);
  }, [still, words.length, intervalMs]);
  const current = reduced ? 0 : index;
  return (
    <>
      <span className="sr-only" data-testid="hero-word-static">
        {words[0]}
      </span>
      <span
        aria-hidden="true"
        data-testid="hero-word-live"
        className="inline-grid border-b-[5px] border-sky pb-0.5 leading-none text-sky"
      >
        {words.map((word, i) => (
          <span
            key={word}
            data-current={i === current ? '' : undefined}
            className={i === current ? 'col-start-1 row-start-1' : 'invisible col-start-1 row-start-1'}
          >
            {word}
          </span>
        ))}
      </span>
    </>
  );
}
```

`src/app/[locale]/(site)/blog/_components/RotationToggle.tsx`:

```tsx
'use client';
import { useSyncExternalStore } from 'react';
import { Button } from '@/design/primitives/Button';
import { rotation } from '../_lib/rotation';

/** B-4: the rotating word's Pause/Play control (D20; WCAG 2.2.2 — auto-updating text needs a
 *  pause). It sits outside the h1, so the heading's name stays the sentence. Under
 *  `prefers-reduced-motion` nothing moves, so CSS hides it (R20: the server render and the
 *  hydrating client stay identical). Labels arrive resolved — the page reads
 *  `sys.marquee.pause/play` on the server, so no `sys` namespace reaches the client (W148). */
export function RotationToggle({ pauseLabel, playLabel }: { pauseLabel: string; playLabel: string }) {
  const paused = useSyncExternalStore(
    rotation.subscribe,
    rotation.isPaused,
    rotation.isPausedOnServer,
  );
  return (
    <Button
      variant="inverse"
      onClick={rotation.toggle}
      className="motion-reduce:hidden"
      data-testid="hero-word-toggle"
    >
      {paused ? playLabel : pauseLabel}
    </Button>
  );
}
```

`src/app/[locale]/(site)/blog/_components/PostFilter.tsx`:

```tsx
'use client';
import { useEffect, useState } from 'react';
import { BottomSheet } from '@/design/islands/BottomSheet';
import { SearchInput } from '@/design/islands/SearchInput';
import { Button } from '@/design/primitives/Button';
import { RadioChips, type RadioChipOption } from '@/design/primitives/RadioChips';
import type { Locale } from '@/i18n/routing';
import { ALL, countLabel, matchKeys, type FilterItem } from '../_lib/filter';

/** Every label resolved on the server (package ids + `sys.blog.tools.*` read raw) — W148. */
export type PostFilterLabels = {
  search: string; // sys.blog.tools.search
  placeholder: string; // blog.088
  clear: string; // blog.033
  reset: string; // blog.089
  all: string; // blog.076
  topic: string; // blog.086
  pickTopic: string; // blog.087
  close: string; // blog.075
  noResults: string; // blog.035
  resultsOne: string; // sys.blog.tools.results.one
  resultsOther: string; // sys.blog.tools.results.other
};

export type PostFilterProps = {
  listId: string;
  locale: Locale;
  items: FilterItem[];
  categories: RadioChipOption[];
  labels: PostFilterLabels;
};

/**
 * B-5: the index tools bar — search, topic chips (a bottom sheet on phones), reset, the live
 * result count and the no-results panel — as a progressive enhancement over the server-rendered
 * card list: it toggles the `hidden` attribute of the list's `li[data-post-key]` rows. Those
 * rows are static RSC output that React never re-renders on the client, so writing the attribute
 * is safe; the match set is derived in render and the effect only writes the DOM (react-hooks 7:
 * no state set in an effect body). Mounted by the page only from `TOOLS_MIN_POSTS` non-featured
 * written articles — never in Phase A.
 */
export function PostFilter({ listId, locale, items, categories, labels }: PostFilterProps) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>(ALL);
  const [sheetOpen, setSheetOpen] = useState(false);
  const hits = matchKeys(items, query, category, locale);
  const signature = hits.join('|');

  useEffect(() => {
    const list = document.getElementById(listId);
    if (!list) return;
    const visible = new Set(signature ? signature.split('|') : []);
    for (const row of Array.from(list.querySelectorAll<HTMLElement>('[data-post-key]'))) {
      row.hidden = !visible.has(row.dataset.postKey ?? '');
    }
  }, [listId, signature]);

  const options: RadioChipOption[] = [{ value: ALL, label: labels.all }, ...categories];
  const filtered = query.trim() !== '' || category !== ALL;
  const reset = () => {
    setQuery('');
    setCategory(ALL);
  };

  return (
    <div
      data-testid="blog-tools"
      className="flex flex-col gap-3 rounded-base border border-border-1 bg-white p-3 shadow-social"
    >
      <div className="flex flex-wrap items-start gap-3">
        <SearchInput
          id="blog-search"
          label={labels.search}
          hideLabel
          value={query}
          onChange={setQuery}
          placeholder={labels.placeholder}
          clearLabel={labels.clear}
          resultText={countLabel(hits.length, { one: labels.resultsOne, other: labels.resultsOther })}
          className="min-w-[230px] flex-1"
        />
        <div className="md:hidden">
          <Button variant="secondary" onClick={() => setSheetOpen(true)}>
            {labels.topic}
          </Button>
        </div>
        <div className="max-md:hidden">
          <RadioChips
            name="blog-topic"
            options={options}
            value={category}
            onChange={setCategory}
            legend={labels.topic}
            legendHidden
          />
        </div>
        {filtered ? (
          <Button variant="ghost" onClick={reset}>
            {labels.reset}
          </Button>
        ) : null}
      </div>
      {hits.length === 0 ? (
        <p
          role="status"
          data-testid="blog-no-results"
          className="text-body-sm m-0 rounded-base border border-dashed border-border-1 p-4 text-text-secondary"
        >
          {labels.noResults}
        </p>
      ) : null}
      <BottomSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title={labels.pickTopic}
        closeLabel={labels.close}
      >
        <RadioChips
          name="blog-topic-sheet"
          options={options}
          value={category}
          onChange={(value) => {
            setCategory(value);
            setSheetOpen(false);
          }}
          legend={labels.topic}
          legendHidden
        />
      </BottomSheet>
    </div>
  );
}
```

`src/app/[locale]/(site)/blog/_components/PostFilterLoader.tsx`:

```tsx
'use client';
import dynamic from 'next/dynamic';
import type { PostFilterProps } from './PostFilter';

/** B-5 / W13 amended: the tools island is client-only and fetched as its own chunk after
 *  hydration — `ssr: false` is legal only inside a `'use client'` module (final review §6). The
 *  page mounts this only from `TOOLS_MIN_POSTS` non-featured written articles, inside a slot
 *  whose reserved height keeps the late mount from shifting the list. */
const PostFilter = dynamic(() => import('./PostFilter').then((m) => m.PostFilter), {
  ssr: false,
});

export function PostFilterLoader(props: PostFilterProps) {
  return <PostFilter {...props} />;
}
```

`src/app/[locale]/(site)/blog/_components/ScrollEnhancements.tsx`:

```tsx
'use client';
import { StickyCtaBar, type StickyCta } from '@/design/chrome/StickyCtaBar';
import { useScrollProgress } from '@/design/islands/useScrollProgress';

export type ScrollEnhancementsProps = {
  /** Article only: the ≤700 px back-to-top button's name (sys.blog.article.backToTop). */
  backToTopLabel?: string;
  /** Article only: the design's sticky bottom bar (StickyCtaBar shows it from `lg`, after
   *  700 px of scroll, and hides it near `hideNearId`). */
  stickyBar?: { message: string; ctas: StickyCta[]; hideNearId?: string };
};

/**
 * B-13: what the blog pages draw only once the visitor scrolls — the 3 px reading-progress bar
 * (decorative, `aria-hidden`: scroll position is not information), the article's back-to-top
 * button (phones; after 12 % of the page; focus moves to `<main>` so a keyboard user lands at
 * the top too) and the article's sticky CTA bar (W81: its WhatsApp CTA is a tracked
 * `ContactCta`). Loaded by `ScrollEnhancementsLoader` on the first scroll, never server-rendered.
 */
export function ScrollEnhancements({ backToTopLabel, stickyBar }: ScrollEnhancementsProps) {
  const progress = useScrollProgress();
  const toTop = () => {
    // `html { scroll-behavior: smooth }` (globals.css) — and `auto` under reduced motion.
    window.scrollTo({ top: 0 });
    document.getElementById('main')?.focus({ preventScroll: true });
  };
  return (
    <>
      <div
        aria-hidden="true"
        data-testid="reading-progress"
        className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[3px]"
      >
        <div
          className="h-full bg-gradient-to-r from-blue to-success"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
      {backToTopLabel && progress > 0.12 ? (
        <button
          type="button"
          onClick={toTop}
          aria-label={backToTopLabel}
          data-testid="back-to-top"
          className="fixed right-3.5 bottom-[88px] z-[39] flex h-11 w-11 items-center justify-center rounded-pill border border-white/15 bg-ink text-white shadow-social focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe md:hidden"
        >
          <span aria-hidden="true">↑</span>
        </button>
      ) : null}
      {stickyBar ? (
        <StickyCtaBar
          message={stickyBar.message}
          ctas={stickyBar.ctas}
          hideNearId={stickyBar.hideNearId}
        />
      ) : null}
    </>
  );
}
```

`src/app/[locale]/(site)/blog/_components/ScrollEnhancementsLoader.tsx`:

```tsx
'use client';
import dynamic from 'next/dynamic';
import { useSyncExternalStore } from 'react';
import { scrollArm } from '../_lib/scroll-arm';
import type { ScrollEnhancementsProps } from './ScrollEnhancements';

/** B-13 (W13 amended, final review §2): the enhancements chunk is requested on the first scroll
 *  — `next/dynamic` calls its loader only when the component first renders, and nothing renders
 *  it before `scrollArm` flips. `ssr: false` inside a `'use client'` module (final review §6). */
const ScrollEnhancements = dynamic(
  () => import('./ScrollEnhancements').then((m) => m.ScrollEnhancements),
  { ssr: false },
);

export function ScrollEnhancementsLoader(props: ScrollEnhancementsProps) {
  const armed = useSyncExternalStore(
    scrollArm.subscribe,
    scrollArm.isArmed,
    scrollArm.isArmedOnServer,
  );
  return armed ? <ScrollEnhancements {...props} /> : null;
}
```

- [ ] **Step 4: Verify**

```bash
npx prettier --write "src/app/[locale]/(site)/blog/_lib/rotation.ts" "src/app/[locale]/(site)/blog/_lib/scroll-arm.ts" "src/app/[locale]/(site)/blog/_components/RotatingWord.tsx" "src/app/[locale]/(site)/blog/_components/RotationToggle.tsx" "src/app/[locale]/(site)/blog/_components/PostFilter.tsx" "src/app/[locale]/(site)/blog/_components/PostFilterLoader.tsx" "src/app/[locale]/(site)/blog/_components/ScrollEnhancements.tsx" "src/app/[locale]/(site)/blog/_components/ScrollEnhancementsLoader.tsx" "src/app/[locale]/(site)/blog/__tests__/islands.test.tsx"
NODE_OPTIONS=--max-old-space-size=4096 npx vitest run "src/app/[locale]/(site)/blog/__tests__/islands.test.tsx" src/design src/i18n --maxWorkers=1
npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
```

Expected: `islands.test.tsx` 11 cases green; `client-imports.test.ts` (every client module above imports primitives/islands/chrome by path; none reaches a message file, `@/content/*` or `@/lib/format/date/*`), `client-messages.test.ts` (no client `sys` read), `class-collisions.test.ts` (the new literals: `hidden` only as `md:hidden`/`max-md:hidden`/`motion-reduce:hidden`; `Button` classes `motion-reduce:hidden` only) and `rsc-imports.test.ts` green; the full suite green.

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/blog/_lib/rotation.ts" "src/app/[locale]/(site)/blog/_lib/scroll-arm.ts" "src/app/[locale]/(site)/blog/_components/RotatingWord.tsx" "src/app/[locale]/(site)/blog/_components/RotationToggle.tsx" "src/app/[locale]/(site)/blog/_components/PostFilter.tsx" "src/app/[locale]/(site)/blog/_components/PostFilterLoader.tsx" "src/app/[locale]/(site)/blog/_components/ScrollEnhancements.tsx" "src/app/[locale]/(site)/blog/_components/ScrollEnhancementsLoader.tsx" "src/app/[locale]/(site)/blog/__tests__/islands.test.tsx"
git commit -F - <<'MSG'
feat(blog): client islands — rotating hero word + pause toggle, dormant tools bar, first-scroll enhancements (T12 c3)

The rotating word keeps a stable sr-only first word and stacks the others in
one grid cell (no reflow), never moves under reduced motion and pauses from a
toggle outside the h1 (B-4, D20/WCAG 2.2.2). The tools bar filters the server
cards in place and mounts only from six non-featured written articles (B-5).
The progress bar, back-to-top and sticky CTA bar load on the first scroll via
next/dynamic inside a client loader (B-13, W13 amended). Every import by path
(W134/W147); every label a prop (W148).

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
MSG
```

---

#### Cycle 4 — The index page: `/blog` · `/en/blog` (hero, written articles or the W6 empty state, closing band), `/blog` leaves `UNBUILT_PATHNAMES`

- [ ] **Step 1: Write the failing test**

`src/app/[locale]/(site)/blog/__tests__/index-sections.test.tsx`:

```tsx
import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { BlogPost } from '@/content/collections';
import { BLOCK_STRINGS, testBundle } from '@/test/bundle';
import { collisionsInTree } from '@/test/class-collisions';
import { renderWithIntl } from '@/test/render';
import { HeroArt } from '../_components/HeroArt';
import { PostList } from '../_components/PostList';
import { POST_LIST_ID } from '../_lib/filter';

/** A full written row (both locales), per the T0b schema. */
const row = (key: string, over: Partial<BlogPost> = {}): BlogPost => ({
  key,
  slug: { tr: `${key}-tr`, en: key },
  title: { tr: `Başlık ${key}`, en: `Title ${key}` },
  excerpt: { tr: 'Özet', en: 'Excerpt' },
  category: 'workPermits',
  categoryLabelId: 'home.263',
  author: 'JobsAdmire',
  publishedAt: '2026-06-12',
  readMinutes: 5,
  hasBody: { tr: true, en: true },
  body: { tr: 'metin', en: 'text' },
  ...over,
});

const bundle = testBundle({
  strings: { ...BLOCK_STRINGS, 'home.263': 'Work Permits', 'blog.032': '2 languages' },
});

describe('HeroArt (B-2, B-3)', () => {
  it('renders nothing without a featured article (the TR index in Phase A)', () => {
    const { container } = renderWithIntl(
      <HeroArt bundle={bundle} locale="en" featured={null} />,
      { locale: 'en' },
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('builds its one float card from the featured row — no hard-typed year, read time or "Most read"', () => {
    const { container } = renderWithIntl(
      <HeroArt bundle={bundle} locale="en" featured={row('guide', { readMinutes: 8 })} />,
      { locale: 'en' },
    );
    const art = screen.getByTestId('blog-hero-art');
    expect(art).toHaveAttribute('aria-hidden', 'true');
    expect(art).toHaveTextContent('Work Permits');
    expect(art).toHaveTextContent('Title guide');
    expect(art).toHaveTextContent('JobsAdmire · 8 min read');
    expect(art).toHaveTextContent('2 languages');
    expect(art).not.toHaveTextContent('Most read');
    expect(art).not.toHaveTextContent('2026');
    expect(collisionsInTree(container)).toEqual([]);
  });
});

describe('PostList (the grid the tools island filters)', () => {
  it('renders nothing for an empty grid (Phase A: the one written article is the featured card)', () => {
    const { container } = renderWithIntl(
      <PostList bundle={bundle} locale="en" posts={[]} heading="Latest articles" />,
      { locale: 'en' },
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('lists the rows under a screen-reader h2, one li[data-post-key] per PostCard (h3)', () => {
    const { container } = renderWithIntl(
      <PostList bundle={bundle} locale="en" posts={[row('a'), row('b')]} heading="Latest articles" />,
      { locale: 'en' },
    );
    expect(screen.getByRole('heading', { level: 2, name: 'Latest articles' })).toBeInTheDocument();
    const list = screen.getByTestId('blog-grid');
    expect(list.id).toBe(POST_LIST_ID);
    expect(list.querySelectorAll('li[data-post-key]')).toHaveLength(2);
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(2);
    expect(screen.getByRole('link', { name: 'Title a' })).toHaveAttribute('href', '/en/blog/a');
    expect(collisionsInTree(container)).toEqual([]);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

```bash
NODE_OPTIONS=--max-old-space-size=4096 npx vitest run "src/app/[locale]/(site)/blog/__tests__/index-sections.test.tsx" --maxWorkers=1
```

Expected: `Failed to resolve import "../_components/HeroArt"` (and `PostList`).

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/blog/_components/HeroArt.tsx`:

```tsx
import type { BlogPost } from '@/content/collections';
import { makeT } from '@/content/pure';
import type { Locale } from '@/i18n/routing';
import { formatReadMinutes } from '@/lib/format/date/formatReadMinutes';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';

/**
 * The design's hero art (desktop only — hidden ≤700 px by class, W10): ONE float card built
 * from the featured row (category label, title, author · read time — the design's blog.027/028
 * hard-type "— 2026" and "8 min read", D17/B-3) and the EN·TR pill as authored (blog.032). The
 * "Most read" card (blog.030/031) has no data source in Phase A (B-2). Decorative: the same
 * article is the featured card below, so it is `aria-hidden`; static — no float animation.
 * Renders nothing without a featured article (the TR index in Phase A).
 */
export function HeroArt({
  bundle,
  locale,
  featured,
}: {
  bundle: Bundle;
  locale: Locale;
  featured: BlogPost | null;
}) {
  const title = featured?.title[locale];
  if (!featured || !title) return null;
  const t = makeT(bundle);
  return (
    <div
      aria-hidden="true"
      data-testid="blog-hero-art"
      className="relative min-h-[240px] max-md:hidden"
    >
      <div className="absolute top-4 left-[4%] w-[250px] rounded-base border border-white/10 bg-white px-4.5 py-4 shadow-hero-form">
        <span className="inline-block rounded-pill bg-tint px-2.5 py-0.5 text-[11px] font-extrabold text-blue-safe">
          {t(featured.categoryLabelId)}
        </span>
        <p className="text-body-sm mt-2.5 mb-2 leading-snug font-extrabold text-ink">{title}</p>
        <p className="m-0 flex items-center gap-2 text-[11.5px] font-semibold text-text-tertiary">
          <span className="inline-block h-[22px] w-[22px] shrink-0 rounded-pill bg-gradient-to-br from-blue to-success" />
          {featured.author} · {formatReadMinutes(featured.readMinutes, locale)}
        </p>
      </div>
      <p className="absolute bottom-1.5 left-[12%] m-0 inline-flex items-center gap-2 rounded-pill border border-white/25 bg-white/10 px-4 py-2 text-[12.5px] font-extrabold text-white">
        <span className="text-sky">EN</span>
        <span className="text-white/40">·</span>
        <span className="text-sky">TR</span>
        <span className="font-semibold text-white/70">{t('blog.032')}</span>
      </p>
    </div>
  );
}
```

`src/app/[locale]/(site)/blog/_components/PostList.tsx`:

```tsx
import type { BlogPost } from '@/content/collections';
import { PostCard } from '@/design/blocks/PostCard';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { POST_LIST_ID } from '../_lib/filter';

/** The grid of written articles after the featured card — one `li[data-post-key]` per card, the
 *  rows the tools island (B-5) shows and hides. Renders nothing for an empty grid (Phase A). */
export function PostList({
  bundle,
  locale,
  posts,
  heading,
}: {
  bundle: Bundle;
  locale: Locale;
  posts: readonly BlogPost[];
  heading: string;
}) {
  if (posts.length === 0) return null;
  return (
    <div>
      <h2 className="sr-only">{heading}</h2>
      <ul
        id={POST_LIST_ID}
        data-testid="blog-grid"
        className="m-0 grid list-none gap-6 p-0 md:grid-cols-2 lg:grid-cols-3"
      >
        {posts.map((post) => (
          <li key={post.key} data-post-key={post.key}>
            <PostCard bundle={bundle} locale={locale} post={post} variant="card" headingLevel={3} />
          </li>
        ))}
      </ul>
    </div>
  );
}
```

`src/app/[locale]/(site)/blog/page.tsx`:

```tsx
import type { Metadata } from 'next';
import NextLink from 'next/link';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getBundle, makeT, makeTf } from '@/content/adapter';
import { getCollection } from '@/content/collections';
import { Breadcrumbs } from '@/design/blocks/Breadcrumbs';
import { ClosingCtaBand } from '@/design/blocks/ClosingCtaBand';
import { EmptyState } from '@/design/blocks/EmptyState';
import { ImageSlot } from '@/design/blocks/ImageSlot';
import { NewsletterBand } from '@/design/blocks/NewsletterBand';
import { PostCard } from '@/design/blocks/PostCard';
import { CheckIcon } from '@/design/chrome/icons';
import { buttonClassName } from '@/design/primitives/Button';
import { Section } from '@/design/primitives/Section';
import { getPathname, type Href } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { waLink } from '@/lib/contact';
import { formatInt } from '@/lib/format/money';
import { buildMetadata } from '@/lib/seo/metadata';
import { HeroArt } from './_components/HeroArt';
import { PostFilterLoader } from './_components/PostFilterLoader';
import { PostList } from './_components/PostList';
import { RotatingWord } from './_components/RotatingWord';
import { RotationToggle } from './_components/RotationToggle';
import { ScrollEnhancementsLoader } from './_components/ScrollEnhancementsLoader';
import { POST_LIST_ID } from './_lib/filter';
import {
  categoryOptions,
  filterItems,
  otherLocale,
  splitFeatured,
  TOOLS_MIN_POSTS,
  writtenPosts,
} from './_lib/posts';

/** W5/W97 (D14): the newsletter band stays hidden until counsel clears — it renders nothing and
 *  nothing wraps it; its form (checkbox consent + double opt-in, W79) lands with its activation. */
const NEWSLETTER_ACTIVE = false;

/** W82: the design's "Request Workers →" lands on the Hire Workers form (T2 renders the anchor). */
const HIRE_FORM: Exclude<Href, string> = { pathname: '/hire-workers', hash: '#request-form' };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const [bundle, sys] = await Promise.all([
    getBundle(locale),
    getTranslations({ locale, namespace: 'sys' }),
  ]);
  // The `blog` record has '' SEO ids (T0b) → the sys.seo.blog fallbacks (W23/W38); `noindex`
  // comes from the record itself (W4). Both locales have this page, so the default alternates
  // (tr, en, x-default = tr) are right.
  return buildMetadata({
    locale,
    href: '/blog',
    bundle,
    pageKey: 'blog',
    fallbackTitle: sys('seo.blog.title'),
    fallbackDescription: sys('seo.blog.description'),
  });
}

export default async function BlogIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const [bundle, sys] = await Promise.all([
    getBundle(locale),
    getTranslations({ locale, namespace: 'sys' }),
  ]);
  const t = makeT(bundle);
  const tf = makeTf(bundle, locale);
  const rows = getCollection(bundle, 'blog');
  const written = writtenPosts(rows, locale);
  const { featured, rest } = splitFeatured(written);
  const other = otherLocale(locale);
  // W6: a locale with no written article links to the other locale's index when that one has
  // articles. The path is already localised (`/en/blog`), so it goes through next/link, as the
  // chrome's LanguageSwitcher does — next-intl's Link would localise it to this locale.
  const otherIndex =
    writtenPosts(rows, other).length > 0 ? getPathname({ locale: other, href: '/blog' }) : null;
  const words = sys('blog.hero.words').split('|');
  const whatsapp = waLink(
    bundle.settings.whatsappNumber,
    `${sys('whatsapp.prefill')}${sys('blog.whatsapp.consult')}`,
  );

  return (
    <>
      {/* ---- Hero: crumbs (W109), the rotating h1 (B-4 — the LCP element, B-7), sub, ticks ---- */}
      <Section tone="dark" className="relative overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <ImageSlot slot="blog-hero" alt="" width={1440} height={520} />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-navy via-navy/90 to-navy/75"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy/50 via-transparent to-navy/70"
        />
        <div className="container-site relative">
          <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <Breadcrumbs
                locale={locale}
                tone="dark"
                items={[
                  { name: t('blog.022'), href: '/' },
                  { name: t('blog.004'), href: '/blog' },
                ]}
              />
              <h1
                data-testid="page-h1"
                data-lcp-slot="h1"
                className="text-h1 mt-4 mb-4 max-w-[760px] leading-[1.02]"
              >
                {sys.rich('blog.hero.title', {
                  pre: t('blog.095'),
                  word: () => <RotatingWord words={words} />,
                })}
              </h1>
              <p className="text-body-lg mt-0 mb-6 max-w-[620px] font-semibold text-white/80">
                {t('blog.096')}
              </p>
              <ul className="m-0 flex max-w-[600px] list-none flex-wrap gap-x-8 gap-y-3 p-0">
                <li className="text-body flex items-start gap-2.5 font-semibold text-white/75">
                  <CheckIcon size={16} className="mt-1 shrink-0 text-success" />
                  <span>
                    {t('blog.023')} <strong className="font-extrabold text-white">{t('blog.024')}</strong>
                  </span>
                </li>
                <li className="text-body flex items-start gap-2.5 font-semibold text-white/75">
                  <CheckIcon size={16} className="mt-1 shrink-0 text-success" />
                  <span>
                    <strong className="font-extrabold text-white">{t('blog.025')}</strong> {t('blog.026')}
                  </span>
                </li>
              </ul>
              <div className="mt-5">
                <RotationToggle pauseLabel={sys('marquee.pause')} playLabel={sys('marquee.play')} />
              </div>
              {/* The design's phone stats strip: the written count + the two languages; its
                  cadence chip (blog.093/094) has no data row (B-3). Nothing when there is no article. */}
              {written.length > 0 ? (
                <p className="text-body-sm mt-4 mb-0 flex flex-wrap items-center gap-x-3 gap-y-1 font-bold text-white/65 md:hidden">
                  <span>
                    <strong className="font-extrabold text-white">
                      {formatInt(written.length, locale)}
                    </strong>{' '}
                    {t('blog.091')}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>
                    <strong className="font-extrabold text-sky">EN·TR</strong> {t('blog.092')}
                  </span>
                </p>
              ) : null}
            </div>
            <HeroArt bundle={bundle} locale={locale} featured={featured} />
          </div>
        </div>
      </Section>

      {/* ---- Written articles only (W4): the tools (B-5, dormant), the featured card, the grid —
              or the W6 empty state with the other locale's index ---- */}
      <Section tone="light" id="articles">
        <div className="container-site">
          {featured ? (
            <>
              {rest.length >= TOOLS_MIN_POSTS ? (
                <div data-testid="blog-tools-slot" className="mb-8 min-h-[96px]">
                  <PostFilterLoader
                    listId={POST_LIST_ID}
                    locale={locale}
                    items={filterItems(rest, locale, t)}
                    categories={categoryOptions(rest, t)}
                    labels={{
                      search: sys('blog.tools.search'),
                      placeholder: t('blog.088'),
                      clear: t('blog.033'),
                      reset: t('blog.089'),
                      all: t('blog.076'),
                      topic: t('blog.086'),
                      pickTopic: t('blog.087'),
                      close: t('blog.075'),
                      noResults: t('blog.035'),
                      resultsOne: String(sys.raw('blog.tools.results.one')),
                      resultsOther: String(sys.raw('blog.tools.results.other')),
                    }}
                  />
                </div>
              ) : null}
              <div data-testid="blog-featured" className="mb-10 lg:max-w-[860px]">
                <PostCard
                  bundle={bundle}
                  locale={locale}
                  post={featured}
                  variant="featured"
                  headingLevel={2}
                />
              </div>
              <PostList bundle={bundle} locale={locale} posts={rest} heading={sys('blog.index.latest')} />
            </>
          ) : (
            <div data-testid="blog-empty-wrap" className="flex flex-col items-center gap-4">
              <EmptyState
                testId="blog-empty"
                headingLevel={2}
                title={sys('blog.empty.title')}
                body={sys('blog.empty.body')}
                className="w-full"
              />
              {otherIndex ? (
                <NextLink
                  href={otherIndex}
                  hrefLang={other}
                  prefetch={false}
                  data-testid="blog-empty-cta"
                  className={buttonClassName('secondary', 'md')}
                >
                  {sys('blog.empty.cta')}
                </NextLink>
              ) : null}
            </div>
          )}
        </div>
      </Section>

      {/* ---- Newsletter: hidden in Phase A, nothing rendered, nothing wrapping it (W5/W97) ---- */}
      <NewsletterBand bundle={bundle} locale={locale} active={NEWSLETTER_ACTIVE} />

      {/* ---- Closing band (blog.042–046): the gradient card; ticks phone-only (blog.044 legal,
              verbatim; blog.045 re-authored with {homepageReplyHours} → makeTf, D17) ---- */}
      <Section tone="band">
        <div className="container-site">
          <ClosingCtaBand
            bundle={bundle}
            locale={locale}
            id="blog-cta"
            tone="gradient"
            titleId="blog.042"
            bodyId="blog.043"
            primary={{ label: t('blog.046'), href: HIRE_FORM, variant: 'secondary' }}
            secondary={{ label: t('home.221'), href: whatsapp, external: true }}
            ticks={[tf('blog.044'), tf('blog.045')]}
          />
        </div>
      </Section>

      {/* The reading-progress bar, loaded on the first scroll (B-13). */}
      <ScrollEnhancementsLoader />
    </>
  );
}
```

`src/lib/seo/routes.ts` — in the `UNBUILT_PATHNAMES` literal, delete the line `  '/blog',` (keep `'/blog/[slug]',` until Cycle 5). Nothing else changes: `robotsDisallowPaths` now yields `/blog` in TR and `/en/blog` in EN (the subtraction runs per key before the prefix fold, W37), and the sitemap keeps excluding both (`NOINDEX_PATHNAMES`).

`e2e/routes.ts` — append to the end of the `GATE_ROUTE_TABLE` literal (after the rows earlier tasks added):

```ts
  // T12: the blog index — noindex (W4): axe, the width sweep and the placeholder counter sweep
  // it; Lighthouse and the sitemap never do. The TR index is the W6 empty state.
  { path: '/blog', indexable: false },
  { path: '/en/blog', indexable: false },
```

`docs/SEO.md` — (1) append one row to T1's `## Pages` table (W98):

```markdown
| Blog index | `/blog` · `/en/blog` | `sys.seo.blog.{title,description}` — the `blog` record carries `''` ids (W23/W38); OG image `/og/{locale}/blog.png` (title `sys.seo.blog.title`, CDN-cached, W123) | `absoluteUrl(locale, '/blog')`; hreflang tr/en + x-default = tr (both locales exist) | `BreadcrumbList` (`Breadcrumbs`: `blog.022` → `/`, `blog.004` → this page, W109) | `h1` (`data-lcp-slot="h1"`; the rotating word never reflows it — T12 B-4); `blog-hero` is a named placeholder (B-7) | **noindex** (page record, W4) until six Turkish bodies — out of nav and the sitemap, robots `Disallow: /blog` + `/en/blog`; written articles only (the TR index is the W6 empty state linking to `/en/blog`); the tools bar is dormant below six non-featured written articles (B-5); no newsletter band (W5/W97); SSG, no `revalidate` (W150) |
```

(2) in `## Robots`, the sentence that begins "Today that is" — in the wording T13 left it ("Today that is `/tesekkurler`, `/portal-girisi`, `/abone-onay`, `/abonelikten-cik` and their `/en/…` forms (T13 built the portal door and the newsletter one-shots); `/blog` appears by itself when T12 deletes its key (W20)") — becomes: "Today that is `/tesekkurler`, `/portal-girisi`, `/abone-onay`, `/abonelikten-cik`, `/blog` and their `/en/…` forms (T13 built the portal door and the newsletter one-shots, T12 the blog — `/blog/[slug]` folds onto the `/blog` prefix)". If T13's wording differs, keep its list and add `/blog` to it the same way; the rest of the paragraph (the six-Turkish-bodies flip, the crawler allowlist) is unchanged.

- [ ] **Step 4: Verify**

```bash
npx prettier --write "src/app/[locale]/(site)/blog/_components/HeroArt.tsx" "src/app/[locale]/(site)/blog/_components/PostList.tsx" "src/app/[locale]/(site)/blog/page.tsx" "src/app/[locale]/(site)/blog/__tests__/index-sections.test.tsx" src/lib/seo/routes.ts e2e/routes.ts docs/SEO.md
NODE_OPTIONS=--max-old-space-size=4096 npx vitest run "src/app/[locale]/(site)/blog" src/lib/seo src/app/robots.test.ts src/app/sitemap.test.ts scripts/gate-routes.test.ts --maxWorkers=1
npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
```

Expected: `index-sections.test.tsx` 4 cases green; `unbuilt.test.ts` green (`blog/page.tsx` exists and `'/blog'` is gone; `[slug]` has no `page.tsx` yet and `'/blog/[slug]'` stays); `routes.test.ts`/`robots.test.ts`/`sitemap.test.ts` green (their `/blog` assertions are conditional on the set); `gate-routes.test.ts` green (the two rows are `indexable: false`, so the indexable TR/EN halves stay equal); `class-collisions.test.ts` green (the page's literals: `m-0`/`mt-0`/`mb-*` and `py-16`/`pb-*` pairs are shorthand + longhand, `hidden` only as `md:hidden`/`max-md:hidden`, `buttonClassName('secondary', 'md')` without caller classes); `client-imports.test.ts` green (the page and its server sections import every block/primitive/date function by path — `formatReadMinutes` from its own module in `HeroArt`, a server module); the full suite green. `sys.rich` and `sys.raw` are next-intl's server translator methods — `tsc` proves the call shapes.

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/blog/_components/HeroArt.tsx" "src/app/[locale]/(site)/blog/_components/PostList.tsx" "src/app/[locale]/(site)/blog/page.tsx" "src/app/[locale]/(site)/blog/__tests__/index-sections.test.tsx" src/lib/seo/routes.ts e2e/routes.ts docs/SEO.md
git commit -F - <<'MSG'
feat(blog): the index page — rotating hero, written articles only, W6 empty state; /blog leaves UNBUILT (T12 c4)

/blog and /en/blog: own-page crumbs (W109), the rich h1 with the rotating word
(B-4; the LCP element, B-7), the featured written article (EN) or the designed
empty state linking to the English index (TR, W6), the dormant tools bar (B-5),
no newsletter band (W5/W97) and the gradient closing band with typed
#request-form hrefs (W82). noindex from the record (W4); robots now disallows
/blog + /en/blog (W20/W37); two indexable:false gate rows (W21).

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
MSG
```

---

#### Cycle 5 — The article page: `/blog/[slug]` · `/en/blog/[slug]` (body, FAQ, lazy sidebar, related), `/blog/[slug]` leaves `UNBUILT_PATHNAMES`, the docs

- [ ] **Step 1: Write the failing tests**

`src/app/[locale]/(site)/blog/[slug]/__tests__/ArticleBody.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { BlogPost } from '@/content/collections';
import { BLOCK_STRINGS, testBundle } from '@/test/bundle';
import { collisionsInTree } from '@/test/class-collisions';
import { renderWithIntl } from '@/test/render';
import { ArticleBody } from '../_components/ArticleBody';
import { RelatedPosts } from '../_components/RelatedPosts';
import { parseMarkdown } from '../_lib/markdown';

const MD = [
  'Intro **bold**.',
  '> **Takeaways**\n>\n> - One',
  '## First section',
  '**Rule** — A lead card.',
  '- Contract\n- Passport',
  '- Salary below the ministry minimum for the role, the most common reason\n- Contract details that do not match the online application',
  '## Second section',
  '1. **Step.** Do it.',
  '> Quote.',
].join('\n\n');

describe('ArticleBody (B-8, B-11)', () => {
  it('renders the headings with their TOC ids, the takeaways box, a lead card, the lists, the steps and the quote', () => {
    const { container } = render(<ArticleBody blocks={parseMarkdown(MD)} />);
    expect(screen.getAllByRole('heading', { level: 2 }).map((h) => h.id)).toEqual([
      'first-section',
      'second-section',
    ]);
    expect(screen.getByTestId('article-takeaways')).toHaveTextContent('Takeaways');
    expect(screen.getByText('Rule').tagName).toBe('P');
    expect(screen.getByText('Step.').tagName).toBe('STRONG');
    expect(screen.getByText('Quote.').closest('blockquote')).not.toBeNull();
    expect(collisionsInTree(container)).toEqual([]);
  });

  it('a list of short items is the two-column checklist; long items stay one column', () => {
    render(<ArticleBody blocks={parseMarkdown(MD)} />);
    const [, checklist, reasons] = screen.getAllByRole('list');
    expect(checklist.className).toContain('sm:grid-cols-2');
    expect(reasons.className).not.toContain('sm:grid-cols-2');
  });

  it('puts the closing CTA inside the final quote box', () => {
    render(<ArticleBody blocks={parseMarkdown(MD)} closingCta={<a href="#talk">Talk</a>} />);
    expect(screen.getByTestId('article-quote')).toContainElement(
      screen.getByRole('link', { name: 'Talk' }),
    );
  });

  it('puts it after the body when the last block is not a quote', () => {
    render(<ArticleBody blocks={parseMarkdown('Just text.')} closingCta={<a href="#talk">Talk</a>} />);
    expect(screen.queryByTestId('article-quote')).toBeNull();
    expect(screen.getByRole('link', { name: 'Talk' })).toBeInTheDocument();
  });

  it('never turns body text into markup', () => {
    const { container } = render(
      <ArticleBody blocks={parseMarkdown('<b>x</b> <script>y</script>')} />,
    );
    expect(container.querySelector('b, script')).toBeNull();
    expect(container.textContent).toContain('<b>x</b>');
  });
});

const row = (key: string): BlogPost => ({
  key,
  slug: { tr: `${key}-tr`, en: key },
  title: { tr: `Başlık ${key}`, en: `Title ${key}` },
  excerpt: { tr: 'Özet', en: 'Excerpt' },
  category: 'workPermits',
  categoryLabelId: 'home.263',
  author: 'JobsAdmire',
  publishedAt: '2026-06-12',
  readMinutes: 5,
  hasBody: { tr: true, en: true },
  body: { tr: 'metin', en: 'text' },
});
const bundle = testBundle({
  strings: {
    ...BLOCK_STRINGS,
    'home.263': 'Work Permits',
    'blogarticle.081': 'Related articles',
    'blogarticle.082': '← Previous article',
    'blogarticle.083': 'Next article →',
  },
});

describe('RelatedPosts (B-2)', () => {
  it('renders nothing without related articles or neighbours — the Phase A state', () => {
    const { container } = renderWithIntl(
      <RelatedPosts bundle={bundle} locale="en" related={[]} prev={null} next={null} />,
      { locale: 'en' },
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the related cards (the third hidden on phones) and the neighbour links', () => {
    const { container } = renderWithIntl(
      <RelatedPosts
        bundle={bundle}
        locale="en"
        related={[row('a'), row('b'), row('c')]}
        prev={row('p')}
        next={null}
      />,
      { locale: 'en' },
    );
    expect(screen.getByRole('heading', { level: 2, name: 'Related articles' })).toBeInTheDocument();
    const items = screen.getByTestId('article-related').querySelectorAll('li');
    expect(items).toHaveLength(3);
    expect(items[2].className).toContain('max-md:hidden');
    expect(screen.getByTestId('article-prev')).toHaveAttribute('href', '/en/blog/p');
    expect(screen.queryByTestId('article-next')).toBeNull();
    expect(collisionsInTree(container)).toEqual([]);
  });
});
```

`src/app/[locale]/(site)/blog/[slug]/__tests__/ArticleSidebar.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { collisionsInTree } from '@/test/class-collisions';
import { ArticleSidebar, type ArticleSidebarProps } from '../_components/ArticleSidebar';
import { ArticleSidebarFallback } from '../_components/ArticleSidebarFallback';
import { ArticleSidebarIsland } from '../_components/ArticleSidebarIsland';

const PROPS: ArticleSidebarProps = {
  headings: [
    { id: 'who-can-hire', text: 'Who can hire?' },
    { id: 'documents', text: 'Documents' },
    { id: 'faq', text: 'FAQ' },
  ],
  tocLabel: 'In this article',
  readMinutes: 8,
  remaining: '≈ {n} min left',
  url: 'https://www.jobsadmire.com/en/blog/guide',
  title: "Turkey work permit: the employer's guide",
  share: {
    heading: 'Share',
    share: 'Share',
    whatsapp: 'Share on WhatsApp',
    linkedin: 'Share on LinkedIn',
    x: 'Share on X',
    copy: 'Copy link',
    copied: 'Copied!',
    copyFailed: 'The link could not be copied.',
  },
  printLabel: 'Print this article',
};

describe('the article sidebar island and its fallback (B-13, W132)', () => {
  it('the server fallback is DOM-identical to the island’s first render — the LazyIsland swap never shifts the layout', () => {
    expect(renderToStaticMarkup(<ArticleSidebarFallback {...PROPS} />)).toBe(
      renderToStaticMarkup(<ArticleSidebar {...PROPS} />),
    );
  });

  it('server-renders the TOC landmark (first entry current), the remaining time, the share links and the print button', () => {
    const html = renderToStaticMarkup(<ArticleSidebarFallback {...PROPS} />);
    expect(html).toContain('<nav aria-label="In this article">');
    expect(html).toContain('href="#who-can-hire" aria-current="location"');
    expect(html).toContain('≈ 8 min left');
    expect(html).toContain('https://wa.me/?text=');
    expect(html).toContain('print-hidden mt-3');
  });

  it('the binder shows the fallback until the wrapper is in view (jsdom has no IntersectionObserver)', () => {
    const { container } = render(
      <ArticleSidebarIsland {...PROPS} fallback={<ArticleSidebarFallback {...PROPS} />} />,
    );
    expect(screen.getByRole('navigation', { name: 'In this article' })).toBeInTheDocument();
    expect(screen.getByTestId('article-share')).toBeInTheDocument();
    expect(collisionsInTree(container)).toEqual([]);
  });
});
```

`src/app/[locale]/(site)/blog/__tests__/gate-row.test.ts`:

```ts
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { getCollection } from '@/content/collections';
import { BundleSchema } from '../../../../../../contract/website-bundle.v1';
import { GATE_ROUTE_TABLE } from '../../../../../../e2e/routes';
import { writtenPosts } from '../_lib/posts';

const load = (locale: 'tr' | 'en') =>
  BundleSchema.parse(
    JSON.parse(
      readFileSync(join(process.cwd(), 'src/content/local', `bundle.${locale}.json`), 'utf8'),
    ),
  );

describe('the blog gate rows (W21, B-14)', () => {
  const blogRows = GATE_ROUTE_TABLE.filter(
    (r) => r.path === '/blog' || r.path.startsWith('/blog/') || r.path.startsWith('/en/blog'),
  );

  it('sweeps both indexes and the one written article — all noindex, never audited by Lighthouse', () => {
    expect(blogRows.map((r) => r.path)).toEqual([
      '/blog',
      '/en/blog',
      '/en/blog/turkey-work-permit-process-employer-guide',
    ]);
    expect(blogRows.every((r) => !r.indexable)).toBe(true);
  });

  it('the article row is the newest written EN article; no TR article row while TR has none', () => {
    const [newest] = writtenPosts(getCollection(load('en'), 'blog'), 'en');
    expect(blogRows.find((r) => r.path.startsWith('/en/blog/'))?.path).toBe(
      `/en/blog/${newest.slug.en}`,
    );
    expect(writtenPosts(getCollection(load('tr'), 'blog'), 'tr')).toHaveLength(0);
    expect(blogRows.some((r) => r.path.startsWith('/blog/'))).toBe(false);
  });
});
```

- [ ] **Step 2: Run to verify they fail**

```bash
NODE_OPTIONS=--max-old-space-size=4096 npx vitest run "src/app/[locale]/(site)/blog" --maxWorkers=1
```

Expected: `ArticleBody.test.tsx` and `ArticleSidebar.test.tsx` fail to resolve their `_components/*` imports; `gate-row.test.ts` fails both cases (the article row is missing — the blog rows are `['/blog', '/en/blog']`).

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/blog/[slug]/_lib/sidebar.ts`:

```ts
/**
 * Shared by the sidebar island (`ArticleSidebar`, client) and its server fallback
 * (`ArticleSidebarFallback`), so the LazyIsland swap is DOM-identical (W132, B-13). Pure
 * strings and one pure function — no imports.
 */
export const SIDEBAR_STACK = 'flex flex-col gap-4';
/** Hidden on phones: the `<details>` TOC above the body replaces it there (B-12). */
export const TOC_CARD = 'rounded-base border border-border-1 bg-white p-5 max-md:hidden';
export const SHARE_CARD = 'rounded-base border border-border-1 bg-white p-5';
export const PRINT_CLASS = 'mt-3';

/** ScrollSpyToc's first remaining-time line — its server snapshot, before any scroll: the
 *  whole read time left, `{n}` filled exactly as the island fills it. */
export function remainingText(readMinutes: number, template: string): string {
  return template.replace('{n}', String(Math.max(0, Math.ceil(readMinutes))));
}
```

`src/app/[locale]/(site)/blog/[slug]/_components/ArticleBody.tsx`:

```tsx
import { Fragment, type ReactNode } from 'react';
import type { Block, Inline } from '../_lib/markdown';

/** The body's h2 face — the page's FAQ heading wears it too. `scroll-mt-24` keeps a TOC jump
 *  clear of the sticky header; `xl:` is the D19 ×0.75 step. */
export const ARTICLE_H2 =
  'mt-10 mb-4 scroll-mt-24 text-[26px] leading-tight font-extrabold tracking-[-0.4px] text-ink xl:text-[19.5px]';

/** A list whose every item is this short reads as a checklist — two columns from `sm` (the
 *  design's "Documents you'll need" grid); longer items (the rejection reasons) stay one column. */
const CHECKLIST_MAX_CHARS = 40;
const plain = (inlines: readonly Inline[]) => inlines.map((n) => n.text).join('');

function Inlines({ inlines }: { inlines: readonly Inline[] }) {
  return (
    <>
      {inlines.map((n, i) =>
        n.kind === 'strong' ? (
          <strong key={i} className="font-extrabold text-ink">
            {n.text}
          </strong>
        ) : (
          <Fragment key={i}>{n.text}</Fragment>
        ),
      )}
    </>
  );
}

function BlockView({ block, first, cta }: { block: Block; first: boolean; cta?: ReactNode }) {
  switch (block.kind) {
    case 'p':
      return (
        <p className={first ? 'text-body-lg mt-0 mb-5 text-ink' : 'mt-0 mb-5'}>
          <Inlines inlines={block.inlines} />
        </p>
      );
    case 'h2':
      return (
        <h2 id={block.id} className={ARTICLE_H2}>
          {block.text}
        </h2>
      );
    case 'callout':
      return (
        <div
          data-testid="article-takeaways"
          className="my-6 rounded-base border border-tint-border bg-pale-1 px-7 py-6"
        >
          <p className="text-eyebrow mt-0 mb-3 font-extrabold tracking-[1.2px] text-blue-safe uppercase">
            {block.title}
          </p>
          <ul className="m-0 flex list-none flex-col gap-2 p-0 font-semibold text-ink">
            {block.items.map((item, j) => (
              <li key={j} className="flex gap-2.5">
                <span aria-hidden="true" className="shrink-0 text-blue-safe">
                  →
                </span>
                <span>
                  <Inlines inlines={item} />
                </span>
              </li>
            ))}
          </ul>
        </div>
      );
    case 'leads':
      return (
        <div className="mb-5 grid gap-4 md:grid-cols-2">
          {block.items.map((item, j) => (
            <div key={j} className="rounded-sm border border-tint-border bg-pale-1 px-5 py-5">
              <p className="mt-0 mb-1.5 text-[22px] leading-tight font-extrabold text-blue-safe xl:text-[16.5px]">
                {item.lead}
              </p>
              <p className="text-body-sm m-0 leading-relaxed">
                <Inlines inlines={item.body} />
              </p>
            </div>
          ))}
        </div>
      );
    case 'ul': {
      const checklist = block.items.every((item) => plain(item).length <= CHECKLIST_MAX_CHARS);
      return (
        <ul
          className={
            checklist
              ? 'mt-0 mb-5 grid list-none gap-x-6 gap-y-3 rounded-base border border-tint-border bg-white p-6 sm:grid-cols-2'
              : 'mt-0 mb-5 flex list-none flex-col gap-3 rounded-base border border-tint-border bg-white p-6'
          }
        >
          {block.items.map((item, j) => (
            <li key={j} className="text-body-sm flex items-start gap-2.5 font-semibold text-ink">
              <span aria-hidden="true" className="mt-1.5 h-2 w-2 shrink-0 rounded-pill bg-blue-safe" />
              <span>
                <Inlines inlines={item} />
              </span>
            </li>
          ))}
        </ul>
      );
    }
    case 'ol':
      return (
        <ol className="mt-0 mb-5 flex list-none flex-col gap-3.5 p-0">
          {block.items.map((item, j) => (
            <li key={j} className="flex items-start gap-4">
              <span
                aria-hidden="true"
                className="text-body-sm flex h-8 w-8 shrink-0 items-center justify-center rounded-pill bg-blue-safe font-extrabold text-white"
              >
                {j + 1}
              </span>
              <span className="pt-1">
                <Inlines inlines={item} />
              </span>
            </li>
          ))}
        </ol>
      );
    case 'quote':
      return (
        <div
          data-testid="article-quote"
          className="mt-8 mb-2 rounded-lg border border-tint-border bg-gradient-to-br from-pale-1 to-tint px-8 py-7"
        >
          <span aria-hidden="true" className="block text-[40px] leading-none font-extrabold text-blue-safe">
            “
          </span>
          <blockquote className="m-0">
            <p className="text-body-lg m-0 font-semibold text-ink">
              <Inlines inlines={block.inlines} />
            </p>
          </blockquote>
          {cta ? <div className="mt-4">{cta}</div> : null}
        </div>
      );
  }
}

/**
 * The parsed v1 body (B-8) in the design's article typography: the intro, the Key-takeaways box,
 * the H2 sections (ids for the TOC), the two-up rule cards, the lists, the numbered steps and the
 * pull quote. React nodes only — no HTML string, so nothing needs sanitising. `closingCta` (B-11)
 * renders inside the final quote box when the body ends with one, else after the body.
 */
export function ArticleBody({
  blocks,
  closingCta,
}: {
  blocks: readonly Block[];
  closingCta?: ReactNode;
}) {
  const last = blocks.length - 1;
  const ctaInQuote = closingCta != null && blocks[last]?.kind === 'quote';
  return (
    <div className="text-body leading-relaxed text-text-secondary">
      {blocks.map((block, i) => (
        <BlockView
          key={i}
          block={block}
          first={i === 0}
          cta={ctaInQuote && i === last ? closingCta : undefined}
        />
      ))}
      {closingCta != null && !ctaInQuote ? <div className="mt-8">{closingCta}</div> : null}
    </div>
  );
}
```

`src/app/[locale]/(site)/blog/[slug]/_components/ArticleSidebar.tsx`:

```tsx
'use client';
import { PrintButton } from '@/design/islands/PrintButton';
import { ScrollSpyToc, type TocHeading } from '@/design/islands/ScrollSpyToc';
import { ShareRow, type ShareLabels } from '@/design/islands/ShareRow';
import { PRINT_CLASS, SHARE_CARD, SIDEBAR_STACK, TOC_CARD } from '../_lib/sidebar';

export type ArticleSidebarProps = {
  headings: TocHeading[];
  /** blogarticle.024 — the TOC's visible eyebrow and its landmark name. */
  tocLabel: string;
  readMinutes: number;
  /** "≈ {n} min left" — ScrollSpyToc's string props (W85): `{n}` is the literal token. */
  remaining: string;
  /** The article's absolute canonical URL (ShareRow: never a design literal). */
  url: string;
  title: string;
  share: ShareLabels;
  printLabel: string;
};

/**
 * B-13: the article sidebar as ONE lazy island — the scroll-spy TOC (the post's own read time,
 * W85 string props), the share row (W133 `copyFailed`) and the print button (B-16), loaded by
 * `ArticleSidebarIsland` when the sidebar nears the viewport. Its first render must stay
 * DOM-identical to `ArticleSidebarFallback` (`ArticleSidebar.test.tsx` compares the two).
 */
export function ArticleSidebar({
  headings,
  tocLabel,
  readMinutes,
  remaining,
  url,
  title,
  share,
  printLabel,
}: ArticleSidebarProps) {
  return (
    <div className={SIDEBAR_STACK}>
      <div className={TOC_CARD}>
        <ScrollSpyToc
          headings={headings}
          label={tocLabel}
          heading={tocLabel}
          readMinutes={readMinutes}
          remainingSingular={remaining}
          remainingPlural={remaining}
        />
      </div>
      <div className={SHARE_CARD} data-testid="article-share">
        <ShareRow url={url} title={title} labels={share} />
        <PrintButton label={printLabel} className={PRINT_CLASS} />
      </div>
    </div>
  );
}
```

`src/app/[locale]/(site)/blog/[slug]/_components/ArticleSidebarFallback.tsx`:

```tsx
import { LinkedInIcon, LinkIcon, WhatsAppIcon, XIcon } from '@/design/chrome/icons';
import { buttonClassName } from '@/design/primitives/Button';
import { PRINT_CLASS, remainingText, SHARE_CARD, SIDEBAR_STACK, TOC_CARD } from '../_lib/sidebar';
import type { ArticleSidebarProps } from './ArticleSidebar';

// The islands' own first render, mirrored for the LazyIsland fallback (W132: DOM-identical, so the
// swap never shifts the layout): ScrollSpyToc's server snapshot (the first heading current, no
// scroll progress), ShareRow without Web Share (a browser fact read after hydration) and with an
// empty status line, and PrintButton's `Button`. `ArticleSidebar.test.tsx` renders both with
// `renderToStaticMarkup` and fails on any drift — mirror a foundation island's change here.
const TOC_LINK = 'block border-l-2 py-1.5 pl-3 text-body-sm no-underline transition-colors';
const TOC_CURRENT = 'border-blue-safe font-extrabold text-ink';
const TOC_OTHER = 'border-border-2 text-text-secondary hover:text-ink';
const SHARE_ITEM =
  'inline-flex min-h-[44px] items-center gap-2 rounded-pill border border-border-1 bg-white px-4 text-body-sm font-bold text-ink no-underline transition-colors hover:bg-pale-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe';

/** B-13: the sidebar's server HTML — a real TOC landmark and real share links before the island
 *  loads, and for good on a device that never scrolls to it. No directive, no hooks. */
export function ArticleSidebarFallback({
  headings,
  tocLabel,
  readMinutes,
  remaining,
  url,
  title,
  share,
  printLabel,
}: ArticleSidebarProps) {
  const text = encodeURIComponent(`${title} ${url}`);
  const encoded = encodeURIComponent(url);
  return (
    <div className={SIDEBAR_STACK}>
      <div className={TOC_CARD}>
        <nav aria-label={tocLabel}>
          <p className="mb-2 text-eyebrow font-extrabold uppercase tracking-wide text-blue-safe">
            {tocLabel}
          </p>
          <ol className="m-0 list-none p-0">
            {headings.map((h, i) => (
              <li key={h.id}>
                <a
                  href={`#${h.id}`}
                  aria-current={i === 0 ? 'location' : undefined}
                  className={[TOC_LINK, i === 0 ? TOC_CURRENT : TOC_OTHER].join(' ')}
                >
                  {h.text}
                </a>
              </li>
            ))}
          </ol>
          <p className="mt-3 text-body-sm text-text-tertiary">
            {remainingText(readMinutes, remaining)}
          </p>
        </nav>
      </div>
      <div className={SHARE_CARD} data-testid="article-share">
        <div className="flex flex-col gap-2">
          <p className="m-0 text-body-sm font-bold text-text-secondary">{share.heading}</p>
          <div className="flex flex-wrap gap-2">
            <a
              href={`https://wa.me/?text=${text}`}
              target="_blank"
              rel="noopener noreferrer"
              className={SHARE_ITEM}
            >
              <WhatsAppIcon size={15} />
              {share.whatsapp}
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`}
              target="_blank"
              rel="noopener noreferrer"
              className={SHARE_ITEM}
            >
              <LinkedInIcon size={15} />
              {share.linkedin}
            </a>
            <a
              href={`https://x.com/intent/post?url=${encoded}&text=${encodeURIComponent(title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className={SHARE_ITEM}
            >
              <XIcon size={14} />
              {share.x}
            </a>
            <button type="button" className={SHARE_ITEM}>
              <LinkIcon size={15} />
              {share.copy}
            </button>
          </div>
          <p
            role="status"
            aria-live="polite"
            className="m-0 min-h-[1.25rem] text-body-sm text-success-text"
          />
        </div>
        <button type="button" className={buttonClassName('secondary', 'md', `print-hidden ${PRINT_CLASS}`)}>
          {printLabel}
        </button>
      </div>
    </div>
  );
}
```

`src/app/[locale]/(site)/blog/[slug]/_components/ArticleSidebarIsland.tsx`:

```tsx
'use client';
import type { ReactNode } from 'react';
import { LazyIsland } from '@/design/islands/LazyIsland';
import type { ArticleSidebarProps } from './ArticleSidebar';

// A function prop cannot cross the server → client boundary, so the `load` thunk lives in this
// thin client module (T1's binder pattern); the type-only import keeps the island itself out of
// this eager chunk.
const load = () => import('./ArticleSidebar').then((m) => ({ default: m.ArticleSidebar }));

/** B-13 / W132: the sidebar island loads once its wrapper comes within 200 px of the viewport and
 *  stays mounted; until then — and for good if the chunk fails — the DOM-identical server
 *  fallback shows. On phones the TOC card is hidden and the share card sits below the body, so
 *  the chunk loads only when the reader gets there (never during the mobile first-load audit). */
export function ArticleSidebarIsland({
  fallback,
  ...props
}: ArticleSidebarProps & { fallback: ReactNode }) {
  return <LazyIsland load={load} props={props} fallback={fallback} />;
}
```

`src/app/[locale]/(site)/blog/[slug]/_components/RelatedPosts.tsx`:

```tsx
import type { BlogPost } from '@/content/collections';
import { makeT } from '@/content/pure';
import { PostCard } from '@/design/blocks/PostCard';
import { Section } from '@/design/primitives/Section';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../../../../../contract/website-bundle.v1';
import { articleHref } from '../../_lib/posts';

const NEIGHBOUR =
  'flex flex-col gap-1.5 rounded-base border border-border-4 bg-white px-6 py-5 no-underline transition-colors hover:border-blue-safe focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe';

/**
 * B-2: related articles (same category first, the third card hidden on phones — W10 by class)
 * and the previous/next links. The page passes data only once the blog is launched
 * (`blogNavVisible`, W4) and another written article exists; otherwise everything is empty and
 * this renders nothing at all — no empty section (it owns its `Section`, the W97 pattern).
 */
export function RelatedPosts({
  bundle,
  locale,
  related,
  prev,
  next,
}: {
  bundle: Bundle;
  locale: Locale;
  related: readonly BlogPost[];
  prev: BlogPost | null;
  next: BlogPost | null;
}) {
  if (related.length === 0 && !prev && !next) return null;
  const t = makeT(bundle);
  const neighbour = (post: BlogPost | null, labelId: string, testId: string) => {
    const href = post ? articleHref(post, locale) : null;
    const title = post?.title[locale];
    if (!href || !title) return <span aria-hidden="true" />;
    return (
      <Link href={href} data-testid={testId} className={NEIGHBOUR}>
        <span className="text-eyebrow font-extrabold tracking-[1px] text-text-tertiary uppercase">
          {t(labelId)}
        </span>
        <span className="text-body font-extrabold text-ink">{title}</span>
      </Link>
    );
  };
  return (
    <Section tone="light">
      <div className="container-site" data-testid="article-related">
        {related.length > 0 ? (
          <>
            <h2 className="text-h2 mt-0 mb-5">{t('blogarticle.081')}</h2>
            <ul className="m-0 grid list-none gap-6 p-0 md:grid-cols-3">
              {related.map((post, i) => (
                <li key={post.key} className={i === 2 ? 'max-md:hidden' : undefined}>
                  <PostCard bundle={bundle} locale={locale} post={post} variant="card" headingLevel={3} />
                </li>
              ))}
            </ul>
          </>
        ) : null}
        {prev || next ? (
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {neighbour(prev, 'blogarticle.082', 'article-prev')}
            {neighbour(next, 'blogarticle.083', 'article-next')}
          </div>
        ) : null}
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/blog/[slug]/page.tsx`:

```tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getBundle, makeT, makeTf, metricValues } from '@/content/adapter';
import { blogNavVisible, getCollection, getRateConfig } from '@/content/collections';
import { Breadcrumbs } from '@/design/blocks/Breadcrumbs';
import { ClosingCtaBand } from '@/design/blocks/ClosingCtaBand';
import { ContactCta } from '@/design/blocks/ContactCta';
import { FaqBlock, type FaqItem } from '@/design/blocks/FaqBlock';
import { ImageSlot } from '@/design/blocks/ImageSlot';
import { NewsletterBand } from '@/design/blocks/NewsletterBand';
import { Section } from '@/design/primitives/Section';
import type { Href } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { waLink } from '@/lib/contact';
import { formatDate } from '@/lib/format/date/formatDate';
import { formatReadMinutes } from '@/lib/format/date/formatReadMinutes';
import { formatInt } from '@/lib/format/money';
import { JsonLd } from '@/lib/seo/JsonLdScript';
import { articleJsonLd } from '@/lib/seo/jsonld';
import { buildMetadata } from '@/lib/seo/metadata';
import { absoluteUrl, pageOgImageUrl } from '@/lib/seo/routes';
import { ScrollEnhancementsLoader } from '../_components/ScrollEnhancementsLoader';
import {
  articleAlternates,
  articleHref,
  findWritten,
  isWritten,
  otherLocale,
  prevNext,
  relatedPosts,
  writtenPosts,
} from '../_lib/posts';
import { ARTICLE_H2, ArticleBody } from './_components/ArticleBody';
import type { ArticleSidebarProps } from './_components/ArticleSidebar';
import { ArticleSidebarFallback } from './_components/ArticleSidebarFallback';
import { ArticleSidebarIsland } from './_components/ArticleSidebarIsland';
import { RelatedPosts } from './_components/RelatedPosts';
import { headings, parseMarkdown } from './_lib/markdown';

type Params = { locale: string; slug: string };

/** W5/W97 (D14): hidden until counsel clears — nothing rendered, nothing wrapping it (B-6). */
const NEWSLETTER_ACTIVE = false;
/** W82: every "Request Workers →" lands on the Hire Workers form (T2 renders the anchor). */
const HIRE_FORM: Exclude<Href, string> = { pathname: '/hire-workers', hash: '#request-form' };
const FAQ_ID = 'faq';
const BAND_ID = 'blog-cta';
/** The page's own ids a body heading may never take (B-8). */
const RESERVED_IDS = [FAQ_ID, 'faq-list', BAND_ID, 'main'];

/** B-1: only the slugs written in that locale are prerendered (one EN, zero TR today). Any other
 *  slug still renders on demand (`dynamicParams` stays true — an article Operations publishes in
 *  Phase B needs no redeploy) and answers 404 through `findWritten` (W151). */
export async function generateStaticParams({ params }: { params: { locale: string } }) {
  const { locale } = params;
  if (!hasLocale(routing.locales, locale)) return [];
  const bundle = await getBundle(locale);
  return writtenPosts(getCollection(bundle, 'blog'), locale).flatMap((post) => {
    const slug = post.slug[locale];
    return slug ? [{ slug }] : [];
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const [bundle, sys] = await Promise.all([
    getBundle(locale),
    getTranslations({ locale, namespace: 'sys' }),
  ]);
  const post = findWritten(getCollection(bundle, 'blog'), locale, slug);
  const href = post ? articleHref(post, locale) : null;
  const title = post?.title[locale];
  if (!post || !href || !title) notFound();
  // W124/B-15: `blogArticle` is a template record without SEO fields, so the article's own
  // title, description, canonical (from `href`) and alternates win; hreflang only where it is
  // written. W169: the image is the index's; `sys.seo.blogArticle.title` does not exist on purpose.
  return buildMetadata({
    locale,
    href,
    bundle,
    pageKey: 'blogArticle',
    fallbackTitle: sys('blog.article.metaTitle', { title }),
    fallbackDescription: post.excerpt[locale] ?? title,
    alternates: articleAlternates(post),
    openGraph: {
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [makeT(bundle)('blogarticle.023')],
      images: [pageOgImageUrl(locale, 'blog')],
    },
  });
}

export default async function BlogArticle({ params }: { params: Promise<Params> }) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const [bundle, sys] = await Promise.all([
    getBundle(locale),
    getTranslations({ locale, namespace: 'sys' }),
  ]);
  const rows = getCollection(bundle, 'blog');
  const post = findWritten(rows, locale, slug);
  const href = post ? articleHref(post, locale) : null;
  const title = post?.title[locale];
  const body = post?.body[locale];
  if (!post || !href || !title || !body) notFound();

  const t = makeT(bundle);
  const tf = makeTf(bundle, locale);
  const values = metricValues(bundle, locale);
  const excerpt = post.excerpt[locale] ?? '';
  const blocks = parseMarkdown(body, RESERVED_IDS);
  // The design's TOC: the body's sections + the FAQ (its own short label, blogarticle.126).
  const toc = [...headings(blocks), { id: FAQ_ID, text: t('blogarticle.126') }];
  const tocLabel = t('blogarticle.024');
  const url = absoluteUrl(locale, href);
  const other = otherLocale(locale);
  const author = t('blogarticle.023');
  const readTime = formatReadMinutes(post.readMinutes, locale);
  const byline = `${formatDate(post.publishedAt, locale)} · ${readTime}`;
  // W4/B-2: related and prev/next only once the blog is launched (six Turkish bodies).
  const written = writtenPosts(rows, locale);
  const launched = blogNavVisible(bundle);
  const related = launched ? relatedPosts(written, post) : [];
  const { prev, next } = launched ? prevNext(written, post) : { prev: null, next: null };
  // W76/W95: static prefills only — page copy and the article's own title, never visitor input.
  const wa = (tail: string) =>
    waLink(bundle.settings.whatsappNumber, `${sys('whatsapp.prefill')}${tail}`);
  // B-10: A1 and Q3 have no package id; their numbers come from data (D17).
  const faq: FaqItem[] = [
    {
      id: 'q1',
      q: t('blogarticle.127'),
      a: sys('blog.faq.a1', {
        permitDays: values.permitDays,
        firstDayWeeks: values.firstDayWeeks,
      }),
    },
    { id: 'q2', q: t('blogarticle.128'), a: t('blogarticle.129') },
    {
      id: 'q3',
      q: sys('blog.faq.q3', { ratio: formatInt(getRateConfig(bundle).quotaRatio, locale) }),
      a: t('blogarticle.130'),
    },
    { id: 'q4', q: t('blogarticle.131'), a: t('blogarticle.132') },
  ];
  const sidebar: ArticleSidebarProps = {
    headings: toc,
    tocLabel,
    readMinutes: post.readMinutes,
    // The package splits "≈ N min left" into the number and blogarticle.141; ScrollSpyToc fills
    // the literal {n} token itself (W85 string props).
    remaining: `≈ {n} ${t('blogarticle.141')}`,
    url,
    title,
    share: {
      heading: t('blogarticle.069'),
      share: t('blogarticle.069'),
      whatsapp: t('blogarticle.074'),
      linkedin: t('blogarticle.075'),
      x: t('blogarticle.076'),
      copy: t('blogarticle.145'),
      copied: t('blogarticle.144'),
      copyFailed: sys('blog.article.copyFailed'),
    },
    printLabel: sys('blog.article.print'),
  };

  return (
    <>
      <article>
        <JsonLd
          data={articleJsonLd({
            headline: title,
            description: excerpt,
            url,
            image: pageOgImageUrl(locale, 'blog'),
            datePublished: post.publishedAt,
            authorName: author,
            authorType: 'Organization',
            publisherSettings: bundle.settings,
            locale,
          })}
        />

        {/* ---- Hero: crumbs (W109, B-9), pills, the h1 (the LCP element, B-7), byline ---- */}
        <Section tone="dark" className="relative overflow-hidden pb-32 md:pb-44">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 right-[6%] h-[340px] w-[340px] rounded-pill bg-[radial-gradient(circle,rgba(30,158,232,0.3),transparent_65%)]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-36 -left-16 h-[320px] w-[320px] rounded-pill bg-[radial-gradient(circle,rgba(22,163,74,0.16),transparent_65%)]"
          />
          <div className="container-site relative">
            <div className="mx-auto max-w-[980px]">
              <Breadcrumbs
                locale={locale}
                tone="dark"
                items={[
                  { name: t('blogarticle.022'), href: '/' },
                  { name: t('blogarticle.004'), href: '/blog' },
                  { name: title, href },
                ]}
              />
              <p className="mt-5 mb-4 flex flex-wrap gap-2.5">
                <span className="rounded-pill border border-sky/45 bg-blue/20 px-3.5 py-1 text-[12.5px] font-extrabold text-sky">
                  {t(post.categoryLabelId)}
                </span>
                {isWritten(post, other) ? (
                  <span
                    data-testid="article-lang-note"
                    className="rounded-pill border border-white/20 bg-white/10 px-3.5 py-1 text-[12.5px] font-bold text-white/75"
                  >
                    {locale === 'tr' ? t('blogarticle.143') : sys('blog.article.langNote')}
                  </span>
                ) : null}
              </p>
              <h1
                data-testid="page-h1"
                data-lcp-slot="h1"
                className="mt-0 mb-4 max-w-[880px] text-[27px] leading-[1.14] font-extrabold tracking-[-0.9px] md:text-[36px] lg:text-[44px] lg:leading-[1.1] xl:text-[33px]"
              >
                {title}
              </h1>
              <p className="text-body-lg mt-0 mb-6 max-w-[780px] font-semibold text-white/80">
                {excerpt}
              </p>
              <div className="flex items-center gap-3.5">
                <span
                  aria-hidden="true"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-pill bg-blue-safe text-[15px] font-extrabold text-white"
                >
                  JA
                </span>
                <p className="m-0">
                  <strong className="text-body block font-extrabold text-white">{author}</strong>
                  <span className="text-body-sm font-semibold text-white/65">{byline}</span>
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* ---- Cover: overlaps the hero; a named placeholder, never the LCP slot (B-7, W103) ---- */}
        <div className="container-site relative z-[2] -mt-24 md:-mt-32">
          <div className="mx-auto max-w-[980px] overflow-hidden rounded-lg">
            <ImageSlot slot={`blog-cover-${post.key}`} alt="" width={980} height={430} />
          </div>
        </div>

        {/* ---- Body + sidebar ---- */}
        <Section tone="light">
          <div className="container-site">
            <div className="mx-auto grid max-w-[1180px] items-start gap-14 lg:grid-cols-[minmax(0,1fr)_300px]">
              <div className="min-w-0">
                {/* ≤700 px: the TOC as a native disclosure — no JS (B-12) */}
                <details
                  data-testid="article-toc-mobile"
                  className="mb-5 overflow-hidden rounded-base border border-border-1 bg-white shadow-social md:hidden"
                >
                  <summary className="flex min-h-[54px] cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 [&::-webkit-details-marker]:hidden">
                    <span className="flex min-w-0 flex-col gap-0.5">
                      <span className="font-extrabold text-ink">{tocLabel}</span>
                      <span className="text-[12px] font-bold text-text-tertiary">
                        {`${sys('blog.article.sections', { n: toc.length })} · ${readTime}`}
                      </span>
                    </span>
                    <span aria-hidden="true" className="shrink-0 font-extrabold text-blue-safe">
                      +
                    </span>
                  </summary>
                  <nav aria-label={tocLabel}>
                    <ul className="m-0 flex list-none flex-col px-2.5 pt-0 pb-2.5">
                      {toc.map((h) => (
                        <li key={h.id} className="border-t border-border-3">
                          <a
                            href={`#${h.id}`}
                            className="text-body-sm flex min-h-[46px] items-center px-2 font-bold text-text-secondary no-underline"
                          >
                            {h.text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </details>

                {/* The printable region (B-16): a print-only title/byline + the body */}
                <div data-testid="article-body" className="print-isolate">
                  <div className="hidden print:block">
                    <p className="mt-0 mb-2 text-[22px] font-extrabold text-ink">{title}</p>
                    <p className="text-body-sm mt-0 mb-6 text-text-tertiary">{`${author} · ${byline}`}</p>
                  </div>
                  <ArticleBody
                    blocks={blocks}
                    closingCta={
                      <ContactCta
                        placement="page_cta"
                        href={wa(sys('blog.whatsapp.permit'))}
                        external
                        variant="primary"
                        className="print-hidden"
                      >
                        {t('blogarticle.064')}
                      </ContactCta>
                    }
                  />
                </div>

                {/* FAQ (B-10): the design's section heading, then one FaqBlock → one FAQPage */}
                <h2 id={FAQ_ID} className={ARTICLE_H2}>
                  {t('blogarticle.065')}
                </h2>
                <FaqBlock bundle={bundle} locale={locale} items={faq} id="faq-list" headingLevel={3} />

                {/* Author box (blogarticle.066–068; 068 is legal-flagged — verbatim) */}
                <div
                  data-testid="article-author"
                  className="mt-9 flex flex-wrap items-center gap-4 rounded-base border border-tint-border bg-pale-1 px-7 py-6"
                >
                  <span
                    aria-hidden="true"
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-pill bg-blue-safe text-[18px] font-extrabold text-white"
                  >
                    JA
                  </span>
                  <div className="min-w-[220px] flex-1">
                    <p className="mt-0 mb-1 font-extrabold text-ink">{t('blogarticle.066')}</p>
                    <p className="text-body-sm m-0 text-text-secondary">{t('blogarticle.067')}</p>
                  </div>
                  <p className="m-0 inline-flex items-center gap-2 rounded-pill border border-tint-border bg-white px-4 py-2 text-[13px] font-extrabold whitespace-nowrap text-blue-safe">
                    <span aria-hidden="true" className="h-2 w-2 rounded-pill bg-success" />
                    {t('blogarticle.068')}
                  </p>
                </div>
              </div>

              {/* Sidebar: the lazy island (TOC, share, print — B-13) + the CTA card (≥701 px) */}
              <div data-testid="article-sidebar" className="flex flex-col gap-4 lg:sticky lg:top-24">
                <ArticleSidebarIsland {...sidebar} fallback={<ArticleSidebarFallback {...sidebar} />} />
                <div className="rounded-base bg-gradient-to-br from-blue-safe to-navy p-6 text-white max-md:hidden">
                  <p className="mt-0 mb-1.5 text-[17px] leading-snug font-extrabold xl:text-[12.75px]">
                    {t('blogarticle.071')}
                  </p>
                  <p className="text-body-sm mt-0 mb-3.5">{t('blogarticle.072')}</p>
                  <ContactCta placement="page_cta" href={HIRE_FORM} variant="secondary" className="w-full">
                    {t('blogarticle.073')}
                  </ContactCta>
                </div>
              </div>
            </div>
          </div>
        </Section>
      </article>

      {/* ---- Related + prev/next: nothing below the W4 threshold (B-2) ---- */}
      <RelatedPosts bundle={bundle} locale={locale} related={related} prev={prev} next={next} />

      {/* ---- Newsletter: hidden in Phase A, nothing rendered (W5/W97) ---- */}
      <NewsletterBand bundle={bundle} locale={locale} active={NEWSLETTER_ACTIVE} />

      {/* ---- Closing band (blogarticle.092–095; 094 legal verbatim, 095 {homepageReplyHours} → makeTf) ---- */}
      <Section tone="band">
        <div className="container-site">
          <ClosingCtaBand
            bundle={bundle}
            locale={locale}
            id={BAND_ID}
            tone="gradient"
            titleId="blogarticle.092"
            bodyId="blogarticle.093"
            primary={{ label: t('blogarticle.073'), href: HIRE_FORM, variant: 'secondary' }}
            secondary={{ label: t('home.221'), href: wa(sys('blog.whatsapp.consult')), external: true }}
            ticks={[tf('blogarticle.094'), tf('blogarticle.095')]}
          />
        </div>
      </Section>

      {/* Progress bar, back-to-top (phones) and the sticky bar (lg+) — on the first scroll (B-13) */}
      <ScrollEnhancementsLoader
        backToTopLabel={sys('blog.article.backToTop')}
        stickyBar={{
          message: t('blogarticle.084'),
          hideNearId: BAND_ID,
          ctas: [
            {
              label: t('blogarticle.085'),
              href: wa(sys('blog.whatsapp.article', { title })),
              external: true,
              variant: 'success',
            },
            { label: t('blogarticle.073'), href: HIRE_FORM, variant: 'primary' },
          ],
        }}
      />
    </>
  );
}
```

`src/lib/seo/routes.ts` — in the `UNBUILT_PATHNAMES` literal, delete the line `  '/blog/[slug]',`. Nothing else changes (`robotsDisallowPaths` folds `/blog/[slug]` onto the `/blog` prefix Cycle 4 already disallows).

`e2e/routes.ts` — append after the two Cycle 4 rows:

```ts
  // T12 (B-14): the one written article (EN; TR has no body — W4). Pinned to the committed bundle
  // by src/app/[locale]/(site)/blog/__tests__/gate-row.test.ts.
  { path: '/en/blog/turkey-work-permit-process-employer-guide', indexable: false },
```

`docs/SEO.md` — (1) append the article row to T1's `## Pages` table (W98; the escaped pipes keep the table intact):

```markdown
| Blog article | `/blog/[slug]` · `/en/blog/[slug]` (Phase A: `/en/blog/turkey-work-permit-process-employer-guide` only) | `sys.blog.article.metaTitle` (`{title} \| JobsAdmire` — the article's own title) / the article's excerpt; the `blogArticle` template record carries no SEO field (W124) | `absoluteUrl(locale, { pathname: '/blog/[slug]', params })`; hreflang only for the locales with a body (`articleAlternates`) — x-default = tr when written in TR, else the page's own | `BreadcrumbList` (`blogarticle.022` → `/`, `blogarticle.004` → `/blog`, the title → this page, W109); `BlogPosting` (`articleJsonLd`); `FAQPage` (`FaqBlock`, four pairs, AEO only) | `h1` (the article title, `data-lcp-slot="h1"`); `blog-cover-<key>` is a named placeholder (W103, T12 B-7) | **noindex**; `og:type article` + `article:published_time`/`article:author`; OG and `BlogPosting` image `/og/{locale}/blog.png` (B-15, W169 — the article reuses its index's image; no `sys.seo.blogArticle.title`, the OG route would print a raw template); `generateStaticParams` over the written slugs (one EN today), any other slug renders on demand and index-only/unknown slugs 404 (B-1, W151); related/prev-next only from `blogNavVisible` (W4); the sidebar is one `LazyIsland`, the progress bar/back-to-top/sticky bar load on the first scroll (B-13); the D27 pixel page (EN only) |
```

(2) in `## JSON-LD`, directly after the target-set table and after T11's paragraph that begins "**As built (WP2b T11):** the careers detail page renders `jobPostingJsonLd`" (before `## OG images`), add:

```markdown
**As built (WP2b T12):** `/blog/[slug]` renders one `BlogPosting` from `articleJsonLd` — headline = the article title, description = its excerpt, `url` = its canonical, `image` = `/og/{locale}/blog.png` (the index's generated image, W169: the `blogArticle` template record has no title of its own to draw), ISO `datePublished` from the row's `publishedAt`, author `Organization` "JobsAdmire Editorial" (`blogarticle.023`, the byline on the page), `inLanguage` = the page's locale. The blog index carries only its `BreadcrumbList`.
```

`docs/ANALYTICS.md` — append one bullet under `### Page instrumentation (WP2b)` (W98):

```markdown
- **Blog index + article (WP2b T12)** — no new event, parameter or enum value. Contact clicks go through `ContactCta` → `ContactLink` with `placement: 'page_cta'`: the closing band's WhatsApp on both routes, the article's quote CTA ("Talk to a permit specialist") and the sticky bar's WhatsApp (W81) — all `whatsapp_click`; the header, bottom bar and FAB keep the chrome's placements. Every wa.me prefill is static (`sys.whatsapp.prefill` + `sys.blog.whatsapp.*`; the article's names the article title — page data, never visitor input, W76/W95). The share links (the wa.me share intent, LinkedIn, X), copy-link, print, the rotating word's Pause/Play and the dormant search/topic filter fire nothing (not allow-listed, W12). The newsletter band is hidden (W5), so no `newsletter` conversion exists yet.
```

`docs/ARCHITECTURE.md` — in § Quality gate (D27), after the sentence ending "**a route above 194,560 B gets a lazy-loading pass before the next page task starts**." (after T3's lazy-split sentence if it sits there), add:

```markdown
The Blog Article (WP2b T12) plans that pass up front: its sidebar — the scroll-spy TOC, the share row and the print button — is one `LazyIsland` behind a `'use client'` binder whose server fallback is DOM-identical to the island's first render (pinned by a `renderToStaticMarkup` test), hidden on phones so it loads only when scrolled to; the reading-progress bar, the back-to-top button and the sticky CTA bar load on the visitor's first scroll through `next/dynamic` inside a `'use client'` loader, so the mobile first-load audit (no scroll) fetches none of them.
```

`docs/PRD.md` — two in-place edits (W45; `grep -n 'Blog index\|Blog article\|Not yet built' docs/PRD.md`):

1. §2, the last cell of the row whose page cell is `Blog index` ("Newsletter signup (`NEWSLETTER`) — `noindex` + out of every chrome list below 6 Turkish bodies (W4)") becomes: "none in Phase A — the newsletter band (`NEWSLETTER`) stays hidden until counsel clears (W5/W97); written articles only, the TR index is the designed empty state; `noindex` + out of every chrome list below 6 Turkish bodies (W4)". The last cell of the `Blog article` row becomes: "none in Phase A — the newsletter band (`NEWSLETTER`) stays hidden (W5/W97); a slug without a body in the locale answers 404; `noindex` + out of every chrome list below 6 Turkish bodies (W4)".
2. §11, the sentence that begins "**Not yet built, by design (WP2 and later):**": in whatever wording T1, T13 and T2–T11 left it, count the Blog index + article as built — they are two of the 14 core pages (§2 rows 12 and 13), so decrement the "N of the 14 core pages" figure by two (after T13's portal decrement and T3–T11's one each it reads "2 of the 14" here and becomes "0 of the 14": every core page is then built; if it carries another figure, an earlier task deviated — still subtract two and name the discrepancy in this task's report) and add "Blog index + article (WP2b T12)" to the list of designed pages that sentence names — keeping the rest of the sentence as it stands (never re-add WP1 wording).

- [ ] **Step 4: Verify**

```bash
npx prettier --write "src/app/[locale]/(site)/blog/[slug]" "src/app/[locale]/(site)/blog/__tests__/gate-row.test.ts" src/lib/seo/routes.ts e2e/routes.ts docs/SEO.md docs/ANALYTICS.md docs/ARCHITECTURE.md docs/PRD.md
NODE_OPTIONS=--max-old-space-size=4096 npx vitest run "src/app/[locale]/(site)/blog" src/lib/seo src/app/robots.test.ts src/app/sitemap.test.ts scripts/gate-routes.test.ts --maxWorkers=1
npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
```

Expected: `ArticleBody.test.tsx` 7, `ArticleSidebar.test.tsx` 3 and `gate-row.test.ts` 2 cases green; `unbuilt.test.ts` green (both blog keys gone, both `page.tsx` present); `client-imports.test.ts` green (the article page imports `formatDate`/`formatReadMinutes` by path and is a server module; `ArticleSidebar`/`ArticleSidebarIsland` reach only islands, `_lib/sidebar.ts` and type-only imports — no message file, no `@/lib/format/date/*`); `class-collisions.test.ts` green (`hidden print:block`, `[&::-webkit-details-marker]:hidden` beside `flex`, `md:hidden`/`max-md:hidden` — never an unprefixed pair; `ContactCta` classes `print-hidden`/`w-full` only; the font-size steps sit at different variants); `rsc-imports.test.ts` green (islands by path); `tsc` proves `generateStaticParams({ params })`'s synchronous parent params, the `alternates`/`openGraph` shapes `buildMetadata` takes and `articleJsonLd`'s input; the full suite green.

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/blog/[slug]" "src/app/[locale]/(site)/blog/__tests__/gate-row.test.ts" src/lib/seo/routes.ts e2e/routes.ts docs/SEO.md docs/ANALYTICS.md docs/ARCHITECTURE.md docs/PRD.md
git commit -F - <<'MSG'
feat(blog): the article page — Markdown body, FAQ, lazy TOC/share/print sidebar, related (gated); /blog/[slug] leaves UNBUILT (T12 c5)

/en/blog/<slug>: own-page crumbs (W109), pills, the h1 (LCP, B-7), the
blog-cover placeholder (W103), the parsed body with the takeaways box and the
closing CTA in the final quote (B-8/B-11), FAQ with A1/Q3 numbers from data
(D17, B-10), the author box, one LazyIsland sidebar with a DOM-identical
fallback (B-13, W132/W85/W133) and first-scroll progress/back-to-top/sticky
bar (W81). Article metadata: own title/excerpt, per-locale alternates,
og:type article, BlogPosting (W124, B-15). Index-only and unknown slugs 404
(B-1, W151). Docs: SEO rows + JSON-LD line, analytics bullet, the lazy split in
ARCHITECTURE, PRD rows 12/13 and §11.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
MSG
```

---

#### Cycle 6 — The page e2e spec (both routes, both locales, the 404 rules, the lazy islands, face-aware robots)

- [ ] **Step 1: Write the failing test**

`e2e/pages/blog.spec.ts`:

```ts
import { expect, test, type Page } from '@playwright/test';
import { expectedRobots } from '../helpers/face';

// Canonicals, hreflang and JSON-LD URLs come from SITE_URL — the production origin — whatever
// host the run hits (e2e/seo.spec.ts's rule).
const ORIGIN = 'https://www.jobsadmire.com';
const SLUG = 'turkey-work-permit-process-employer-guide';
const EN_ARTICLE = `/en/blog/${SLUG}`;
/** A leaked ICU token, an `undefined`, or a next-intl missing-key fallback (`sys.blog…`). */
const LEAK = /\{[A-Za-z][A-Za-z0-9]*\}|undefined|\bsys\./;

async function expectOneCleanH1(page: Page) {
  await expect(page.locator('h1')).toHaveCount(1);
  const h1 = page.getByTestId('page-h1');
  await expect(h1).toHaveAttribute('data-lcp-slot', 'h1');
  expect(((await h1.textContent()) ?? '').trim().length).toBeGreaterThan(0);
  await expect(page.locator('[data-lcp-slot]')).toHaveCount(1);
  expect(await page.locator('body').innerText()).not.toMatch(LEAK);
}

async function jsonLd(page: Page): Promise<Record<string, unknown>[]> {
  const texts = await page.locator('script[type="application/ld+json"]').allTextContents();
  return texts.map((t) => JSON.parse(t) as Record<string, unknown>);
}

test.describe('/en/blog — the index with one written article (W4)', () => {
  test('hero, own crumbs, the featured card; no grid, tools, newsletter or unsigned claims; noindex', async ({
    page,
  }) => {
    const res = await page.goto('/en/blog');
    expect(res?.status()).toBe(200);
    await expectOneCleanH1(page);
    await expect(page.getByTestId('hero-word-static')).toHaveText('employers');
    await expect(page.getByTestId('page-h1')).toHaveAccessibleName('Insights for employers');
    await expect(
      page.getByTestId('blog-featured').getByRole('link', { name: /work permit process/i }),
    ).toHaveAttribute('href', EN_ARTICLE);
    await expect(page.getByTestId('blog-grid')).toHaveCount(0);
    await expect(page.getByTestId('blog-tools-slot')).toHaveCount(0); // B-5: < 6 posts
    await expect(page.getByTestId('blog-empty')).toHaveCount(0);
    await expect(page.locator('#newsletter')).toHaveCount(0); // W5/W97
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${ORIGIN}/en/blog`);
    await expect(page.locator('link[rel="alternate"][hreflang="tr"]')).toHaveAttribute(
      'href',
      `${ORIGIN}/blog`,
    );
    const crumbs = page.getByRole('navigation', { name: 'Breadcrumb' });
    await expect(crumbs.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/en');
    await expect(crumbs.locator('[aria-current="page"]')).toHaveText('Blog');
    const text = await page.locator('body').innerText();
    expect(text).not.toContain('New article every week'); // B-3
    expect(text).not.toContain('Most read'); // B-2
    const nodes = await jsonLd(page);
    expect(nodes.filter((n) => n['@type'] === 'BreadcrumbList')).toHaveLength(1);
    expect(nodes.filter((n) => n['@type'] === 'FAQPage')).toHaveLength(0);
  });

  test('the rotating word turns without resizing the h1, and pauses on request (B-4)', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/en/blog');
    // Measure once the fonts have settled (display: optional since W188 — no swap; fonts.ready is a guard) so only the rotation could move the box.
    await page.evaluate(async () => {
      await document.fonts.ready;
    });
    const h1 = page.getByTestId('page-h1');
    const current = page.getByTestId('hero-word-live').locator('[data-current]');
    const before = await h1.boundingBox();
    await expect(current).not.toHaveText('employers', { timeout: 6000 });
    expect(await h1.boundingBox()).toEqual(before);
    await page.getByTestId('hero-word-toggle').click();
    await expect(page.getByTestId('hero-word-toggle')).toHaveText('Play');
    const paused = (await current.textContent()) ?? '';
    await page.waitForTimeout(3000);
    await expect(current).toHaveText(paused);
  });

  test('under reduced motion the word stays and the toggle is hidden (R20)', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/en/blog');
    await expect(page.getByTestId('hero-word-toggle')).toBeHidden();
    await page.waitForTimeout(3000);
    await expect(page.getByTestId('hero-word-live').locator('[data-current]')).toHaveText(
      'employers',
    );
  });
});

test.describe('/blog — the TR index with no written article (W6)', () => {
  test('the designed empty state links to the English index; nothing else from the list', async ({
    page,
  }) => {
    const res = await page.goto('/blog');
    expect(res?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', 'tr');
    await expectOneCleanH1(page);
    await expect(page.getByTestId('hero-word-static')).toHaveText('İşverenler');
    await expect(page.getByTestId('page-h1')).toHaveAccessibleName('İşverenler için içgörüler');
    await expect(page.getByTestId('blog-empty')).toContainText('Türkçe yazılar hazırlanıyor');
    await expect(page.getByTestId('blog-featured')).toHaveCount(0);
    await expect(page.getByTestId('blog-hero-art')).toHaveCount(0);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
    const cta = page.getByTestId('blog-empty-cta');
    await expect(cta).toHaveAttribute('href', '/en/blog');
    await expect(cta).toHaveAttribute('hreflang', 'en');
    await cta.click();
    await expect(page).toHaveURL(/\/en\/blog$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });
});

test.describe(`${EN_ARTICLE} — the one written article`, () => {
  test('metadata: own title and excerpt, noindex, og:type article, hreflang only for its own locale (B-15)', async ({
    page,
  }) => {
    const res = await page.goto(EN_ARTICLE);
    expect(res?.status()).toBe(200);
    await expectOneCleanH1(page);
    const title = ((await page.getByTestId('page-h1').textContent()) ?? '').trim();
    await expect(page).toHaveTitle(`${title} | JobsAdmire`);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'article');
    await expect(page.locator('meta[property="article:published_time"]')).toHaveAttribute(
      'content',
      /^2026-06-12/,
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      'content',
      `${ORIGIN}/og/en/blog.png`,
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${ORIGIN}${EN_ARTICLE}`);
    await expect(page.locator('link[rel="alternate"][hreflang="tr"]')).toHaveCount(0);
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute(
      'href',
      `${ORIGIN}${EN_ARTICLE}`,
    );
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute(
      'href',
      `${ORIGIN}${EN_ARTICLE}`,
    );
    await expect(page.getByTestId('article-lang-note')).toHaveCount(0);
  });

  test('one BreadcrumbList (Home / Blog / title), one BlogPosting, one FAQPage of four', async ({
    page,
  }) => {
    await page.goto(EN_ARTICLE);
    const nodes = await jsonLd(page);
    const of = (type: string) => nodes.filter((n) => n['@type'] === type);
    expect(of('BreadcrumbList')).toHaveLength(1);
    const crumbs = of('BreadcrumbList')[0] as { itemListElement: { item: string }[] };
    expect(crumbs.itemListElement.map((i) => i.item)).toEqual([
      `${ORIGIN}/en`,
      `${ORIGIN}/en/blog`,
      `${ORIGIN}${EN_ARTICLE}`,
    ]);
    expect(of('BlogPosting')).toHaveLength(1);
    const posting = of('BlogPosting')[0] as {
      image: string;
      author: { '@type': string; name: string };
      datePublished: string;
      inLanguage: string;
    };
    expect(posting.image).toBe(`${ORIGIN}/og/en/blog.png`);
    expect(posting.author).toEqual({ '@type': 'Organization', name: 'JobsAdmire Editorial' });
    expect(posting.datePublished).toBe('2026-06-12T00:00:00.000Z');
    expect(posting.inLanguage).toBe('en');
    expect(of('FAQPage')).toHaveLength(1);
    expect((of('FAQPage')[0] as { mainEntity: unknown[] }).mainEntity).toHaveLength(4);
  });

  test('the body, the quote CTA, the FAQ with data-driven numbers, the author box; no related, no newsletter (B-8, B-10, B-11)', async ({
    page,
  }) => {
    await page.goto(EN_ARTICLE);
    const body = page.getByTestId('article-body');
    await expect(body.locator('h2')).toHaveCount(4);
    await expect(body.getByTestId('article-takeaways')).toContainText('Key takeaways');
    await expect(body.locator('ol > li')).toHaveCount(5);
    await expect(body.locator('blockquote')).toHaveCount(1);
    await expect(
      body.getByTestId('article-quote').getByRole('link', { name: 'Talk to a permit specialist →' }),
    ).toHaveAttribute(
      'href',
      'https://wa.me/905011240340?text=Hello%20JobsAdmire%2C%20I%20need%20help%20with%20work%20permits.',
    );
    await expect(page.locator('#faq')).toHaveText('Frequently asked questions');
    const triggers = page.locator('#faq-list [data-accordion-trigger]');
    await expect(triggers).toHaveCount(4);
    await triggers.first().click();
    await expect(page.locator('#faq-list')).toContainText('about 45 days on average');
    await expect(page.locator('#faq-list')).toContainText(
      "Can I hire if I don't meet the 5:1 employee ratio?",
    );
    await expect(page.getByTestId('article-author')).toContainText('İŞKUR Licensed · No. 1730');
    await expect(page.getByTestId('article-related')).toHaveCount(0); // W4 threshold (B-2)
    await expect(page.locator('#newsletter')).toHaveCount(0); // W5/W97
    await expect(page.locator(`[data-placeholder="blog-cover-${SLUG}"]`)).toHaveCount(1);
  });

  test('desktop: the sidebar island — TOC of five with live scroll-spy, share, print — and the CTA card deep link', async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'the sidebar column exists from lg');
    await page.goto(EN_ARTICLE);
    const sidebar = page.getByTestId('article-sidebar');
    const toc = sidebar.getByRole('navigation', { name: 'In this article' });
    await expect(toc.locator('a')).toHaveCount(5);
    await expect(toc.locator('a').last()).toHaveAttribute('href', '#faq');
    await expect(toc).toContainText('≈ 8 min left');
    await expect(
      sidebar.getByTestId('article-share').getByRole('link', { name: 'Share on LinkedIn' }),
    ).toHaveAttribute('href', /linkedin\.com\/sharing\/share-offsite\/\?url=https%3A%2F%2Fwww\.jobsadmire\.com%2Fen%2Fblog%2F/);
    await expect(sidebar.getByRole('button', { name: 'Print this article' })).toBeVisible();
    await expect(sidebar.getByRole('link', { name: 'Request Workers →' })).toHaveAttribute(
      'href',
      '/en/hire-workers#request-form',
    );
    await expect(page.getByTestId('article-toc-mobile')).toBeHidden();
    // The fallback marks only the first entry; the loaded island follows the scroll (B-13).
    const documents = toc.getByRole('link', { name: "Documents you'll need" });
    await documents.click();
    await expect(documents).toHaveAttribute('aria-current', 'location');
  });

  test('desktop: nothing loads before the first scroll; then the reading bar and the sticky bar (W81) appear', async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'the sticky bar is lg-only');
    await page.goto(EN_ARTICLE);
    await expect(page.getByTestId('reading-progress')).toHaveCount(0); // B-13
    await page.evaluate(() => window.scrollTo(0, 1600));
    const bar = page.getByTestId('sticky-cta');
    await expect(bar).toBeVisible();
    await expect(page.getByTestId('reading-progress')).toHaveCount(1);
    await expect(bar.getByRole('link', { name: 'WhatsApp Us' })).toHaveAttribute(
      'href',
      /^https:\/\/wa\.me\/905011240340\?text=Hello%20JobsAdmire%2C%20I%20read%20/,
    );
    await expect(bar.getByRole('link', { name: 'Request Workers →' })).toHaveAttribute(
      'href',
      '/en/hire-workers#request-form',
    );
    await page.locator('#blog-cta').scrollIntoViewIfNeeded();
    await expect(bar).toBeHidden();
  });

  test('mobile: the <details> TOC lists the same five entries; the sidebar TOC and CTA card are hidden', async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'the details TOC exists below md');
    await page.goto(EN_ARTICLE);
    const toc = page.getByTestId('article-toc-mobile');
    await expect(toc).toBeVisible();
    await toc.locator('summary').click();
    await expect(toc.locator('nav a')).toHaveCount(5);
    await expect(
      page.getByTestId('article-sidebar').getByRole('navigation', { name: 'In this article' }),
    ).toBeHidden();
    await expect(page.getByTestId('article-sidebar').getByRole('link', { name: 'Request Workers →' })).toBeHidden();
    await expect(page.getByTestId('article-share')).toBeAttached();
  });

  test('mobile: back-to-top appears after scrolling and takes the reader to the top', async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'the button is phone-only');
    await page.goto(EN_ARTICLE);
    await page.evaluate(() => window.scrollTo(0, 2500));
    const button = page.getByRole('button', { name: 'Back to top' });
    await expect(button).toBeVisible();
    await button.click();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(10);
  });
});

test('the header renders DEFAULT_CTAS; the hire-form anchor lives on Hire Workers (W121/W158)', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'the header CTA row is desktop-only');
  await page.goto(EN_ARTICLE);
  await expect(page.locator('header').getByRole('link', { name: /Request/ }).first()).toHaveAttribute(
    'href',
    '/en/hire-workers#request-form',
  );
  const hire = await (await page.request.get('/en/hire-workers')).text();
  expect(hire).toContain('id="request-form"');
});

test.describe('B-1: a slug without a body in the locale answers 404', () => {
  for (const path of [
    '/blog/yabanci-isciler-calisma-izni-rehberi', // the TR slug of the written EN article
    '/en/blog/hiring-from-pakistan-turkish-employers', // an index-only EN entry
    '/en/blog/does-not-exist',
    '/blog/does-not-exist',
  ]) {
    test(path, async ({ page }) => {
      const res = await page.goto(path);
      expect(res?.status()).toBe(404);
      // W151: the chrome-wrapped (site) not-found hydrates — one h1, and it is not an article.
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.getByTestId('page-h1')).toHaveCount(0);
    });
  }
});

test("robots.txt disallows both blog indexes on the production face; the sitemap lists no blog URL (W4/W20/W37, W135)", async ({
  request,
  baseURL,
}) => {
  const robots = await (await request.get('/robots.txt')).text();
  if (expectedRobots(baseURL ?? 'http://localhost:3000') === 'production') {
    expect(robots).toMatch(/^Disallow: \/blog$/m);
    expect(robots).toMatch(/^Disallow: \/en\/blog$/m);
  } else {
    // W91/W104: a preview face is `Disallow: /` — e2e/seo.spec.ts asserts that body strictly.
    expect(robots).toMatch(/^Disallow: \/$/m);
  }
  const xml = await (await request.get('/sitemap.xml')).text();
  expect(xml).not.toMatch(/<loc>[^<]*\/blog(\/|<)/);
});
```

- [ ] **Step 2: Check it compiles (the first Playwright run is Cycle 7's gate — W126: one build, one start, one gate per task)**

```bash
npx prettier --write e2e/pages/blog.spec.ts
npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
```

Expected: green — `tsc` and ESLint cover `e2e/` (Vitest does not collect it). The spec is written against Cycles 2–5 and runs for the first time inside Cycle 7's `npm run gate` (both projects); a red case there is fixed in the page (never by weakening the assertion — D20), within that cycle.

- [ ] **Step 3: Implement**

Nothing beyond the spec: the pages it exercises landed in Cycles 4–5, the three routes are already in `GATE_ROUTE_TABLE` (so `e2e/a11y.spec.ts`, `e2e/width-sweep.spec.ts` and the launch placeholder counter sweep them too).

- [ ] **Step 4: Verify**

```bash
npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
```

Expected: green (Vitest does not collect `e2e/`).

- [ ] **Step 5: Commit**

```bash
git add e2e/pages/blog.spec.ts
git commit -F - <<'MSG'
test(blog): page e2e — both indexes, the article, B-1 404s, lazy islands, face-aware robots (T12 c6)

EN index (featured only, noindex, own crumbs, no unsigned claims), the rotating
word (no reflow, pause, reduced motion), the TR W6 empty state and its link to
/en/blog; the article's metadata (own title, og:type article, hreflang only for
its locale, index OG image), JSON-LD (one BreadcrumbList/BlogPosting/FAQPage),
body/FAQ/author, the desktop sidebar island with live scroll-spy, the
first-scroll reading and sticky bars (W81), the phone <details> TOC and
back-to-top; DEFAULT_CTAS' anchor on Hire Workers (W158); index-only and
unknown slugs 404 (W151); robots per face (W135). First run: Cycle 7's gate.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
MSG
```

---

#### Cycle 7 — The W126 proof session: one build, one start, one gate, `js-size --routes`, the pixel harness (EN), the ledger row

No new behaviour: this cycle proves both routes and records them. One heavy job at a time (the owner's memory rule): the build, then the server with the gate, then `js-size`, then the pixel runs, then the server is killed. Never push; never run against a preview here (the controller's binding preview run is separate — W137/W139/W140).

- [ ] **Step 1: No new test — confirm the ledger anchor**

```bash
grep -n '^## Ledger\|^| T1 Homepage' docs/superpowers/plans/2026-09-20-wp2b-pages.md
```

Expected: the `## Ledger` table T1 created and its first data row (the rows of T13 and T2–T11 below it).

- [ ] **Step 2: Run the proof**

2a. Strays, then build once:

```bash
(pgrep -fl 'next-server|next start|next build|chrome-headless|lighthouse' || echo "no strays") && NEXT_BUILD_CPUS=2 NODE_OPTIONS=--max-old-space-size=4096 npm run build
```

Expected: the build succeeds — the step that validates the RSC boundaries jsdom cannot see (W126): `RotatingWord` rendered through `sys.rich` inside the server h1; `RotationToggle`, `PostFilterLoader` and `ScrollEnhancementsLoader` receiving only serialisable props (strings, arrays, the object hrefs `{ pathname, hash }`); `ArticleSidebarIsland` receiving a server-rendered `fallback` node; `ContactCta` nodes passed into the server `ArticleBody`; the island imports resolved by path (no barrel). The route table lists `/[locale]/blog` statically generated for `tr` and `en`, and `/[locale]/blog/[slug]` with exactly one prerendered path, `/en/blog/turkey-work-permit-process-employer-guide` (no TR path — `generateStaticParams` returns `[]` for `tr`); no `revalidate` (W150). Any failure is a page defect: fix it, run the low-memory verify line, commit (`fix(blog): …`), build again — one build at a time.

2b. Start the server and run the gate once. Precondition (W92): the shell exports no `OPS_API_URL`/`OPS_WEBSITE_WRITE_TOKEN` and the worktree has no `.env.local` carrying them (`env | grep -c '^OPS_'` prints `0` — never print the values), so the other pages' form specs stay door-less and deterministic. No `sleep` anywhere (the agent shell blocks a foreground `sleep`): the start is awaited with `curl --retry`, never a `sleep`/`until` loop.

```bash
(npm run start > "${TMPDIR:-/tmp}/t12-next-start.log" 2>&1 &) && curl -sf --retry 30 --retry-connrefused --retry-delay 1 -o /dev/null http://localhost:3000/ && E2E_BASE_URL=http://localhost:3000 npm run gate
```

Expected `gate: OK`:
- Playwright, both projects — every existing spec green, plus `e2e/pages/blog.spec.ts`: 15 cases run on `desktop` (the two phone cases skip) and 14 on `mobile` (the sidebar, sticky-bar and header cases skip); `a11y.spec.ts` at zero axe violations (`wcag2a/aa/22aa`) on `/blog`, `/en/blog` and the article on both projects, and the `region` sweep at 390/1000/1440 (the reading bar, back-to-top and sticky bar render inside `<main>`); `width-sweep.spec.ts` without horizontal overflow at 1440…390 on the three routes (the article grid is `lg:` only, the sidebar card stacks below 901, the TOC `<details>` and the share pills wrap); `seo.spec.ts` still finds no `/blog` URL in the sitemap; `REVALIDATE_SECRET` unset → the two token cases in `ops.spec.ts` skip.
- Lighthouse runs over `INDEXABLE_GATE_ROUTES` only — the blog routes are `indexable: false` (W4), so they are measured in 2c instead; the other routes' figures must not move (nothing shared changed except the `(site)` group gaining two routes).
- A red case is fixed in the page, never by weakening the assertion (D20); re-run the verify line, commit the fix, rebuild, restart, re-run the gate.

2c. Measure the three noindex routes (W94) — script size, LCP and performance, median of three runs under DevTools throttling (the gate's Lighthouse config, W145):

```bash
npm run js-size && E2E_BASE_URL=http://localhost:3000 npm run js-size -- --routes=/blog,/en/blog,/en/blog/turkey-work-permit-process-employer-guide
```

Expected (local, W136): each blog route ≈ its locale's page baseline plus ≤ 3 KB — the eager additions are only `RotatingWord` + `RotationToggle` + the store (index), the `LazyIsland` binder + `useInView` (article) and the two tiny `next/dynamic` loaders; the sidebar chunk (`ScrollSpyToc` + `ShareRow` + `PrintButton`) and the first-scroll chunk (progress bar, back-to-top, `StickyCtaBar`) are never fetched by the mobile, no-scroll audit (B-13), and the tools chunk is never rendered in Phase A (B-5). That keeps every blog route below the local trigger of **191,724 B** (W162: the binding preview's 194,560 B lazy-loading line less the ≈ 2,836 B by which the preview's `npm run js-size` runs above the local build — 176,132 → 178,968 B at `02ace58`; ceiling 204,800 B). LCP ≤ 2,500 ms on the median (the h1 is the LCP element on all three routes — B-7) and performance ≥ 0.95. **Stop-and-report rule (W162):** if any blog route prints at or above 191,724 B locally (the controller's binding preview decides at 194,560 B), or its median LCP exceeds 2,500 ms, or its median performance is below 0.95, stop here — before the pixel runs and the ledger row — and report the `js-size` table plus the `.lighthouseci-extra/` LHR evidence (the LCP element, `bootup-time`, the network requests) to the controller: the lazy split this task owns is B-13; any further lazy pass is the controller's to schedule before the next page task starts (W13 amended, W162) — none is written in advance.

2d. The pixel harness (D27, two-iteration cap — `docs/superpowers/plans/2026-09-20-wp2-pixel-harness.md`), the article in EN only (the harness resolves `blog-article` from the first row with a body in the locale; TR has none and would be skipped with exit 0 — W138 — so it is not run):

```bash
npm run pixel -- --page=blog-article --locale=en --widths=390,900,1440 --base=http://localhost:3000
```

Expected: exit 0 (both pages answer 2xx; the W159 height check passes), `.pixel/report.json` + `.pixel/blog-article-en-<width>*.png` written (the harness needs network: the design runtime loads from unpkg). Read the three diffs and classify every visible delta: (a) the D20 deltas and (b) the ruled deltas listed at the top of this task ("Design deltas named for the pixel harness"); (c) capture noise — the rotating/fixed/sticky pieces, the FAB and bottom bar, hidden Phase A sections' height; (d) a defect — fix it. A D27 second pixel iteration (or a W13 lazy pass, only if the controller rules one after a 2c stop) is the ONE conditional, sequential, capped re-proof build W164 allows after this proof — one build per proof attempt, never a second full `npm run gate` (W126/W164). Run the verify line, commit (`fix(blog): …`), stop the server (2e), rebuild (one more `NEXT_BUILD_CPUS=2 NODE_OPTIONS=--max-old-space-size=4096 npm run build`; a lazy pass lands first), restart with 2b's start command (without the gate — still awaited by `curl --retry-connrefused`, no `sleep`), then run the SCOPED re-proof in this order: (1) the page spec, `a11y` and `width-sweep` — `E2E_BASE_URL=http://localhost:3000 npx playwright test e2e/pages/blog.spec.ts e2e/a11y.spec.ts e2e/width-sweep.spec.ts`; (2) `E2E_BASE_URL=http://localhost:3000 npm run js-size -- --routes=/blog,/en/blog,/en/blog/turkey-work-permit-process-employer-guide`; (3) pixel run 2 — the harness command above, a second — last — time, so the ledger row describes the build it scores. The cap counts from this first like-for-like run (W138); a third run needs a controller ruling.

2e. Stop the server and check for strays:

```bash
(lsof -ti:3000 | xargs kill 2>/dev/null || true) && (pgrep -fl 'next-server|next start|chrome-headless|lighthouse' || echo "no strays")
```

Expected: `no strays`. (A local run's `.lighthouseci/`, `.lighthouseci-extra/` and `lighthouse-report/` hold no secret; after any PREVIEW run they are deleted — W137 amended.)

- [ ] **Step 3: Implement — the ledger row**

Append the T12 row to the `## Ledger` table in `docs/superpowers/plans/2026-09-20-wp2b-pages.md` — the "**Ledger line**" template at the end of this task, every `<…>` filled from 2c–2d (the `js-size` tables, the `.lighthouseci-extra/` LHRs for CLS, `.pixel/report.json` and your delta classification).

- [ ] **Step 4: Verify**

```bash
npx prettier --write docs/superpowers/plans/2026-09-20-wp2b-pages.md
npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
```

Expected: green.

- [ ] **Step 5: Commit**

```bash
git add docs/superpowers/plans/2026-09-20-wp2b-pages.md
git commit -F - <<'MSG'
docs(blog): T12 ledger row — js-size for the noindex routes, Lighthouse medians, pixel scores and named deltas (T12 c7)

One build, one start, one gate (W126): blog.spec green on both projects, axe
and the width sweep clean on /blog, /en/blog and the article. js-size --routes
(W94) for the three noindex routes, under the 191,724 B local trigger (W162,
binding line 194,560 B; B-13).
Pixel blog-article (EN only — no TR body, W138) with the named deltas.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
MSG
```

---

**Docs in this task:** `docs/CONTENT-MODEL.md` — § `## Blog` (the v1 body grammar, written-only listing and the 404 rule; Cycle 1) and the Blog bullet in the per-page list at the end of `### Adding copy (W9, W23, W54)` (the keys and the deliberately unrendered ids; Cycle 2). `docs/SEO.md` — the Blog index row (Cycle 4) and the Blog article row (Cycle 5) of T1's `## Pages` table, each naming its LCP element (the h1); the § Robots "Today that is …" sentence (`/blog` now disallowed; Cycle 4); the "**As built (WP2b T12):**" `BlogPosting` paragraph after the § JSON-LD table (Cycle 5). `docs/ANALYTICS.md` — the Blog bullet under `### Page instrumentation (WP2b)` (no new event, parameter or enum value; Cycle 5). `docs/ARCHITECTURE.md` — one sentence in § Quality gate (D27) on the article's planned lazy split (Cycle 5). `docs/PRD.md` — §2's `Blog index` and `Blog article` rows (last cells) and the §11 "Not yet built" sentence, edited in place (Cycle 5, W45). `docs/superpowers/plans/2026-09-20-wp2b-pages.md` — the T12 `## Ledger` row (Cycle 7). No `docs/INTEGRATIONS.md` change (no form, no catalog field — the newsletter band stays hidden, B-6) and no `docs/DEPLOYMENT.md` change.

**Sys keys added (22 per locale — 44 entries, identical key sets in `src/messages/tr.json` and `src/messages/en.json`):** `sys.seo.blog.title`, `sys.seo.blog.description`, `sys.blog.hero.title`, `sys.blog.hero.words`, `sys.blog.index.latest`, `sys.blog.empty.title`, `sys.blog.empty.body`, `sys.blog.empty.cta`, `sys.blog.tools.search`, `sys.blog.tools.results.one`, `sys.blog.tools.results.other`, `sys.blog.article.metaTitle`, `sys.blog.article.langNote`, `sys.blog.article.sections`, `sys.blog.article.copyFailed`, `sys.blog.article.print`, `sys.blog.article.backToTop`, `sys.blog.faq.a1`, `sys.blog.faq.q3`, `sys.blog.whatsapp.article`, `sys.blog.whatsapp.consult`, `sys.blog.whatsapp.permit`. Consumed, not added: `sys.nav.breadcrumbs`, `sys.marquee.pause`, `sys.marquee.play`, `sys.whatsapp.prefill`, `sys.blocks.readMinutes` (through `formatReadMinutes`/PostCard). Deliberately NOT added: `sys.seo.blogArticle.*` (B-15, W169 — pinned absent by `sys-keys.test.ts`), any newsletter form copy (B-6).

**Package ids used:** 68 distinct ids, every one present in `src/content/local/catalogue.json` (verified 2026-09-28): first `blog.004`, last `blogarticle.145`. Index (29): `blog.004`, `022`, `023`, `024`, `025`, `026`, `032`, `033`, `035`, `042`, `043`, `044`, `045`, `046`, `075`, `076`, `086`, `087`, `088`, `089`, `091`, `092`, `095`, `096`; `home.221`; the rows' `categoryLabelId`s `home.262`–`265`. Read by `PostCard` on these pages (3): `blog.034`, `blog.077`, `blog.081`. Article (36): `blogarticle.004`, `022`, `023`, `024`, `064`, `065`, `066`, `067`, `068`, `069`, `071`, `072`, `073`, `074`, `075`, `076`, `081`, `082`, `083`, `084`, `085`, `092`, `093`, `094`, `095`, `126`, `127`, `128`, `129`, `130`, `131`, `132`, `141`, `143`, `144`, `145`. Read only conditionally (never in Phase A): the tools labels `blog.033/035/075/076/086–089` (from six non-featured written articles, B-5), `blogarticle.081–083` (related/prev-next, B-2), `blogarticle.143` (a TR article with an EN body); `blog.032/091/092` render on the EN index only. `blog.045` and `blogarticle.095` (`{homepageReplyHours}`) go through `makeTf`. Legal-flagged, rendered verbatim: `blog.044`, `blogarticle.068`, `blogarticle.094`, `blogarticle.129` (and, inside the importer-composed body, `blogarticle.030/034/039/051/063`). Consumed by the importer into the body, not by the pages: `blogarticle.025`–`063`. Deliberately unused: `blog.001`–`003`, `005`–`021`, `047`–`074` and `blogarticle.001`–`003`, `005`–`021`, `096`–`123` (per-page chrome duplicates — the chrome reads its canonical ids, R15); `blog.027`–`031` (the dated/"8 min read"/"Most read" float cards, B-2/B-3); `blog.036`–`041`, `blogarticle.086`–`091` (the newsletter band, W5 — `NewsletterBand` reads `blog.036`–`038` itself once active); `blog.078`–`080`, `082`, `083`, `blogarticle.133`–`137` (category/title duplicates — the rows' `categoryLabelId` is the one label source); `blog.084` ("Read article →" — the PostCard title is the link); `blog.085` (a `for “` fragment — replaced by the `{n}` result templates); `blog.090` (Load more — B-5); `blog.093`, `094`, `097` (cadence — B-3); `blog.098`, `blogarticle.142` (the mobile bar's hire prefill — chrome); `blogarticle.070` ("this article" — "Paylaş bu yazıyı" would be ungrammatical Turkish, so the share heading is `blogarticle.069` alone); `blogarticle.077`–`080`, `138`, `139` (the in-progress and not-found panels, B-1); `blogarticle.124`, `125` (one article's short TOC labels — the TOC uses each heading's own text; `126` "FAQ" is used); `blogarticle.140` ("Almost done" — the as-built `ScrollSpyToc` string props carry no zero case). For the WP-C legal sheet: the first-person package lines rendered as authored (`blog.023`/`024`/`042`/`043`, `blogarticle.063`, `067`, `072`, `084`, `085`, `092`, `093`, `130`, `132` — "our"/"we"/"us"/"let's"; TR "bize", "ekibimiz", "bulalım", "planlayalım", "yapalım", "hallediyoruz"), and the body's permit figures ("4–8 weeks", "~30 days", "100,000 TL", "within 30 days" — `blogarticle.028`/`029`/`038`/`053`/`057`), which disagree with the signed-default metrics the FAQ answer uses (`permitDays` 45, `firstDayWeeks` 6–8). All fields in catalog — this task sends no form.

**CLIENT_SYS additions:** none — no client module calls `useTranslations`; every client string arrives as a prop (the two `{n}` templates through `sys.raw`), so `CLIENT_SYS` stays as T3 left it (`consent, languageHint, errorTitle, errorRetry, form, calc`) and `client-messages.test.ts` needs no change.

**Foundation gaps:** none blocking. Notes: (a) the OG route titles an image from `sys.seo.<pageKey>.title` with no ICU arguments (`ogTitle`, `src/lib/seo/og.ts`), so a template page cannot carry a per-article OG title — T12 keeps its `{title}` template at `sys.blog.article.metaTitle` and points the article's OG and `BlogPosting` image at the index's `/og/<locale>/blog.png` (B-15, W169: template pages reuse their index's OG image); a per-article image needs an OG route that takes a title (Phase B). The same trap in a `sys.seo.careersDetail.title` carrying `{title}` (the T11 draft's) is settled by W169 — `sys.careers.detail.metaTitle` and the careers index's image, T11's file — so nothing for this task to change. (b) `EmptyStateCta.href` cannot express a cross-locale target (an object href localises to the current locale; a string internal path is re-localised by next-intl's `Link`), so the TR empty state renders its link to `/en/blog` as a sibling `next/link` with `hrefLang` (the chrome `LanguageSwitcher`'s own technique) — accepted page-local. (c) `LazyIsland` needs a DOM-identical server fallback and an island cannot serve as its own, so `ArticleSidebarFallback` mirrors `ScrollSpyToc`'s, `ShareRow`'s and `PrintButton`'s first render — pinned by the `renderToStaticMarkup` identity test, which names the file to update whenever one of those islands changes. (d) `ScrollSpyToc`'s string props (W85) have no zero-minutes form, so `blogarticle.140` stays unused (the sticky sidebar has scrolled away before the reader reaches the end). No Task 8 (catalog v1.1) field is involved: the blog sends no form.

**Ledger line** (append to the `## Ledger` table in `docs/superpowers/plans/2026-09-20-wp2b-pages.md`; fill every `<…>`):

```markdown
| T12 Blog index + article | `/blog` · `/en/blog`; `/en/blog/turkey-work-permit-process-employer-guide` (TR article: none — 0 TR bodies, W4) | js-size (local, `--routes`, W94): `/blog` <n> B · `/en/blog` <n> B · article <n> B (ceiling 204,800; local trigger 191,724 = lazy line 194,560 − 2,836, W162 — the sidebar and first-scroll chunks are not fetched, B-13); binding preview: <added by the controller> | LH mobile, median of 3, DevTools throttling (`js-size --routes` — noindex routes are not asserted by the gate): `/blog` perf <x.xx> · LCP <n> ms (h1); `/en/blog` perf <x.xx> · LCP <n> ms (h1); article perf <x.xx> · LCP <n> ms (h1) · CLS <n> | pixel blog-article en: 390 → <a> %, 900 → <b> %, 1440 → <c> %; run <1\|2> of 2 (TR skipped — no body, W138); deltas: (a) D20 faces (blue-safe/success/secondary CTAs, blue-safe leads and badges, the darkened sidebar card), as-built TOC/share/sticky-bar faces, expanded mobile body + `<details>` TOC; (b) W4/W5/W6/W97/W103/W109 — no newsletter, no related/prev-next, no "Most read"/cadence/"2026", no in-progress panel, crumbs Home / Blog / title, `blog-cover-<key>`, the print button, B-8 list styles; (c) the rotating word, fixed/sticky pieces, FAB/bottom bar, hidden-section height; (d) accepted: <…> | <YYYY-MM-DD> |
```
