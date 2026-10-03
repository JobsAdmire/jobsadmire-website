# Task 7 — fix round 1 re-review (`f41ad5e..e4ee8ed`: 2c59c20, ab9707c, f4b550c, ad2b285, 4cbb429, 9dfba9b, 7346e1c, c8d1684, c18b6b2, e4ee8ed)

**Fix round 1 verdict:** ✅ all findings addressed.
- **Fixed:** C1, I1–I4 and M1–M8 are fixed and pinned by tests.
- **Proven end to end** by:
  - a real `gate.sh` run through a local preview stand-in;
  - a protected (401) stand-in for every header consumer;
  - the pixel harness;
  - a design-side probe.
- **One departure from W137's text:** `--settings.extraHeaders` instead of `--extra-headers`. It is correct and necessary, so W137 needs its amendment line.
- **New:** three Minor items, none blocking.

**Regressions:** none.
- **Low gate at HEAD `e4ee8ed`:** typecheck, lint and format are clean; vitest **105 files / 611 tests** (BASE 103/582). The only stderr line is Node 25's pre-existing `--localstorage-file` warning.
- **Build:** `NEXT_BUILD_CPUS=2 NODE_OPTIONS=--max-old-space-size=4096 npm run build` exited 0.
  - The Experiments log shows `cpus: 2` and `serverActions`.
  - 13/13 pages on 2 workers; `○ /robots.txt`.
  - No `nextjs-agent-rules` block was appended (the tree is clean after the build).
- **`npm run gate` on one `next start`:** **exit 0, `gate: OK`**, 216 passed, 0 skipped.
  - js-size prints 177,782 B on all four routes.
  - `js-size --routes '/tesekkurler?form=hire'` prints 179,927 B.
  - Both figures are byte-identical to the task review and to the implementer's.
- **Pixel `hire`:** **82.14 / 84.04 / 85.03 %**, identical to the implementer's to the hundredth.
- **Scope:** 22 files, all inside the brief's items.
  - The only files beyond its list are the `.env.example` comment and `lighthouserc.local.json`'s `_comment`. Both correct the same W91 wording (deviation 7).
  - Zero diff lines under:
    - `docs/superpowers/handoff-2026-09-25/`, which holds `produces-final.md` (last modified 02:36, before the 03:58–04:50 round);
    - the ruling log;
    - `docs/WEBSITE-HANDOFF.md`;
    - `src/`, `contract/` and `design-package/`.
  - The DEPLOYMENT diff is Prettier re-padding: `git diff -w` shows only the table separator and the one bypass row.
- **Commits and secrets:**
  - All 10 commits end with `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`.
  - No secret-shaped literal appears in any patch; the only values are test ones (`abc123`, `s`, `s3cret`, `q"uo\\te`).
  - The implementer's dummy value appears in no commit.

## Per item (1–11)

### 1. C1 / W137 — `gate.sh` passes the config to collect ✅

- **Order.** `scripts/gate.sh:36-54` chooses the config and builds the header before Playwright (`:56`) and the Lighthouse loop.
  - `:44`: `LHCI_CONFIG` is `lighthouseConfigFor(E2E_BASE_URL)` from `e2e/helpers/face.ts`, loaded through `tsx/cjs/api`. It is the one helper, with no bash twin, so no parity test is needed.
  - `:50`: `LH_EXTRA_HEADERS` is `JSON.stringify(protectionBypassHeaders())`, and empty when the secret is blank.
  - `:52-54`: the warning prints only when the preview config is selected and there is no header.
  - Under `set -euo pipefail`, a failing `node -e` in either assignment aborts the gate; there is no silent fallback.
- **Collect and assert.**
  - `:78-80`: every `lhci collect` gets `--config="$LHCI_CONFIG"` and `${LH_EXTRA_HEADERS:+--settings.extraHeaders="$LH_EXTRA_HEADERS"}`. The inner quotes keep the JSON one word.
  - `:88`: `lhci assert` uses the same file.
- **Comments and docs.** These now describe collect + assert and the flag that works:
  - `gate.sh` `:9-11`, `:36-49`, `:72-76` and `:85-86`;
  - both rc files' `_comment`;
  - ARCHITECTURE § Quality gate item 5 (`:260`).
