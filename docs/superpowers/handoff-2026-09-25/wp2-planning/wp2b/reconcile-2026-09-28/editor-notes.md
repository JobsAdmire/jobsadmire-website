# Editor notes → candidate residual rulings (controller collects; W162+ decided after the rechecks)

## From T8 Available Workers (2026-09-28)
- `workers` catalog has no field for basket references or sector: refs fold into `message` behind `Profiles: `; sector typed into `message` (design prompt availworkers.145). Stats strip not rendered (no signed source). `id="pool"` sits on the empty-state section; the request form stays in the hero card `#pool-form` (differs from the literal brief). `CollectionSchemas` has no `pool` entry (accepted page-local). `FormShell` takes a single submit label.

## From T7 Contact (2026-09-28)
- (b) `OfficeCard` sets no text colour on its `<article>` → white-on-white inside a navy card; page wraps with `text-ink`; a `text-ink` in the block would remove the trap (foundation nit).
- (c) `FallbackPanel.WHATSAPP_FIELDS` omits `licence` and the callback day/slot → they reach the door but not the WhatsApp fallback message (foundation gap; decide: extend the allowlist in a WP2b foundation-touch cycle or accept).
- (d) `FaqBlock` ask card has no per-width visibility → shows on phones where the design hides it (accept or add a prop).
- (e) JS budget: `LazyIsland` loads on viewport only; if a contact route exceeds the lazy line, moving the enquiry form behind an interaction needs a ruling (Cycle 6 stops and reports).
- W113 applied (section test ids on inner divs because `Section` drops `data-testid`); W114 applied (`subject`/`city` input names).

## Controller observations while scanning (2026-09-28 evening)
- T6 (Sonnet): one W154 slip in `sys.seo.about.description` EN ("We recruit…") fixed by the controller → "It recruits…"; four single-file vitest lines lacked `--maxWorkers=1` (fixed). `sys.seo.about.title` keeps "Hakkımızda" (conventional page name; the voice test does not flag possessive nouns — recheck may confirm or rename to "JobsAdmire Hakkında").
- T9 (Sonnet): ten vitest lines lacked the memory-rule flags (fixed), two `npm run build` lines lacked the W126 caps (fixed). **Open for Recheck B:** the task still runs TWO builds — an interim `npm run build` + `next start -p 3100` in the page/e2e cycle's Step 2 (to make the e2e fail first) plus the proof build. W126 = ONE build per task; decide: drop the interim build (the e2e's red step is "the spec fails to compile/find the page" or is deferred to the proof cycle) or accept two builds for pages with an e2e spec. Check how T1/T2/T4/T5/T7/T8 handle the e2e red step and make all tasks consistent.
- General: every editor's Step 2 lines should be `NODE_OPTIONS=--max-old-space-size=4096 npx vitest run <files> --maxWorkers=1`; the scanner flags the misses.

## From T10 Verify (2026-09-28, Opus)
- Exports the module-private `visitorOf` from `src/forms/action.ts` (additive) so the per-file evidence upload action passes the door the same visitor → ruling needed: allow the additive export (foundation touch inside a page task) or move the upload action onto `createFormAction`.
- `uploadEvidence` has no Turnstile of its own (3 MiB cap + door content check + 7-day orphan purge only) → Operations follow-up like W110 (per-visitor throttle on the upload route).
- v1.1 register needs: Ops `WebsiteRepresentative` model + consent + stable `JA-` ids; `representatives` schema in `collections.ts`; `no-store` record route with `qrSvg` badge QR; May do / May never lists; `verified`/`not_found` outcomes (Phase B).
- `verify.025/026/104` carry the founder's name → name-less sys fallbacks until the founder row is published (WP-C rewrite or `{founder}` placeholder if the name differs).
- `fraud` catalog has no representative-id field → looked-up ID travels as typed text.
- `next/dynamic(…, { ssr: false })` only inside the `'use client'` LookupCard (allowed pattern; note for consistency across tasks).

