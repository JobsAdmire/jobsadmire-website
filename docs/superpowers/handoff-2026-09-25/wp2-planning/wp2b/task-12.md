### Task 12: Blog index + article (`/blog`, `/en/blog`, `/blog/[slug]`, `/en/blog/[slug]`)

**Routes:** internal `/blog` (pathnames: a locale-shared literal — TR `/blog`, EN `/en/blog`) · pageKey `blog`; internal `/blog/[slug]` (TR `/blog/<slug.tr>`, EN `/en/blog/<slug.en>`) · pageKey `blogArticle`. Both in route group `(site)` (W19), both **noindex** (`bundle.pages.blog/blogArticle.robots = 'noindex'`, W4), both out of every nav group until `blogNavVisible(bundle)` (the chrome already gates them, T0b/T0c — nothing to do here). Pixel-harness page = the **article** (D27): `npm run pixel -- --page=blog-article --locale=en` (the TR side has no body today, so the harness resolves only the EN article).

**What these pages are in Phase A (W4, W5, W6, W28):** the `blog` collection (22 rows, one EN body, zero TR bodies). The index renders **written articles only** — the rows whose `hasBody[locale]` is true — so `/en/blog` shows one featured article and `/blog` shows the W6 "articles coming" empty state. The article page renders the one written body (Markdown composed by the importer from `blogarticle.025–063`) through a hand-written block renderer (no HTML string, no sanitiser, no client JS), the Key-takeaways callout, the FAQ block with its FAQPage node, `BlogPosting` JSON-LD + `og:type article`, the share/TOC/progress islands, related + prev/next (hidden below the W4 threshold), `NewsletterBand active={false}` (W5), and `generateStaticParams` over the slugs that have a body. Every hidden section is a component that returns `null` when its data is empty — nothing from the design is deleted.

**Importer note (verified at `wp2/foundation` 45a3eee):** the brief says "extend `scripts/import-design-package.ts` … the T0b writer did not include bodies". The landed T0b **does** emit `body[locale]` (its `ARTICLE_BODY` table + `renderBody`, `scripts/import-design-package.ts` lines 395–500; `src/content/local/bundle.en.json` carries a 2,552-character EN body for `turkey-work-permit-process-employer-guide`). This task therefore makes **no importer change**; instead Cycle 3's test pins the grammar the importer writes (paragraphs, `## ` headings, `**bold**`, `- ` lists, `1. **lead** body` steps, `**lead** — body` pairs, `> **title**` + `> - item` callouts, `> quote`) against the committed bundle, so an importer drift breaks the renderer's test, not a page.

**Decisions this task records (write them into the docs in Cycle 6; cite as B-n):**

