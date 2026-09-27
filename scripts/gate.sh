#!/usr/bin/env bash
# Quality gate — runs OUTSIDE the Vercel build (no Chrome there): Playwright + axe + Lighthouse
# against a URL. D27: once per work package, against a preview (or a local production build).
# Usage: E2E_BASE_URL=https://<preview-or-local> npm run gate
#        E2E_BASE_URL=… npm run gate:launch        (= bash scripts/gate.sh --profile=launch)
#
# Export REVALIDATE_SECRET (the same value the server under test was started with) for full
# ops coverage: without it the two token-dependent cases in e2e/ops.spec.ts skip themselves (R43).
# W91: export VERCEL_AUTOMATION_BYPASS_SECRET to reach a Vercel-protected preview — Playwright
# (playwright.config.ts) and the `lhci collect` calls below both send it as
# x-vercel-protection-bypass; scripts/pixel-compare.ts sends it too, on the built-route requests.
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
if [ -z "${VERCEL_AUTOMATION_BYPASS_SECRET:-}" ]; then
  echo "gate: warning — VERCEL_AUTOMATION_BYPASS_SECRET unset; a protected preview will refuse Playwright/Lighthouse (W91)"
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

# W91: previews sit behind Vercel Deployment Protection — every `lhci collect` sends the bypass
# header (empty when the secret is unset, same as a run against localhost/production).
LH_EXTRA_HEADERS="{\"x-vercel-protection-bypass\":\"${VERCEL_AUTOMATION_BYPASS_SECRET:-}\"}"

# `read` line by line, never an unquoted `for path in $LH_PATHS`: a `?` in a path is a glob
# character to the shell.
while IFS= read -r path; do
  [ -z "$path" ] && continue
  # --additive: `lhci collect` wipes .lighthouseci on every run otherwise, and `lhci assert`
  # would then only ever see the last path of the loop. The mobile emulation comes from
  # lighthouserc.json (`formFactor: mobile`, Lighthouse's own default): there is no "mobile"
  # preset — `--preset` only accepts perf|experimental|desktop and rejects anything else.
  echo "gate: lighthouse ${path}"
  npx lhci collect --additive --url="${E2E_BASE_URL}${path}" --extra-headers="$LH_EXTRA_HEADERS" >/dev/null
done <<< "$LH_PATHS"
# Before assert, so the reports survive a failing budget — that is when they are read (R48).
npx lhci upload --target=filesystem --outputDir=./lighthouse-report >/dev/null

# R50: against localhost, Lantern charges the whole sub-60 ms waterfall to the LCP graph and
# reports ~2.7 s whatever the page — so LCP is a warning there and an error everywhere else.
# W91: a Vercel preview's robots.txt is `Disallow: /` (face-aware, e2e/helpers/face.ts), which
# would fail Lighthouse's is-crawlable audit and, with it, the SEO category score — asserted with
# lighthouserc.preview.json (= lighthouserc.json minus that one assertion) instead. The binding
# run for sign-off is still the preview run; only `assert` changes here, never collect/upload.
if [[ "$E2E_BASE_URL" =~ ^https?://(localhost|127\.0\.0\.1)(:|/|$) ]]; then
  LHCI_CONFIG=lighthouserc.local.json
elif [[ "$E2E_BASE_URL" =~ \.vercel\.app(:|/|$) ]]; then
  LHCI_CONFIG=lighthouserc.preview.json
else
  LHCI_CONFIG=lighthouserc.json
fi
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
