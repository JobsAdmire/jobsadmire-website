import { Fragment } from 'react';
import { sp } from '../_lib/fragments';
import type { Frag } from '../_lib/tables';

/** A sentence the package itself splits into fragments (W23), joined by `sp()`: `strong`
 *  fragments in bold ink, `muted` ones in the tertiary grey (the design's #94a3b8 asides,
 *  D20-safe on white). */
export function Frags({ parts, tf }: { parts: readonly Frag[]; tf: (id: string) => string }) {
  const texts = parts.map((p) => tf(p.id));
  return (
    <>
      {parts.map((p, i) => (
        <Fragment key={`${p.id}-${i}`}>
          {i > 0 ? sp(texts[i - 1], texts[i]) : ''}
          {p.strong ? (
            <strong className="font-extrabold text-ink">{texts[i]}</strong>
          ) : p.muted ? (
            <span className="text-text-tertiary">{texts[i]}</span>
          ) : (
            texts[i]
          )}
        </Fragment>
      ))}
    </>
  );
}