- **`--extra-headers` is not a `collect` option in lhci 0.15.1.** There is no other form of it either.
  - `node_modules/@lhci/cli/src/collect/collect.js:27-107` declares method, headful, additive, url, autodiscoverUrlBlocklist, psi\*, staticDistDir, isSinglePageApplication, chromePath, puppeteerScript, puppeteerLaunchOptions, startServer\*, `settings`, numberOfRuns, maxAutodiscoverUrls and staticDirFileDiscoveryDepth. There is no `extraHeaders`.
  - Only `upload` has an `extraHeaders`, and it is for LHCI-server API calls (`upload.js:90`).
  - lhci's yargs is not strict, so the unknown flag was accepted and dropped.
  - `node-runner.js:42-73` hands Lighthouse nothing but `options.settings`, written to a `--cli-flags-path` JSON file.
  - Lighthouse 12.6.1's `coerceExtraHeaders` (`cli/cli-flags.js:442-457`) parses a JSON string. So `settings` is the only door, and `--settings.extraHeaders=<JSON>` is the right spelling.
  - The alternatives are worse. `--settings.extraHeaders.<name>=<v>` risks yargs camel-case expansion of the header name, and the rc-file form would put the secret in a tracked file.
- **Proof** (§ Preview stand-in proof):
  - RED — the old flag against a protected stand-in: Lighthouse runtime error, status 401.
  - GREEN — 8/8 LHRs have `skipAudits: ["is-crawlable"]` and SEO 1, and the header reached 162/162 audited-page requests.

### 2. I1 + I2 + ⚠️4 — W137 header helper ✅

- **Helper and tests.**
  - `e2e/helpers/bypass.ts:22-26`: `protectionBypassHeaders(env)` returns `{}` for an unset, empty or whitespace secret (trimmed), else exactly `{ 'x-vercel-protection-bypass': secret }`.
  - `:31-38`: `bypassWarning` fires for a preview face with no secret.
  - `scripts/bypass.test.ts` has 4 cases, including `'   '` and "never carries another variable".
- **Playwright.** `playwright.config.ts:17` sets `extraHTTPHeaders: protectionBypassHeaders()`, and the comment at `:14-16` is fixed. Through the stand-in, 3,368/3,368 Playwright requests carried the right value, with 0 empty headers.
- **Placeholder counter — I2(a) closed.** `scripts/placeholder-count.ts:99` spreads the helper, and `:115-116` prints the warning. Through the protected stand-in:
  - with the secret: 5/5 rows `200 ok`, exit 0;
  - without it: the W137 warning and 5/5 `HTTP 401`, exit 1 — the review's scenario.
- **`js-size --routes` — I2(b) closed.** `scripts/js-size.mjs:177-190` `collectArgs` passes `--config` and the header only when non-empty; the helpers load through `gateHelpers()` (`:212-221`). Through the protected stand-in it printed `collecting with lighthouserc.preview.json` and 179,927 B, with SEO 1.
- **Pixel harness — I1 closed.** It uses two contexts per width:
  - The design context (`:326`) is `captureContextOptions()` (`:182-189`, no `extraHTTPHeaders`) plus the init script, nothing else.
  - The built context gets `builtOriginRoute()` (`:200-209`) through `context.route('<origin>/**')` (`:360`), and `null` when the secret is blank.
  - `pixel-compare.test.ts` pins the scoping in 3 cases.
  - Run through the open stand-in with a throw-away secret: **51/51** built-origin requests carried the header.
- **Design-side probe.** It used the harness's own exported `captureContextOptions`, the same init script and waits, and a secret exported in the shell:
  - **0/19** requests carried the header, at 390 and at 1440.
  - Archivo: 2 faces `loaded`; the 10 `unloaded` are unused weights and subsets; 0 in `error`. `document.fonts.check('800 16px Archivo')` is true.
  - The only failed request is the design runtime's optional `.image-slots.state.json`, which is aborted in every variant.
  - **Control, the pre-fix empty header:**
    - 19/19 requests carried it, across 8 hosts.
    - Both Archivo faces were in `error`.
    - `fonts.gstatic.com` ×2 and `cdn.jsdelivr.net/npm/world-atlas…` failed with `net::ERR_FAILED`.
  - **Control, the pre-fix context with the secret exported:** the same breakage, and the secret reached 7 third-party hosts: `fonts.googleapis.com`, `fonts.gstatic.com`, `unpkg.com`, `cdn.jsdelivr.net`, `www.jobsadmire.com`, `play.google.com` and `developer.apple.com`.
- **Wrong claims corrected** in:
  - `pixel-compare.ts:21-36`;
  - the pixel-harness plan (`:7-11`);
  - DEPLOYMENT `:45`, which now also states the accepted third-party exposure;
  - ARCHITECTURE `:251` and `:270`;
  - `playwright.config.ts`.

  A grep of tracked files for "no-op", "throw-away local server", "built-route requests" and a `?? ''` header finds nothing left.

### 3. ⚠️1 + ⚠️2 + I3 + M1 — W135 face helper, strict robots ✅

