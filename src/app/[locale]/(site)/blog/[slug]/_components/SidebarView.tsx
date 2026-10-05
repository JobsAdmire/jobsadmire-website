import { ClockIcon, LinkedInIcon, LinkIcon, WhatsAppIcon, XIcon } from '@/design/chrome/icons';
import type { ShareLabels } from '@/design/islands/ShareRow';
import type { TocHeading } from '@/design/islands/ScrollSpyToc';

// The sidebar's markup, hook-free: the island passes live state (the current heading, the minutes
// left, the copy handler and status), the server fallback passes the first-render defaults — so
// the two render the same DOM by construction (W132; `ArticleSidebar.test.tsx` still compares).

const EYEBROW =
  'text-[12px] font-extrabold uppercase tracking-[1.2px] text-text-tertiary xl:text-[11px] xl:tracking-[0.9px]';
const TOC_LINK =
  '-ml-2.5 block rounded-[8px] px-2.5 py-[7px] xl:py-[5px] text-body-sm no-underline transition-colors';
const TOC_CURRENT = 'bg-tint font-extrabold text-blue-deep';
const TOC_OTHER = 'font-semibold text-text-secondary hover:text-ink';

export function TocView({
  headings,
  activeId,
  label,
  remaining,
}: {
  headings: readonly TocHeading[];
  activeId: string;
  label: string;
  remaining: string;
}) {
  return (
    <nav aria-label={label}>
      <p className={`m-0 mb-3 ${EYEBROW}`}>{label}</p>
      {/* QA W221 BLOG-08: explicit list role under `list-none` */}
      <ol role="list" className="m-0 flex list-none flex-col gap-0.5 p-0">
        {headings.map((h) => {
          const current = h.id === activeId;
          return (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                aria-current={current ? 'location' : undefined}
                className={[TOC_LINK, current ? TOC_CURRENT : TOC_OTHER].join(' ')}
              >
                {h.text}
              </a>
            </li>
          );
        })}
      </ol>
      <p className="m-0 mt-3.5 flex items-center gap-[7px] xl:gap-[5px] border-t border-edge-soft pt-[13px] xl:pt-[10px] text-[12.5px] font-bold text-text-tertiary xl:text-[11px]">
        <ClockIcon size={13} />
        {remaining}
      </p>
    </nav>
  );
}

const ROUND =
  'flex h-[38px] w-[38px] items-center justify-center rounded-pill text-white no-underline transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe max-md:h-12 max-md:w-auto max-md:gap-[7px] max-md:rounded-[14px] max-md:text-[13.5px] max-md:font-extrabold xl:h-[28.5px] xl:w-[28.5px]';
const COPY =
  'inline-flex h-[38px] cursor-pointer items-center gap-[7px] xl:gap-[5px] rounded-pill border-[1.5px] border-edge bg-white px-4 font-[inherit] text-[13px] font-extrabold text-text-secondary transition-colors hover:border-blue hover:text-blue-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe max-md:col-span-full max-md:h-[46px] max-md:w-full max-md:justify-center max-md:rounded-[14px] max-md:bg-pale-1 max-md:text-[14px] xl:h-[28.5px] xl:px-3 xl:text-[11px]';

export function ShareView({
  url,
  title,
  labels,
  shareThis,
  status,
  onCopy,
}: {
  url: string;
  title: string;
  labels: ShareLabels;
  /** "Share this article" — the phone eyebrow (sys.blog.article.shareThis) */
  shareThis: string;
  status?: { text: string; failed: boolean; seq: number } | null;
  onCopy?: () => void;
}) {
  const text = encodeURIComponent(`${title} ${url}`);
  const encoded = encodeURIComponent(url);
  const external = { target: '_blank', rel: 'noopener noreferrer' } as const;
  return (
    <div className="flex flex-col">
      <p className={`m-0 mb-3 max-md:mb-2.5 max-md:text-[12.5px] ${EYEBROW}`}>
        <span className="md:hidden">{shareThis}</span>
        <span className="max-md:hidden">{labels.heading}</span>
      </p>
      <div className="flex flex-wrap gap-[9px] xl:gap-[7px] max-md:grid max-md:grid-cols-3 max-md:gap-2">
        <a
          href={`https://wa.me/?text=${text}`}
          {...external}
          aria-label={labels.whatsapp}
          className={`${ROUND} bg-success-text`}
        >
          <WhatsAppIcon size={16} />
          <span className="md:hidden">WhatsApp</span>
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`}
          {...external}
          aria-label={labels.linkedin}
          className={`${ROUND} bg-[#0A66C2]`}
        >
          <LinkedInIcon size={15} />
          <span className="md:hidden">LinkedIn</span>
        </a>
        <a
          href={`https://x.com/intent/post?url=${encoded}&text=${encodeURIComponent(title)}`}
          {...external}
          aria-label={labels.x}
          className={`${ROUND} bg-ink`}
        >
          <XIcon size={14} />
          <span className="md:hidden">X</span>
        </a>
        <button type="button" onClick={onCopy} className={COPY}>
          <LinkIcon size={13} />
          {labels.copy}
        </button>
      </div>
      <p
        role="status"
        aria-live="polite"
        className={[
          'm-0 mt-2 min-h-[1.25rem] text-body-sm',
          status?.failed ? 'text-text-secondary' : 'text-success-text',
        ].join(' ')}
      >
        {status ? <span key={status.seq}>{status.text}</span> : null}
      </p>
    </div>
  );
}
