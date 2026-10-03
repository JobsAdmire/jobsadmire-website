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
  /** W133: announced when the clipboard refuses (denied, insecure context, no Clipboard API).
   *  Without it a failed copy stays silent. */
  copyFailed?: string;
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
  const [status, setStatus] = useState<{ text: string; failed: boolean; seq: number } | null>(null);
  // The status line clears itself 2 s after the LATEST copy (W133): every copy stores a new
  // object, so this effect's cleanup cancels the previous timer and a fresh one starts. State
  // is set only from the timer callback — never in the effect body — and no ref is read in a
  // cleanup (react-hooks 7's `set-state-in-effect` and `refs` rules).
  useEffect(() => {
    if (!status) return;
    const id = window.setTimeout(() => setStatus(null), 2000);
    return () => window.clearTimeout(id);
  }, [status]);

  // `seq` keys the text node below: a repeat copy mounts a fresh node, so the live region
  // announces it again even though the words are the same. No text (a failure without a
  // `copyFailed` label) clears the line instead.
  const announce = (text: string | undefined, failed: boolean) =>
    setStatus((prev) => (text ? { text, failed, seq: (prev?.seq ?? 0) + 1 } : null));
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      announce(labels.copied, false);
    } catch {
      // Denied, an insecure context, or no Clipboard API at all (W133).
      announce(labels.copyFailed, true);
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
        className={[
          'm-0 min-h-[1.25rem] text-body-sm',
          status?.failed ? 'text-text-secondary' : 'text-success-text',
        ].join(' ')}
      >
        {status ? <span key={status.seq}>{status.text}</span> : null}
      </p>
    </div>
  );
}