- **`siteFace`** (`e2e/helpers/face.ts:31-36`) returns:
  - preview for `*.vercel.app` (suffix match, case-insensitive) or `staging.jobsadmire.com` (the URL lowercases the host), whatever the env says;
  - otherwise preview when `NEXT_PUBLIC_SITE_FACE` is trimmed, non-blank and not `production`;
  - production when it is unset or blank (W135).
- **Derived helpers.** `expectedRobots` (`:39-41`) delegates to it. `lighthouseConfigFor` (`:55-64`) checks the face first, then localhost/127.0.0.1, else `lighthouserc.json`.
- **Consumers.** gate.sh and js-size use it through tsx. The pixel harness and the placeholder counter use it through `bypassWarning`, which is their only face-dependent behaviour.
- **Tests.** `scripts/face.test.ts` has 7 cases. They include the brief's three (a vercel.app host, staging, localhost with and without the env) and the config choice.
- **Strict robots assertion.** `e2e/seo.spec.ts:94-96` asserts `toMatch(/^Disallow: \/$/m)`, `not.toMatch(/^Allow:/m)` and `not.toContain('Sitemap:')`. The mutation check on real bodies:

  | Body | Strict preview branch | Old substring check |
  | --- | --- | --- |
  | What `next start` serves (production face) | **false** | true |
  | What Next renders for a preview (`resolveRobots(robots())` with `VERCEL_ENV=preview` → `User-Agent: *\nDisallow: /\n`) | **true** | true |

  A real preview passes. A preview that wrongly serves the production rules now fails on three counts. In the stand-in gate, the preview branch ran in both projects and passed.
- **Recipe comment.** `face.ts:17-19` and ARCHITECTURE `:251` now say `VERCEL_ENV=preview npm run build` (robots.txt is prerendered). N3 notes that the docs don't mention the rehearsal ends red on LCP.

### 4. I4 + M6 — W138 pixel harness ✅ (N2: robustness)

- **Clip.** `designClip()` (`:122-129`) and `main` (`:337-355`) read the same six metrics Playwright's own full-page size reads, times `getComputedStyle(html).zoom`. Verified: Playwright 1.63.0's `fullPageSize` (in `coreBundle.js`) is that exact `Math.max` of body/html scroll, offset and client heights.
  - **Measured on the hire design at 1440:**

    | `body.scrollHeight` | `html.scrollHeight` | body/html `offsetHeight` | `html.clientHeight` | `body.scrollWidth` | zoom |
    | ---: | ---: | ---: | ---: | ---: | ---: |
    | 7,830 (unzoomed) | 5,872 (already zoomed) | 1,200 | 900 | 1,920 | `0.75` |

    The unclipped full page is 1920×7830, with content to x=1447 / y=5871. The harness clip is 1440×5873.
  - **Captures.** `.pixel/hire-tr-1440-design.png` is **1440×5873**, with non-white content reaching x=1439 and y=5871: no content lost, no blank band. The 390 and 900 captures are 390×10001 and 900×12620 (zoom 1, so the full page), with content to the last row.
  - **Robust or coincidental?** Deliberate: the clip is "Playwright's canvas scaled by the zoom". That is right exactly while the canvas is in unzoomed px, which is the condition behind I4.
    - The literal W138 formula, `html.scrollHeight × zoom`, gives 4,404 and would drop a quarter of the page in this Chromium.
    - Nothing checks the coupling (N2).
- **2xx check.** `gotoOk()` (`:149-156`) runs on both gotos (`:328`, `:362`).
  - A failure throws `PixelExit(…, 2)`; `finally` (`:386`) closes the browser and server, and `main().catch` exits 2 (`:406-410`).
  - The unit test mocks 404, `null` and 200.
  - **Real browser:** the harness against the protected stand-in without the secret printed `pixel: http://127.0.0.1:3201/isci-talebi answered HTTP 401; nothing is scored (W138)` and exited 2; `report.json` stayed byte-identical.
- **Skips.** `pixelTarget()` (`:93-109`) uses `PIXEL_PATHNAMES`, whose keys match `src/i18n/routing.ts`, and the lazy `UNBUILT_PATHNAMES` import (`:282`). On Node 20.20.2, 24.14.1 and 25.8.2, both exit 0:
  - `--page=calc` → "skipped: /hiring-cost-calculator is not built yet (UNBUILT_PATHNAMES)";
  - `--page=blog-article` → "no blog body in tr".
- **Tests and docs.** The width-padding test is present. The plan doc's W137/W138 paragraphs (`:8-17`) and rule 1 (`:24-26`: the cap counts from the first like-for-like run) are updated.

