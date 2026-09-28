#!/usr/bin/env python3
"""Mechanical drift scan over reconciled WP2b task files (controller pre-check before the Opus rechecks).
usage: mechanical-check.py fixed/task-1.md [more files]"""
import re, sys, os
PATS = {
  'barrel_primitives':   r"from '@/design/(primitives|blocks|islands)'",
  'barrel_date':         r"from '@/lib/format/date'",
  'extra_headers':       r"--extra-headers",
  'lazy_ssr_prop':       r"LazyIsland[^\n]*\bssr\b",
  'dynamic_ssr_false':   r"ssr:\s*false",
  'toBe401_only':        r"toBe\(401\)",
  'old_figure_54788':    r"54,788",
  'hidden_unprefixed':   r"""\bhidden\b[^"'`\n]*\s(flex|block|grid|inline-flex|inline-block|inline)\b""",
  'external_true':       r"external:\s*true",
  'useContactClick_import': r"from '@/analytics/useContactClick'",
  'npm_verify_or_test':  r"npm run (verify|test|e2e)\b",
  'we_in_sys_en':        r'"[a-zA-Z.]+":\s*"[^"]*\b[Ww]e\b[^"]*"',
  'biz_in_sys_tr':       r'"[a-zA-Z.]+":\s*"[^"]*\b[Bb]iz\b[^"]*"',
  'our_us_in_sys_en':     r'"[a-zA-Z.]+":\s*"[^"]*\b([Oo]ur|[Oo]urselves)\b[^"]*"',
  'miz_suffix_in_sys_tr': r'"[a-zA-Z.]+":\s*"[^"]*\w+(imiz|ımız|umuz|ümüz|imizde|ımızda|imizin|ımızın|imizi|ımızı)\b[^"]*"',
  'priority_prop':       r"\bpriority(=|:)",
  'sys_nav_new':         r"sys\.nav\.(?!main\b|close\b|home\b|legal\b|breadcrumbs\b)[a-z]",
  'sleep_in_steps':      r"(?m)^sleep ",
  'TBD_or_similar':      r"\bTBD\b|similar to [Tt]ask",
  'line_number_anchor':  r"\bat line \d+|\bline \d+ of\b|\blines? \d+[-–]\d+\b",
  'maxWorkers_missing_vitest': r"npx vitest run(?![^\n]*--maxWorkers=1)",
  'build_without_caps':  r"(?m)^(?!.*NEXT_BUILD_CPUS)[^\n]*\bnpm run build\b",
  'CLIENT_SYS_line':     r"\*\*CLIENT_SYS additions",
  'ledger_line':         r"\*\*Ledger line",
  'sys_keys_added':      r"\*\*Sys keys added",
  'package_ids_used':    r"\*\*Package ids used",
  'docs_in_task':        r"\*\*Docs in this task",
  'foundation_gaps':     r"\*\*Foundation gaps",
  'step1_cycles':        r"Step 1: Write the failing test",
  'w126_proof':          r"npm run gate\b",
  'js_size':             r"npm run js-size",
  'revalidate_86400':    r"revalidate = 86400",
  'data_testid_page_h1': r'data-testid="page-h1"',
  'data_lcp_slot':       r"data-lcp-slot",
  'data_placeholder':    r"data-placeholder=",
  'consent_checkbox':    r"consent:\s*'checkbox'",
  'tesekkurler':         r"/tesekkurler\?form=",
}
for f in sys.argv[1:]:
    s = open(f, encoding='utf-8').read()
    print(f"=== {os.path.relpath(f)} ({len(s.encode())} B) ===")
    for k, p in PATS.items():
        n = len(re.findall(p, s))
        if n: print(f"  {k:28s} {n}")
    for k in ('step1_cycles','foundation_gaps','ledger_line','CLIENT_SYS_line','sys_keys_added','package_ids_used','docs_in_task'):
        if not re.search(PATS[k], s): print(f"  MISSING {k}")
