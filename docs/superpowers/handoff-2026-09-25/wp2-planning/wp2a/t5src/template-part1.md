### Task 5: Primitive extensions + shared blocks + `formatDate` (T0d, first two bullets + W27)

Repo: `/Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website` (branch `wp2/foundation`, after Tasks 1–4 have landed — T0b data layer, T0a forms kernel, T0c chrome, T0c/SEO). Run every command from the repo root. One build/test job at a time (Mac memory rule). Rulings in force here: W1 (unsigned metrics are hidden), W5 (newsletter band hidden in Phase A), W6 (designed empty states), W8 (Android badge only), W9/W23/W54 (no invented package ids; composed block copy lives in `sys.blocks.*`, the breadcrumb label in the existing `sys.nav.*`), W10 (mobile-only content via CSS classes, not conditional rendering), W12 (contact clicks carry a `placement`), W13 (blocks are server components; no new client JS unless the piece is interactive), W18 (sticky stacking), W27 (shared `EmptyState` + `ImageSlot`), W32 (`useContactClick` returns `(kind) => void`; `contactKindOf` classifies), W33 (`BlogPost` is Task 1's shape), W34 (test rows satisfy Task 1's Zod schemas; `OfficeCard` renders the row's own ids; `hours.days` are JS `getDay()` 0–6), W39 (`sys.nav` keeps `legal`; the primitives barrel is edited additively and keeps `buttonClassName`), W41 (the gallery lives under `(site)/` — edit the moved `page.tsx`, never create a second one), W45 (docs edits anchor on sentences), W55 (placeholders are always named), R15 (one canonical package id per shared string), R22 (tel/wa/mailto hrefs stay anchors), R56 (never import `design-package/**` or `src/content/local/*` from `src/**`), D17 (numbers are data: every block resolves package ids through `makeTf(bundle, locale)`, so a re-authored `{metric}` string renders its figure).

**Files:**

Create
- `src/lib/format/date.ts`, `src/lib/format/date.test.ts`
- `src/design/primitives/RadioChips.tsx`
- `src/design/primitives/__tests__/Section.test.tsx`, `__tests__/Stat.test.tsx`, `__tests__/Timeline.test.tsx`, `__tests__/Tabs.test.tsx`, `__tests__/RadioChips.test.tsx`
- `src/design/chrome/__tests__/StickyCtaBar.test.tsx`, `src/design/chrome/__tests__/WhatsAppFab.test.tsx`
- `src/test/bundle.ts`
- `src/design/blocks/ContactCta.tsx`, `FaqBlock.tsx`, `Breadcrumbs.tsx`, `ClosingCtaBand.tsx`, `ProcessSteps.tsx`, `MetricStrip.tsx`, `OfficeCard.tsx`, `ImageSlot.tsx`, `EmptyState.tsx`, `PostCard.tsx`, `NewsletterBand.tsx`, `StoreBadges.tsx`, `LogoMarquee.tsx`, `index.ts`
- `src/design/blocks/__tests__/ContactCta.test.tsx`, `FaqBlock.test.tsx`, `Breadcrumbs.test.tsx`, `ClosingCtaBand.test.tsx`, `ProcessSteps.test.tsx`, `MetricStrip.test.tsx`, `OfficeCard.test.tsx`, `ImageSlot.test.tsx`, `EmptyState.test.tsx`, `PostCard.test.tsx`, `NewsletterBand.test.tsx`, `StoreBadges.test.tsx`, `LogoMarquee.test.tsx`
- `src/app/[locale]/(site)/dev/gallery/Wp2Blocks.tsx`, `src/app/[locale]/(site)/dev/gallery/RadioChipsDemo.tsx` (W41: the gallery folder Task 3 moved into the `(site)` group)

Modify
- `src/messages/en.json`, `src/messages/tr.json` (the `sys.nav` object gains `breadcrumbs` after Task 3's `legal`; a new `sys.blocks` object after `sys.whatsapp` — additive, key-anchored, both files)
- `src/design/primitives/Section.tsx` (whole file, 22 lines on main, untouched by Tasks 1–4), `Stat.tsx` (whole file, 76 lines), `Timeline.tsx` (whole file, 19 lines), `Tabs.tsx` (whole file, 70 lines), `Button.tsx` (only the `ButtonVariant` type + `VARIANT` map at the top — Task 3 rewrote the `SIZE`/`BASE`/`buttonClassName`/`Button` region below it, which stays), `index.ts` (three additive line edits — the file after Task 3 has `buttonClassName` on line 2; it stays)
- `src/design/chrome/StickyCtaBar.tsx` (whole file, 56 lines on main, untouched by Tasks 1–4), `LanguageHint.tsx` (the sheet's `className` string only — Task 4 already changed the imports, the `target`/`alternate` lines and the switch link; those stay), `WhatsAppFab.tsx` (the `ContactLink`'s `className` string and the docblock — the file is Task 3's `ContactLink` version), `icons.tsx` (append two icons after `LinkedInIcon`; Task 6 later appends `XIcon`/`LinkIcon` after these)
- `src/design/chrome/__tests__/LanguageHint.test.tsx` (append one `describe`; the file after Task 4 already imports `screen`, `renderWithIntl`, `LanguageHint`)
- `src/app/[locale]/(site)/dev/gallery/page.tsx` (one import, one element, two props on `<StickyCtaBar>` — sentence-anchored; Task 6 later adds `IslandsDemo` to the same file)
- `docs/ARCHITECTURE.md` (§ Design system paragraph; § Chrome `StickyCtaBar` paragraph), `docs/CONTENT-MODEL.md` (§ The `sys.*` range: Chrome line + a Blocks bullet; § Chrome canonical ids table + one sentence; § Adding copy: one sentence), `docs/SEO.md` (§ JSON-LD, one clause), `docs/ANALYTICS.md` (three table cells + one clause), `docs/PRD.md` (§ 11 Design system bullet)

Test: every `__tests__/*.test.tsx` and `*.test.ts` listed above, plus the existing `src/messages/messages.test.ts` (Task 2's key-parity test covers the new keys).

**Interfaces:**

Consumes (exact, from the producing task — verified against its draft/Produces block; WP1 = `main @ ad58fb8`)
- **WP1 primitives** (`@/design/primitives`): `Button({ variant: ButtonVariant; size?: 'md' | 'lg'; href?: string; external?: boolean; type?; disabled?; prefetch?; children?; …HTMLAttributes<HTMLElement> })`, `Accordion({ items: AccordionItem[]; singleOpen?: boolean; defaultOpenId?: string; headingLevel?: 2 | 3 | 4 })` with `AccordionItem = { id: string; title: string; body: ReactNode }` (triggers are `<h{n}><button aria-expanded>`; closed panels carry `hidden`), `Eyebrow({ children })`, `PausableMarquee({ children; durationSec: number; labelPause: string; labelPlay: string })` (second track `aria-hidden` + `inert`), `Chip`, `Card` (not used by the blocks — `PostCard` draws its own `<article>` so its `p-0` never fights `Card`'s `p-6`).
- **WP1 libs**: `makeT(bundle)` from `@/content/pure` (throws on an unknown id outside production); `waLink(number, text)`, `telLink(phone)`, `mailLink(email, subject?)` from `@/lib/contact`; `JsonLd({ data })` from `@/lib/seo/JsonLdScript`; `breadcrumbJsonLd(items: { name: string; url: string }[])`, `faqJsonLd(pairs: { q: string; a: string }[])` from `@/lib/seo/jsonld` (unchanged by Task 4); `absoluteUrl(locale, href)`, `SITE_URL`, `type Href = Parameters<typeof getPathname>[0]['href']` from `@/lib/seo/routes` (this `Href` is assignable to next-intl `Link`'s `href` — the reverse is not, so `Crumb.href` uses the routes one); `Link` from `@/i18n/navigation`; `type Locale`, `pathnames` from `@/i18n/routing`; `formatInt(n, locale)` from `@/lib/format/money`; `Bundle`, `BundleSchema` from `contract/website-bundle.v1` + `contract/website-bundle.v1.fixture.json` (20 strings, `collections: {}`, `settings.storeLinks.android` set, `.ios` null); `renderWithIntl(ui, { locale? })` from `@/test/render`.
- **Task 1** (`@/content/collections`, client-safe): `getCollection<K extends CollectionKey>(bundle: Bundle, key: K): CollectionRow<K>[]` (dev: throws `CollectionError` on a schema miss), `getOffice(bundle: Bundle, key: 'antalya' | 'karachi'): Office`, and the row types `Metric = { key: MetricKey; value: number | null; text: string | null; suffix: '+' | ''; labelId: string | null; unitId: string | null }`, `MetricKey`, `Office = { key; kind: 'hq' | 'sourcing'; cityId; labelId; addressId; addressLine2Id; hoursId; footerLabelId; phone; whatsapp; email; hours: { tz; days: number[] /* getDay() 0–6, W43 */; open; close }; mapUrl }`, `BlogPost = { key; slug: { tr: string | null; en: string | null }; title: { tr; en }; excerpt: { tr; en }; category: 'workPermits' | 'recruitment' | 'compliance' | 'marketNews'; categoryLabelId: string; author; publishedAt: 'YYYY-MM-DD'; readMinutes: number; hasBody: { tr: boolean; en: boolean }; body: { tr: string | null; en: string | null } /* W28 */ }`. From `@/content/pure`: `makeTf(bundle: Bundle, locale: Locale): (id: string) => string` (= `fill(t(id), metricValues(bundle, locale))` — the accessor for re-authored ids; `metricValues` reads the `metrics` collection, `[]` when absent).
- **Task 2**: nothing imported. `src/messages/messages.test.ts` (tr/en key parity) runs in every `npm run verify` here; `NewsletterBand` takes the page's `<FormShell>` as `children` (the page owns the server action, T0a `createFormAction` pattern).
- **Task 3** (canonical, W32): from `@/analytics/useContactClick` — `CONTACT_PLACEMENTS`, `type ContactPlacement`, `type ContactKind = 'call' | 'whatsapp' | 'email'`, `contactKindOf(href: string): ContactKind | null`, `useContactClick(placement: ContactPlacement): (kind: ContactKind) => void`; from `@/analytics/ContactLink` (`'use client'`) — `ContactLink(props: Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'onClick'> & { href: string; placement: ContactPlacement; children: ReactNode })` (fires the event through the hook when `contactKindOf(href)` is non-null, plain anchor otherwise; needs the intl provider for `useLocale`, and `next/navigation`'s `usePathname` is `null` → `'/'` outside the App Router — so tests render through `renderWithIntl` and mock nothing). From `@/design/primitives`: `buttonClassName(variant: ButtonVariant, size: 'md' | 'lg' = 'md', className?: string): string`. `sys.nav.legal` exists in both message files. `WhatsAppFab` is Task 3's `ContactLink` version. The gallery is at `src/app/[locale]/(site)/dev/gallery/page.tsx` and its `Header` line is `<Header locale={locale} bundle={bundle} />`.
- **Task 4**: `LanguageHint.tsx` keeps the sheet's `role="region"` and its WP1 `className`; `LanguageHint.test.tsx` already imports `screen`/`renderWithIntl`/`LanguageHint`/`shouldShowHint` and has the `LanguageHint link target` describe (its cases render `<LanguageHint locale="tr" />` eligible under jsdom — the new case does the same). `docs/SEO.md` § JSON-LD reads "`breadcrumbJsonLd` and `faqJsonLd` (WP1; called by the WP2 `Breadcrumbs`/`FaqBlock` blocks)".
- **Task 7** (markup contract, consumed by `ImageSlot`): every image slot rendered without its asset carries `data-placeholder="<design slot id>"` (never empty — W55), the LCP element `data-lcp-slot="<slot>"`; `scripts/placeholder-count.ts` fails a route whose `[data-lcp-slot]` is also `[data-placeholder]`.

Produces (frozen for the WP2b pages — copy exactly)

```ts
// src/lib/format/date.ts — pure; imports both message files, so server components and tests only (never a client island)
export function formatDate(iso: string, locale: Locale): string;        // TR '12 Ocak 2026', EN '12 January 2026' (en-GB, day first); UTC calendar dates; RangeError on a non-date
export function formatMonth(iso: string, locale: Locale): string;       // TR 'Ocak 2026', EN 'January 2026' (D17 dated labels)
export function formatReadMinutes(n: number, locale: Locale): string;   // sys.blocks.readMinutes ICU: EN '5 min read', TR '5 dk okuma'; never below 1

// src/messages/{tr,en}.json — new sys keys (both files, W54 namespaces)
sys.nav.breadcrumbs        // 'Sayfa yolu' / 'Breadcrumb' — the <nav aria-label> of Breadcrumbs (existing chrome namespace, beside nav.main/close/legal)
sys.blocks.readMinutes     // ICU plural on {n} — the ONLY sys.blocks.* key today; every future block-composed string goes here

// src/design/primitives (extended; the barrel keeps Task 3's buttonClassName — W39)
export type SectionTone = 'light' | 'dark' | 'pale' | 'band';
export function Section(p: { tone: SectionTone; id?: string; className?: string; children?: ReactNode }): JSX.Element;
//   light = bg-white text-ink py-16 · dark = bg-navy text-white py-16 · pale = bg-pale-1 text-ink py-16 · band = bg-white text-ink py-10 (hosts one full-width card)
export function Stat(p: { value?: number; text?: string; prefix?: string; suffix?: string; label: string; locale: Locale; tone?: 'light' | 'dark' }): JSX.Element | null;
//   `text` wins over `value` (rendered verbatim, no count-up); neither → null (W1 hidden metric); dark tone = white figure, text-white/55 label
export type TimelineStep = { when?: string; title: string; body: string };
export function Timeline(p: { steps: TimelineStep[]; variant?: 'vertical' | 'horizontal' }): JSX.Element; // <ol data-variant=…>; horizontal = md:grid-flow-col row
export type TabItem = { id: string; label: string; panel: ReactNode };
export function Tabs(p: { tabs: TabItem[]; defaultId: string; onChange?: (id: string) => void }): JSX.Element; // onChange after every selection change (click, arrows, Home/End)
export type RadioChipOption = { value: string; label: string };
export function RadioChips(p: { name: string; options: RadioChipOption[]; value: string | null; onChange: (value: string) => void; legend: string; legendHidden?: boolean; className?: string }): JSX.Element;
//   'use client'; <fieldset role="radiogroup" aria-labelledby=legend> of native radios (arrow keys, form submission under `name`), chip-styled labels
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'inverse'; // inverse = translucent white outline for navy/gradient bands

// src/design/chrome/StickyCtaBar.tsx ('use client', page-mounted)
export type StickyCta = { label: string; href: string; variant?: ButtonVariant; external?: boolean };
export const STICKY_CTA_HEIGHT_VAR = '--sticky-cta-h';
export function isBarVisible(scrollY: number, showAfterPx: number, targetTop: number | null, viewportHeight: number): boolean;
//   scrollY > showAfterPx, and (no target, or target's top ≥ 90% of the viewport height)
export function StickyCtaBar(p: { message: string; ctas: StickyCta[]; showAfterPx?: number /* 700 */; hideNearId?: string; live?: boolean }): JSX.Element | null;
//   W18: publishes its rendered height as `--sticky-cta-h` on <html> while visible, '0px' otherwise (and on unmount);
//   LanguageHint + WhatsAppFab add var(--sticky-cta-h,0px) to their bottom offset. `live` = the design's green dot (data-live-dot).
//   CONTRACT FOR PAGE TASKS: `hideNearId` names the element id the bar advertises (the page's form/section) — the bar hides while it is near.

// src/design/blocks (barrel: src/design/blocks/index.ts) — server components; no 'use client' anywhere in the folder.
// Every block that takes `bundle` also takes `locale` and resolves ids through makeTf(bundle, locale) (D17) — never makeT.
export type PageContactPlacement = 'page_cta' | 'office_card';
export type ContactCtaProps = { placement: PageContactPlacement; href: string; variant?: ButtonVariant /* 'primary' */; size?: 'md' | 'lg'; external?: boolean; className?: string; 'aria-label'?: string; children: ReactNode };
export function ContactCta(p: ContactCtaProps): JSX.Element;
//   contactKindOf(href) non-null → Task 3's <ContactLink placement className={buttonClassName(variant, size, className)}> (+ target/rel when external): the click fires
//   whatsapp_click/call_click/email_click with the placement; any other href → a plain <Button variant size href external>. Blocks and pages use it for EVERY CTA that may be a contact door.

export type Cta = { label: string; href: string; external?: boolean; variant?: ButtonVariant };
export type FaqItem = { id: string; q: string; a: string };                    // q/a already resolved by the page (makeTf)
export type FaqAskCard = { titleId: string; bodyId: string; whatsappNumber: string; whatsappText: string; whatsappLabelId: string; phone?: string; callLabelId?: string };
export function FaqBlock(p: { bundle: Bundle; locale: Locale; items: FaqItem[]; id?: string /* 'faq' */; eyebrowId?: string; headingId?: string; bodyId?: string; askCard?: FaqAskCard; singleOpen?: boolean /* true */; openFirst?: boolean; headingLevel?: 2 | 3 | 4 /* 3 */; footer?: ReactNode }): JSX.Element;
//   two-column (side sticky from lg) + Accordion + <JsonLd data={faqJsonLd(items)}/>; the ask card's WhatsApp/call buttons are ContactCta 'page_cta'

export type Crumb = { name: string; href: Href };                              // every crumb incl. the current page carries its href (JSON-LD needs the url); Href = @/lib/seo/routes
export function Breadcrumbs(p: { locale: Locale; items: Crumb[]; tone?: 'light' | 'dark'; className?: string }): JSX.Element;
//   <nav aria-label={sys.nav.breadcrumbs}><ol>…</ol></nav>, last item aria-current="page" (text, not a link), + <JsonLd data={breadcrumbJsonLd(…absoluteUrl…)}/>

export function ClosingCtaBand(p: { bundle: Bundle; locale: Locale; titleId: string; bodyId?: string; primary: Cta; secondary?: Cta; extra?: Cta[]; ticks?: string[]; tone?: 'navy' | 'gradient' | 'green'; id?: string }): JSX.Element;
//   dark rounded card; every CTA renders through ContactCta 'page_cta' (primary default variant 'primary', secondary/extra default 'inverse'); `ticks` render `md:hidden` (W10)

export type ProcessStep = { n: number; titleId: string; bodyId: string; when?: string }; // `when` is a resolved string (the page reads its id)
export function ProcessSteps(p: { bundle: Bundle; locale: Locale; steps: ProcessStep[]; variant?: 'cards' | 'plain' /* 'cards' */; id?: string; headingLevel?: 3 | 4 }): JSX.Element;
//   <ol data-variant> of <li data-last="true" on the last>; numbered aria-hidden dots on a vertical gradient rail, last step green; cards = Hire Workers' boxed rows, plain = Homepage/Contact rows

export function MetricStrip(p: { bundle: Bundle; locale: Locale; metrics: MetricKey[]; tone?: 'light' | 'dark'; className?: string }): JSX.Element | null;
//   reads the `metrics` collection; a key with value=null & text=null, or labelId=null, is skipped (W1); all skipped → null; unitId (when set) joins the suffix (`45 gün`)

export function OfficeCard(p: { bundle: Bundle; locale: Locale; office: Office; children?: ReactNode }): JSX.Element;
//   <article>: h3 t(cityId) · t(labelId) (green for 'sourcing') · t(addressId) <br/> t(addressLine2Id) · t(hoursId) (W34: the package's own hours string, nothing composed)
//   · tel / WhatsApp (home.221, sys.whatsapp.prefill) / mail rows as Task 3's ContactLink placement 'office_card' · directions (home.192, mapUrl); `children` = the page's live-status pill / note

export type ImageSlotProps = { slot: string; lcp?: boolean; src?: string | null; alt: string; width: number; height: number; sizes?: string; className?: string; priority?: boolean };
export function ImageSlot(p: ImageSlotProps): JSX.Element;
//   W27/W55/D26: `src` → next/image (priority ?? lcp, data-lcp-slot={slot} when lcp); no src → <div role="img" aria-label={alt} data-placeholder={slot} data-lcp-slot={lcp ? slot : undefined}> gradient box with aspect-ratio width/height;
//   alt '' = decorative → the placeholder is aria-hidden with no role

export type EmptyStateCta = { label: string; href: string; external?: boolean };
export function EmptyState(p: { title: string; body?: string; cta?: EmptyStateCta; tone?: 'light' | 'pale' | 'dark' /* 'light' */; icon?: ReactNode; headingLevel?: 2 | 3 /* 3 */; testId?: string; className?: string }): JSX.Element;
//   W6/W27: <div role="status" data-testid={testId}> dashed card, h{n} title, body, ContactCta 'page_cta' (secondary face; 'inverse' on dark); copy = the page's sys.<page>.empty.* (resolved by the page)

export function PostCard(p: { bundle: Bundle; locale: Locale; post: BlogPost; variant?: 'card' | 'row' | 'featured'; categoryLabel?: string; coverSrc?: string | null; headingLevel?: 2 | 3 }): JSX.Element | null;
//   W33: null when post.slug[locale] or post.title[locale] is null; <article>; title = Link to {pathname:'/blog/[slug]', params:{slug: post.slug[locale]}} showing post.title[locale];
//   excerpt = post.excerpt[locale] (card/featured only); category pill = categoryLabel ?? t(post.categoryLabelId); meta = formatDate · formatReadMinutes;
//   alt-language pill (blog.081 on TR, blog.077 on EN) when post.hasBody[other]; cover = <ImageSlot slot={`blog-cover-${post.key}`} src={coverSrc} alt="">

export function NewsletterBand(p: { bundle: Bundle; locale: Locale; active: boolean; id?: string /* 'newsletter' */; children?: ReactNode }): JSX.Element | null;
//   active=false (Phase A, W5) → null; active=true → band chrome (blog.036/037/038) + {children} (the page's FormShell)

export function StoreBadges(p: { bundle: Bundle; locale: Locale; android: string | null; ios?: string | null; tone?: 'dark' | 'light' /* 'dark' */ }): JSX.Element | null;
//   Google Play badge (hire.240) when android; App Store (hire.241) only when ios is a string (W8: null today); both null → null

export type Logo = { src: string; alt: string; width: number; height: number };
export function LogoMarquee(p: { logos: Logo[]; durationSec?: number /* 38 */; className?: string }): JSX.Element | null; // [] → null; else PausableMarquee of next/image logos with sys.marquee labels

// re-exported from the barrel for one-import pages (definitions stay in src/content/collections.ts):
export type { BlogPost, Metric, MetricKey, Office } from '@/content/collections';

// src/test/bundle.ts (test helper)
export function testBundle(overrides?: { strings?: Record<string, string>; collections?: Bundle['collections']; settings?: Partial<Bundle['settings']> }): Bundle; // BundleSchema.parse over the golden fixture (R13)
export const BLOCK_STRINGS: Record<string, string>; // the chrome ids the blocks read by canonical id (home.192/221, hire.240/241, blog.034/036/037/038/077/081)
```

---

#### Cycle 1 — `formatDate` / `formatMonth` / `formatReadMinutes` + `sys.nav.breadcrumbs` + `sys.blocks.readMinutes`

- [ ] **Step 1: Write the failing test**

`src/lib/format/date.test.ts`:

```ts
{{FILE:src/lib/format/date.test.ts}}
```

- [ ] **Step 2: Run test to verify it fails**

`npx vitest run src/lib/format/date.test.ts` → `Error: Failed to load url ./date` (1 file failed).

- [ ] **Step 3: Implement**

`src/messages/en.json` — two additive, key-anchored edits (the file after Tasks 2–3 also carries `sys.nav.legal` and the `sys.form` object; touch neither). Inside the existing `"nav"` object add `"breadcrumbs"` after `"legal"`, and immediately after the `"whatsapp"` object add a `"blocks"` object. The three objects then read:

```json
    "nav": {
      "main": "Main menu",
      "close": "Close",
      "legal": "Legal",
      "breadcrumbs": "Breadcrumb"
    },
```

```json
    "whatsapp": {
      "prefill": "Hello JobsAdmire, "
    },
    "blocks": {
      "readMinutes": "{n, plural, one {# min read} other {# min read}}"
    },
```

`src/messages/tr.json` — the same two edits:

```json
    "nav": {
      "main": "Ana menü",
      "close": "Kapat",
      "legal": "Yasal",
      "breadcrumbs": "Sayfa yolu"
    },
```

```json
    "whatsapp": {
      "prefill": "Merhaba JobsAdmire, "
    },
    "blocks": {
      "readMinutes": "{n, plural, one {# dk okuma} other {# dk okuma}}"
    },
```

(Verify the anchors first: `grep -n '"legal"\|"whatsapp"' src/messages/en.json src/messages/tr.json`. `sys.blocks.*` is the W54 namespace for copy a shared block composes; `nav.breadcrumbs` sits in the existing chrome namespace beside Task 3's `nav.legal`. Both files must carry the identical key set — `src/messages/messages.test.ts` asserts it.)

`src/lib/format/date.ts`:

```ts
{{FILE:src/lib/format/date.ts}}
```

(No `formatWeekdays`: W34 dropped the composed office hours — `OfficeCard` renders the package's own `hoursId` string — and the Contact page's live open/closed pill reads `office.hours.days` (JS `getDay()` 0–6, W43) in its own island; nothing formats weekday names.)

- [ ] **Step 4: Run the tests + `npm run verify`**

`npx vitest run src/lib/format/date.test.ts src/messages/messages.test.ts` → 8 + 2 passed. `npm run verify` → green (typecheck, lint, prettier, vitest).

- [ ] **Step 5: Commit**

```bash
git add src/lib/format/date.ts src/lib/format/date.test.ts src/messages/en.json src/messages/tr.json
git commit -m "feat(format): formatDate/formatMonth/formatReadMinutes + sys.nav.breadcrumbs, sys.blocks.readMinutes (W54)

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

#### Cycle 2 — `Section` pale/band tones, `Stat` text/prefix/tone, `Timeline` horizontal

- [ ] **Step 1: Write the failing tests**

`src/design/primitives/__tests__/Section.test.tsx`:

```tsx
{{FILE:src/design/primitives/__tests__/Section.test.tsx}}
```

`src/design/primitives/__tests__/Stat.test.tsx`:

```tsx
{{FILE:src/design/primitives/__tests__/Stat.test.tsx}}
```

`src/design/primitives/__tests__/Timeline.test.tsx`:

```tsx
{{FILE:src/design/primitives/__tests__/Timeline.test.tsx}}
```

- [ ] **Step 2: Run tests to verify they fail**

`npx vitest run src/design/primitives/__tests__/Section.test.tsx src/design/primitives/__tests__/Stat.test.tsx src/design/primitives/__tests__/Timeline.test.tsx` → Section: `pale`/`band` render `bg-white` (2 failures); Stat: `text` is an unknown prop, `container` is not empty, no `text-white/55` (3 failures); Timeline: no `data-variant` (2 failures).

- [ ] **Step 3: Implement**

`src/design/primitives/Section.tsx` (replace whole file — 22 lines, untouched by Tasks 1–4):

```tsx
{{FILE:src/design/primitives/Section.tsx}}
```

`src/design/primitives/Stat.tsx` (replace whole file — 76 lines, untouched by Tasks 1–4):

```tsx
{{FILE:src/design/primitives/Stat.tsx}}
```

`src/design/primitives/Timeline.tsx` (replace whole file — 19 lines):

```tsx
{{FILE:src/design/primitives/Timeline.tsx}}
```

`src/design/primitives/index.ts` — one line edit (additive, W39): `export { Section } from './Section';` becomes `export { Section, type SectionTone } from './Section';`. Nothing else in the barrel changes in this cycle (line 2 stays Task 3's `export { Button, buttonClassName, type ButtonProps, type ButtonVariant } from './Button';`).

- [ ] **Step 4: Run the tests + `npm run verify`**

`npx vitest run src/design/primitives` → all green (the existing Accordion/Button/Dialog/FormField/PausableMarquee suites included). `npm run verify` → green. The dev gallery's `<Stat value={1240} suffix="+" …/>` and `<Section tone="dark">` compile unchanged.

- [ ] **Step 5: Commit**

```bash
git add src/design/primitives/Section.tsx src/design/primitives/Stat.tsx src/design/primitives/Timeline.tsx src/design/primitives/index.ts src/design/primitives/__tests__/Section.test.tsx src/design/primitives/__tests__/Stat.test.tsx src/design/primitives/__tests__/Timeline.test.tsx
git commit -m "feat(primitives): Section pale/band tones, Stat text/prefix/tone (text wins, no count-up), Timeline horizontal variant

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

#### Cycle 3 — `Tabs.onChange`, `RadioChips`, `Button` `inverse` variant

- [ ] **Step 1: Write the failing tests**

`src/design/primitives/__tests__/Tabs.test.tsx`:

```tsx
{{FILE:src/design/primitives/__tests__/Tabs.test.tsx}}
```

`src/design/primitives/__tests__/RadioChips.test.tsx`:

```tsx
{{FILE:src/design/primitives/__tests__/RadioChips.test.tsx}}
```

- [ ] **Step 2: Run tests to verify they fail**

`npx vitest run src/design/primitives/__tests__/Tabs.test.tsx src/design/primitives/__tests__/RadioChips.test.tsx` → Tabs: `onChange` never called (1 failure); RadioChips: `Failed to resolve import "../RadioChips"`.

- [ ] **Step 3: Implement**

`src/design/primitives/Tabs.tsx` (replace whole file — 70 lines, untouched by Tasks 1–4; the only behavioural change is the `select()` helper that `onClick` and the arrow/Home/End handler both call):

```tsx
{{FILE:src/design/primitives/Tabs.tsx}}
```

`src/design/primitives/RadioChips.tsx` (new):

```tsx
{{FILE:src/design/primitives/RadioChips.tsx}}
```

`src/design/primitives/Button.tsx` — replace only the `export type ButtonVariant = …` line and the `const VARIANT: Record<ButtonVariant, string> = { … };` block that follows it (the first two statements after the imports; Task 3's `SIZE`/`BASE`/`buttonClassName`/`ButtonProps`/`Button` below them stay exactly as Task 3 left them):

```tsx
{{FILE:src/design/primitives/button-variant.snippet.tsx}}
```

`src/design/primitives/index.ts` — one additive line, inserted in alphabetical position between the `PausableMarquee` and `Section` lines (W39: never rewrite the barrel):

```ts
export { RadioChips, type RadioChipOption } from './RadioChips';
```

After this cycle the barrel reads, in order: `Accordion` · `Button, buttonClassName, type ButtonProps, type ButtonVariant` · `Card` · `Chip` · `Dialog` · `Eyebrow` · `FormField` · `PausableMarquee` · `RadioChips, type RadioChipOption` · `Section, type SectionTone` · `SkipLink` · `Stat` · `Tabs, type TabItem` · `Timeline, type TimelineStep` — check with `cat src/design/primitives/index.ts`.

- [ ] **Step 4: Run the tests + `npm run verify`**

`npx vitest run src/design/primitives` → green. `npm run verify` → green (`HeaderCtas.tsx` still finds `buttonClassName`).

- [ ] **Step 5: Commit**

```bash
git add src/design/primitives/Tabs.tsx src/design/primitives/RadioChips.tsx src/design/primitives/Button.tsx src/design/primitives/index.ts src/design/primitives/__tests__/Tabs.test.tsx src/design/primitives/__tests__/RadioChips.test.tsx
git commit -m "feat(primitives): Tabs onChange, RadioChips radiogroup, Button inverse variant

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

#### Cycle 4 — `StickyCtaBar` hideNearId + `--sticky-cta-h` (W18); `LanguageHint` / `WhatsAppFab` consume it; the `testBundle` helper

- [ ] **Step 1: Write the failing tests**

`src/test/bundle.ts` (test helper, not a test — used from here on by every block test):

```ts
{{FILE:src/test/bundle.ts}}
```

`src/design/chrome/__tests__/StickyCtaBar.test.tsx`:

```tsx
{{FILE:src/design/chrome/__tests__/StickyCtaBar.test.tsx}}
```

`src/design/chrome/__tests__/WhatsAppFab.test.tsx`:

```tsx
{{FILE:src/design/chrome/__tests__/WhatsAppFab.test.tsx}}
```

`src/design/chrome/__tests__/LanguageHint.test.tsx` — append at the end of the file (after Task 4's `LanguageHint link target` describe; the imports it already has — `screen`, `renderWithIntl`, `LanguageHint` — are all this case needs, so no import line changes):

```tsx
{{FILE:src/design/chrome/__tests__/LanguageHint.append.snippet.tsx}}
```

- [ ] **Step 2: Run tests to verify they fail**

`npx vitest run src/design/chrome/__tests__/StickyCtaBar.test.tsx src/design/chrome/__tests__/WhatsAppFab.test.tsx src/design/chrome/__tests__/LanguageHint.test.tsx` → StickyCtaBar: `isBarVisible`/`STICKY_CTA_HEIGHT_VAR` are not exported (import error); WhatsAppFab and LanguageHint: `expected '… bottom-[18px] …' to contain 'var(--sticky-cta-h,0px)'` (and the same for the sheet's `bottom-[calc(74px+…)]`).

- [ ] **Step 3: Implement**

`src/design/chrome/StickyCtaBar.tsx` (replace whole file — 56 lines, untouched by Tasks 1–4):

```tsx
{{FILE:src/design/chrome/StickyCtaBar.tsx}}
```

`src/design/chrome/LanguageHint.tsx` — in the sheet `<div role="region" …>` (the element whose comment block starts `// R45: out of flow`), replace the `className` string. Its current value (WP1, unchanged by Task 4) is:

```
fixed inset-x-3 bottom-[calc(74px+0.75rem+env(safe-area-inset-bottom))] z-[55] rounded-base border border-tint-border bg-tint shadow-card-hover lg:bottom-4 lg:left-1/2 lg:right-auto lg:w-[min(560px,calc(100%-2rem))] lg:-translate-x-1/2
```

and becomes (two tokens change: the mobile `bottom-[…]` gains `+var(--sticky-cta-h,0px)`; `lg:bottom-4` becomes `lg:bottom-[calc(1rem+var(--sticky-cta-h,0px))]`):

```
fixed inset-x-3 bottom-[calc(74px+0.75rem+env(safe-area-inset-bottom)+var(--sticky-cta-h,0px))] z-[55] rounded-base border border-tint-border bg-tint shadow-card-hover lg:bottom-[calc(1rem+var(--sticky-cta-h,0px))] lg:left-1/2 lg:right-auto lg:w-[min(560px,calc(100%-2rem))] lg:-translate-x-1/2
```

Extend the R45 comment above it with one line: `// W18: a page-mounted StickyCtaBar publishes its height as --sticky-cta-h; the sheet adds it so the two never overlap.`

`src/design/chrome/WhatsAppFab.tsx` (Task 3's `ContactLink` version) — in the `<ContactLink … className="…">` replace the token `bottom-[18px]` with `bottom-[calc(18px+var(--sticky-cta-h,0px))]`; the docblock above `export function WhatsAppFab` becomes:

```tsx
/** Only between the mobile bottom bar (≤900 px) and the social rail (≥1101 px). W18: lifts
 *  itself by the height a page-mounted StickyCtaBar publishes as `--sticky-cta-h`. */
```

- [ ] **Step 4: Run the tests + `npm run verify`**

`npx vitest run src/design/chrome src/analytics` → green (Header/Footer/SlimBar/nav/ctas/ConsentBanner/alternate-path/use-alternate-path/LanguageSwitcher suites unchanged; `useContactClick.test.tsx` unchanged). `npm run verify` → green.

- [ ] **Step 5: Commit**

```bash
git add src/test/bundle.ts src/design/chrome/StickyCtaBar.tsx src/design/chrome/LanguageHint.tsx src/design/chrome/WhatsAppFab.tsx src/design/chrome/__tests__/StickyCtaBar.test.tsx src/design/chrome/__tests__/WhatsAppFab.test.tsx src/design/chrome/__tests__/LanguageHint.test.tsx
git commit -m "feat(chrome): StickyCtaBar hideNearId + --sticky-cta-h publication; LanguageHint/WhatsAppFab stack above it (W18); testBundle helper

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

#### Cycle 5 — `ContactCta` (over Task 3's `ContactLink`, W32), `FaqBlock`, `Breadcrumbs`, `ClosingCtaBand` (+ two icons)

- [ ] **Step 1: Write the failing tests**

`src/design/blocks/__tests__/ContactCta.test.tsx`:

```tsx
{{FILE:src/design/blocks/__tests__/ContactCta.test.tsx}}
```

`src/design/blocks/__tests__/FaqBlock.test.tsx`:

```tsx
{{FILE:src/design/blocks/__tests__/FaqBlock.test.tsx}}
```

`src/design/blocks/__tests__/Breadcrumbs.test.tsx`:

```tsx
{{FILE:src/design/blocks/__tests__/Breadcrumbs.test.tsx}}
```

`src/design/blocks/__tests__/ClosingCtaBand.test.tsx`:

```tsx
{{FILE:src/design/blocks/__tests__/ClosingCtaBand.test.tsx}}
```

- [ ] **Step 2: Run tests to verify they fail**

`npx vitest run src/design/blocks` → every file fails to resolve its `../ContactCta` / `../FaqBlock` / `../Breadcrumbs` / `../ClosingCtaBand` import.

- [ ] **Step 3: Implement**

`src/design/chrome/icons.tsx` — append after `LinkedInIcon` (end of file today; Task 6 appends `XIcon`/`LinkIcon` after these later):

```tsx
{{FILE:src/design/chrome/icons.append.snippet.tsx}}
```

`src/design/blocks/ContactCta.tsx` (no directive — W32: `useContactClick` returns `(kind) => void` and lives inside Task 3's `ContactLink`, so this file never touches the hook itself):

```tsx
{{FILE:src/design/blocks/ContactCta.tsx}}
```

`src/design/blocks/FaqBlock.tsx`:

```tsx
{{FILE:src/design/blocks/FaqBlock.tsx}}
```

`src/design/blocks/Breadcrumbs.tsx`:

```tsx
{{FILE:src/design/blocks/Breadcrumbs.tsx}}
```

`src/design/blocks/ClosingCtaBand.tsx`:

```tsx
{{FILE:src/design/blocks/ClosingCtaBand.tsx}}
```

- [ ] **Step 4: Run the tests + `npm run verify`**

`npx vitest run src/design/blocks src/design/chrome src/analytics` → green (4 new suites, 9 tests). `npm run verify` → green. (jsdom may print `Not implemented: navigation` for the `tel:`/`mailto:` clicks in `ContactCta.test.tsx` — the native `preventDefault` in its `click()` helper suppresses it, exactly as in Task 3's `useContactClick.test.tsx`; if it still prints it is a virtual-console warning, not a failure.)

- [ ] **Step 5: Commit**

```bash
git add src/design/chrome/icons.tsx src/design/blocks/ContactCta.tsx src/design/blocks/FaqBlock.tsx src/design/blocks/Breadcrumbs.tsx src/design/blocks/ClosingCtaBand.tsx src/design/blocks/__tests__/ContactCta.test.tsx src/design/blocks/__tests__/FaqBlock.test.tsx src/design/blocks/__tests__/Breadcrumbs.test.tsx src/design/blocks/__tests__/ClosingCtaBand.test.tsx
git commit -m "feat(blocks): ContactCta over ContactLink (W12/W32), FaqBlock (+FAQPage), Breadcrumbs (+BreadcrumbList), ClosingCtaBand

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

#### Cycle 6 — `ProcessSteps`, `MetricStrip`, `OfficeCard` (rows = Task 1's schemas, W34)

- [ ] **Step 1: Write the failing tests**

`src/design/blocks/__tests__/ProcessSteps.test.tsx`:

```tsx
{{FILE:src/design/blocks/__tests__/ProcessSteps.test.tsx}}
```

`src/design/blocks/__tests__/MetricStrip.test.tsx`:

```tsx
{{FILE:src/design/blocks/__tests__/MetricStrip.test.tsx}}
```

`src/design/blocks/__tests__/OfficeCard.test.tsx`:

```tsx
{{FILE:src/design/blocks/__tests__/OfficeCard.test.tsx}}
```

- [ ] **Step 2: Run tests to verify they fail**

`npx vitest run src/design/blocks` → the three new files fail to resolve their imports; the Cycle 5 suites stay green.

- [ ] **Step 3: Implement**

`src/design/blocks/ProcessSteps.tsx`:

```tsx
{{FILE:src/design/blocks/ProcessSteps.tsx}}
```

`src/design/blocks/MetricStrip.tsx`:

```tsx
{{FILE:src/design/blocks/MetricStrip.tsx}}
```

`src/design/blocks/OfficeCard.tsx`:

```tsx
{{FILE:src/design/blocks/OfficeCard.tsx}}
```

- [ ] **Step 4: Run the tests + `npm run verify`**

`npx vitest run src/design/blocks` → green (7 suites). `npm run verify` → green.

- [ ] **Step 5: Commit**

```bash
git add src/design/blocks/ProcessSteps.tsx src/design/blocks/MetricStrip.tsx src/design/blocks/OfficeCard.tsx src/design/blocks/__tests__/ProcessSteps.test.tsx src/design/blocks/__tests__/MetricStrip.test.tsx src/design/blocks/__tests__/OfficeCard.test.tsx
git commit -m "feat(blocks): ProcessSteps, MetricStrip (metrics collection, unsigned hidden, unitId), OfficeCard (offices collection, own ids, ContactLink rows)

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

#### Cycle 7 — `ImageSlot` + `EmptyState` (W27) and `PostCard` (Task 1's `BlogPost`, W33/W55)

- [ ] **Step 1: Write the failing tests**

`src/design/blocks/__tests__/ImageSlot.test.tsx`:

```tsx
{{FILE:src/design/blocks/__tests__/ImageSlot.test.tsx}}
```

`src/design/blocks/__tests__/EmptyState.test.tsx`:

```tsx
{{FILE:src/design/blocks/__tests__/EmptyState.test.tsx}}
```

`src/design/blocks/__tests__/PostCard.test.tsx`:

```tsx
{{FILE:src/design/blocks/__tests__/PostCard.test.tsx}}
```

- [ ] **Step 2: Run tests to verify they fail**

`npx vitest run src/design/blocks` → the three new files fail to resolve their imports.

- [ ] **Step 3: Implement**

`src/design/blocks/ImageSlot.tsx`:

```tsx
{{FILE:src/design/blocks/ImageSlot.tsx}}
```

`src/design/blocks/EmptyState.tsx`:

```tsx
{{FILE:src/design/blocks/EmptyState.tsx}}
```

`src/design/blocks/PostCard.tsx`:

```tsx
{{FILE:src/design/blocks/PostCard.tsx}}
```

- [ ] **Step 4: Run the tests + `npm run verify`**

`npx vitest run src/design/blocks` → green (10 suites). `npm run verify` → green.

- [ ] **Step 5: Commit**

```bash
git add src/design/blocks/ImageSlot.tsx src/design/blocks/EmptyState.tsx src/design/blocks/PostCard.tsx src/design/blocks/__tests__/ImageSlot.test.tsx src/design/blocks/__tests__/EmptyState.test.tsx src/design/blocks/__tests__/PostCard.test.tsx
git commit -m "feat(blocks): ImageSlot (named placeholders, D26/W55), EmptyState (W6), PostCard over T0b's blog rows (W33)

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

#### Cycle 8 — `NewsletterBand`, `StoreBadges`, `LogoMarquee`, the blocks barrel

- [ ] **Step 1: Write the failing tests**

`src/design/blocks/__tests__/NewsletterBand.test.tsx`:

```tsx
{{FILE:src/design/blocks/__tests__/NewsletterBand.test.tsx}}
```

`src/design/blocks/__tests__/StoreBadges.test.tsx`:

```tsx
{{FILE:src/design/blocks/__tests__/StoreBadges.test.tsx}}
```

`src/design/blocks/__tests__/LogoMarquee.test.tsx`:

```tsx
{{FILE:src/design/blocks/__tests__/LogoMarquee.test.tsx}}
```

- [ ] **Step 2: Run tests to verify they fail**

`npx vitest run src/design/blocks` → the three new files fail to resolve their imports.

- [ ] **Step 3: Implement**

`src/design/blocks/NewsletterBand.tsx`:

```tsx
{{FILE:src/design/blocks/NewsletterBand.tsx}}
```

`src/design/blocks/StoreBadges.tsx`:

```tsx
{{FILE:src/design/blocks/StoreBadges.tsx}}
```

`src/design/blocks/LogoMarquee.tsx`:

```tsx
{{FILE:src/design/blocks/LogoMarquee.tsx}}
```

`src/design/blocks/index.ts`:

```ts
{{FILE:src/design/blocks/index.ts}}
```

- [ ] **Step 4: Run the tests + `npm run verify`**

`npx vitest run src/design/blocks` → green (13 suites). `npm run verify` → green.

- [ ] **Step 5: Commit**

```bash
git add src/design/blocks
git commit -m "feat(blocks): NewsletterBand (hidden in Phase A), StoreBadges (Android only), LogoMarquee, barrel

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

#### Cycle 9 — dev gallery (under `(site)/`, W41) + docs

- [ ] **Step 1: Write the failing test**

No unit test: the gallery is a dev-only route (R41, `notFound()` in production). The check is `npm run verify` (it must typecheck) and a manual open of `/dev/gallery` and `/en/dev/gallery` on `npm run dev` after the cycle, scrolling past 700 px to see the sticky bar with its live dot hide as `#gallery-end` nears the viewport, and the WhatsApp FAB (between 901 and 1100 px) lift above it.

- [ ] **Step 2: Run test to verify it fails**

`npm run typecheck` before the edit passes; after adding the `<Wp2Blocks>` reference to `page.tsx` without the file it fails with `Cannot find module './Wp2Blocks'` — that is the red step.

- [ ] **Step 3: Implement**

Confirm the path first: `git ls-files | grep 'dev/gallery/page.tsx'` must print `src/app/[locale]/(site)/dev/gallery/page.tsx` (Task 3 moved it). Never create a `page.tsx` at the old `src/app/[locale]/dev/gallery/` path — two pages for one URL fail `next build`.

`src/app/[locale]/(site)/dev/gallery/RadioChipsDemo.tsx`:

```tsx
{{FILE:src/app/[locale]/(site)/dev/gallery/RadioChipsDemo.tsx}}
```

`src/app/[locale]/(site)/dev/gallery/Wp2Blocks.tsx` (the contract import is six levels up from the `(site)` group, W41):

```tsx
{{FILE:src/app/[locale]/(site)/dev/gallery/Wp2Blocks.tsx}}
```

(`hire.249` is Hire Workers' WhatsApp hire prefill, `hire.252` its "ask" prefill, `hire.019` the licence chip, `home.294`–`home.305` the six homepage FAQ pairs, `home.104`–`home.118` the five process steps — all existing package ids, verified in `src/content/local/bundle.tr.json`; `makeTf` throws in dev on a typo, which is the point. `home.024`/`home.107`/`home.305` are among the 39 ids Task 1 re-authored with `{metric}` placeholders, so the gallery resolves through `makeTf`, never `makeT`.)

`src/app/[locale]/(site)/dev/gallery/page.tsx` — three sentence-anchored edits:
- After the line `import { DialogDemo } from './DialogDemo';` add `import { Wp2Blocks } from './Wp2Blocks';`.
- Immediately before the `<Block title="Chrome — LanguageSwitcher / NavLink / CookiePreferencesButton">` element insert `<Wp2Blocks bundle={bundle} locale={locale} />` (`bundle` and `locale` are the page's existing `getBundle(locale)` result and route param).
- In the `<StickyCtaBar` element at the bottom of the page add the props `hideNearId="gallery-end"` and `live` after `message={t('home.003')}`.

Docs (same commit; every anchor is a sentence — run `npx prettier --write docs/ARCHITECTURE.md docs/CONTENT-MODEL.md docs/SEO.md docs/ANALYTICS.md docs/PRD.md` afterwards so the tables realign):

`docs/ARCHITECTURE.md`
- § Design system: replace the paragraph that begins "`src/design/` — tokens (colour, type, radius, shadow per `design-package/README.md`'s Design Tokens section, scaled per D19)" (it ends "…`Stat`, `Tabs`, `Timeline`).") with this ONE paragraph (Task 6 appends its islands/assets paragraph after it, W45): "`src/design/` — tokens (colour, type, radius, shadow per `design-package/README.md`'s Design Tokens section, scaled per D19), `Archivo` via `next/font/google` (`latin` + `latin-ext` subsets, self-hosted), **14** accessible primitives in `src/design/primitives/` (`Accordion`, `Button` — variants `primary|secondary|ghost|danger|inverse` and the `buttonClassName` helper —, `Card`, `Chip`, `Dialog`, `Eyebrow`, `FormField` with label/error/`aria-live`, `PausableMarquee`, `RadioChips` (a `role="radiogroup"` of native radios), `Section` with tones `light|dark|pale|band`, `SkipLink`, `Stat` — `value` counts up, `text` renders verbatim, neither renders nothing (W1) —, `Tabs` with `onChange`, `Timeline` with a `horizontal` variant), and the **shared page blocks** in `src/design/blocks/` (WP2a T0d): `FaqBlock` + FAQPage node, `Breadcrumbs` + BreadcrumbList node, `ClosingCtaBand`, `ProcessSteps`, `MetricStrip` over the `metrics` collection (unsigned metrics skipped, W1), `OfficeCard` over `offices` (every text field the row's own package id, W34), `PostCard` over `blog` (`null` for a locale the post is not written in, W33), `NewsletterBand` (nothing while `active={false}`, W5), `StoreBadges` (Android only, W8), `LogoMarquee` (nothing without logos, W6), `EmptyState` (the designed empty state, W6 — `role="status"`, copy from the page's `sys.<page>.empty.*`) and `ImageSlot` (one image slot: `next/image` with the asset, else a gradient placeholder named `data-placeholder="<slot>"`, `data-lcp-slot` on the page's LCP slot — the D26 markup contract `scripts/placeholder-count.ts` counts, W27/W55). Blocks are server components — nothing under `src/design/blocks/` carries `'use client'` (W13); every CTA that may be a contact door renders through `ContactCta`, which wraps T0c's `ContactLink` in the `Button` face (`buttonClassName`) so a page-level WhatsApp/call/e-mail CTA fires its event with `placement: 'page_cta' | 'office_card'` (W12) and any other href is a plain `Button` link. Every block that takes `bundle` also takes `locale` and resolves package ids through `makeTf(bundle, locale)` (D17: a re-authored `{metric}` string renders its figure); composed block copy is `sys.blocks.*` (today only `readMinutes`), the breadcrumb landmark label `sys.nav.breadcrumbs`. `src/lib/format/date.ts` (`formatDate`, `formatMonth`, `formatReadMinutes`) is the date counterpart of `formatTRY`: TR `12 Ocak 2026`, EN `12 January 2026` (en-GB, day first), always UTC calendar dates; it imports both message files, so only server components and tests use it."
- § Chrome: replace the whole paragraph that begins "**`StickyCtaBar` exists but is not mounted anywhere in the shipped chrome**" (after Task 3 it ends with "(T0d resolves the stacking with `--sticky-cta-h`, W18)") with: "**`StickyCtaBar` is page-mounted** (never the layout — `[locale]/(site)/dev/gallery` shows it) and resolves its own stacking (**W18**, T0d): while visible it publishes its rendered height as `--sticky-cta-h` on `<html>` (`0px` otherwise, on unmount, and below `lg` where it is `display:none`); `LanguageHint` and `WhatsAppFab` add `var(--sticky-cta-h, 0px)` to their bottom offset, so the sheet and the FAB ride above the bar; `ConsentBanner` (z-60) is unchanged and still wins. `hideNearId` names the element the bar advertises (the page's form or section id): the bar hides while that element is within the lower tenth of the viewport or above it — the design's Hire Workers rule (`isBarVisible`) — so it never covers the form it points at. `live` renders the design's green dot."

`docs/CONTENT-MODEL.md`
- § The `sys.*` range, the "**Chrome:**" bullet: after "`nav.legal`" (Task 3's addition) add ", `nav.breadcrumbs` (the `<nav aria-label>` of the `Breadcrumbs` block)".
- Same bullet list, add a final bullet (after the last existing bullet — Task 2's `sys.form.*` bullet if it sits last, else the Thank-you one): "- **Blocks (WP2a T0d, W54):** `blocks.readMinutes` (ICU plural on `{n}`: `5 min read` / `5 dk okuma`, read through `formatReadMinutes`). `sys.blocks.*` is the namespace for copy a shared block in `src/design/blocks/` composes; a block never reads `sys.<page>.*` — page-specific copy (empty-state titles, CTA labels, FAQ pairs) is passed in by the page, resolved."
- § Chrome canonical ids table: append the rows `| OfficeCard — directions | home.192 | footDirections — shared with the footer |`, `| OfficeCard / bands — WhatsApp label | home.221 | ctaWa |`, `| OfficeCard — city / kind / address / hours | the row's own `cityId` / `labelId` / `addressId` + `addressLine2Id` / `hoursId` (contact.096–106, contact.133/134) | from the `offices` collection, W34 |`, `| PostCard — FEATURED pill | blog.034 | |`, `| PostCard — "also in Turkish/English" pills | blog.077 / blog.081 | |`, `| NewsletterBand — title/body/no-spam | blog.036 / blog.037 / blog.038 | |`, `| StoreBadges | hire.240 / hire.241 | same ids as the footer; English on TR by the importer's override (W7/W51) |`, and one sentence under the table (before "Anything the package does not carry at all is `sys.*`…"): "Blocks under `src/design/blocks/` follow the same rule as the chrome: one canonical id per shared string, resolved through `makeTf(bundle, locale)`; everything page-specific (FAQ pairs, step titles, CTA labels, empty-state copy) is passed in by the page as an id or a resolved string."
- § Adding copy (Task 1's section, which after W54 lists `sys.form.*`, `sys.<page>.*`, `sys.seo.*`, `sys.blocks.*` and `sys.nav.*`): append one sentence to its paragraph: "`sys.blocks.*` is written only by T0d's shared blocks (`src/design/blocks/`); a page task that needs a new composed string for a block adds it there and documents it in the Blocks bullet of § The `sys.*` range."

`docs/SEO.md` § JSON-LD: in the paragraph beginning "**Shipped** (`src/lib/seo/jsonld.ts`)" replace the clause "`breadcrumbJsonLd` and `faqJsonLd` (WP1; called by the WP2 `Breadcrumbs`/`FaqBlock` blocks)" with "`breadcrumbJsonLd` and `faqJsonLd` (WP1; rendered by the `Breadcrumbs`/`FaqBlock` blocks in `src/design/blocks/` since WP2a T0d — a page gets the node by mounting the block, never by calling the builder itself)".

`docs/ANALYTICS.md`
- § Event schema table: in the `call_click` row's "Fires on" cell replace "Phone tap/click (header, footer, mobile bottom bar, page CTAs)" with "Phone tap/click (chrome via `ContactLink`; page blocks via `ContactCta` — `page_cta`: `ClosingCtaBand`, `FaqBlock` ask card, `EmptyState`; `office_card`: `OfficeCard` rows)"; in the `whatsapp_click` row replace "WhatsApp CTA/FAB click" with "WhatsApp CTA/FAB click (chrome via `ContactLink`; page blocks via `ContactCta`, same placements)"; in the `email_click` row replace "`mailto:` link click" with "`mailto:` link click (chrome via `ContactLink`; page blocks via `ContactCta`/`OfficeCard`)".
- In the paragraph Task 3 rewrote ("**Wired today: `conversion`** … **and the three contact events** …"), replace the clause "`page_cta`/`office_card` by WP2b pages" with "`page_cta`/`office_card` by the shared blocks (T0d: `ContactCta` wraps `ContactLink` in the `Button` face for `ClosingCtaBand`, `FaqBlock`'s ask card and `EmptyState`; `OfficeCard`'s three contact rows are `ContactLink` with `office_card`)".

`docs/PRD.md` § 11 WP1 delivered, Design system bullet: replace "13 accessible primitives" with "14 accessible primitives (`RadioChips` joined in WP2a T0d) and the shared page blocks (`src/design/blocks/`)" — the rest of the bullet (Task 3's "901px (header row, W11) / 1101px (D19 scale, social rail) breakpoint scheme") stays.

- [ ] **Step 4: Run the tests + `npm run verify`**

`npx prettier --write "src/app/[locale]/(site)/dev/gallery/Wp2Blocks.tsx" "src/app/[locale]/(site)/dev/gallery/RadioChipsDemo.tsx" docs/ARCHITECTURE.md docs/CONTENT-MODEL.md docs/SEO.md docs/ANALYTICS.md docs/PRD.md` then `npm run verify` → green. `npm run dev` → open `http://localhost:3000/dev/gallery` and `/en/dev/gallery`: every new block renders from the real bundle (the OfficeCard/PostCard blocks say "collection is empty" only if `npm run content:import` was not re-run after Task 1); scroll past 700 px at ≥901 px width — the sticky bar shows with its dot and hides as `#gallery-end` reaches the lower tenth; between 901 and 1100 px the WhatsApp FAB sits above the bar; the language hint (English browser on `/dev/gallery`) sits above both. Revert the `nextjs-agent-rules` block `npm run dev` appends to `CLAUDE.md` before committing (repo rule).

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/dev/gallery" docs/ARCHITECTURE.md docs/CONTENT-MODEL.md docs/SEO.md docs/ANALYTICS.md docs/PRD.md
git commit -m "docs(design): gallery shows every WP2a block and variant; architecture/content-model/seo/analytics/prd updated for blocks, sticky stacking (W18), sys.blocks (W54)

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

**Docs in this task:**
- `docs/ARCHITECTURE.md` § Design system: the paragraph beginning "`src/design/` — tokens (colour, type, radius, shadow…" is replaced (14 primitives with the new tones/variants, the `src/design/blocks/` catalogue incl. `EmptyState`/`ImageSlot`, `ContactCta` over `ContactLink` + placements, the `makeTf` rule, `src/lib/format/date.ts`); § Chrome: the paragraph beginning "**`StickyCtaBar` exists but is not mounted anywhere in the shipped chrome**" is replaced by the W18 resolution + `hideNearId`/`live` (Cycle 9).
- `docs/CONTENT-MODEL.md` § The `sys.*` range: "**Chrome:**" bullet gains `nav.breadcrumbs`; a new "**Blocks (WP2a T0d, W54):**" bullet; § Chrome canonical ids: seven block rows + the "blocks follow the chrome rule" sentence; § Adding copy: one sentence on who writes `sys.blocks.*` (Cycle 9).
- `docs/SEO.md` § JSON-LD: the "`breadcrumbJsonLd` and `faqJsonLd` (WP1; called by the WP2 `Breadcrumbs`/`FaqBlock` blocks)" clause → rendered by the two blocks (Cycle 9).
- `docs/ANALYTICS.md` § Event schema: the three contact rows' "Fires on" cells name `ContactCta`/`OfficeCard`; the "`page_cta`/`office_card` by WP2b pages" clause → by the shared blocks (Cycle 9).
- `docs/PRD.md` § 11 Design system bullet: "13 accessible primitives" → "14 accessible primitives (…) and the shared page blocks" (Cycle 9).

**Produces — deviations:** (1) Every id-taking block (`FaqBlock`, `ClosingCtaBand`, `ProcessSteps`, `MetricStrip`, `OfficeCard`, `PostCard`, `NewsletterBand`, `StoreBadges`) takes `bundle: Bundle` AND `locale: Locale` and resolves ids through Task 1's `makeTf(bundle, locale)`, not `makeT` — the skeleton listed ids without a resolver, and D17's re-authored `{metric}` strings (home.024/107/305, hire.198-class reply times) would otherwise render raw tokens. (2) `ContactCta` is not `ButtonProps & { placement }` with a `MouseEventHandler` (the draft's shape, refused by W32): it wraps Task 3's `ContactLink` in `buttonClassName(variant, size)` for a contact href and falls back to a plain `Button` for any other href, so it has no directive and the blocks folder ships no client component of its own; `isContactHref` is gone — `contactKindOf` (Task 3) is the one classifier. (3) `OfficeCard` renders the row's `labelId`/`addressLine2Id`/`hoursId` (W34) — no `KIND_LABEL_ID`, no `sys.office.hours`, no `formatWeekdays` (dropped from `date.ts`); its three contact rows are `ContactLink` (`office_card`) directly. (4) `PostCard` follows Task 1's `BlogPost` (`title/excerpt/slug` per locale, `categoryLabelId`, `key`; W33), returns `null` for an unwritten locale, and takes `coverSrc?: string | null` rendered through `ImageSlot` `blog-cover-<key>` instead of a `cover?: ReactNode` slot (W27/W55 — the placeholder is named). (5) New per W27: `ImageSlot` and `EmptyState` (`tone` optional with `'light'`, `headingLevel` and `className` added; `cta.external` added). (6) `sys.readMinutes` → `sys.blocks.readMinutes` (W54); `sys.office.*` removed. (7) `FaqBlock` takes `locale` (see 1) and its ask card carries `whatsappText` + `whatsappLabelId` (+ optional `phone`/`callLabelId`) because a WhatsApp link needs a prefill and a label; `ProcessSteps.variant` is `'cards' | 'plain'`; `ProcessStep.when` is a resolved string; `Breadcrumbs` items are `{ name; href: Href }` with the current page included and it takes `locale`; `NewsletterBand` is `{ bundle; locale; active; id?; children? }` (the page mounts its own `<FormShell>`); `StoreBadges` types `ios?: string | null`; `LogoMarquee` logos are `{ src; alt; width; height }` and it reads `sys.marquee.*` itself. (8) `Stat` gains `tone`; `StickyCtaBar` gains `live` and exports `isBarVisible`/`STICKY_CTA_HEIGHT_VAR`/`StickyCta`; `Button` gains `inverse`; `RadioChips` gains `legendHidden?`/`className?`; the blocks barrel re-exports Task 1's `BlogPost`/`Metric`/`MetricKey`/`Office` types rather than defining its own. (9) `src/test/bundle.ts` (`testBundle`, `BLOCK_STRINGS`) is an added test helper.
