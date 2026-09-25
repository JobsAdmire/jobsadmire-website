#!/bin/bash
# PreToolUse hook (Read): refuse whole-file reads of the very large reference docs.
# Blocks only when no limit is given or the limit exceeds 400 lines. Exit 2 = block, stderr = message to Claude.
input="$(cat)"
file="$(printf '%s' "$input" | sed -n 's/.*"file_path"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' | head -1)"
limit="$(printf '%s' "$input" | sed -n 's/.*"limit"[[:space:]]*:[[:space:]]*\([0-9]*\).*/\1/p' | head -1)"
case "$file" in
  */docs/PRD.md|*/docs/GOTCHAS.md|*/docs/DEPLOYMENT.md|*/docs/ARCHITECTURE.md|*/docs/archive/*)
    if [ -z "$limit" ] || [ "$limit" -gt 400 ]; then
      echo "Blocked: $file is a very large reference doc. Locate the section first (grep -n '^##' or grep -n '<keyword>'), then Read it with offset+limit (<= 400 lines) or use sed -n 'START,ENDp'. Never load the whole file." >&2
      exit 2
    fi ;;
esac
exit 0
