### Task 9: Shared chrome (slim bar, header/nav, footer, mobile bar, rails, hint, sticky CTA) from the bundle

**Files:**

- Create: `src/design/chrome/{SlimBar,Header,MobileNav,SocialRail,WhatsAppFab,MobileBottomBar,Footer,LanguageHint,StickyCtaBar,SiteChrome}.tsx`, `src/design/chrome/__tests__/{Header,LanguageHint,Footer}.test.tsx`, `src/lib/contact.ts`
- Modify: `src/app/[locale]/layout.tsx` (mount `SiteChrome`), `src/app/[locale]/page.tsx` (`<main id="main">`)

**Interfaces:**

- Consumes: `getBundle`, `makeT`, `Link`, primitives.
- Produces: `SiteChrome({ locale, bundle, children })` (server component rendering SkipLink → SlimBar → Header → SocialRail → WhatsAppFab → `{children}` → MobileBottomBar spacer → MobileBottomBar → Footer), `waLink(number, text)`, `telLink(phone)`, `LanguageHint` (client: shows once for `navigator.languages` starting with `en` when locale is `tr`, dismissal stored in `localStorage['ja-lang-hint']`).

Chrome facts (from the Homepage reader, normalised): dark chrome `#0e1a37` (the design files used `#0a1428`; README `#0e1a37` wins), slim bar text 12.5 px → 11 px desktop, nav rows 46 px, hamburger below 900 px, secondary CTA hidden ≤1100 px, mobile bottom bar below 900 px with a 74 px spacer, social rail + WhatsApp FAB on the pages that carry them (a `variant` prop), footer four columns (accordions below 900 px using `Accordion`), language switcher shows `Türkçe · English` in four placements from one list, licence line long/short variants (`home.011`/short `home.012` — verify ids in `catalogue.json` by `k` = `slimLic`/`slimLicShort` and use those).

- [ ] **Step 1: Failing tests**

`src/design/chrome/__tests__/Header.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Header } from '../Header';
import fixture from '../../../../contract/website-bundle.v1.fixture.json';
import type { Bundle } from '../../../../contract/website-bundle.v1';

describe('Header', () => {
  it('renders the desktop nav from bundle.nav with localized hrefs and a labelled hamburger', () => {
    render(
      <Header
        locale="tr"
        bundle={fixture as Bundle}
        primaryCta={{ labelId: 'home.002', href: '/hire-workers' }}
      />,
    );
    const nav = screen.getByRole('navigation', { name: /ana menü|main menu/i });
    expect(nav.querySelectorAll('a').length).toBeGreaterThanOrEqual(7);
    expect(screen.getByRole('button', { name: /menü|menu/i })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });
});
```

(The `Link` from next-intl needs a provider in tests: wrap with `NextIntlClientProvider locale="tr" messages={{}}`; put a `renderWithIntl` helper in `src/test/render.tsx` and use it in all chrome tests.)

`__tests__/LanguageHint.test.tsx`:

```tsx
import { describe, expect, it, vi } from 'vitest';
import { shouldShowHint } from '../LanguageHint';

describe('LanguageHint', () => {
  it('shows once for English browsers on Turkish pages, never after dismissal', () => {
    expect(shouldShowHint('tr', ['en-US', 'en'], null)).toBe(true);
    expect(shouldShowHint('tr', ['tr-TR'], null)).toBe(false);
    expect(shouldShowHint('en', ['en-US'], null)).toBe(false);
    expect(shouldShowHint('tr', ['en-US'], 'off')).toBe(false);
  });
});
```

`__tests__/Footer.test.tsx`: renders four column headings (`h4` → real `button` toggles below 900 px is CSS-only; assert the four `<h2 class=sr-only>`/headings exist, the licence line contains `1730`, the six social links have accessible names, and the Android store link is present while iOS is absent when `storeLinks.ios` is null.

- [ ] **Step 2: Implement**

`src/lib/contact.ts`:

```ts
export const waLink = (number: string, text: string) =>
  `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
export const telLink = (phone: string) => `tel:${phone}`;
export const mailLink = (email: string, subject?: string) =>
  `mailto:${email}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`;
```

`LanguageHint.tsx` exports the pure `shouldShowHint(locale, languages: readonly string[], dismissed: string | null)` = `locale === 'tr' && languages.some((l) => l.toLowerCase().startsWith('en')) && dismissed !== 'off'`, plus the client component that reads `navigator.languages` and `localStorage.getItem('ja-lang-hint')` in an effect (never during render — hydration), renders a dismissible bar with a `Link` to the same pathname in `en` (`usePathname()` + `<Link href={pathname} locale="en">`) and writes `off` on dismiss.

`Header.tsx` (server component + a small client `MobileNav` for the hamburger state): `<header className="sticky top-0 z-40 bg-white">` → logo `Link href="/"` (`/design-package/assets/ja-mark.png` copied to `public/brand/ja-mark.png`) → `<nav aria-label={t('sys.nav.main') ...}>` listing `bundle.nav.filter(g => g.group==='desktopNav')` sorted by `order` (labels via `t(labelId)`, `Link href={item.href as never}`) hidden below `lg` → language pills (`Link` to current pathname in the other locale, `aria-current` on the active one) → secondary CTA (hidden below `xl`) → primary CTA (`Button`) → `MobileNav` (client) with a `<button aria-expanded aria-controls="mobile-nav">` and a full-width panel of 46 px rows.

`SlimBar.tsx`: dark bar with the licence line (long/short spans), `tel:` and `mailto:` links, right-hand links (Blog, Careers, Verify, Portal login) — `bundle.nav` groups `slimBarRight` (the importer only fills `desktopNav` today; SlimBar derives from the four hrefs directly until WP2 fills the group).

`SocialRail.tsx`, `WhatsAppFab.tsx`, `MobileBottomBar.tsx` (fixed two-column Call / WhatsApp, `env(safe-area-inset-bottom)`, plus the 74 px spacer as a sibling), `StickyCtaBar.tsx` (client: appears after 700 px scroll on `lg+`, hidden ≤700 px; props `message`, `ctas`), `Footer.tsx` (brand blurb, licence pill, language switcher, six social links from `settings.social` + WhatsApp + Telegram, four columns, two office blocks with `maps` links, store badges — iOS only when non-null — legal row with permit/law/tax from `settings.licence`).

`SiteChrome.tsx` composes them; `layout.tsx` calls `getBundle(locale)` and renders `<SiteChrome locale bundle variant="default">`.

Run: `npm run test -- src/design/chrome` and `npm run verify` Expected: green.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat(chrome): slim bar, header/nav, footer, mobile bar, rails, language hint, sticky CTA from the bundle"
```

---

