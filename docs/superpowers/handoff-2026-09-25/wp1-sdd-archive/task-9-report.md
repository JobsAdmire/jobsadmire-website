# Task 9 — Shared chrome (slim bar, header/nav, footer, mobile bar, rails, hint, sticky CTA)

**Commit:** `1cec5f1` — `feat(chrome): slim bar, header/nav, footer, mobile bar, rails, language hint, sticky CTA from the bundle` (branch `wp1/foundation`, not pushed)

## What each component does (and the ids it reads)

| File | Kind | Summary (string ids) |
|---|---|---|
| `src/design/chrome/SlimBar.tsx` | server | Dark utility bar: licence long `hire.019` (≥lg) / short `calc.419` (<lg), `tel:` + `mailto:` from `settings.phone/phoneDisplay/email`, right-hand links Blog `home.013`, Careers `home.009`, Verify `home.011` (accent pill) and external Portal login `home.012` → `settings.portal.host + loginPath`. |
| `src/design/chrome/Header.tsx` | server | Sticky white bar: logo `next/image` `/brand/ja-mark.png` (priority) → `<nav aria-label={sys.nav.main}>` from `bundle.nav` (`desktopNav`, sorted by `order`, labels `t(labelId)`, `href as Href` per R17) → language pills (`home.016` as the group label) → secondary CTA = the `/partner-with-us` nav item (`home.008`, `hidden xl:inline-flex`) → primary CTA `home.014` + `home.015` (second half `hidden xl:inline`) → `MobileNav`. The four hrefs the design promotes (`/blog`, `/careers`, `/verify`, `/partner-with-us`) are filtered out of the desktop row (leaving the design's 7) and kept in the panel. |
| `src/design/chrome/MobileNav.tsx` | **client** | Hamburger `<button aria-expanded aria-controls>` labelled `hire.239` / `sys.nav.close`, 46 px rows, full-width panel with the language row and a `<nav aria-label={hire.239}>` of all 11 nav items; each link closes the panel. |
| `src/design/chrome/LanguageSwitcher.tsx` | **client** | One switcher for three placements (`light`/`dark`/`block`): `Link` to `usePathname()` in the other locale, `aria-current="true"` on the active one, 44 px targets. |
| `src/design/chrome/SocialRail.tsx` | server | Fixed left rail (`xl` only) of six branded links + `socialLinks(settings, prefill)`, the single list the footer reuses. WhatsApp via `waLink(settings.whatsappNumber, sys.whatsapp.prefill)`. |
| `src/design/chrome/WhatsAppFab.tsx` | server | Floating WhatsApp button, visible only 901–1100 px (`lg:flex xl:hidden`), `aria-label` `home.221`. |
| `src/design/chrome/MobileBottomBar.tsx` | server | `MobileBottomBarSpacer` (74 px, `lg:hidden`) + fixed two-column bar with `env(safe-area-inset-bottom)`: Call `hire.032` (`telLink`) and WhatsApp `home.221` (`waLink`). |
| `src/design/chrome/Footer.tsx` | server | Brand column (mark, tagline `home.188`, licence pill `hire.019`, dark language pills `home.016`, six social links) + four columns: `home.189` (employers + portal `home.012`), `home.190` (company), `home.191` (contact: phone, e-mail, Telegram `home.202`, two offices `home.196`/`home.198` and `home.197`/`home.199` with `maps` directions `home.192`, WhatsApp button `home.193`), `home.194`/`home.195` (app + store links `hire.240`, `hire.241` only when `storeLinks.ios` is non-null). Legal line `home.228`. |
| `src/design/chrome/LanguageHint.tsx` | **client** | Pure `shouldShowHint(locale, languages, dismissed)` + the bar itself: English copy in both locales (`sys.languageHint.*`), `Link` to the same pathname in `en`, dismissal written to `localStorage['ja-lang-hint'] = 'off'`. |
| `src/design/chrome/StickyCtaBar.tsx` | **client** | Page-mounted (never in the layout): `message` + `ctas`, appears past 700 px of scroll, `lg` and up only. |
| `src/design/chrome/SiteChrome.tsx` | server | SkipLink (`sys.skipToContent`) → SlimBar → Header → LanguageHint → (SocialRail + WhatsAppFab unless `variant="minimal"`) → `children` → spacer → MobileBottomBar → Footer. |
| `src/design/chrome/icons.tsx` | server-safe | The 11 decorative glyphs from the design package (`aria-hidden`, never the accessible name). |
| `src/lib/contact.ts` | — | `waLink`, `telLink`, `mailLink` exactly as the brief specifies. |

**Two files beyond the brief's list, both deliberate:**

- `LanguageSwitcher.tsx` — the switcher must keep the visitor on the page they are reading, and the current pathname is a browser fact (`usePathname()` is client-only, and a server layout cannot read it). It is used in three placements, so duplicating it into Header/MobileNav/Footer would have been three copies of the same client component.
- `icons.tsx` — the WhatsApp/Telegram/social/phone glyphs are needed by four chrome files; one module instead of four copies of the same SVG paths.

## How the `sys` strings reach Header/MobileNav

`Header` is a **sync server component that calls `useTranslations('sys')` itself**. next-intl resolves that against the request config in the RSC build (`dist/esm/*/react-server/useTranslations.js`, verified) and against `NextIntlClientProvider` in Vitest, so the brief's "render `Header` directly through `renderWithIntl`" works unchanged and no `sys` props are drilled. The same holds for `SlimBar`/`Footer`/`SocialRail`/`WhatsAppFab`/`MobileBottomBar`/`SiteChrome`. `MobileNav` (client) receives **only** already-translated strings (`menuLabel` = `hire.239`, `closeLabel` = `sys.nav.close`, `languageLabel` = `home.016`), a plain `{ href, label, external }[]` and `locale` — no bundle, no `t` (D6).

## R19 — what worked

`test.server.deps.inline: ['next-intl']` **alone**. With next-intl left external, Node's ESM resolver refuses `next-intl/…/createNavigation.js` → `next/navigation`; inlined, Vite's resolver completes the extension. The `resolve.alias` entries for `next/navigation` and `next/link` were tried first, proved unnecessary once inlining was in place, and were removed (comment in `vitest.config.ts` records this).

## RED → GREEN

```
# RED (before implementation)
$ npx vitest run src/design/chrome
 Test Files  3 failed (3) — Failed to resolve import "../Header" / "../LanguageHint" / "../Footer"

# R19 probe, before the config change
$ npx vitest run src/design/primitives/__tests__/Button.test.tsx
 FAIL … Error: Cannot find module '…/node_modules/next/navigation' imported from
 …/next-intl/dist/esm/development/navigation/react-client/createNavigation.js
# after `server.deps.inline: ['next-intl']`
 Test Files  1 passed (1) · Tests  3 passed (3)

# GREEN
$ npx vitest run src/design/chrome
 Test Files  3 passed (3) · Tests  11 passed (11)
```

## verify

```
$ npm run verify
typecheck ✓  lint ✓  prettier ✓
 Test Files  16 passed (16)
      Tests  62 passed (62)
```
Output pristine apart from the pre-existing Vitest `configLoader: 'native'` warning. No React `act()` or key warnings.

## build (R26)

```
$ npm run build
▲ Next.js 16.3.5 (Turbopack)
✓ Compiled successfully in ~1.4s   Finished TypeScript …
✓ Generating static pages (8/8)
Route (app): ○ /_not-found · ● /tr · ● /en · ● /tr/hire-workers · ● /en/hire-workers · ƒ /api/revalidate
ƒ Proxy (Middleware)
```
No warnings beyond the expected `ƒ Proxy (Middleware)` label.

## Playwright (R26)

`next start -p 3100` (pid file in the session scratchpad), `E2E_BASE_URL=http://localhost:3100 npx playwright test e2e/routing.spec.ts e2e/smoke.spec.ts --project=desktop`:

```
✓ 1 root is Turkish, unprefixed        ✓ 6 the Link component emits the localized href
✓ 2 /en is English                     ✓ 7 API routes are not intercepted by the locale proxy
✓ 3 /tr prefix redirects               ✓ 8 the locale cookie uses our name
✓ 4 localized Turkish slug             ✓ 9 home responds
✓ 5 English slug under /en
9 passed
```
The spike page's `page.locator('a', { hasText: 'hire' })` stayed unambiguous with the chrome mounted (verified: exactly one anchor on `/` contains "hire"), so **no `data-testid` was added and no assertion was touched**. Server killed; `curl` confirms it is down.

**Extra manual browser check (temporary spec, deleted again):** no React hydration errors, no `pageerror`, no console warnings on `/`, `/en`, `/isci-talebi`; the only console noise is ten `404`s per page — Next's RSC **prefetches of nav routes that do not exist yet** (`/hakkimizda`, `/adaylar`, …). They disappear as WP2 lands those pages. A real-browser check of the hamburger at 390 px also passed (panel opens, 11 links, `aria-expanded` flips, close label).

## Files changed (31 files, +1211 / −11)

New: `src/design/chrome/{SlimBar,Header,MobileNav,SocialRail,WhatsAppFab,MobileBottomBar,Footer,LanguageHint,StickyCtaBar,SiteChrome,LanguageSwitcher,icons}.tsx` (67/86/81/78/22/39/175/85/56/46/61/110 lines), `src/design/chrome/__tests__/{Header,Footer,LanguageHint}.test.tsx` (83/71/17), `src/design/primitives/__tests__/Button.test.tsx` (35), `src/lib/contact.ts` (9), `src/test/render.tsx` (27), `public/brand/ja-mark.png`.
Modified: `src/app/[locale]/layout.tsx` (+9/−2, mounts `SiteChrome` after `await getBundle(locale)`), `src/app/[locale]/page.tsx` (`<main id="main">`), `src/app/[locale]/hire-workers/page.tsx` (`<main id="main">`), `src/messages/{tr,en}.json` (+11 each), `vitest.config.ts` (R19), `vitest.setup.ts` (R25).
Deleted: `public/{file,globe,next,vercel,window}.svg` (R16).

## Self-review findings

1. **`Footer.tsx` is 175 lines**, past the ~150 guideline. Flagged rather than split: it is one component and the brief's file list has no sub-components for it.
2. **`hire-workers/page.tsx` also got `<main id="main">`** — one file beyond the brief's "Modify" list. Without it the skip link points at nothing on `/isci-talebi`, which is exactly the D20 defect the SkipLink exists to prevent.
3. **Slim-bar link targets are 26 px, not 44 px** (comment in the file). These are inline utility links in a 33 px bar — WCAG 2.5.8 AA asks 24 px and exempts inline links; 44 px there would have made every page's top edge ~52 px tall. Every primary target (hamburger 46 px, language pills, CTAs, mobile bar 48 px, social circles 44 px) is ≥44 px.
4. **`settings.licence` is not rendered directly.** The brief asked for "permit/law/tax from `settings.licence`" in the legal row, but R15 pins that row to `home.228`, whose copy already carries 1730 / 4904 / 48422122 in both locales; printing both would duplicate the same three numbers. The Footer test asserts the rendered legal line contains `settings.licence.permitNo`.
5. **Footer columns are not an `Accordion`.** The brief's own test note says the below-900 px collapse is CSS-only, so the columns are always-open headings + link lists that stack — no viewport-dependent client component, no `aria-expanded` state that contradicts what is on screen.
6. **Two ids outside R15's list:** `hire.032` ("Bizi arayın" / "Call us") for the mobile bar's call button — R15 does not cover the mobile bar, and `callUs` is the key the design package itself uses on that exact button — and `home.008` for the secondary CTA, which comes from `bundle.nav` like every other nav label. `sys.marquee.pause/play` were added as instructed although chrome itself has no marquee.
7. **Only three of the design's four language placements** are wired (header pills, hamburger panel, footer). The design's fourth is the slim bar's mobile-only pills, which exist there because its header hides its pills below 900 px; ours keeps them at every width, so a fourth copy would be redundant.
8. **No street addresses in the footer offices.** The package has no ids for them (the design hard-codes them); office name, hours and a `maps` directions link are rendered instead, and inventing `sys.*` address copy was out of scope.
9. `shouldShowHint` follows the brief's expression exactly (`startsWith('en')`), so an invented tag like `english-x` would match; real `navigator.languages` values are BCP-47, and a test asserting the stricter subtag rule was removed rather than silently changing the spec.
10. **Effects:** `LanguageHint` and `StickyCtaBar` read browser facts through `useSyncExternalStore` (the repo's R18 precedent), not `useEffect` + `setState` — the latter is an eslint error here (`react-hooks/set-state-in-effect`) and would have cost a cascading render.
11. The commit carries the standing `Co-Authored-By: Claude Opus 5 (1M context)` trailer under the brief's exact subject line.

## Concerns

- `StickyCtaBar` ships untested (no test in the brief); its behaviour is one `useSyncExternalStore` over `scroll`.
- Chrome is unit- and build-verified but has had **no `npm run gate` run** (axe/Lighthouse/responsive) — that is the work-package gate, not this task's, and the repo's checklist expects it before WP1 is called done.
- The chrome duplicates a few links across placements by design (Blog/Verify/Careers in the slim bar and the hamburger panel; WhatsApp in rail, FAB, bar and footer). That mirrors the design package; if the eventual axe/Lighthouse run objects to repeated link names, the slim bar is the place to prune.

---

# Fix round 1

**Commit:** `374b785` — `fix(chrome): spacer after footer, external-aware nav links, footer accordions on mobile, main landmark in SiteChrome` (local, not pushed). Files: `SiteChrome.tsx`, `Header.tsx`, `MobileNav.tsx`, `Footer.tsx`, new `NavLink.tsx`, `__tests__/{Header,Footer}.test.tsx`, both spike pages.

## 1 — Spacer placement (R29)

`src/design/chrome/SiteChrome.tsx:40-44` — new order: … WhatsAppFab → `<main id="main">{children}</main>` → `Footer` → `MobileBottomBar` (fixed, position in the tree is cosmetic) → `MobileBottomBarSpacer` **last in flow**, with the R29 comment. The İŞKUR legal line is no longer under the fixed bar.

**Covering test:** real-browser check at 390 × 780 (temporary spec, deleted after the run): the legal line's bottom edge is above the fixed bar's top edge — `1 passed`. Also asserted on the rendered HTML: `main before footer: True`, `spacer after legal line: True`, `main count: 1`.

## 2 — Desktop nav ignored `external`

New `src/design/chrome/NavLink.tsx` (46 lines) is the single branch for every chrome nav row: `external` → `<a target="_blank" rel="noopener noreferrer">`, `/…` → next-intl `Link` (`href as Href`, R17), anything else (`tel:`, `mailto:`) → same-tab anchor (Button's R22 tail).
- `Header.tsx:52` desktop row now renders `<NavLink item={item} …>`; `Header.tsx:61` passes `external={secondary.external}` to the secondary CTA; the unused `Href` import is gone.
- `MobileNav.tsx:58` renders the panel through the same `NavLink` (its `MobileNavItem` type is replaced by `NavLink`'s exported `ChromeNavItem`).
- `Footer.tsx:36-43,63-72,112-124` column links and the portal/store links go through `NavLink` too, so `external` is honoured in the footer as well.

**Covering test:** `Header.test.tsx` — new case *"renders an external nav entry as a new-tab anchor in both rows"*, driven by a second `BundleSchema.parse(...)` bundle whose nav carries one `external: true` entry; asserts `href`/`target`/`rel` in the desktop row **and** in the opened panel. `Footer.test.tsx` — new case *"opens the portal login in a new tab from the employers column"*.

## 3 — Footer accordions on mobile (R30)

`Footer.tsx:60-137` builds the four columns once as `{ id, heading, body }` and renders them **twice**: `Footer.tsx:158-163` static grid columns `hidden lg:block`, `Footer.tsx:165-170` the T8 `Accordion` (`singleOpen={false}`) inside a `lg:hidden` wrapper. No `matchMedia`, no timing: the hidden copy is `display:none` and out of the accessibility tree. The brand column is rendered **once** (grid child, full width below `lg`), so the six social links stay unique.

Deviation from the ruling's wording, deliberate: there is **no extra client wrapper**. `Accordion` is itself the `'use client'` component, and a server component may pass it `body` elements — that is the RSC element-prop path, it carries no functions and no bundle (D6 holds), and it keeps the office hours (`home.198`/`home.199`) and the app blurb (`home.195`) inside the mobile accordion, which a `{ heading, links[] }`-only shape would have dropped on phones.

**Covering test:** `Footer.test.tsx` — *"collapses the columns into real accordion buttons for mobile"*: header is a real `button` with `aria-expanded="false"`, its `aria-controls` panel is not visible, clicking flips it to `true` and reveals the localized `/isci-talebi` link, and a second column can be open at the same time. *"renders the four column headings in both the grid and the accordion"* asserts 2 headings per column.

## 4 — Header panel count

`Header.test.tsx:20` adds `const desktopNav = bundle.nav.filter((n) => n.group === 'desktopNav')`; the panel assertion is now `toHaveLength(desktopNav.length)` instead of `bundle.nav.length`.

## 5 — Panel scrolling

`MobileNav.tsx:44` — `max-h-[80dvh] overflow-y-auto` on the panel, with the comment naming the case (eleven 46 px rows plus the language row on a landscape phone).

## 6 — Footer mark decorative

`Footer.tsx:144` — `alt=""`. The header mark keeps `alt="JobsAdmire"` (`Header.tsx:46`), so the logo link still has an accessible name.

## 7 — `hire.032` kept

Unchanged, as sanctioned.

## R31 — `<main id="main">` in SiteChrome

`SiteChrome.tsx:40` wraps `{children}`; `src/app/[locale]/page.tsx` and `src/app/[locale]/hire-workers/page.tsx` no longer render their own `<main>` (both keep `data-testid`, the home page keeps the spike `hire` link). Exactly one `main` per page, verified on the rendered HTML. No test asserted the old structure.

## Commands and output

```
$ npx vitest run src/design/chrome
 Test Files  3 passed (3) · Tests  14 passed (14)

$ npm run format:write   # then
$ npm run verify
typecheck ✓  lint ✓  prettier ✓
 Test Files  16 passed (16) · Tests  65 passed (65)      (was 62; +3 new cases)

$ npm run build
✓ Compiled successfully · ✓ Generating static pages (8/8)
Route (app): ○ /_not-found · ● /tr · ● /en · ● /tr/hire-workers · ● /en/hire-workers · ƒ /api/revalidate
ƒ Proxy (Middleware)        # no other warnings

$ E2E_BASE_URL=http://localhost:3100 npx playwright test e2e/routing.spec.ts e2e/smoke.spec.ts --project=desktop
✓ 1 root is Turkish, unprefixed          ✓ 6 the Link component emits the localized href
✓ 2 /en is English                       ✓ 7 API routes are not intercepted by the locale proxy
✓ 3 /tr prefix redirects                 ✓ 8 the locale cookie uses our name
✓ 4 localized Turkish slug               ✓ 9 home responds
✓ 5 English slug under /en
9 passed
```
Extra temporary browser spec (deleted; `test-results/` and `playwright-report/` removed): mobile-bar-clears-legal-line + footer accordion at 390 px — `1 passed`, no page errors and no console errors other than the known RSC prefetch 404s for pages WP2 has yet to add. `next start -p 3100` killed (pid file removed; `curl` confirms the port is down); working tree clean.

## Note for the controller

The one judgement call in this round is item 3's "no extra client wrapper" — same outcome and the same D6 guarantee, one fewer file, and no content dropped from the mobile accordion. Say the word and I will convert it to a `{ heading, links[] }` client wrapper, at the cost of the office hours and app blurb below `lg`.