- **B-1 Index-only entries answer 404.** A slug that exists in the collection but has no body for the requested locale (21 EN rows, all 4 TR rows today) calls `notFound()` — CONTENT-MODEL § Blog: "index-only entries have no article to link to". The design's "In progress / Full guide is being written" panel (`blogarticle.077–080`) is **not** ported; those four ids stay unused. So do `blogarticle.138/139` ("Article not found"): the site's own 404 (`(site)/not-found.tsx`, R6) is the one 404.
- **B-2 Related, prev/next and "Most read" render from data and are hidden today.** Related + prev/next: only while `blogNavVisible(bundle)` (W4: "related-article blocks hidden below the threshold") **and** at least one other written same-locale post exists. "Most read" (`blog.031`, the hero's second float card `blog.030`): no analytics source exists in Phase A → hidden (W6-style empty rule); `blog.030/031` unused.
- **B-3 Cadence and dated hero claims are hidden (D17).** `blog.097` "New article every week", `blog.093/094` "Weekly · New post" and `blog.027/028` ("— 2026", "8 min read") have no metric/cadence row → not rendered. The hero's float card is built from the featured post's own data (category label, title, author, `formatReadMinutes`). `blog.025/026` ("English & Türkçe — 2 languages") render as authored: the site has exactly two locales (`routing.locales`), not a signed metric.
- **B-4 The rotating h1 word (D20).** The h1 is server-rendered with the first word so it is stable for crawlers/AT (`sr-only` static word + `aria-hidden` rotating span); the `RotatingWord` island rotates every 2.6 s only when `prefers-reduced-motion` is not set and exposes a pause/play button (labels `sys.marquee.pause/play`). Word order is locale-dependent (`blog.095` sits **before** the word in EN and **after** it in TR) → the page fills `sys.blog.hero.title` (`"{pre} {word}"` / `"{word} {pre}"`) with `pre = t('blog.095')` — the package itself splits the sentence, so composing it is allowed (W23).
- **B-5 The tools bar (search, category chips, mobile topic sheet, "Load more", result line) is a DOM-level progressive enhancement** over the server-rendered card list, loaded with `next/dynamic` + `ssr: false` (W13) and mounted **only from 6 non-featured written posts** (`TOOLS_MIN_POSTS`, the design's page size); with fewer posts the list renders plain. The design's in-page EN|TR post toggle is dropped — the route locale is the language switch (page note). `blog.085` (a `for “` fragment) is replaced by the ICU messages `sys.blog.tools.resultsFor/resultsIn/all`.
- **B-6 `#request-form` deep links.** Page-local CTAs render next-intl's `Link` with the object href `{ pathname: '/hire-workers', hash: '#request-form' }` + `buttonClassName(...)` (typed, localises to `/isci-talebi#request-form`); the two foundation components whose CTA href is a plain string (`StickyCtaBar`, `ClosingCtaBand`) receive the bare key `'/hire-workers'` — a hash-suffixed string is not a `pathnames` key and would not localise on TR. Listed under **Foundation gaps**.
- **B-7 LCP = the h1.** The article cover slot `cover-<post.key>` and the index hero slot `blog-hero` render as named placeholders (no photography, §10 row 4 covers Homepage/Hire only); D26 forbids a placeholder LCP slot, so `data-lcp-slot="h1"` sits on the h1 of both pages and the placeholders are not `lcp`.
- **B-8 Newsletter.** `actions.ts` (`submitNewsletter` → door `newsletter`, fields `{ email }`) and `NewsletterForm` (FormShell + one `Field`) are written so flipping `active` is a one-prop change; `NewsletterBand active={false}` returns `null`, so **nothing** of the form reaches the DOM or the client bundle in Phase A (W5). The "form fallback panel after submit" e2e case is therefore N/A; the spec asserts the band is absent instead.
- **B-9 Breadcrumbs = Home / Blog / <article title>** (every crumb needs an `href`; there are no category pages). The category shows as the hero pill.
- **B-10 FAQ copy gaps.** The package lacks A1 and Q3 (page note). `sys.blog.faq.a1` fills `{weeks}` from `metricValues(bundle, locale).firstDayWeeks` ("6–8", W1) and `sys.blog.faq.q3` fills `{ratio}` from `getRateConfig(bundle).quotaRatio` (5) — numbers from data, never typed (D17).
- **B-11 The body's closing quote CTA.** `blogarticle.063` is the last body block (a `> quote`); its button `blogarticle.064` ("Talk to a permit specialist →") is page chrome rendered right after the body as a `ContactCta` (WhatsApp, `page_cta`, prefill `sys.whatsapp.prefill + sys.blog.whatsapp.permit`). The FAQ block's ask card is the design's blue sidebar card (`blogarticle.071/072`) with WhatsApp (`blogarticle.085`) + call (`hire.032`).
- **B-12 Markdown = a block parser that returns React nodes**, page-local (`[slug]/_lib/markdown.ts`), no `dangerouslySetInnerHTML`, no dependency: the grammar is exactly the importer's (Phase A) and the CMS's plain Markdown (Phase B, CONTENT-MODEL v1). Unknown syntax renders as text.
- **B-13 The mobile collapsible body sections are not ported** (the design turns each `h2` into a toggle button): D20 — the body is always expanded; the mobile "In this article" TOC is a `<details>` above the body with the same headings list.
- **B-14 Gate routes:** `/blog`, `/en/blog` and `/en/blog/turkey-work-permit-process-employer-guide` (all `indexable: false`); no TR article route exists to gate (0 TR bodies).

**Files:**

Create

- `src/app/[locale]/(site)/blog/page.tsx`
- `src/app/[locale]/(site)/blog/actions.ts`
- `src/app/[locale]/(site)/blog/_lib/posts.ts`
- `src/app/[locale]/(site)/blog/_lib/newsletter.ts`
- `src/app/[locale]/(site)/blog/_components/NewsletterForm.tsx`
- `src/app/[locale]/(site)/blog/_components/RotatingWord.tsx`
- `src/app/[locale]/(site)/blog/_components/HeroArt.tsx`
- `src/app/[locale]/(site)/blog/_components/PostList.tsx`
- `src/app/[locale]/(site)/blog/_components/PostFilterLoader.tsx`
- `src/app/[locale]/(site)/blog/_components/PostFilter.tsx`
- `src/app/[locale]/(site)/blog/[slug]/page.tsx`
- `src/app/[locale]/(site)/blog/[slug]/_lib/markdown.ts`
- `src/app/[locale]/(site)/blog/[slug]/_components/ArticleBody.tsx`
- `src/app/[locale]/(site)/blog/[slug]/_components/ArticleToc.tsx`
- `src/app/[locale]/(site)/blog/[slug]/_components/ArticleEnhancements.tsx`
- `src/app/[locale]/(site)/blog/[slug]/_components/ArticleEnhancementsLoader.tsx`
- `src/app/[locale]/(site)/blog/[slug]/_components/RelatedPosts.tsx`
- `e2e/pages/blog.spec.ts`

Modify

- `src/messages/tr.json`, `src/messages/en.json` — `sys.seo.blog.*` + `sys.seo.blogArticle.title` (inside the existing `seo` object, after `ogTagline`) and a new `sys.blog.*` object (directly after the `form` object)
- `src/lib/seo/routes.ts` — delete `'/blog'` (Cycle 1) and `'/blog/[slug]'` (Cycle 3) from `UNBUILT_PATHNAMES` (W20)
- `e2e/routes.ts` — append the three gate paths to `GATE_ROUTE_TABLE` (W21)
- `docs/SEO.md`, `docs/ANALYTICS.md`, `docs/CONTENT-MODEL.md`, `docs/PRD.md`, the WP2b ledger — Cycle 6

Test

- `src/app/[locale]/(site)/blog/__tests__/sys-keys.test.ts`
- `src/app/[locale]/(site)/blog/__tests__/posts.test.ts`
- `src/app/[locale]/(site)/blog/__tests__/newsletter.test.ts`
- `src/app/[locale]/(site)/blog/__tests__/RotatingWord.test.tsx`
- `src/app/[locale]/(site)/blog/[slug]/__tests__/markdown.test.ts`
- `src/app/[locale]/(site)/blog/[slug]/__tests__/ArticleBody.test.tsx`
- `e2e/pages/blog.spec.ts`

**Interfaces:**

Consumes (exact names — WP1 code as it exists on `main`/`wp2/foundation`, WP2a as spelled in `produces-final.md`):

- WP1: `getBundle` (`@/content/adapter`), `makeT` (`@/content/pure`), `routing`/`Locale` (`@/i18n/routing`), `Link`, `getPathname` (`@/i18n/navigation`), `buildMetadata` (`@/lib/seo/metadata`), `absoluteUrl` (`@/lib/seo/routes`), `JsonLd` (`@/lib/seo/JsonLdScript`), `waLink`, `telLink` (`@/lib/contact`), `formatInt` (`@/lib/format/money`), `FormKey` (`@/analytics/forms`), primitives `Accordion`, `Card`, `Eyebrow`, `Section` (`@/design/primitives`), `renderWithIntl` (`@/test/render`), `Bundle` type (`contract/website-bundle.v1`), `sys.home`, `sys.marquee.pause/play`, `sys.whatsapp.prefill`, `sys.nav.close`, `sys.thankYou.forms.newsletter` (exists).
- WP2a T1: `getCollection`, `getRateConfig`, `blogNavVisible`, `BLOG_NAV_THRESHOLD`, `type BlogPost`, `type BlogCategory` (`@/content/collections`); `makeTf`, `metricValues`, `fill` (`@/content/pure`); the `blog` rows' shape (`key`, per-locale `slug/title/excerpt/body`, `categoryLabelId`, `author`, `publishedAt`, `readMinutes`, `hasBody`); `bundle.pages.blog/blogArticle` records (`titleId ''`, `robots 'noindex'`).
- WP2a T2 (forms kernel): `createFormAction`, `type FormActionState` (`@/forms/action`); `type WireFields` (`@/forms/wire`); `fieldErrorsFromIssues` (`@/forms/errors`); `FormShell` (`@/forms/client/FormShell`); `Field` (`@/forms/client/Field`); `sys.form.labels.email` (T2 ships it); the `'use server'` page-side wrapper pattern.
- WP2a T3: `ContactLink` is used by the blocks, not directly; `buttonClassName` (`@/design/primitives`); route group `(site)`; `CTA_BY_PATHNAME` has no `/blog` entries (defaults) — this page renders no CTA-contract element id.
- WP2a T4: `UNBUILT_PATHNAMES` + `robotsDisallowPaths` (`@/lib/seo/routes`) and `src/lib/seo/unbuilt.test.ts`; `buildMetadata` with `alternates` (typed dynamic `Href` objects) and `openGraph: { type: 'article', publishedTime, authors }`; `pageOgImageUrl` (`@/lib/seo/routes`); `articleJsonLd` (`@/lib/seo/jsonld`); `sys.seo.*` object.
- WP2a T5: `Section` tones `'pale'`/`'dark'`, `StickyCtaBar` (`@/design/chrome/StickyCtaBar` — `{ message, ctas, showAfterPx?, hideNearId?, live? }`), blocks `Breadcrumbs`, `PostCard`, `EmptyState`, `ImageSlot`, `FaqBlock`, `ClosingCtaBand`, `NewsletterBand`, `ContactCta`, `type Crumb`, `type FaqItem` (`@/design/blocks`); `formatDate`, `formatReadMinutes` (`@/lib/format/date`); `RadioChips` (`@/design/primitives`); `testBundle` (`@/test/bundle`).
- WP2a T6: islands `ScrollSpyToc`, `type TocHeading`, `ShareRow`, `type ShareLabels`, `ProgressBar`, `useScrollProgress`, `SearchInput`, `BottomSheet` (`@/design/islands`).
- WP2a T7: `GATE_ROUTE_TABLE` (`e2e/routes.ts`), the page markup contract (`data-testid="page-h1"`, `data-lcp-slot`, named `data-placeholder`), `npm run js-size`, `npm run pixel -- --page=blog-article --locale=en`.
- Ops catalog (T8 / v1.0): form `newsletter` (kind NEWSLETTER) — `email` REQUIRED (email), `name` ≤120 optional; `activeByDefault: false` → the door answers 404 until the operator flips `isActive` (D14). This task sends exactly `{ email }`.

Produces (later tasks rely on): nothing outside these two routes. `e2e/pages/` already exists from earlier page tasks (create it if this task runs first). The page-local Markdown grammar (`[slug]/_lib/markdown.ts`) is the v1 blog body contract the Phase B CMS editor must respect — recorded in `docs/CONTENT-MODEL.md` § Blog.

---

#### Cycle 1 — Index route skeleton, metadata, `UNBUILT` removal, `sys.seo.blog.*`, `sys.blog.*` copy

- [ ] **Step 1: Write the failing test**

`src/app/[locale]/(site)/blog/__tests__/sys-keys.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import en from '@/messages/en.json';
import tr from '@/messages/tr.json';

/** Every `sys.*` key the two blog pages read (W9/W23). Both files must carry each one, non-empty,
 *  and — apart from the three keys whose value is a template or a brand line — the Turkish must
 *  not be a copy of the English. */
export const BLOG_SYS_KEYS = [
  'seo.blog.title',
  'seo.blog.description',
  'seo.blogArticle.title',
  'blog.hero.title',
  'blog.hero.words',
  'blog.index.latest',
  'blog.empty.title',
  'blog.empty.body',
  'blog.empty.cta',
  'blog.tools.search',
  'blog.tools.category',
  'blog.tools.results',
  'blog.tools.resultsFor',
  'blog.tools.resultsIn',
  'blog.tools.all',
  'blog.article.progress',
  'blog.article.backToTop',
  'blog.article.langNote',
  'blog.article.sections',
  'blog.faq.a1',
  'blog.faq.q3',
  'blog.whatsapp.article',
  'blog.whatsapp.consult',
  'blog.whatsapp.permit',
] as const;

/** Keys whose TR and EN values are legitimately near-identical (templates / mixed-language pills). */
const SAME_ALLOWED = new Set(['seo.blogArticle.title', 'blog.hero.title', 'blog.article.langNote']);

const read = (messages: { sys: Record<string, unknown> }, path: string): unknown =>
  path.split('.').reduce<unknown>((acc, k) => (acc as Record<string, unknown> | undefined)?.[k], messages.sys);

describe('sys.blog.* / sys.seo.blog* keys', () => {
  for (const key of BLOG_SYS_KEYS) {
    it(`${key} exists in both locales`, () => {
      const e = read(en, key);
      const t = read(tr, key);
      expect(typeof e).toBe('string');
      expect(typeof t).toBe('string');
      expect((e as string).length).toBeGreaterThan(0);
      expect((t as string).length).toBeGreaterThan(0);
      if (!SAME_ALLOWED.has(key)) expect(t).not.toBe(e);
    });
  }
  it('the hero word list has five words in both locales (the design rotates five)', () => {
    expect((read(en, 'blog.hero.words') as string).split('|')).toHaveLength(5);
    expect((read(tr, 'blog.hero.words') as string).split('|')).toHaveLength(5);
  });
  it('the ICU templates carry the placeholders the pages fill', () => {
    for (const m of [en, tr]) {
      expect(read(m, 'blog.hero.title')).toMatch(/\{pre\}/);
      expect(read(m, 'blog.hero.title')).toMatch(/<word><\/word>/);
      expect(read(m, 'seo.blogArticle.title')).toMatch(/\{title\}/);
      expect(read(m, 'blog.faq.a1')).toMatch(/\{weeks\}/);
      expect(read(m, 'blog.faq.q3')).toMatch(/\{ratio\}/);
      expect(read(m, 'blog.tools.results')).toMatch(/plural/);
      expect(read(m, 'blog.article.sections')).toMatch(/plural/);
    }
  });
});
```

- [ ] **Step 2: Run to verify it fails**

`npx vitest run "src/app/\[locale\]/(site)/blog"` → every `exists in both locales` case fails with `expected 'undefined' to be 'string'` (no `sys.blog` object, no `sys.seo.blog*` keys yet). `npx vitest run src/lib/seo/unbuilt.test.ts` is green now and goes RED the moment `blog/page.tsx` exists unless `'/blog'` leaves `UNBUILT_PATHNAMES` in the same step — Step 3 does both.

- [ ] **Step 3: Implement**

`src/messages/en.json` — inside the existing `"seo": { … "ogTagline": "…" }` object add, after `ogTagline`:

```json
      "blog": {
        "title": "Blog & Guides | JobsAdmire",
        "description": "Hiring guides, work permit updates and workforce news for employers in Türkiye — written by the JobsAdmire permit and recruitment team."
      },
      "blogArticle": {
        "title": "{title} | JobsAdmire"
      }
```

and, directly after the `"form": { … }` object, the page namespace:

```json
    "blog": {
      "hero": {
        "title": "{pre} <word></word>",
        "words": "employers|factories|hotels|farms|builders"
      },
      "index": {
        "latest": "Latest articles"
      },
      "empty": {
        "title": "Articles are on the way",
        "body": "We are preparing our work permit and hiring guides for employers. The first articles will appear here as soon as they are published.",
        "cta": "Browse the Turkish articles"
      },
      "tools": {
        "search": "Search articles",
        "category": "Category",
        "results": "{n, plural, =0 {No results} one {# result} other {# results}}",
        "resultsFor": "{n, plural, one {# result} other {# results}} for “{q}”",
        "resultsIn": "{n, plural, one {# article} other {# articles}} in {cat}",
        "all": "All {n} articles"
      },
      "article": {
        "progress": "Reading progress",
        "backToTop": "Back to top",
        "langNote": "EN · Also in Turkish",
        "sections": "{n, plural, one {# section} other {# sections}}"
      },
      "faq": {
        "a1": "Typically {weeks} weeks end to end, including the ministry's review. A licensed agency pre-checks the file, so a missing document does not restart the clock.",
        "q3": "Can I hire if I don't meet the {ratio}:1 employee ratio?"
      },
      "whatsapp": {
        "article": "I read your work permit guide and want to hire workers.",
        "consult": "I would like a free consultation.",
        "permit": "I need help with work permits."
      }
    },
```

`src/messages/tr.json` — the same keys (formal "siz", marketing register):

```json
      "blog": {
        "title": "Blog ve Rehberler | JobsAdmire",
        "description": "Türkiye'deki işverenler için işe alım rehberleri, çalışma izni güncellemeleri ve iş gücü haberleri — JobsAdmire izin ve işe alım ekibinden."
      },
      "blogArticle": {
        "title": "{title} | JobsAdmire"
      }
```

```json
    "blog": {
      "hero": {
        "title": "<word></word> {pre}",
        "words": "işverenler|fabrikalar|oteller|çiftlikler|müteahhitler"
      },
      "index": {
        "latest": "Son yazılar"
      },
      "empty": {
        "title": "Türkçe yazılar hazırlanıyor",
        "body": "İşverenler için çalışma izni ve işe alım rehberlerimizi Türkçe olarak yayına hazırlıyoruz. İlk yazılar yayımlandığında bu sayfada yer alacak.",
        "cta": "İngilizce yazılara göz atın"
      },
      "tools": {
        "search": "Yazılarda ara",
        "category": "Kategori",
        "results": "{n, plural, =0 {Sonuç bulunamadı} one {# sonuç} other {# sonuç}}",
        "resultsFor": "“{q}” için {n} sonuç",
        "resultsIn": "{cat} · {n} yazı",
        "all": "{n} yazı"
      },
      "article": {
        "progress": "Okuma ilerlemesi",
        "backToTop": "Başa dön",
        "langNote": "TR · İngilizce'de de var",
        "sections": "{n, plural, one {# bölüm} other {# bölüm}}"
      },
      "faq": {
        "a1": "Baştan sona genellikle {weeks} hafta sürer; bakanlık incelemesi bu sürenin içindedir. Lisanslı bir ajans dosyayı önceden kontrol ettiği için eksik bir belge süreyi baştan başlatmaz.",
        "q3": "{ratio}:1 çalışan oranını sağlamıyorsam yabancı işçi çalıştırabilir miyim?"
      },
      "whatsapp": {
        "article": "çalışma izni rehberinizi okudum ve işçi talebinde bulunmak istiyorum.",
        "consult": "ücretsiz danışmanlık almak istiyorum.",
        "permit": "çalışma izinleri konusunda desteğe ihtiyacım var."
      }
    },
```

(The three `whatsapp.*` values are sentence tails: the pages prefix them with `sys.whatsapp.prefill` — "Merhaba JobsAdmire, " / "Hello JobsAdmire, " — exactly as the chrome does, so the TR tails start lower-case on purpose.)

`src/lib/seo/routes.ts` — in the `UNBUILT_PATHNAMES = new Set<keyof typeof pathnames>([ … ])` literal (WP2a Task 4; 19 entries at hand-over, fewer once earlier page tasks ran), **delete the line** `  '/blog',`. Keep `'/blog/[slug]'` in the set until Cycle 3. Nothing else in the file changes. (`robotsDisallowPaths` now yields `/blog` in both locales — the index is built and noindex, its detail route still unbuilt; the per-key subtraction happens before the prefix fold, W37.)

`src/app/[locale]/(site)/blog/_lib/posts.ts` (pure, client-safe — the index and article pages both read it):

```ts
import type { BlogPost } from '@/content/collections';
import type { Locale } from '@/i18n/routing';

/** The design's initial page size; the tools island mounts only from this many non-featured
 *  written posts (B-5). */
export const TOOLS_MIN_POSTS = 6;
export const RELATED_MAX = 3;

/** CONTENT-MODEL § Blog: written articles only. A post is renderable in a locale when it has a
 *  body, a slug and a title for that locale (PostCard also needs the slug + title, W33). */
export function isWritten(post: BlogPost, locale: Locale): boolean {
  return post.hasBody[locale] && post.slug[locale] !== null && post.title[locale] !== null;
}

/** Written posts, newest first; ties keep the collection (blog-posts.js) order. */
export function writtenPosts(rows: readonly BlogPost[], locale: Locale): BlogPost[] {
  return rows
    .map((post, index) => ({ post, index }))
    .filter(({ post }) => isWritten(post, locale))
    .sort((a, b) =>
      a.post.publishedAt === b.post.publishedAt
        ? a.index - b.index
        : a.post.publishedAt < b.post.publishedAt
          ? 1
          : -1,
    )
    .map(({ post }) => post);
}

/** The featured card is the newest written post; the grid holds the rest. */
export function splitFeatured(written: readonly BlogPost[]): {
  featured: BlogPost | null;
  rest: BlogPost[];
} {
  const [featured = null, ...rest] = written;
  return { featured, rest };
}

/** Same-category first, then newest, never the post itself, at most RELATED_MAX. */
export function relatedPosts(
  written: readonly BlogPost[],
  post: BlogPost,
  max = RELATED_MAX,
): BlogPost[] {
  const others = written.filter((p) => p.key !== post.key);
  const same = others.filter((p) => p.category === post.category);
  const rest = others.filter((p) => p.category !== post.category);
  return [...same, ...rest].slice(0, max);
}

/** Neighbours in the written list (newest first): `prev` is the newer post, `next` the older. */
export function prevNext(
  written: readonly BlogPost[],
  post: BlogPost,
): { prev: BlogPost | null; next: BlogPost | null } {
  const i = written.findIndex((p) => p.key === post.key);
  if (i < 0) return { prev: null, next: null };
  return { prev: written[i - 1] ?? null, next: written[i + 1] ?? null };
}

/** The written post whose slug matches in this locale, or null (B-1: index-only → 404). */
export function findWritten(
  rows: readonly BlogPost[],
  locale: Locale,
  slug: string,
): BlogPost | null {
  return rows.find((p) => p.slug[locale] === slug && isWritten(p, locale)) ?? null;
}

/** The distinct categories among the written posts, in first-seen order, as chip options. */
export function categoryOptions(
  written: readonly BlogPost[],
  t: (id: string) => string,
): { value: BlogPost['category']; label: string }[] {
  const seen = new Map<BlogPost['category'], string>();
  for (const p of written) if (!seen.has(p.category)) seen.set(p.category, t(p.categoryLabelId));
  return [...seen].map(([value, label]) => ({ value, label }));
}
```

`src/app/[locale]/(site)/blog/page.tsx` (the skeleton — the sections arrive in Cycle 2; this version already renders the h1, the breadcrumb, the empty state and the featured card so the route is a real page from the first commit):

```tsx
import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getBundle, makeT } from '@/content/adapter';
import { getCollection } from '@/content/collections';
import { Breadcrumbs, EmptyState, PostCard } from '@/design/blocks';
import { Section } from '@/design/primitives';
import { getPathname } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { buildMetadata } from '@/lib/seo/metadata';
import { splitFeatured, writtenPosts } from './_lib/posts';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const bundle = await getBundle(locale);
  const sys = await getTranslations({ locale, namespace: 'sys' });
  // The blog page record has '' SEO ids (T0b) → the sys.seo.blog.* fallbacks apply (W23/W38);
  // robots 'noindex' comes from the record itself (W4).
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
  const [bundle, sys] = await Promise.all([getBundle(locale), getTranslations('sys')]);
  const t = makeT(bundle);
  const rows = getCollection(bundle, 'blog');
  const written = writtenPosts(rows, locale);
  const { featured } = splitFeatured(written);
  const other: Locale = locale === 'tr' ? 'en' : 'tr';
  const otherHasPosts = writtenPosts(rows, other).length > 0;
  const words = sys('blog.hero.words').split('|');

  return (
    <>
      <Section tone="dark" id="blog-hero" className="relative overflow-hidden">
        <div className="container-site relative">
          <Breadcrumbs
            locale={locale}
            tone="dark"
            items={[
              { name: sys('home'), href: '/' },
              { name: t('blog.004'), href: '/blog' },
            ]}
          />
          <h1 data-testid="page-h1" data-lcp-slot="h1" className="mt-4 max-w-[760px] text-h1">
            {sys.rich('blog.hero.title', { pre: t('blog.095'), word: () => words[0] })}
          </h1>
          <p className="mt-4 max-w-[620px] text-body-lg text-white/78">{t('blog.096')}</p>
        </div>
      </Section>

      <Section tone="light">
        <div className="container-site">
          {featured ? (
            <PostCard
              bundle={bundle}
              locale={locale}
              post={featured}
              variant="featured"
              headingLevel={2}
            />
          ) : (
            <EmptyState
              testId="blog-empty"
              headingLevel={2}
              title={sys('blog.empty.title')}
              body={sys('blog.empty.body')}
              cta={
                otherHasPosts
                  ? { label: sys('blog.empty.cta'), href: getPathname({ locale: other, href: '/blog' }) }
                  : undefined
              }
            />
          )}
        </div>
      </Section>
    </>
  );
}
```

(`EmptyState.cta.href` is a string that reaches `ContactCta` → `Button` → next-intl `Link`, which prefixes the locale for a string that is not a `pathnames` key: for the TR page the target is the **EN** index, so the already-localised `/en/blog` from `getPathname({ locale: 'en' })` would be prefixed again only if the current locale were `en` — on the TR page it is not prefixed (default locale, `as-needed`). On the EN page the target is `/blog` (TR): `getPathname({ locale: 'tr', href: '/blog' })` = `/blog`, and next-intl's `Link` on an EN page prefixes an unknown string to `/en/blog` — the wrong locale. Cycle 2 therefore replaces this `cta` with a page-local anchor; keep it here only so the skeleton compiles and the TR empty state is testable.)

`e2e/routes.ts` — append to `GATE_ROUTE_TABLE` (WP2a Task 7's `readonly GateRoute[]`; the article path joins in Cycle 3):

```ts
  { path: '/blog', indexable: false },
  { path: '/en/blog', indexable: false },
```

- [ ] **Step 4: Run tests + npm run verify**

`npx vitest run "src/app/\[locale\]/(site)/blog" src/lib/seo/unbuilt.test.ts src/lib/seo/routes.test.ts src/messages` → green (the 24 keys exist in both files; `unbuilt.test.ts` sees `blog/page.tsx` and no `'/blog'` in the set; Task 2's `messages.test.ts` still finds identical key sets). `npm run verify` → green.

- [ ] **Step 5: Commit**

```
feat(blog): index route skeleton, metadata, sys.blog copy, /blog leaves UNBUILT (T12 c1)

/blog and /en/blog render the hero h1 (LCP slot), the breadcrumb and either the
featured written post or the W6 empty state (TR today: 0 bodies). Page record
robots stay noindex (W4). sys.blog.* + sys.seo.blog* in both locales (W9/W23).

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
```

---

#### Cycle 2 — Index sections: hero art + rotating word, post list, tools island, newsletter (hidden) + action, closing band

- [ ] **Step 1: Write the failing test**

`src/app/[locale]/(site)/blog/__tests__/posts.test.ts`:

```ts
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { BundleSchema } from '../../../../../../contract/website-bundle.v1';
import { getCollection, type BlogPost } from '@/content/collections';
import {
  categoryOptions,
  findWritten,
  isWritten,
  prevNext,
  relatedPosts,
  splitFeatured,
  writtenPosts,
} from '../_lib/posts';

// The committed bundles are read with readFileSync (the lint/contract tests' own pattern) —
// never imported (R56).
const load = (locale: 'tr' | 'en') =>
  BundleSchema.parse(
    JSON.parse(
      readFileSync(join(__dirname, '../../../../../content/local', `bundle.${locale}.json`), 'utf8'),
    ),
  );

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

describe('writtenPosts on the committed bundle (W4/W28: 1 EN body, 0 TR)', () => {
  it('EN lists exactly the one written article; TR lists none', () => {
    const en = writtenPosts(getCollection(load('en'), 'blog'), 'en');
    expect(en.map((p) => p.key)).toEqual(['turkey-work-permit-process-employer-guide']);
    expect(writtenPosts(getCollection(load('tr'), 'blog'), 'tr')).toEqual([]);
  });
  it('findWritten: the EN slug resolves, the TR slug of the same row does not (B-1)', () => {
    const rows = getCollection(load('en'), 'blog');
    expect(findWritten(rows, 'en', 'turkey-work-permit-process-employer-guide')?.key).toBe(
      'turkey-work-permit-process-employer-guide',
    );
    expect(findWritten(rows, 'tr', 'yabanci-isciler-calisma-izni-rehberi')).toBeNull();
    expect(findWritten(rows, 'en', 'hiring-from-pakistan-turkish-employers')).toBeNull();
  });
});

describe('the pure helpers', () => {
  const a = post({ key: 'a', publishedAt: '2026-03-01', category: 'recruitment', categoryLabelId: 'home.265' });
  const b = post({ key: 'b', publishedAt: '2026-02-01' });
  const c = post({ key: 'c', publishedAt: '2026-02-01', hasBody: { tr: false, en: true }, body: { tr: null, en: 'x' } });
  const d = post({ key: 'd', publishedAt: '2026-01-01', slug: { tr: null, en: 'd' }, title: { tr: null, en: 'D' } });

  it('isWritten needs body + slug + title for the locale', () => {
    expect(isWritten(c, 'tr')).toBe(false);
    expect(isWritten(c, 'en')).toBe(true);
    expect(isWritten(d, 'tr')).toBe(false);
  });
  it('sorts newest first and keeps collection order on a tie', () => {
    expect(writtenPosts([d, c, b, a], 'en').map((p) => p.key)).toEqual(['a', 'c', 'b', 'd']);
    expect(writtenPosts([d, c, b, a], 'tr').map((p) => p.key)).toEqual(['a', 'b']);
  });
  it('splitFeatured takes the newest as featured', () => {
    const { featured, rest } = splitFeatured(writtenPosts([a, b, c], 'en'));
    expect(featured?.key).toBe('a');
    expect(rest.map((p) => p.key)).toEqual(['b', 'c']);
    expect(splitFeatured([])).toEqual({ featured: null, rest: [] });
  });
  it('relatedPosts: same category first, never itself, capped', () => {
    const written = writtenPosts([a, b, c, d], 'en');
    expect(relatedPosts(written, b).map((p) => p.key)).toEqual(['c', 'd', 'a']);
    expect(relatedPosts(written, b, 1).map((p) => p.key)).toEqual(['c']);
  });
  it('prevNext walks the newest-first list', () => {
    const written = writtenPosts([a, b, c, d], 'en');
    expect(prevNext(written, c)).toMatchObject({ prev: { key: 'a' }, next: { key: 'b' } });
    expect(prevNext(written, a).prev).toBeNull();
    expect(prevNext(written, post({ key: 'zzz' }))).toEqual({ prev: null, next: null });
  });
  it('categoryOptions: distinct, first-seen order, labels through t()', () => {
    const t = (id: string) => `<${id}>`;
    expect(categoryOptions(writtenPosts([a, b, c], 'en'), t)).toEqual([
      { value: 'recruitment', label: '<home.265>' },
      { value: 'workPermits', label: '<home.263>' },
    ]);
  });
});
```

`src/app/[locale]/(site)/blog/__tests__/newsletter.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { fieldErrorsFromIssues } from '@/forms/errors';
import { newsletterFields, newsletterSchema } from '../_lib/newsletter';

const codes = (input: unknown) => {
  const r = newsletterSchema.safeParse(input);
  return r.success ? {} : fieldErrorsFromIssues(r.error.issues);
};

describe('newsletterSchema (W3: .min(1) before .email())', () => {
  it('accepts a work e-mail', () => {
    expect(newsletterSchema.safeParse({ email: 'hr@example.com' }).success).toBe(true);
  });
  it('empty → required, malformed → email, over the door cap → max', () => {
    expect(codes({ email: '' })).toEqual({ email: 'required' });
    expect(codes({ email: 'nope' })).toEqual({ email: 'email' });
    expect(codes({ email: `${'a'.repeat(250)}@example.com` })).toEqual({ email: 'max' });
  });
});

describe('newsletterFields → the exact catalog names', () => {
  it('sends only `email` (the catalog: email REQUIRED; name optional, not collected)', () => {
    expect(newsletterFields(newsletterSchema.parse({ email: ' HR@Example.com ' }))).toEqual({
      email: 'HR@Example.com',
    });
  });
});
```

`src/app/[locale]/(site)/blog/__tests__/RotatingWord.test.tsx`:

```tsx
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithIntl } from '@/test/render';
import { RotatingWord } from '../_components/RotatingWord';

const WORDS = ['employers', 'factories', 'hotels'];

function mockMotion(reduce: boolean) {
  window.matchMedia = vi.fn().mockImplementation((q: string) => ({
    matches: reduce && q.includes('prefers-reduced-motion'),
    media: q,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
}

describe('RotatingWord (D20: stable text, pause control, reduced motion)', () => {
  beforeEach(() => vi.useFakeTimers({ shouldAdvanceTime: true }));
  afterEach(() => vi.useRealTimers());

  it('server HTML carries the first word for AT and rotates the aria-hidden span only', async () => {
    mockMotion(false);
    renderWithIntl(<RotatingWord words={WORDS} intervalMs={100} />, { locale: 'en' });
    expect(screen.getByTestId('hero-word-static')).toHaveTextContent('employers');
    const live = screen.getByTestId('hero-word-live');
    expect(live).toHaveAttribute('aria-hidden', 'true');
    expect(live).toHaveTextContent('employers');
    await vi.advanceTimersByTimeAsync(120);
    expect(live).toHaveTextContent('factories');
    expect(screen.getByTestId('hero-word-static')).toHaveTextContent('employers');
  });

  it('the pause button stops the rotation and toggles to play', async () => {
    mockMotion(false);
    renderWithIntl(<RotatingWord words={WORDS} intervalMs={100} />, { locale: 'en' });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    await user.click(screen.getByRole('button', { name: 'Pause' }));
    await vi.advanceTimersByTimeAsync(250);
    expect(screen.getByTestId('hero-word-live')).toHaveTextContent('employers');
    expect(screen.getByRole('button', { name: 'Play' })).toBeInTheDocument();
  });

  it('under reduced motion nothing rotates and no control renders', async () => {
    mockMotion(true);
    renderWithIntl(<RotatingWord words={WORDS} intervalMs={100} />, { locale: 'en' });
    await vi.advanceTimersByTimeAsync(250);
    expect(screen.getByTestId('hero-word-live')).toHaveTextContent('employers');
    expect(screen.queryByRole('button')).toBeNull();
  });
});
```

- [ ] **Step 2: Run to verify it fails**

`npx vitest run "src/app/\[locale\]/(site)/blog"` → `posts.test.ts` is green already (the helpers landed in Cycle 1); `newsletter.test.ts` and `RotatingWord.test.tsx` fail with `Cannot find module '../_lib/newsletter'` / `'../_components/RotatingWord'`.

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/blog/_lib/newsletter.ts` (pure — the schema and the catalog mapping; the `'use server'` file wraps it):

```ts
import { z } from 'zod';
import type { WireFields } from '@/forms/wire';

/** The door's `email` is an e-mail ≤ 254 (RFC length; the catalog types it `email`). W3: `.min(1)`
 *  before `.email()` so an empty field reports `required`, not `email`. */
export const newsletterSchema = z.object({
  email: z.string().trim().min(1).max(254, { message: 'max' }).email(),
});
export type NewsletterInput = z.infer<typeof newsletterSchema>;

/** Exactly the catalog field names for form `newsletter` (v1.0): `email` only — `name` is
 *  optional in the catalog and the design collects no name. */
export function newsletterFields(parsed: NewsletterInput): WireFields {
  return { email: parsed.email };
}
```

`src/app/[locale]/(site)/blog/actions.ts`:

```ts
'use server';
import { createFormAction, type FormActionState } from '@/forms/action';
import { newsletterFields, newsletterSchema } from './_lib/newsletter';

const run = createFormAction({
  key: 'newsletter',
  schema: newsletterSchema,
  toFields: (parsed) => newsletterFields(parsed),
  // D14: the band shows a consent notice with the privacy link, not a checkbox (the design has
  // one field and one button); consentVersion still travels in the envelope.
  consent: 'notice',
});

/** The one exported async function a `'use server'` module may carry (Task 2's wrapper
 *  pattern). Success redirects to /tesekkurler?form=newsletter inside the kernel (D13). */
export async function submitNewsletter(
  prev: FormActionState,
  data: FormData,
): Promise<FormActionState> {
  return run(prev, data);
}
```

`src/app/[locale]/(site)/blog/_components/NewsletterForm.tsx` (server component; rendered only as `NewsletterBand`'s children — `active={false}` returns `null` before the children are reached, so nothing of this reaches the DOM or the client graph in Phase A, B-8):

```tsx
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { makeT } from '@/content/pure';
import { Field } from '@/forms/client/Field';
import { FormShell } from '@/forms/client/FormShell';
import type { Locale } from '@/i18n/routing';
import { submitNewsletter } from '../actions';

export function NewsletterForm({ bundle, locale }: { bundle: Bundle; locale: Locale }) {
  const t = makeT(bundle);
  return (
    <FormShell
      action={submitNewsletter}
      formKey="newsletter"
      locale={locale}
      turnstileSiteKey={bundle.settings.turnstileSiteKey}
      whatsappNumber={bundle.settings.whatsappNumber}
      contact={{
        phone: bundle.settings.phone,
        phoneDisplay: bundle.settings.phoneDisplay,
        email: bundle.settings.email,
      }}
      submitLabel={t('blog.039')}
      consent="notice"
      consentLinkHref="/privacy"
      testId="newsletter-form"
      className="flex flex-col gap-2 sm:min-w-[340px]"
    >
      {/* label = sys.form.labels.email (T2, W30); the design's placeholder is blog.041 */}
      <Field
        name="email"
        type="email"
        inputMode="email"
        autoComplete="email"
        required
        placeholder={t('blog.041')}
      />
    </FormShell>
  );
}
```

`src/app/[locale]/(site)/blog/_components/RotatingWord.tsx`:

```tsx
'use client';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

const REDUCE = '(prefers-reduced-motion: reduce)';

/** B-4 / D20: the h1's rotating word. The static first word is what AT and crawlers read
 *  (`sr-only`); the visible span is `aria-hidden` and rotates only when motion is allowed,
 *  with a pause/play control (sys.marquee.pause/play). R18: the media query is a browser fact,
 *  read in an effect, so the server render and the first client render agree. */
export function RotatingWord({ words, intervalMs = 2600 }: { words: string[]; intervalMs?: number }) {
  const sys = useTranslations('sys');
  const [index, setIndex] = useState(0);
  const [motion, setMotion] = useState<'unknown' | 'allowed' | 'reduced'>('unknown');
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(REDUCE);
    const apply = () => setMotion(mq.matches ? 'reduced' : 'allowed');
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    if (motion !== 'allowed' || paused || words.length < 2) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % words.length), intervalMs);
    return () => window.clearInterval(id);
  }, [motion, paused, words.length, intervalMs]);

  const current = words[index] ?? words[0] ?? '';
  return (
    <>
      <span className="sr-only" data-testid="hero-word-static">
        {words[0]}
      </span>
      <span aria-hidden="true" data-testid="hero-word-live" className="text-sky">
        {current}
      </span>
      {motion === 'allowed' && words.length > 1 && (
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          className="ml-3 inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-pill border border-white/25 px-3 text-body-sm font-bold text-white/75 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky"
        >
          {paused ? sys('marquee.play') : sys('marquee.pause')}
        </button>
      )}
    </>
  );
}
```

`src/app/[locale]/(site)/blog/_components/HeroArt.tsx` (server; B-2/B-3 — the float card from data, the "Most read" card hidden, the languages pill as authored):

```tsx
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import type { BlogPost } from '@/content/collections';
import { makeT } from '@/content/pure';
import type { Locale } from '@/i18n/routing';
import { formatReadMinutes } from '@/lib/format/date';

/** The design's hero art (desktop only, ≤700 hidden — W10 via `hidden md:block`): one card
 *  built from the featured post (the design's blog.027/028 hard-type a title, a year and "8
 *  min read" — D17), the "Most read" card hidden until a read-count source exists (B-2), and
 *  the EN·TR pill (blog.032 as authored). Returns null with no featured post. */
export function HeroArt({
  bundle,
  locale,
  featured,
}: {
  bundle: Bundle;
  locale: Locale;
  featured: BlogPost | null;
}) {
  if (!featured) return null;
  const t = makeT(bundle);
  const title = featured.title[locale];
  if (!title) return null;
  return (
    <div aria-hidden="true" className="relative hidden min-h-[210px] md:block" data-testid="blog-hero-art">
      <div className="absolute top-2 left-[4%] w-[188px] rounded-base border border-white/10 bg-white p-4 shadow-hero-form">
        <span className="inline-block rounded-pill bg-tint px-2.5 py-0.5 text-[11px] font-extrabold text-blue-safe">
          {t(featured.categoryLabelId)}
        </span>
        <p className="mt-2 mb-2 text-body-sm leading-snug font-extrabold text-ink">{title}</p>
        <p className="m-0 text-[11.5px] font-semibold text-muted">
          {featured.author} · {formatReadMinutes(featured.readMinutes, locale)}
        </p>
      </div>
      <div className="absolute bottom-1 left-[12%] inline-flex items-center gap-2 rounded-pill border border-white/25 bg-white/10 px-3 py-1 text-[12px] font-extrabold">
        <span className="text-sky">EN</span>
        <span className="text-white/40">·</span>
        <span className="text-sky">TR</span>
        <span className="font-semibold text-white/70">{t('blog.032')}</span>
      </div>
    </div>
  );
}
```

`src/app/[locale]/(site)/blog/_components/PostList.tsx` (server; the card list the tools island enhances — every `<li>` carries the data the island filters on):

```tsx
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import type { BlogPost } from '@/content/collections';
import { makeT } from '@/content/pure';
import { PostCard } from '@/design/blocks';
import type { Locale } from '@/i18n/routing';

export const POST_LIST_ID = 'blog-grid';

/** Returns null with no posts (the featured card or the empty state stands alone). */
export function PostList({
  bundle,
  locale,
  posts,
  heading,
}: {
  bundle: Bundle;
  locale: Locale;
  posts: BlogPost[];
  heading: string;
}) {
  if (posts.length === 0) return null;
  const t = makeT(bundle);
  return (
    <>
      <h2 className="sr-only">{heading}</h2>
      <ul
        id={POST_LIST_ID}
        data-testid="blog-grid"
        className="m-0 grid list-none gap-6 p-0 md:grid-cols-2 lg:grid-cols-3"
      >
        {posts.map((post) => (
          <li
            key={post.key}
            data-post-key={post.key}
            data-category={post.category}
            data-search={`${post.title[locale] ?? ''} ${post.excerpt[locale] ?? ''} ${t(post.categoryLabelId)}`.toLowerCase()}
          >
            <PostCard bundle={bundle} locale={locale} post={post} variant="card" headingLevel={3} />
          </li>
        ))}
      </ul>
    </>
  );
}
```

`src/app/[locale]/(site)/blog/_components/PostFilterLoader.tsx` (`ssr: false` must be requested from a client module — Next 16 refuses it in a server component):

```tsx
'use client';
import dynamic from 'next/dynamic';
import type { PostFilterProps } from './PostFilter';

/** W13: the search/filter island is below the hero and only matters with ≥ 6 posts; it is
 *  loaded after hydration as its own chunk and never counts in the initial script audit. */
const PostFilter = dynamic(() => import('./PostFilter').then((m) => m.PostFilter), { ssr: false });

export function PostFilterLoader(props: PostFilterProps) {
  return <PostFilter {...props} />;
}
```

`src/app/[locale]/(site)/blog/_components/PostFilter.tsx` (B-5 — a DOM-level enhancement over `PostList`; without JS every card shows):

```tsx
'use client';
import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { BottomSheet, SearchInput } from '@/design/islands';
import { Button, RadioChips } from '@/design/primitives';
import { POST_LIST_ID } from './PostList';

export type PostFilterProps = {
  categories: { value: string; label: string }[];
  pageSize: number;
  total: number;
  labels: {
    all: string; // blog.076
    clear: string; // blog.033
    clearShort: string; // blog.089
    topic: string; // blog.086
    pickTopic: string; // blog.087
    close: string; // sys.nav.close
    loadMore: string; // blog.090
    noResults: string; // blog.035
    placeholder: string; // blog.088
  };
};

const ALL = 'all';

type Row = { el: HTMLElement; category: string; text: string };

function readRows(): Row[] {
  const list = document.getElementById(POST_LIST_ID);
  if (!list) return [];
  return Array.from(list.querySelectorAll<HTMLElement>('[data-post-key]')).map((el) => ({
    el,
    category: el.dataset.category ?? '',
    text: el.dataset.search ?? '',
  }));
}

export function PostFilter({ categories, pageSize, total, labels }: PostFilterProps) {
  const sys = useTranslations('sys');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>(ALL);
  const [limit, setLimit] = useState(pageSize);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [matched, setMatched] = useState(total);

  const options = useMemo(
    () => [{ value: ALL, label: labels.all }, ...categories],
    [categories, labels.all],
  );

  // The server-rendered <li> elements are static (no client state of their own), so toggling
  // their `hidden` attribute from here is safe: React never re-renders them client-side.
  useEffect(() => {
    const q = query.trim().toLowerCase();
    let shown = 0;
    let count = 0;
    for (const row of readRows()) {
      const hit = (category === ALL || row.category === category) && (q === '' || row.text.includes(q));
      if (hit) count += 1;
      const visible = hit && shown < limit;
      if (visible) shown += 1;
      row.el.hidden = !visible;
    }
    setMatched(count);
  }, [query, category, limit]);

  const reset = () => {
    setQuery('');
    setCategory(ALL);
    setLimit(pageSize);
  };
  const catLabel = options.find((o) => o.value === category)?.label ?? labels.all;
  const resultText =
    query.trim() !== ''
      ? sys('blog.tools.resultsFor', { n: matched, q: query.trim() })
      : category !== ALL
        ? sys('blog.tools.resultsIn', { n: matched, cat: catLabel })
        : sys('blog.tools.all', { n: total });

  return (
    <div data-testid="blog-tools" className="mb-8 flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <SearchInput
          id="blog-search"
          label={sys('blog.tools.search')}
          hideLabel
          value={query}
          onChange={(v) => {
            setQuery(v);
            setLimit(pageSize);
          }}
          placeholder={labels.placeholder}
          clearLabel={labels.clear}
          resultText={sys('blog.tools.results', { n: matched })}
          className="min-w-[240px] flex-1"
        />
        <Button variant="secondary" className="md:hidden" onClick={() => setSheetOpen(true)}>
          {labels.topic}
        </Button>
        <RadioChips
          name="category"
          legend={sys('blog.tools.category')}
          legendHidden
          options={options}
          value={category}
          onChange={(v) => {
            setCategory(v);
            setLimit(pageSize);
          }}
          className="hidden md:flex"
        />
      </div>
      <p className="m-0 flex items-center gap-3 text-body-sm text-text-secondary" aria-live="polite">
        <span>{resultText}</span>
        {(query !== '' || category !== ALL) && (
          <Button variant="ghost" onClick={reset}>
            {labels.clearShort}
          </Button>
        )}
      </p>
      {matched === 0 && (
        <p role="status" data-testid="blog-no-results" className="m-0 rounded-base border border-dashed border-border-1 p-6 text-text-secondary">
          {labels.noResults}
        </p>
      )}
      {matched > limit && (
        <div className="flex justify-center">
          <Button variant="secondary" size="lg" onClick={() => setLimit((l) => l + pageSize)}>
            {labels.loadMore}
          </Button>
        </div>
      )}
      <BottomSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title={labels.pickTopic}
        closeLabel={labels.close}
      >
        <RadioChips
          name="category-sheet"
          legend={sys('blog.tools.category')}
          legendHidden
          options={options}
          value={category}
          onChange={(v) => {
            setCategory(v);
            setLimit(pageSize);
            setSheetOpen(false);
          }}
        />
      </BottomSheet>
    </div>
  );
}
```

`src/app/[locale]/(site)/blog/page.tsx` — replace the file with the full page (the Cycle 1 skeleton grows the sections in the design's order: hero (breadcrumb, h1 + rotating word, sub, ticks, hero art, mobile stats strip) → tools + featured + grid / empty state → newsletter (hidden) → closing band):

```tsx
import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getBundle, makeT, makeTf } from '@/content/adapter';
import { getCollection } from '@/content/collections';
import { Breadcrumbs, ClosingCtaBand, EmptyState, ImageSlot, NewsletterBand, PostCard } from '@/design/blocks';
import { buttonClassName, Section } from '@/design/primitives';
import { getPathname } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { waLink } from '@/lib/contact';
import { formatInt } from '@/lib/format/money';
import { buildMetadata } from '@/lib/seo/metadata';
import { HeroArt } from './_components/HeroArt';
import { NewsletterForm } from './_components/NewsletterForm';
import { PostFilterLoader } from './_components/PostFilterLoader';
import { PostList } from './_components/PostList';
import { RotatingWord } from './_components/RotatingWord';
import { categoryOptions, splitFeatured, TOOLS_MIN_POSTS, writtenPosts } from './_lib/posts';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const bundle = await getBundle(locale);
  const sys = await getTranslations({ locale, namespace: 'sys' });
  // The blog page record has '' SEO ids (T0b) → the sys.seo.blog.* fallbacks apply (W23/W38);
  // robots 'noindex' comes from the record itself (W4).
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
  const [bundle, sys] = await Promise.all([getBundle(locale), getTranslations('sys')]);
  const t = makeT(bundle);
  const tf = makeTf(bundle, locale);
  const rows = getCollection(bundle, 'blog');
  const written = writtenPosts(rows, locale);
  const { featured, rest } = splitFeatured(written);
  const other: Locale = locale === 'tr' ? 'en' : 'tr';
  const otherIndexPath = writtenPosts(rows, other).length > 0 ? getPathname({ locale: other, href: '/blog' }) : null;
  const words = sys('blog.hero.words').split('|');
  const { whatsappNumber } = bundle.settings;

  return (
    <>
      {/* ---- Hero (design: full-bleed image-slot 'blog-hero' under two gradients; B-7) ---- */}
      <Section tone="dark" id="blog-hero" className="relative overflow-hidden">
        <ImageSlot
          slot="blog-hero"
          alt=""
          width={1440}
          height={520}
          className="absolute inset-0 h-full w-full opacity-40"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-navy via-navy/90 to-navy/75" />
        <div className="container-site relative grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <Breadcrumbs
              locale={locale}
              tone="dark"
              items={[
                { name: sys('home'), href: '/' },
                { name: t('blog.004'), href: '/blog' },
              ]}
            />
            <h1 data-testid="page-h1" data-lcp-slot="h1" className="mt-4 max-w-[760px] text-h1">
              {sys.rich('blog.hero.title', {
                pre: t('blog.095'),
                word: () => <RotatingWord words={words} />,
              })}
            </h1>
            <p className="mt-4 max-w-[620px] text-body-lg text-white/78">{t('blog.096')}</p>
            <ul className="mt-6 flex max-w-[600px] list-none flex-wrap gap-x-8 gap-y-3 p-0 text-body text-white/75">
              <li className="flex items-start gap-2">
                <span aria-hidden="true" className="mt-1 text-success">✓</span>
                <span>
                  {t('blog.023')} <strong className="text-white">{t('blog.024')}</strong>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span aria-hidden="true" className="mt-1 text-success">✓</span>
                <span>
                  <strong className="text-white">{t('blog.025')}</strong> {t('blog.026')}
                </span>
              </li>
            </ul>
            {/* Mobile stats strip (design ≤700): written count + languages; the cadence chip
                (blog.093/094) has no data row → not rendered (B-3, D17). */}
            <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-body-sm font-bold text-white/60 md:hidden">
              <span>
                <strong className="text-white">{formatInt(written.length, locale)}</strong> {t('blog.091')}
              </span>
              <span aria-hidden="true">·</span>
              <span>
                <strong className="text-sky">EN·TR</strong> {t('blog.092')}
              </span>
            </p>
          </div>
          <HeroArt bundle={bundle} locale={locale} featured={featured} />
        </div>
      </Section>

      {/* ---- Tools + featured + grid, or the W6 empty state ---- */}
      <Section tone="light" id="articles">
        <div className="container-site">
          {featured ? (
            <>
              {rest.length >= TOOLS_MIN_POSTS && (
                <PostFilterLoader
                  categories={categoryOptions(written, t)}
                  pageSize={TOOLS_MIN_POSTS}
                  total={rest.length}
                  labels={{
                    all: t('blog.076'),
                    clear: t('blog.033'),
                    clearShort: t('blog.089'),
                    topic: t('blog.086'),
                    pickTopic: t('blog.087'),
                    close: sys('nav.close'),
                    loadMore: t('blog.090'),
                    noResults: t('blog.035'),
                    placeholder: t('blog.088'),
                  }}
                />
              )}
              <div data-testid="blog-featured" className="mb-10">
                <p className="mb-3 inline-block rounded-pill bg-tint px-3 py-1 text-eyebrow font-extrabold tracking-[1.2px] text-blue-safe uppercase">
                  {t('blog.034')}
                </p>
                <PostCard bundle={bundle} locale={locale} post={featured} variant="featured" headingLevel={2} />
              </div>
              <PostList bundle={bundle} locale={locale} posts={rest} heading={sys('blog.index.latest')} />
            </>
          ) : (
            <div data-testid="blog-empty-wrap">
              <EmptyState
                testId="blog-empty"
                headingLevel={2}
                title={sys('blog.empty.title')}
                body={sys('blog.empty.body')}
              />
              {otherIndexPath && (
                <p className="mt-4">
                  {/* A plain anchor to an already-localised path: next-intl's Link would re-prefix
                      it on the EN page (see Cycle 1's note). Same-tab, same site. */}
                  <a
                    href={otherIndexPath}
                    className={buttonClassName('secondary', 'md')}
                    data-testid="blog-empty-cta"
                  >
                    {sys('blog.empty.cta')}
                  </a>
                </p>
              )}
            </div>
          )}
        </div>
      </Section>

      {/* ---- Newsletter band: hidden in Phase A (W5) — active={false} renders null ---- */}
      <Section tone="pale" id="newsletter-band">
        <div className="container-site">
          <NewsletterBand bundle={bundle} locale={locale} active={false}>
            <NewsletterForm bundle={bundle} locale={locale} />
          </NewsletterBand>
        </div>
      </Section>

      {/* ---- Closing band (blog.042–046); WhatsApp prefill = sys.whatsapp.prefill + consult ---- */}
      <Section tone="light">
        <div className="container-site">
          <ClosingCtaBand
            bundle={bundle}
            locale={locale}
            titleId="blog.042"
            bodyId="blog.043"
            primary={{ label: t('blog.046'), href: '/hire-workers' }}
            secondary={{
              label: t('home.221'),
              href: waLink(whatsappNumber, `${sys('whatsapp.prefill')}${sys('blog.whatsapp.consult')}`),
              external: true,
            }}
            ticks={[tf('blog.044'), tf('blog.045')]}
            tone="navy"
          />
        </div>
      </Section>
    </>
  );
}
```

Notes on that file: `EmptyState` has no `children` in Produces (`{ title, body?, cta?, tone?, icon?, headingLevel?, testId?, className? }`), and its `cta.href` is a string that reaches next-intl's `Link` (see Cycle 1's note), so the cross-locale link is a plain anchor rendered after it. `sys.rich('blog.hero.title', { pre, word: () => <RotatingWord/> })` renders the island inside the h1: next-intl's server translator supports `.rich` with tag functions — `{pre}` is a plain string argument and `<word></word>` is the tag the message files carry (Cycle 1). `blog.044` is legal-flagged and verbatim; `blog.045` is re-authored with `{homepageReplyHours}` (T0b), hence `tf` for the ticks (W1) — ticks render `md:hidden` inside the band (W10).

- [ ] **Step 4: Run tests + npm run verify**

`npx vitest run "src/app/\[locale\]/(site)/blog"` → green (the five Cycle 1/2 test files). `npm run verify` → green. Then a local render check (the only place `sys.rich` inside an `h1` and the `hidden` toggling can be seen): `npm run build && PORT=3100 npm run start` — `/en/blog` shows the featured card, no tools bar (1 post < 6), no newsletter band; `/blog` shows the empty state with the "İngilizce yazılara göz atın" button to `/en/blog`; the rotating word cycles and pauses. Stop the server; revert any `nextjs-agent-rules` block `npm run dev` may have appended to `CLAUDE.md` (it does not, but check).

- [ ] **Step 5: Commit**

```
feat(blog): index sections — hero art + rotating word, post list + tools island, hidden newsletter, closing band (T12 c2)

