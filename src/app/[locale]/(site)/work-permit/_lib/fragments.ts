/**
 * The design glues split package fragments with bare `{{ a }}{{ b }}` and lets its runtime
 * space them. W23 allows composing exactly those fragments; this is the one joiner the page
 * uses, so "Up to 1 year" + "first, then …" gets its space and "The employer" + ", on the
 * Ministry's online system …" (wp.118 + wp.119) does not.
 */
export function sp(prev: string, next: string): ' ' | '' {
  if (!prev || !next) return '';
  if (/\s$/.test(prev) || /^\s/.test(next)) return '';
  if (/^[,.;:!?)\]…]/.test(next)) return '';
  return ' ';
}
