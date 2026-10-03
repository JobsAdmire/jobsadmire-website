# Task 8 review — Operations catalog v1.1 (`website/catalog-ext` @ `7888c4a`, BASE `7e81bbe`)

Task reviewer, read-only, 2026-09-28. Worktree `/Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-catalog`: HEAD `7888c4a`, tree clean before and after, nothing committed, stashed, pushed or run in Docker. The provided `review-ops-7e81bbe..7888c4a.diff` is byte-identical to `git diff 7e81bbe..7888c4a`. Scratch work (probes, mutation driver, logs, results) is under `…/scratchpad/review-task8/`.

**Spec compliance:** ✅ — The four fields are optional, additive and exactly as briefed: wire names, caps, enums, the `url` type and the 400 reasons. They are threaded into the preview tag, the subject line, a `city:` line and the cover letter's last paragraph. The W56 gate, schema, keys, dependencies and endpoints are untouched. PRD §5.12/§12.2 carry every required sentence, pinned by the docs guard; the retry text follows the binding W74/W117/W153 rulings rather than the brief's superseded W3 text.
**Code quality:** ✅ — 0 Critical, 0 Important, 3 Minor. None blocks this push: the website sends none of these fields yet. M1 and M2 are cheap to fold in now (⚠️1).
**Merge readiness:** clean. `origin/main` is now `8a0562b`: 4 commits since BASE, not 3. `git merge-tree --write-tree origin/main HEAD` exits 0 (tree `ed94d8e`). The only shared file is `docs/PRD.md`, in disjoint sections: main's §5.11 hunks at lines 4294–5477, the branch's §5.12/§12.2 hunks at 6046–7398. After the rebase, run in this order:
- `npx prisma generate` — main added `WaFlowWaitKind.AI`, see ⚠️3;
- `npm run type-check`;
- `src/modules/website`;
- `inbox-docs-guard`, `inbox-registry-coverage` and `contacts-docs-counts`;
- `repo-invariants` and the three `website-*-conformance` specs.

## Spec compliance evidence

### What I ran
One heavy job at a time. Every process ended; `ps` was clean at the end.

| Run | Result | Peak RSS |
|---|---|---|
| `npm run type-check` (apps/backend) | exit 0 | 2.4 GB |
| `jest src/modules/website` (4096, `--maxWorkers=1`) | **38 suites / 350 tests** passed (= the report) | 3.2 GB |
| `test/permissions/repo-invariants.spec.ts` (8192) | 17/17, incl. `PERMISSION_KEYS_HASH is the sha1 the catalog endpoint serves` and `has no undecorated route left` | 2.8 GB |
| `website-conformance`, `website-door-conformance`, `website-inbox-conformance` (8192, one per process) | 6/6, 5/5, 3/3 | 2.8 GB each |
| `inbox-docs-guard` + `inbox-registry-coverage` + `contacts-docs-counts` | 3 suites / 243 tests | 2.8 GB |
| `npx eslint src/modules/website --ext .ts` | `✖ 5 problems (5 errors)` — the same five as BASE: `CONTROL_RE` `no-control-regex`, `_drop` ×2, `_none` ×2. The BASE versions of the changed files, linted via `git show 7e81bbe:… \| eslint --stdin`, show no new finding. | — |
| Scratch probe: the real HEAD code plus a `git archive` of BASE (transpile-only jest) | results below (47 URL inputs, idempotency, v1.0 identity, field edge cases) | 0.3 GB |
| Mutation run: the repo's own catalog / inquiry-logic / careers-logic specs against 20 mutants of a scratch copy | **19/19 behavioural mutants killed**; 1 survivor, which is the M1 fix candidate | 0.3 GB each |
| Merged-tree preview: `ed94d8e` = `origin/main` 8a0562b + HEAD, extracted to scratch, transpile-only | the website docs guard, inbox docs guard, inbox registry coverage and contacts docs counts pass (4 suites / 263 tests); `repo-invariants` 17/17 | 0.4 GB |

Killed mutants:
- **Catalog:** track enum shrunk; `contact.topic` untyped; `portfolioUrl` untyped; credentials allowed; any hostname; any protocol; no `https://` added; `city` cap 200; callback loses `city`; case-insensitive enum.
- **Inquiry logic:** tag ignores track; `subject` not a header field; `topic` always skipped; topic missing from the subject line; topic consumed on any form.
- **Careers logic:** portfolio line first; no scheme on re-run; single newline; portfolio dropped.