### 5. M2 — `--routes <list>`, unknown arguments ✅

- `parseJsSizeArgs()` (`:129-152`) accepts `--routes=`, `--routes <list>` and `--dir=`. Anything else exits 2 with the usage line (`:225-227`).
- **Tests:** 4 parser cases and 2 CLI spawns.
  - `--bogus` exits 2.
  - `--routes /foo,/bar` exits 2 with "needs E2E_BASE_URL", which shows the space spelling is now recognised.
- My own js-size run used W94's space spelling.

### 6. M3 — the `--routes` HTML reports move too ✅

- `newRunFiles()` (`:166-168`) selects `lhr-<ts>.json|html`. `collectExtra` (`:194-207`) moves both, after first emptying both kinds from `.lighthouseci-extra`.
- **Run:**
  - `.lighthouseci` was identical before and after (17 entries).
  - `.lighthouseci-extra` held exactly this run's 2 json + 2 html; the previous pair was removed.
- **Docs:** the header comment (`:10-16`), the `collectExtra` doc and the `js-size.test.ts` W94 comment are fixed. README `:52` documents `npm run js-size -- --routes`.

### 7. M4 — skip message and abort tested ✅

- **Stderr case.** `gate-routes.test.ts:61-71` spawns with stderr captured: the message is on stderr, and stdout is exactly `INDEXABLE_GATE_ROUTES`.
- **Abort case** (`:110-144`):
  - fake timers, with `AbortSignal.timeout` rebuilt on the faked `setTimeout`;
  - a fetch that rejects only on abort;
  - it is still pending at 2,999 ms and resolves to `[]` at 3,000 ms, and `timeout(3_000)` is asserted.

  The logic is sound. It also pins that the signal is created before the first `await`. The implementer's RED-by-mutation was not re-run (read-only).

### 8. M5 — `NEXT_BUILD_CPUS` guard ✅

`next.config.ts:9,27`. I loaded the config under tsx and printed `experimental.cpus` for each value:

| `NEXT_BUILD_CPUS` | `abc`, `0`, `2.5`, `-1`, `''`, unset | `2` | `' 3 '` |
| --- | --- | --- | --- |
| `cpus` | `undefined` | 2 | 3 (`Number` trims; harmless) |

The build log prints `cpus: 2`.

### 9. M7 — two doc defects ✅

- ARCHITECTURE `:312` now reads "(Ruling R47; the 204,800 B script ceiling — § Quality gate above)".
- The CLAUDE.md `:37` row now runs question → doc, and only that row changed.
- The remaining "180 KB" mentions are intended history ("R49's 180 KB …"): CLAUDE.md:75, ARCHITECTURE:256, PRD:76 and PRD:116.

### 10. W136 — js-size method and ARCHITECTURE statement ✅

- `formatMethodLine()` (`:80-93`) prints above every table and names the host, which decides whether the figure binds. Seen as `…transfer bytes on localhost:3000…` and `…on 127.0.0.1:3201…`.
- ARCHITECTURE item 4 (`:254`) states W136 and the bridge: 169,353 B ≡ 177,782 B on `/` at `9af7983`, 27,018 B of headroom.
- The report's wrong label is corrected in its "## Fix round 1" item 10.
- W136's optional "keep the proxy as a diagnostic in js-size if cheap" was not taken. That is acceptable: the ruling made it optional.

### 11. M8 — header-handling nits ✅

Nothing is left:
- **`JSON.stringify`:** a secret `q"u\o` becomes `{"x-vercel-protection-bypass":"q\"u\\o"}` on all three Node versions.
- **Warning:** preview-only (table below).

## Preview stand-in proof

**Setup.**
- One `next start` on :3000 from this review's build at `e4ee8ed`.
- `scratchpad/rereview-task7/standin.mjs` runs in two modes:
  - **open** (127.0.0.1:3200): answers `/robots.txt` with `User-Agent: *\nDisallow: /\n` and forwards everything else with `Host` kept, so redirects and the Server Action origin check see the stand-in origin;
  - **enforce** (127.0.0.1:3201): additionally answers **401** to any request without the right header, like a protected preview.
- It logs header presence and correctness per request, never the value.
- The secret was the throw-away `test-secret`; `REVALIDATE_SECRET` was a throw-away too.

