### Task 12: Consent Mode v2, GTM loader, analytics helper, thank-you page

**Files:**

- Create: `src/analytics/consent.ts`, `src/analytics/track.ts`, `src/analytics/track.test.ts`, `src/analytics/GtmLoader.tsx`, `src/design/chrome/ConsentBanner.tsx`, `src/app/[locale]/thank-you/page.tsx`
- Modify: `src/app/[locale]/layout.tsx`, `src/messages/{tr,en}.json` (consent + thank-you `sys.*` copy)

**Interfaces:**

- Produces: `track(event: EventName, params: Record<string, string | number>)` (drops non-allow-listed params; pushes to `window.dataLayer`), `ALLOWED_PARAMS`, `ConsentState = 'unknown' | 'granted' | 'denied'`, `readConsent()`, `writeConsent(state)` (localStorage `ja_consent_v1` + cookie), `<GtmLoader gtmId />` (renders the inline consent-default script in `<head>` and `GoogleTagManager` from `@next/third-parties/google`), `<ConsentBanner />` (client).

- [ ] **Step 1: Failing test**

`src/analytics/track.test.ts`:

```ts
import { beforeEach, describe, expect, it } from 'vitest';
import { track } from './track';

describe('track (D13 parameter allowlist)', () => {
  beforeEach(() => {
    (window as unknown as { dataLayer: unknown[] }).dataLayer = [];
  });
  it('pushes allow-listed params only — never candidate refs', () => {
    track('generate_lead', {
      form_key: 'hire',
      page: '/isci-talebi',
      locale: 'tr',
      profiles: 'JA-1042,JA-1058',
      ref: 'JA-1042',
    } as never);
    const pushed = (window as unknown as { dataLayer: Record<string, unknown>[] }).dataLayer[0];
    expect(pushed).toEqual({
      event: 'generate_lead',
      form_key: 'hire',
      page: '/isci-talebi',
      locale: 'tr',
    });
  });
  it('rejects unknown events at the type level and at runtime', () => {
    expect(() => track('profile_select' as never, {})).toThrow(/unknown analytics event/);
  });
});
```

- [ ] **Step 2: Implement**

`src/analytics/track.ts`:

```ts
export const ALLOWED_PARAMS = {
  generate_lead: ['form_key', 'page', 'locale'],
  conversion: ['form_key', 'page', 'locale'],
  call_click: ['page', 'locale', 'placement'],
  whatsapp_click: ['page', 'locale', 'placement'],
  email_click: ['page', 'locale', 'placement'],
  calculator_use: ['page', 'locale', 'role', 'headcount'],
  language_switch: ['from', 'to'],
} as const;
export type EventName = keyof typeof ALLOWED_PARAMS;

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function track(event: EventName, params: Partial<Record<string, string | number>>) {
  const allowed = ALLOWED_PARAMS[event];
  if (!allowed) throw new Error(`unknown analytics event: ${String(event)}`);
  const clean: Record<string, unknown> = { event };
  for (const k of allowed) if (params[k] !== undefined) clean[k] = params[k];
  (window.dataLayer ??= []).push(clean);
}
```

`src/analytics/consent.ts`:

```ts
export type ConsentState = 'unknown' | 'granted' | 'denied';
const KEY = 'ja_consent_v1';
/** Inline in <head> before GTM: Consent Mode v2 defaults denied (D13). */
export const CONSENT_DEFAULT_SCRIPT = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)};gtag('consent','default',{ad_storage:'denied',analytics_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',functionality_storage:'granted',security_storage:'granted',wait_for_update:500});gtag('set','url_passthrough',true);gtag('set','ads_data_redaction',true);`;
export function readConsent(): ConsentState {
  try {
    return (localStorage.getItem(KEY) as ConsentState) ?? 'unknown';
  } catch {
    return 'unknown';
  }
}
export function writeConsent(state: Exclude<ConsentState, 'unknown'>) {
  try {
    localStorage.setItem(KEY, state);
  } catch {
    /* private mode */
  }
  document.cookie = `${KEY}=${state}; Max-Age=${60 * 60 * 24 * 180}; Path=/; SameSite=Lax`;
  const v = state === 'granted' ? 'granted' : 'denied';
  (window.dataLayer ??= []).push({ event: 'consent_update' });
  // gtag is defined by the inline default script
  (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.('consent', 'update', {
    ad_storage: v,
    analytics_storage: v,
    ad_user_data: v,
    ad_personalization: v,
  });
}
```

`src/analytics/GtmLoader.tsx`:

```tsx
import Script from 'next/script';
import { GoogleTagManager } from '@next/third-parties/google';
import { CONSENT_DEFAULT_SCRIPT } from './consent';

export function GtmLoader({ gtmId }: { gtmId: string | null }) {
  return (
    <>
      <Script id="consent-default" strategy="beforeInteractive">
        {CONSENT_DEFAULT_SCRIPT}
      </Script>
      {gtmId ? <GoogleTagManager gtmId={gtmId} /> : null}
    </>
  );
}
```

(`npm install @next/third-parties`.) In `layout.tsx` render `<GtmLoader gtmId={bundle.settings.analytics.gtmId} />` when `settings.analytics.consentMode` is true. GA4 is never loaded directly — only through the container (D13).

`ConsentBanner.tsx` (client): reads consent in an effect, renders nothing until known; if `unknown`, renders a bottom sheet with `sys.consent.*` copy (title, body, accept, reject, link to `/cookie-policy`), buttons ≥44 px, `role="region" aria-label`; on click → `writeConsent`. Add the `sys.consent.*` and `sys.thankYou.*` strings to both message files.

`src/app/[locale]/thank-you/page.tsx`: reads `searchParams.form`, renders `sys.thankYou.title`/`body` (+ a form-specific line when known: `hire`, `contact`, `partner`, `careers`, `newsletter`), links home and to WhatsApp; mounts a client `<ConversionPing formKey />` that calls `track('conversion', { form_key, page, locale })` once per mount; `generateMetadata` sets `robots: noindex`.

Run: `npm run test -- src/analytics` and `npm run verify` Expected: green.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat(analytics): consent mode v2 defaults, GTM-only loader, allow-listed track(), thank-you conversion page"
```

---