### A. Checklist

| Requirement | ✅/❌ | Evidence |
|---|---|---|
| The four fields are OPTIONAL and additive; an older build that sends none of them is unaffected | ✅ | No new entry is `required` (`website-form-catalog.ts:72`, `:121`, the five `city` insertions, `track`, `topic`). **Probe:** 12 v1.0-shaped bodies covering all ten forms give JSON-identical results on BASE and HEAD for the normalised `fields`, `requestHash` (test class and real), the inquiry DTO and `PublicApplyDto`. **Specs:** an empty `city` is absent, `track` is optional, and an absent `portfolioUrl` is fine. The DTO spec shows the names pass through inside `fields`, while a top-level `city` is still a 400. |
| `city` ≤ 120 on hire/workers/partner/callback/contact; `careers.city` stays ≤ 100 | ✅ | 120 chars passes; 121 fails with `city is too long (max 120)`. Lengths are UTF-16 units: 60 emoji = 120 passes, 61 fails; `İstanbul` = 8. Blank, whitespace-only or `null` means absent. A number or boolean is coerced to a string like every text field; an array gives `city must be a string`. |
| `partner.track ∈ sourcing\|institute` | ✅ | The match is exact and case-sensitive after trimming. `INSTITUTE`, `ınstitute` and `institute​` get the enum reason. ` institute `, an NBSP-padded value and `institute\n` all become `institute`. 41 chars gives `track is too long (max 40)`. A stray `track` on any other form goes to `dropped`. |
| `contact.topic ∈ hire\|partner\|permit\|job\|other`; `callback.topic` unchanged | ✅ | `Permit` gets the enum reason; ` permit ` becomes `permit`. `callback.topic` stays free text ≤ 200 and a plain preview line. |
| `careers.portfolioUrl` uses the new `url` type | ✅ as briefed (see M2) | Adds `https://` when the scheme is missing. Then requires http(s), a dotted host with a last label of at least 2 characters, and no credentials; the cap of 500 applies to the value as typed. **Rejected:** `javascript:` in both forms and in mixed case, `data:`, `vbscript:`, `file:`, `ftp:`, `mailto:`, `user:pw@`, `localhost`, `[::1]`, `intranet`, `see attached`, `@handle`, a trailing-dot host, `a.b`. **Accepted:** `http://10.0.0.10/x` by design, and more (M2). |
| Threading | ✅ | **Tag:** `tagFor` (`website-inquiry.logic.ts:61`) produces `[website:partner:<track>]`. **Subject:** `subjectLine` (`:76`) produces `subject: [<topic>] <subject>` as the first line after the tag. `HEADER_FIELDS` (`:29`) and the contact-only `topic` skip (`:98`) keep `callback.topic` a plain line. **City:** an ordinary line in catalog order. A live partner body gives `[website:partner:institute]\ncity: Lahore\ntrades: welders\nmessage: m` with `SOURCING_PARTNER`. **Cover letter:** `withPortfolio` (`careers-apply.logic.ts:68`) produces `Hello\n\nPortfolio: https://…` as the last paragraph; the line stands alone when there is no letter, and the letter is untouched when there is no URL. No production code parses the `[website:` tag (grep finds only the producer). The longest possible letter is 5,000 + 2 + 11 + 508 = 5,521 characters, under the staff edit DTO's `@MaxLength(10_000)` (`internal-recruitment/dto/applicant.dto.ts:40,78`). **Test class:** dry runs short-circuit after the DTO is built (`careers-apply.handler.ts:79/82`, `website-inquiry.handler.ts:65`), so a heartbeat exercises the new composition without filing anything. |
| Classification unchanged | ✅ | `partner` gives `SOURCING_PARTNER` with either track or none. `contact` uses `iAm` or nothing. callback, visit and calculator stay unclassified. Covered by both the specs and the probe. |
| W56 gate untouched | ✅ | `careers-public.service.ts:653` still reads `if (opening.portfolioRequired && portfolio.length === 0)`. `git diff --stat 7e81bbe..HEAD -- apps/backend/src/modules/careers-public/` is empty. |
| No column, migration, permission key, dependency, public endpoint or controller | ✅ | Exactly 10 files (+371/−21). `git diff --stat` is empty for `packages/`, `apps/backend/prisma/`, `CLAUDE.md`, `docs/{DEPLOYMENT,ARCHITECTURE,GOTCHAS,NOTIFICATIONS}.md`, `careers-public/`, `website-form-submit.dto.ts`, both handler classes, `apps/frontend/` and every `package*.json`. The diff contains no `*.module.ts`, no `*controller.ts` and no migration. The catalog is read only by `WebsiteFormsService`; no endpoint serialises it. |
| `PERMISSION_KEYS_HASH` byte-identical | ✅ | `keys.catalog.ts:203` = `f1b77b08f0c3cb556294f329f5bac5c7f13e81a3` at both BASE and HEAD. `packages/**` has no diff here or on `origin/main`. `repo-invariants` recomputes `sha1(PERMISSION_KEYS.join(','))` and passes. |
| Boot conformance: 0 undecorated routes | ✅ source census | `repo-invariants` ("has no undecorated route left") and the three website conformance specs are green, and no route changed. The runtime line `Permission conformance: … 0 undecorated` comes from the production-compose boot, which has not been run yet (push checklist step 8). |
| PRD §5.12 handler rows and the v1.1 table | ✅ | The INQUIRY, callback and careers rows are amended (`PRD.md:6058`, `:6060`, `:6064`). The paragraph and four-row table are at `:6066–6073`; the gotcha is at `:6124`. The careers row's §5.4.3 cross-reference is correct: `PRD.md:1366` states the `portfolioRequired` rule. |
| Both former "retry on any non-2xx" sentences now state W74/W117 | ✅ | `grep -c 'retry on any non-2xx' docs/PRD.md` gives 0. Before/after quotes follow this table. |
| `sourcePath` is not hashed | ✅ | `:6052`. Verified against `requestHashFor` (`website-forms.logic.ts:26-31`): it hashes formKey, isTest, **a boolean** for whether the honeypot was filled, locale, and the key-sorted normalised `fields`. `sourcePath` sits beside `fields` in `payloadJson` and is never hashed. The old wording `a timestamp in \`sourcePath\`` now appears 0 times. |
| I12 click-only rule, with the corrected rationale | ✅ | `:6113`. `website-newsletter.service.ts:188` answers `ALREADY_CONFIRMED` for a confirmed row, and `:196` keeps the hash "so a second click is ALREADY_CONFIRMED, not 'invalid'". So a scanner's harm is a confirm or unsubscribe the human never made, not a spent token. The EN paths `/en/newsletter/{confirm,unsubscribe}` match the website's `src/i18n/routing.ts:28-29`. |
| W110 throttle follow-up | ✅ | `:6046`. Facts verified: `upload-cv` is `@Throttle` 10/min (`careers-public.controller.ts:76-77`); fraud-evidence is 10/min (`website-public-uploads.controller.ts:41`); newsletter is 30/min (`website-public-newsletter.controller.ts:35,43,58`). `RateLimitGuard.getTracker` keys on `x-forwarded-for` (`common/guards/rate-limit.guard.ts:54-55`) and stays inert until `RATE_LIMITING_ENABLED` (`:31`). This matches W110: "recorded as an Ops PRD §5.12 follow-up line … no code now". |
| §12.2 entry | ✅ | `:7398`, after the last entry (chronological), before `### 12.3`. |
| The docs guard pins the docs | ✅ | `website-docs-guard.spec.ts` gains 2 tests (20/20). It pins: the v1.1 heading; all four table rows' rule cells (the `city` row is an extra pin beyond the brief); the gotcha; the §12.2 entry; the W74/W117 sentence and the Every-deploy wording; `not.toContain('retry on any non-2xx')` (broader than the brief's string); the `sourcePath` note and the absence of its superseded wording; the I12 title; the W110 sentence. |
| Nothing else in the repo changed | ✅ | Every PRD hunk is inside §5.12 (6028–6125) or §12.2 (7335–7399), and the Inbox WP1 paragraph is untouched. The other PRD-reading guards (inbox ×2, contacts) are green on HEAD and on the merged preview. |

