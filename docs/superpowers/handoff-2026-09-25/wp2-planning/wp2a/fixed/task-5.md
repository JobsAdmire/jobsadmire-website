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
- **Task 4**: `LanguageHint.tsx` keeps the sheet's `role="region"` and its WP1 `className`; `LanguageHint.test.tsx` already imports `screen`/`renderWithIntl`/`LanguageHint`/`shouldShowHint` and has the `LanguageHint link target` describe (its cases render `<LanguageHint locale="tr" />` eligible under jsdom — the new case does the same). `docs/SEO.md` § JSON-LD (Task 4's rewritten "**Shipped** (`src/lib/seo/jsonld.ts`)" paragraph) keeps the WP1 sentence "`breadcrumbJsonLd` and `faqJsonLd` are written but not yet called from any page" verbatim — Task 4 leaves it precisely so this task's Cycle 9 edit can anchor on it.
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
import { describe, expect, it } from 'vitest';
import { formatDate, formatMonth, formatReadMinutes } from './date';

describe('formatDate', () => {
  it('Turkish: day, month name, year', () => {
    expect(formatDate('2026-01-12', 'tr')).toBe('12 Ocak 2026');
  });
  it('English: day first, no comma (the design bylines)', () => {
    expect(formatDate('2026-01-12T10:00:00.000Z', 'en')).toBe('12 January 2026');
  });
  it('treats a date-only ISO string as a calendar date, never shifted by the runtime zone', () => {
    expect(formatDate('2026-12-31', 'en')).toBe('31 December 2026');
  });
  it('rejects a non-date', () => {
    expect(() => formatDate('nope', 'tr')).toThrow(RangeError);
  });
});

describe('formatMonth', () => {
  it('month + year per locale (D17 dated labels)', () => {
    expect(formatMonth('2026-01-12', 'tr')).toBe('Ocak 2026');
    expect(formatMonth('2026-01-12', 'en')).toBe('January 2026');
  });
});

describe('formatReadMinutes (sys.blocks.readMinutes ICU, W54)', () => {
  it('English', () => {
    expect(formatReadMinutes(5, 'en')).toBe('5 min read');
    expect(formatReadMinutes(1, 'en')).toBe('1 min read');
  });
  it('Turkish', () => {
    expect(formatReadMinutes(5, 'tr')).toBe('5 dk okuma');
  });
  it('never renders 0 minutes', () => {
    expect(formatReadMinutes(0.2, 'en')).toBe('1 min read');
  });
});
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
import { createTranslator, type Messages } from 'next-intl';
import type { Locale } from '@/i18n/routing';
import en from '@/messages/en.json';
import tr from '@/messages/tr.json';

/** `en-GB`, not `en-US`: the design's bylines read "12 January 2026" (day first, no comma). */
const INTL: Record<Locale, string> = { tr: 'tr-TR', en: 'en-GB' };
// `Messages` (next-intl's un-augmented `Record<string, any>`) keeps `createTranslator`'s key
// typing loose, exactly as `useTranslations('sys')` is typed everywhere else in this repo.
const MESSAGES: Record<Locale, Messages> = { tr, en };

function parseIso(iso: string): Date {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) throw new RangeError(`not an ISO date: ${iso}`);
  return d;
}

/** TR `12 Ocak 2026`, EN `12 January 2026`. Dates are calendar dates: formatted in UTC so a
 *  date-only ISO string (`2026-01-12`) never slips a day in a western-hemisphere runtime. */