Written posts only (W4/W28): featured + grid, the search/category island mounts
from 6 posts (dynamic, ssr:false — W13), the newsletter band is active={false}
(W5) with its action and form ready, cadence/most-read claims hidden by data
(D17, B-2/B-3). Newsletter sends exactly the catalog's `email`.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
```

---

#### Cycle 3 — The Markdown block parser, the article route skeleton (`generateStaticParams`, metadata with per-locale alternates + `og:type article`, B-1 404s), `/blog/[slug]` leaves `UNBUILT`

- [ ] **Step 1: Write the failing test**

`src/app/[locale]/(site)/blog/[slug]/__tests__/markdown.test.ts`:

```ts
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { BundleSchema } from '../../../../../../../contract/website-bundle.v1';
import { getCollection } from '@/content/collections';
import { headingId, headings, parseInline, parseMarkdown } from '../_lib/markdown';

const SAMPLE = [
  'Intro paragraph with **bold** inside.',
  '> **Key takeaways**',
  '>',
  '> - First point',
  '> - Second **point**',
  '## Who can hire in Türkiye?',
  '**5 : 1 rule** — Five Turkish employees per foreign worker.',
  '**Capital** — At least 100,000 TL.',
  '- Contract',
  '- Passport',
  '## Steps',
  '1. **Offer.** Sign it.',
  '2. **File.** Submit it.',
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
    expect(parseInline('<script>x</script>')).toEqual([{ kind: 'text', text: '<script>x</script>' }]);
  });
});

