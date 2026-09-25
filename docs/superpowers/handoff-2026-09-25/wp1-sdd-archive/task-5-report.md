# Task 5 report: The content contract (Zod) + golden fixture + hash pin

## What I implemented

- `contract/website-bundle.v1.ts` — the Zod schema (`BundleSchema`, `NavItemSchema`, `SettingsSchema`,
  `PageSeoSchema`, `RedirectSchema`, `LocaleSchema`), `CONTRACT_VERSION = '1.0'`, and the `Bundle`/`NavItem`/
  `Settings` type exports. Copied verbatim from the brief (byte-for-byte match confirmed against the brief's
  code block) and left untouched by `prettier --write` (it was already Prettier-clean).
- `contract/website-bundle.v1.fixture.json` — hand-built per controller ruling R11: `nav` and `settings`
  copied verbatim from `src/content/local/bundle.tr.json`; `strings` trimmed to the 20 ids (the six
  deliberately-empty TR ids `hire.141`, `calc.041`, `calc.154`, `calc.157`, `calc.367`, `jt.107`, plus
  `home.001`–`home.012`, `home.017`, `home.018`); `locale: "tr"`; `generatedAt` the fixed sentinel
  `2026-09-18T00:00:00.000Z`; `contractVersion: "1.0"`; one `pages.home` entry
  (`titleId: home.017`, `descriptionId: home.018`, `ogImage: null`, `canonical: null`, `robots: "index"`,
  `jsonLd: ["organization","website","faq"]`); `collections: {}`; one redirect
  (`{"from":"/contact-us","to":"/en/contact","status":308}`).
- `contract/CONTRACT.md` — the brief's text verbatim plus the R12-mandated sentence appended at the end:
  "The hash is computed over the Prettier-formatted file; Operations must prettier-ignore its vendored copy
  so the bytes stay identical."
- `contract/contract.test.ts` — the brief's three tests verbatim (hash pin, golden fixture validates, both
  local bundles validate), with `CONTRACT_FILE_SHA256` pinned to the real SHA obtained from the RED run.
- `vitest.config.ts` — `test.include` replaced with the brief's exact four-entry list: `src/**/*.test.{ts,tsx}`,
  `contract/**/*.test.ts`, `scripts/**/*.test.ts`, `redirects/**/*.test.ts`.
- `npm install zod@^3` — resolved to `zod@3.25.76`, added to `dependencies`. Lockfile committed.

