/**
 * The design glues split package fragments with bare `{{ a }}{{ b }}` and lets ja-i18n.js
 * space them. W23 allows composing exactly those fragments; this is the one joiner the page
 * uses, so "Hire verified overseas" + "workers" gets its space and "470+ yerleştirme" +
 * ", Türkiye'deki…" (hire.191 + hire.192 TR) does not.
 */
export function sp(prev: string, next: string): ' ' | '' {
  if (!prev || !next) return '';
  if (/\s$/.test(prev) || /^\s/.test(next)) return '';
  if (/^[,.;:!?)\]…]/.test(next)) return '';
  return ' ';
}
