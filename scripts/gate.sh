#!/usr/bin/env bash
# Quality gate — runs OUTSIDE the Vercel build (no Chrome there): Playwright + axe + Lighthouse
# against a URL. D27: once per work package, against a preview (or a local production build).
# Usage: E2E_BASE_URL=https://<preview-or-local> npm run gate
#
# Export REVALIDATE_SECRET (the same value the server under test was started with) for full
# ops coverage: without it the two token-dependent cases in e2e/ops.spec.ts skip themselves (R43).
set -euo pipefail
: "${E2E_BASE_URL:?set E2E_BASE_URL to the preview or local URL}"
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
npx lhci assert
echo "gate: OK"