**Run A — the whole `npm run gate` through the open stand-in** (`E2E_BASE_URL=http://127.0.0.1:3200 NEXT_PUBLIC_SITE_FACE=preview`):
- **Selection:** it printed `gate: lighthouse config lighthouserc.preview.json`, and no bypass warning (the secret was set).
- **Playwright:** **216 passed** (27.0 s). That includes the robots test's strict preview branch in both projects, against the preview body.
- **Lighthouse:** 4 routes × 2 runs were collected.
- **Assert** with the preview rc: exactly 4 failures, all `largest-contentful-paint` (2,855–2,858 ms — R50 on localhost). Nothing else failed, including `categories:seo`. Exit 1, by design (deviation 4).
- **LHRs, 8/8:**

  | Setting / score | Value |
  | --- | --- |
  | `configSettings.skipAudits` | `["is-crawlable"]` |
  | `is-crawlable` | absent from `audits` and from the SEO `auditRefs` |
  | **`categories.seo`** | **1** |
  | `robots-txt`, best-practices, accessibility | 1 |
  | performance | 0.96 |
  | `configSettings.extraHeaders` | a parsed object carrying the bypass header, value = the throw-away |
  | `formFactor` | `mobile` (the rc's settings survive the dot-key merge) |
  | script | 177,782 B (two runs 177,788 — header bytes through the proxy) |

- **Header delivery** (stand-in log, 3,552 requests, classified by UA):

  | Client | Requests | With the right header | Without | Empty |
  | --- | ---: | ---: | ---: | ---: |
  | Playwright `mobile` (Pixel 7) | 1,683 | 1,683 | 0 | 0 |
  | Playwright `desktop` | 1,685 | 1,685 | 0 | 0 |
  | Lighthouse, audited page (moto g power UA) | 162 | **162** | 0 | 0 |
  | Lighthouse, out-of-page fetches (host Chrome UA, no emulation) | 22 | 0 | 22 | 0 |

  - The 22 header-less requests are 8 × `/robots.txt` (one per run) and 14 × `/_next/image` **1x** candidates of the logo (`w=48`, `w=64`).
  - None appears in the audited page's network log, which holds the 2x `w=96`/`w=128` with status 200.
  - Lighthouse 12 no longer puts `Chrome-Lighthouse` in its UA; hence the UA classification.

**Run B — the protected stand-in** (`:3201`). One Lighthouse run each, from a scratch directory holding a copy of the preview rc:

| Flag | Result |
| --- | --- |
| Old `--extra-headers=<JSON>` (`f41ad5e..c18b6b2`) | `Runtime error … Lighthouse was unable to reliably load the page … (Status code 401)`, no LHR; the stand-in saw 6 requests, **all without the header, all 401**. The implementer's `e4ee8ed` finding, reproduced independently. |
| New `--settings.extraHeaders=<JSON>` (`e4ee8ed`) | No runtime error; 22/22 page requests carried the header (200). The 3 header-less out-of-page fetches (robots.txt, both 1x logo candidates) got 401. Audit results in the list below. |

With the new flag, against the protected stand-in:
- `robots-txt`: **notApplicable**;
- `is-crawlable`: skipped;
- **SEO 1**, best-practices 1;
- `image-size-responsive`, `image-aspect-ratio`, `uses-responsive-images`, `unsized-images`, `errors-in-console`, `inspector-issues`: 1;
- performance 0.96; script 177,782 B.

The same protected stand-in, driven by the real scripts:
- **`js-size --routes`** (preview face, secret set): `collecting with lighthouserc.preview.json`, 179,927 B, both LHRs `skipAudits: ["is-crawlable"]` and SEO 1. 50 requests carried the header; the only 401s were the 4 out-of-page fetches.
- **Placeholder counter:** 5/5 `200 ok` with the secret; the warning and 5/5 `HTTP 401` without it.
- **Pixel harness, no secret:** exit 2 naming the URL and `HTTP 401`. With the secret, through the open stand-in, the built origin got 51/51 requests with the header.

**`gate.sh`'s own block** (lines 13–54, run verbatim, stopping before Playwright):

| Target | Config | Header JSON | Warning |
| --- | --- | --- | --- |
| `https://jobsadmire-web-v2-git-wp2.vercel.app`, secret unset | preview | none | yes |
| same, secret set | preview | `{"x-vercel-protection-bypass":"…"}` | no |
| `https://staging.jobsadmire.com`, secret unset | preview | none | yes |
| `http://localhost:3000` | local | none | no |
| `http://127.0.0.1:3200` (no face env) | local | none | no |
| `https://www.jobsadmire.com` | `lighthouserc.json` | none | no |

## The implementer's deviations and concerns — verdicts

| # | Deviation | Verdict |
| --- | --- | --- |
| 1 | `--settings.extraHeaders` instead of W137's `--extra-headers` | **Accept — necessary. Controller: amend W137** to "`--settings.extraHeaders=<JSON.stringify(headers)>`, only when non-empty". Evidence: item 1 (lhci 0.15.1's `collect` has no such option, and yargs is not strict) and Run B (old flag → 401 runtime error; new flag → green). |
| 2 | Clip height = max(the six Playwright metrics) × zoom, not `html.scrollHeight × zoom` | **Accept.** It is deliberate and equals Playwright's canvas × zoom (verified in Playwright's source and in the captures); the literal formula clips at 4,404 px. Add a guard (N2). |
| 3 | "Unbuilt" = `UNBUILT_PATHNAMES` through a page → pathname map | **Accept.** It is W20's own source, the keys match `routing.ts`, and the skip paths run on three Node majors. |
| 4 | `lighthouseConfigFor` checks the face before localhost | **Accept.** Localhost-first would collect a `Disallow: /` target with `is-crawlable` live and fail SEO at 0.69 (the C1 symptom): a less faithful rehearsal. Face-first reproduces the real preview's config and differs only by the known R50 artefact (my run: 4 × LCP, nothing else). No realistic sign-off target is affected. The docs need one clause (N3). |
| 5 | `bypassWarning` is how the pixel harness, counter and js-size "use the face helper" | **Accept.** The warning is their only face-dependent behaviour. |
| 6 | `tsx/cjs/api` rather than `tsImport` | **Accept.** Verified on Node 20.20.2, 24.14.1 and 25.8.2 (concern 3). |
| 7 | `lighthouserc.local.json`'s `_comment` corrected too | **Accept.** It carried the same "assert only" error. |
| 8 | `e4ee8ed` came out of the proof session; no second build or gate | **Accept.** This re-review built and gated at `e4ee8ed`: green, with figures identical. |
| 9 | Pixel proof at all three widths | **Accept.** Needed to exercise the 1440 clip. |
| 10 | The gate ran with a throw-away `REVALIDATE_SECRET` | **Accept.** I did the same: 216 passed, none skipped. |
| 11 | Some tests pass on the existing code (M4, width padding); M5 has no unit test | **Accept.** They fill coverage gaps, RED is shown by mutation, and the brief asked for no M5 test. |
| 12 | `parseRoutesArg(['--routes'])` → `[]` (was `null`) | **Accept.** `parseRoutesArg` is a W94 addition, not the frozen Produces, and the CLI rejects the case with exit 2. |

