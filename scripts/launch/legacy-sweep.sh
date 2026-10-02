#!/usr/bin/env bash
# Gate A (spec §5) / WP7a: the Googlebot curl sweep. Every legacy URL in
# scripts/launch/legacy-urls.txt must answer in ONE hop — 308 with the exact Location
# (D21, next.config.ts redirects), 410 for a gone prefix (redirects/gone.json via src/proxy.ts)
# — and never 429 (the old site's measured failure mode: crawlers rate-limited). `keep` rows are
# live routes that must answer 200 and never redirect.
# Usage: E2E_BASE_URL=https://<preview-or-production> npm run sweep:legacy
#        VERCEL_AUTOMATION_BYPASS_SECRET=… for a protected preview (e2e/helpers/bypass.ts, W137).
# Prints a markdown table (paste into the WP2b ledger) and exits 1 on any miss.
set -euo pipefail
: "${E2E_BASE_URL:?set E2E_BASE_URL to the preview or production URL}"
BASE="${E2E_BASE_URL%/}"
UA="Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
LIST="$(dirname "$0")/legacy-urls.txt"
HDR=()
if [ -n "${VERCEL_AUTOMATION_BYPASS_SECRET:-}" ]; then
  HDR=(-H "x-vercel-protection-bypass: ${VERCEL_AUTOMATION_BYPASS_SECRET}")
fi

# status<TAB>redirect-path (pathname + fragment, host dropped — Next emits an absolute Location)
# `${HDR[@]+"${HDR[@]}"}`, never a bare "${HDR[@]}": macOS /bin/bash is 3.2, where an empty
# array under `set -u` aborts with "HDR[@]: unbound variable" (the production run has no secret).
# `</dev/null`: the loop below reads the list on stdin; curl must never inherit it. On a refused
# connection curl itself still prints `000<TAB>` through -w, so the fallback fires only when it
# printed nothing at all (otherwise the location column would read `000`, not `—`).
probe() {
  out="$(curl -sS -o /dev/null --max-redirs 0 -A "$UA" ${HDR[@]+"${HDR[@]}"} \
    -w '%{http_code}\t%{redirect_url}' "$BASE$1" </dev/null 2>/dev/null)" || true
  [ -n "$out" ] || out=$'000\t'
  printf '%s' "$out"
}
strip_host() { sed -E 's#^https?://[^/]+##'; }

fail=0
printf '| # | legacy URL | expected | got | location | second hop | verdict |\n'
printf '| --- | --- | --- | --- | --- | --- | --- |\n'
n=0
while IFS=$'\t' read -r path expect location; do
  [ -z "$path" ] && continue
  case "$path" in \#*) continue ;; esac
  n=$((n + 1))
  IFS=$'\t' read -r code redirect <<<"$(probe "$path")"
  loc="$(printf '%s' "$redirect" | strip_host)"
  hop2='—'
  verdict=ok
  # The FIRST miss is the verdict (a later check never overwrites it), so a 429 — the sweep's
  # headline failure mode — is never reported as "expected 308".
  miss() { if [ "$verdict" = ok ]; then verdict="FAIL: $1"; fi; }
  if [ "$code" = 429 ]; then miss '429 (crawler rate-limited)'; fi
  case "$expect" in
    308)
      if [ "$code" = 308 ]; then
        [ "$loc" = "$location" ] || miss "location ${loc:-—}"
        # The target must answer 200 itself — a 308 → 308 is a chain, a 308 → 404 a dead end.
        IFS=$'\t' read -r hop2 _ <<<"$(probe "$(printf '%s' "$loc" | sed -E 's/#.*$//')")"
        [ "$hop2" = 200 ] || miss "second hop $hop2"
      else
        miss "expected 308, got $code"
      fi
      ;;
    410) [ "$code" = 410 ] || miss "expected 410, got $code" ;;
    keep) [ "$code" = 200 ] || miss "expected 200, got $code" ;;
    *) miss "unknown expectation $expect" ;;
  esac
  case "$verdict" in FAIL*) fail=$((fail + 1)) ;; esac
  printf '| %s | `%s` | %s%s | %s | %s | %s | %s |\n' "$n" "$path" "$expect" "${location:+ → $location}" "$code" "${loc:-—}" "$hop2" "$verdict"
done <"$LIST"
echo
if [ "$fail" -gt 0 ]; then
  echo "sweep:legacy — $fail row(s) failed against $BASE" >&2
  exit 1
fi
echo "sweep:legacy — all rows single-hop against $BASE (Googlebot UA, no 429)"