Verified before writing the fixture: I read `src/content/local/bundle.tr.json` directly and confirmed the
nav entry with `labelId: "home.011"` has `href: "/verify"` (the prior commit `b033cb8` on this branch already
fixed the nav to use `home.011` instead of an invented `sys.nav.verify` id — consistent with R11's premise),
and confirmed all 20 required string ids exist with the expected values (the six empty-TR ids are indeed `""`).

## Sequence followed (per R12)

1. Wrote schema + test with placeholder hash.
2. `npm run format:write` (scoped run touched the whole repo but only `contract/website-bundle.v1.fixture.json`
   was modified — Prettier collapsed the short `visibleOn`/`jsonLd` arrays onto single lines, as anticipated).
3. RED run: `npm run test -- contract` → hash mismatch, real SHA in the failure message.
4. Copied the SHA into `CONTRACT_FILE_SHA256`.
5. GREEN run: `npm run test -- contract` → 3 passed.
6. `npm run verify` → typecheck/lint/format/test all green (32/32 tests, 6 files); `format` (a check, not a
   write) confirmed no further reformatting occurred, so the pinned hash stays valid.

## RED output (with the real SHA)

```
 ❯ contract/contract.test.ts (3 tests | 1 failed) 13ms
     × schema file matches the pinned hash 4ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  contract/contract.test.ts > content contract > schema file matches the pinned hash
AssertionError: expected 'b407d92f39ab560e4c256ec2e7d1cd5d36f61…' to be '<fill after first run>' // Object.is equality

Expected: "<fill after first run>"
Received: "b407d92f39ab560e4c256ec2e7d1cd5d36f6166281b9d1dfdd178ede01319dcf"

 Test Files  1 failed (1)
      Tests  1 failed | 2 passed (3)
```

(Independently recomputed with `node -e "createHash('sha256').update(readFileSync('contract/website-bundle.v1.ts')).digest('hex')"` — same value, 64 hex chars.)

## GREEN output

```
 RUN  v4.1.11 /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp1

 Test Files  1 passed (1)
      Tests  3 passed (3)
```

## Pinned SHA-256

`b407d92f39ab560e4c256ec2e7d1cd5d36f6166281b9d1dfdd178ede01319dcf`

## `npm run verify` summary

```
> tsc --noEmit                     (clean)
> eslint .                         (clean)
> prettier --check .               All matched files use Prettier code style!
> vitest run
 Test Files  6 passed (6)
      Tests  32 passed (32)
```

Output was pristine apart from the pre-existing Vitest `configLoader: 'native'` warning
(`vitest.config.ts:1:1` CommonJS-vs-ESM notice, unrelated to this task, present before this change). No
Node EBADENGINE noise appeared in `verify` (that warning only fires on `npm install`, which was run once
for the `zod` install and is reported above, not a defect).

## The fixture's 20 string ids

`hire.141`, `calc.041`, `calc.154`, `calc.157`, `calc.367`, `jt.107` (all `""`), `home.001`, `home.002`,
`home.003`, `home.004`, `home.005`, `home.006`, `home.007`, `home.008`, `home.009`, `home.010`, `home.011`,
`home.012`, `home.017`, `home.018`.

## Files changed

- `contract/website-bundle.v1.ts` (new)
- `contract/website-bundle.v1.fixture.json` (new)
- `contract/CONTRACT.md` (new)
- `contract/contract.test.ts` (new)
- `vitest.config.ts` (modified — `test.include`)
- `package.json` (modified — added `zod@^3.25.76` dependency)
- `package-lock.json` (modified — lockfile for zod)

## Self-review findings

- **Completeness:** schema verbatim-matched against the brief's code block programmatically (exact string
  match after stripping trailing newline). Fixture matches R11 exactly — verified string ids, nav (all 11
  `desktopNav` items incl. `home.011` → `/verify`), settings copied from the real `bundle.tr.json`, one page
  entry, empty collections, one redirect. `CONTRACT.md` carries the brief's text plus the exact R12 sentence.
  Test file matches the brief verbatim except for the pinned SHA (diffed programmatically — exit 0).
  `vitest.config.ts` include list matches the brief's four entries exactly.
- **Quality:** no extra files created in `contract/` (`ls contract/` shows exactly the four required files).
  No stray edits outside the task's scope — `git diff --stat` before commit showed only `package.json`,
  `package-lock.json`, `vitest.config.ts` plus the four new `contract/` files.
- **Discipline:** did not run `next build` or Playwright. Did not push — `git log` shows the new commit
  `76d64dd` sitting locally on `wp1/foundation`, one commit ahead of what was pushed before this task. Used
  `git add -A` only after reviewing `git status`/`git diff --stat` to confirm nothing unexpected was staged
  (no stray temp files, no `.env`, etc.).
- **Testing:** all three tests in `contract/contract.test.ts` are real (hash comparison against a computed
  SHA-256, `BundleSchema.parse` against the fixture, `BundleSchema.parse` against both real generated
  bundles — not stubbed/skipped). RED run captured the real failure with the real SHA before pinning, as
  required. Full `verify` suite (32 tests, 6 files) passes with no unrelated regressions.

## Concerns

None. The task brief's schema needed no adjustment to validate the real bundles — `npm run test -- contract`
confirms both `bundle.tr.json` and `bundle.en.json` (3,505 ids each) validate against `BundleSchema` as-is.