| Concern | Verdict |
| --- | --- |
| Lighthouse's out-of-page fetches carry no `extraHeaders` | **Verified and bounded.** In the Lighthouse window, 22 of 184 requests lacked the header: 8 robots.txt fetches and 14 1x logo candidates, all outside the audited page's network log. Against the protected stand-in, the protected responses (401) affected no asserted score: `robots-txt` notApplicable, `is-crawlable` skipped, SEO 1, best-practices 1, and all four image audits 1. One residual depends on the real Vercel answer to a header-less fetch — parked for the first real run. |
| W137's text still says `--extra-headers` | **Confirmed — amend it.** The frozen T15 plan (`docs/superpowers/handoff-2026-09-25/wp2-planning/wp2b/task-15.md:220`, `:283`, `:927`) also spells `--extra-headers`; the T15 brief must override it. |
| Node 22 not exercised | **Resolved by bracketing.** No Node 22 is installed here (nvm has v20.20.2 and v24.14.1). Under both, and under 25.8.2, these behave identically: gate.sh's two `node -e` lines (3 targets, blank and quoted secrets), a replica of `js-size`'s `gateHelpers()`, and the pixel skip paths, which lazy-import `src/lib/seo/routes`. Vercel never loads `tsx/cjs/api`: `npm run verify` imports `js-size.mjs`, but no test reaches `gateHelpers()` (the CLI spawns exit 2 before it), and a plain `npm run js-size` never loads tsx. The gate tooling is already documented as outside the Vercel build, so nothing needs adding. |
| A local preview rehearsal fails on LCP, not SEO | **Confirmed and acceptable** (deviation 4). My stand-in gate ended exactly so. The docs don't say it (N3). |

## New findings (Critical / Important / Minor)

**Critical:** none. **Important:** none.

### Minor

**N1. A preview gate run leaves the bypass secret, verbatim, in the git-ignored gate outputs, and no doc says so.**
- **Where it lands:**
  - Lighthouse copies its settings into the LHR as `configSettings` (`node_modules/lighthouse/core/runner.js:112`), `extraHeaders` included, with no redaction.
  - lhci writes each LHR as json and html into `.lighthouseci/`.
  - `gate.sh:83` copies them into `lighthouse-report/`.
  - `js-size --routes` writes to `.lighthouseci-extra/`.
  - Playwright's `trace: 'retain-on-failure'` and the html reporter keep a failing test's request headers in `test-results/` and `playwright-report/`.
