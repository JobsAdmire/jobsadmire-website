### Task 15: Documentation sync + WP1 exit

**Files:**

- Modify: `docs/ARCHITECTURE.md` (stack spike result, adapter, contract, redirects, consent, site-health), `docs/CONTENT-MODEL.md` (bundle v1.0, `sys.*`, lint baseline), `docs/redirects.md` (rules table, GSC join, 410 list), `docs/ANALYTICS.md` (event allowlist as implemented), `README.md` (scripts: `content:import`, `redirects:build`, `gate`; `npx playwright install chromium`), `CLAUDE.md` (any convention that changed)

- [ ] **Step 1: Update each doc from the code (no "TBD"), commit**

```bash
git add -A && git commit -m "docs: WP1 foundation — architecture, content model, redirects, analytics as built"
```

- [ ] **Step 2: WP1 exit checklist (the lane owner runs it)**
- `npm run verify` green; `npm run gate` green against a Vercel preview URL (after the owner links `jobsadmire-web-v2`), or against `next start` until then.
- `contract/` frozen: `CONTRACT_FILE_SHA256` pinned, fixture committed, `CONTRACT.md` explains the bump procedure.
- Stack spike recorded as passed (or the fallback executed) in `docs/ARCHITECTURE.md`.
- `redirects/gsc-clicks.csv` still header-only → open item for WP0 baseline; rerun `npm run redirects:build` when it lands.

---

## Self-review (done by the plan author)

- **Spec coverage:** WP1 bullets in the programme plan → Task 1 (spike + routing + cookie), Task 2 (tokens/primitives foundation + Archivo latin-ext + reduced motion), Task 8/9 (primitives incl. SkipLink/Dialog/PausableMarquee; chrome incl. LanguageHint, StickyCtaBar, ConsentBanner in Task 12), Task 4 (package import), Task 6 (adapter LOCAL/OPS) + Task 5 (frozen contract), Task 10 (metadata/sitemap/robots/JSON-LD), Task 11 (legacy redirects from the GSC join + no-chain test + 410 policy), Task 12 (Consent Mode v2 + GTM + `/tesekkurler`), Task 13 (error/404/offline → error + not-found pages; site-health skeleton), Task 3/7 (`formatTRY`, contrast, numeric-parity, numbers-out-of-copy lints), Task 14 (Vitest/Playwright/axe/Lighthouse wiring + width sweep). The "offline page" is dropped deliberately (no service worker in v1); the WP1 gate thresholds are in Task 14.
- **Placeholders:** the only intentionally deferred values are `CONTRACT_FILE_SHA256` (filled from the first run) and `redirects/gsc-clicks.csv` (owner export), both stated.
- **Type consistency:** `Locale` from `src/i18n/routing.ts` everywhere; `Bundle`/`Settings`/`NavItem` from `contract/website-bundle.v1.ts`; `getBundle`/`makeT` from `src/content/adapter.ts`; `absoluteUrl(locale, href)` / `localeAlternates(href)` signatures used identically in Tasks 10 and 11; `track(event, params)` in Task 12 and the thank-you page.
