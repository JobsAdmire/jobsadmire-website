#!/usr/bin/env bash
# Quality gate — runs OUTSIDE the Vercel build (no Chrome there): Playwright + axe + Lighthouse
# against a URL. Usage: E2E_BASE_URL=https://<preview> npm run gate
# Filled in during WP1 (Lighthouse budgets, axe sweep, placeholder counter for --profile=launch).
set -euo pipefail
: "${E2E_BASE_URL:?set E2E_BASE_URL to the preview or local URL}"
echo "gate → $E2E_BASE_URL"
npx playwright test