- **Confirmed:** after the stand-in gate, **16/17 files in `.lighthouseci/` and 16 files in `lighthouse-report/`** (8 `.report.json` + 8 `.report.html`) contain the throw-away value.
- **Why it matters:** R48 keeps `lighthouse-report/` precisely so people read — and forward — the reports after a failing budget. W137 and the DEPLOYMENT row ("never in this repo") cover only the third-party path. All four directories are git-ignored, so nothing reaches git.
- **Fix:**
  - One sentence in DEPLOYMENT (the `VERCEL_AUTOMATION_BYPASS_SECRET` row) or ARCHITECTURE item 5: "a preview run's `lighthouse-report/`, `.lighthouseci*/`, `playwright-report/` and `test-results/` contain the secret; never attach or upload them; regenerate the secret if one leaves the machine."
  - Optionally, a `node -e` step after `lhci upload` that replaces the secret's value in those files. `assert` reads no headers.

**N2. The W138 clip's scale assumption is unchecked.**
- **How it works now:** `scripts/pixel-compare.ts:337-355` multiplies Playwright's own full-page height (7,830, from `body.scrollHeight`) by the computed zoom. That is right only while Chromium reports `body.scrollHeight` unzoomed and `html.scrollHeight` already zoomed (5,872) — the same quirk that makes the canvas 1920 wide.
- **Coverage:** the unit test pins the arithmetic, not that assumption.
- **Failure mode:** suppose a Playwright/Chromium upgrade reports the metrics zoomed. Playwright's canvas then becomes 1440×5872, and I4 disappears by itself. But the clip still multiplies by 0.75, so the design capture is silently cut to 4,404 px. That puts in the ledger exactly the non-like-for-like number W138 exists to stop, and nothing fails.
- **Fix** (cheap, no Produces change), either:
  - derive the scale from the width Playwright's canvas uses: `viewport / max(body/html scroll/offset/client widths)`, i.e. 1440/1920 = 0.75 today and 1 when the canvas is already zoomed; or
  - after capture, require `designPng.width === width && clip.height >= html.scrollHeight`, else exit 2 ("W138 clip assumption broken — Playwright upgrade?").

**N3. The documented preview-face rehearsal always ends red, and only a code comment says so.**
- **The recipe:** ARCHITECTURE item 1 (`:251`) says to build with `VERCEL_ENV=preview` and run the gate with `NEXT_PUBLIC_SITE_FACE=preview`. README `:50` and OPERATING `:64` say a localhost run uses `lighthouserc.local.json` (LCP a warning).
- **What actually happens:** with the preview face on localhost, `lighthouseConfigFor` picks `lighthouserc.preview.json` (deviation 4), where LCP is an error. So the rehearsal always stops at `assert` on the R50 artefact, before js-size and `gate: OK`. In my stand-in gate that was 4 × LCP at 2,855–2,858 ms, exit 1.
- **Only `face.ts:51`** says this is expected.
- **Fix:** one clause at ARCHITECTURE `:251`, optionally also README `:50` and OPERATING `:64`: "(a localhost run with the preview face collects and asserts with the preview config, so LCP is an error and the run ends red on the R50 artefact — expected; read the SEO/robots results, not the exit code)."

## Gate run results

One heavy job at a time, all at HEAD `e4ee8ed`, clean tree before and after.

| Run | Result |
| --- | --- |
| Low gate: `npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1` | Exit 0 in 62 s. Clean, and **105 files / 611 tests** passed. |
| Build: `NEXT_BUILD_CPUS=2 NODE_OPTIONS=--max-old-space-size=4096 npm run build` | Exit 0 (warm Turbopack cache: compile 600 ms, TypeScript 1,233 ms). `cpus: 2` and `serverActions`; 13/13 pages on 2 workers; `○ /robots.txt`; no CLAUDE.md block. |
| `REVALIDATE_SECRET=<throw-away> E2E_BASE_URL=http://localhost:3000 npm run gate` | **Exit 0, `gate: OK`** in 125 s. Details in the list below. |
| Stand-in gate (§ Preview stand-in proof) | Exit 1 by design (LCP ×4 only). SEO 1 and `skipAudits: ["is-crawlable"]` in 8/8 LHRs. |

Details of the local gate run:
- `gate: lighthouse config lighthouserc.local.json`; no bypass warning.
- Playwright **216 passed** (26.7 s), 0 skipped. The robots test passed in both projects (production face).
- `gate-routes: detail rows skipped (door not configured)` appeared on stderr.
- The assert gave 4 LCP warnings (2,855–2,856 ms) and nothing else.
- The 8 LHRs show `skipAudits: null`, `extraHeaders: null`, and SEO, `is-crawlable`, `robots-txt`, best-practices and accessibility all 1, with performance 0.96.