describe('headingId', () => {
  it('slugifies, folds Turkish letters, never collides', () => {
    const used = new Set<string>();
    expect(headingId("Documents you'll need", used)).toBe('documents-you-ll-need');
    expect(headingId('Türkiye’de kimler yabancı işçi çalıştırabilir?', used)).toBe(
      'turkiye-de-kimler-yabanci-isci-calistirabilir',
    );
    expect(headingId("Documents you'll need", used)).toBe('documents-you-ll-need-2');
    expect(headingId('???', used)).toBe('section');
  });
});

describe('parseMarkdown (the importer grammar, W28)', () => {
  const blocks = parseMarkdown(SAMPLE);
  it('recognises every block kind in order', () => {
    expect(blocks.map((b) => b.kind)).toEqual([
      'p',
      'callout',
      'h2',
      'leads',
      'ul',
      'h2',
      'ol',
      'quote',
    ]);
  });
  it('callout = bold title line + bullet list inside a blockquote', () => {
    const c = blocks[1];
    expect(c.kind === 'callout' && c.title).toBe('Key takeaways');
    expect(c.kind === 'callout' && c.items).toHaveLength(2);
    expect(c.kind === 'callout' && c.items[1]).toEqual([
      { kind: 'text', text: 'Second ' },
      { kind: 'strong', text: 'point' },
    ]);
  });
  it('consecutive "**lead** — body" paragraphs merge into one leads block', () => {
    const l = blocks[3];
    expect(l.kind === 'leads' && l.items.map((i) => i.lead)).toEqual(['5 : 1 rule', 'Capital']);
  });
  it('numbered steps keep their bold lead as an inline', () => {
    const o = blocks[6];
    expect(o.kind === 'ol' && o.items[0][0]).toEqual({ kind: 'strong', text: 'Offer.' });
  });
  it('a lone blockquote is a quote', () => {
    const q = blocks[7];
    expect(q.kind === 'quote' && q.inlines).toEqual([{ kind: 'text', text: 'Closing quote.' }]);
  });
  it('headings() lists the h2s with their ids', () => {
    expect(headings(blocks)).toEqual([
      { id: 'who-can-hire-in-turkiye', text: 'Who can hire in Türkiye?' },
      { id: 'steps', text: 'Steps' },
    ]);
  });
  it('CRLF and stray blank lines do not change the result', () => {
    expect(parseMarkdown(SAMPLE.replace(/\n/g, '\r\n') + '\n\n\n')).toEqual(blocks);
  });
  it('unknown syntax is text, never markup', () => {
    const [p] = parseMarkdown('<img src=x onerror=alert(1)> [link](https://x)');
    expect(p.kind === 'p' && p.inlines).toEqual([
      { kind: 'text', text: '<img src=x onerror=alert(1)> [link](https://x)' },
    ]);
  });
});