### The two retry sentences (W153), before and after

**1. Idempotency (P8), `PRD.md:6077`.**

Before:
```
(**contract: WP2 must retry on any non-2xx** — every deploy is a 30–60 s 502 window on `/api/website/*`, and a retried submission must land on the same row, not a second one)
```

After:
```
(**contract, website rulings W74 + W117 (amending W3): the website retries at most ONCE, and only after a connection-level failure — its `fetch` rejected without any response (DNS, refused, reset); a timeout or any answer, 5xx included, is final and never retried; both attempts share ONE 9 s deadline, then the visitor sees the site's fallback panel** — a Turnstile token is single-use and the captcha runs before the dedupe, so re-sending a request that already reached the door earns a 403, never `replayed`; every deploy is a 30–60 s 502 window on `/api/website/*`, which a visitor therefore meets as the fallback panel, and a repeat that does get past the captcha — degraded, or a tokenless test-class call — is answered from the same row, never filed twice)
```

Verified in code:
- The captcha (`website-forms.service.ts:243-244`) runs before the row (`:250`).
- Cloudflare's `timeout-or-duplicate` maps to `failed`, which is a 403 (`website-captcha.service.ts:95`).
- A degraded call or a tokenless test-class call reaches `createOrReplay`, hits P2002 and returns `replayed`.

This matches W74/W117 and the website's own I4 wording: "one retry, only after a connection-level failure; a timeout or a 5xx is final; one 9 s deadline".

**2. Every-deploy gotcha, `PRD.md:6123`.**

Before:
```
WP2 must retry on any non-2xx (contract, see the wire contract above);
```

After:
```
The website does NOT retry a 5xx or a timeout (website rulings W74/W117 — a retry would re-send a spent single-use Turnstile token and earn a 403): a visitor who submits inside that window sees the site's fallback panel at once, and the site's one retry is reserved for a connection-level failure, inside one 9 s deadline (the sentence under Idempotency above is the contract; W153).
```

### Replay-hash stability
Older bodies hash identically; the probe checked all ten forms in both token classes. The hash covers the catalog's normalised output, and an absent optional field never enters it.

The one intentional change: a v1.0-era body that already carried, say, `city` on `hire` (dropped before, kept now) hashes differently across the deploy. That is harmless. Only a retry within the same hour that spans the deploy would miss the replay, and the website sends none of these fields today.

`portfolioUrl` is hashed after the scheme is added, so `behance.net/x` and `https://behance.net/x` dedupe together.

### Staff-visible rendering
- **Escaped plain text, no anchors.** `messagePreview` renders at `admin/sales/inquiries/[id]/page.tsx:234` (`whitespace-pre-line`). The cover letter renders at `admin/internal-recruitment/applicants/[id]/page.tsx:646` (`whitespace-pre-wrap`). The forms-inbox payload panel renders at `admin/website/inbox/page.tsx:657` via `fieldText` (`:104`, a plain string). React escapes all of them, and none is an anchor.
- **Not in the CSV.** The inbox CSV never carries the raw payload.
- **Not in any mail.** `website-notify.service.ts` and `website-autoresponder.service.ts` read no field values.

## Findings

No Critical and no Important findings.

### Minor

**M1. The `url` normaliser is not idempotent at the cap, so the inbox refuses to re-run such a row.**

*Mechanism.* `website-form-catalog.ts:258` checks the length before `:279` adds `https://`. `WebsiteFormsService.rerun()` then re-normalises the stored fields (`website-forms.service.ts:316-319`) and answers 409 if they fail.

*Scenario.*
1. A visitor types a scheme-less portfolio link of 493–500 characters.
2. The door accepts it and stores 501–508 characters.
3. The careers handler fails for a non-visitor reason, leaving the row FAILED with no entity.
4. Staff click re-run and get `409 Stored payload no longer passes the catalog — portfolioUrl is too long (max 500)`.

This breaks the module's own invariant, stated in the `rerun()` docstring: a re-run is refused only when "a whitelist [was] tightened since the row was written".

*Confirmed by the probe.*

| Typed length | Stored length | Re-run |
|---|---|---|
| 492 | 500 | OK |
| 493 | 501 | error |
| 494 | 502 | error |
| 499 | 507 | error |
| 500 | 508 | error |

No other field type makes a value longer, so `url` is the first non-idempotent transform. The specs do not pin this: the mutant that applies the cap after the scheme survives all 16 catalog tests.

*Fix (either):*
- (a) apply the cap to the value after the scheme is added — one condition, and the existing tests stay green (the surviving mutant); the contract then reads "≤ 500 including the `https://` the door adds";
- (b) store the value as typed and let the handler's existing `withScheme` add the scheme.

Either way, add one spec: every value the door accepts re-normalises unchanged.

*Impact.* The likelihood is tiny, and nothing can reach this until WP2b T11 sends `portfolioUrl`.

**M2. The `url` type is more lenient than its documentation.**

This is a data-quality issue; there is no security exposure today.

*Mechanism.* `isHttpUrl` (`website-form-catalog.ts:166-179`) validates the WHATWG parse, but the catalog stores the value as typed.

*What the probe found it accepts:*
- **Bare numbers and phone numbers**, which WHATWG reads as IPv4. `123` is stored as `https://123` (host `0.0.0.123`); `05321234567` is stored as `https://05321234567` (host `43.69.57.119`).
- **Private, loopback and link-local IPv4 in any notation**, stored as typed (so obfuscated forms survive): `http://10.0.0.10/x`, `http://169.254.169.254/latest/meta-data/`, `http://127.0.0.10/`, `http://0x7f.0.0.10/` (host 127.0.0.10), `http://192.168.1.10/admin`.
- **Embedded tabs and newlines.** WHATWG strips them before parsing, but `clean()` keeps `\t` and `\n`. So `behance.net/ayse\nPortfolio: https://evil.example` is stored raw and renders as a second, never-validated "Portfolio:" line in the cover letter. Internal spaces pass too (`behance.net/ayse see attached`).
- **Misleading forms:** `https://evil.com\@behance.net` (the host is evil.com, but it reads like behance.net); `https://@behance.net`; `//evil.com`, which becomes `https:////evil.com`; and IDN homographs kept in Unicode (`https://bеhance.net`, host `xn--bhance-3of.net`).

Hostnames that only resolve internally (`localhost.localdomain`, `127.0.0.1.nip.io`, `jenkins.corp`) cannot be caught by syntax; that is acceptable.

The spec comment at `website-form-catalog.spec.ts:220` ("whatever gets through is http(s), never a script URL") is true for anything that parses the value, not for the displayed text.

*Risk (the "staff click it" question).* Today nobody can click it:
- all three staff surfaces render escaped plain text with no anchor (see Staff-visible rendering above);
- Operations never fetches the URL, so there is no SSRF path;
- the visitor already controls the adjacent free-text cover letter (≤ 5,000 characters, no validation).

So this is data quality and defence in depth, not a vulnerability.

*Fix (two one-liners plus about 4 junk cases in the spec).*
1. Require a letter in the last host label: `/^[^\s]+\.(?=[a-z0-9-]*[a-z])[a-z0-9-]{2,}$/i`. The probe confirms it rejects every IP and number case above and keeps every legitimate host tried: `behance.net`, `a.io`, `github.io`, `xn--ayse-3ra.com`, `ayşe.com`, `例え.jp`, and a host with `:8080`.
2. Reject `/\s/` in the value, or store `u.href` instead of the raw string.

If a UI ever turns `portfolioUrl` into a link, render it with `rel="noopener noreferrer nofollow"` and `target="_blank"`, and show `new URL(v).host` (punycode) next to it.

**M3. One stale clause remains in the §5.12 gotchas (documentation).**

`PRD.md:6117` ("Submission row first …") says: "Any exception after `inquiries.create` turns the website's retry into a second inquiry."

Under W74/W117 the website's only retry follows a connection-level failure and re-sends a spent token, which gets a 403. A degraded call or a tokenless test-class call gets `replayed` instead. So the website's retry can no longer file twice. The live duplicate risk is a visitor resubmitting by hand after the hour bucket; the rule itself still stands.

Suggested wording: "…turns a visitor's resubmission (after the hour bucket) into a second inquiry".

The implementer's Concern 4 deliberately kept the clause. Updating it fits the spirit of W153 but is optional.

### Informational (not counted)
- **Newlines in free text.** Every free-text field, now including `city`, keeps `\n`, so a visitor can add lines to the preview. For example, `city: 'Antalya\nheadcount: 500'` gives `[website:hire]\ncity: Antalya\nheadcount: 500`, and a contact `subject` can fake a `city:` line the same way. This behaviour predates the task and affects no column or classification. Collapsing whitespace in single-line fields could be a later hardening.
- **Forward reference.** The v1.1 paragraph says the website's I4 "mirrors this table". That is true only after the controller updates I4 (push checklist step 11).
- **Dense wording.** The heartbeat sentence (`:6052`) now chains three em-dash clauses. It is accurate, just hard to read.
- **Logging and retention.** There are no new log lines. The door's debug line logs dropped key names only (≤ 40 characters each), never values. The payload, including `city` and `portfolioUrl`, is purged after 90 days (X17). The careers retention cron nulls `coverLetter` (`careers-retention.cron.ts:141`), which removes the portfolio line with it.
- **TypeScript.** There is no `any` and no production cast. The one spec cast (`as [Record<string, unknown>, unknown]`) is type-checked, because the tsconfig includes `src/**` so `tsc` covers specs; the type-check exits 0.

## ⚠️ Items needing a controller ruling

1. **Fix M1 and M2 (and M3) now, or record them?**
   - Both M1 and M2 are latent: the website sends none of these fields until WP2b T11.
   - A fix now is cheap: about 6 lines, 4–5 spec cases, and 2 PRD and docs-guard strings ("≤ 500 including the scheme", "no IP address / no whitespace").
   - Now is also the last free moment to change the rule. Once T14 records the contract in the website's I4, tightening it becomes a contract change.
   - **Recommendation:** one small fix round plus a short re-review of the delta before the push. The alternative is to push as is and record a follow-up that must land before T11 sends `portfolioUrl`.
   - Neither choice affects today's traffic.
2. **When the flag is ON, the door-state check reads 401, not 200.** A tokenless `curl …/api/website/v1/ping` answers 404 when the module is dark and 401 when it is ON, because `WebsiteModuleEnabledGuard` runs before `WebsiteApiGuard` (`website-public.controller.ts:33-35`); the DEPLOYMENT recipe's own line is `ping flag=true → 401`. The brief (Cycle 7 Step 4) and the report (checklist item 4) both say "200 means ON". Treat 401 as ON, not as a failure. The handoff says the flag is now ON.
3. **`origin/main` is `8a0562b`, not `15f00bb`.** Its fourth commit (`8a0562b`, WhatsApp "AI inside flows") adds `WaFlowWaitKind.AI` through migration `20261001160000_whatsapp_flow_ai_wait`. This worktree's generated Prisma client predates that value, and `wa-flow.engine.ts` writes `waitKind: result.wait.kind`, which can be `'AI'`. A post-rebase `tsc` will therefore fail spuriously unless you first run `cd apps/backend && npx prisma generate`. The local production-compose boot will also apply that migration; that is expected, since it is an additive `ADD VALUE IF NOT EXISTS`.
4. **The production-compose boot has not been run.** Controller addition (5) asked the implementer to run it; the report says the controller took it over (Deviation 11). Either way it is still outstanding, and it is the last gate before the push (checklist step 8).

## The implementer's deviations — verdicts

| # | Deviation | Verdict |
|---|---|---|
| 1 | Stale anchors recorded: hash at `:203` / `f1b77b08…`, gate at `:653`, invariants test at `:611`, guard at 248 lines, PRD anchors | Accept. I re-verified them all. |
| 2 | Retry sentences follow W74/W117 (and W153), not the brief's W3 text | Accept, and it was required. W74 amends W3 and W153 names both sentences. The text matches the rulings and the website's I4, and the facts hold in code. |
| 3 | Dates are 2026-09-28 (the brief said 2026-09-20) in the heading, the gotcha and §12.2 | Accept. §12.2 is a log of shipped changes, and citing W16 carries the ruling's own date. If the push slips a day, keep the dates as they are; the commits are dated 09-28. |
| 4 | §12.2 entry placed after the last entry, not after the WP3a entry | Accept; it keeps the list chronological. |
| 5 | Catalog edited in place instead of replaced whole | Accept. Field order, types, specs and helpers match the brief's file entry by entry, and the diff stays minimal. Prettier is not a CI gate (`ci.yml` lint is advisory, and there is no `prettier --check`), and BASE already had 8 lines longer than 120 characters. |
| 6 | Spec cast fixed to `as [Record<string, unknown>, unknown]` | Accept. It was needed (TS2352), `tsc` covers spec files, and the type-check exits 0. |
| 7 | Two extra `javascript:` junk cases | Accept. Both are rejected, and they are what kills the "any protocol" mutant. The comment above them overstates what the stored text guarantees (M2). |
| 8 | Wording changed from "the Sales list" to "the inquiry page" | Accept. `admin/sales/inquiries/page.tsx` has no preview column (only the create form uses `messagePreview`), and the detail page renders it with `whitespace-pre-line` (`[id]/page.tsx:234`). |
| 9 | I12 rationale corrected | Accept; verified at `website-newsletter.service.ts:188,196`. The website's I12 needs the same fix (see below). |
| 10 | `url` leniency (`10.0.0.10` accepted) | ⚠️ Acceptable as briefed, but the leniency is wider than reported (M2), so it goes to ⚠️1. |
| 11 | W110 recorded as a PRD note only | Accept. W110 says "no code now", and the facts are verified. |
| 12 | Permission specs run at 8192 MB, one file per process | Accept. `CLAUDE.md:56` prescribes 8192 for specs that reach `packages/*`; I measured about 2.8 GB RSS each on a warm cache. |
| 13 | No Docker; the boot left to the controller | Accept as a hand-off, but it is still outstanding (⚠️4). |
| 14 | Commit trailer `Claude Opus 5.5` (the brief's templates say `Claude Opus 5 (1M context)`) | Accept; it is cosmetic and matches this session's attribution rule. If the programme insists on a different trailer, the only window is the rebase (`git rebase --exec 'git commit --amend …'`), never after the push. |
| 15 | Step 0 skipped because the worktree already existed | Accept. |

## Cross-repo contract (for the website's `docs/INTEGRATIONS.md` I4, T14)

These are unchanged: the route, the envelope, and the 200/400/401/403/404/429 shapes. The evaluation order is still form → trip → whitelist → honeypot → captcha → row, so a field 400 never spends the Turnstile token (`website-forms.service.ts:201` runs before `:243`).

| formKey | Field (inside `fields`, a string) | Rule at the door | 400 reason(s) | Where it lands |
|---|---|---|---|---|
| `hire`, `workers`, `partner`, `callback`, `contact` | `city` | trimmed, C0 control characters stripped, blank means absent; ≤ 120 UTF-16 units | `city is too long (max 120)` | a `city: <value>` preview line |
| `careers` | `city` (unchanged) | ≤ 100 | `city is too long (max 100)` | the applicant's `city` column |
| `partner` | `track` | `sourcing` \| `institute`, exact and lower-case, after trimming | `track must be one of sourcing, institute` · `track is too long (max 40)` | the tag `[website:partner:<track>]`; classification stays `SOURCING_PARTNER` (the HR-agency track posts to `hire` with `iAm: 'hr_agency'`) |
| `contact` | `topic` | `hire` \| `partner` \| `permit` \| `job` \| `other`, exact and lower-case | `topic must be one of hire, partner, permit, job, other` · `topic is too long (max 40)` | `subject: [<topic>] <subject>` as the first line after the tag (`subject: [job]` when there is no subject) |
| `callback` | `topic` (unchanged) | free text ≤ 200 | `topic is too long (max 200)` | a plain `topic:` line |
| `careers` | `portfolioUrl` | ≤ 500 as typed; `https://` added when there is no scheme; http(s) only, a dotted host whose last label has at least 2 characters, no `user:pass@` | `portfolioUrl must be a web address` · `portfolioUrl is too long (max 500)` | the last cover-letter paragraph, `Portfolio: <url>`. **It does not satisfy `portfolioRequired` (W56):** those openings still answer HTTP 200 with `status: 'FAILED'` and `error: 'This position requires at least one portfolio document'`, so keep "apply by e-mail" for them |

Also:
- A v1.1 field name sent on a form that does not list it is dropped, never a 400.
- The same names at the top level of the body are a 400 (`forbidNonWhitelisted`).
- Accepted values are part of `requestHash`; `sourcePath` is not.
- If the controller takes ⚠️1, the `portfolioUrl` row becomes: "≤ 500 including the added `https://`; the host's last label must contain a letter (no IP addresses); no whitespace".

**I12 wording fix (website).** Replace "because mail-link scanners would otherwise consume the one-shot confirm token" with "because a mail-link scanner or a browser prefetch would otherwise confirm (or unsubscribe) on the subscriber's behalf — Operations keeps the confirm hash and answers a repeat click `ALREADY_CONFIRMED`, so the harm is a double opt-in the human never gave".

**I4.** The sentence "Field catalog per key … Task 8 / T0f adds …" becomes the table above.

The site hint `sys.form.hints.portfolioUrl` ("A link starting with https://.") is stricter than the door, which is harmless.

## Push checklist
In order; every step must be green before `git push`.

1. **Rule on ⚠️1.** If you choose a fix round, re-review its delta, then continue here.
2. **Announce to the peer Operations sessions (Inbox, WhatsApp).**
   - Step 8 takes down the shared dev stack; the recipe's step 0 uses the main checkout's compose file.
   - The push is a production deploy: expect a 30–60 s 502 on `/api/website/*`.
   - A deploy kills in-flight Bull batch jobs, so confirm none is running.
3. **Rebase.** Run `git fetch origin`, then rebase `website/catalog-ext` onto `origin/main`; a merge is also fine, since the programme accepts merge-not-rebase. `origin/main` was `8a0562b` at review time; re-check it. The rebase should be clean because only `docs/PRD.md` overlaps, in disjoint sections. If it is not clean, resolve hunk by hunk and never use `--ours` or `--theirs` on the PRD.
4. **Regenerate the Prisma client** (required after the rebase, see ⚠️3): `cd apps/backend && npx prisma generate`.
5. **Type-check:** `npm run type-check` → exit 0.
6. **Jest,** one job at a time, using `NODE_OPTIONS=--max-old-space-size=4096 npx jest <paths> --maxWorkers=1 --forceExit` unless stated otherwise:
   - `src/modules/website` → 38 suites / 350 tests;
   - `src/modules/notifications/inbox/inbox-docs-guard.spec.ts src/modules/notifications/inbox/inbox-registry-coverage.spec.ts test/contacts/contacts-docs-counts.spec.ts` → 3 suites / 243 tests;
   - at 8192, one file per process: `test/permissions/repo-invariants.spec.ts` → 17; `website-conformance` → 6; `website-door-conformance` → 5; `website-inbox-conformance` → 3.

   My merged-tree preview already passed the PRD guards and `repo-invariants`. This re-run is the real proof.
7. **Hash and lint.** `grep -n "PERMISSION_KEYS_HASH = " packages/permissions/src/keys.catalog.ts` → `203: … 'f1b77b08f0c3cb556294f329f5bac5c7f13e81a3'`. ESLint (advisory only): `npx eslint src/modules/website --ext .ts` → the same 5 errors.
8. **Production-compose boot**, from `docs/DEPLOYMENT.md` § "Booting the production compose file locally (plan D24 — before every website-programme push)".
   - The section is at line 243 at HEAD and line 244 after the rebase. Its `cd` line (248 at HEAD, 249 after the rebase) names `…/jobsadmire-operations-website`. Replace it with `/Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-catalog`.
   - Run it as the only heavy job on the Mac.
   - Every `→` line must hold:
     - migrations apply, including main's `20261001160000`;
     - drift shows only the baseline items;
     - `Permission conformance: … 0 undecorated (PERMISSIONS_STRICT=true)`, then `Nest application successfully started`, with no `Error:` line;
     - health 200 and `restarts=0 running`;
     - the seed runs without a stack trace;
     - frontend 200;
     - ping 404 with the flag off, then 401 with the flag on, with `restarts=0`.
   - Tear down, confirm `git status --short` is empty, then bring the dev stack back up.
9. **Door state before the push:** `curl -s -o /dev/null -w '%{http_code}\n' https://operations.jobsadmire.com/api/website/v1/ping`. 404 means dark; 401 means ON (⚠️2). Record the result.
10. **Push** (fast-forward `main`), then verify by artifact, never by prod `git rev-parse`. `deploy.log` should show "Deploy finished for <sha>", `/api/health` should return 200, and ping should return the same code as in step 9. The recipe is DEPLOYMENT.md § "Verifying a deploy landed" (line 340 at HEAD, 341 after the rebase). Rollback is `git revert <sha>` on `main`; there is no migration half.
11. **Website repo and ledger.** Update I4 (the table) and I12 (the wording) in the website repo. Add the WP2a ledger entry: the SHAs, the deploy line, the ping codes, the boot's `→` lines, and "`portfolioRequired` gate unchanged per W56".
