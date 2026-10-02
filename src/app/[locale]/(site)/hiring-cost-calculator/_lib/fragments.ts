/**
 * The package ships the design's sentence fragments TRIMMED — its dictionary carried the spaces
 * (`p1B2: " per worker."`, `cQuotaQ1: "Can you hire "`), the bundle does not — so every place the
 * design glued two fragments needs its space back. Except where the right-hand fragment closes
 * the clause (punctuation), carries an apostrophe suffix (`'e çıkar.`), or continues the word as
 * a Turkish copula/participle suffix the package split off a highlighted word (`ıdır — …`,
 * `dır. …`, `mediği`). Pure; the `Sentence` component and the views join through it.
 */
const NO_SPACE_BEFORE = /^[.,;:!?)\]'’]/u;
const TR_SUFFIX = /^(?:[ıiuü]?[dt][ıiuü]r(?!\p{L})|m[ae]d[ıi]ğ[ıi](?!\p{L}))/u;

export function sp(left: string, right: string): string {
  if (!left || !right) return '';
  if (/\s$/u.test(left) || /^\s/u.test(right)) return '';
  if (NO_SPACE_BEFORE.test(right) || TR_SUFFIX.test(right)) return '';
  return ' ';
}

/** Plain strings joined with `sp`; empty fragments (the deliberately empty TR ones) vanish. */
export function joinText(parts: readonly string[]): string {
  const kept = parts.filter((p) => p !== '');
  return kept.reduce((acc, p, i) => (i === 0 ? p : acc + sp(kept[i - 1], p) + p), '');
}
