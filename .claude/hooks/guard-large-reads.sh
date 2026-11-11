#!/bin/bash
# PreToolUse hook (Read): keep one Read of a Markdown doc under MAX_BYTES.
# The reference docs here have lines of several thousand characters, so a line limit does not bound size:
# this guard measures the BYTES of the requested line range instead. It only looks at .md files inside the
# project folder. Exit 2 = block, and stderr is the message Claude sees.
MAX_BYTES=60000
input="$(cat)"
file="$(printf '%s' "$input" | sed -n 's/.*"file_path"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' | head -1)"
case "$file" in *.md) ;; *) exit 0 ;; esac
[ -n "$CLAUDE_PROJECT_DIR" ] && case "$file" in "$CLAUDE_PROJECT_DIR"/*) ;; *) exit 0 ;; esac
[ -f "$file" ] || exit 0
size="$(wc -c < "$file" | tr -d ' ')"
[ "$size" -le "$MAX_BYTES" ] && exit 0
offset="$(printf '%s' "$input" | sed -n 's/.*"offset"[[:space:]]*:[[:space:]]*\([0-9][0-9]*\).*/\1/p' | head -1)"
limit="$(printf '%s' "$input" | sed -n 's/.*"limit"[[:space:]]*:[[:space:]]*\([0-9][0-9]*\).*/\1/p' | head -1)"
start="${offset:-1}"; [ "$start" -lt 1 ] && start=1
count="${limit:-2000}"
end=$((start + count - 1))
bytes="$(sed -n "${start},${end}p" "$file" | wc -c | tr -d ' ')"
[ "$bytes" -le "$MAX_BYTES" ] && exit 0
fits="$(awk -v s="$start" -v max="$MAX_BYTES" 'NR>=s { t += length($0) + 1; if (t > max) { print NR - s; exit } }' "$file")"
echo "Blocked: lines ${start}-${end} of $file are $((bytes / 1000)) KB (limit $((MAX_BYTES / 1000)) KB per read; lines in this doc are very long). Find the place first: grep -n '^#' \"$file\" | cut -c1-160, or grep -n -i '<keyword>' \"$file\" | cut -c1-200. Then look at it with: sed -n 'A,Bp' \"$file\" | cut -c1-400, and Read only the lines you need (from line ${start}, about ${fits:-1} lines fit)." >&2
exit 2
