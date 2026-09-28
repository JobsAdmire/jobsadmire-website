# Task 8 report — Operations catalog v1.1 (`city`, `partner.track`, `contact.topic`, `careers.portfolioUrl`) + PRD §5.12 sync

**Status: DONE_WITH_CONCERNS — 6 commits** on `website/catalog-ext` (worktree `/Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-catalog`), BASE `7e81bbe`, HEAD **`7888c4a`**. Nothing pushed; no Docker run (the controller's production-compose boot check is still to do). Concerns are about wording, dates and the trailer, not about the code.

## Baseline

BASE = `7e81bbe` (= `origin/main` when the worktree was created). **`origin/main` has since moved to `15f00bb`** (3 WhatsApp commits: `3aa16a8`, `db9c853`, `15f00bb`; they touch `apps/backend/prisma/seed.ts`, PRD §5.11 (~line 4321/4438), compose files, `.env.example`, ARCHITECTURE/DEPLOYMENT/DEV_SETUP, `docs/pending/whatsapp-remaining-items.md`). None of those files overlap mine except `docs/PRD.md`, and my PRD hunks are in §5.12 (~6046–6125) and §12.2 (~7398). Not merged here.

- `cd apps/backend && NODE_OPTIONS=--max-old-space-size=4096 npx jest src/modules/website --maxWorkers=1 --forceExit` → **Test Suites: 38 passed, 38 total; Tests: 336 passed, 336 total** (10.6 s). No website spec needs Docker, DB or Redis (they mock Prisma and read files).
- Per touched spec on BASE (jest `--json`): catalog 11, DTO pipe 6, inquiry logic 6, inquiry handler 5, careers logic 5, docs guard 18, seed 3. These are the brief's numbers.
- Conformance and invariants on BASE, one file at a time with `NODE_OPTIONS=--max-old-space-size=8192` (they OOM at 4096 on a cold ts-jest cache, see Deviations): `test/permissions/website-conformance` 6 passed, `website-door-conformance` 5 passed, `website-inbox-conformance` 3 passed, `repo-invariants` 17 passed. The last includes `✓ PERMISSION_KEYS_HASH is the sha1 the catalog endpoint serves` and `✓ has no undecorated route left — every one is gated, public or self-service`.
- `cd apps/backend && npm run type-check` (= `tsc --noEmit`) → exit 0.
- ESLint baseline `npx eslint src/modules/website --ext .ts` → `✖ 5 problems (5 errors, 0 warnings)`. These are the brief's five:
  - `no-control-regex` on the catalog's `CONTROL_RE`;
  - unused `_drop` at `careers-apply.logic.spec.ts:76` and `careers-apply.handler.spec.ts:157`;
  - unused `_none` at `website-forms.service.spec.ts:290` and `:315`.
- `PERMISSION_KEYS_HASH` on BASE: `packages/permissions/src/keys.catalog.ts:203` = `'f1b77b08f0c3cb556294f329f5bac5c7f13e81a3'`.

## Commits

| SHA | Subject |
|---|---|
| `bb31948` | feat(website): catalog v1.1 — optional city on hire/workers/partner/callback/contact (W16) |
| `9bc2e00` | test(website): catalog v1.1 — pin partner.track and contact.topic enums (W16) |
| `bc290a1` | test(website): catalog v1.1 — pin the url field type on careers.portfolioUrl and the envelope pass-through (W16) |
| `c30ecf5` | feat(website): inquiry preview carries partner.track in the tag, contact.topic on the subject line, city as a line (W16) |
| `22c784a` | feat(website): careers.portfolioUrl rides as the cover letter's last paragraph (W16, W56) |
| `7888c4a` | docs(website): PRD §5.12 catalog v1.1 + the website's retry contract as built — pinned by the docs guard (W16, W46, W56, W74, W110, W153) |

Every commit ends with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. That is a deviation: the brief asked for `Claude Fable 5.1` (see Deviations). All commits are authored by `Faraz <techadmire.agency@gmail.com>`, the repo's configured identity.

## What was implemented

All four fields are OPTIONAL and additive. A website build that never sends them gets byte-identical results. This task adds no column, no migration, no permission key, no dependency, no endpoint and no controller. `WebsiteFormSubmitDto`, `CreateInquiryDto`, `PublicApplyDto`, `careers-public/**` and both handler classes are untouched.

- **`apps/backend/src/modules/website/website-form-catalog.ts`** (W16). The brief replaced the whole file; I made targeted edits instead, in the file's existing compact style, with the same content (see Deviations).
  - `WebsiteFieldType` gains `'url'`.
  - New exports: `PARTNER_TRACK_VALUES = ['sourcing', 'institute']` and `CONTACT_TOPIC_VALUES = ['hire', 'partner', 'permit', 'job', 'other']`.
  - New specs: `city` `{ max: 120 }`, `url` `{ max: 500, type: 'url' }`, `partnerTrack` and `contactTopic` (`{ max: 40, type: 'enum' }`).
  - `city` is added after `country` on hire, contact, partner and workers, and after `email` on callback.
  - `track` follows `city` on partner. `topic` sits before `subject` on contact.
  - `portfolioUrl: url` is added on careers. `careers.city` stays `{ max: 100 }` and `linkedinUrl` stays length-only.
  - New helpers `SCHEME_RE` and `isHttpUrl`, plus a `case 'url'` arm. The arm adds `https://` when the value has no scheme, then requires http(s), a host that contains a dot and ends in a label of at least 2 characters, and no username or password.
  - The length cap applies to the value as typed (after trim). `CONTROL_RE`, `clean`, `normalizeKeyList`, the iso2 branch and the `Object.hasOwn` drop rule are unchanged.
- **`apps/backend/src/modules/website/handlers/website-inquiry.logic.ts`** (W16). The preview is now built from three parts:
  - `tagFor`: the preview starts with `[website:<formKey>]`, or `[website:partner:<track>]` when a track is present.
  - `contactTopic` and `subjectLine`: on `contact`, the next line is `subject: [<topic>] <subject>`. It is `subject: [job]` when no subject was typed, `subject: <subject>` when there is no topic, and absent when there is neither.
  - A new `HEADER_FIELDS = {track, subject}` set keeps those two out of the generic lines. `topic` leaves the generic lines only when it was used as the contact topic, so `callback.topic` stays a plain `topic: …` line.
  - `city` is an ordinary `city:` line. Live, the lines follow catalog order, so `city` comes right after the tag or subject line.
  - Classification is unchanged: partner is `SOURCING_PARTNER` with either track or none, contact still has no default, and `iAm` still wins.
  - A WP3a-era payload produces byte-identical output. Contact's old catalog order already put `subject` first among the non-identity fields.
- **`apps/backend/src/modules/website/handlers/careers-apply.logic.ts`** (W16, W56). New `export const PORTFOLIO_LINE_PREFIX = 'Portfolio: '` and a `withPortfolio` helper.
  - `buildPublicApplyDto` sets `coverLetter = [typed letter, 'Portfolio: <url>'].join('\n\n')`. The URL is always the last paragraph. With no letter, the cover letter is just the portfolio line. With no URL, it is the typed letter unchanged.
  - `withScheme` protects re-runs of hand-edited rows.
  - There is no `portfolioUrl` property on the DTO, and `DROPPABLE_APPLY_FIELDS` is unchanged. `coverLetter` is `@db.Text` with no DTO cap, so nothing is truncated or dropped.
  - W56: the `portfolioRequired` gate in `CareersPublicService.apply()` (now at `careers-public.service.ts:653`) is untouched.
- **`docs/PRD.md`** §5.12 and §12.2 (W16, W46, W56, W74/W117, W110, W153). Details are under "PRD §5.12 changes" below.
- **Specs.** New tests were appended as the brief laid them out, with the fixes listed under Deviations:
  - catalog +5 (a nested `describe('catalog v1.1 (W16) — city, track, topic, portfolioUrl')`);
  - DTO pipe +1, inquiry logic +4 (a nested `describe`), inquiry handler +1, careers logic +1, docs guard +2.

**Where each field is threaded and how it is validated:**

| Field | Forms | Door validation (catalog) | Lands in |
|---|---|---|---|
| `city` | hire, workers, partner, callback, contact | text; trimmed, control characters stripped; empty = absent; ≤ 120 (`city is too long (max 120)`) | `messagePreview` line `city: <value>`, right after the tag or subject line. `careers.city` is the older ≤ 100 field and still goes to the applicant's `city` column |
| `track` | partner | enum `sourcing` \| `institute`, exact and case-sensitive; > 40 → `track is too long (max 40)`, otherwise `track must be one of sourcing, institute` | preview tag `[website:partner:<track>]`; classification stays `SOURCING_PARTNER` |
| `topic` | contact | enum `hire` \| `partner` \| `permit` \| `job` \| `other`, exact; > 40 → `topic is too long (max 40)`, otherwise `topic must be one of hire, partner, permit, job, other` | preview subject line `subject: [<topic>] <subject>`, the first line after the tag. `callback.topic` is unchanged free text ≤ 200 and becomes a plain line |
| `portfolioUrl` | careers | `url`: ≤ 500 as typed (`portfolioUrl is too long (max 500)`); `https://` added when missing; http(s) only, host with a dot, no credentials (`portfolioUrl must be a web address`) | the applicant's cover letter, last paragraph `Portfolio: <url>`. It does NOT satisfy `Opening.portfolioRequired` (W56) |

Nothing else needed threading. The forms-inbox list and detail pass `payloadJson` through, so the new fields show up there automatically. `website-notify.service.ts` reads no field values. The Inbox session's `inquiryId` ctx field and its §5.12 Inbox paragraph are on BASE and untouched.

Live composition check: I ran a temporary in-process jest file through the real catalog and logic, then deleted it without committing. Results:
- contact `{topic: 'permit', subject: 'Renewal timing', city: ' Bursa ', iAm: 'job_seeker', …}` → `[website:contact]\nsubject: [permit] Renewal timing\ncity: Bursa\nmessage: hi`, classification `JOB_SEEKER`;
- partner institute → `[website:partner:institute]\ncity: Lahore\ntrades: welders\nmessage: m`, `SOURCING_PARTNER`;
- hire → `[website:hire]\ncity: Antalya\nheadcount: 20\nmessage: ASAP`;
- callback → `[website:callback]\ncity: Bursa\npreferredTime: morning\ntopic: Need welders`;
- contact `topic: 'Permit'` → 400 `topic must be one of hire, partner, permit, job, other`;
- careers `coverLetter: 'Hello', portfolioUrl: 'behance.net/ayse'` → `"Hello\n\nPortfolio: https://behance.net/ayse"`.

## TDD evidence per cycle

- **Cycle 1 — `bb31948`.**
  - RED: catalog spec `Tests: 2 failed, 11 passed, 13 total`. The two new `catalog v1.1 (W16) › city …` tests failed: one got `city: undefined, dropped: ["city"]`, the other got `ok: true` instead of the 400.
  - GREEN: catalog + seed specs `Tests: 16 passed, 16 total` (13 + 3).
  - Type-check exit 0. ESLint on the two files shows only the pre-existing `no-control-regex` (now at line 153).
- **Cycle 2 — `9bc2e00`.**
  - The two pins pass on the first run because the Cycle 1 file is final: `Tests: 15 passed, 15 total`.
  - Mutation proof: `PARTNER_TRACK_VALUES = ['sourcing']` → `Tests: 1 failed, 14 passed, 15 total` (`partner.track is an enum …`).
  - I added a second mutation: `topic: { max: 40 }` in place of the enum → `1 failed, 14 passed` (`contact.topic is an enum …`).
  - Both were reverted with `git checkout -- website-form-catalog.ts` → 15 passed. Type-check exit 0.
- **Cycle 3 — `bc290a1`.**
  - Both new tests pass on the first run: catalog 16 + DTO pipe 7 = `Tests: 23 passed, 23 total`.
  - Mutation proof: `portfolioUrl: { max: 500 }` → `Tests: 1 failed, 15 passed, 16 total`, because the junk loop accepted `'see attached'`. Reverted → 23 passed.
  - Type-check exit 0. ESLint on the three files shows only the pre-existing finding.
- **Cycle 4 — `c30ecf5`.**
  - RED, after fixing the brief's handler-spec cast (see Deviations): `Tests: 3 failed, 13 passed, 16 total`.
    - `partner.track rides in the tag` got `[website:partner]\ntrades: welders\ntrack: institute`.
    - `contact.topic prefixes …` got `[website:contact]\ncity: Bursa\ntopic: permit\nsubject: Renewal timing\nmessage: hi`.
    - The handler pin got `[website:partner]\ncity: Lahore\ntrack: institute`.
    - The `city` and `callback` tests already passed; they are pins.
  - GREEN: `npx jest src/modules/website/handlers` → `Test Suites: 6 passed; Tests: 41 passed, 41 total` (inquiry logic 10, inquiry handler 6).
  - Type-check exit 0. ESLint on the three files is clean.
- **Cycle 5 — `22c784a`.**
  - RED: `Test suite failed to run … TS2305: Module '"./careers-apply.logic"' has no exported member 'PORTFOLIO_LINE_PREFIX'` (`Tests: 0 total`).
  - GREEN: `npx jest src/modules/website/handlers/careers-apply` → `Tests: 15 passed, 15 total` (logic 6, handler 9 unchanged).
  - Type-check exit 0. ESLint shows only the pre-existing `_drop`, now at line 77.
- **Cycle 6 — `7888c4a`.**
  - RED: docs guard `Tests: 2 failed, 18 passed, 20 total`. The first failure was `Expected substring: "**Catalog v1.1 (2026-09-28, WP2a Task 8 / T0f, website ruling W16) — the OPTIONAL fields added for the designed pages.**"`; the second was the W74/W117 retry sentence.
  - GREEN: docs guard `20 passed, 20 total`.
  - Whole website suite `Test Suites: 38 passed; Tests: 350 passed, 350 total` (336 + 14 new).
  - `src/modules/notifications/inbox/inbox-docs-guard.spec.ts`, which parses the PRD's event tables, passes 25/25. My new §5.12 table has a different header, so it is not mistaken for an event table.
  - Type-check exit 0.
- **Cycle 7 (verification, no commit):**
  - "Nothing else moved": `git diff --stat 7e81bbe -- packages/ apps/backend/prisma/ CLAUDE.md docs/DEPLOYMENT.md docs/ARCHITECTURE.md docs/GOTCHAS.md apps/backend/src/modules/careers-public/ apps/backend/src/modules/website/dto/website-form-submit.dto.ts apps/backend/src/modules/website/handlers/careers-apply.handler.ts apps/backend/src/modules/website/handlers/website-inquiry.handler.ts apps/frontend/ apps/backend/src/modules/website/website-forms.service.ts apps/backend/src/modules/website/website-notify.service.ts` → **empty**.
  - `git diff --stat 7e81bbe` → exactly the brief's 10 files (371+, 21−). No migration, controller, `*.module.ts` or `package*.json` in the diff.
  - `git log --oneline 7e81bbe..HEAD` → the 6 commits above.
  - **`PERMISSION_KEYS_HASH`**: `grep -n "PERMISSION_KEYS_HASH = " packages/permissions/src/keys.catalog.ts` → `203:export const PERMISSION_KEYS_HASH = 'f1b77b08f0c3cb556294f329f5bac5c7f13e81a3';`. That is byte-identical to BASE, and `packages/**` shows no diff.
  - Final type-check at HEAD: `npm run type-check` exit 0.
  - Final website suite at HEAD: `Test Suites: 38 passed, 38 total; Tests: 350 passed, 350 total`.
  - **Conformance and invariants at HEAD** (one file per process, 8192 cap, ~2.8 GB peak RSS each with a warm cache):
    - `repo-invariants` `17 passed`, including `✓ PERMISSION_KEYS_HASH is the sha1 the catalog endpoint serves` and **`✓ has no undecorated route left — every one is gated, public or self-service`**, i.e. 0 undecorated;
    - `website-conformance` `6 passed` (asserts `report.undecorated` = `[]` with the real scanner);
    - `website-door-conformance` `5 passed`;
    - `website-inbox-conformance` `3 passed`.
  - The other PRD-reading specs: `test/contacts/contacts-docs-counts.spec.ts` + `inbox-docs-guard.spec.ts` → `Tests: 30 passed, 30 total`.
  - ESLint `npx eslint src/modules/website --ext .ts` → `✖ 5 problems (5 errors, 0 warnings)`. These are the same five as the baseline; only two line numbers moved (`careers-apply.logic.spec.ts:77`, `website-form-catalog.ts:153`). No new finding.

## PRD §5.12 changes

Every edit is anchored on a sentence and all of them are inside §5.12, except the one §12.2 entry. The Inbox paragraph (`**Inbox items (Inbox WP1, 2026-09-25).**` + its event table) is untouched.

**W153 — both "WP2 must retry on any non-2xx" sentences were rewritten to the W74/W117 rule:**

1. Idempotency (P8) paragraph.
   - BEFORE: `(**contract: WP2 must retry on any non-2xx** — every deploy is a 30–60 s 502 window on `/api/website/*`, and a retried submission must land on the same row, not a second one)`
   - AFTER: `(**contract, website rulings W74 + W117 (amending W3): the website retries at most ONCE, and only after a connection-level failure — its `fetch` rejected without any response (DNS, refused, reset); a timeout or any answer, 5xx included, is final and never retried; both attempts share ONE 9 s deadline, then the visitor sees the site's fallback panel** — a Turnstile token is single-use and the captcha runs before the dedupe, so re-sending a request that already reached the door earns a 403, never `replayed`; every deploy is a 30–60 s 502 window on `/api/website/*`, which a visitor therefore meets as the fallback panel, and a repeat that does get past the captcha — degraded, or a tokenless test-class call — is answered from the same row, never filed twice)`
2. Decisions & gotchas.
   - BEFORE: `- **Every deploy is a 30–60 s 502 on `/api/website/*`.** WP2 must retry on any non-2xx (contract, see the wire contract above); `WEBSITE_FORMS_UNAVAILABLE` must not fire on a deploy blip (the drought window is hours, the captcha-degraded alarm is once per window).`
   - AFTER: `- **Every deploy is a 30–60 s 502 on `/api/website/*`.** The website does NOT retry a 5xx or a timeout (website rulings W74/W117 — a retry would re-send a spent single-use Turnstile token and earn a 403): a visitor who submits inside that window sees the site's fallback panel at once, and the site's one retry is reserved for a connection-level failure, inside one 9 s deadline (the sentence under Idempotency above is the contract; W153). `WEBSITE_FORMS_UNAVAILABLE` must not fire on a deploy blip (the drought window is hours, the captcha-degraded alarm is once per window).`

`grep -c 'retry on any non-2xx' docs/PRD.md` → 0. The docs guard pins this with `not.toContain('retry on any non-2xx')`.

**W46 — the heartbeat note** (the "Test class = the door" paragraph).
- BEFORE: `the monitor must vary one field per post (e.g. a timestamp in `sourcePath`) because identical payloads replay within the hour`
- AFTER: `the monitor must vary one CATALOG field's value per post (e.g. a timestamp inside `fields.message`) — `sourcePath` is NOT part of `requestHash` (`requestHashFor` in `website-forms.logic.ts` hashes `formKey`, `isTest`, whether the honeypot was filled, `locale` and the key-sorted NORMALISED `fields`, so neither `sourcePath` nor a dropped unknown key changes it; corrected 2026-09-28, website ruling W46) — because identical payloads replay within the hour`

**W46 — I12 bullet added** after the test-token bullet: `- **Newsletter confirm/unsubscribe tokens are forwarded only on the visitor's click (I12, WP2a).** The website's `/abone-onay` / `/abonelikten-cik` pages (`/en/newsletter/confirm`, `/en/newsletter/unsubscribe`) never call `GET /api/website/v1/newsletter/confirm` or `…/unsubscribe` on page load, prefetch or render — a mail-link scanner or a browser prefetch would otherwise confirm (or unsubscribe) on the subscriber's behalf, recording a double opt-in the human never clicked; the token is forwarded by a route handler when the visitor clicks, and the RFC 8058 one-click POST is forwarded as a POST. Recorded here so a future Ops change never assumes the GET runs at link-open time (website `docs/INTEGRATIONS.md` I12 carries the same rule).` The rationale deliberately differs from the brief (see Deviations).

**W110 — throttle follow-up sentence**, appended to the "CV upload for the careers form reuses the EXISTING public `POST /api/careers/upload-cv` …" paragraph: `**Follow-up before `RATE_LIMITING_ENABLED` is ever switched on (website ruling W110; no code now).** `RateLimitGuard` keys every bucket on the first `X-Forwarded-For` hop, and the website calls Operations server-side from Vercel, so `upload-cv`'s per-IP `@Throttle` (10/min) — like the door's own fraud-evidence (10/min) and newsletter (30/min) limits — would cap the WHOLE site at one bucket per Vercel egress IP. Before the flag flips, the tracker must key on `X-Website-Visitor-Ip` (validated with `isIP`, as `visitorIpFromHeaders` already does) whenever the caller holds the website write token; `upload-cv` reads no token today and the website sends it neither the Bearer nor the visitor header, so both sides change together.`

**Catalog v1.1 (W16, W56):**
- Handler table, `INQUIRY` row: `; classification only where the form implies one |` becomes `…; classification only where the form implies one. **v1.1 (2026-09-28):** `city` is a `city:` preview line; `partner.track` rides in the tag (`[website:partner:institute]`, classification still `SOURCING_PARTNER`); `contact.topic` prefixes the subject line (`subject: [permit] …`, the first line after the tag) |`.
- Handler table, `callback` row: now `an Inquiry, classification unset; `city` (v1.1) is a preview line, `topic` stays the older free-text field (a plain line, no subject prefix)`.
- Handler table, `careers` row: `…the applicant id is the only pointer stored` gains `; **v1.1 (2026-09-28):** `portfolioUrl` (the new `url` type …) is folded into `coverLetter` as a last `Portfolio: <url>` paragraph — no DTO field, no column, no migration; the `portfolioRequired` gate (≥ 1 uploaded `careers-portfolio/` document, §5.4.3 / §6.5) is unchanged (website ruling W56), so a portfolio-required opening still answers `FAILED` + `error` through the door and the website keeps its "apply by e-mail" branch for those openings`.
- New paragraph after the handler table: `**Catalog v1.1 (2026-09-28, WP2a Task 8 / T0f, website ruling W16) — the OPTIONAL fields added for the designed pages.**` It covers additivity, the `url` type rules and every rejection reason, and says stray fields are dropped and that the website's I4 mirrors the table.
- New four-row table (`| formKey | Field | Rule | Where it lands |`): `city` / `track` / `topic` / `portfolioUrl`.
- New last gotcha: `- **Catalog v1.1 fields are additive and column-less (W16, 2026-09-28).**`. It explains why `linkedinUrl` is not retyped and that `portfolioUrl` does not satisfy `portfolioRequired` (W56).
- §12.2: `- **2026-09-28 — Website catalog v1.1 (WP2a Task 8 / T0f, website ruling W16).** …`, appended after the last entry (`2026-09-25 — Docs consolidation`) so the list stays chronological.

`docs/ARCHITECTURE.md` needed no change: no module, file or wiring moved. `docs/GOTCHAS.md` needed none either: there is no new cross-cutting hard-won rule. `CLAUDE.md` and `docs/DEPLOYMENT.md` needed none: no count, convention, env, cron or compose change.

## Files changed

`git diff --numstat 7e81bbe` (10 files, +371 / −21):
- `apps/backend/src/modules/website/website-form-catalog.ts` +62 / −9
- `apps/backend/src/modules/website/website-form-catalog.spec.ts` +109
- `apps/backend/src/modules/website/dto/website-form-submit.dto.spec.ts` +9
- `apps/backend/src/modules/website/handlers/website-inquiry.logic.ts` +42 / −4
- `apps/backend/src/modules/website/handlers/website-inquiry.logic.spec.ts` +38
- `apps/backend/src/modules/website/handlers/website-inquiry.handler.spec.ts` +18
- `apps/backend/src/modules/website/handlers/careers-apply.logic.ts` +23 / −1
- `apps/backend/src/modules/website/handlers/careers-apply.logic.spec.ts` +24
- `apps/backend/src/modules/website/website-docs-guard.spec.ts` +27
- `docs/PRD.md` +19 / −7

## Deviations

1. **Stale anchors.** The brief assumed `7ea2a93`; the real BASE is `7e81bbe`. Code was located by identifier, and these anchors had moved:
   - `PERMISSION_KEYS_HASH` is at `keys.catalog.ts:203` (brief: 188), value `f1b77b08…` (brief: `ba5427d7…`);
   - the `portfolioRequired` gate is at `careers-public.service.ts:653` (brief: 618–619);
   - `repo-invariants.spec.ts`'s hash test is at line 611 (brief: 549–555);
   - the docs guard is 248 lines on BASE (brief: 242);
   - `careers-apply.handler.ts` hands `fields` to the logic at line 79 (brief: 70–79);
   - PRD line numbers: §5.12 starts at 6028 and §12.3 at 7388. All PRD edits were anchored on sentences, each of which matched exactly once.
2. **The retry sentence follows W74/W117 (+W153), not the brief's W3 text.** The brief's "…only after a network error, a per-attempt timeout or a 5xx … inside an 8 s total budget…" is superseded. The PRD now states the rule the website's `src/forms/post.ts` actually implements: one retry, connection-level failure only, a timeout or 5xx is final, one shared 9 s deadline. The docs guard's second test pins that text and `not.toContain('retry on any non-2xx')` instead of the brief's strings.
3. **Dates.** The brief wrote `2026-09-20` into the pinned headings. I used the ship date, 2026-09-28: `**Catalog v1.1 (2026-09-28, WP2a Task 8 / T0f, website ruling W16) …**`, the gotcha `(W16, 2026-09-28)` and the §12.2 entry `2026-09-28 — …`. §12.2 is a "shipped" log, and a 2026-09-20 entry would be false. The ruling's own date is carried by citing W16.
4. **§12.2 position.** The entry goes after the last entry (`2026-09-25 — Docs consolidation`), not directly after the WP3a entry. The brief's anchor was the last entry at `7ea2a93`; several entries have been added since.
5. **Catalog edited in place, not replaced whole.** The brief's replacement file was prettier-reformatted throughout, so a whole-file replacement would have rewritten every line. I applied the same content as targeted edits in the file's existing compact style, which keeps the production diff to the v1.1 lines. The spec additions also follow each spec file's existing compact style, with the same assertions.
6. **Spec fix.** The brief's handler pin `const [dto] = inquiries.create.mock.calls[0] as [Record<string, unknown>];` does not compile (`TS2352`: the mock's call tuple has 2 elements). I changed it to `as [Record<string, unknown>, unknown]`, and the RED was taken after that fix.
7. **Extra junk cases.** Two cases beyond the brief were added to the `portfolioUrl` junk loop, `javascript:alert(1)` and `javascript://behance.net/%0aalert(1)`, because staff click this link. Both are rejected by the brief's rule as written; no code change was needed.
8. **Comment wording.** The brief's comment said "the Sales list shows the first line of the preview". It does not: `/admin/sales/inquiries` has no preview column, and the inquiry detail page renders `messagePreview` with `whitespace-pre-line`. The comments now say the tag is the preview's first line on the inquiry page.
9. **I12 rationale.** The brief's wording was "a mail-link scanner would otherwise consume the one-shot confirm token". Ops keeps the confirm hash and answers a second click `ALREADY_CONFIRMED` (`website-newsletter.service.ts:196`), so the real risk is a scanner confirming or unsubscribing on the human's behalf. The PRD says that. The pinned bullet title is unchanged.
10. **Heap.** The conformance and invariant specs (`test/permissions/*`) OOM at `--max-old-space-size=4096` on a cold ts-jest cache: three files in one process died at ~4 GB, and `repo-invariants` alone also died. I ran them at `8192`, one file per process, sequentially (cold ~5.1 GB RSS, warm ~2.8 GB), as Operations `CLAUDE.md` prescribes for specs reaching `packages/*`. I ran the relevant `test/permissions` specs, not the whole directory the brief named, to honour "narrow paths". Nothing of mine ran in parallel, and the website specs all ran at 4096.
11. **No Docker.** Per the controller, the brief's Cycle 7 Step 3 (production-compose boot), Step 4 (push) and Step 5 (ledger) are the controller's. The `curl …/ping` state check was not run either.
12. **Commit trailer.** I used `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>` (this session's model attribution rule) instead of the requested `Claude Fable 5.1`. If the programme wants Fable 5.1, it can be reworded before the push (`git rebase -x` / `--exec git commit --amend`). No commit exists at BASE, so nothing shared would be rewritten.
13. **Brief Step 0 was not run.** The worktree, `npm ci` and `prisma generate` already existed. The shared `jobsadmire-operations-website` worktree was not touched.

## Contract for the website

For I4. Unchanged: the route `POST ${OPS_API_URL}/api/website/v1/forms/:formKey`, the envelope `{ locale, consentVersion, captchaToken?, honeypot?, sourcePath?, fields }`, the 200 shape `{ data: { id, formKey, status, isTest, replayed, captchaDegraded, error } }` and every other status.

- **Wire names.** All four go INSIDE `fields` as strings. The same names at the top level are a 400 from the envelope pipe (`forbidNonWhitelisted`); the DTO spec pins this.
- **`fields.city?: string`** on `hire`, `workers`, `partner`, `callback`, `contact`:
  - trimmed, C0 control characters stripped; empty or blank = absent;
  - max **120** chars → `city is too long (max 120)`;
  - `careers.city` is unchanged (max 100, `city is too long (max 100)`);
  - dropped silently on visit, calculator, newsletter and fraud.
- **`fields.track?: 'sourcing' | 'institute'`** on `partner` only:
  - exact, lower-case match;
  - over 40 chars → `track is too long (max 40)`; any other value → `track must be one of sourcing, institute`;
  - the Partner page's HR-agency track still posts `hire` with `iAm: 'hr_agency'`;
  - classification is `SOURCING_PARTNER` for both tracks.
- **`fields.topic?: 'hire' | 'partner' | 'permit' | 'job' | 'other'`** on `contact` only:
  - exact, lower-case match;
  - over 40 → `topic is too long (max 40)`; any other value → `topic must be one of hire, partner, permit, job, other`;
  - `callback.topic` is unchanged: free text, max 200 (`topic is too long (max 200)`).
- **`fields.portfolioUrl?: string`** on `careers` only (fix round 1, website ruling W161 — supersedes the rule as first reported below):
  - a missing scheme gets `https://` BEFORE the length cap is checked, so max **500** chars applies to the NORMALISED (schemed) value, never the value as typed → `portfolioUrl is too long (max 500)`;
  - rejected outright, each as `portfolioUrl must be a web address`: a control character, newline, tab or plain space anywhere in the value; a value that is only digits or phone-like (`+90 …`, digits with spaces/dashes — WHATWG would otherwise read a bare number as an IPv4 host, e.g. `123` → `0.0.0.123`); `user:pass@` credentials; `mailto:`, `ftp:`, `javascript:` and other non-http(s) schemes;
  - otherwise it must be http(s), with a host that either contains a dot and ends in a 2+ character label, OR is an IPv4/IPv6 literal — internal/private IPs (`10.0.0.10`, `169.254.169.254`, `[::1]`, …) stay accepted BY DESIGN, since staff only ever see the value as plain text, never a clickable anchor — else `portfolioUrl must be a web address` (this still rejects `localhost`, chat handles and free text);
  - stored as typed (plus scheme) and shown to staff as the last cover-letter paragraph `Portfolio: <url>`;
  - `linkedinUrl` is unchanged: length-only at the door, and the handler drops a junk value;
  - **W56:** an opening with `portfolioRequired` still answers HTTP 200 `{ status: 'FAILED', error: 'This position requires at least one portfolio document' }`. Keep the "apply by e-mail" branch for those openings; send `portfolioUrl` on the others.
- **400 body.** `{ message: 'Invalid form fields', errors: string[] }` lists every reason at once. The whitelist runs **before** the honeypot and the captcha, so a field 400 does not spend the Turnstile token.
- **Stray fields.** A v1.1 name on a form that does not list it is dropped, never an error.
- **Dedupe.** The accepted values are part of the normalised `fields` and therefore of `requestHash`. `sourcePath` is not.
- **Retry.** Ops PRD §5.12 now states the website's W74/W117 rule verbatim in spirit: one retry after a connection-level failure only, a 5xx or timeout is final, one 9 s deadline, then the fallback panel.

Website doc mismatches seen, all read-only, for the controller's I4/I12 update:
- (a) I4's "Field catalog per key … Task 8 / T0f adds …" can become the table above.
- (b) I12's rationale "mail-link scanners would otherwise consume the one-shot confirm token" is inaccurate against Ops, which keeps the hash and answers `ALREADY_CONFIRMED`. The real risk is a scanner confirming or unsubscribing for the human; see Deviation 9.
- (c) The site's `sys.form.hints.portfolioUrl` says "A link starting with https://." Ops also accepts a scheme-less link and adds `https://`, so the hint is stricter than the door. That is harmless.

## Concerns

1. **`origin/main` moved to `15f00bb`** after BASE (3 WhatsApp commits). The branch must be rebased or merged before the push. I expect it to be clean, since the only shared file is `docs/PRD.md` (their §5.11, my §5.12/§12.2). If it is not clean, resolve hunk by hunk and never use `--ours/--theirs`.
2. The **dates** (2026-09-28) and the **trailer** (Opus 5.5) differ from the brief (Deviations 3, 12). Both are easy to change before the push if the controller prefers otherwise; the docs-guard strings would change with the dates.
3. **`url` rule leniency.** A numeric last label of 2+ digits passes, so `http://10.0.0.10/x` is accepted. This matches the brief's rule. Ops never fetches the URL; staff only click it. It can be tightened later if wanted.
4. The §5.12 gotcha **"Submission row first … Any exception after `inquiries.create` turns the website's retry into a second inquiry"** is still accurate: the one connection-level retry and inbox re-runs still exist. I left it as is.
5. **W110 is a note only.** When it is picked up, both repos change: the Ops tracker, and `src/forms/uploads.ts` sending Bearer + `X-Website-Visitor-Ip` to `upload-cv`.

## Push checklist for the controller

1. Rebase `website/catalog-ext` onto the fetched `origin/main` (currently `15f00bb`), or merge it (merge-not-rebase is fine too). No commit here exists on `main`.
2. After the rebase, re-run one job at a time. For the jest runs use `cd apps/backend && NODE_OPTIONS=--max-old-space-size=4096 npx jest <paths> --maxWorkers=1 --forceExit`; use 8192, one file per process, for `test/permissions/*` on a cold cache.
   - `npm run type-check` (in `apps/backend`);
   - `npx jest src/modules/website` → 38 suites / 350 tests;
   - `src/modules/notifications/inbox/inbox-docs-guard.spec.ts` and **`src/modules/notifications/inbox/inbox-registry-coverage.spec.ts`** (the Inbox guards; they read the PRD and the registry);
   - `test/contacts/contacts-docs-counts.spec.ts`;
   - `test/permissions/repo-invariants.spec.ts` (hash + undecorated census), `test/permissions/website-conformance.spec.ts`, `website-door-conformance.spec.ts`, `website-inbox-conformance.spec.ts`;
   - re-check `grep -n "PERMISSION_KEYS_HASH = " packages/permissions/src/keys.catalog.ts`. It is `f1b77b08f0c3cb556294f329f5bac5c7f13e81a3` unless `main` itself changed keys.
3. **Production-compose boot:** `docs/DEPLOYMENT.md` § "Booting the production compose file locally (plan D24 — before every website-programme push)" (line 243 on BASE).
   - Its first `cd` names `jobsadmire-operations-website`. Run it from **`/Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-catalog`**, the checkout being pushed.
   - Stop the dev stack first, and confirm the `→` lines: conformance 0 undecorated, health 200, the 404 → 401 flip with `restarts=0`, and `website-form-seed` agreeing with the catalog. It must be the only heavy job running.
4. Check the door state: `curl -s -o /dev/null -w '%{http_code}\n' https://operations.jobsadmire.com/api/website/v1/ping`. 404 means dark; **401 means ON** (not 200 — `WebsiteModuleEnabledGuard` runs before `WebsiteApiGuard`, so a tokenless call gets 401 once the flag is on; corrected in fix round 1, review item 2 — `docs/DEPLOYMENT.md`'s flip recipe already stated 401 correctly) and the handoff says it is on now. The change is additive either way. Announce the ~2-minute deploy (a 30–60 s 502 window on `/api/website/*`) to the peer Operations sessions. A deploy kills in-flight Bull batch jobs.
5. Push, bundling the gate-record commits as planned. Verify by artifact, never by prod `git rev-parse` (`docs/DEPLOYMENT.md` § "Verifying a deploy landed", line 340 on BASE): the `deploy.log` "Deploy finished for <sha>" line, `/api/health` 200, and the same `ping` code as before.
   - Rollback: `git revert <sha>` on `main`. There is no migration half.
6. Update the website repo's `docs/INTEGRATIONS.md` I4 (the Contract section above) and I12 (mismatch b).

## Fix round 1

Controller ruling W161 (2026-09-28, `docs/superpowers/plans/2026-09-20-wp2-rulings.md`) required M1–M3 fixed before the push. Done alone in worktree `jobsadmire-operations-catalog`, branch `website/catalog-ext`, HEAD `7888c4a` → `aa8c439` (2 new commits). Every command run from that worktree; `main` untouched, nothing pushed, nothing stashed, the six prior commits unchanged.

### M1 — length after normalisation (`apps/backend/src/modules/website/website-form-catalog.ts:277-291`)

RED (`website-form-catalog.spec.ts`, new test "M1: the 500 cap re-applies to the NORMALISED value..."): a 493-char scheme-less `portfolioUrl` stored at 501 chars with `ok: true` instead of a 400.

Fix: the `case 'url'` branch now re-checks `s.length > f.max` AFTER `https://` is added (in addition to the pre-existing as-typed check earlier in the loop), pushing `portfolioUrl is too long (max 500)` when the NORMALISED value would overflow.

GREEN: 492-char scheme-less → accepted, stored at exactly 500 chars; 493-char scheme-less → rejected; an already-schemed value at exactly 500 → accepted, at 501 → rejected; an idempotency check (every value the door accepts re-normalises unchanged, including at the 500 boundary) also passes — closing the `rerun()` invariant the review named.

### M2 — shape (`website-form-catalog.ts:151-186` and `:277-296`)

RED (`website-form-catalog.spec.ts`, new test "M2: rejects control characters/newlines/whitespace..."): an embedded-newline `portfolioUrl` (`behance.net/ayse\nPortfolio: https://evil.example`) was accepted and stored verbatim.

Fix:
- Two pre-parse checks added to `case 'url'`, run before the scheme is added: `/\s/.test(s)` rejects a control character, newline, tab or plain space surviving `clean()` (which deliberately keeps `\t`/`\n` for ordinary free-text fields) anywhere in the value; `DIGITS_OR_PHONE_RE.test(s.replace(SCHEME_RE, ''))` (`/^[+\s()\d-]+$/`) rejects a value that is only digits, `+`, spaces, dashes or parens — WHATWG reads a bare number as an IPv4 host (`123` → `0.0.0.123`). The regex deliberately excludes `.`, so a dotted IPv4 literal typed as such never matches it.
- `isHttpUrl` gained one carve-out (`IPV6_LITERAL_RE`): a bracketed IPv6 literal is accepted even without a dot. IPv4 needed no new code in `isHttpUrl` itself — `10.0.0.10` already has a dot and passes the pre-existing host regex; the new digits/phone pre-check is what stops a BARE number reaching that regex disguised as an IP.

GREEN: rejects an embedded newline, tab, space, `123`, `05321234567`, `+90 532 123 4567`, `0532-123-4567` and `https:///nohost` (no host), each with `portfolioUrl must be a web address`; accepts `https://example.com/x`, `example.com/path`, `http://10.0.0.10/x` and (extra coverage for the ruling's "IPv4/IPv6 literal" wording) `http://[2001:db8::1]/x`. Traced by hand against every pre-existing junk/accepted case in the spec (credentials, `localhost`, both `javascript:` forms, `mailto:`, `ftp:`, IDN, mixed-case scheme, the length-boundary junk) — none changed outcome, confirmed by the full run below.

### M3 — PRD gotcha (`docs/PRD.md` §5.12, the "Submission row first" bullet)

RED (`website-docs-guard.spec.ts`, new test "PRD §5.12's 'Submission row first' gotcha no longer blames the website's retry..."): failed against the unchanged PRD text (`turns the website's retry into a second inquiry`).

Fix: reworded the bullet — the website's own retry can never reach a row that already exists (website rulings W74/W117: at most one retry, only on a connection-level failure before the door ever answered; a delivered request, success or failure, is final), so the live risk is a visitor's own resubmission after the hour bucket, and `@@unique([formKey, requestHash, hourBucket])` still catches a same-hour repeat. This resolves Concern 4 above (the implementer's "I left it as is").

While there, per the fix-round brief: checked whether `docs/PRD.md` §5.12 ever claimed a tokenless ping answers 200 when the flag is on (review item 2) — it does not; only this report's own Push-checklist step 4 did, corrected above (`docs/DEPLOYMENT.md`'s flip recipe already stated 401 correctly, so that doc needed no change). Also updated for consistency, within the same §5.12 and the same M1/M2 fix: the catalog v1.1 descriptive paragraph and the `careers` handler-row's `portfolioUrl` mention both said the cap applied "as typed"; both now describe the normalised-value cap and the M2 rejections, matching the field table row (also updated, and re-pinned in `website-docs-guard.spec.ts`).

Concern 3 above ("A numeric last label of 2+ digits passes, so `http://10.0.0.10/x` is accepted") is intentionally **unchanged** behaviour under W161 — internal/private IPs stay accepted by design (staff only ever see the value as plain text) — so PRD.md and the Contract section now state it as designed, not as leniency.

### Jest / type-check summary

- `cd apps/backend && npx tsc --noEmit` → exit 0 (clean), run once before committing and again after both commits.
- `cd apps/backend && NODE_OPTIONS=--max-old-space-size=4096 npx jest src/modules/website --maxWorkers=1 --forceExit` → **38 suites / 353 tests** passed (the review's 350-test baseline + the 3 new tests for M1/M2/M3), run once before committing and again after.
- Narrow TDD loop (`website-form-catalog.spec.ts` + `website-docs-guard.spec.ts`): RED showed exactly 3 failing (the 3 new tests) / 36 passing; after the code + PRD fix, GREEN showed 38/39 (one self-inflicted spec bug — `toEqual` instead of `toMatchObject` on a partial idempotency-check object — fixed immediately; not a production-code issue); final run 39/39.

### Commits (both on `website/catalog-ext`, neither pushed)

- `8e838d7` — `fix(website): catalog v1.1 url field — normalise-then-cap length, reject phone/shape junk (W161, Task 8 review M1/M2)`
- `aa8c439` — `docs(website): PRD §5.12 — url field wording matches W161; drop the retry-blame gotcha (W161/M3, W74/W117)`

HEAD is now `aa8c439`.

### Attribution deviation

Both commits end `Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>` — this session's actual model, per the attribution rule in force here — rather than the `Claude Fable 5.1` name given in the fix-round brief. Same kind of deviation as Deviation 12 above (that round used `Claude Opus 5.5` against a brief asking for `Claude Opus 5 (1M context)`, and the review accepted it as "cosmetic" and matching "this session's attribution rule"). If the programme wants a specific trailer name, the only safe window is before the push (`git rebase --exec`), never after.

### The final `url` rules (for the website's INTEGRATIONS I4 — the Contract section above is updated to match)

`portfolioUrl` (`careers` only): http(s), ≤ 500 chars **including** the `https://` the door adds when the value has no scheme; rejects a control character/newline/any whitespace anywhere in the value, a digits-only or phone-like value, `user:pass@` credentials, and any non-http(s) scheme.
The host must contain a dot (real domain) **or** be an IPv4/IPv6 literal — internal/private IPs stay accepted by design (staff only ever see the value as plain text, never a clickable anchor).
