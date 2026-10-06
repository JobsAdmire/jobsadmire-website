# Blog module — Operations Website admin → jobsadmire.com (plan, 2026-10-06)

**Owner request (2026-10-06):** "add a blog module in Operations → Website; we have to publish the blog; once it's done we move on to the rest of Phase B." This reorders Phase B: the blog ships **before** the language editor (W215 had strings first) — record as a ruling when work starts.

**Goal:** the marketing team writes a post in Operations (Turkish, English or both), previews it on the real website, someone with publish rights publishes it, and within a minute it is live on jobsadmire.com — index, article page, home "Guides", work-permit "related articles", sitemap, Google-indexable.

Cross-app task: both repos' rules apply (Operations `docs/PRD.md` §5.12/§7.10; website `docs/INTEGRATIONS.md` I1–I3, I11). Website ↔ Operations stays server-side with Bearer tokens; the browser never calls Operations.

## What exists today (verified 2026-10-06)

- **Operations:** `website` module = intake door, forms inbox, integrations. Permission keys `website.blog` and `website.media` are already registered (VIEW/CREATE/EDIT/DELETE/APPROVE): marketing-manager holds VIEW/CREATE/EDIT, APPROVE is super-admin only. No CMS models, no public read API, no read token class (only write/test). `revalidateSecretEnc` is stored in `WebsiteIntegrationConfig` but nothing calls the website yet. Files live in private MinIO (`UploadService`); `sharp` is installed. The careers rich-text editor is a small `contentEditable` with no images, sanitised only in the browser — not good enough for a blog. The marketing module's `SocialPost` (draft → approve → schedule → publish, pure transition map) is the pattern to copy.
- **Website:** posts are `collections.blog` rows (`BlogPostSchema`: per-locale slug/title/excerpt/body, category, publishedAt, readMinutes) from the LOCAL bundle; body is a small Markdown grammar (`blog/[slug]/_lib/markdown.ts`: `##`, lists, `**bold**`, quotes, takeaways callout — no links, italics, H3 or images). One written article (EN); 21 index-only "yakında" cards. `POST /api/revalidate` exists (secret, tags). No preview route, no `images.remotePatterns`. Articles are kept out of Google by `robots.txt` + sitemap exclusion (W4). The FAQ block and author box on articles are fixed for every post.

## Owner decisions (2026-10-06)

- Publishing: marketing writes and submits for review; only the owner (super-admin, `website.blog` APPROVE) publishes. APPROVE can be granted to others later in Roles.
- The 21 design "yakında" cards are REMOVED: the blog shows real published posts only (the one written article is migrated as a published post).
- Vercel connector reconnected (2026-10-06). Design below needs no new secrets: see § Contract.

## Design

### 1. Operations data model (one migration, after `20261001220000`)

- `WebsitePost`: id, number (`BLOG-0001`), category (`workPermits | recruitment | compliance | marketNews`), status (`DRAFT | IN_REVIEW | SCHEDULED | PUBLISHED | UNPUBLISHED`), `featured`, `comingSoon` (index card without an article), authorId (staff user, optional) or "JobsAdmire Editorial", scheduledAt, publishedAt, updatedAt, created/updated by.
- `WebsitePostTranslation` (one per locale tr/en): title, slug (unique per locale), excerpt (also the meta description), body (Markdown in the site grammar), seoTitle?, seoDescription?, coverAssetId?, coverAlt, faq (`[{q,a}]`, optional), readMinutes (computed), `ready` (this language is complete).
- `WebsitePostSlugHistory` (locale, oldSlug → postId) for redirects when a slug changes.
- `WebsiteMediaAsset`: original + resized WebP variants in MinIO (`website-media/…`), width/height, alt per locale, uploadedBy.

### 2. Operations backend

- Admin API under `website/blog` and `website/media` (guards on `website.blog` / `website.media`): list/filter, create, edit (no `status` in the DTO), submit for review (EDIT), approve+publish / schedule / unpublish (APPROVE), delete draft (DELETE), upload image (≤ 8 MB, magic-byte sniff, sharp → WebP 2400/1200/640, EXIF stripped).
- Server-side validation of the Markdown: only the site grammar + the new inline constructs; links `https:`/`mailto:`/site-relative only; images only from the module's own media.
- Publish pipeline: transition → the website picks the change up within 60 s (time-based ISR on the blog feed; no webhook, no shared secret) → Operations read-back polls the article URL (every 15 s, up to 3 min) → status chip LIVE / NOT LIVE + activity log + a notification to the publisher if it never goes live. Scheduled posts publish from a cron (copy `publish-scheduler.cron.ts`).
- Public read API — no website token (published posts are public content, same precedent as `careers/openings`): see § Contract.

### 3. Operations admin UI — Website → Blog

- **Blog list:** status, language badges (TR ✓ / EN ✓), category, author, published date, LIVE chip; filters; "New post".
- **Editor:** TR | EN tabs; visual editor (TipTap, toolbar limited to what the site can render: H2, H3, bold, italic, link, bullet/numbered list, quote, key-takeaways box, image) — staff never see Markdown; cover image upload with crop preview + alt text; category; author; excerpt with a Google-result preview and character counters; optional SEO title/description; FAQ items; "show as coming-soon card" switch; featured switch.
- **Actions:** Save draft · Preview on website (opens jobsadmire.com in draft mode, 30-minute link) · Submit for review · Publish now / Schedule (publish permission) · Unpublish · History (who changed what).
- Sub-nav: Website → Blog (`website.blog:VIEW`), Media library later (the uploader is inside the editor for now).

### 4. Website