export function formatDate(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(INTL[locale], {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(parseIso(iso));
}

/** TR `Ocak 2026`, EN `January 2026` — for "Updated January 2026"-style dated labels (D17:
 *  rendered from `RateConfig.effectiveFrom`/`publishedAt`, never typed into copy). */
export function formatMonth(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(INTL[locale], {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(parseIso(iso));
}

/** `sys.blocks.readMinutes` (ICU plural, W54): EN `5 min read`, TR `5 dk okuma`. Both message
 *  files are imported here, so a client island must never import this module — the block that
 *  needs it (`PostCard`) is a server component, and tests run it directly. */
export function formatReadMinutes(n: number, locale: Locale): string {
  const t = createTranslator({ locale, messages: MESSAGES[locale], namespace: 'sys.blocks' });
  return t('readMinutes', { n: Math.max(1, Math.round(n)) });
}
```

(No `formatWeekdays`: W34 dropped the composed office hours — `OfficeCard` renders the package's own `hoursId` string — and the Contact page's live open/closed pill reads `office.hours.days` (JS `getDay()` 0–6, W43) in its own island; nothing formats weekday names.)

- [ ] **Step 4: Run the tests + `npm run verify`**

`npx vitest run src/lib/format/date.test.ts src/messages/messages.test.ts` → `date.test.ts` 8 passed, `messages.test.ts` (Task 2's parity test) still green. `npm run verify` → green (typecheck, lint, prettier, vitest).

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
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Section } from '../Section';

describe('Section tones', () => {
  it.each([
    ['light', 'bg-white'],
    ['dark', 'bg-navy'],
    ['pale', 'bg-pale-1'],
    ['band', 'bg-white'],
  ] as const)('%s sets its surface class', (tone, cls) => {
    const { container } = render(
      <Section tone={tone} id="s">
        x
      </Section>,
    );
    expect(container.querySelector('section#s')).toHaveClass(cls);
  });

  it('band is the tighter wrapper that hosts one full-width card', () => {
    const { container } = render(<Section tone="band">x</Section>);
    const section = container.querySelector('section')!;
    expect(section).toHaveClass('py-10');
    expect(section).not.toHaveClass('py-16');
  });
});
```

`src/design/primitives/__tests__/Stat.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Stat } from '../Stat';

describe('Stat', () => {
  it('formats a numeric value per locale with prefix and suffix (D18)', () => {
    render(<Stat value={1240} prefix="~" suffix="+" label="placed" locale="tr" />);
    // the sr-only span carries the final value; the animated span repeats it aria-hidden
    expect(screen.getAllByText('~1.240+')).toHaveLength(2);
  });

  it('renders text verbatim and never counts up when text is given', () => {
    const { container } = render(<Stat text="6–8" suffix=" weeks" label="first day" locale="en" />);
    expect(screen.getByText('6–8 weeks')).toBeInTheDocument();
    expect(container.querySelector('[aria-hidden="true"]')).toBeNull();
  });

  it('renders nothing without a value or a text — an unsigned metric is hidden (W1)', () => {
    const { container } = render(<Stat label="x" locale="en" />);
    expect(container).toBeEmptyDOMElement();
  });

  it('dark tone swaps the label colour for a navy surface', () => {
    render(<Stat value={13} label="countries" locale="en" tone="dark" />);
    expect(screen.getByText('countries')).toHaveClass('text-white/55');
  });
});
```

`src/design/primitives/__tests__/Timeline.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Timeline } from '../Timeline';

const steps = [
  { when: '01', title: 'First', body: 'a' },
  { title: 'Second', body: 'b' },
];

describe('Timeline', () => {
  it('defaults to the vertical rail with one h3 per step', () => {
    render(<Timeline steps={steps} />);
    const list = screen.getByRole('list');
    expect(list).toHaveAttribute('data-variant', 'vertical');
    expect(list).toHaveClass('border-l');
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(2);
  });

  it('horizontal variant lays the steps out as a row grid from md up', () => {
    render(<Timeline steps={steps} variant="horizontal" />);
    const list = screen.getByRole('list');
    expect(list).toHaveAttribute('data-variant', 'horizontal');
    expect(list).toHaveClass('md:grid-flow-col');
    expect(list).not.toHaveClass('border-l');
    expect(screen.getByText('01')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

`npx vitest run src/design/primitives/__tests__/Section.test.tsx src/design/primitives/__tests__/Stat.test.tsx src/design/primitives/__tests__/Timeline.test.tsx` → Section: `pale`/`band` render `bg-white` (2 failures); Stat: `text` is an unknown prop, `container` is not empty, no `text-white/55` (3 failures); Timeline: no `data-variant` (2 failures).

- [ ] **Step 3: Implement**

`src/design/primitives/Section.tsx` (replace whole file — 22 lines, untouched by Tasks 1–4):

```tsx
import type { ReactNode } from 'react';

export type SectionTone = 'light' | 'dark' | 'pale' | 'band';

/** The design's three surfaces (white, navy, the pale #f4f9fc blocks such as FAQ/process/
 *  offices) plus `band`: a white wrapper with tighter vertical padding that hosts one
 *  full-width rounded card (ClosingCtaBand, NewsletterBand). Desktop paddings are the
 *  package's 84 px / 48–72 px × 0.75 (D19). No inner container — pages wrap content in
 *  `container-site` themselves. */
const TONE: Record<SectionTone, string> = {
  light: 'bg-white text-ink py-16',
  dark: 'bg-navy text-white py-16',
  pale: 'bg-pale-1 text-ink py-16',
  band: 'bg-white text-ink py-10',
};

export function Section({
  tone,
  id,
  className,
  children,
}: {
  tone: SectionTone;
  id?: string;
  className?: string;
  children?: ReactNode;
}) {
  const cls = [TONE[tone], className].filter(Boolean).join(' ');
  return (
    <section id={id} className={cls}>
      {children}
    </section>
  );
}
```

`src/design/primitives/Stat.tsx` (replace whole file — 76 lines, untouched by Tasks 1–4):

```tsx
'use client';
import { useEffect, useRef, useState } from 'react';
import type { Locale } from '@/i18n/routing';
import { formatInt } from '@/lib/format/money';

const DURATION_MS = 900;

/**
 * D18: a numeric `value` is always rendered through `formatInt`; a `text` metric (a range
 * such as "6–8", W1) is rendered verbatim and never animated. Neither → nothing: an unsigned
 * metric is hidden, not shown as 0.
 * D20/R18: the final value ships in the server HTML and is the accessible name (a
 * visually-hidden span); the count-up animates a separate `aria-hidden` span only after
 * mount, only when motion is not reduced, and only once in view.
 */
export function Stat({
  value,
  text,
  prefix = '',
  suffix = '',
  label,
  locale,
  tone = 'light',
}: {
  value?: number;
  text?: string;
  prefix?: string;
  suffix?: string;
  label: string;
  locale: Locale;
  tone?: 'light' | 'dark';
}) {
  const ref = useRef<HTMLDivElement>(null);
  // `null` until the count-up actually runs, so a changed `value` is shown immediately when
  // motion is reduced or no IntersectionObserver exists — state is never seeded from the prop.
  const [animated, setAnimated] = useState<number | null>(null);
  // Only a numeric metric without text animates; the effect below is a no-op otherwise.
  const numeric = text === undefined ? value : undefined;

  useEffect(() => {
    const node = ref.current;
    if (!node || numeric === undefined) return;
    if (typeof window.matchMedia !== 'function') return; // R18 guard (jsdom has none)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (typeof IntersectionObserver !== 'function') return;

    let frame = 0;
    let started = false;
    const step = (start: number) => (now: number) => {
      const p = Math.min(1, (now - start) / DURATION_MS);
      setAnimated(Math.round(numeric * (1 - Math.pow(1 - p, 3))));
      if (p < 1) frame = requestAnimationFrame(step(start));
    };
    const observer = new IntersectionObserver(
      (entries) => {
        if (started || !entries.some((e) => e.isIntersecting)) return;
        started = true;
        observer.disconnect();
        setAnimated(0);
        frame = requestAnimationFrame(step(performance.now()));
      },
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [numeric]);

  if (text === undefined && value === undefined) return null;

  const labelCls =
    tone === 'dark' ? 'text-body-sm text-white/55' : 'text-body-sm text-text-secondary';
  const figureCls =
    tone === 'dark' ? 'text-stat font-extrabold text-white' : 'text-stat font-extrabold';

  return (
    <div ref={ref}>
      <p className={figureCls}>
        {text !== undefined ? (
          <span>
            {prefix}
            {text}
            {suffix}
          </span>
        ) : (
          <>
            <span aria-hidden="true">
              {prefix}
              {formatInt(animated ?? (value as number), locale)}
              {suffix}
            </span>
            <span className="sr-only">
              {prefix}
              {formatInt(value as number, locale)}
              {suffix}
            </span>
          </>
        )}
      </p>
      <p className={labelCls}>{label}</p>
    </div>
  );
}
```

`src/design/primitives/Timeline.tsx` (replace whole file — 19 lines):

```tsx
export type TimelineStep = { when?: string; title: string; body: string };

const LIST = {
  vertical: 'm-0 list-none space-y-6 border-l border-border-1 pl-6',
  // Stacked below md, one column per step from md up; each step carries its own top rule.
  horizontal: 'm-0 grid list-none gap-6 p-0 md:grid-flow-col md:auto-cols-fr',
} as const;

const ITEM = { vertical: '', horizontal: 'border-t-2 border-tint-border pt-4' } as const;

/** The plain timeline (About's journey, the calculator's route tabs). Numbered dots, `when`
 *  pills and cards belong to `ProcessSteps` in `src/design/blocks`. */
export function Timeline({
  steps,
  variant = 'vertical',
}: {
  steps: TimelineStep[];
  variant?: 'vertical' | 'horizontal';
}) {
  return (
    <ol data-variant={variant} className={LIST[variant]}>
      {steps.map((s, i) => (
        <li key={`${i}-${s.title}`} className={ITEM[variant]}>
          {s.when ? (
            <p className="text-eyebrow font-extrabold uppercase tracking-[1.6px] text-blue-safe">
              {s.when}
            </p>
          ) : null}
          <h3 className="text-card-title">{s.title}</h3>
          <p className="text-body-sm text-text-secondary">{s.body}</p>
        </li>
      ))}
    </ol>
  );
}
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
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Tabs } from '../Tabs';

const tabs = [
  { id: 'a', label: 'A', panel: <p>pa</p> },
  { id: 'b', label: 'B', panel: <p>pb</p> },
];

describe('Tabs', () => {
  it('reports selection changes through onChange — click and arrow keys alike', async () => {
    const onChange = vi.fn();
    render(<Tabs tabs={tabs} defaultId="a" onChange={onChange} />);
    await userEvent.click(screen.getByRole('tab', { name: 'B' }));
    expect(onChange).toHaveBeenLastCalledWith('b');
    expect(screen.getByRole('tab', { name: 'B' })).toHaveAttribute('aria-selected', 'true');
    await userEvent.keyboard('{ArrowLeft}');
    expect(onChange).toHaveBeenLastCalledWith('a');
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it('works without onChange (every existing caller)', async () => {
    render(<Tabs tabs={tabs} defaultId="a" />);
    await userEvent.click(screen.getByRole('tab', { name: 'B' }));
    expect(screen.getByRole('tabpanel')).toHaveTextContent('pb');
  });
});
```

`src/design/primitives/__tests__/RadioChips.test.tsx`:

```tsx
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { RadioChips } from '../RadioChips';

const options = [
  { value: 'general', label: 'General' },
  { value: 'skilled', label: 'Skilled' },
  { value: 'specialist', label: 'Specialist' },
];

function Harness({ initial = 'general' }: { initial?: string | null }) {
  const [value, setValue] = useState<string | null>(initial);
  return (
    <form>
      <RadioChips name="role" legend="Role" options={options} value={value} onChange={setValue} />
    </form>
  );
}

describe('RadioChips', () => {
  it('is a labelled radiogroup of native radios', async () => {
    render(<Harness />);
    const group = screen.getByRole('radiogroup', { name: 'Role' });
    expect(within(group).getByRole('radio', { name: 'General' })).toBeChecked();
    await userEvent.click(within(group).getByRole('radio', { name: 'Skilled' }));
    expect(within(group).getByRole('radio', { name: 'Skilled' })).toBeChecked();
    expect(within(group).getByRole('radio', { name: 'General' })).not.toBeChecked();
  });

  it('submits under `name` like any radio, so it can sit inside a FormShell', () => {
    render(<Harness initial="specialist" />);
    const checked = document.querySelector<HTMLInputElement>('input[name="role"]:checked')!;
    expect(checked.value).toBe('specialist');
  });

  it('starts with nothing selected when value is null', () => {
    render(<Harness initial={null} />);
    expect(document.querySelector('input[name="role"]:checked')).toBeNull();
  });

  it('hides the legend visually but not from AT when asked', () => {
    render(
      <RadioChips
        name="x"
        legend="Hidden legend"
        legendHidden
        options={options}
        value={null}
        onChange={() => {}}
      />,
    );
    expect(screen.getByRole('radiogroup', { name: 'Hidden legend' })).toBeInTheDocument();
    expect(screen.getByText('Hidden legend')).toHaveClass('sr-only');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

`npx vitest run src/design/primitives/__tests__/Tabs.test.tsx src/design/primitives/__tests__/RadioChips.test.tsx` → Tabs: `onChange` never called (1 failure); RadioChips: `Failed to resolve import "../RadioChips"`.

- [ ] **Step 3: Implement**

`src/design/primitives/Tabs.tsx` (replace whole file — 70 lines, untouched by Tasks 1–4; the only behavioural change is the `select()` helper that `onClick` and the arrow/Home/End handler both call):

```tsx
'use client';
import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';

export type TabItem = { id: string; label: string; panel: ReactNode };

export function Tabs({
  tabs,
  defaultId,
  onChange,
}: {
  tabs: TabItem[];
  defaultId: string;
  /** Fired after every selection change (click, arrows, Home/End) with the new tab id —
   *  for a page island that mirrors the tab in its own state (route tabs, calculator modes). */
  onChange?: (id: string) => void;
}) {
  const base = useId();
  const listRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState(defaultId);
  // A `defaultId` matching no tab would leave every tab at tabIndex -1 with no panel open,
  // making the tablist unreachable by keyboard: fall back to the first tab.
  const active = tabs.some((t) => t.id === selected) ? selected : (tabs[0]?.id ?? '');

  const select = (id: string) => {
    setSelected(id);
    onChange?.(id);
  };

  // Roving tabindex: only the selected tab is in the tab order; arrows/Home/End move
  // selection and focus together (WAI-ARIA tabs pattern, automatic activation).
  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const current = tabs.findIndex((t) => t.id === active);
    let next = -1;
    if (e.key === 'ArrowRight') next = (current + 1) % tabs.length;
    else if (e.key === 'ArrowLeft') next = (current - 1 + tabs.length) % tabs.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = tabs.length - 1;
    if (next < 0 || tabs.length === 0) return;
    e.preventDefault();
    select(tabs[next].id);
    listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
  };

  return (
    <div>
      <div ref={listRef} role="tablist" className="flex flex-wrap gap-2">
        {tabs.map((t) => {
          const selected = t.id === active;
          return (
            <button
              key={t.id}
              id={`${base}-${t.id}-tab`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`${base}-${t.id}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => select(t.id)}
              onKeyDown={onKeyDown}
              className={[
                'min-h-[44px] rounded-pill px-4 text-body-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe',
                selected ? 'bg-tint text-blue-safe' : 'text-text-secondary hover:bg-pale-1',
              ].join(' ')}
            >
              {t.label}
            </button>
          );
        })}
      </div>
      {tabs.map((t) => (
        <div
          key={t.id}
          id={`${base}-${t.id}-panel`}
          role="tabpanel"
          aria-labelledby={`${base}-${t.id}-tab`}
          hidden={t.id !== active}
          tabIndex={0}
          className="pt-6"
        >
          {t.panel}
        </div>
      ))}
    </div>
  );
}
```

`src/design/primitives/RadioChips.tsx` (new):

```tsx
'use client';
import { useId } from 'react';

export type RadioChipOption = { value: string; label: string };

/** Single-select chips (calculator role, blog category, form option sets). Native radios in a
 *  `role="radiogroup"` fieldset: arrow keys, focus and form submission under `name` come for
 *  free, and a FormShell form posts the chosen value like any other field. The chip face is
 *  the `Chip` primitive's, driven by the radio's checked state. */
export function RadioChips({
  name,
  options,
  value,
  onChange,
  legend,
  legendHidden = false,
  className,
}: {
  name: string;
  options: RadioChipOption[];
  value: string | null;
  onChange: (value: string) => void;
  legend: string;
  legendHidden?: boolean;
  className?: string;
}) {
  const base = useId();
  const legendId = `${base}-legend`;
  return (
    <fieldset
      role="radiogroup"
      aria-labelledby={legendId}
      className={['m-0 min-w-0 border-0 p-0', className].filter(Boolean).join(' ')}
    >
      <legend
        id={legendId}
        className={
          legendHidden
            ? 'sr-only'
            : 'mb-2 text-eyebrow font-extrabold uppercase tracking-[1.6px] text-blue-safe'
        }
      >
        {legend}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const id = `${base}-${o.value}`;
          const checked = o.value === value;
          return (
            <label key={o.value} htmlFor={id} className="relative inline-flex">
              <input
                id={id}
                type="radio"
                name={name}
                value={o.value}
                checked={checked}
                onChange={() => onChange(o.value)}
                className="peer sr-only"
              />
              <span
                className={[
                  'inline-flex min-h-[44px] cursor-pointer items-center rounded-pill border px-4 text-body-sm font-bold transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue-safe',
                  checked
                    ? 'border-tint-border bg-tint text-blue-safe'
                    : 'border-border-1 bg-white text-text-secondary hover:bg-pale-1',
                ].join(' ')}
              >
                {o.label}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
```

`src/design/primitives/Button.tsx` — replace only the `export type ButtonVariant = …` line and the `const VARIANT: Record<ButtonVariant, string> = { … };` block that follows it (the first two statements after the imports; Task 3's `SIZE`/`BASE`/`buttonClassName`/`ButtonProps`/`Button` below them stay exactly as Task 3 left them):

```tsx
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'inverse';

const VARIANT: Record<ButtonVariant, string> = {
  // D20: white on the raw brand blue (#1899d5) is 3.2:1 — enough for large text, not for
  // a 15 px button label. The contrast-safe blue is the CTA face; `blue` survives as a
  // decorative/hover surface behind icons only.
  primary: 'bg-blue-safe text-white hover:bg-ink',
  secondary: 'border border-border-1 bg-white text-ink hover:border-tint-border hover:bg-pale-1',
  ghost: 'text-blue-safe hover:bg-tint',
  danger: 'bg-danger text-white hover:opacity-90',
  // The design's translucent white outline on navy/gradient bands (ClosingCtaBand's
  // WhatsApp/Telegram/call buttons): white text on navy is 15:1, the face only frames it.
  inverse: 'border border-white/30 bg-white/10 text-white hover:bg-white/20',
};
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
import fixture from '../../contract/website-bundle.v1.fixture.json';
import { BundleSchema, type Bundle } from '../../contract/website-bundle.v1';

/** R13: a parsed bundle, never a cast. The golden fixture carries 20 strings and empty
 *  collections; a test adds exactly the ids and rows the component under test reads —
 *  `makeT` throws on an unknown id outside production, so a missing id fails the test, and
 *  `getCollection` throws on a row that misses T0b's schema, so a stale row fails it too. */
export function testBundle(
  overrides: {
    strings?: Record<string, string>;
    collections?: Bundle['collections'];
    settings?: Partial<Bundle['settings']>;
  } = {},
): Bundle {
  return BundleSchema.parse({
    ...fixture,
    strings: { ...fixture.strings, ...overrides.strings },
    collections: { ...fixture.collections, ...overrides.collections },
    settings: { ...fixture.settings, ...overrides.settings },
  });
}

/** The chrome ids the shared blocks read by canonical id (R15) — one place to keep them. */
export const BLOCK_STRINGS: Record<string, string> = {
  'home.192': 'Yol tarifi alın',
  'home.221': "WhatsApp'tan yazın",
  'hire.240': 'Get it on Google Play',
  'hire.241': 'Download on the App Store',
  'blog.034': 'ÖNE ÇIKAN',
  'blog.077': "Türkçe'de de var",
  'blog.081': "İngilizce'de de var",
  'blog.036': 'Ayda bir işe alım içgörüleri',
  'blog.037': 'Çalışma izni güncellemeleri — doğrudan e-postanıza.',
  'blog.038': 'Spam yok, dilediğiniz zaman çıkabilirsiniz.',
};
```

`src/design/chrome/__tests__/StickyCtaBar.test.tsx`:

```tsx
import { act, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { isBarVisible, STICKY_CTA_HEIGHT_VAR, StickyCtaBar } from '../StickyCtaBar';
import { renderWithIntl } from '@/test/render';

const ctas = [{ label: 'Request', href: '/hire-workers' }];

function setScroll(y: number) {
  Object.defineProperty(window, 'scrollY', { configurable: true, value: y });
  act(() => {
    window.dispatchEvent(new Event('scroll'));
  });
}

function placeTarget(top: number) {
  let el = document.getElementById('request-form');
  if (!el) {
    el = document.createElement('div');
    el.id = 'request-form';
    document.body.appendChild(el);
  }
  el.getBoundingClientRect = () => ({ top }) as DOMRect;
}

const readVar = () => document.documentElement.style.getPropertyValue(STICKY_CTA_HEIGHT_VAR);

beforeEach(() => {
  // jsdom lays nothing out; the bar's published height is whatever offsetHeight reports.
  vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(64);
  setScroll(0);
});
afterEach(() => {
  vi.restoreAllMocks();
  document.getElementById('request-form')?.remove();
  document.documentElement.style.removeProperty(STICKY_CTA_HEIGHT_VAR);
});

describe('isBarVisible (the Hire Workers rule)', () => {
  it('needs the scroll threshold, then hides once the target nears the viewport', () => {
    expect(isBarVisible(100, 700, null, 800)).toBe(false);
    expect(isBarVisible(900, 700, null, 800)).toBe(true);
    expect(isBarVisible(900, 700, 2000, 800)).toBe(true); // target far below
    expect(isBarVisible(900, 700, 720, 800)).toBe(true); // exactly 90% — still shown
    expect(isBarVisible(900, 700, 719, 800)).toBe(false); // inside the lower 10%
    expect(isBarVisible(900, 700, -300, 800)).toBe(false); // scrolled past the target
  });
});

describe('StickyCtaBar', () => {
  it('appears after showAfterPx and publishes its height on <html> (W18)', () => {
    renderWithIntl(<StickyCtaBar message="Need workers?" ctas={ctas} />);
    expect(screen.queryByRole('link', { name: 'Request' })).toBeNull();
    expect(readVar()).toBe('0px');
    setScroll(800);
    expect(screen.getByRole('link', { name: 'Request' })).toHaveAttribute('href', '/isci-talebi');
    expect(readVar()).toBe('64px');
    setScroll(100);
    expect(screen.queryByRole('link', { name: 'Request' })).toBeNull();
    expect(readVar()).toBe('0px');
  });

  it('hides while the hideNearId target is within the lower 10% of the viewport', () => {
    placeTarget(2000);
    renderWithIntl(<StickyCtaBar message="m" ctas={ctas} hideNearId="request-form" />);
    setScroll(800);
    expect(screen.getByRole('link', { name: 'Request' })).toBeInTheDocument();
    placeTarget(300);
    setScroll(1200);
    expect(screen.queryByRole('link', { name: 'Request' })).toBeNull();
    expect(readVar()).toBe('0px');
  });

  it('resets the variable on unmount', () => {
    const view = renderWithIntl(<StickyCtaBar message="m" ctas={ctas} />);
    setScroll(800);
    expect(readVar()).toBe('64px');
    view.unmount();
    expect(readVar()).toBe('0px');
  });

  it('renders the live dot only when asked', () => {
    renderWithIntl(<StickyCtaBar message="m" ctas={ctas} live />);
    setScroll(800);
    expect(document.querySelector('[data-live-dot]')).not.toBeNull();
  });
});
```

`src/design/chrome/__tests__/WhatsAppFab.test.tsx`:

```tsx
import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { WhatsAppFab } from '../WhatsAppFab';
import { testBundle } from '@/test/bundle';
import { renderWithIntl } from '@/test/render';

// R13: a parsed bundle, never a cast. The FAB reads one id (home.221); the fixture's 20
// strings gain exactly that one. It renders through T0c's ContactLink, whose hook needs the
// intl provider (`useLocale`) — `renderWithIntl` supplies it, next/navigation's pathname is
// null outside the App Router and falls back to '/'.
const bundle = testBundle({ strings: { 'home.221': "WhatsApp'tan yazın" } });

describe('WhatsAppFab', () => {
  it('sits above a mounted StickyCtaBar (W18)', () => {
    renderWithIntl(<WhatsAppFab bundle={bundle} />);
    const fab = screen.getByRole('link', { name: "WhatsApp'tan yazın" });
    expect(fab.className).toContain('var(--sticky-cta-h,0px)');
    expect(fab).toHaveAttribute('target', '_blank');
  });
});
```

`src/design/chrome/__tests__/LanguageHint.test.tsx` — append at the end of the file (after Task 4's `LanguageHint link target` describe; the imports it already has — `screen`, `renderWithIntl`, `LanguageHint` — are all this case needs, so no import line changes):

```tsx
describe('LanguageHint stacking (W18)', () => {
  it('offsets the sheet above a mounted StickyCtaBar', () => {
    // Eligible for the same reasons as the cases above: jsdom's navigator.languages is
    // ['en-US', 'en'] and the storage read falls into its catch, so "not dismissed".
    renderWithIntl(<LanguageHint locale="tr" />);
    expect(screen.getByRole('region').className).toContain('var(--sticky-cta-h,0px)');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

`npx vitest run src/design/chrome/__tests__/StickyCtaBar.test.tsx src/design/chrome/__tests__/WhatsAppFab.test.tsx src/design/chrome/__tests__/LanguageHint.test.tsx` → StickyCtaBar: `isBarVisible`/`STICKY_CTA_HEIGHT_VAR` are not exported (import error); WhatsAppFab and LanguageHint: `expected '… bottom-[18px] …' to contain 'var(--sticky-cta-h,0px)'` (and the same for the sheet's `bottom-[calc(74px+…)]`).

- [ ] **Step 3: Implement**

`src/design/chrome/StickyCtaBar.tsx` (replace whole file — 56 lines, untouched by Tasks 1–4):

```tsx
'use client';
import { useCallback, useEffect, useRef, useSyncExternalStore } from 'react';
import { Button, type ButtonVariant } from '@/design/primitives';

export type StickyCta = {
  label: string;
  href: string;
  variant?: ButtonVariant;
  external?: boolean;
};

/** W18: the bar's rendered height, published on `<html>` while it is visible and `0px`
 *  otherwise, so `LanguageHint` and `WhatsAppFab` can add it to their bottom offset instead
 *  of sitting on top of the bar. Below `lg` the bar is `display:none`, so it publishes 0. */
export const STICKY_CTA_HEIGHT_VAR = '--sticky-cta-h';

/** The design's rule (Hire Workers): shown once the visitor has scrolled past `showAfterPx`,
 *  hidden again while the section it points at (`hideNearId`) has entered the lower tenth
 *  of the viewport or scrolled above it — the bar must never cover the form it advertises. */
export function isBarVisible(
  scrollY: number,
  showAfterPx: number,
  targetTop: number | null,
  viewportHeight: number,
) {
  if (scrollY <= showAfterPx) return false;
  if (targetTop === null) return true;
  return targetTop >= viewportHeight * 0.9;
}

function subscribeToViewport(onChange: () => void) {
  window.addEventListener('scroll', onChange, { passive: true });
  window.addEventListener('resize', onChange);
  return () => {
    window.removeEventListener('scroll', onChange);
    window.removeEventListener('resize', onChange);
  };
}
const onServer = () => false;

/** Mounted by pages, never by the layout: it repeats that page's own offer once the visitor
 *  has scrolled past it. Below `lg` the mobile bottom bar already occupies this space. */
export function StickyCtaBar({
  message,
  ctas,
  showAfterPx = 700,
  hideNearId,
  live = false,
}: {
  message: string;
  ctas: StickyCta[];
  showAfterPx?: number;
  /** id of the section the bar points at (e.g. `request-form`); hidden while it is near. */
  hideNearId?: string;
  /** The design's green "live" dot before the message. */
  live?: boolean;
}) {
  // R18's pattern: scroll position and the target's rect are browser facts, read after
  // hydration only; the server and the hydrating client both see "hidden".
  const visible = useSyncExternalStore(
    subscribeToViewport,
    useCallback(() => {
      const target = hideNearId ? document.getElementById(hideNearId) : null;
      return isBarVisible(
        window.scrollY,
        showAfterPx,
        target ? target.getBoundingClientRect().top : null,
        window.innerHeight,
      );
    }, [hideNearId, showAfterPx]),
    onServer,
  );
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const node = ref.current;
    if (!visible || !node) {
      root.style.setProperty(STICKY_CTA_HEIGHT_VAR, '0px');
      return;
    }
    const publish = () => root.style.setProperty(STICKY_CTA_HEIGHT_VAR, `${node.offsetHeight}px`);
    publish();
    // Re-publish when the bar wraps (narrow desktop) or crosses `lg` (display:none → 0).
    const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(publish) : null;
    observer?.observe(node);
    return () => {
      observer?.disconnect();
      root.style.setProperty(STICKY_CTA_HEIGHT_VAR, '0px');
    };
  }, [visible]);

  if (!visible) return null;
  return (
    <div
      ref={ref}
      className="fixed inset-x-0 bottom-0 z-50 hidden border-t border-white/15 bg-navy/95 backdrop-blur lg:block"
    >
      <div className="container-site flex flex-wrap items-center justify-between gap-4 py-3">
        <p className="m-0 flex items-center gap-2 font-bold text-white">
          {live && (
            <span
              data-live-dot=""
              aria-hidden="true"
              className="inline-block h-2 w-2 rounded-pill bg-success"
            />
          )}
          {message}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {ctas.map((cta) => (
            <Button
              key={cta.href}
              variant={cta.variant ?? 'primary'}
              href={cta.href}
              external={cta.external}
            >
              {cta.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
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
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { ContactCta } from '../ContactCta';
import { renderWithIntl } from '@/test/render';

type Entry = Record<string, unknown>;
const pushed = () => (window as unknown as { dataLayer: Entry[] }).dataLayer;

// jsdom has no navigation; a native listener swallows the default action while React's own
// handler (registered on the root) still runs — the same helper T0c's ContactLink test uses.
async function click(name: string) {
  const link = screen.getByRole('link', { name });
  link.addEventListener('click', (e) => e.preventDefault());
  await userEvent.click(link);
}

beforeEach(() => {
  (window as unknown as { dataLayer: Entry[] }).dataLayer = [];
});

describe('ContactCta (W12 page placements)', () => {
  it('fires the contact event with its placement for a wa.me href, in the Button face', async () => {
    renderWithIntl(
      <ContactCta placement="page_cta" href="https://wa.me/905011240340?text=Merhaba" external>
        WhatsApp
      </ContactCta>,
    );
    const link = screen.getByRole('link', { name: 'WhatsApp' });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveClass('bg-blue-safe'); // primary by default
    await click('WhatsApp');
    expect(pushed()).toEqual([
      { event: 'whatsapp_click', page: '/', locale: 'tr', placement: 'page_cta' },
    ]);
  });

  it('classifies tel: and mailto: too, with the variant it is given', async () => {
    renderWithIntl(
      <>
        <ContactCta placement="office_card" href="tel:+905011240340" variant="ghost">
          Ara
        </ContactCta>
        <ContactCta placement="office_card" href="mailto:info@jobsadmire.com" variant="inverse">
          Yaz
        </ContactCta>
      </>,
    );
    expect(screen.getByRole('link', { name: 'Yaz' })).toHaveClass('text-white');
    await click('Ara');
    await click('Yaz');
    expect(pushed().map((e) => [e.event, e.placement])).toEqual([
      ['call_click', 'office_card'],
      ['email_click', 'office_card'],
    ]);
  });

  it('is a plain Button link for a non-contact href and fires nothing', async () => {
    renderWithIntl(
      <ContactCta placement="page_cta" href="/hire-workers" variant="secondary">
        Talep
      </ContactCta>,
    );
    const link = screen.getByRole('link', { name: 'Talep' });
    expect(link).toHaveAttribute('href', '/isci-talebi');
    await click('Talep');
    expect(pushed()).toEqual([]);
  });
});
```

`src/design/blocks/__tests__/FaqBlock.test.tsx`:

```tsx
import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FaqBlock } from '../FaqBlock';
import { testBundle } from '@/test/bundle';
import { renderWithIntl } from '@/test/render';

// No analytics mock: the ask card's ContactCta renders T0c's real ContactLink, whose hook
// reads the locale from the provider `renderWithIntl` supplies.
const bundle = testBundle({
  strings: {
    'x.eyebrow': 'SSS',
    'x.title': 'İşverenlerin sorduğu sorular',
    'x.body': 'İzinler, maliyetler, süreler.',
    'x.askT': 'Sorunuz listede yok mu?',
    'x.askB': 'Ekibimize yazın.',
    'x.wa': "WhatsApp'tan sorun",
    'x.call': 'Bizi arayın',
  },
});
const items = [
  { id: 'q1', q: 'Ne kadar sürer?', a: 'Ortalama 45 gün.' },
  { id: 'q2', q: 'Maliyet?', a: 'Role göre değişir.' },
];

describe('FaqBlock', () => {
  it('renders the side column, one accordion trigger per pair and a FAQPage node', () => {
    const { container } = renderWithIntl(
      <FaqBlock
        bundle={bundle}
        locale="tr"
        items={items}
        eyebrowId="x.eyebrow"
        headingId="x.title"
        bodyId="x.body"
        askCard={{
          titleId: 'x.askT',
          bodyId: 'x.askB',
          whatsappNumber: '905011240340',
          whatsappText: 'Merhaba',
          whatsappLabelId: 'x.wa',
          phone: '+905011240340',
          callLabelId: 'x.call',
        }}
      />,
    );
    expect(
      screen.getByRole('heading', { level: 2, name: 'İşverenlerin sorduğu sorular' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Ne kadar sürer?' })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /Ne kadar sürer\?|Maliyet\?/ })).toHaveLength(2);
    expect(screen.getByRole('link', { name: "WhatsApp'tan sorun" })).toHaveAttribute(
      'href',
      'https://wa.me/905011240340?text=Merhaba',
    );
    expect(screen.getByRole('link', { name: 'Bizi arayın' })).toHaveAttribute(
      'href',
      'tel:+905011240340',
    );
    const data = JSON.parse(
      container.querySelector('script[type="application/ld+json"]')!.textContent!,
    );
    expect(data['@type']).toBe('FAQPage');
    expect(data.mainEntity).toHaveLength(2);
    expect(data.mainEntity[1].acceptedAnswer.text).toBe('Role göre değişir.');
  });

  it('opens the first pair on request and allows multi-open (the Homepage variant)', () => {
    renderWithIntl(
      <FaqBlock bundle={bundle} locale="tr" items={items} singleOpen={false} openFirst />,
    );
    expect(screen.getByRole('button', { name: 'Ne kadar sürer?' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    expect(screen.queryByRole('heading', { level: 2 })).toBeNull();
  });
});
```

`src/design/blocks/__tests__/Breadcrumbs.test.tsx`:

```tsx
import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Breadcrumbs } from '../Breadcrumbs';
import { SITE_URL } from '@/lib/seo/routes';
import tr from '@/messages/tr.json';
import { renderWithIntl } from '@/test/render';

describe('Breadcrumbs', () => {
  it('is a labelled nav whose last crumb is the current page, plus a BreadcrumbList node', () => {
    const { container } = renderWithIntl(
      <Breadcrumbs
        locale="tr"
        items={[
          { name: 'Ana sayfa', href: '/' },
          { name: 'Rehberler', href: '/blog' },
          { name: 'İzinler', href: { pathname: '/blog/[slug]', params: { slug: 'izin' } } },
        ]}
      />,
      { locale: 'tr' },
    );
    const nav = screen.getByRole('navigation', { name: tr.sys.nav.breadcrumbs });
    expect(within(nav).getByRole('link', { name: 'Ana sayfa' })).toHaveAttribute('href', '/');
    expect(within(nav).getByRole('link', { name: 'Rehberler' })).toHaveAttribute('href', '/blog');
    expect(within(nav).queryByRole('link', { name: 'İzinler' })).toBeNull();
    expect(within(nav).getByText('İzinler')).toHaveAttribute('aria-current', 'page');
    const data = JSON.parse(
      container.querySelector('script[type="application/ld+json"]')!.textContent!,
    );
    expect(data['@type']).toBe('BreadcrumbList');
    expect(data.itemListElement[0].item).toBe(`${SITE_URL}/`);
    expect(data.itemListElement[2]).toMatchObject({
      position: 3,
      name: 'İzinler',
      item: `${SITE_URL}/blog/izin`,
    });
  });

  it('uses the English slugs under /en', () => {
    renderWithIntl(
      <Breadcrumbs
        locale="en"
        items={[
          { name: 'Home', href: '/' },
          { name: 'Hire workers', href: '/hire-workers' },
        ]}
      />,
      { locale: 'en' },
    );
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/en');
  });
});
```

`src/design/blocks/__tests__/ClosingCtaBand.test.tsx`:

```tsx
import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ClosingCtaBand } from '../ClosingCtaBand';
import { testBundle } from '@/test/bundle';
import { renderWithIntl } from '@/test/render';

const bundle = testBundle({
  strings: { 'x.title': 'Bu dönem işçiye ihtiyacınız var mı?', 'x.body': 'Doğrudan görüşün.' },
});

describe('ClosingCtaBand', () => {
  it('renders the copy, the internal primary and the tracked contact CTAs', () => {
    renderWithIntl(
      <ClosingCtaBand
        bundle={bundle}
        locale="tr"
        titleId="x.title"
        bodyId="x.body"
        primary={{ label: 'İşçi talep edin', href: '/hire-workers' }}
        secondary={{
          label: 'WhatsApp',
          href: 'https://wa.me/905011240340?text=Merhaba',
          external: true,
        }}
        extra={[{ label: 'Ofisi arayın', href: 'tel:+905011240340' }]}
        ticks={['İŞKUR lisanslı', '24 saat içinde teklif']}
      />,
    );
    expect(
      screen.getByRole('heading', { level: 2, name: 'Bu dönem işçiye ihtiyacınız var mı?' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'İşçi talep edin' })).toHaveAttribute(
      'href',
      '/isci-talebi',
    );
    expect(screen.getByRole('link', { name: 'WhatsApp' })).toHaveAttribute('target', '_blank');
    expect(screen.getByRole('link', { name: 'WhatsApp' })).toHaveClass('text-white');
    expect(screen.getByRole('link', { name: 'Ofisi arayın' })).toHaveAttribute(
      'href',
      'tel:+905011240340',
    );
    // W10: the mobile-only ticks are in the DOM and hidden by CSS from md up
    const ticks = screen.getByRole('list');
    expect(ticks).toHaveClass('md:hidden');
    expect(ticks.children).toHaveLength(2);
  });

  it('renders without body, secondary, extras or ticks', () => {
    renderWithIntl(
      <ClosingCtaBand
        bundle={bundle}
        locale="en"
        titleId="x.title"
        primary={{ label: 'Go', href: '/contact' }}
        tone="green"
      />,
      { locale: 'en' },
    );
    expect(screen.getByRole('link', { name: 'Go' })).toHaveAttribute('href', '/en/contact');
    expect(screen.queryByRole('list')).toBeNull();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

`npx vitest run src/design/blocks` → every file fails to resolve its `../ContactCta` / `../FaqBlock` / `../Breadcrumbs` / `../ClosingCtaBand` import.

- [ ] **Step 3: Implement**

`src/design/chrome/icons.tsx` — append after `LinkedInIcon` (end of file today; Task 6 appends `XIcon`/`LinkIcon` after these later):

```tsx
export function CheckIcon(props: IconProps) {
  return (
    <svg
      {...base({ size: 15, ...props })}
      {...stroke}
      strokeWidth={2.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <svg {...base({ size: 15, ...props })} {...stroke} strokeLinecap="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}
```

`src/design/blocks/ContactCta.tsx` (no directive — W32: `useContactClick` returns `(kind) => void` and lives inside Task 3's `ContactLink`, so this file never touches the hook itself):

```tsx
import type { ReactNode } from 'react';
import { ContactLink } from '@/analytics/ContactLink';
import { contactKindOf } from '@/analytics/useContactClick';
import { Button, buttonClassName, type ButtonVariant } from '@/design/primitives';

/** The two page-level placements W12 allows next to the chrome's own. */
export type PageContactPlacement = 'page_cta' | 'office_card';

export type ContactCtaProps = {
  placement: PageContactPlacement;
  href: string;
  variant?: ButtonVariant;
  size?: 'md' | 'lg';
  external?: boolean;
  className?: string;
  'aria-label'?: string;
  children: ReactNode;
};

/** A CTA in the `Button` face that fires the contact event when its href is a contact href.
 *  `tel:` / `mailto:` / `wa.me` (T0c's `contactKindOf`) render through T0c's `ContactLink` —
 *  the one anchor every contact link on the site goes through (`useContactClick(placement)`:
 *  `whatsapp_click`/`call_click`/`email_click`, `page` from `next/navigation`, R35) — wearing
 *  `buttonClassName(variant, size)`; any other href is an ordinary `Button` link. No `'use
 *  client'` here: `ContactLink` is the client piece, so every block around it stays a server
 *  component (W13). */
export function ContactCta({
  placement,
  href,
  variant = 'primary',
  size = 'md',
  external,
  className,
  'aria-label': ariaLabel,
  children,
}: ContactCtaProps) {
  const kind = contactKindOf(href);
  if (!kind) {
    return (
      <Button
        variant={variant}
        size={size}
        href={href}
        external={external}
        className={className}
        aria-label={ariaLabel}
      >
        {children}
      </Button>
    );
  }
  return (
    <ContactLink
      href={href}
      placement={placement}
      className={buttonClassName(variant, size, className)}
      aria-label={ariaLabel}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
    </ContactLink>
  );
}
```

`src/design/blocks/FaqBlock.tsx`:

```tsx
import type { ReactNode } from 'react';
import { makeTf } from '@/content/pure';
import { Accordion, Eyebrow } from '@/design/primitives';
import type { Locale } from '@/i18n/routing';
import { telLink, waLink } from '@/lib/contact';
import { JsonLd } from '@/lib/seo/JsonLdScript';
import { faqJsonLd } from '@/lib/seo/jsonld';
import type { Bundle } from '../../../contract/website-bundle.v1';
import { ContactCta } from './ContactCta';

/** `q`/`a` arrive resolved (through the page's `makeTf`): FAQ pairs are package ids the page
 *  reads by exact id (W23). */
export type FaqItem = { id: string; q: string; a: string };

/** The design's "Question not listed?" card in the side column (Hire Workers, Contact,
 *  Available Workers). `whatsappText` is the page's own prefill id, resolved. */
export type FaqAskCard = {
  titleId: string;
  bodyId: string;
  whatsappNumber: string;
  whatsappText: string;
  whatsappLabelId: string;
  phone?: string;
  callLabelId?: string;
};

/** FAQ section body: side column (eyebrow, h2, sub, ask card — sticky from lg) + the
 *  accordion + the FAQPage node (AEO only, docs/SEO.md). Pages put it inside a
 *  `<Section tone="pale"><div className="container-site">…`. Ids resolve through
 *  `makeTf(bundle, locale)`, so a re-authored `{metric}` string (hire.198-style reply times)
 *  renders its number (D17). */
export function FaqBlock({
  bundle,
  locale,
  items,
  id = 'faq',
  eyebrowId,
  headingId,
  bodyId,
  askCard,
  singleOpen = true,
  openFirst = false,
  headingLevel = 3,
  footer,
}: {
  bundle: Bundle;
  locale: Locale;
  items: FaqItem[];
  id?: string;
  eyebrowId?: string;
  headingId?: string;
  bodyId?: string;
  askCard?: FaqAskCard;
  /** Hire Workers/Contact: one open at a time; the Homepage's six toggles are independent. */
  singleOpen?: boolean;
  openFirst?: boolean;
  /** 3 under an h2 side column; 2 when the page renders no h2 of its own above the list. */
  headingLevel?: 2 | 3 | 4;
  /** Page-specific line under the list (the Homepage's `faqFoot` + WhatsApp link). */
  footer?: ReactNode;
}) {
  const t = makeTf(bundle, locale);
  const hasSide = Boolean(eyebrowId || headingId || bodyId || askCard);
  return (
    <div id={id} className={hasSide ? 'grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16' : ''}>
      {hasSide && (
        <div className="lg:sticky lg:top-8 lg:self-start">
          {eyebrowId && <Eyebrow>{t(eyebrowId)}</Eyebrow>}
          {headingId && <h2 className="text-h2 mt-3 mb-4">{t(headingId)}</h2>}
          {bodyId && <p className="text-body m-0 text-text-secondary">{t(bodyId)}</p>}
          {askCard && (
            <div className="mt-6 rounded-base border border-border-1 bg-white p-6">
              <h3 className="text-card-title m-0 mb-1">{t(askCard.titleId)}</h3>
              <p className="text-body-sm m-0 mb-4 text-text-secondary">{t(askCard.bodyId)}</p>
              <div className="flex flex-wrap gap-2">
                <ContactCta
                  placement="page_cta"
                  variant="secondary"
                  external
                  href={waLink(askCard.whatsappNumber, askCard.whatsappText)}
                  className="border-success-border text-success-text hover:bg-success-surface"
                >
                  {t(askCard.whatsappLabelId)}
                </ContactCta>
                {askCard.phone && askCard.callLabelId && (
                  <ContactCta
                    placement="page_cta"
                    variant="secondary"
                    href={telLink(askCard.phone)}
                    className="text-blue-safe"
                  >
                    {t(askCard.callLabelId)}
                  </ContactCta>
                )}
              </div>
            </div>
          )}
        </div>
      )}
      <div>
        <Accordion
          items={items.map((it) => ({
            id: it.id,
            title: it.q,
            body: <p className="m-0">{it.a}</p>,
          }))}
          singleOpen={singleOpen}
          defaultOpenId={openFirst ? items[0]?.id : undefined}
          headingLevel={headingLevel}
        />
        {footer}
      </div>
      <JsonLd data={faqJsonLd(items.map(({ q, a }) => ({ q, a })))} />
    </div>
  );
}
```

`src/design/blocks/Breadcrumbs.tsx`:

```tsx
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { JsonLd } from '@/lib/seo/JsonLdScript';
import { breadcrumbJsonLd } from '@/lib/seo/jsonld';
import { absoluteUrl, type Href } from '@/lib/seo/routes';

/** Every crumb — the current page included — carries its typed href: the trail renders the
 *  last one as text (`aria-current="page"`), but the BreadcrumbList node needs its URL. */
export type Crumb = { name: string; href: Href };

const TONE = {
  light: { link: 'text-blue-safe', muted: 'text-text-tertiary' },
  dark: { link: 'text-sky', muted: 'text-white/55' },
} as const;

/** The design's `Home / Blog / {category}` trail on dark heroes and light pages, plus the
 *  BreadcrumbList node every non-homepage page carries (docs/SEO.md). */
export function Breadcrumbs({
  locale,
  items,
  tone = 'light',
  className,
}: {
  locale: Locale;
  items: Crumb[];
  tone?: 'light' | 'dark';
  className?: string;
}) {
  const sys = useTranslations('sys');
  const c = TONE[tone];
  return (
    <>
      <nav aria-label={sys('nav.breadcrumbs')} className={className}>
        <ol className="m-0 flex list-none flex-wrap items-center gap-2 p-0 text-body-sm font-bold">
          {items.map((it, i) => {
            const last = i === items.length - 1;
            return (
              <li key={`${i}-${it.name}`} className="flex items-center gap-2">
                {i > 0 && (
                  <span aria-hidden="true" className={c.muted}>
                    /
                  </span>
                )}
                {last ? (
                  <span aria-current="page" className={c.muted}>
                    {it.name}
                  </span>
                ) : (
                  <Link href={it.href} className={`${c.link} no-underline hover:underline`}>
                    {it.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd
        data={breadcrumbJsonLd(
          items.map((it) => ({ name: it.name, url: absoluteUrl(locale, it.href) })),
        )}
      />
    </>
  );
}
```

`src/design/blocks/ClosingCtaBand.tsx`:

```tsx
import { makeTf } from '@/content/pure';
import { CheckIcon } from '@/design/chrome/icons';
import type { ButtonVariant } from '@/design/primitives';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../contract/website-bundle.v1';
import { ContactCta } from './ContactCta';

/** A resolved call to action. Labels are resolved by the page (package id or sys key). */
export type Cta = { label: string; href: string; external?: boolean; variant?: ButtonVariant };

const TONE = {
  navy: 'bg-navy',
  gradient: 'bg-gradient-to-br from-ink to-navy',
  green: 'bg-success-text',
} as const;

/** The closing band every page ends on (Homepage contact strip, Blog's "let's just do it",
 *  About's green band): a dark rounded card with h2 + body, the primary CTA and the
 *  WhatsApp/Telegram/call buttons. Pages mount it inside `<Section tone="band">`. Every CTA
 *  renders through `ContactCta` (placement `page_cta`): a contact href is tracked, any
 *  other href is a plain `Button` link. */
export function ClosingCtaBand({
  bundle,
  locale,
  titleId,
  bodyId,
  primary,
  secondary,
  extra = [],
  ticks = [],
  tone = 'navy',
  id,
}: {
  bundle: Bundle;
  locale: Locale;
  titleId: string;
  bodyId?: string;
  primary: Cta;
  secondary?: Cta;
  /** Telegram / call — the design's third and fourth buttons. */
  extra?: Cta[];
  /** The design's phone-only tick lines (Blog band): rendered, hidden from `md` up (W10). */
  ticks?: string[];
  tone?: keyof typeof TONE;
  id?: string;
}) {
  const t = makeTf(bundle, locale);
  const cta = (c: Cta, fallback: ButtonVariant, key: string) => (
    <ContactCta
      key={key}
      placement="page_cta"
      variant={c.variant ?? fallback}
      href={c.href}
      external={c.external}
    >
      {c.label}
    </ContactCta>
  );
  return (
    <div
      id={id}
      className={`relative overflow-hidden rounded-hero px-6 py-8 text-white lg:px-11 lg:py-10 ${TONE[tone]}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-28 -top-40 h-[480px] w-[480px] rounded-pill bg-[radial-gradient(circle,rgba(24,153,213,0.24),transparent_65%)]"
      />
      <div className="relative flex flex-wrap items-center justify-between gap-8">
        <div className="max-w-[600px]">
          <h2 className="text-h2 m-0 mb-2 text-white">{t(titleId)}</h2>
          {bodyId && <p className="text-body m-0 text-white/70">{t(bodyId)}</p>}
          {ticks.length > 0 && (
            <ul className="text-body-sm m-0 mt-4 flex list-none flex-col gap-2 p-0 text-white/75 md:hidden">
              {ticks.map((tick) => (
                <li key={tick} className="flex items-start gap-2">
                  <CheckIcon className="mt-0.5 shrink-0 text-success" />
                  {tick}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex flex-wrap gap-3">
          {cta(primary, 'primary', 'primary')}
          {secondary && cta(secondary, 'inverse', 'secondary')}
          {extra.map((c, i) => cta(c, 'inverse', `extra-${i}`))}
        </div>
      </div>
    </div>
  );
}
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
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ProcessSteps } from '../ProcessSteps';
import { testBundle } from '@/test/bundle';

const bundle = testBundle({
  strings: {
    's1.t': 'İhtiyacınızı paylaşın',
    's1.b': 'Sektör, kişi sayısı, lokasyon.',
    's2.t': 'Kısa liste',
    's2.b': 'Uygun adaylar.',
    's3.t': 'İlk iş günü',
    's3.b': 'Varış ve oryantasyon.',
  },
});
const steps = [
  { n: 1, titleId: 's1.t', bodyId: 's1.b', when: 'Başlangıç' },
  { n: 2, titleId: 's2.t', bodyId: 's2.b', when: '1. hafta' },
  { n: 3, titleId: 's3.t', bodyId: 's3.b' },
];

describe('ProcessSteps', () => {
  it('renders an ordered list with numbered dots, when-pills and one heading per step', () => {
    render(<ProcessSteps bundle={bundle} locale="tr" steps={steps} />);
    const list = screen.getByRole('list');
    expect(list.tagName).toBe('OL');
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
    expect(screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual([
      'İhtiyacınızı paylaşın',
      'Kısa liste',
      'İlk iş günü',
    ]);
    expect(screen.getByText('Başlangıç')).toBeInTheDocument();
    expect(screen.getByText('1. hafta')).toBeInTheDocument();
    // the dot's number is decorative — the heading is the step's name
    expect(
      screen.getAllByText(/^[123]$/).every((n) => n.getAttribute('aria-hidden') === 'true'),
    ).toBe(true);
  });

  it('marks the last step for the green terminus and honours the variant', () => {
    render(
      <ProcessSteps bundle={bundle} locale="tr" steps={steps} variant="plain" headingLevel={4} />,
    );
    const items = screen.getAllByRole('listitem');
    expect(items[2]).toHaveAttribute('data-last', 'true');
    expect(items[0]).not.toHaveAttribute('data-last');
    expect(screen.getByRole('list')).toHaveAttribute('data-variant', 'plain');
    expect(screen.getAllByRole('heading', { level: 4 })).toHaveLength(3);
  });
});
```

`src/design/blocks/__tests__/MetricStrip.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MetricStrip } from '../MetricStrip';
import { testBundle } from '@/test/bundle';

// Rows satisfy T0b's `MetricSchema` exactly (`src/content/collections.ts`: every field
// present, `unitId` nullable but never missing) — `getCollection` throws under vitest on a
// schema miss.
const metrics = [
  { key: 'placed', value: 470, text: null, suffix: '+', labelId: 'm.placed', unitId: null },
  // unsigned → hidden (W1)
  { key: 'employers', value: null, text: null, suffix: '+', labelId: 'm.employers', unitId: null },
  { key: 'countries', value: 13, text: null, suffix: '', labelId: 'm.countries', unitId: null },
  {
    key: 'firstDayWeeks',
    value: null,
    text: '6–8',
    suffix: '',
    labelId: 'm.weeks',
    unitId: 'm.wk',
  },
  // no label → hidden
  { key: 'permitDays', value: 45, text: null, suffix: '', labelId: null, unitId: 'm.days' },
];
const bundle = testBundle({
  strings: {
    'm.placed': 'işe yerleştirilen çalışan',
    'm.employers': 'işveren',
    'm.countries': 'ülke',
    'm.weeks': 'ilk iş gününe',
    'm.wk': 'hafta',
    'm.days': 'gün',
  },
  collections: { metrics },
});

describe('MetricStrip', () => {
  it('renders the signed metrics in the requested order and skips the unsigned ones', () => {
    render(
      <MetricStrip
        bundle={bundle}
        locale="tr"
        metrics={['placed', 'employers', 'countries', 'firstDayWeeks', 'permitDays']}
      />,
    );
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(3);
    expect(items[0]).toHaveTextContent('470+');
    expect(items[0]).toHaveTextContent('işe yerleştirilen çalışan');
    expect(items[2]).toHaveTextContent('6–8 hafta'); // unitId joins the suffix
    expect(screen.queryByText('işveren')).toBeNull();
  });

  it('renders nothing when every requested metric is unsigned (the empty wall)', () => {
    const { container } = render(
      <MetricStrip bundle={bundle} locale="tr" metrics={['employers', 'permitDays']} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('dark tone reaches the Stat', () => {
    render(<MetricStrip bundle={bundle} locale="en" metrics={['countries']} tone="dark" />);
    expect(screen.getByText('ülke')).toHaveClass('text-white/55');
  });
});
```

`src/design/blocks/__tests__/OfficeCard.test.tsx`:

```tsx
import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { OfficeCard } from '../OfficeCard';
import { getOffice } from '@/content/collections';
import { BLOCK_STRINGS, testBundle } from '@/test/bundle';
import { renderWithIntl } from '@/test/render';

// Rows satisfy T0b's `OfficeSchema` exactly (`src/content/collections.ts`): every text field
// is an id, `hours.days` are JS getDay() values (0 = Sunday … 6 = Saturday, W43).
const offices = [
  {
    key: 'antalya',
    kind: 'hq',
    cityId: 'o.city',
    labelId: 'o.label',
    addressId: 'o.addr',
    addressLine2Id: 'o.addr2',
    hoursId: 'o.hours',
    footerLabelId: 'o.foot',
    phone: '+905011240340',
    whatsapp: '905011240340',
    email: 'info@jobsadmire.com',
    hours: { tz: 'Europe/Istanbul', days: [1, 2, 3, 4, 5], open: '09:00', close: '18:00' },
    mapUrl: 'https://maps.google.com/?q=Antalya',
  },
];
const bundle = testBundle({
  strings: {
    ...BLOCK_STRINGS,
    'o.city': 'Antalya, Türkiye',
    'o.label': 'Merkez ofis',
    'o.label2': 'Tedarik ofisi',
    'o.addr': 'Adnan Menderes Blv. 7/6',
    'o.addr2': 'Muratpaşa, Antalya',
    'o.hours': 'Pzt–Cum · 09:00–18:00 (TRT)',
    'o.foot': 'Antalya · Merkez ofis',
  },
  collections: { offices },
});
// The parsed row through T0b's own accessor, never the literal: the schema is the contract.
const office = getOffice(bundle, 'antalya');

describe('OfficeCard', () => {
  it('renders city, kind, address, hours and the four contact doors', () => {
    renderWithIntl(
      <OfficeCard bundle={bundle} locale="tr" office={office}>
        <span data-testid="status">Açık</span>
      </OfficeCard>,
      { locale: 'tr' },
    );
    expect(screen.getByRole('heading', { level: 3, name: 'Antalya, Türkiye' })).toBeInTheDocument();
    expect(screen.getByText('Merkez ofis')).toBeInTheDocument();
    expect(screen.getByText(/Adnan Menderes Blv\. 7\/6/)).toBeInTheDocument();
    expect(screen.getByText(/Muratpaşa, Antalya/)).toBeInTheDocument();
    expect(screen.getByText('Pzt–Cum · 09:00–18:00 (TRT)')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '+905011240340' })).toHaveAttribute(
      'href',
      'tel:+905011240340',
    );
    expect(screen.getByRole('link', { name: "WhatsApp'tan yazın" })).toHaveAttribute(
      'href',
      expect.stringMatching(/^https:\/\/wa\.me\/905011240340\?text=/),
    );
    expect(screen.getByRole('link', { name: 'info@jobsadmire.com' })).toHaveAttribute(
      'href',
      'mailto:info@jobsadmire.com',
    );
    const map = screen.getByRole('link', { name: 'Yol tarifi alın' });
    expect(map).toHaveAttribute('href', 'https://maps.google.com/?q=Antalya');
    expect(map).toHaveAttribute('target', '_blank');
    expect(screen.getByTestId('status')).toBeInTheDocument();
  });

  it('labels a sourcing office from its own labelId (W7)', () => {
    renderWithIntl(
      <OfficeCard
        bundle={bundle}
        locale="en"
        office={{ ...office, kind: 'sourcing', labelId: 'o.label2' }}
      />,
      { locale: 'en' },
    );
    expect(screen.getByText('Tedarik ofisi')).toHaveClass('text-success-text');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

`npx vitest run src/design/blocks` → the three new files fail to resolve their imports; the Cycle 5 suites stay green.

- [ ] **Step 3: Implement**

`src/design/blocks/ProcessSteps.tsx`:

```tsx
import { makeTf } from '@/content/pure';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../contract/website-bundle.v1';

/** `when` is a resolved string (the Homepage's "Day 0" is home.104, Hire Workers' are the
 *  `hire.27x` ids) — the page reads it so a `when`-less step is simply absent. */
export type ProcessStep = { n: number; titleId: string; bodyId: string; when?: string };

const CARD = {
  cards:
    'rounded-md border border-border-2 bg-white px-6 py-5 shadow-[0_8px_24px_rgba(22,60,90,0.06)] transition-shadow hover:shadow-card-hover',
  plain: '',
} as const;

/** The design's `.ja-tl-row` process timeline (Hire Workers 6 steps, Homepage 5, Contact 4,
 *  Partner, Work Permit, Available Workers): numbered gradient dots on a vertical rail that
 *  fades blue → green, a `when` pill per step, the last step's dot green. `cards` boxes each
 *  step (Hire Workers); `plain` is the Homepage/Contact row. Pure CSS — the design's reveal
 *  stagger is decorative and would cost an island (W13). */
export function ProcessSteps({
  bundle,
  locale,
  steps,
  variant = 'cards',
  id,
  headingLevel = 3,
}: {
  bundle: Bundle;
  locale: Locale;
  steps: ProcessStep[];
  variant?: 'cards' | 'plain';
  id?: string;
  headingLevel?: 3 | 4;
}) {
  const t = makeTf(bundle, locale);
  const Heading = `h${headingLevel}` as 'h3' | 'h4';
  return (
    <ol
      id={id}
      data-variant={variant}
      className="relative m-0 grid list-none gap-4 p-0 before:absolute before:bottom-6 before:left-[17px] before:top-6 before:w-[3px] before:rounded-[3px] before:bg-gradient-to-b before:from-tint-border before:via-blue before:to-success before:content-['']"
    >
      {steps.map((s, i) => {
        const last = i === steps.length - 1;
        return (
          <li
            key={`${s.n}-${s.titleId}`}
            data-last={last ? 'true' : undefined}
            className="relative grid grid-cols-[36px_1fr] items-start gap-4"
          >
            <span
              aria-hidden="true"
              className={[
                'relative z-[1] flex h-9 w-9 items-center justify-center rounded-pill text-body-sm font-extrabold text-white shadow-[0_0_0_5px_#fff]',
                last
                  ? 'bg-gradient-to-br from-success to-success-text'
                  : 'bg-gradient-to-br from-blue to-blue-safe',
              ].join(' ')}
            >
              {s.n}
            </span>
            <div className={CARD[variant]}>
              <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                <Heading className="text-card-title m-0">{t(s.titleId)}</Heading>
                {s.when && (
                  <span
                    className={[
                      'whitespace-nowrap rounded-pill border px-3 py-1 text-eyebrow font-extrabold',
                      last
                        ? 'border-success-border bg-success-surface text-success-text'
                        : 'border-tint-border bg-tint text-blue-safe',
                    ].join(' ')}
                  >
                    {s.when}
                  </span>
                )}
              </div>
              <p className="text-body-sm m-0 text-text-secondary">{t(s.bodyId)}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
```

`src/design/blocks/MetricStrip.tsx`:

```tsx
import { getCollection, type Metric, type MetricKey } from '@/content/collections';
import { makeTf } from '@/content/pure';
import { Stat } from '@/design/primitives';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../contract/website-bundle.v1';

/** Signed = a number or a text, and a label. Anything else is hidden, never rendered as 0 (W1). */
const signed = (m: Metric | undefined): m is Metric =>
  Boolean(m && (m.value !== null || m.text !== null) && m.labelId !== null);

/** The headline-number strip (Homepage hero stats, About, Hire, Partner, Work Permit): every
 *  figure from the `metrics` collection (D17), never typed into copy. `unitId` (permitDays →
 *  home.206 "days") joins the suffix. Renders nothing when no requested metric is signed —
 *  the Phase A empty wall (W6). */
export function MetricStrip({
  bundle,
  locale,
  metrics,
  tone = 'light',
  className,
}: {
  bundle: Bundle;
  locale: Locale;
  metrics: MetricKey[];
  tone?: 'light' | 'dark';
  className?: string;
}) {
  const t = makeTf(bundle, locale);
  const rows = getCollection(bundle, 'metrics');
  const shown = metrics.map((key) => rows.find((r) => r.key === key)).filter(signed);
  if (shown.length === 0) return null;
  const divider = tone === 'dark' ? 'divide-white/15' : 'divide-border-1';
  return (
    <ul
      className={[
        'm-0 grid list-none grid-cols-2 gap-y-6 p-0 lg:grid-flow-col lg:auto-cols-fr lg:divide-x',
        divider,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {shown.map((m) => (
        <li key={m.key} className="px-4 first:pl-0 last:pr-0">
          <Stat
            value={m.value ?? undefined}
            text={m.text ?? undefined}
            suffix={m.unitId ? `${m.suffix} ${t(m.unitId)}` : m.suffix}
            label={t(m.labelId as string)}
            locale={locale}
            tone={tone}
          />
        </li>
      ))}
    </ul>
  );
}
```

`src/design/blocks/OfficeCard.tsx`:

```tsx
import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { ContactLink } from '@/analytics/ContactLink';
import type { Office } from '@/content/collections';
import { makeTf } from '@/content/pure';
import { ClockIcon, MailIcon, MapPinIcon, PhoneIcon, WhatsAppIcon } from '@/design/chrome/icons';
import type { Locale } from '@/i18n/routing';
import { mailLink, telLink, waLink } from '@/lib/contact';
import type { Bundle } from '../../../contract/website-bundle.v1';

const ROW =
  'inline-flex min-h-[44px] items-center gap-2 text-body-sm font-bold text-text-secondary no-underline hover:text-blue-safe focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe';

/** The white office card (Contact offices band, About): city, kind, address, hours, the
 *  contact doors and directions — every text field is the row's own package id (`labelId`,
 *  `addressId`/`addressLine2Id`, `hoursId`: contact.099/104, contact.133/134, contact.100/106
 *  — W9/R15, nothing composed), so body, footer and JSON-LD agree. The three contact rows are
 *  T0c's `ContactLink` with placement `office_card` (W12). `children` is the page's own line
 *  under the header (Contact's live open/closed pill is a client island that reads
 *  `office.hours` — `days` are JS `getDay()` 0–6, W43; the card itself stays a server
 *  component). */
export function OfficeCard({
  bundle,
  locale,
  office,
  children,
}: {
  bundle: Bundle;
  locale: Locale;
  office: Office;
  children?: ReactNode;
}) {
  const t = makeTf(bundle, locale);
  const sys = useTranslations('sys');
  return (
    <article className="flex flex-col rounded-lg bg-white p-7 shadow-[0_26px_54px_rgba(10,16,40,0.4)]">
      <div className="mb-4">
        <h3 className="text-card-title m-0">{t(office.cityId)}</h3>
        <p
          className={[
            'text-eyebrow m-0 font-extrabold uppercase tracking-[0.5px]',
            office.kind === 'sourcing' ? 'text-success-text' : 'text-blue-safe',
          ].join(' ')}
        >
          {t(office.labelId)}
        </p>
      </div>
      {children && <div className="mb-4">{children}</div>}
      <p className="text-body-sm m-0 mb-4 text-text-secondary">
        {t(office.addressId)}
        <br />
        {t(office.addressLine2Id)}
      </p>
      <div className="mb-4 flex flex-col gap-1">
        <span className={ROW}>
          <ClockIcon className="text-blue-safe" />
          {t(office.hoursId)}
        </span>
        <ContactLink href={telLink(office.phone)} placement="office_card" className={ROW}>
          <PhoneIcon className="text-blue-safe" />
          {office.phone}
        </ContactLink>
        <ContactLink
          href={waLink(office.whatsapp, sys('whatsapp.prefill'))}
          placement="office_card"
          target="_blank"
          rel="noopener noreferrer"
          className={ROW}
        >
          <WhatsAppIcon className="text-success-text" />
          {t('home.221')}
        </ContactLink>
        <ContactLink href={mailLink(office.email)} placement="office_card" className={ROW}>
          <MailIcon className="text-blue-safe" />
          {office.email}
        </ContactLink>
      </div>
      <a
        href={office.mapUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto inline-flex min-h-[44px] items-center justify-center gap-2 rounded-input border border-tint-border bg-tint px-4 text-body-sm font-extrabold text-blue-safe no-underline hover:bg-sky/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe"
      >
        <MapPinIcon />
        {t('home.192')}
      </a>
    </article>
  );
}
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
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ImageSlot } from '../ImageSlot';

describe('ImageSlot (W27 / D26 markup contract)', () => {
  it('renders the named placeholder when no asset is given', () => {
    render(<ImageSlot slot="hw-hero" alt="Workers on site" width={640} height={400} />);
    const box = screen.getByRole('img', { name: 'Workers on site' });
    expect(box).toHaveAttribute('data-placeholder', 'hw-hero');
    expect(box).not.toHaveAttribute('data-lcp-slot');
    expect(box.style.aspectRatio).toBe('640 / 400');
  });

  it('marks the LCP slot on the placeholder too, so the launch gate can refuse it', () => {
    const { container } = render(<ImageSlot slot="v4-hero" lcp alt="" width={4} height={3} />);
    const box = container.querySelector('[data-placeholder="v4-hero"]')!;
    expect(box).toHaveAttribute('data-lcp-slot', 'v4-hero');
    expect(box).toHaveAttribute('aria-hidden', 'true'); // decorative: empty alt
    expect(box).not.toHaveAttribute('role');
  });

  it('renders next/image with the asset, carrying data-lcp-slot and never data-placeholder', () => {
    render(
      <ImageSlot
        slot="v4-hero"
        lcp
        src="/brand/ja-mark.png"
        alt="JobsAdmire"
        width={88}
        height={88}
      />,
    );
    const img = screen.getByRole('img', { name: 'JobsAdmire' });
    expect(img.tagName).toBe('IMG');
    expect(img).toHaveAttribute('data-lcp-slot', 'v4-hero');
    expect(img).not.toHaveAttribute('data-placeholder');
  });
});
```

`src/design/blocks/__tests__/EmptyState.test.tsx`:

```tsx
import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EmptyState } from '../EmptyState';
import { renderWithIntl } from '@/test/render';

describe('EmptyState (W6)', () => {
  it('is a status region with the title, body and a tracked contact CTA', () => {
    renderWithIntl(
      <EmptyState
        title="Kayıt henüz yayında değil"
        body="Ofisi arayarak doğrulayın."
        cta={{ label: "WhatsApp'tan sorun", href: 'https://wa.me/905011240340', external: true }}
        testId="verify-empty"
      />,
    );
    const box = screen.getByRole('status');
    expect(box).toHaveAttribute('data-testid', 'verify-empty');
    expect(
      screen.getByRole('heading', { level: 3, name: 'Kayıt henüz yayında değil' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Ofisi arayarak doğrulayın.')).toBeInTheDocument();
    const cta = screen.getByRole('link', { name: "WhatsApp'tan sorun" });
    expect(cta).toHaveAttribute('target', '_blank');
    expect(cta).toHaveClass('bg-white'); // secondary face on a light box
  });

  it('renders title-only on a dark surface with an inverse CTA and an h2 when asked', () => {
    renderWithIntl(
      <EmptyState
        title="İlk onaylar yolda"
        tone="dark"
        headingLevel={2}
        cta={{ label: 'İşçi talep edin', href: '/hire-workers' }}
      />,
    );
    expect(screen.getByRole('heading', { level: 2 })).toHaveClass('text-white');
    expect(screen.getByRole('link', { name: 'İşçi talep edin' })).toHaveAttribute(
      'href',
      '/isci-talebi',
    );
    expect(screen.getByRole('link', { name: 'İşçi talep edin' })).toHaveClass('text-white');
  });
});
```

`src/design/blocks/__tests__/PostCard.test.tsx`:

```tsx
import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PostCard } from '../PostCard';
import { getCollection } from '@/content/collections';
import { BLOCK_STRINGS, testBundle } from '@/test/bundle';
import { renderWithIntl } from '@/test/render';

// Rows satisfy T0b's `BlogPostSchema` exactly (`src/content/collections.ts`, W33): key +
// per-locale slug/title/excerpt/body (W28), the category enum and its label id.
const rows = [
  {
    key: 'turkey-work-permit-process-employer-guide',
    slug: { tr: 'calisma-izni-sureci', en: 'turkey-work-permit-process-employer-guide' },
    title: { tr: 'Çalışma izni süreci', en: 'Turkey work permit process' },
    excerpt: { tr: 'Adım adım.', en: 'Step by step.' },
    category: 'workPermits',
    categoryLabelId: 'p.cat',
    author: 'JobsAdmire Editorial',
    publishedAt: '2026-01-12',
    readMinutes: 5,
    // W28: Task 1's BlogPostSchema refines `(body.<l> !== null) === hasBody.<l>` per locale.
    hasBody: { tr: true, en: true },
    body: { tr: '# Gövde', en: '# Body' },
  },
];
const bundle = testBundle({
  strings: { ...BLOCK_STRINGS, 'p.cat': 'İş izinleri' },
  collections: { blog: rows },
});
// The parsed row through T0b's own accessor, never the literal.
const post = getCollection(bundle, 'blog')[0];

describe('PostCard', () => {
  it('links the title to the locale slug and formats the byline', () => {
    renderWithIntl(<PostCard bundle={bundle} locale="tr" post={post} />, { locale: 'tr' });
    expect(screen.getByRole('link', { name: 'Çalışma izni süreci' })).toHaveAttribute(
      'href',
      '/blog/calisma-izni-sureci',
    );
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Çalışma izni süreci');
    expect(screen.getByText('İş izinleri')).toBeInTheDocument(); // t(categoryLabelId)
    expect(screen.getByText('Adım adım.')).toBeInTheDocument();
    expect(screen.getByText('12 Ocak 2026 · 5 dk okuma')).toBeInTheDocument();
    expect(screen.getByText("İngilizce'de de var")).toBeInTheDocument();
    // no cover given → the NAMED placeholder is what the launch profile counts (D26, W55)
    expect(document.querySelector('[data-placeholder]')).toHaveAttribute(
      'data-placeholder',
      'blog-cover-turkey-work-permit-process-employer-guide',
    );
  });

  it('uses the English slug/title under /en and drops the pill without a translation', () => {
    renderWithIntl(
      <PostCard
        bundle={bundle}
        locale="en"
        post={{ ...post, hasBody: { tr: false, en: true }, body: { tr: null, en: '# Body' } }}
        categoryLabel="Work permits"
      />,
      { locale: 'en' },
    );
    expect(screen.getByRole('link', { name: 'Turkey work permit process' })).toHaveAttribute(
      'href',
      '/en/blog/turkey-work-permit-process-employer-guide',
    );
    expect(screen.queryByText("Türkçe'de de var")).toBeNull();
    expect(screen.getByText('12 January 2026 · 5 min read')).toBeInTheDocument();
    expect(screen.getByText('Work permits')).toBeInTheDocument(); // categoryLabel override
  });

  it('featured variant adds the FEATURED pill, an h2 and the real cover', () => {
    renderWithIntl(
      <PostCard
        bundle={bundle}
        locale="tr"
        post={post}
        variant="featured"
        headingLevel={2}
        coverSrc="/brand/ja-mark.png"
      />,
      { locale: 'tr' },
    );
    expect(screen.getByText('ÖNE ÇIKAN')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    expect(document.querySelector('[data-placeholder]')).toBeNull();
  });

  it('renders nothing for a locale the post is not written in (W33)', () => {
    const { container } = renderWithIntl(
      <PostCard
        bundle={bundle}
        locale="tr"
        post={{
          ...post,
          slug: { tr: null, en: post.slug.en },
          title: { tr: null, en: post.title.en },
        }}
      />,
      { locale: 'tr' },
    );
    expect(container).toBeEmptyDOMElement();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

`npx vitest run src/design/blocks` → the three new files fail to resolve their imports.

- [ ] **Step 3: Implement**

`src/design/blocks/ImageSlot.tsx`:

```tsx
import Image from 'next/image';

export type ImageSlotProps = {
  /** The design slot id — the value `data-placeholder`/`data-lcp-slot` carry (D26 counter). */
  slot: string;
  /** This slot is the page's LCP element: the image gets `data-lcp-slot` + `priority`. */
  lcp?: boolean;
  src?: string | null;
  /** '' for a decorative image (the placeholder is then `aria-hidden`, not a labelled img). */
  alt: string;
  width: number;
  height: number;
  sizes?: string;
  className?: string;
  priority?: boolean;
};

/** One image slot (W27): `next/image` when the asset exists, else the gradient placeholder
 *  named `data-placeholder="<slot>"` — never an unnamed one (W55) — so the launch profile's
 *  counter (`scripts/placeholder-count.ts`, D26) reports the slot by id and refuses a page
 *  whose LCP slot is still a placeholder. Aspect ratio comes from `width`/`height` so the
 *  placeholder reserves the same box as the image (no CLS when the photo lands). */
export function ImageSlot({
  slot,
  lcp = false,
  src = null,
  alt,
  width,
  height,
  sizes,
  className,
  priority,
}: ImageSlotProps) {
  const lcpSlot = lcp ? slot : undefined;
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        priority={priority ?? lcp}
        className={className}
        data-lcp-slot={lcpSlot}
      />
    );
  }
  const decorative = alt === '';
  return (
    <div
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : alt}
      aria-hidden={decorative ? true : undefined}
      data-placeholder={slot}
      data-lcp-slot={lcpSlot}
      style={{ aspectRatio: `${width} / ${height}` }}
      className={['w-full bg-gradient-to-br from-tint to-sky', className].filter(Boolean).join(' ')}
    />
  );
}
```

`src/design/blocks/EmptyState.tsx`:

```tsx
import type { ReactNode } from 'react';
import { ContactCta } from './ContactCta';

export type EmptyStateCta = { label: string; href: string; external?: boolean };

const TONE = {
  light: {
    box: 'border-border-1 bg-white',
    title: 'text-ink',
    body: 'text-text-secondary',
    icon: 'bg-tint text-blue-safe',
  },
  pale: {
    box: 'border-tint-border bg-pale-1',
    title: 'text-ink',
    body: 'text-text-secondary',
    icon: 'bg-white text-blue-safe',
  },
  dark: {
    box: 'border-white/15 bg-white/5',
    title: 'text-white',
    body: 'text-white/70',
    icon: 'bg-white/10 text-sky',
  },
} as const;

/** The designed empty state (W6, W27) that stands in for a section whose data is not signed
 *  yet: the Success Stories wall, the Verify lookup's neutral answer, the Available Workers
 *  strip, a founder/team row. Copy is the page's `sys.<page>.empty.*` (resolved by the page —
 *  no id here, W9); the optional CTA goes through `ContactCta`, so a WhatsApp/phone door is
 *  tracked as `page_cta`. `role="status"`: it is the answer to a state, not decoration. */
export function EmptyState({
  title,
  body,
  cta,
  tone = 'light',
  icon,
  headingLevel = 3,
  testId,
  className,
}: {
  title: string;
  body?: string;
  cta?: EmptyStateCta;
  tone?: keyof typeof TONE;
  icon?: ReactNode;
  headingLevel?: 2 | 3;
  testId?: string;
  className?: string;
}) {
  const c = TONE[tone];
  const Heading = `h${headingLevel}` as 'h2' | 'h3';
  return (
    <div
      role="status"
      data-testid={testId}
      className={[
        'flex flex-col items-center gap-3 rounded-xl border border-dashed px-6 py-10 text-center',
        c.box,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {icon && (
        <span
          aria-hidden="true"
          className={`flex h-12 w-12 items-center justify-center rounded-pill ${c.icon}`}
        >
          {icon}
        </span>
      )}
      <Heading className={`text-card-title m-0 ${c.title}`}>{title}</Heading>
      {body && <p className={`text-body-sm m-0 max-w-[520px] ${c.body}`}>{body}</p>}
      {cta && (
        <ContactCta
          placement="page_cta"
          variant={tone === 'dark' ? 'inverse' : 'secondary'}
          href={cta.href}
          external={cta.external}
          className="mt-2"
        >
          {cta.label}
        </ContactCta>
      )}
    </div>
  );
}
```

`src/design/blocks/PostCard.tsx`:

```tsx
import type { BlogPost } from '@/content/collections';
import { makeTf } from '@/content/pure';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { formatDate, formatReadMinutes } from '@/lib/format/date';
import type { Bundle } from '../../../contract/website-bundle.v1';
import { ImageSlot } from './ImageSlot';

/** The alt-language pill: on a TR card "also in English" (blog.081), on an EN card
 *  "Türkçe'de de var" (blog.077) — shown only when the other locale's body exists (W4). */
const ALSO_IN_ID: Record<Locale, string> = { tr: 'blog.081', en: 'blog.077' };

/** Cover boxes: the package's 190/104/270 px heights × 0.75 (D19), as width/height pairs so
 *  `ImageSlot` reserves the same box with or without the photo. */
const COVER = {
  card: { width: 380, height: 142, className: '' },
  row: { width: 104, height: 78, className: 'w-[104px] shrink-0' },
  featured: { width: 640, height: 202, className: '' },
} as const;

/** The blog card (Blog grid, Article related, Homepage teaser, Work Permit "keep reading").
 *  The title is the single link; the cover is `ImageSlot` `blog-cover-<key>` (W27/W55) — the
 *  page passes `coverSrc` from its image policy, and without one the named placeholder is
 *  what the launch counter sees (D26). Renders nothing when the post has no slug or title in
 *  this locale (W33: an unwritten translation is not a card — callers may filter first). */
export function PostCard({
  bundle,
  locale,
  post,
  variant = 'card',
  categoryLabel,
  coverSrc = null,
  headingLevel = 3,
}: {
  bundle: Bundle;
  locale: Locale;
  post: BlogPost;
  variant?: 'card' | 'row' | 'featured';
  /** Overrides `t(post.categoryLabelId)` (a page-local category table, if any). */
  categoryLabel?: string;
  coverSrc?: string | null;
  headingLevel?: 2 | 3;
}) {
  const slug = post.slug[locale];
  const title = post.title[locale];
  if (!slug || !title) return null;
  const t = makeTf(bundle, locale);
  const Heading = `h${headingLevel}` as 'h2' | 'h3';
  const other: Locale = locale === 'tr' ? 'en' : 'tr';
  const excerpt = post.excerpt[locale];
  const meta = `${formatDate(post.publishedAt, locale)} · ${formatReadMinutes(post.readMinutes, locale)}`;
  const row = variant === 'row';
  const cover = COVER[variant];
  return (
    <article
      className={[
        'rounded-xl border border-border-2 bg-white shadow-card transition-shadow hover:shadow-card-hover',
        row ? 'flex gap-4 p-4' : 'flex flex-col overflow-hidden',
      ].join(' ')}
    >
      <ImageSlot
        slot={`blog-cover-${post.key}`}
        src={coverSrc}
        alt=""
        width={cover.width}
        height={cover.height}
        className={['rounded-xs object-cover', cover.className].filter(Boolean).join(' ')}
      />
      <div className={row ? 'flex min-w-0 flex-1 flex-col' : 'flex flex-1 flex-col p-6'}>
        <div className="mb-3 flex flex-wrap gap-2">
          {variant === 'featured' && (
            <span className="rounded-pill bg-ink px-3 py-1 text-eyebrow font-extrabold text-white">
              {t('blog.034')}
            </span>
          )}
          <span className="rounded-pill border border-tint-border bg-tint px-3 py-1 text-eyebrow font-extrabold text-blue-safe">
            {categoryLabel ?? t(post.categoryLabelId)}
          </span>
        </div>
        <Heading className="text-card-title m-0 mb-2">
          <Link
            href={{ pathname: '/blog/[slug]', params: { slug } }}
            className="text-ink no-underline hover:text-blue-safe focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe"
          >
            {title}
          </Link>
        </Heading>
        {!row && excerpt && <p className="text-body-sm m-0 mb-4 text-text-tertiary">{excerpt}</p>}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 text-eyebrow font-bold text-muted">
          <span>{meta}</span>
          {post.hasBody[other] && !row && (
            <span className="rounded-pill bg-pale-1 px-2 py-0.5 text-text-secondary">
              {t(ALSO_IN_ID[locale])}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
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
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { NewsletterBand } from '../NewsletterBand';
import { BLOCK_STRINGS, testBundle } from '@/test/bundle';

const bundle = testBundle({ strings: BLOCK_STRINGS });

describe('NewsletterBand', () => {
  it('renders nothing while inactive (Phase A, W5)', () => {
    const { container } = render(
      <NewsletterBand bundle={bundle} locale="tr" active={false}>
        <form data-testid="shell" />
      </NewsletterBand>,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the band chrome around the page-supplied form when active (Phase B)', () => {
    render(
      <NewsletterBand bundle={bundle} locale="tr" active id="newsletter">
        <form data-testid="shell" />
      </NewsletterBand>,
    );
    expect(
      screen.getByRole('heading', { level: 2, name: 'Ayda bir işe alım içgörüleri' }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Spam yok/)).toBeInTheDocument();
    expect(screen.getByTestId('shell')).toBeInTheDocument();
    expect(document.getElementById('newsletter')).not.toBeNull();
  });
});
```

`src/design/blocks/__tests__/StoreBadges.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StoreBadges } from '../StoreBadges';
import { BLOCK_STRINGS, testBundle } from '@/test/bundle';

const bundle = testBundle({ strings: BLOCK_STRINGS });

describe('StoreBadges', () => {
  it('renders the Google Play badge only — iOS is null today (W8)', () => {
    render(
      <StoreBadges
        bundle={bundle}
        locale="tr"
        android="https://play.google.com/store/apps/details?id=x"
      />,
    );
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAccessibleName('Get it on Google Play');
    expect(links[0]).toHaveAttribute('target', '_blank');
  });

  it('adds the App Store badge once a link exists, and renders nothing with neither', () => {
    const { rerender, container } = render(
      <StoreBadges
        bundle={bundle}
        locale="tr"
        android="https://play.google.com/x"
        ios="https://apps.apple.com/x"
      />,
    );
    expect(screen.getAllByRole('link')).toHaveLength(2);
    rerender(<StoreBadges bundle={bundle} locale="tr" android={null} />);
    expect(container).toBeEmptyDOMElement();
  });
});
```

`src/design/blocks/__tests__/LogoMarquee.test.tsx`:

```tsx
import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LogoMarquee } from '../LogoMarquee';
import { renderWithIntl } from '@/test/render';

describe('LogoMarquee', () => {
  it('renders nothing without consented logos (§10 row 11, W6)', () => {
    const { container } = renderWithIntl(<LogoMarquee logos={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders a pausable marquee of the logos', () => {
    renderWithIntl(
      <LogoMarquee
        logos={[
          { src: '/brand/logos/a.svg', alt: 'A Ltd', width: 220, height: 88 },
          { src: '/brand/logos/b.svg', alt: 'B AŞ', width: 220, height: 88 },
        ]}
      />,
    );
    // the inert duplicate track is aria-hidden, so only the first copy is exposed
    expect(screen.getAllByRole('img')).toHaveLength(2);
    expect(screen.getByRole('button', { name: 'Duraklat' })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

`npx vitest run src/design/blocks` → the three new files fail to resolve their imports.

- [ ] **Step 3: Implement**

`src/design/blocks/NewsletterBand.tsx`:

```tsx
import type { ReactNode } from 'react';
import { makeTf } from '@/content/pure';
import { MailIcon } from '@/design/chrome/icons';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../contract/website-bundle.v1';

/** The Blog/Article newsletter band. Phase A: `active={false}` on every page (W5 — the
 *  `newsletter` form is inactive at the door and would 404), so it renders nothing. Phase B:
 *  the page passes `active` from its settings and mounts its own `<FormShell formKey=
 *  "newsletter">` (one e-mail `Field`) as `children` — the page owns the server action. */
export function NewsletterBand({
  bundle,
  locale,
  active,
  id = 'newsletter',
  children,
}: {
  bundle: Bundle;
  locale: Locale;
  active: boolean;
  id?: string;
  children?: ReactNode;
}) {
  if (!active) return null;
  const t = makeTf(bundle, locale);
  return (
    <div
      id={id}
      className="relative grid items-center gap-8 overflow-hidden rounded-xl border border-border-1 bg-white px-8 py-9 shadow-[0_16px_40px_rgba(22,60,90,0.07)] lg:grid-cols-[1fr_auto] lg:px-12"
    >
      <div className="flex items-center gap-5">
        <span
          aria-hidden="true"
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-blue to-blue-safe text-white shadow-[0_12px_26px_rgba(24,153,213,0.3)]"
        >
          <MailIcon size={26} />
        </span>
        <div>
          <h2 className="text-h2 m-0 mb-1">{t('blog.036')}</h2>
          <p className="text-body-sm m-0 text-text-secondary">
            {t('blog.037')} <strong className="text-ink">{t('blog.038')}</strong>
          </p>
        </div>
      </div>
      <div className="min-w-0 lg:min-w-[340px]">{children}</div>
    </div>
  );
}
```

`src/design/blocks/StoreBadges.tsx`:

```tsx
import { makeTf } from '@/content/pure';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../contract/website-bundle.v1';

const BADGE = {
  dark: 'bg-ink text-white hover:bg-black',
  light: 'border border-border-1 bg-white text-ink hover:bg-pale-1',
} as const;

function PlayIcon() {
  // The design's inline Play glyph — local, never the hot-linked store image (W14).
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M4 3.5v17c0 .4.45.65.8.42l.2-.12L15.5 12 5 3.2l-.2-.12A.5.5 0 0 0 4 3.5z"
        fill="#2196F3"
      />
      <path d="M18.9 9.9L15.5 12 5 3.2l13.9 6.7z" fill="#4CAF50" />
      <path d="M18.9 14.1L15.5 12 5 20.8l13.9-6.7z" fill="#F44336" />
      <path d="M18.9 9.9l2.3 1.3c.7.4.7 1.2 0 1.6l-2.3 1.3L15.5 12l3.4-2.1z" fill="#FFC107" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="16" height="19" viewBox="0 0 384 512" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"
      />
    </svg>
  );
}

/** App-store badges from `settings.storeLinks`: Google Play (hire.240) whenever the Android
 *  link exists; App Store (hire.241) only once `ios` is a URL — it is `null` today, so the
 *  badge is not rendered rather than pointing at a generic store page (W8). Labels are the
 *  package's own, kept English on TR by the importer's override table (W7/W51). */
export function StoreBadges({
  bundle,
  locale,
  android,
  ios = null,
  tone = 'dark',
}: {
  bundle: Bundle;
  locale: Locale;
  android: string | null;
  ios?: string | null;
  tone?: keyof typeof BADGE;
}) {
  if (!android && !ios) return null;
  const t = makeTf(bundle, locale);
  const cls = `inline-flex min-h-[44px] items-center gap-2 rounded-input px-4 text-body-sm font-extrabold no-underline transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe ${BADGE[tone]}`;
  return (
    <div className="flex flex-wrap gap-2">
      {android && (
        <a href={android} target="_blank" rel="noopener noreferrer" className={cls}>
          <PlayIcon />
          {t('hire.240')}
        </a>
      )}
      {ios && (
        <a href={ios} target="_blank" rel="noopener noreferrer" className={cls}>
          <AppleIcon />
          {t('hire.241')}
        </a>
      )}
    </div>
  );
}
```

`src/design/blocks/LogoMarquee.tsx`:

```tsx
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { PausableMarquee } from '@/design/primitives';

export type Logo = { src: string; alt: string; width: number; height: number };

/** The client-logo scroller (Hire Workers, Partner). Renders nothing until consented logos
 *  exist (§10 row 11 is v1.1; W6) — an empty marquee of placeholder slots would be counted
 *  against the page by the launch profile. Logos are local files under `public/brand/logos/`
 *  (W14); `alt` is the company name. */
export function LogoMarquee({
  logos,
  durationSec = 38,
  className,
}: {
  logos: Logo[];
  durationSec?: number;
  className?: string;
}) {
  const sys = useTranslations('sys');
  if (logos.length === 0) return null;
  return (
    <div
      className={[
        '[mask-image:linear-gradient(90deg,transparent_0,#000_6%,#000_94%,transparent_100%)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <PausableMarquee
        durationSec={durationSec}
        labelPause={sys('marquee.pause')}
        labelPlay={sys('marquee.play')}
      >
        {logos.map((logo, i) => (
          <span
            key={`${i}-${logo.src}`}
            className="flex h-[66px] w-[165px] items-center justify-center"
          >
            <Image
              src={logo.src}
              alt={logo.alt}
              width={logo.width}
              height={logo.height}
              className="max-h-full w-auto object-contain"
            />
          </span>
        ))}
      </PausableMarquee>
    </div>
  );
}
```

`src/design/blocks/index.ts`:

```ts
export { Breadcrumbs, type Crumb } from './Breadcrumbs';
export { ClosingCtaBand, type Cta } from './ClosingCtaBand';
export { ContactCta, type ContactCtaProps, type PageContactPlacement } from './ContactCta';
export { EmptyState, type EmptyStateCta } from './EmptyState';
export { FaqBlock, type FaqAskCard, type FaqItem } from './FaqBlock';
export { ImageSlot, type ImageSlotProps } from './ImageSlot';
export { LogoMarquee, type Logo } from './LogoMarquee';
export { MetricStrip } from './MetricStrip';
export { NewsletterBand } from './NewsletterBand';
export { OfficeCard } from './OfficeCard';
export { PostCard } from './PostCard';
export { ProcessSteps, type ProcessStep } from './ProcessSteps';
export { StoreBadges } from './StoreBadges';
// Row types come from T0b — one definition (`src/content/collections.ts`), re-exported here
// so a page that composes blocks needs one import.
export type { BlogPost, Metric, MetricKey, Office } from '@/content/collections';
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
'use client';
import { useState } from 'react';
import { RadioChips, Tabs } from '@/design/primitives';

/** The two primitives whose props are functions need a client wrapper in the gallery. */
export function RadioChipsDemo() {
  const [role, setRole] = useState<string | null>('general');
  const [tab, setTab] = useState('t1');
  return (
    <div className="flex w-full flex-col gap-6">
      <RadioChips
        name="role"
        legend="Role (RadioChips)"
        value={role}
        onChange={setRole}
        options={[
          { value: 'general', label: 'General worker' },
          { value: 'skilled', label: 'Skilled' },
          { value: 'specialist', label: 'Specialist' },
        ]}
      />
      <p className="text-body-sm m-0 text-text-secondary">{`selected: ${role ?? 'none'}`}</p>
      <Tabs
        defaultId="t1"
        onChange={setTab}
        tabs={[
          { id: 't1', label: 'One', panel: <p>Panel one.</p> },
          { id: 't2', label: 'Two', panel: <p>Panel two.</p> },
        ]}
      />
      <p className="text-body-sm m-0 text-text-secondary">{`Tabs onChange → ${tab}`}</p>
    </div>
  );
}
```

`src/app/[locale]/(site)/dev/gallery/Wp2Blocks.tsx` (the contract import is six levels up from the `(site)` group, W41):

```tsx
import { getCollection } from '@/content/collections';
import { makeTf } from '@/content/pure';
import {
  Breadcrumbs,
  ClosingCtaBand,
  EmptyState,
  FaqBlock,
  ImageSlot,
  LogoMarquee,
  MetricStrip,
  NewsletterBand,
  OfficeCard,
  PostCard,
  ProcessSteps,
  StoreBadges,
} from '@/design/blocks';
import { Section, Stat, Timeline } from '@/design/primitives';
import type { Locale } from '@/i18n/routing';
import { telLink, waLink } from '@/lib/contact';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { RadioChipsDemo } from './RadioChipsDemo';

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-border-2 py-8">
      <h2 className="text-card-title mb-4 font-mono">{title}</h2>
      <div className="flex flex-wrap items-end gap-4">{children}</div>
    </section>
  );
}

/** Task 5's additions to the gallery: every new tone/variant and every shared block, fed from
 *  the real bundle (package ids by exact id through `makeTf` — home.024/107/305 carry
 *  `{metric}` placeholders after T0b — collections from the importer). */
export function Wp2Blocks({ bundle, locale }: { bundle: Bundle; locale: Locale }) {
  const t = makeTf(bundle, locale);
  const { settings } = bundle;
  const office = getCollection(bundle, 'offices')[0];
  const post = getCollection(bundle, 'blog').find((p) => p.slug[locale] && p.title[locale]);
  const faq = [294, 296, 298, 300, 302, 304].map((q) => ({
    id: `home.${q}`,
    q: t(`home.${q}`),
    a: t(`home.${q + 1}`),
  }));
  const steps = [104, 107, 110, 113, 116].map((n, i) => ({
    n: i + 1,
    when: t(`home.${n}`),
    titleId: `home.${n + 1}`,
    bodyId: `home.${n + 2}`,
  }));

  return (
    <>
      <Block title="RadioChips / Tabs onChange">
        <RadioChipsDemo />
      </Block>

      <Block title="Stat — text / prefix / dark tone">
        <Stat text="6–8" suffix=" wk" label={t('home.052')} locale={locale} />
        <Stat value={45} prefix="~" label={t('home.052')} locale={locale} />
        <span className="rounded-md bg-navy p-4">
          <Stat value={470} suffix="+" label={t('home.050')} locale={locale} tone="dark" />
        </span>
      </Block>

      <Block title="Timeline — horizontal">
        <div className="w-full">
          <Timeline
            variant="horizontal"
            steps={[
              { when: '2019', title: 'Founded', body: 'Antalya.' },
              { when: '2022', title: 'Licensed', body: 'İŞKUR 1730.' },
              { when: '2026', title: 'Today', body: '13 source countries.' },
            ]}
          />
        </div>
      </Block>

      <Section tone="pale" className="my-8 rounded-xl">
        <div className="container-site">
          <h2 className="text-card-title font-mono">Section tone=&quot;pale&quot; + FaqBlock</h2>
          <FaqBlock
            bundle={bundle}
            locale={locale}
            items={faq}
            eyebrowId="home.180"
            headingId="home.181"
            askCard={{
              titleId: 'hire.197',
              bodyId: 'hire.198',
              whatsappNumber: settings.whatsappNumber,
              whatsappText: t('hire.252'),
              whatsappLabelId: 'hire.041',
              phone: settings.phone,
              callLabelId: 'hire.032',
            }}
            openFirst
          />
        </div>
      </Section>

      <Block title="Breadcrumbs (light / dark)">
        <Breadcrumbs
          locale={locale}
          items={[
            { name: t('home.001'), href: '/' },
            { name: t('home.010'), href: '/blog' },
            { name: 'Gallery', href: '/blog' },
          ]}
        />
        <span className="rounded-md bg-navy p-4">
          <Breadcrumbs
            locale={locale}
            tone="dark"
            items={[
              { name: t('home.001'), href: '/' },
              { name: t('home.002'), href: '/hire-workers' },
            ]}
          />
        </span>
      </Block>

      <Block title="ProcessSteps — cards / plain">
        <div className="w-full max-w-[760px]">
          <ProcessSteps bundle={bundle} locale={locale} steps={steps} />
        </div>
        <div className="w-full max-w-[760px]">
          <ProcessSteps bundle={bundle} locale={locale} steps={steps.slice(0, 3)} variant="plain" />
        </div>
      </Block>

      <Block title="MetricStrip (light) — hidden metrics are skipped">
        <div className="w-full">
          <MetricStrip
            bundle={bundle}
            locale={locale}
            metrics={['placed', 'employers', 'countries', 'permitDays']}
          />
        </div>
      </Block>
      <Section tone="dark" className="my-8 rounded-xl">
        <div className="container-site">
          <MetricStrip
            bundle={bundle}
            locale={locale}
            tone="dark"
            metrics={['placed', 'countries', 'firstDayWeeks']}
          />
        </div>
      </Section>

      <Block title="OfficeCard (offices collection)">
        {office ? (
          <div className="w-full max-w-sm rounded-xl bg-navy p-6">
            <OfficeCard bundle={bundle} locale={locale} office={office} />
          </div>
        ) : (
          <p className="text-body-sm">offices collection is empty — run npm run content:import</p>
        )}
      </Block>

      <Block title="PostCard — card / row / featured (blog collection)">
        {post ? (
          <>
            <div className="w-80">
              <PostCard bundle={bundle} locale={locale} post={post} />
            </div>
            <div className="w-96">
              <PostCard bundle={bundle} locale={locale} post={post} variant="row" />
            </div>
            <div className="w-full max-w-xl">
              <PostCard
                bundle={bundle}
                locale={locale}
                post={post}
                variant="featured"
                headingLevel={2}
                coverSrc="/brand/ja-mark.png"
              />
            </div>
          </>
        ) : (
          <p className="text-body-sm">
            no blog row is written in this locale — run npm run content:import
          </p>
        )}
      </Block>

      <Block title="ImageSlot (placeholder / asset) — EmptyState (light / dark)">
        <div className="w-64">
          <ImageSlot slot="gallery-placeholder" alt="Placeholder slot" width={4} height={3} />
        </div>
        <div className="w-24">
          <ImageSlot slot="gallery-mark" src="/brand/ja-mark.png" alt="" width={88} height={88} />
        </div>
        <div className="w-full max-w-md">
          <EmptyState
            title="Nothing signed yet"
            body="The wall stays empty until the first approvals are signed (W6)."
            cta={{
              label: t('home.221'),
              href: waLink(settings.whatsappNumber, t('hire.252')),
              external: true,
            }}
          />
        </div>
        <div className="w-full max-w-md rounded-xl bg-navy p-4">
          <EmptyState
            title="Dark tone"
            tone="dark"
            cta={{ label: t('home.022'), href: '/hire-workers' }}
          />
        </div>
      </Block>

      <Block title="StoreBadges (Android only, W8) / LogoMarquee (empty → nothing)">
        <StoreBadges
          bundle={bundle}
          locale={locale}
          android={settings.storeLinks.android}
          ios={settings.storeLinks.ios}
        />
        <StoreBadges
          bundle={bundle}
          locale={locale}
          android={settings.storeLinks.android}
          tone="light"
        />
        <LogoMarquee logos={[]} />
        <div className="w-full">
          <LogoMarquee
            logos={[
              { src: '/brand/ja-mark.png', alt: 'JobsAdmire', width: 88, height: 88 },
              { src: '/brand/ja-mark.png', alt: 'JobsAdmire', width: 88, height: 88 },
              { src: '/brand/ja-mark.png', alt: 'JobsAdmire', width: 88, height: 88 },
            ]}
          />
        </div>
      </Block>

      <Section tone="band">
        <NewsletterBand bundle={bundle} locale={locale} active={false} />
        <NewsletterBand bundle={bundle} locale={locale} active id="gallery-newsletter">
          <p className="text-body-sm m-0 text-text-secondary">
            (Phase B: the page mounts its FormShell here — active=false renders nothing above.)
          </p>
        </NewsletterBand>
      </Section>

      <Section tone="band">
        <ClosingCtaBand
          bundle={bundle}
          locale={locale}
          titleId="home.184"
          bodyId="home.185"
          primary={{ label: t('home.022'), href: '/hire-workers' }}
          secondary={{
            label: t('home.221'),
            href: waLink(settings.whatsappNumber, t('hire.249')),
            external: true,
          }}
          extra={[
            { label: t('home.202'), href: settings.telegramUrl, external: true },
            { label: t('home.187'), href: telLink(settings.phone) },
          ]}
          ticks={[t('hire.019'), t('home.024')]}
        />
      </Section>
      <Section tone="band">
        <ClosingCtaBand
          bundle={bundle}
          locale={locale}
          titleId="home.184"
          primary={{ label: t('home.022'), href: '/hire-workers' }}
          tone="green"
        />
      </Section>

      {/* The sticky bar's hideNearId target: scroll here and the bar (lg+) disappears. */}
      <div id="gallery-end" className="h-24" />
    </>
  );
}
```

(`hire.249` is Hire Workers' WhatsApp hire prefill, `hire.252` its "ask" prefill, `hire.019` the licence chip, `home.294`–`home.305` the six homepage FAQ pairs, `home.104`–`home.118` the five process steps — all existing package ids, verified in `src/content/local/bundle.tr.json`; `makeTf` throws in dev on a typo, which is the point. `home.024`/`home.107`/`home.305` are among the 39 ids Task 1 re-authored with `{metric}` placeholders, so the gallery resolves through `makeTf`, never `makeT`.)

`src/app/[locale]/(site)/dev/gallery/page.tsx` — three sentence-anchored edits:
- After the line `import { DialogDemo } from './DialogDemo';` add `import { Wp2Blocks } from './Wp2Blocks';`.
- Immediately before the `<Block title="Chrome — LanguageSwitcher / NavLink / CookiePreferencesButton">` element insert `<Wp2Blocks bundle={bundle} locale={locale} />` (`bundle` and `locale` are the page's existing `getBundle(locale)` result and route param).
- In the `<StickyCtaBar` element at the bottom of the page add the props `hideNearId="gallery-end"` and `live` after `message={t('home.003')}`.

Docs (same commit; every anchor is a sentence — run `npx prettier --write docs/ARCHITECTURE.md docs/CONTENT-MODEL.md docs/SEO.md docs/ANALYTICS.md docs/PRD.md` afterwards so the tables realign):

`docs/ARCHITECTURE.md`
- § Design system: replace the paragraph that begins "`src/design/` — tokens (colour, type, radius, shadow per `design-package/README.md`'s Design Tokens section, scaled per D19)" (it ends "…`Stat`, `Tabs`, `Timeline`).") with this ONE paragraph (Task 6 appends its islands/assets paragraph after it, W45): "`src/design/` — tokens (colour, type, radius, shadow per `design-package/README.md`'s Design Tokens section, scaled per D19), `Archivo` via `next/font/google` (`latin` + `latin-ext` subsets, self-hosted), **14** accessible primitives in `src/design/primitives/` (`Accordion`, `Button` — variants `primary|secondary|ghost|danger|inverse` and the `buttonClassName` helper —, `Card`, `Chip`, `Dialog`, `Eyebrow`, `FormField` with label/error/`aria-live`, `PausableMarquee`, `RadioChips` (a `role="radiogroup"` of native radios), `Section` with tones `light|dark|pale|band`, `SkipLink`, `Stat` — `value` counts up, `text` renders verbatim, neither renders nothing (W1) —, `Tabs` with `onChange`, `Timeline` with a `horizontal` variant), and the **shared page blocks** in `src/design/blocks/` (WP2a T0d): `FaqBlock` + FAQPage node, `Breadcrumbs` + BreadcrumbList node, `ClosingCtaBand`, `ProcessSteps`, `MetricStrip` over the `metrics` collection (unsigned metrics skipped, W1), `OfficeCard` over `offices` (every text field the row's own package id, W34), `PostCard` over `blog` (`null` for a locale the post is not written in, W33), `NewsletterBand` (nothing while `active={false}`, W5), `StoreBadges` (Android only, W8), `LogoMarquee` (nothing without logos, W6), `EmptyState` (the designed empty state, W6 — `role="status"`, copy from the page's `sys.<page>.empty.*`) and `ImageSlot` (one image slot: `next/image` with the asset, else a gradient placeholder named `data-placeholder="<slot>"`, `data-lcp-slot` on the page's LCP slot — the D26 markup contract `scripts/placeholder-count.ts` counts, W27/W55). Blocks are server components — nothing under `src/design/blocks/` carries `'use client'` (W13); every CTA that may be a contact door renders through `ContactCta`, which wraps T0c's `ContactLink` in the `Button` face (`buttonClassName`) so a page-level WhatsApp/call/e-mail CTA fires its event with `placement: 'page_cta' | 'office_card'` (W12) and any other href is a plain `Button` link. Every block that takes `bundle` also takes `locale` and resolves package ids through `makeTf(bundle, locale)` (D17: a re-authored `{metric}` string renders its figure); composed block copy is `sys.blocks.*` (today only `readMinutes`), the breadcrumb landmark label `sys.nav.breadcrumbs`. `src/lib/format/date.ts` (`formatDate`, `formatMonth`, `formatReadMinutes`) is the date counterpart of `formatTRY`: TR `12 Ocak 2026`, EN `12 January 2026` (en-GB, day first), always UTC calendar dates; it imports both message files, so only server components and tests use it."
- § Chrome: replace the whole paragraph that begins "**`StickyCtaBar` exists but is not mounted anywhere in the shipped chrome**" (untouched by Tasks 1–4; on main it ends with "is an open WP2 question, not a WP1 decision.") with: "**`StickyCtaBar` is page-mounted** (never the layout — `[locale]/(site)/dev/gallery` shows it) and resolves its own stacking (**W18**, T0d): while visible it publishes its rendered height as `--sticky-cta-h` on `<html>` (`0px` otherwise, on unmount, and below `lg` where it is `display:none`); `LanguageHint` and `WhatsAppFab` add `var(--sticky-cta-h, 0px)` to their bottom offset, so the sheet and the FAB ride above the bar; `ConsentBanner` (z-60) is unchanged and still wins. `hideNearId` names the element the bar advertises (the page's form or section id): the bar hides while that element is within the lower tenth of the viewport or above it — the design's Hire Workers rule (`isBarVisible`) — so it never covers the form it points at. `live` renders the design's green dot."

`docs/CONTENT-MODEL.md`
- § The `sys.*` range, the "**Chrome:**" bullet: after "`nav.legal`" (Task 3's addition) add ", `nav.breadcrumbs` (the `<nav aria-label>` of the `Breadcrumbs` block)".
- Same bullet list, add a final bullet (after the last existing bullet — Task 2's `sys.form.*` bullet if it sits last, else the Thank-you one): "- **Blocks (WP2a T0d, W54):** `blocks.readMinutes` (ICU plural on `{n}`: `5 min read` / `5 dk okuma`, read through `formatReadMinutes`). `sys.blocks.*` is the namespace for copy a shared block in `src/design/blocks/` composes; a block never reads `sys.<page>.*` — page-specific copy (empty-state titles, CTA labels, FAQ pairs) is passed in by the page, resolved."
- § Chrome canonical ids table: append the rows `| OfficeCard — directions | home.192 | footDirections — shared with the footer |`, `| OfficeCard / bands — WhatsApp label | home.221 | ctaWa |`, `| OfficeCard — city / kind / address / hours | contact.096–106, contact.133/134 through the row's own cityId / labelId / addressId + addressLine2Id / hoursId | from the offices collection, W34 |`, `| PostCard — FEATURED pill | blog.034 | |`, `| PostCard — "also in Turkish/English" pills | blog.077 / blog.081 | |`, `| NewsletterBand — title/body/no-spam | blog.036 / blog.037 / blog.038 | |`, `| StoreBadges | hire.240 / hire.241 | same ids as the footer; English on TR by the importer's override (W7/W51) |`, and one sentence under the table (before "Anything the package does not carry at all is `sys.*`…"): "Blocks under `src/design/blocks/` follow the same rule as the chrome: one canonical id per shared string, resolved through `makeTf(bundle, locale)`; everything page-specific (FAQ pairs, step titles, CTA labels, empty-state copy) is passed in by the page as an id or a resolved string."
- § Adding copy (Task 1's section, which after W54 lists `sys.form.*`, `sys.<page>.*`, `sys.seo.*`, `sys.blocks.*` and `sys.nav.*`): append one sentence to its paragraph: "`sys.blocks.*` is written only by T0d's shared blocks (`src/design/blocks/`); a page task that needs a new composed string for a block adds it there and documents it in the Blocks bullet of § The `sys.*` range."

`docs/SEO.md` § JSON-LD: in the paragraph beginning "**Shipped** (`src/lib/seo/jsonld.ts`)" (Task 4's rewrite, which keeps the WP1 sentence verbatim for this anchor) replace the clause "`breadcrumbJsonLd` and `faqJsonLd` are written but not yet called from any page" with "`breadcrumbJsonLd` and `faqJsonLd` (WP1) are called by the WP2a `Breadcrumbs`/`FaqBlock` blocks in `src/design/blocks/` (T0d) — a page gets the node by mounting the block, never by calling the builder itself".

`docs/ANALYTICS.md`
- § Event schema table: in the `call_click` row's "Fires on" cell replace Task 3's text "Phone tap/click (slim bar, footer, mobile bottom bar, form fallback, page CTAs)" with "Phone tap/click (chrome via `ContactLink` — slim bar, footer, mobile bottom bar; form fallback; page blocks via `ContactCta` — `page_cta`: `ClosingCtaBand`, `FaqBlock` ask card, `EmptyState`; `office_card`: `OfficeCard` rows)"; in the `whatsapp_click` row replace "WhatsApp CTA/FAB click" with "WhatsApp CTA/FAB click (chrome via `ContactLink`; page blocks via `ContactCta`, same placements)"; in the `email_click` row replace "`mailto:` link click" with "`mailto:` link click (chrome via `ContactLink`; page blocks via `ContactCta`/`OfficeCard`)".
- In the paragraph beginning "**WP1 wired exactly one of these seven events: `conversion`**" (Task 2's wording, whose second half Task 3 rewrote to name the chrome placements), replace the clause "`page_cta`/`office_card` are the WP2b blocks" with "`page_cta`/`office_card` are the shared blocks (T0d: `ContactCta` wraps `ContactLink` in the `Button` face for `ClosingCtaBand`, `FaqBlock`'s ask card and `EmptyState`; `OfficeCard`'s three contact rows are `ContactLink` with `office_card`)".

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
- `docs/SEO.md` § JSON-LD: the "`breadcrumbJsonLd` and `faqJsonLd` are written but not yet called from any page" sentence (kept verbatim by Task 4) → called by the WP2a `Breadcrumbs`/`FaqBlock` blocks (Cycle 9).
- `docs/ANALYTICS.md` § Event schema: the three contact rows' "Fires on" cells name `ContactCta`/`OfficeCard`; the "`page_cta`/`office_card` are the WP2b blocks" clause (Task 3's text) → are the shared blocks (Cycle 9).
- `docs/PRD.md` § 11 Design system bullet: "13 accessible primitives" → "14 accessible primitives (…) and the shared page blocks" (Cycle 9).

**Produces — deviations:** (1) Every id-taking block (`FaqBlock`, `ClosingCtaBand`, `ProcessSteps`, `MetricStrip`, `OfficeCard`, `PostCard`, `NewsletterBand`, `StoreBadges`) takes `bundle: Bundle` AND `locale: Locale` and resolves ids through Task 1's `makeTf(bundle, locale)`, not `makeT` — the skeleton listed ids without a resolver, and D17's re-authored `{metric}` strings (home.024/107/305, hire.198-class reply times) would otherwise render raw tokens. (2) `ContactCta` is not `ButtonProps & { placement }` with a `MouseEventHandler` (the draft's shape, refused by W32): it wraps Task 3's `ContactLink` in `buttonClassName(variant, size)` for a contact href and falls back to a plain `Button` for any other href, so it has no directive and the blocks folder ships no client component of its own; `isContactHref` is gone — `contactKindOf` (Task 3) is the one classifier. (3) `OfficeCard` renders the row's `labelId`/`addressLine2Id`/`hoursId` (W34) — no `KIND_LABEL_ID`, no `sys.office.hours`, no `formatWeekdays` (dropped from `date.ts`); its three contact rows are `ContactLink` (`office_card`) directly. (4) `PostCard` follows Task 1's `BlogPost` (`title/excerpt/slug` per locale, `categoryLabelId`, `key`; W33), returns `null` for an unwritten locale, and takes `coverSrc?: string | null` rendered through `ImageSlot` `blog-cover-<key>` instead of a `cover?: ReactNode` slot (W27/W55 — the placeholder is named). (5) New per W27: `ImageSlot` and `EmptyState` (`tone` optional with `'light'`, `headingLevel` and `className` added; `cta.external` added). (6) `sys.readMinutes` → `sys.blocks.readMinutes` (W54); `sys.office.*` removed. (7) `FaqBlock` takes `locale` (see 1) and its ask card carries `whatsappText` + `whatsappLabelId` (+ optional `phone`/`callLabelId`) because a WhatsApp link needs a prefill and a label; `ProcessSteps.variant` is `'cards' | 'plain'`; `ProcessStep.when` is a resolved string; `Breadcrumbs` items are `{ name; href: Href }` with the current page included and it takes `locale`; `NewsletterBand` is `{ bundle; locale; active; id?; children? }` (the page mounts its own `<FormShell>`); `StoreBadges` types `ios?: string | null`; `LogoMarquee` logos are `{ src; alt; width; height }` and it reads `sys.marquee.*` itself. (8) `Stat` gains `tone`; `StickyCtaBar` gains `live` and exports `isBarVisible`/`STICKY_CTA_HEIGHT_VAR`/`StickyCta`; `Button` gains `inverse`; `RadioChips` gains `legendHidden?`/`className?`; the blocks barrel re-exports Task 1's `BlogPost`/`Metric`/`MetricKey`/`Office` types rather than defining its own. (9) `src/test/bundle.ts` (`testBundle`, `BLOCK_STRINGS`) is an added test helper.
