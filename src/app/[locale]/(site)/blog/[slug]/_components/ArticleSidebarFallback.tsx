import { LinkedInIcon, LinkIcon, WhatsAppIcon, XIcon } from '@/design/chrome/icons';
import { buttonClassName } from '@/design/primitives/Button';
import { PRINT_CLASS, remainingText, SHARE_CARD, SIDEBAR_STACK, TOC_CARD } from '../_lib/sidebar';
import type { ArticleSidebarProps } from './ArticleSidebar';

// The islands' own first render, mirrored for the LazyIsland fallback (W132: DOM-identical, so the
// swap never shifts the layout): ScrollSpyToc's server snapshot (the first heading current, no
// scroll progress), ShareRow without Web Share (a browser fact read after hydration) and with an
// empty status line, and PrintButton's `Button`. `ArticleSidebar.test.tsx` renders both with
// `renderToStaticMarkup` and fails on any drift — mirror a foundation island's change here.
const TOC_LINK = 'block border-l-2 py-1.5 pl-3 text-body-sm no-underline transition-colors';
const TOC_CURRENT = 'border-blue-safe font-extrabold text-ink';
const TOC_OTHER = 'border-border-2 text-text-secondary hover:text-ink';
const SHARE_ITEM =
  'inline-flex min-h-[44px] items-center gap-2 rounded-pill border border-border-1 bg-white px-4 text-body-sm font-bold text-ink no-underline transition-colors hover:bg-pale-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe';

/** B-13: the sidebar's server HTML — a real TOC landmark and real share links before the island
 *  loads, and for good on a device that never scrolls to it. No directive, no hooks. */
export function ArticleSidebarFallback({
  headings,
  tocLabel,
  readMinutes,
  remaining,
  url,
  title,
  share,
  printLabel,
}: ArticleSidebarProps) {
  const text = encodeURIComponent(`${title} ${url}`);
  const encoded = encodeURIComponent(url);
  return (
    <div className={SIDEBAR_STACK}>
      <div className={TOC_CARD}>
        <nav aria-label={tocLabel}>
          <p className="mb-2 text-eyebrow font-extrabold uppercase tracking-wide text-blue-safe">
            {tocLabel}
          </p>
          {/* QA W221 BLOG-08: explicit list role under `list-none` — identical in ScrollSpyToc (W132) */}
          <ol role="list" className="m-0 list-none p-0">
            {headings.map((h, i) => (
              <li key={h.id}>
                <a
                  href={`#${h.id}`}
                  aria-current={i === 0 ? 'location' : undefined}
                  className={[TOC_LINK, i === 0 ? TOC_CURRENT : TOC_OTHER].join(' ')}
                >
                  {h.text}
                </a>
              </li>
            ))}
          </ol>
          <p className="mt-3 text-body-sm text-text-tertiary">
            {remainingText(readMinutes, remaining)}
          </p>
        </nav>
      </div>
      <div className={SHARE_CARD} data-testid="article-share">
        <div className="flex flex-col gap-2">
          <p className="m-0 text-body-sm font-bold text-text-secondary">{share.heading}</p>
          <div className="flex flex-wrap gap-2">
            <a
              href={`https://wa.me/?text=${text}`}
              target="_blank"
              rel="noopener noreferrer"
              className={SHARE_ITEM}
            >
              <WhatsAppIcon size={15} />
              {share.whatsapp}
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`}
              target="_blank"
              rel="noopener noreferrer"
              className={SHARE_ITEM}
            >
              <LinkedInIcon size={15} />
              {share.linkedin}
            </a>
            <a
              href={`https://x.com/intent/post?url=${encoded}&text=${encodeURIComponent(title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className={SHARE_ITEM}
            >
              <XIcon size={14} />
              {share.x}
            </a>
            <button type="button" className={SHARE_ITEM}>
              <LinkIcon size={15} />
              {share.copy}
            </button>
          </div>
          <p
            role="status"
            aria-live="polite"
            className="m-0 min-h-[1.25rem] text-body-sm text-success-text"
          />
        </div>
        <button
          type="button"
          className={buttonClassName('secondary', 'md', `print-hidden ${PRINT_CLASS}`)}
        >
          {printLabel}
        </button>
      </div>
    </div>
  );
}