**js-size** — W136 method: Lighthouse `resource-summary:script:size`, transfer bytes on the named host, worst of 2 runs. These are local figures, so diagnostic; the preview figure binds.

| Run | Route | Script B | Headroom | LCP ms | Perf |
| --- | --- | ---: | ---: | ---: | ---: |
| gate (`localhost:3000`) | `/` | 177,782 | 27,018 | 2,856 | 0.96 |
| gate | `/en` | 177,782 | 27,018 | 2,856 | 0.96 |
| gate | `/en/hire-workers` | 177,782 | 27,018 | 2,855 | 0.96 |
| gate | `/isci-talebi` | 177,782 | 27,018 | 2,856 | 0.96 |
| `npm run js-size -- --routes '/tesekkurler?form=hire'` (space spelling, `lighthouserc.local.json`, 25 s) | `/tesekkurler?form=hire` | 179,927 | 24,873 | 2,856 | 0.96 |
| the same through the protected stand-in (`lighthouserc.preview.json`, header, 25 s) | `/tesekkurler?form=hire` | 179,927 | 24,873 | 2,857 | 0.96 |

All of these equal the task review's and the implementer's figures; the fix round changed no client JS.

**Pixel `hire` (TR)** — `VERCEL_AUTOMATION_BYPASS_SECRET=test-secret npm run pixel -- --page=hire --base=http://127.0.0.1:3200`, exit 0 in 15 s:

| Width | This re-review | Implementer | Task review (pre-fix) | Design PNG | Built PNG |
| --- | --- | --- | --- | --- | --- |
| 390 | **82.14 %** | 82.14 % | 82.43 % | 390×10001 | 390×971 |
| 900 | **84.04 %** | 84.04 % | 84.75 % | 900×12620 | 900×951 |
| 1440 | **85.03 %** | 85.03 % | 91.66 % (1920×7804 canvas) | **1440×5873** | 1440×900 |

The built side is still the Task 3 spike, so these numbers exercise the mechanics only.

## Parked for the WP2a final review

- **W137 amendment** (controller): `--settings.extraHeaders=<JSON>`, passed only when non-empty. The T15 handoff plan's `--extra-headers` (`task-15.md:220`, `:283`, `:927`) must be overridden in the T15 brief.
- **First real preview run** (controller):
  - **Vercel's answer to Lighthouse's header-less `robots.txt` fetch.** A 401 is expected; it gives `robots-txt` notApplicable, as in Run B. If Vercel instead redirects it to an HTML login page answering 200, `robots-txt` would parse HTML and fail SEO. The remedy then is `"skipAudits": ["is-crawlable", "robots-txt"]` in `lighthouserc.preview.json`, or Vercel's `x-vercel-set-bypass-cookie`.
  - **GTM/Turnstile CORS and header travel** — the task review's ⚠️4 watch item.
- **`.pixel/report.json` keeps stale rows** until each is overwritten:
  - `home-tr` (2026-09-27T22:45Z, degraded design);
  - `calc-tr` (22:47Z, 50.40 % against a 404).

  The harness merges keys, and no entry says whether it is like for like (W138). The ledger must take only rows generated at or after `e4ee8ed`, or the harness could stamp its entries.
- **Carry-overs from the task review**, unchanged by this round:
  - W93 detail rows reach Lighthouse only;
  - launch-profile order;
  - pixel % is dominated by white padding while heights differ (hire 1440: design 5,873 vs built 900 px);
  - local performance is at the edge (0.96 on all four routes).

  The production `*.vercel.app` alias caveat is now a comment (`face.ts:14-15`).
- **Worktree outputs this re-review left behind** (all git-ignored):
  - `.lighthouseci/` and `lighthouse-report/` hold the stand-in gate's runs (127.0.0.1:3200, with the throw-away `test-secret` inside — N1). A bare `npm run js-size` now prints those figures, and its method line names the host.
  - `.lighthouseci-extra/` holds the protected-stand-in `--routes` run.
  - `.pixel/hire-tr-*` and `report.json`'s `hire-tr` row come from my run through the stand-in (scores identical to the implementer's).
  - Scratch scripts and logs are in `scratchpad/rereview-task7/`.
- **Processes:** everything this re-review started (the `next start`, both stand-ins, the Playwright and Lighthouse runs) has exited. `ps -Ao pid,rss,command | grep -E 'vitest|next|playwright|chromium|lighthouse|lhci'` shows only the pre-existing Chrome Remote Desktop host, which is not mine. Ports 3000, 3200 and 3201 are free.
