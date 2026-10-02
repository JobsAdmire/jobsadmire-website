import { Fragment, type ReactNode } from 'react';
import type { Block, Inline } from '../_lib/markdown';

/** The body's h2 face — the page's FAQ heading wears it too. `scroll-mt-24` keeps a TOC jump
 *  clear of the sticky header; `xl:` is the D19 ×0.75 step. */
export const ARTICLE_H2 =
  'mt-10 mb-4 scroll-mt-24 text-[26px] leading-tight font-extrabold tracking-[-0.4px] xl:tracking-[-0.3px] text-ink max-md:text-[22px] xl:text-[19.5px]';

/** A list whose every item is this short reads as a checklist — two columns from `sm` (the
 *  design's "Documents you'll need" grid); longer items (the rejection reasons) stay one column. */
const CHECKLIST_MAX_CHARS = 40;
const plain = (inlines: readonly Inline[]) => inlines.map((n) => n.text).join('');

function Inlines({ inlines }: { inlines: readonly Inline[] }) {
  return (
    <>
      {inlines.map((n, i) =>
        n.kind === 'strong' ? (
          <strong key={i} className="font-extrabold text-ink">
            {n.text}
          </strong>
        ) : (
          <Fragment key={i}>{n.text}</Fragment>
        ),
      )}
    </>
  );
}

function BlockView({ block, first, cta }: { block: Block; first: boolean; cta?: ReactNode }) {
  switch (block.kind) {
    case 'p':
      return (
        <p className={first ? 'text-body-lg mt-0 mb-5 text-ink' : 'mt-0 mb-5'}>
          <Inlines inlines={block.inlines} />
        </p>
      );
    case 'h2':
      return (
        <h2 id={block.id} className={ARTICLE_H2}>
          {block.text}
        </h2>
      );
    case 'callout':
      return (
        <div
          data-testid="article-takeaways"
          className="my-6 rounded-base border border-tint-border bg-pale-1 px-7 py-6"
        >
          <p className="text-eyebrow mt-0 mb-3 font-extrabold tracking-[1.2px] xl:tracking-[0.9px] text-blue-safe uppercase">
            {block.title}
          </p>
          <ul className="m-0 flex list-none flex-col gap-2 p-0 font-semibold text-ink">
            {block.items.map((item, j) => (
              <li key={j} className="flex gap-2.5">
                <span aria-hidden="true" className="shrink-0 text-blue-safe">
                  →
                </span>
                <span>
                  <Inlines inlines={item} />
                </span>
              </li>
            ))}
          </ul>
        </div>
      );
    case 'leads':
      return (
        <div className="mb-5 grid gap-4 lg:grid-cols-2">
          {block.items.map((item, j) => (
            <div key={j} className="rounded-sm border border-tint-border bg-pale-1 px-5 py-5">
              <p className="mt-0 mb-1.5 text-[22px] leading-tight font-extrabold text-blue-safe xl:text-[16.5px]">
                {item.lead}
              </p>
              <p className="text-body-sm m-0 leading-relaxed">
                <Inlines inlines={item.body} />
              </p>
            </div>
          ))}
        </div>
      );
    case 'ul': {
      const checklist = block.items.every((item) => plain(item).length <= CHECKLIST_MAX_CHARS);
      return (
        <ul
          className={
            checklist
              ? 'mt-0 mb-5 grid list-none gap-x-6 gap-y-3 rounded-base border border-tint-border bg-white p-6 lg:grid-cols-2'
              : 'mt-0 mb-5 flex list-none flex-col gap-3 rounded-base border border-tint-border bg-white p-6'
          }
        >
          {block.items.map((item, j) => (
            <li key={j} className="text-body-sm flex items-start gap-2.5 font-semibold text-ink">
              <span
                aria-hidden="true"
                className="mt-1.5 h-2 w-2 shrink-0 rounded-pill bg-blue-safe"
              />
              <span>
                <Inlines inlines={item} />
              </span>
            </li>
          ))}
        </ul>
      );
    }
    case 'ol':
      return (
        <ol className="mt-0 mb-5 flex list-none flex-col gap-3.5 p-0">
          {block.items.map((item, j) => (
            <li key={j} className="flex items-start gap-4">
              <span
                aria-hidden="true"
                className="text-body-sm flex h-8 w-8 shrink-0 items-center justify-center rounded-pill bg-blue-safe font-extrabold text-white"
              >
                {j + 1}
              </span>
              <span className="pt-1">
                <Inlines inlines={item} />
              </span>
            </li>
          ))}
        </ol>
      );
    case 'quote':
      return (
        <div
          data-testid="article-quote"
          className="mt-8 mb-2 rounded-lg border border-tint-border bg-gradient-to-br from-pale-1 to-tint px-8 py-7"
        >
          <span
            aria-hidden="true"
            className="block text-[40px] xl:text-[30px] leading-none font-extrabold text-blue-safe"
          >
            “
          </span>
          <blockquote className="m-0">
            <p className="text-body-lg m-0 font-semibold text-ink">
              <Inlines inlines={block.inlines} />
            </p>
          </blockquote>
          {cta ? <div className="mt-4">{cta}</div> : null}
        </div>
      );
  }
}

/**
 * The parsed v1 body (B-8) in the design's article typography: the intro, the Key-takeaways box,
 * the H2 sections (ids for the TOC), the two-up rule cards, the lists, the numbered steps and the
 * pull quote. React nodes only — no HTML string, so nothing needs sanitising. `closingCta` (B-11)
 * renders inside the final quote box when the body ends with one, else after the body.
 */
export function ArticleBody({
  blocks,
  closingCta,
}: {
  blocks: readonly Block[];
  closingCta?: ReactNode;
}) {
  const last = blocks.length - 1;
  const ctaInQuote = closingCta != null && blocks[last]?.kind === 'quote';
  return (
    <div className="text-body leading-relaxed text-text-secondary">
      {blocks.map((block, i) => (
        <BlockView
          key={i}
          block={block}
          first={i === 0}
          cta={ctaInQuote && i === last ? closingCta : undefined}
        />
      ))}
      {closingCta != null && !ctaInQuote ? <div className="mt-8">{closingCta}</div> : null}
    </div>
  );
}