- Blog rows come from Operations (`BLOG_SOURCE=OPS`, a plain env var; fetch `revalidate: 60`, tag `blog`); everything else stays LOCAL. If Operations is unreachable, the last good page stays (ISR) and a cold build falls back to the local rows.
- Grammar additions in `markdown.ts` + `ArticleBody`: links, italics, H3, images (rendered through `ImageSlot`/`next/image`), still no raw HTML.
- Real cover images (`next.config.ts` `images.remotePatterns` for the Operations media route only), per-post OG image, per-post FAQ (FAQPage JSON-LD only when the post has FAQs), real author box, `dateModified`.
- SEO flip for published articles: remove `/blog/[slug]` from `NOINDEX_PATHNAMES`, add a blog source to `DETAIL_SITEMAP_SOURCES`, hreflang only for written languages (already).
- Slug change → 308 from the old slug (feed `redirects`); unpublished or deleted post → 404.
- Draft preview: `GET /api/blog-preview?token=` → Next draft mode (cookie holds the token) → `/blog/preview` (and `/en/blog/preview`) renders the draft fetched with that token, `noindex`, with an "Önizleme / Preview" bar. The website needs no secret: Operations validates its own signed token.

### 5. Content migration

- The existing written article (EN, `turkey-work-permit-process-employer-guide`) is inserted by the Operations migration as a PUBLISHED post (same slug, title, excerpt, Markdown body, category, publishedAt). The 21 index-only rows are dropped from the website's LOCAL bundle too (importer), so the fallback holds only the written article. `comingSoon` is not built (owner removed the cards).

### 6. Setup (once)

- Website: one plain Vercel env var `BLOG_SOURCE=OPS` (production), set through the Vercel connector after the Operations feed is live. Operations: preview tokens are signed with a key derived from the existing app secret (no new env var); the media route needs no config. Rollback = remove `BLOG_SOURCE` (site falls back to the LOCAL rows).

## Contract (Operations → website), version `blog.v1`

- `GET /api/website/v1/blog` — `@Public()`, `WebsiteModuleEnabledGuard`, rate-limited, `Cache-Control: public, max-age=30`. Response:
  `{ contractVersion: "blog.v1", generatedAt: ISO, posts: Post[], redirects: { locale: "tr"|"en", from: string, to: string }[] }`
  Post = `{ key: string /* post id */, number: string, category: "workPermits"|"recruitment"|"compliance"|"marketNews", featured: boolean, publishedAt: ISO, updatedAt: ISO, author: { name: string, title: string|null } | null /* null → "JobsAdmire Editorial" */, cover: { url: string /* absolute, the 1600 variant */, width: number, height: number } | null, slug: {tr: string|null, en: string|null}, title: {tr,en: string|null}, excerpt: {tr,en: string|null}, body: {tr,en: string|null /* site Markdown */}, hasBody: {tr: boolean, en: boolean}, readMinutes: {tr: number|null, en: number|null}, coverAlt: {tr,en: string|null}, seo: { title: {tr,en: string|null}, description: {tr,en: string|null} }, faq: { tr: {q: string, a: string}[], en: {q: string, a: string}[] } }`.
  Only PUBLISHED posts with at least one `ready` language; a language that is not ready has `null` slug/title/excerpt/body and `hasBody=false`. Sorted by publishedAt desc.
- `GET /api/website/v1/blog/preview/:token` — `@Public()`; token = HMAC-signed `{postId, exp}` (30 min), issued by the admin "Preview" action; returns `{ post: Post }` built from the current draft (any status), 410 when expired/invalid.
- `GET /api/website/v1/media/:assetId/:variant.webp` (`variant` ∈ 640, 1200, 1600, 2400) — `@Public()`, streams from MinIO, `Cache-Control: public, max-age=31536000, immutable`, 404 for unknown ids. Inline body images are written as `![alt](media:<assetId>)` and the feed rewrites them to the absolute 1200 URL.
- Site Markdown (both sides validate the same grammar): blocks `## `, `### `, paragraph, `- ` list, `1. ` list, `> ` quote, takeaways callout (`> **Title**` then `> - item` lines), leads paragraph (`**lead** — body`), image line `![alt](url)`; inline `**bold**`, `*italic*`, `[text](url)` (https:, mailto:, or site-relative `/…`); `\` escapes `*`, `[`, `]`. Nothing else (no HTML).
- The website maps `category` → its label id itself; `author: null` → "JobsAdmire Editorial"; posts without FAQs show no FAQ block and no FAQPage JSON-LD.

## Order of work and checks

1. Operations backend + migration + tests (transitions, validation, guard, read API contract test against the website's `BlogPostSchema`).
2. Operations admin UI + tests.
3. Website: OPS blog source, grammar, images, SEO flip, preview route, redirects + unit/e2e tests (contract fixture shared from Operations).
4. Deploy Operations (migration) → set secrets → deploy website with `BLOG_SOURCE=OPS` → import existing content → verify: create a test draft, preview it, publish, see it live in < 1 min, unpublish, confirm 410; then publish the owner's first real post.
5. Docs in the same change sets: Operations PRD §5.12/§7.10, ARCHITECTURE (migration, routes, env), NOTIFICATIONS; website PRD, INTEGRATIONS (I1 blog endpoint, I2 revalidate, I3 preview, I11 media), CONTENT-MODEL (blog fields + grammar), SEO, ARCHITECTURE; rulings (Phase B order change, blog source, SEO flip).

## Out of scope for this step

Newsletter e-mail on publish, comments, multiple authors with profiles, a stand-alone media library screen, the strings/language editor and the rest of Phase B (next).
