import { Fragment, type ReactNode } from 'react';
import Image from 'next/image';
import NextLink from 'next/link';
import { liquidSizes } from '@/design/zoom';
import type { Locale } from '@/i18n/routing';
import { inlineText, type Block, type Inline } from '../_lib/markdown';
import { BlogVideo } from './BlogVideo';
import { CollapsibleSection } from './CollapsibleSection';

/** The body's h2 face — the page's FAQ heading wears it too. `scroll-mt-24` keeps a TOC jump
 *  clear of the sticky header; `xl:` is the D19 ×0.75 step. */
export const ARTICLE_H2 =
  'mt-10 mb-4 scroll-mt-24 text-[26px] leading-tight font-extrabold tracking-[-0.4px] xl:tracking-[-0.3px] text-ink max-md:text-[22px] xl:text-[19.5px]';

/** The h2 face inside a collapsible section: on phones the design's 18.5 px, no outer margin (the
 *  button carries the 16 px padding) — flex so the "+" tile sits at the end. */
export const ARTICLE_H2_SECTION = `${ARTICLE_H2.replace('max-md:text-[22px]', 'max-md:text-[18.5px]')} max-md:m-0 max-md:flex max-md:items-center max-md:gap-3 max-md:leading-[1.3] max-md:tracking-[-0.4px]`;

/** The h3 face (contract `blog.v1`): a step below the h2 — the design has no h3, so this is the
 *  h2's family at the body's card-title size. */
const ARTICLE_H3 =
  'mt-7 mb-3 text-[20px] leading-snug font-extrabold tracking-[-0.2px] text-ink max-md:text-[17.5px] xl:text-[15px] xl:tracking-[-0.15px]';

/** An in-body link: the contrast-safe blue, underlined (a link inside running text must not rely
 *  on colour alone — WCAG 1.4.1), focus ring like every other link. */
const BODY_LINK =
  'font-bold text-blue-safe underline decoration-1 underline-offset-[3px] hover:decoration-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe';

/** An inline image fills the body column: ≤ 830 px wide up to 1100 px, 620 px from 1101 (D19),
 *  growing with the liquid desktop past 1440 (`liquidSizes`, W231). */
const BODY_IMAGE_SIZES = liquidSizes(
  620,
  '(min-width: 1101px) 620px, (min-width: 901px) 830px, 100vw',
);

/** A list whose every item is this short reads as a checklist — two columns from `sm` (the
 *  design's "Documents you'll need" grid); longer items (the rejection reasons) stay one column. */
const CHECKLIST_MAX_CHARS = 40;

function BodyLink({
  href,
  external,
  children,
}: {
  href: string;
  external: boolean;
  children: ReactNode;
}) {
  // A site page goes through next/link (client navigation, no prefetch on a long article); an
  // external page opens in a new tab with `noopener`; `mailto:` is a plain link.
  if (href.startsWith('/'))
    return (
      <NextLink href={href} prefetch={false} className={BODY_LINK}>
        {children}
      </NextLink>
    );
  return (
    <a
      href={href}
      className={BODY_LINK}
      {...(external ? { target: '_blank', rel: 'noopener' } : {})}
    >
      {children}
    </a>
  );
}

function Inlines({ inlines }: { inlines: readonly Inline[] }) {
  return (
    <>
      {inlines.map((n, i) => {
        switch (n.kind) {
          case 'strong':
            return (
              <strong key={i} className="font-extrabold text-ink">
                <Inlines inlines={n.children} />
              </strong>
            );
          case 'em':
            return (
              <em key={i}>
                <Inlines inlines={n.children} />
              </em>
            );
          case 'link':
            return (
              <BodyLink key={i} href={n.href} external={n.external}>
                <Inlines inlines={n.children} />
              </BodyLink>
            );
          default:
            return <Fragment key={i}>{n.text}</Fragment>;
        }
      })}
    </>
  );
}

