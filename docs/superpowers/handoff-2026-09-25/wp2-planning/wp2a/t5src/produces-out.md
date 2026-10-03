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


**Produces — deviations:** (1) Every id-taking block (`FaqBlock`, `ClosingCtaBand`, `ProcessSteps`, `MetricStrip`, `OfficeCard`, `PostCard`, `NewsletterBand`, `StoreBadges`) takes `bundle: Bundle` AND `locale: Locale` and resolves ids through Task 1's `makeTf(bundle, locale)`, not `makeT` — the skeleton listed ids without a resolver, and D17's re-authored `{metric}` strings (home.024/107/305, hire.198-class reply times) would otherwise render raw tokens. (2) `ContactCta` is not `ButtonProps & { placement }` with a `MouseEventHandler` (the draft's shape, refused by W32): it wraps Task 3's `ContactLink` in `buttonClassName(variant, size)` for a contact href and falls back to a plain `Button` for any other href, so it has no directive and the blocks folder ships no client component of its own; `isContactHref` is gone — `contactKindOf` (Task 3) is the one classifier. (3) `OfficeCard` renders the row's `labelId`/`addressLine2Id`/`hoursId` (W34) — no `KIND_LABEL_ID`, no `sys.office.hours`, no `formatWeekdays` (dropped from `date.ts`); its three contact rows are `ContactLink` (`office_card`) directly. (4) `PostCard` follows Task 1's `BlogPost` (`title/excerpt/slug` per locale, `categoryLabelId`, `key`; W33), returns `null` for an unwritten locale, and takes `coverSrc?: string | null` rendered through `ImageSlot` `blog-cover-<key>` instead of a `cover?: ReactNode` slot (W27/W55 — the placeholder is named). (5) New per W27: `ImageSlot` and `EmptyState` (`tone` optional with `'light'`, `headingLevel` and `className` added; `cta.external` added). (6) `sys.readMinutes` → `sys.blocks.readMinutes` (W54); `sys.office.*` removed. (7) `FaqBlock` takes `locale` (see 1) and its ask card carries `whatsappText` + `whatsappLabelId` (+ optional `phone`/`callLabelId`) because a WhatsApp link needs a prefill and a label; `ProcessSteps.variant` is `'cards' | 'plain'`; `ProcessStep.when` is a resolved string; `Breadcrumbs` items are `{ name; href: Href }` with the current page included and it takes `locale`; `NewsletterBand` is `{ bundle; locale; active; id?; children? }` (the page mounts its own `<FormShell>`); `StoreBadges` types `ios?: string | null`; `LogoMarquee` logos are `{ src; alt; width; height }` and it reads `sys.marquee.*` itself. (8) `Stat` gains `tone`; `StickyCtaBar` gains `live` and exports `isBarVisible`/`STICKY_CTA_HEIGHT_VAR`/`StickyCta`; `Button` gains `inverse`; `RadioChips` gains `legendHidden?`/`className?`; the blocks barrel re-exports Task 1's `BlogPost`/`Metric`/`MetricKey`/`Office` types rather than defining its own. (9) `src/test/bundle.ts` (`testBundle`, `BLOCK_STRINGS`) is an added test helper.
