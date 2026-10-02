'use client';
import { useState, type MouseEvent } from 'react';
import { useContactClick } from '@/analytics/useContactClick';
import { Dialog } from '@/design/primitives/Dialog';
import { waLink } from '@/lib/contact';
import type { Representative, RepresentativeStatus } from '../_lib/register';

/** Every label is a prop (W9/W148 — this island calls no `useTranslations`); the Hero section
 *  resolves them only while `RECORD_DIALOG_ENABLED`. */
export type RecordLabels = {
  badgeQrHint: string; // verify.110
  authorisedUntil: string; // verify.111
  noExpiry: string; // verify.241
  contact: string; // verify.112
  languages: string; // verify.113
  reportsTo: string; // verify.114
  withJobsAdmire: string; // verify.115
  desk: string; // verify.116
  soleSignatory: string; // verify.060
  copyLink: string; // verify.226
  copied: string; // verify.267
  wrong: string; // verify.239
  close: string; // sys.verify.record.close
  status: Record<RepresentativeStatus, string>; // verify.046 · verify.259 · sys.verify.record.former
  whatsappIntro: string; // verify.228
};

/** Fail closed (D9): the header comes from the status enum — there is no default face, and every
 *  face keeps white text at ≥ 4.5:1 (D20: the design's #16a34a / #d97706 heads were 3.3:1 / 2.9:1). */
const HEAD: Record<RepresentativeStatus, string> = {
  active: 'bg-success-text',
  suspended: 'bg-warning-text',
  former: 'bg-danger',
};

/**
 * D9 v1.1 — the record view behind `RECORD_DIALOG_ENABLED` (a lazy chunk `LookupCard` never
 * fetches in Phase A). The real `Dialog` primitive supplies what the design's modal lacked:
 * `role="dialog"`, `aria-modal`, the focus trap, Escape and focus restore. Not scaffolded: the
 * badge QR (v1.1: the record handler renders it with `qrSvg`), the level-keyed "May do / May
 * never" lists (verify.117/118, 198–218), and "Print badge" (V-6 — Operations prints badges).
 */
export default function RecordDialog({
  open,
  record,
  labels,
  recordUrl,
  whatsappNumber,
  onClose,
}: {
  open: boolean;
  record: Representative;
  labels: RecordLabels;
  /** V-1: the record's permanent `?id=` URL on this route (what the badge QR will encode). */
  recordUrl: string;
  whatsappNumber: string;
  onClose: () => void;
}) {
  const fireContact = useContactClick('page_cta');
  const [copied, setCopied] = useState(false);
  const titleId = `record-${record.id}`;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(new URL(recordUrl, window.location.href).toString());
      setCopied(true);
    } catch {
      /* clipboard blocked: the address bar still holds the link */
    }
  };
  // W95: the id arrived through the visitor's lookup, so the chat is composed on click and the
  // DOM href stays the bare chat.
  const reportWrong = (e: MouseEvent<HTMLAnchorElement>) => {
    fireContact('whatsapp');
    e.preventDefault();
    window.open(
      waLink(whatsappNumber, `${labels.whatsappIntro} ${record.id}`),
      '_blank',
      'noopener',
    );
  };
  const meta: [string, string][] = [
    [labels.authorisedUntil, record.validUntil ?? labels.noExpiry],
    [labels.contact, record.contact ?? '—'],
    [labels.languages, record.languages.join(', ') || '—'],
    [labels.reportsTo, record.reportsTo ?? '—'],
    [labels.withJobsAdmire, record.since ?? '—'],
    [labels.desk, record.desk ?? '—'],
  ];
  return (
    <Dialog open={open} onClose={onClose} titleId={titleId}>
      <div
        className={`-mx-6 -mt-6 mb-4 flex items-center justify-between px-6 py-3 text-white ${HEAD[record.status]}`}
      >
        <span className="text-body-sm font-extrabold uppercase tracking-[1.2px]">
          {labels.status[record.status]}
        </span>
        <span className="flex items-center gap-3">
          <span className="text-body-sm font-extrabold">{record.id}</span>
          <button
            type="button"
            onClick={onClose}
            aria-label={labels.close}
            className="flex size-11 items-center justify-center rounded-pill border border-white/40 bg-white/15 text-body font-extrabold hover:bg-white hover:text-ink"
          >
            ×
          </button>
        </span>
      </div>
      <h2 id={titleId} className="m-0 text-card-title">
        {record.name}
      </h2>
      <p className="mt-1 mb-0 text-body-sm font-bold text-text-secondary">{record.role}</p>
      <p className="mt-0.5 mb-0 text-body-sm text-text-tertiary">
        {record.city}, {record.country}
      </p>
      {record.canSign && record.status === 'active' ? (
        <p className="mt-2 mb-0 inline-flex rounded-pill bg-navy px-3 py-1 text-eyebrow font-extrabold uppercase tracking-[0.6px] text-white">
          {labels.soleSignatory}
        </p>
      ) : null}
      <p className="mt-3 mb-0 text-body-sm text-text-tertiary">{labels.badgeQrHint}</p>
      <dl className="mt-4 mb-0 grid grid-cols-2 gap-3 md:grid-cols-3">
        {meta.map(([term, value]) => (
          <div key={term} className="rounded-xs border border-border-1 bg-pale-1 p-3">
            <dt className="text-eyebrow font-extrabold uppercase tracking-[1px] text-text-tertiary">
              {term}
            </dt>
            <dd className="m-0 mt-1 text-body-sm font-bold text-ink">{value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-border-1 pt-4">
        <button
          type="button"
          onClick={() => void copy()}
          className="min-h-[44px] text-body-sm font-extrabold text-blue-safe underline"
        >
          {labels.copyLink}
        </button>
        <span role="status" className="text-body-sm font-bold text-success-text">
          {copied ? labels.copied : ''}
        </span>
        <a
          href={`https://wa.me/${whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={reportWrong}
          className="ml-auto text-body-sm font-extrabold text-danger"
        >
          {labels.wrong}
        </a>
      </div>
    </Dialog>
  );
}