function BlockView({
  block,
  first,
  cta,
  locale,
}: {
  block: Block;
  first: boolean;
  cta?: ReactNode;
  locale?: Locale;
}) {
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
    case 'h3':
      return <h3 className={ARTICLE_H3}>{block.text}</h3>;
    case 'image':
      // The grammar carries no intrinsic size: the 1200 × 675 box is the placeholder ratio and
      // `h-auto` lets the photo keep its own once it loads — never cropped (a chart or a
      // screenshot must stay whole), unlike `ImageSlot`'s fixed ratio box.
      return (
        <figure data-testid="article-image" className="mx-0 mt-2 mb-6">
          <Image
            src={block.src}
            alt={block.alt}
            width={1200}
            height={675}
            sizes={BODY_IMAGE_SIZES}
            className="h-auto w-full rounded-base border border-tint-border bg-pale-1"
          />
        </figure>
      );
    case 'video':
      return <BlogVideo videoKey={block.key} title={block.title} locale={locale} />;
    case 'callout':
      return (
        <div
          data-testid="article-takeaways"
          className="my-2 rounded-base border border-tint-border bg-pale-1 px-7 py-6 max-md:my-1.5 max-md:rounded-[14px] max-md:px-[18px] max-md:py-4"
        >
          <p className="text-eyebrow mt-0 mb-3 flex items-center gap-[9px] xl:gap-[7px] font-extrabold tracking-[1.2px] xl:tracking-[0.9px] text-blue-safe uppercase max-md:mb-[9px] max-md:gap-[7px] max-md:text-[11.5px]">
            <svg
              aria-hidden="true"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0"
              focusable="false"
            >
              <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" />
            </svg>
            {block.title}
          </p>
          {/* QA W221 BLOG-08: `list-none` strips the list semantics in Safari/VoiceOver — every
              article list keeps them with an explicit role */}
          <ul
            role="list"
            className="m-0 flex list-none flex-col gap-[9px] xl:gap-[7px] p-0 font-semibold text-ink max-md:gap-[7px] max-md:text-[14px] max-md:leading-[1.5]"
          >
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
      const checklist = block.items.every((item) => inlineText(item).length <= CHECKLIST_MAX_CHARS);
      if (!checklist)
        // The design's "mistakes" box (DC 618–625): the long-item list is the rejection reasons,
        // an amber callout with a ⚠ before each line.
        return (
          <ul
            role="list"
            data-testid="article-warning"
            className="mt-0 mb-5 flex list-none flex-col gap-2.5 rounded-base border border-[#f3dfb3] bg-[#fef8ec] px-[26px] py-[22px] text-[14.5px] xl:px-[19.5px] xl:py-[16.5px] xl:text-[11px] text-[#5c4a1e] max-md:px-[18px] max-md:py-4"
          >
            {block.items.map((item, j) => (
              <li key={j} className="flex gap-2.5">
                <span aria-hidden="true" className="shrink-0">
                  ⚠
                </span>
                <span>
                  <Inlines inlines={item} />
                </span>
              </li>
            ))}
          </ul>
        );
      return (
        <ul
          role="list"
          className="mt-0 mb-5 grid list-none gap-x-6 gap-y-3 rounded-base border border-tint-border bg-white p-6 lg:grid-cols-2"
        >
          {block.items.map((item, j) => (
            <li key={j} className="text-body-sm flex items-center gap-2.5 font-semibold text-ink">
              <span
                aria-hidden="true"
                data-testid="article-check"
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-pill bg-success text-[12px] font-extrabold text-white xl:h-4 xl:w-4 xl:text-[11px]"
              >
                ✓
              </span>
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
        <ol role="list" className="mt-0 mb-5 flex list-none flex-col gap-3.5 p-0">
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
          className="mt-8 mb-2 rounded-[18px] border border-tint-border bg-gradient-to-br from-pale-1 to-tint px-8 py-7 max-md:mt-6 max-md:mb-1 max-md:px-5 max-md:py-[18px]"
        >
          <span
            aria-hidden="true"
            className="mb-2 block text-[40px] leading-none font-extrabold text-blue-safe max-md:mb-0.5 max-md:text-[30px] xl:text-[30px]"
          >
            &quot;
          </span>
          <blockquote className="m-0">
            <p className="text-body-lg m-0 font-semibold text-ink max-md:text-[15.5px]">
              <Inlines inlines={block.inlines} />
            </p>
          </blockquote>
          {cta ? <div className="mt-4 max-md:hidden">{cta}</div> : null}
        </div>
      );
  }
}

/**
 * The parsed v1 body (B-8) in the design's article typography: the intro, the Key-takeaways box,
 * the H2 sections (ids for the TOC), the two-up rule cards, the lists, the numbered steps, the
 * pull quotes, the images and the videos (W249). React nodes only — no HTML string, so nothing
 * needs sanitising. `closingCta` (B-11) renders inside the final quote box when the body ends with
 * one, else after the body. `locale` is the page's: a video's caption track in that language is
 * on by default.
 */
export function ArticleBody({
  blocks,
  closingCta,
  locale,
}: {
  blocks: readonly Block[];
  closingCta?: ReactNode;
  locale?: Locale;
}) {
  const last = blocks.length - 1;
  const ctaInQuote = closingCta != null && blocks[last]?.kind === 'quote';
  const view = (block: Block, i: number) => (
    <BlockView
      key={i}
      block={block}
      first={i === 0}
      cta={ctaInQuote && i === last ? closingCta : undefined}
      locale={locale}
    />
  );
  // The design's sections: an h2 and its blocks up to the next h2 or the body's closing pull
  // quote — its last block, which stays outside, between the last section and the FAQ. A quote
  // inside the body stays in its section (W249: on phones a mid-section quote would otherwise
  // show under a collapsed heading and leave the rest of its section outside it).
  const closingQuote = (j: number) => j === last && blocks[j].kind === 'quote';
  const out: ReactNode[] = [];
  for (let i = 0; i < blocks.length; i += 1) {
    const block = blocks[i];
    if (block.kind !== 'h2') {
      out.push(view(block, i));
      continue;
    }
    const start = i;
    const inside: ReactNode[] = [];
    while (i + 1 < blocks.length && blocks[i + 1].kind !== 'h2' && !closingQuote(i + 1)) {
      i += 1;
      inside.push(view(blocks[i], i));
    }
    out.push(
      <CollapsibleSection
        key={start}
        id={block.id}
        title={block.text}
        headingClassName={ARTICLE_H2_SECTION}
      >
        {inside}
      </CollapsibleSection>,
    );
  }
  return (
    <div className="text-body leading-relaxed text-text-secondary">
      {out}
      {closingCta != null && !ctaInQuote ? <div className="mt-8">{closingCta}</div> : null}
    </div>
  );
}
