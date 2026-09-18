# Analytics — JobsAdmire Website

Full context: plan D13. IDs and the GTM container inventory are config values, not secrets — but still centralised, not hard-typed per page.

## Consent Mode v2 loading order

1. Consent Mode default state fires **inline**, before any tag loads — `ad_storage`, `analytics_storage`, `ad_user_data`, `ad_personalization` all default to `denied` until the visitor interacts with the consent banner.
2. `url_passthrough` and `ads_data_redaction` are enabled so Ads conversion measurement degrades gracefully under denial rather than breaking.
3. GTM loads via `@next/third-parties`.
4. **GA4 is loaded only through GTM** — never a direct `gtag.js`/`analytics.js` include anywhere in the codebase. This is a hard rule, not a preference: it's the only way the GTM container inventory (below) stays the single source of truth for what fires.

## IDs (config values — CMS-driven in Phase B, env/constants in Phase A)

| ID                       | Value            |
| ------------------------ | ---------------- |
| GA4 Measurement ID       | `G-77Y5KBV97L`   |
| GTM Container ID         | `GTM-N2CLWJWJ`   |
| Google Ads Conversion ID | `AW-17096273578` |

These are public identifiers (they ship in the page source by nature of how GTM/GA4/Ads work) — they are config values, not secrets, and belong in the Integrations screen (D12) in Phase B with a **test button** that fires a verifiable test event.

## Event schema

| Event            | Fires on                                                                                | Parameter allowlist                                                        |
| ---------------- | --------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `generate_lead`  | Every form's successful submission, once, on arrival at `/tesekkurler?form=<key>`       | `form_key`, `page_path`, `locale` — **no candidate reference of any kind** |
| `call_click`     | Phone number tap/click (header, footer, mobile bottom bar, page CTAs)                   | `page_path`, `locale`                                                      |
| `whatsapp_click` | WhatsApp CTA/FAB click (both the direct CTA and the visitor fallback panel's deep link) | `page_path`, `locale`, `context` (`primary` \| `fallback`)                 |
| `email_click`    | `mailto:` link click                                                                    | `page_path`, `locale`                                                      |

**Coverage:** all 14 pages instrumented — this is a Gate A checklist item, not optional per-page. **Parameter allowlist rule:** no event, on any page, ever carries a candidate name, phone number, email, free-text form content, or any other identifier a visitor typed into a form. This is enforced by keeping the event-firing code entirely separate from form payload data — the event only ever sees `formKey` and page context, never the submitted fields.

## Conversion

Fires on `/tesekkurler?form=<key>` — the single navigation target every form's success path uses (D13, `docs/PRD.md` §2). This is why the inline-success-panel pattern from the design package was explicitly overridden: Ads conversion measurement needs a real navigation to attach to, and GA4/GTM event-only conversions on an SPA-style panel are the failure mode the plan calls out ("conversion orphaned" risk, plan §9).

## Vercel Web Analytics as the consent-independent truth

GA4 numbers are consent-gated and will always undercount. **Vercel Web Analytics** (and Speed Insights) run independent of the consent banner and are the number used for the 12-week post-launch traffic watch (`docs/SEO.md`) and any GA4-vs-reality sanity check. **GA4 is never compared across the launch boundary** — old-site GA4 and new-site GA4 are different properties/configurations and a raw before/after comparison is not meaningful; use GSC clicks and Vercel Web Analytics for that comparison instead.

## Weekly three-way reconciliation

Form submissions (Operations `WebsiteFormSubmission` count) vs. `generate_lead` events (GA4) vs. Ads conversions — run weekly during the 12-week watch. A mismatch in either direction is the fastest signal that either the conversion page isn't being reached (forms work, no `generate_lead`) or forms are silently failing while WhatsApp absorbs the traffic (`generate_lead` low, WhatsApp clicks high).

## GTM container inventory (export in WP0)

_Placeholder — to be filled from the GTM `GTM-N2CLWJWJ` and Ads `AW-17096273578` export performed in WP0 (plan, WP0 item 0). Record here: every tag, its trigger, and whether it's still wired to a live destination, before any new tag is added for this rebuild._

| Tag                  | Trigger | Destination | Status |
| -------------------- | ------- | ----------- | ------ |
| _pending WP0 export_ |         |             |        |
