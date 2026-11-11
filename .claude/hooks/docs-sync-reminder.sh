#!/bin/bash
# Stop hook: when source files changed (uncommitted, unpushed, or committed in the last 3 hours) but no doc
# changed, block the stop ONCE and remind Claude to sync the docs. A second stop (stop_hook_active=true) is
# always allowed. Works from a repo (checks that repo) and from the workspace root (checks all four repos).
input="$(cat)"
case "$input" in *'"stop_hook_active":true'*|*'"stop_hook_active": true'*) exit 0;; esac
check_repo() {
  local repo="$1"
  [ -d "$repo/.git" ] || return 0
  # Judge the most recent layer of work only: uncommitted changes, else unpushed commits, else commits of the last 3 hours.
  local changed
  changed="$(git -C "$repo" status --porcelain 2>/dev/null | sed 's/^...//; s/^.* -> //' | sort -u)"
  [ -z "$changed" ] && changed="$(git -C "$repo" diff --name-only '@{upstream}..HEAD' 2>/dev/null | sort -u)"
  [ -z "$changed" ] && changed="$(git -C "$repo" log --since='3 hours ago' --name-only --format='' 2>/dev/null | sort -u)"
  [ -z "$changed" ] && return 0
  local code docs
  code=$(printf '%s\n' "$changed" | grep -E '^(apps|packages|src|prisma|redirects|scripts|contract)/' | grep -vE '\.(md|spec\.ts|test\.ts|test\.tsx|snap)$' | wc -l | tr -d ' ')
  docs=$(printf '%s\n' "$changed" | grep -E '^(docs/|knowledge/|CLAUDE\.md$)' | wc -l | tr -d ' ')
  if [ "$code" -gt 0 ] && [ "$docs" -eq 0 ]; then
    echo "Docs check ($(basename "$repo")): $code source file(s) changed but no doc changed. Behaviour or business rules → docs/PRD.md; code structure, integrations, environment → docs/ARCHITECTURE.md; deploy → docs/DEPLOYMENT.md; a new hard-won rule → docs/GOTCHAS.md (in the website: its topic doc); a link between apps → INTERLINKS.md at the workspace root. Update the docs in this same task, or say why no doc change is needed (a bug fix that restores documented behaviour, a refactor, a dependency bump)." >&2
    return 1
  fi
  return 0
}
rc=0
if [ -d "$CLAUDE_PROJECT_DIR/.git" ]; then
  check_repo "$CLAUDE_PROJECT_DIR" || rc=2
else
  for r in "$CLAUDE_PROJECT_DIR"/jobsadmire-crm "$CLAUDE_PROJECT_DIR"/jobsadmire-operations "$CLAUDE_PROJECT_DIR"/jobsadmire-website "$CLAUDE_PROJECT_DIR"/jobsadmire-agentic-platform; do
    check_repo "$r" || rc=2
  done
fi
exit $rc
