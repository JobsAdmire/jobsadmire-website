#!/usr/bin/env bash
# One-time fetch of JobsAdmire's own raster brand files from the live site — the designs
# hot-link these (README "hot-linked logo"). The outputs are committed; this never runs in a
# build (the legacy site moves to legacy.jobsadmire.com at cutover). Re-run only to refresh.
set -euo pipefail
cd "$(dirname "$0")/.."
curl -fsSL --max-time 20 -o public/brand/logo.png  https://www.jobsadmire.com/logos/logo4.png
curl -fsSL --max-time 20 -o public/brand/iskur.png https://www.jobsadmire.com/logos/iskur.png
file public/brand/logo.png public/brand/iskur.png
# expected: logo.png 742 x 146 RGBA; iskur.png 320 x 320
