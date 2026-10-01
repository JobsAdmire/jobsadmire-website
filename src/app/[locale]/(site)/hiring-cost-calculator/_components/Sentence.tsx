import { Fragment, type ReactNode } from 'react';
import { sp } from '../_lib/fragments';

/** A run of one design sentence: plain text, a bold run, an emphasis run, or a node (a live
 *  value, a link) with the text `sp` should judge its spacing by. */
export type Run = string | { b: string } | { em: string } | { node: ReactNode; text: string };

const textOf = (r: Run) => (typeof r === 'string' ? r : 'b' in r ? r.b : 'em' in r ? r.em : r.text);

/** One design sentence rebuilt from trimmed package fragments (`_lib/fragments.ts`): empty
 *  fragments vanish, spaces come back where the design had them, TR suffixes stay glued. No
 *  directive — the server sections and the islands both render it. */
export function Sentence({
  runs,
  strong = 'font-extrabold text-ink',
  em = 'not-italic text-danger',
}: {
  runs: readonly Run[];
  strong?: string;
  em?: string;
}) {
  const kept = runs.filter((r) => textOf(r) !== '');
  return (
    <>
      {kept.map((r, i) => (
        <Fragment key={i}>
          {i > 0 ? sp(textOf(kept[i - 1]), textOf(r)) : null}
          {typeof r === 'string' ? (
            r
          ) : 'b' in r ? (
            <strong className={strong}>{r.b}</strong>
          ) : 'em' in r ? (
            <em className={em}>{r.em}</em>
          ) : (
            r.node
          )}
        </Fragment>
      ))}
    </>
  );
}
