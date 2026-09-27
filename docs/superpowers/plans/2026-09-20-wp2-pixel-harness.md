# WP2 pixel harness — the two-iteration cap (D27, W15)

`npm run pixel -- --page=home|hire|calc|blog-article [--locale=tr|en] [--base=<url>]` renders the
design package's own page and the built route at 390 / 900 / 1440, full page, reduced motion,
and writes `.pixel/<page>-<locale>-<w>.png` (the pixelmatch diff), `…-design.png`,
`…-built.png` and a `% match` per width into `.pixel/report.json`. It needs network (the
design runtime loads React/Babel from unpkg) and is never part of the gate or CI. `--base` may
point at a Vercel-protected preview: the harness sends `x-vercel-protection-bypass` from
`VERCEL_AUTOMATION_BYPASS_SECRET` on the built-route requests (W91).

## The rule (a ledger rule, not code)

1. A page task runs the harness **at most twice**: once when the port is first complete, once
   after the fixes that run prompted. The second run's numbers are the ones the ledger records.
2. There is **no numeric pass mark**. The reviewer reads the three diff images and lists every
   visible delta as one of: (a) a named D20 accessibility delta (CTA face `blue-safe`, WhatsApp
   `success-text`, footer hours `white/55`, primary hover `bg-ink`, language hint as a bottom
   sheet, the `/tesekkurler` navigation), (b) a design delta ruled in WP2 (W3 form fields, W6
   empty states, W7 copy, W8 portal chooser, W10 breakpoint classes, W14 local assets in place of
   hot-linked ones, W17 per-page header CTAs), (c) inherent capture noise (rotating hero word,
   marquee position, fixed FAB/bottom bar in a full-page capture, height difference from hidden
   Phase A sections), or (d) **a defect** — fixed before the task is done.
3. After the second run, remaining (d) items go to the task's ledger row as "pixel deltas
   accepted" with a one-line reason each, and the page moves on. A third run needs a controller
   ruling.
4. Ledger row format: `pixel <page> <locale>: 390 → NN.NN %, 900 → NN.NN %, 1440 → NN.NN %;
run 2 of 2; deltas: (a) …; (b) …; (c) …; (d) accepted: …`.

The other ten pages are Fable side-by-side review (D27) and never run the harness.
