#!/usr/bin/env bash
# Quality gate — runs OUTSIDE the Vercel build (no Chrome there): Playwright + axe + Lighthouse
# against a URL. D27: once per work package, against a preview (or a local production build).
# Usage: E2E_BASE_URL=https://<preview-or-local> npm run gate
#
# Export REVALIDATE_SECRET (the same value the server under test was started with) for full
# ops coverage: without it the two token-dependent cases in e2e/ops.spec.ts skip themselves (R43).
set -euo pipefail
: "${E2E_BASE_URL:?set E2E_BASE_URL to the preview or local URL}"
# A trailing slash would double up in every "${E2E_BASE_URL}${path}" below.
E2E_BASE_URL="${E2E_BASE_URL%/}"
export E2E_BASE_URL
echo "gate → $E2E_BASE_URL"
if [ -z "${REVALIDATE_SECRET:-}" ]; then
  echo "gate: warning — REVALIDATE_SECRET unset; the two token-dependent ops cases will skip (R43)"
fi

npx playwright test

# Lighthouse runs the indexable paths only; this list mirrors e2e/routes.ts minus the noindex
# conversion page (nobody lands on /tesekkurler cold). Keep the two in sync by hand until WP2
# exports the route list as JSON.
rm -rf .lighthouseci
for path in / /en /isci-talebi /en/hire-workers; do
  # --additive: `lhci collect` wipes .lighthouseci on every run otherwise, and `lhci assert`
  # would then only ever see the last path of the loop. The mobile emulation comes from
  # lighthouserc.json (`formFactor: mobile`, Lighthouse's own default): there is no "mobile"
  # preset — `--preset` only accepts perf|experimental|desktop and rejects anything else.
  npx lhci collect --additive --url="${E2E_BASE_URL}${path}" >/dev/null
done
# Before assert, so the reports survive a failing budget — that is when they are read (R48).
npx lhci upload --target=filesystem --outputDir=./lighthouse-report >/dev/null

# R50: against localhost, Lantern charges the whole sub-60 ms waterfall to the LCP graph and
# reports ~2.7 s whatever the page — so LCP is a warning there and an error everywhere else.
# The binding run is the one against the preview URL. Only `assert` changes; collect/upload do not.
if [[ "$E2E_BASE_URL" =~ ^https?://(localhost|127\.0\.0\.1)(:|/|$) ]]; then
  LHCI_CONFIG=lighthouserc.local.json
else
  LHCI_CONFIG=lighthouserc.json
fi
echo "gate: asserting with $LHCI_CONFIG"
npx lhci assert --config="$LHCI_CONFIG"
echo "gate: OK"
