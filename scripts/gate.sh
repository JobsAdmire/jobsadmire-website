#!/usr/bin/env bash
# Quality gate — runs OUTSIDE the Vercel build (no Chrome there): Playwright + axe + Lighthouse
# against a URL. D27: once per work package, against a preview (or a local production build).
# Usage: E2E_BASE_URL=https://<preview-or-local> npm run gate
#        E2E_BASE_URL=… npm run gate:launch        (= bash scripts/gate.sh --profile=launch)
#
# Export REVALIDATE_SECRET (the same value the server under test was started with) for full
# ops coverage: without it the two token-dependent cases in e2e/ops.spec.ts skip themselves (R43).
# W137: export VERCEL_AUTOMATION_BYPASS_SECRET to reach a Vercel-protected preview. The header is
# built in one place (e2e/helpers/bypass.ts) and only when the secret is non-blank; Playwright
# (playwright.config.ts) and the `lhci collect` calls below send it as x-vercel-protection-bypass.
# Bash 3.2 (macOS /bin/bash) is enough: no mapfile, no associative arrays.
set -euo pipefail

PROFILE=default
for arg in "$@"; do
  case "$arg" in
    --profile=launch) PROFILE=launch ;;
    --profile=default) PROFILE=default ;;
    *)
      echo "gate: unknown argument '$arg' (accepted: --profile=launch)" >&2
      exit 2
      ;;
  esac
done

: "${E2E_BASE_URL:?set E2E_BASE_URL to the preview or local URL}"
# A trailing slash would double up in every "${E2E_BASE_URL}${path}" below.
E2E_BASE_URL="${E2E_BASE_URL%/}"
export E2E_BASE_URL
echo "gate → $E2E_BASE_URL (profile: $PROFILE)"
if [ -z "${REVALIDATE_SECRET:-}" ]; then
  echo "gate: warning — REVALIDATE_SECRET unset; the two token-dependent ops cases will skip (R43)"
fi

# W135/W137: the Lighthouse config for this target, chosen BEFORE collecting. `skipAudits`
# (lighthouserc.preview.json) is a collect-time setting — `lhci assert` only reads the stored
# runs — so the file goes to every `lhci collect` as well as to `assert`. The choice is
# lighthouseConfigFor in e2e/helpers/face.ts, the one site-face helper (loaded through tsx):
#   preview face (*.vercel.app, staging.jobsadmire.com, NEXT_PUBLIC_SITE_FACE ≠ production) →
#     lighthouserc.preview.json: its robots.txt is `Disallow: /`, which fails is-crawlable;
#   localhost → lighthouserc.local.json: identical to lighthouserc.json since W145 retired R50's
#     localhost LCP waiver (it excused Lantern's simulation, which no config uses any more);
#   anything else (production, after WP7a) → lighthouserc.json.
# W145: all three measure under DevTools throttling (`throttlingMethod: devtools`), three runs per
# path, and assert the median run — LCP ≤ 2,500 ms and performance ≥ 0.95 are errors everywhere.
LHCI_CONFIG="$(node -e 'const { lighthouseConfigFor } = require("tsx/cjs/api").require("./e2e/helpers/face.ts", __filename); process.stdout.write(lighthouseConfigFor(process.env.E2E_BASE_URL));')"
# W137: the bypass header as JSON (JSON.stringify, so any secret stays valid JSON), only when the
# secret is non-blank — an unset secret sends no header at all. `lhci collect` hands Lighthouse
# nothing but its `settings`, so the header goes in as `--settings.extraHeaders=<JSON>`; lhci has
# no extra-headers option of its own and silently drops one (it never reached Lighthouse before
# the Task 7 fix round — proven against a local preview stand-in).
LH_EXTRA_HEADERS="$(node -e 'const { protectionBypassHeaders } = require("tsx/cjs/api").require("./e2e/helpers/bypass.ts", __filename); const h = protectionBypassHeaders(); if (Object.keys(h).length) process.stdout.write(JSON.stringify(h));')"
echo "gate: lighthouse config $LHCI_CONFIG"
if [ -z "$LH_EXTRA_HEADERS" ] && [ "$LHCI_CONFIG" = lighthouserc.preview.json ]; then
  echo "gate: warning — VERCEL_AUTOMATION_BYPASS_SECRET unset; a protected preview will refuse Playwright/Lighthouse (W137)"
fi

npx playwright test

# W21: ONE route list. Lighthouse audits the indexable routes only (nobody lands on the noindex
# conversion page cold); e2e/routes.ts is the source and scripts/gate-routes.mjs prints it —
# there is no second copy of the paths to keep in sync any more.
LH_PATHS="$(node scripts/gate-routes.mjs)"
if [ -z "$LH_PATHS" ]; then
  echo "gate: scripts/gate-routes.mjs printed no indexable routes" >&2
  exit 1
fi
rm -rf .lighthouseci

# `read` line by line, never an unquoted `for path in $LH_PATHS`: a `?` in a path is a glob
# character to the shell.
while IFS= read -r path; do
  [ -z "$path" ] && continue
  # --additive: `lhci collect` wipes .lighthouseci on every run otherwise, and `lhci assert`
  # would then only ever see the last path of the loop. The mobile emulation comes from the
  # config (`formFactor: mobile` in all three files, Lighthouse's own default): there is no
  # "mobile" preset — `--preset` only accepts perf|experimental|desktop and rejects the rest.
  # So do the three DevTools-throttled runs per path (W145): each takes the real throttled time.
  # --config: the file chosen above (W137); the bypass header only when there is one.
  echo "gate: lighthouse ${path}"
  npx lhci collect --additive --config="$LHCI_CONFIG" \
    ${LH_EXTRA_HEADERS:+--settings.extraHeaders="$LH_EXTRA_HEADERS"} \
    --url="${E2E_BASE_URL}${path}" >/dev/null
done <<< "$LH_PATHS"
# Before assert, so the reports survive a failing budget — that is when they are read (R48).
npx lhci upload --target=filesystem --outputDir=./lighthouse-report >/dev/null

# The same file the runs were collected with (W137), asserting the median of the three runs
# (W145). The binding run for sign-off is the one against the Vercel preview; a localhost run is
# fast feedback.
echo "gate: asserting with $LHCI_CONFIG"
npx lhci assert --config="$LHCI_CONFIG"

# W13 (amended): the per-route script sizes the ledger records. Informational — the assert
# above is what fails a route over 204,800 B; this flags the 194,560 B lazy-loading line.
node scripts/js-size.mjs || true

if [ "$PROFILE" = launch ]; then
  # W20: no route may still be listed as unbuilt (the sitemap skips them; Gate A wants all).
  echo "gate: launch — every pathnames route is built (W20)"
  npx vitest run --config vitest.launch.config.mts
  # D26/W55: placeholder counter + LCP-slot rule over every gate route; the table is the
  # content-readiness card and lands in lighthouse-report/content-readiness.json.
  echo "gate: launch — content readiness (D26)"
  npx tsx scripts/placeholder-count.ts
fi
echo "gate: OK"
