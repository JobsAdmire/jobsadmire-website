# WP2 pixel harness — the two-iteration cap (D27, W15)

`npm run pixel -- --page=home|hire|calc|blog-article [--locale=tr|en] [--base=<url>]` renders the
design package's own page and the built route at 390 / 900 / 1440, full page, reduced motion,
and writes `.pixel/<page>-<locale>-<w>.png` (the pixelmatch diff), `…-design.png`,
`…-built.png` and a `% match` per width into `.pixel/report.json`. It needs network (the
design runtime loads React/Babel from unpkg) and is never part of the gate or CI. `--base` may
point at a Vercel-protected preview (W137): the harness adds `x-vercel-protection-bypass` (from
`VERCEL_AUTOMATION_BYPASS_SECRET`, only when it is non-blank) to the built origin's requests
alone. The design page loads in a browser context of its own with no extra header, so its web
fonts and map data load and no third party it calls ever sees the secret.

Like for like, never a broken page (W138): the design capture is clipped to the zoomed content
box, so at 1440 a 1440-wide design canvas is compared with the 1440-wide build (unclipped, the
design's `html { zoom: 0.75 }` makes Playwright's full-page shot 1920 wide and 43 % blank). A
height check (W159) cross-checks that clip against the document's own scroll height × zoom —
never an element's client box, which under zoom reads only the viewport — and exits 2 on a
mismatch of more than 1 px. Both pages must answer 2xx, or the harness exits 2 naming the URL and
scores nothing; a page still in
`UNBUILT_PATHNAMES`, or a blog article with no body in the locale, is skipped with a message
(exit 0, no score).

## The rule (a ledger rule, not code)

1. A page task runs the harness **at most twice**: once when the port is first complete, once
   after the fixes that run prompted. The second run's numbers are the ones the ledger records.
   The cap counts from the first **like-for-like** run (W138): captures from before the Task 7
   fix round (a design page in a fallback font without its map data, a 1440 design canvas 43 %
   blank) are not like for like, never reach the ledger and use up no iteration.
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
