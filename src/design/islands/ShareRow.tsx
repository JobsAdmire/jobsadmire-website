'use client';
import { useEffect, useState, useSyncExternalStore } from 'react';
import { LinkedInIcon, LinkIcon, WhatsAppIcon, XIcon } from '@/design/chrome/icons';

export type ShareLabels = {
  heading: string;
  share: string;
  whatsapp: string;
  linkedin: string;
  x: string;
  copy: string;
  copied: string;
};

export type ShareRowProps = {
  /** Absolute, locale-aware URL built by the page (SITE_URL + getPathname) — never a design literal. */
  url: string;
  title: string;
  labels: ShareLabels;
  className?: string;
};

const noSubscribe = () => () => {};
const canShare = () => typeof navigator !== 'undefined' && typeof navigator.share === 'function';
const onServer = () => false;

const ITEM =
  'inline-flex min-h-[44px] items-center gap-2 rounded-pill border border-border-1 bg-white px-4 text-body-sm font-bold text-ink no-underline transition-colors hover:bg-pale-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe';

/** Blog Article share row. Web Share is a browser fact read after hydration (R18); the
 *  intent links are ordinary anchors so the row works without JS. No analytics: share/copy
 *  are not in the W12 allowlist. */
export function ShareRow({ url, title, labels, className }: ShareRowProps) {
  const webShare = useSyncExternalStore(noSubscribe, canShare, onServer);
  const [copied, setCopied] = useState(false);
  // The "Copied" line clears itself 2 s after the latest copy. Keyed on `copied`, so the
  // timer lives and dies with the state it resets — no ref read in a cleanup, no setState
  // during the effect body (react-hooks 7's `set-state-in-effect` and `refs` rules).
  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(id);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      /* clipboard denied: the visible URL bar is the fallback */
    }
  };
  const share = async () => {
    try {
      await navigator.share({ title, url });
    } catch {
      /* dismissed */
    }
  };
  const text = encodeURIComponent(`${title} ${url}`);
  const encoded = encodeURIComponent(url);
  const external = { target: '_blank', rel: 'noopener noreferrer' } as const;

  return (
    <div className={['flex flex-col gap-2', className].filter(Boolean).join(' ')}>
      <p className="m-0 text-body-sm font-bold text-text-secondary">{labels.heading}</p>
      <div className="flex flex-wrap gap-2">
        {webShare ? (
          <button type="button" onClick={share} className={ITEM}>
            {labels.share}
          </button>
        ) : null}
        <a href={`https://wa.me/?text=${text}`} {...external} className={ITEM}>
          <WhatsAppIcon size={15} />
          {labels.whatsapp}
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`}
          {...external}
          className={ITEM}
        >
          <LinkedInIcon size={15} />
          {labels.linkedin}
        </a>
        <a
          href={`https://x.com/intent/post?url=${encoded}&text=${encodeURIComponent(title)}`}
          {...external}
          className={ITEM}
        >
          <XIcon size={14} />
          {labels.x}
        </a>
        <button type="button" onClick={copy} className={ITEM}>
          <LinkIcon size={15} />
          {labels.copy}
        </button>
      </div>
      <p
        role="status"
        aria-live="polite"
        className="m-0 min-h-[1.25rem] text-body-sm text-success-text"
      >
        {copied ? labels.copied : ''}
      </p>
    </div>
  );
}