describe('the committed EN body (T0b ARTICLE_BODY) parses into the design structure', () => {
  const bundle = BundleSchema.parse(
    JSON.parse(readFileSync(join(__dirname, '../../../../../../content/local/bundle.en.json'), 'utf8')),
  );
  const post = getCollection(bundle, 'blog').find((p) => p.key === 'turkey-work-permit-process-employer-guide');
  const blocks = parseMarkdown(post?.body.en ?? '');
  it('intro, takeaways, four H2 sections, two leads, three lists, five steps, one quote', () => {
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
    expect(headings(blocks)).toHaveLength(4);
    const ol = blocks[9];
    expect(ol.kind === 'ol' && ol.items).toHaveLength(5);
    const callout = blocks[1];
    expect(callout.kind === 'callout' && callout.items).toHaveLength(4);
  });
  it('the body carries no {placeholder} the page would have to fill (W28 fill is defensive)', () => {
    expect(post?.body.en).not.toMatch(/\{[A-Za-z][A-Za-z0-9]*\}/);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

`npx vitest run "src/app/\[locale\]/(site)/blog/\[slug\]"` → `Cannot find module '../_lib/markdown'`. `npx vitest run src/lib/seo/unbuilt.test.ts` → green now; RED once `[slug]/page.tsx` exists while `'/blog/[slug]'` is still in the set — Step 3 does both.

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/blog/[slug]/_lib/markdown.ts` (B-12 — pure, no React, no DOM):

```ts
/**
 * The v1 blog body grammar (docs/CONTENT-MODEL.md § Blog): what the importer writes today
 * (T0b `renderBody`) and what the Phase B CMS editor may write. Blocks are separated by blank
 * lines; inside a block only `**bold**` is markup. Everything else is text — there is no HTML
 * pass-through, so nothing needs sanitising: the renderer emits React nodes, never a string.
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
const LEAD = /^\*\*(.+?)\*\*\s+—\s+(.+)$/s;
const UL = /^-\s+/;
const OL = /^\d+\.\s+/;
const CALLOUT_TITLE = /^\*\*(.+)\*\*$/;

export function parseInline(text: string): Inline[] {
  const out: Inline[] = [];
  let last = 0;
  for (const m of text.matchAll(STRONG)) {
    const i = m.index ?? 0;
    if (i > last) out.push({ kind: 'text', text: text.slice(last, i) });
    out.push({ kind: 'strong', text: m[1] });
    last = i + m[0].length;
  }
  if (last < text.length || out.length === 0) out.push({ kind: 'text', text: text.slice(last) });
  return out;
}

/** Deterministic, ASCII-only heading ids (the TOC anchors); Turkish letters fold to ASCII so
 *  TR and EN articles produce the same id shape. Collisions get a numeric suffix. */
export function headingId(text: string, used: Set<string>): string {
  const base =
    text
      .toLowerCase()
      .replace(/ı/g, 'i')
      .normalize('NFKD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'section';
  let id = base;
  let n = 2;
  while (used.has(id)) id = `${base}-${n++}`;
  used.add(id);
  return id;
}

function parseQuote(lines: string[]): Block {
  const inner = lines.map((l) => l.replace(/^>\s?/, ''));
  const groups: string[][] = [[]];
  for (const l of inner) {
    if (l.trim() === '') {
      if (groups[groups.length - 1].length > 0) groups.push([]);
    } else groups[groups.length - 1].push(l);
  }
  const parts = groups.filter((g) => g.length > 0);
  if (parts.length >= 2) {
    const title = CALLOUT_TITLE.exec(parts[0].join(' ').trim());
    if (title && parts[1].every((l) => UL.test(l)))
      return {
        kind: 'callout',
        title: title[1],
        items: parts[1].map((l) => parseInline(l.replace(UL, ''))),
      };
  }
  return { kind: 'quote', inlines: parseInline(parts.map((g) => g.join(' ')).join(' ')) };
}

export function parseMarkdown(md: string): Block[] {
  const used = new Set<string>();
  const blocks: Block[] = [];
  const chunks = md
    .replace(/\r\n/g, '\n')
    .split(/\n[ \t]*\n+/)
    .map((c) => c.trim())
    .filter((c) => c.length > 0);
  for (const chunk of chunks) {
    const lines = chunk.split('\n').map((l) => l.trim());
    if (lines.length === 1 && lines[0].startsWith('## ')) {
      const text = lines[0].slice(3).trim();
      blocks.push({ kind: 'h2', id: headingId(text, used), text });
      continue;
    }
    if (lines.every((l) => l.startsWith('>'))) {
      blocks.push(parseQuote(lines));
      continue;
    }
    if (lines.every((l) => UL.test(l))) {
      blocks.push({ kind: 'ul', items: lines.map((l) => parseInline(l.replace(UL, ''))) });
      continue;
    }
    if (lines.every((l) => OL.test(l))) {
      blocks.push({ kind: 'ol', items: lines.map((l) => parseInline(l.replace(OL, ''))) });
      continue;
    }
    const joined = lines.join(' ');
    const lead = LEAD.exec(joined);
    if (lead) {
      const item = { lead: lead[1], body: parseInline(lead[2]) };
      const prev = blocks[blocks.length - 1];
      if (prev?.kind === 'leads') prev.items.push(item);
      else blocks.push({ kind: 'leads', items: [item] });
      continue;
    }
    blocks.push({ kind: 'p', inlines: parseInline(joined) });
  }
  return blocks;
}

export function headings(blocks: readonly Block[]): Heading[] {
  return blocks.flatMap((b) => (b.kind === 'h2' ? [{ id: b.id, text: b.text }] : []));
}
```

`src/app/[locale]/(site)/blog/[slug]/page.tsx` (skeleton: params, static params, metadata, the B-1 rules, hero + body; the remaining sections come in Cycle 4):

```tsx
import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { fill, getBundle, makeT, metricValues } from '@/content/adapter';
import { getCollection } from '@/content/collections';
import { Breadcrumbs, ImageSlot } from '@/design/blocks';
import { Section } from '@/design/primitives';
import { routing, type Locale } from '@/i18n/routing';
import { formatDate, formatReadMinutes } from '@/lib/format/date';
import { JsonLd } from '@/lib/seo/JsonLdScript';
import { articleJsonLd } from '@/lib/seo/jsonld';
import { buildMetadata, type AlternateTarget } from '@/lib/seo/metadata';
import { absoluteUrl, pageOgImageUrl } from '@/lib/seo/routes';
import { findWritten, writtenPosts } from '../_lib/posts';
import { ArticleBody } from './_components/ArticleBody';
import { parseMarkdown } from './_lib/markdown';

type Params = { locale: string; slug: string };

/** Only the slugs with a body in that locale are prerendered (1 EN, 0 TR today). Other slugs
 *  still render on demand (`dynamicParams` default true — an Ops-published post under ISR needs
 *  no redeploy) and answer 404 through `findWritten` (B-1). */
export async function generateStaticParams({ params }: { params: { locale: string } }) {
  const { locale } = params;
  if (!hasLocale(routing.locales, locale)) return [];
  const bundle = await getBundle(locale);
  return writtenPosts(getCollection(bundle, 'blog'), locale).flatMap((p) => {
    const slug = p.slug[locale];
    return slug ? [{ slug }] : [];
  });
}

const otherLocale = (locale: Locale): Locale => (locale === 'tr' ? 'en' : 'tr');

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const bundle = await getBundle(locale);
  const post = findWritten(getCollection(bundle, 'blog'), locale, slug);
  if (!post) notFound();
  const sys = await getTranslations({ locale, namespace: 'sys' });
  const title = post.title[locale] ?? '';
  // hreflang only for a locale that has a body: the other locale's slug would 404 (page note).
  // buildMetadata adds the page's own locale and x-default itself.
  const other = otherLocale(locale);
  const otherSlug = post.hasBody[other] ? post.slug[other] : null;
  const alternates: Partial<Record<Locale, AlternateTarget>> = {};
  if (otherSlug) alternates[other] = { pathname: '/blog/[slug]', params: { slug: otherSlug } };
  return buildMetadata({
    locale,
    href: { pathname: '/blog/[slug]', params: { slug } },
    bundle,
    pageKey: 'blogArticle',
    fallbackTitle: sys('seo.blogArticle.title', { title }),
    fallbackDescription: post.excerpt[locale] ?? title,
    alternates,
    openGraph: { type: 'article', publishedTime: post.publishedAt, authors: [post.author] },
  });
}

export default async function BlogArticle({ params }: { params: Promise<Params> }) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const [bundle, sys] = await Promise.all([getBundle(locale), getTranslations('sys')]);
  const rows = getCollection(bundle, 'blog');
  const post = findWritten(rows, locale, slug);
  if (!post) notFound();
  const t = makeT(bundle);
  const title = post.title[locale] ?? '';
  const excerpt = post.excerpt[locale] ?? '';
  // W28: the body is Markdown; `fill` is defensive (the committed body carries no placeholder).
  const blocks = parseMarkdown(fill(post.body[locale] ?? '', metricValues(bundle, locale)));
  const href = { pathname: '/blog/[slug]', params: { slug } } as const;
  const url = absoluteUrl(locale, href);
  const byline = `${formatDate(post.publishedAt, locale)} · ${formatReadMinutes(post.readMinutes, locale)}`;

  return (
    <article>
      <JsonLd
        data={articleJsonLd({
          headline: title,
          description: excerpt,
          url,
          image: pageOgImageUrl(locale, 'blogArticle'),
          datePublished: post.publishedAt,
          authorName: post.author,
          authorType: 'Organization',
          publisherSettings: bundle.settings,
          locale,
        })}
      />
      <Section tone="dark" id="article-hero" className="relative overflow-hidden pb-40">
        <div className="container-site relative mx-auto max-w-[980px]">
          <Breadcrumbs
            locale={locale}
            tone="dark"
            items={[
              { name: sys('home'), href: '/' },
              { name: t('blog.004'), href: '/blog' },
              { name: title, href },
            ]}
          />
          <h1 data-testid="page-h1" data-lcp-slot="h1" className="mt-4 max-w-[880px] text-h1">
            {title}
          </h1>
          <p className="mt-4 max-w-[780px] text-body-lg text-white/78">{excerpt}</p>
          <p className="mt-6 text-body-sm text-white/60">
            <strong className="block text-body font-extrabold text-white">{t('blogarticle.023')}</strong>
            {byline}
          </p>
        </div>
      </Section>
      {/* Cover slot, overlapping the hero (design −150 px → −112 px at 0.75, D19); a named
          placeholder until photography lands, never the LCP slot (B-7/D26). */}
      <div className="container-site relative z-[2] -mt-28">
        <div className="mx-auto max-w-[980px]">
          <ImageSlot
            slot={`cover-${post.key}`}
            alt=""
            width={980}
            height={430}
            className="h-[190px] w-full rounded-lg md:h-[322px]"
          />
        </div>
      </div>
      <Section tone="light">
        <div className="container-site mx-auto max-w-[980px]">
          <div data-testid="article-body">
            <ArticleBody blocks={blocks} />
          </div>
        </div>
      </Section>
    </article>
  );
}
```

`src/app/[locale]/(site)/blog/[slug]/_components/ArticleBody.tsx` (server component; the block → React renderer):

```tsx
import { Fragment } from 'react';
import type { Block, Inline } from '../_lib/markdown';

function Inlines({ inlines }: { inlines: Inline[] }) {
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

/** Renders the parsed body in the design's article typography: intro paragraphs, the
 *  Key-takeaways box, H2 sections (with ids for the TOC), the 2-up "rule" cards, the checklist
 *  grid, the numbered steps rail, the warning list and the closing quote. No HTML strings. */
export function ArticleBody({ blocks }: { blocks: Block[] }) {
  return (
    <div className="text-body-lg leading-relaxed text-text-secondary">
      {blocks.map((b, i) => {
        switch (b.kind) {
          case 'p':
            return (
              <p key={i} className="mb-5">
                <Inlines inlines={b.inlines} />
              </p>
            );
          case 'h2':
            return (
              <h2 key={i} id={b.id} className="mt-10 mb-4 scroll-mt-24 text-h2 text-ink">
                {b.text}
              </h2>
            );
          case 'callout':
            return (
              <aside
                key={i}
                data-testid="article-takeaways"
                className="mb-8 rounded-lg border border-tint-border bg-pale-1 p-6"
              >
                <p className="mb-3 text-eyebrow font-extrabold tracking-[1.2px] text-blue-safe uppercase">
                  {b.title}
                </p>
                <ul className="m-0 list-none space-y-2 p-0">
                  {b.items.map((item, j) => (
                    <li key={j} className="flex gap-2">
                      <span aria-hidden="true" className="text-success">
                        ✓
                      </span>
                      <span>
                        <Inlines inlines={item} />
                      </span>
                    </li>
                  ))}
                </ul>
              </aside>
            );
          case 'leads':
            return (
              <div key={i} className="mb-6 grid gap-4 md:grid-cols-2">
                {b.items.map((item, j) => (
                  <div key={j} className="rounded-base border border-tint-border bg-tint p-5">
                    <p className="mb-1 font-extrabold text-ink">{item.lead}</p>
                    <p className="m-0 text-body">
                      <Inlines inlines={item.body} />
                    </p>
                  </div>
                ))}
              </div>
            );
          case 'ul':
            return (
              <ul key={i} className="mb-6 grid list-none gap-2 p-0 sm:grid-cols-2">
                {b.items.map((item, j) => (
                  <li key={j} className="flex gap-2 rounded-base border border-border-1 bg-pale-1 px-4 py-3 text-body">
                    <span aria-hidden="true" className="text-blue-safe">
                      •
                    </span>
                    <span>
                      <Inlines inlines={item} />
                    </span>
                  </li>
                ))}
              </ul>
            );
          case 'ol':
            return (
              <ol key={i} className="mb-6 list-none space-y-4 p-0">
                {b.items.map((item, j) => (
                  <li key={j} className="flex gap-4">
                    <span
                      aria-hidden="true"
                      className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-blue-safe text-body-sm font-extrabold text-white"
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
              <blockquote key={i} className="my-8 rounded-lg bg-navy p-6 text-body-lg text-white">
                <Inlines inlines={b.inlines} />
              </blockquote>
            );
        }
      })}
    </div>
  );
}
```

`src/lib/seo/routes.ts` — **delete the line** `  '/blog/[slug]',` from the `UNBUILT_PATHNAMES` literal. Nothing else changes.

`e2e/routes.ts` — append to `GATE_ROUTE_TABLE`, after the two Cycle 1 rows:

```ts
  { path: '/en/blog/turkey-work-permit-process-employer-guide', indexable: false },
```

- [ ] **Step 4: Run tests + npm run verify**

`npx vitest run "src/app/\[locale\]/(site)/blog" src/lib/seo/unbuilt.test.ts src/lib/seo/routes.test.ts` → green. `npm run verify` → green (`tsc` proves the `alternates` object form and `openGraph.type` match Task 4's `buildMetadata` signature, and `articleJsonLd`'s input shape). `npm run build` → the build log lists `/en/blog/turkey-work-permit-process-employer-guide` as a prerendered path and no TR article path.

- [ ] **Step 5: Commit**

```
feat(blog): article route — Markdown block parser/renderer, static params, article metadata, index-only slugs 404 (T12 c3)

Hand-written block grammar (paragraphs, ## headings, **bold**, lists, steps,
lead cards, callouts, quotes) → React nodes, no HTML strings (B-12). hreflang
only for locales with a body, og:type article, BlogPosting JSON-LD. A slug
without a body in the locale answers 404 (B-1). /blog/[slug] leaves UNBUILT.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
```

---

#### Cycle 4 — Article sections: pills + language note, mobile TOC, sidebar (scroll-spy TOC, share row, CTA card), quote CTA, FAQ block, author box, related + prev/next, sticky bar, newsletter (hidden), closing band, progress/back-to-top island

- [ ] **Step 1: Write the failing test**

`src/app/[locale]/(site)/blog/[slug]/__tests__/ArticleBody.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ArticleBody } from '../_components/ArticleBody';
import { ArticleToc } from '../_components/ArticleToc';
import { parseMarkdown } from '../_lib/markdown';
import { renderWithIntl } from '@/test/render';

const MD = [
  'Intro **bold**.',
  '> **Takeaways**',
  '>',
  '> - One',
  '## First section',
  '- a',
  '- b',
  '## Second section',
  '1. **Step.** Do it.',
  '> Quote.',
].join('\n\n');

describe('ArticleBody', () => {
  it('renders headings with their TOC ids, the takeaways box, lists, steps and the quote', () => {
    render(<ArticleBody blocks={parseMarkdown(MD)} />);
    const h2s = screen.getAllByRole('heading', { level: 2 });
    expect(h2s.map((h) => h.id)).toEqual(['first-section', 'second-section']);
    expect(screen.getByTestId('article-takeaways')).toHaveTextContent('Takeaways');
    expect(screen.getAllByRole('listitem')).toHaveLength(4); // 1 takeaway + 2 bullets + 1 step
    expect(screen.getByText('Step.').tagName).toBe('STRONG');
    expect(screen.getByText('Quote.').closest('blockquote')).not.toBeNull();
  });
  it('never turns body text into markup', () => {
    const { container } = render(<ArticleBody blocks={parseMarkdown('<b>x</b>')} />);
    expect(container.querySelector('b')).toBeNull();
    expect(container.textContent).toContain('<b>x</b>');
  });
});

describe('ArticleToc (the client wrapper around ScrollSpyToc)', () => {
  it('renders one link per heading and composes the remaining-time label from the package fragments', () => {
    renderWithIntl(
      <ArticleToc
        headings={[
          { id: 'a', text: 'A' },
          { id: 'faq', text: 'FAQ' },
        ]}
        label="In this article"
        heading="In this article"
        readMinutes={8}
        almostDone="Almost done"
        minLeft="min left"
      />,
      { locale: 'en' },
    );
    const nav = screen.getByRole('navigation', { name: 'In this article' });
    expect(nav.querySelectorAll('a[href="#a"], a[href="#faq"]')).toHaveLength(2);
    // At scroll 0 (jsdom) the whole read time is left.
    expect(nav).toHaveTextContent(/8 min left/);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

`npx vitest run "src/app/\[locale\]/(site)/blog/\[slug\]"` → `Cannot find module '../_components/ArticleToc'` (the `ArticleBody` cases pass already).

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/blog/[slug]/_components/ArticleToc.tsx` (client — server-rendered; the TOC is a nav landmark that must exist without JS, so it is **not** behind `ssr: false`; `remainingLabel` is a function and cannot cross the server→client boundary, hence this wrapper):

```tsx
'use client';
import { ScrollSpyToc, type TocHeading } from '@/design/islands';

export function ArticleToc({
  headings,
  label,
  heading,
  readMinutes,
  almostDone,
  minLeft,
  className,
}: {
  headings: TocHeading[];
  label: string;
  heading?: string;
  readMinutes: number;
  almostDone: string; // blogarticle.140
  minLeft: string; // blogarticle.141 — the package splits "≈ N min left" into number + fragment
  className?: string;
}) {
  return (
    <ScrollSpyToc
      headings={headings}
      label={label}
      heading={heading}
      readMinutes={readMinutes}
      remainingLabel={(minutesLeft) => {
        const n = Math.ceil(minutesLeft);
        return n <= 0 ? almostDone : `≈ ${n} ${minLeft}`;
      }}
      className={className}
    />
  );
}
```

`src/app/[locale]/(site)/blog/[slug]/_components/ArticleEnhancements.tsx` (client; pure enhancements with zero layout impact — the fixed 3 px reading bar and the mobile back-to-top button):

```tsx
'use client';
import { ProgressBar, useScrollProgress } from '@/design/islands';

export function ArticleEnhancements({
  progressLabel,
  backToTopLabel,
}: {
  progressLabel: string; // sys.blog.article.progress
  backToTopLabel: string; // sys.blog.article.backToTop
}) {
  const progress = useScrollProgress();
  const pct = Math.round(progress * 100);
  const toTop = () =>
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[45] h-[3px]" data-testid="article-progress">
        <ProgressBar value={pct} max={100} label={progressLabel} valueText={`${pct}%`} tone="blue" className="h-[3px]" />
      </div>
      {progress > 0.12 && (
        <button
          type="button"
          onClick={toTop}
          aria-label={backToTopLabel}
          className="fixed right-[14px] bottom-[88px] z-[39] flex h-11 w-11 items-center justify-center rounded-full border border-border-1 bg-white text-ink shadow-social focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe md:hidden"
        >
          <span aria-hidden="true">↑</span>
        </button>
      )}
    </>
  );
}
```

`src/app/[locale]/(site)/blog/[slug]/_components/ArticleEnhancementsLoader.tsx`:

```tsx
'use client';
import dynamic from 'next/dynamic';

/** W13: loaded after hydration as its own chunk (`ssr: false`); it renders only fixed
 *  elements, so there is nothing to server-render and no layout to shift. */
const ArticleEnhancements = dynamic(
  () => import('./ArticleEnhancements').then((m) => m.ArticleEnhancements),
  { ssr: false },
);

export function ArticleEnhancementsLoader(props: { progressLabel: string; backToTopLabel: string }) {
  return <ArticleEnhancements {...props} />;
}
```

`src/app/[locale]/(site)/blog/[slug]/_components/RelatedPosts.tsx` (server; B-2 — returns `null` when hidden):

```tsx
import type { Bundle } from '../../../../../../../contract/website-bundle.v1';
import type { BlogPost } from '@/content/collections';
import { makeT } from '@/content/pure';
import { PostCard } from '@/design/blocks';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';

export function RelatedPosts({
  bundle,
  locale,
  related,
  prev,
  next,
}: {
  bundle: Bundle;
  locale: Locale;
  related: BlogPost[];
  prev: BlogPost | null;
  next: BlogPost | null;
}) {
  if (related.length === 0 && !prev && !next) return null;
  const t = makeT(bundle);
  const card = (post: BlogPost, labelId: string, testId: string) => {
    const slug = post.slug[locale];
    const title = post.title[locale];
    if (!slug || !title) return null;
    return (
      <Link
        href={{ pathname: '/blog/[slug]', params: { slug } }}
        data-testid={testId}
        className="flex flex-col gap-1 rounded-base border border-border-4 bg-white px-6 py-5 no-underline hover:border-blue"
      >
        <span className="text-eyebrow font-extrabold tracking-[1px] text-muted uppercase">{t(labelId)}</span>
        <span className="font-extrabold text-ink">{title}</span>
      </Link>
    );
  };
  return (
    <div className="container-site" data-testid="article-related">
      {related.length > 0 && (
        <>
          <h2 className="mb-5 text-h2">{t('blogarticle.081')}</h2>
          {/* W10: the design hides the third card ≤700 px — CSS, not conditional rendering */}
          <ul className="m-0 grid list-none gap-6 p-0 md:grid-cols-3 [&>li:nth-child(3)]:hidden md:[&>li:nth-child(3)]:block">
            {related.map((post) => (
              <li key={post.key}>
                <PostCard bundle={bundle} locale={locale} post={post} variant="card" headingLevel={3} />
              </li>
            ))}
          </ul>
        </>
      )}
      {(prev || next) && (
        <nav aria-label={t('blogarticle.081')} className="mt-6 grid gap-5 md:grid-cols-2" data-testid="article-prevnext">
          {prev ? card(prev, 'blogarticle.082', 'article-prev') : <span />}
          {next ? card(next, 'blogarticle.083', 'article-next') : <span />}
        </nav>
      )}
    </div>
  );
}
```

`src/app/[locale]/(site)/blog/[slug]/page.tsx` — replace the file with the full page. Sections in the design's order: hero (breadcrumb, pills, h1, excerpt, author + byline) → cover → body + sidebar (mobile TOC `<details>`, body, quote CTA, FAQ, author box | sticky sidebar: TOC, share, CTA card) → related + prev/next → sticky bottom bar → newsletter (hidden) → closing band; the progress/back-to-top island last:

```tsx
import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { fill, getBundle, makeT, makeTf, metricValues } from '@/content/adapter';
import { blogNavVisible, getCollection, getRateConfig } from '@/content/collections';
import {
  Breadcrumbs,
  ClosingCtaBand,
  ContactCta,
  FaqBlock,
  ImageSlot,
  NewsletterBand,
  type FaqItem,
} from '@/design/blocks';
import { StickyCtaBar } from '@/design/chrome/StickyCtaBar';
import { ShareRow } from '@/design/islands';
import { buttonClassName, Section } from '@/design/primitives';
import { Link } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { waLink } from '@/lib/contact';
import { formatDate, formatReadMinutes } from '@/lib/format/date';
import { formatInt } from '@/lib/format/money';
import { JsonLd } from '@/lib/seo/JsonLdScript';
import { articleJsonLd } from '@/lib/seo/jsonld';
import { buildMetadata, type AlternateTarget } from '@/lib/seo/metadata';
import { absoluteUrl, pageOgImageUrl } from '@/lib/seo/routes';
import { NewsletterForm } from '../_components/NewsletterForm';
import { findWritten, prevNext, relatedPosts, writtenPosts } from '../_lib/posts';
import { ArticleBody } from './_components/ArticleBody';
import { ArticleEnhancementsLoader } from './_components/ArticleEnhancementsLoader';
import { ArticleToc } from './_components/ArticleToc';
import { RelatedPosts } from './_components/RelatedPosts';
import { headings, parseMarkdown } from './_lib/markdown';

type Params = { locale: string; slug: string };

/** Only the slugs with a body in that locale are prerendered (1 EN, 0 TR today). Other slugs
 *  still render on demand (`dynamicParams` default true — an Ops-published post under ISR needs
 *  no redeploy) and answer 404 through `findWritten` (B-1). */
export async function generateStaticParams({ params }: { params: { locale: string } }) {
  const { locale } = params;
  if (!hasLocale(routing.locales, locale)) return [];
  const bundle = await getBundle(locale);
  return writtenPosts(getCollection(bundle, 'blog'), locale).flatMap((p) => {
    const slug = p.slug[locale];
    return slug ? [{ slug }] : [];
  });
}

const otherLocale = (locale: Locale): Locale => (locale === 'tr' ? 'en' : 'tr');

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const bundle = await getBundle(locale);
  const post = findWritten(getCollection(bundle, 'blog'), locale, slug);
  if (!post) notFound();
  const sys = await getTranslations({ locale, namespace: 'sys' });
  const title = post.title[locale] ?? '';
  // hreflang only for a locale that has a body: the other locale's slug would 404 (page note).
  // buildMetadata adds the page's own locale and x-default itself.
  const other = otherLocale(locale);
  const otherSlug = post.hasBody[other] ? post.slug[other] : null;
  const alternates: Partial<Record<Locale, AlternateTarget>> = {};
  if (otherSlug) alternates[other] = { pathname: '/blog/[slug]', params: { slug: otherSlug } };
  return buildMetadata({
    locale,
    href: { pathname: '/blog/[slug]', params: { slug } },
    bundle,
    pageKey: 'blogArticle',
    fallbackTitle: sys('seo.blogArticle.title', { title }),
    fallbackDescription: post.excerpt[locale] ?? title,
    alternates,
    openGraph: { type: 'article', publishedTime: post.publishedAt, authors: [post.author] },
  });
}

const HIRE_FORM = { pathname: '/hire-workers', hash: '#request-form' } as const;

export default async function BlogArticle({ params }: { params: Promise<Params> }) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const [bundle, sys] = await Promise.all([getBundle(locale), getTranslations('sys')]);
  const rows = getCollection(bundle, 'blog');
  const post = findWritten(rows, locale, slug);
  if (!post) notFound();
  const t = makeT(bundle);
  const tf = makeTf(bundle, locale);
  const values = metricValues(bundle, locale);
  const title = post.title[locale] ?? '';
  const excerpt = post.excerpt[locale] ?? '';
  // W28: the body is Markdown; `fill` is defensive (the committed body carries no placeholder).
  const blocks = parseMarkdown(fill(post.body[locale] ?? '', values));
  // The design's TOC lists the four body sections + the FAQ ("5 sections").
  const toc = [...headings(blocks), { id: 'faq', text: t('blogarticle.065') }];
  const other = otherLocale(locale);
  const hasOther = post.hasBody[other] && post.slug[other] !== null;
  const written = writtenPosts(rows, locale);
  // W4: related/prev-next blocks stay hidden below the blog threshold (B-2).
  const neighbours = blogNavVisible(bundle);
  const related = neighbours ? relatedPosts(written, post) : [];
  const { prev, next } = neighbours ? prevNext(written, post) : { prev: null, next: null };
  const href = { pathname: '/blog/[slug]', params: { slug } } as const;
  const url = absoluteUrl(locale, href);
  const { settings } = bundle;
  const wa = (tail: string) => waLink(settings.whatsappNumber, `${sys('whatsapp.prefill')}${tail}`);
  const byline = `${formatDate(post.publishedAt, locale)} · ${formatReadMinutes(post.readMinutes, locale)}`;
  // B-10: A1 and Q3 have no package id; their numbers come from the metrics / rate config.
  const faq: FaqItem[] = [
    { id: 'q1', q: t('blogarticle.127'), a: sys('blog.faq.a1', { weeks: values.firstDayWeeks }) },
    { id: 'q2', q: t('blogarticle.128'), a: t('blogarticle.129') },
    {
      id: 'q3',
      q: sys('blog.faq.q3', { ratio: formatInt(getRateConfig(bundle).quotaRatio, locale) }),
      a: t('blogarticle.130'),
    },
    { id: 'q4', q: t('blogarticle.131'), a: t('blogarticle.132') },
  ];
  const shareLabels = {
    heading: `${t('blogarticle.069')} ${t('blogarticle.070')}`, // the package splits "Share this article"
    share: t('blogarticle.069'),
    whatsapp: t('blogarticle.074'),
    linkedin: t('blogarticle.075'),
    x: t('blogarticle.076'),
    copy: t('blogarticle.145'),
    copied: t('blogarticle.144'),
  };

  return (
    <article>
      <JsonLd
        data={articleJsonLd({
          headline: title,
          description: excerpt,
          url,
          image: pageOgImageUrl(locale, 'blogArticle'),
          datePublished: post.publishedAt,
          authorName: post.author,
          authorType: 'Organization',
          publisherSettings: settings,
          locale,
        })}
      />

      {/* ---- Hero ---- */}
      <Section tone="dark" id="article-hero" className="relative overflow-hidden pb-40">
        <div className="container-site relative mx-auto max-w-[980px]">
          <Breadcrumbs
            locale={locale}
            tone="dark"
            items={[
              { name: sys('home'), href: '/' },
              { name: t('blog.004'), href: '/blog' },
              { name: title, href },
            ]}
          />
          <p className="mt-4 flex flex-wrap gap-2 text-[12.5px] font-extrabold">
            <span className="rounded-pill border border-sky/45 bg-blue/20 px-3 py-1 text-sky">
              {t(post.categoryLabelId)}
            </span>
            {hasOther && (
              <span className="rounded-pill border border-white/20 bg-white/10 px-3 py-1 font-bold text-white/75" data-testid="article-lang-note">
                {locale === 'tr' ? t('blogarticle.143') : sys('blog.article.langNote')}
              </span>
            )}
          </p>
          <h1 data-testid="page-h1" data-lcp-slot="h1" className="mt-4 max-w-[880px] text-h1">
            {title}
          </h1>
          <p className="mt-4 max-w-[780px] text-body-lg text-white/78">{excerpt}</p>
          <p className="mt-6 flex items-center gap-3 text-body-sm text-white/60">
            <span aria-hidden="true" className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-blue-safe font-extrabold text-white">
              JA
            </span>
            <span>
              <strong className="block text-body font-extrabold text-white">{t('blogarticle.023')}</strong>
              {byline}
            </span>
          </p>
        </div>
      </Section>

      {/* ---- Cover (placeholder, never the LCP slot — B-7/D26) ---- */}
      <div className="container-site relative z-[2] -mt-28">
        <div className="mx-auto max-w-[980px]">
          <ImageSlot slot={`cover-${post.key}`} alt="" width={980} height={430} className="h-[190px] w-full rounded-lg md:h-[322px]" />
        </div>
      </div>

      {/* ---- Body + sidebar ---- */}
      <Section tone="light" id="article">
        <div className="container-site grid items-start gap-14 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0">
            {/* Mobile TOC (design: accordion above the body, ≤700) — a native <details> (D20) */}
            <details className="mb-5 rounded-base border border-border-1 bg-white lg:hidden" data-testid="article-toc-mobile">
              <summary className="flex min-h-[54px] cursor-pointer list-none items-center justify-between gap-3 px-4 font-extrabold text-ink">
                <span>
                  {t('blogarticle.024')}
                  <span className="block text-[12px] font-bold text-muted">
                    {sys('blog.article.sections', { n: toc.length })}
                  </span>
                </span>
                <span aria-hidden="true" className="text-blue-safe">
                  +
                </span>
              </summary>
              <ul className="m-0 list-none px-3 pb-3">
                {toc.map((h) => (
                  <li key={h.id} className="border-t border-border-3">
                    <a href={`#${h.id}`} className="flex min-h-[46px] items-center px-2 font-bold text-text-secondary no-underline">
                      {h.text}
                    </a>
                  </li>
                ))}
              </ul>
            </details>

            <div data-testid="article-body" className="print-isolate">
              <ArticleBody blocks={blocks} />
            </div>

            {/* B-11: the closing quote's CTA — WhatsApp, page_cta (whatsapp_click via ContactCta) */}
            <p className="-mt-4 mb-10">
              <ContactCta placement="page_cta" href={wa(sys('blog.whatsapp.permit'))} external variant="primary" size="lg">
                {t('blogarticle.064')}
              </ContactCta>
            </p>

            <FaqBlock bundle={bundle} locale={locale} items={faq} id="faq" headingId="blogarticle.065" />

            {/* Author box (blogarticle.066–068; 068 is legal-flagged, verbatim) */}
            <aside data-testid="article-author" className="mt-10 flex flex-wrap items-center gap-4 rounded-lg border border-border-1 bg-pale-1 p-6">
              <span aria-hidden="true" className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-blue-safe font-extrabold text-white">
                JA
              </span>
              <div className="min-w-0 flex-1">
                <p className="m-0 font-extrabold text-ink">{t('blogarticle.066')}</p>
                <p className="m-0 text-body-sm text-text-secondary">{t('blogarticle.067')}</p>
              </div>
              <span className="rounded-pill border border-success-border bg-success-surface px-3 py-1 text-[12px] font-extrabold text-success-text">
                {t('blogarticle.068')}
              </span>
            </aside>
          </div>

          {/* Desktop sidebar (design: sticky, hidden ≤700 — W10 via lg:block) */}
          <aside className="hidden lg:sticky lg:top-6 lg:flex lg:flex-col lg:gap-4" data-testid="article-sidebar">
            <div className="rounded-base border border-border-1 bg-white p-5">
              <ArticleToc
                headings={toc}
                label={t('blogarticle.024')}
                heading={t('blogarticle.024')}
                readMinutes={post.readMinutes}
                almostDone={t('blogarticle.140')}
                minLeft={t('blogarticle.141')}
              />
            </div>
            <div className="rounded-base border border-border-1 bg-white p-5" data-testid="article-share">
              <ShareRow url={url} title={title} labels={shareLabels} />
            </div>
            <div className="rounded-base bg-gradient-to-br from-blue to-blue-safe p-6 text-white">
              <p className="m-0 mb-1 text-card-title font-extrabold">{t('blogarticle.071')}</p>
              <p className="mb-4 text-body-sm text-white/88">{t('blogarticle.072')}</p>
              {/* B-6: a typed hash deep link through next-intl's Link (localises to /isci-talebi#request-form) */}
              <Link href={HIRE_FORM} className={buttonClassName('secondary', 'md', 'w-full')}>
                {t('blogarticle.073')}
              </Link>
            </div>
          </aside>
        </div>
      </Section>

      {/* ---- Related + prev/next (null below the W4 threshold, B-2) ---- */}
      <RelatedPosts bundle={bundle} locale={locale} related={related} prev={prev} next={next} />

      {/* ---- Sticky bottom bar (design: after 700 px, hidden ≤700; hides near the closing band) ---- */}
      <StickyCtaBar
        message={t('blogarticle.084')}
        showAfterPx={700}
        hideNearId="closing"
        ctas={[
          { label: t('blogarticle.085'), href: wa(sys('blog.whatsapp.article')), external: true, variant: 'secondary' },
          // B-6: a string href cannot carry the #request-form hash through Button's typed Link
          { label: t('blogarticle.073'), href: '/hire-workers', variant: 'primary' },
        ]}
      />

      {/* ---- Newsletter band: hidden in Phase A (W5) — active={false} renders null ---- */}
      <Section tone="pale" id="newsletter-band">
        <div className="container-site">
          <NewsletterBand bundle={bundle} locale={locale} active={false}>
            <NewsletterForm bundle={bundle} locale={locale} />
          </NewsletterBand>
        </div>
      </Section>

      {/* ---- Closing band (blogarticle.092–095) ---- */}
      <Section tone="light">
        <div className="container-site">
          <ClosingCtaBand
            bundle={bundle}
            locale={locale}
            id="closing"
            titleId="blogarticle.092"
            bodyId="blogarticle.093"
            primary={{ label: t('blogarticle.073'), href: '/hire-workers' }}
            secondary={{ label: t('home.221'), href: wa(sys('blog.whatsapp.consult')), external: true }}
            ticks={[tf('blogarticle.094'), tf('blogarticle.095')]}
            tone="navy"
          />
        </div>
      </Section>

      <ArticleEnhancementsLoader progressLabel={sys('blog.article.progress')} backToTopLabel={sys('blog.article.backToTop')} />
    </article>
  );
}
```

Notes: `ShareRow` and `ArticleToc` are client components rendered on the server (they are content — a nav landmark and the share actions — and must exist without JS; their chunks are small, and the measured size goes into the ledger); only `ArticleEnhancements` is `ssr: false` (W13). `blogarticle.094` is legal-flagged and verbatim; `blogarticle.095` is re-authored with `{homepageReplyHours}` (T0b) → `tf`. `formatInt(getRateConfig(bundle).quotaRatio, locale)` = `"5"` in both locales today. `print-isolate` (Task 6's CSS) marks the body as the printable region; no `PrintButton` is rendered (the design has none on this page). The `HIRE_FORM` object href relies on next-intl `Link` accepting `Omit<UrlObject,'pathname'>` beside `pathname` (verified in `node_modules/next-intl/dist/types/navigation/shared/utils.d.ts`: `HrefOrUrlObjectWithParams`).

- [ ] **Step 4: Run tests + npm run verify**

`npx vitest run "src/app/\[locale\]/(site)/blog"` → green. `npm run verify` → green. Local render: `npm run build && PORT=3100 npm run start`; `/en/blog/turkey-work-permit-process-employer-guide` shows hero → cover placeholder → mobile `<details>` TOC (≤900) / sticky sidebar (≥901) with 5 TOC links, the share row, the blue card → body with the takeaways box, four H2 sections, the quote → "Talk to a permit specialist →" → FAQ (4 items, single-open) → author box; no related block, no newsletter band; the sticky bar appears after 700 px on desktop and hides near the closing band; the reading bar tracks scroll; the back-to-top button appears on mobile after 12 %. Stop the server.

- [ ] **Step 5: Commit**

```
feat(blog): article sections — TOC/share sidebar, quote CTA, FAQ, author box, related (gated), sticky bar, hidden newsletter, closing band, progress island (T12 c4)

Related/prev-next render from data and stay hidden below the W4 threshold
(B-2); FAQ A1/Q3 fill their numbers from metrics/rateConfig (B-10); the
reading-progress + back-to-top island is dynamic ssr:false (W13); every
WhatsApp CTA is a ContactCta page_cta.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
```

---

#### Cycle 5 — Gate: the page e2e spec (both routes, both locales, the 404 rules, robots/sitemap, language switch), the local gate run

- [ ] **Step 1: Write the failing test**

`e2e/pages/blog.spec.ts`:

```ts
import { test, expect, type Page } from '@playwright/test';

const ORIGIN = 'https://www.jobsadmire.com';
const EN_ARTICLE = '/en/blog/turkey-work-permit-process-employer-guide';

const LEAK = /\{[A-Za-z][A-Za-z0-9]*\}|undefined/;

async function expectCleanH1(page: Page) {
  const h1 = page.getByTestId('page-h1');
  await expect(h1).toHaveCount(1);
  await expect(page.locator('h1')).toHaveCount(1);
  const text = (await h1.textContent()) ?? '';
  expect(text.trim().length).toBeGreaterThan(0);
  expect(text).not.toMatch(LEAK);
  await expect(h1).toHaveAttribute('data-lcp-slot', 'h1');
  expect(await page.locator('body').innerText()).not.toMatch(LEAK);
}

test.describe('/en/blog (index, one written EN article)', () => {
  test('renders the hero, the featured card, no tools bar, no newsletter band, noindex', async ({ page }) => {
    const res = await page.goto('/en/blog');
    expect(res?.status()).toBe(200);
    await expectCleanH1(page);
    await expect(page.getByTestId('hero-word-static')).toHaveText('employers');
    await expect(page.getByTestId('blog-featured')).toBeVisible();
    await expect(page.getByTestId('blog-featured').getByRole('link', { name: /work permit process/i })).toHaveAttribute('href', EN_ARTICLE);
    await expect(page.getByTestId('blog-grid')).toHaveCount(0); // 1 post: featured only (W4)
    await expect(page.getByTestId('blog-tools')).toHaveCount(0); // < 6 posts (B-5)
    await expect(page.getByTestId('blog-empty')).toHaveCount(0);
    await expect(page.locator('#newsletter-band form')).toHaveCount(0); // W5
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${ORIGIN}/en/blog`);
    // The language switch keeps the page: both locales of the index exist.
    await expect(page.locator('link[hreflang="tr"]')).toHaveAttribute('href', `${ORIGIN}/blog`);
    await expect(page.locator('link[hreflang="en"]')).toHaveAttribute('href', `${ORIGIN}/en/blog`);
    // No hard-typed cadence/most-read claims (B-2/B-3, D17).
    const body = await page.locator('body').innerText();
    expect(body).not.toContain('New article every week');
    expect(body).not.toContain('Most read');
  });

  test('the rotating word pauses on request (D20)', async ({ page }) => {
    await page.goto('/en/blog');
    const pause = page.getByRole('button', { name: 'Pause' });
    if ((await pause.count()) === 0) test.skip(true, 'reduced motion in this browser profile');
    await pause.click();
    await expect(page.getByRole('button', { name: 'Play' })).toBeVisible();
    const word = await page.getByTestId('hero-word-live').textContent();
    await page.waitForTimeout(3000);
    expect(await page.getByTestId('hero-word-live').textContent()).toBe(word);
  });
});

test.describe('/blog (index, zero written TR articles → W6 empty state)', () => {
  test('renders the empty state with the cross-locale link and nothing else from the list', async ({ page }) => {
    const res = await page.goto('/blog');
    expect(res?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', 'tr');
    await expectCleanH1(page);
    await expect(page.getByTestId('hero-word-static')).toHaveText('işverenler');
    await expect(page.getByTestId('blog-empty')).toBeVisible();
    await expect(page.getByTestId('blog-empty-cta')).toHaveAttribute('href', '/en/blog');
    await expect(page.getByTestId('blog-featured')).toHaveCount(0);
    await expect(page.getByTestId('blog-hero-art')).toHaveCount(0); // no featured post → null
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
    await page.getByTestId('blog-empty-cta').click();
    await expect(page).toHaveURL(/\/en\/blog$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });
});

test.describe('/en/blog/[slug] (the one written article)', () => {
  test('renders the article, its structure, JSON-LD and article metadata', async ({ page }) => {
    const res = await page.goto(EN_ARTICLE);
    expect(res?.status()).toBe(200);
    await expectCleanH1(page);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'article');
    await expect(page.locator('meta[property="article:published_time"]')).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${ORIGIN}${EN_ARTICLE}`);
    // No TR body → no TR hreflang; self + x-default only (page note / W33).
    await expect(page.locator('link[hreflang="tr"]')).toHaveCount(0);
    await expect(page.locator('link[hreflang="en"]')).toHaveAttribute('href', `${ORIGIN}${EN_ARTICLE}`);
    await expect(page.locator('link[hreflang="x-default"]')).toHaveAttribute('href', `${ORIGIN}${EN_ARTICLE}`);
    await expect(page.getByTestId('article-lang-note')).toHaveCount(0);

    const body = page.getByTestId('article-body');
    await expect(body.locator('h2')).toHaveCount(4);
    await expect(body.getByTestId('article-takeaways')).toBeVisible();
    await expect(body.locator('ol li')).toHaveCount(5);
    await expect(body.locator('blockquote')).toHaveCount(1);
    await expect(page.locator('#faq')).toHaveCount(1);
    await expect(page.locator('#faq [data-accordion-trigger]')).toHaveCount(4);
    await expect(page.getByTestId('article-author')).toBeVisible();
    await expect(page.getByTestId('article-related')).toHaveCount(0); // W4 threshold (B-2)
    await expect(page.locator('#newsletter-band form')).toHaveCount(0); // W5
    await expect(page.locator('[data-placeholder="cover-turkey-work-permit-process-employer-guide"]')).toHaveCount(1);
    const html = await (await page.request.get(EN_ARTICLE)).text();
    expect(html).toContain('"@type":"BlogPosting"');
    expect(html).toContain('"@type":"FAQPage"');
    expect(html).toContain('"@type":"BreadcrumbList"');
  });

  test('desktop: the sticky sidebar carries the 5-entry TOC, the share row and the CTA deep link', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'sidebar exists from lg only');
    await page.goto(EN_ARTICLE);
    const sidebar = page.getByTestId('article-sidebar');
    await expect(sidebar.getByRole('navigation', { name: 'In this article' }).locator('a')).toHaveCount(5);
    await expect(sidebar.getByTestId('article-share')).toBeVisible();
    await expect(sidebar.getByRole('link', { name: 'Request Workers →' })).toHaveAttribute('href', '/en/hire-workers#request-form');
    await expect(page.getByTestId('article-toc-mobile')).toBeHidden();
  });

  test('mobile: the <details> TOC lists the same 5 entries and the sidebar is hidden', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'mobile TOC only below lg');
    await page.goto(EN_ARTICLE);
    const toc = page.getByTestId('article-toc-mobile');
    await expect(toc).toBeVisible();
    await toc.locator('summary').click();
    await expect(toc.locator('a')).toHaveCount(5);
    await expect(page.getByTestId('article-sidebar')).toBeHidden();
  });
});

test.describe('B-1: slugs without a body answer 404', () => {
  for (const path of [
    '/blog/yabanci-isciler-calisma-izni-rehberi', // the TR slug of the written EN article: no TR body
    '/en/blog/hiring-from-pakistan-turkish-employers', // index-only EN entry
    '/en/blog/turkey-work-permit-process-employer-guide/', // trailing slash → Next redirects; then 200 is fine
    '/en/blog/does-not-exist',
    '/blog/does-not-exist',
  ]) {
    test(`${path}`, async ({ page }) => {
      const res = await page.goto(path);
      if (path.endsWith('/')) {
        expect([200, 308]).toContain(res?.status());
        return;
      }
      expect(res?.status()).toBe(404);
      await expect(page.locator('h1')).toHaveCount(1); // the (site) not-found inside the chrome (R6)
    });
  }
});

test('robots disallows /blog in both locales and the sitemap lists neither route', async ({ request }) => {
  const robots = await (await request.get('/robots.txt')).text();
  expect(robots).toContain('Disallow: /blog');
  expect(robots).toContain('Disallow: /en/blog');
  const xml = await (await request.get('/sitemap.xml')).text();
  expect(xml).not.toContain(`${ORIGIN}/blog`);
  expect(xml).not.toContain(`${ORIGIN}/en/blog`);
});
```

- [ ] **Step 2: Run to verify it fails**

`npm run build && PORT=3100 npm run start` then `E2E_BASE_URL=http://localhost:3100 npx playwright test e2e/pages/blog.spec.ts --project=desktop` → red only where a detail differs from the page as built (expected: the spec is written against Cycles 2–4 and should be green on the first run except any wording drift — fix the page, never the assertion, D20). Remove the trailing-slash case if `next.config.ts`'s `trailingSlash` handling makes it a redirect loop in the test runner (it should be a single 308).

- [ ] **Step 3: Implement**

Fix whatever the spec surfaced (typically: the `Request Workers →` link name if `blogarticle.073` renders with a different arrow glyph — use the exact package text; a leaked `undefined` where `post.title[locale]` is nullable — the page already guards it). No new files.

- [ ] **Step 4: Run tests + npm run verify**

`E2E_BASE_URL=http://localhost:3100 npx playwright test e2e/pages/blog.spec.ts e2e/routing.spec.ts e2e/seo.spec.ts e2e/a11y.spec.ts e2e/width-sweep.spec.ts --project=desktop` then `--project=mobile` → all green: the page-contract loop (Task 7) now covers the three new gate routes; axe reports zero violations on all three (the `<details>` TOC, the accordion, the rotating word's button and the share row are all labelled); the width sweep has no overflow at 1440…390 (the sidebar grid is `lg:` only, the related grid stacks, the hero art is `md:` only). Then the local gate: `E2E_BASE_URL=http://localhost:3100 npm run gate` → the three routes are `indexable: false`, so Lighthouse runs over the indexable set only (they still get axe + width sweep + the placeholder counter under `--profile=launch`); run Lighthouse by hand on the article for the ledger: `npx lhci collect --url=http://localhost:3100/en/blog/turkey-work-permit-process-employer-guide --config=lighthouserc.local.json --numberOfRuns=2 && npx lhci assert --config=lighthouserc.local.json` → performance ≥ 0.95, a11y/best-practices/SEO 1.0 (SEO stays 1.0 with a `noindex` page — Lighthouse audits the tag's validity, not its value), `resource-summary:script:size` ≤ 204,800. `npm run js-size` → paste the rows into the ledger (Cycle 6). If the article is above 194,560 B (`LAZY_LINE`): move `ShareRow` behind the `ArticleEnhancementsLoader` (`ssr: false`, with a `min-h-[96px]` reserved box in the sidebar) before the next page starts (W13 amended) — not expected: the page adds `ArticleToc` (ScrollSpyToc), `ShareRow`, `StickyCtaBar`, the FAQ `Accordion` and two ~1 KB wrappers above the fold; the progress island and (on the index) the tools island are lazy. Pixel harness (D27, two-iteration cap): `npm run pixel -- --page=blog-article --locale=en --base=http://localhost:3100` → record the three `match` scores (390/900/1440); the expected named deltas are the accessible TOC/accordion controls, the pause button in the h1, `blue-safe` CTA faces, the missing "In progress"/"Most read"/cadence pieces (B-1/B-2/B-3) and the sticky bar's CTA landing at the hire page top (B-6). One iteration of pixel fixes at most, then log. Stop the server. `npm run verify` green.

- [ ] **Step 5: Commit**

```
test(blog): page e2e — both routes, both locales, B-1 404s, robots/sitemap, language switch; gate routes (T12 c5)

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
```

---

#### Cycle 6 — Docs in the same change set, the ledger line

- [ ] **Step 1: Write the failing test**

No new test: `docs/*` are prose. The existing guards still run (`npm run verify` → Prettier checks the Markdown tables; `src/lib/seo/unbuilt.test.ts` and `routes.test.ts` stay green).

- [ ] **Step 2: Run to verify it fails**

`grep -n "blogArticle\|/blog" docs/SEO.md` → no page rows for the blog yet (the `## Pages` table Task 1 created lists the earlier pages only).

- [ ] **Step 3: Implement**

`docs/SEO.md` — in the `## Pages` table (created by Task 1; if it is absent because this task runs first, create it under `## Metadata` with this header: `| Route | Title source | Canonical | JSON-LD | LCP slot | Notes |`), append:

```markdown
| `/blog`, `/en/blog`                 | `sys.seo.blog.title` / `.description` (the package has no SEO string; page record `''` → fallback, W23/W38) | `absoluteUrl(locale, '/blog')`; hreflang tr/en/x-default | `BreadcrumbList` | `h1` (`blog-hero` is a named placeholder — B-7) | **noindex** (page record, W4) until `blogNavVisible`; out of nav/sitemap; `robots.txt` disallows `/blog` + `/en/blog` (T4 `robotsDisallowPaths`) |
| `/blog/[slug]`, `/en/blog/[slug]`   | `sys.seo.blogArticle.title` (`{title}` = the post title); description = the post excerpt (data) | per-locale slug; hreflang **only** for locales with a body (`buildMetadata.alternates`), x-default = the page's own | `BlogPosting` (`articleJsonLd`, author `Organization`, image = the OG route), `BreadcrumbList` (Home / Blog / title — B-9), `FAQPage` (4 pairs) | `h1` (`cover-<key>` is a named placeholder — D26/B-7) | **noindex**; `og:type article` + `article:published_time`; `generateStaticParams` over slugs with a body (1 EN today); index-only slugs 404 (B-1); joins `DETAIL_SITEMAP_SOURCES` only when it leaves NOINDEX (W4) |
```

and under `## Sitemap`, replace the sentence `Blog and careers-detail entries, read from the bundle under the `sitemap` ISR tag, are WP2 work not yet started.` (line 15 of the section as shipped) with: `Careers-detail entries come from `DETAIL_SITEMAP_SOURCES` (T11); blog entries join there only when `/blog` leaves `NOINDEX_PATHNAMES` (six Turkish bodies, W4) — until then the blog routes are built but deliberately absent from the sitemap and disallowed in robots.txt.` Under `## JSON-LD`, change `**Shipped in WP1** … `Article`/`BlogPosting` and `JobPosting` builders don't exist yet — they arrive with the blog and careers-detail pages in WP2.` to: `… `articleJsonLd` (BlogPosting) is called by `/blog/[slug]` (T12); `jobPostingJsonLd` by the careers detail (T11).`

`docs/ANALYTICS.md` — after the `## Event schema` table (below the `page is usePathname()` paragraph), append the paragraph:

```markdown
**Blog (T12).** Neither blog route adds an event: every WhatsApp/tel CTA on the index and the article (quote CTA, closing band, the FAQ card, the sticky bar's WhatsApp button — see the foundation gap in the WP2b plan) is a `page_cta` contact click through `ContactCta`/`ContactLink`; the share row's intents (wa.me share, LinkedIn, X, copy) fire nothing (W12: no `share` event exists; no free text ever rides). The newsletter form is hidden in Phase A (W5), so `generate_lead`/`conversion` for `form_key: newsletter` fire only once the band is activated.
```

`docs/CONTENT-MODEL.md` — in § Adding copy (line 74), extend the page enumeration's sentence with the blog's namespaces after `sys.<page>.*`: `— e.g. `sys.blog.{hero,index,empty,tools,article,faq,whatsapp}.*` (T12: the rotating-word title as a rich message `<word></word>`, the W6 empty state, the tools island's ICU result lines, the reading-progress/back-to-top labels, the two FAQ strings the package lacks (`faq.a1` with `{weeks}` from `firstDayWeeks`, `faq.q3` with `{ratio}` from `rateConfig.quotaRatio`), and the three WhatsApp prefill tails the design hard-codes)`. In § Blog (line 106), append to the v1 paragraph: `The v1 body grammar the page renders (`src/app/[locale]/(site)/blog/[slug]/_lib/markdown.ts`, T12) — and therefore what the Phase B editor may write — is: blocks separated by blank lines; `## ` headings (H2 only; ids are derived for the TOC); paragraphs with `**bold**`; `- ` bullet lists; `1. ` numbered steps (a leading `**bold**` is the step's lead); a paragraph of the form `**lead** — body` renders as a rule card (consecutive ones as a 2-up grid); a blockquote whose first line is `**Title**` followed by `- ` items renders as the Key-takeaways box; any other blockquote is a pull quote. No HTML, no links, no images in v1 — unknown syntax renders as text. Index-only rows (no body in the locale) are never linked and answer 404 on a direct hit (B-1); related/prev-next blocks and the index tools bar render from data and are hidden below the W4 threshold / below six non-featured posts.`

`docs/PRD.md` — rows 12 and 13 of the pages table (lines 31–32): change the Forms cell of both from `Newsletter signup (`NEWSLETTER`)` to `Newsletter signup (`NEWSLETTER`) — band hidden in Phase A (W5); action + form ready behind `active`` and append to row 13's route note: `; slugs without a body in the locale 404 (B-1); noindex until six Turkish bodies (W4)`.

**Ledger line (append to the WP2b ledger — `docs/superpowers/plans/2026-09-20-wp2b-pages.md` § Ledger — after Cycle 5's gate run; fill the measured numbers from `npm run js-size`, `lighthouse-report/` and `.pixel/report.json`):**

```markdown
| T12 Blog index + article | `/blog` `/en/blog` (noindex) · `/en/blog/turkey-work-permit-process-employer-guide` (noindex; TR article: none, 0 TR bodies) | script gz: /en/blog <n> B · /blog <n> B · article <n> B (ceiling 204,800; lazy line 194,560) | Lighthouse (local, article): perf <0.xx> · a11y 1.00 · BP 1.00 · SEO 1.00 · LCP <n> ms (warn locally, R50) | pixel blog-article/en: 390 <n> % · 900 <n> % · 1440 <n> % (1 iteration; deltas: TOC/accordion controls, h1 pause button, blue-safe CTAs, B-1/B-2/B-3 hidden pieces, B-6 sticky-bar landing) | agent-days <n> | commits <sha c1>…<sha c6> |
```

- [ ] **Step 4: Run tests + npm run verify**

`npm run verify` → green (Prettier accepts the tables). `git diff --stat` shows only the four docs, the plan ledger and nothing under `src/`.

- [ ] **Step 5: Commit**

```
docs(blog): SEO page rows, analytics note, content-model sys namespaces + v1 body grammar, PRD rows, ledger (T12 c6)

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
```

---

**Docs in this task:** `docs/SEO.md` (§ Pages two rows; § Sitemap and § JSON-LD sentences), `docs/ANALYTICS.md` (§ Event schema — the blog paragraph), `docs/CONTENT-MODEL.md` (§ Adding copy — the `sys.blog.*` namespaces; § Blog — the v1 body grammar, B-1, the hidden-by-data rules), `docs/PRD.md` (pages table rows 12–13), the WP2b plan ledger. No `docs/INTEGRATIONS.md` change: the only field sent (`email`) is in the Ops catalog v1.0 `newsletter` entry and T14 documents the form contracts. No `docs/ARCHITECTURE.md` change.

**Sys keys added (24):** `sys.seo.blog.title`, `sys.seo.blog.description`, `sys.seo.blogArticle.title`, `sys.blog.hero.title`, `sys.blog.hero.words`, `sys.blog.index.latest`, `sys.blog.empty.title`, `sys.blog.empty.body`, `sys.blog.empty.cta`, `sys.blog.tools.search`, `sys.blog.tools.category`, `sys.blog.tools.results`, `sys.blog.tools.resultsFor`, `sys.blog.tools.resultsIn`, `sys.blog.tools.all`, `sys.blog.article.progress`, `sys.blog.article.backToTop`, `sys.blog.article.langNote`, `sys.blog.article.sections`, `sys.blog.faq.a1`, `sys.blog.faq.q3`, `sys.blog.whatsapp.article`, `sys.blog.whatsapp.consult`, `sys.blog.whatsapp.permit` — in BOTH `src/messages/tr.json` and `src/messages/en.json` (asserted by `sys-keys.test.ts` and Task 2's `messages.test.ts`). Reused, not added: `sys.home`, `sys.nav.close`, `sys.marquee.pause/play`, `sys.whatsapp.prefill`, `sys.form.labels.email`, `sys.thankYou.forms.newsletter`.

**Package ids used (68; first `blog.004`, last `blogarticle.145`):** index — `blog.004`, `023`, `024`, `025`, `026`, `032`, `033`, `034`, `035`, `039`, `041`, `042`, `043`, `044`, `045`, `046`, `076`, `086`, `087`, `088`, `089`, `090`, `091`, `092`, `095`, `096`; shared — `home.221`, `home.262`, `home.263`, `home.264`, `home.265` (the rows' `categoryLabelId`, read through `t()` by `HeroArt`/`PostList`/`categoryOptions` and by `PostCard`); article — `blogarticle.023`, `024`, `064`, `065`, `066`, `067`, `068`, `069`, `070`, `071`, `072`, `073`, `074`, `075`, `076`, `081`, `082`, `083`, `084`, `085`, `089`, `091`, `092`, `093`, `094`, `095`, `127`, `128`, `129`, `130`, `131`, `132`, `140`, `141`, `143`, `144`, `145` (all present in `src/content/local/catalogue.json`, verified against the file; `blog.045`/`blogarticle.095` carry `{homepageReplyHours}` and are read through `makeTf`; `blog.044`/`blogarticle.094`/`068`/`129` are legal-flagged, verbatim). Read by the foundation blocks, not the page: `blog.036/037/038` (NewsletterBand chrome), `blog.077/081` (PostCard alt-language pills). Consumed by the importer into the body, not by the page: `blogarticle.025–063`. Deliberately unused: `blog.027/028/030/031` (hero float-card hard-typed claims and "Most read" — B-2/B-3), `blog.040`/`blogarticle.090` ("200+" proof line, an unsigned number inside the hidden band — W1/W5), `blog.085` (a `for “` fragment — replaced by ICU messages, B-5), `blog.093/094/097` (cadence claims, D17/B-3), `blog.098`/`blogarticle.142` (the mobile bar's WhatsApp prefill is chrome, `home.221` + `sys.whatsapp.prefill`), `blogarticle.077–080` and `138/139` (B-1), `blogarticle.124/125/126/133–137` (the design's TOC/chip label variants; the TOC uses the body's own H2 text and the chips use `home.262–265`), `blogarticle.001–022` and `096–123` + `blog.001–021`/`047–075` (per-page chrome duplicates — R15, the chrome reads its canonical ids).

**Foundation gaps:** (1) `StickyCta.href` (T5 `StickyCtaBar`), `Cta.href` (T5 `ClosingCtaBand`) and `EmptyStateCta.href` are plain strings that reach `Button`'s typed `Link` cast, so neither a `#request-form` hash deep link (B-6: the sticky bar and the closing band land on the hire page top, not on the form) nor an already-localised cross-locale path (the TR empty state's link to `/en/blog` had to be a plain anchor) can be expressed — an `Href`-typed variant (`href: Href | string`, object hrefs passed straight to `Link`) on those three types would close it. (2) `StickyCtaBar` renders its CTAs as plain `Button`s, so its WhatsApp button fires no `whatsapp_click` — W12's "every wa.me anchor goes through `useContactClick`" cannot be met inside the bar from a page; T5 should route the bar's CTAs through `ContactCta` (placement `page_cta`). (3) `ScrollSpyToc.remainingLabel` is a function prop, so every server page needs a client wrapper (`ArticleToc` here) to compose the "≈ N min left" label; string props (`almostDone`, `minLeftSuffix`) on the island would remove the wrapper. (4) `Breadcrumbs` requires an `href` on every crumb, so the design's category crumb (no category page exists) becomes the article title (B-9) — a text-only `Crumb` (`href?`) would restore it.