## From T3 Cost Calculator (2026-09-28, Opus finish)
- `LazyStickyBar` rootMargin `'100000px 0px 200px 0px'` so the bar loads when a visitor jumps past its wrapper via an anchor link (pattern other pages with a lazy sticky bar should copy → candidate ruling).
- Accepted page-local: interaction trigger + binder module live in the page (LazyIsland loads on view only); FaqBlock side column above the list on phones; sticky bar hides < 901 px (design: ≤ 700); ImageSlot fills its own aspect box; Tabs render as pills; PrintButton isolates the card only when clicked. js-size projection ≈ 183,000 B TR / 180,000 B EN; Cycle 8 conditional lazy pass.

## From T15 Gate A prep (2026-09-28, Sonnet)
- Flags "W-T15-6": `docs/DEPLOYMENT.md`/`CLAUDE.md`/`docs/ARCHITECTURE.md` still describe a two-Vercel-project cutover (domain move to a never-created `jobsadmire-web-v2`), contradicted by the facts (all previews are `jobsadmirewebsite-*`; handoff §3.2/§5 say the domain move is "not the case now") → controller ruling W162+ and a docs correction before WP7a (out of T15's scope).
- The spec's hero-photo default is a licensed stock pack, not a gradient — never sourced → open owner item (photos).
- `docs/redirects.md` 517-URL disposition table is a larger placeholder than the 20-URL Gate A sweep T15 builds.
- Run-result placeholders (`<date>`, `<preview>`, figures) left for the implementer to fill from real runs.

## From T14 Forms e2e (2026-09-28, Sonnet; 10 cycles, 17 form instances)
- (1) `generate_lead` had NO caller anywhere in the foundation → T14 Cycle 1 adds it. **Recheck B2 must settle WHERE it fires (forms kernel success path vs each page) and that T1/T2/T3/T5/T7/T8/T10/T11/T13 do not also fire it (exactly one per submission).**
- (2) The draft's "26 test-class posts trip the form" is impossible (`recordVerified` runs only `if (!isTest)`); T14 substitutes a "Redis marker protocol" — **B2 must verify it never touches production Redis/data and needs no Operations code change (an Ops change = a deploy = its own task); if it does, park it as an Ops follow-up.**
- (3) Owner prerequisites: `staging.jobsadmire.com` alias + bypass secret (T14 Cycle 4 builds them — controller/owner step on Vercel) and the Turnstile site key + secret — the one hard prerequisite, blocking only Cycle 7 (manual real-lead run).
- (6) `docs/INTEGRATIONS.md` § Token threat model says "read, write, preview"; real classes are `write | test | previous-write` → fixed in T14 Cycle 9 (side-fix).
- (7) The careers rows were built from the T11 DRAFT → re-diff against `fixed/task-11.md` once it exists (B2).
- (8) `FallbackPanel.WHATSAPP_FIELDS` omits `licence` + callback `day`/`slot` (same as T7 note c).

## From T12 Blog (2026-09-28, Opus)
- **(a) OG images for template pages:** the OG route renders `sys.seo.<pageKey>.title` with NO arguments → a `{title}` template would print raw on the OG image. T12 keeps the article's `{title} | JobsAdmire` template at `sys.blog.article.metaTitle` and reuses the index's `/og/<locale>/blog.png`. **T11's draft `sys.seo.careersDetail.title` with `{title}` has the same problem → Recheck B2 must align T11 (same pattern as T12) — candidate ruling W16x "template pages reuse their index's OG image; metaTitle templates live under sys.<page>.*, never sys.seo.*".**
- (b) `EmptyStateCta` cannot link to the other locale's index → the TR empty state renders its `/en/blog` link as a sibling `next/link` (page-local).
- (c) The sidebar fallback copies the markup of `ScrollSpyToc`/`ShareRow`/`PrintButton` (pinned by a test) → any island change updates the fallback (maintenance note).
- (d) `blogarticle.140` ("almost done") unused: the string props have no zero-minutes form.
- Lazy pass: TOC/share/print = one `LazyIsland` with a DOM-identical server fallback; progress bar/back-to-top/sticky bar load on first scroll; newsletter band hidden, imports no form code.
