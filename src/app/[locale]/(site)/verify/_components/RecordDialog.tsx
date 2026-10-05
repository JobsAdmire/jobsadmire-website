'use client';
import { useState, type MouseEvent, type ReactNode } from 'react';
import { ContactLink } from '@/analytics/ContactLink';
import { useContactClick } from '@/analytics/useContactClick';
import { Dialog } from '@/design/primitives/Dialog';
import { telLink, waLink } from '@/lib/contact';
import type { Representative, RepresentativeStatus } from '../_lib/register';
import { CopyIcon, CrossIcon, TickIcon } from './icons';

/** Every label is a prop (W9/W148 — this island calls no `useTranslations`); the sections
 *  resolve them (`recordLabels`, `_sections/record.ts`). */
export type RecordLabels = {
  badgeQrHint: string; // verify.110 — shown with the badge QR (v1.1), never without one
  authorisedUntil: string; // verify.111
  noExpiry: string; // verify.241
  contact: string; // verify.112
  languages: string; // verify.113
  reportsTo: string; // verify.114
  withJobsAdmire: string; // verify.115
  desk: string; // verify.116
  mayDo: string; // verify.117
  mayNever: string; // verify.118
  soleSignatory: string; // verify.060
  copyLink: string; // verify.226
  copied: string; // verify.267
  wrong: string; // verify.239
  close: string; // sys.verify.record.close
  status: Record<RepresentativeStatus, string>; // verify.046 · verify.259 · sys.verify.record.former
  whatsappIntro: string; // verify.228
};

/** The record's "May do / May never" lists (Verify ll. 996–1015), already resolved. */
export type RecordCaps = { can: string[]; never: string[] };

/** Fail closed (D9): the header comes from the status enum — there is no default face, and every
 *  face keeps white text at ≥ 4.5:1 (D20: the design's #16a34a / #d97706 heads were 3.3:1 / 2.9:1). */
const HEAD: Record<RepresentativeStatus, string> = {
  active: 'bg-success-text',
  suspended: 'bg-warning-text',
  former: 'bg-danger',
};

/** A company number (the only kind of contact a record may carry besides an @jobsadmire.com
 *  address, D9 v1.1) is a call link, as in the design (l. 976). */
const PHONE = /^\+?[\d\s()-]{8,}$/;

/**
 * The record view (the design's RECORD MODAL, Verify ll. 931–1033) on the real `Dialog`
 * primitive, which supplies what the design's modal lacked: `role="dialog"`, `aria-modal`, the
 * focus trap, Escape and focus restore. Opened today for the founder only (the strip's "Open
 * record", `FounderRecordButton`); the lookup opens it once `RECORD_DIALOG_ENABLED` and the v1.1
 * register ship. Status head, identity beside the photo slot (`photo`, rendered on the server),
 * the meta cells that have a value, the May do / May never lists (`caps`), and the footer —
 * "Copy record link" only where the record has a permanent `?id=` URL that opens it (`recordUrl`;
 * the Phase A founder has none), "Something is wrong →" to WhatsApp, composed on click (W95). Not
 * scaffolded: the badge QR (v1.1: the record handler renders it with `qrSvg`) and "Print badge"
 * (V-6 — Operations prints badges).
 */
export default function RecordDialog({
  open,
  record,
  labels,
  recordUrl,
  whatsappNumber,
  onClose,
  photo,
  caps,
}: {
  open: boolean;
  record: Representative;
  labels: RecordLabels;
  /** V-1: the record's permanent `?id=` URL on this route (what the badge QR will encode); null
   *  hides "Copy record link". */
  recordUrl: string | null;
  whatsappNumber: string;
  onClose: () => void;
  photo?: ReactNode;
  caps?: RecordCaps | null;
}) {
  const fireContact = useContactClick('page_cta');
  const [copied, setCopied] = useState(false);
  const titleId = `record-${record.id}`;
  const copy = async () => {
    if (!recordUrl) return;
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
  const place = [record.city, record.country].filter(Boolean).join(', ');
  const contact = record.contact ? (
    PHONE.test(record.contact) ? (
      <ContactLink
        href={telLink(record.contact.replace(/[^+\d]/g, ''))}
        placement="page_cta"
        className="font-extrabold text-blue-safe no-underline hover:underline"
      >
        {record.contact}
      </ContactLink>
    ) : (
      record.contact
    )
  ) : null;
  // Only the cells with a value: an empty "—" cell says nothing a visitor can check.
  const meta = (
    [
      [labels.authorisedUntil, record.validUntil ?? labels.noExpiry],
      [labels.contact, contact],
      [labels.languages, record.languages.join(', ') || null],
      [labels.reportsTo, record.reportsTo],
      [labels.withJobsAdmire, record.since],
      [labels.desk, record.desk],
    ] as [string, ReactNode][]
  ).filter(([, value]) => value !== null && value !== '');
  return (
    <Dialog open={open} onClose={onClose} titleId={titleId} className="ja-card-in">
      <div
        className={`-mx-6 -mt-6 flex flex-wrap items-center justify-between gap-3.5 px-6 py-3 text-white ${HEAD[record.status]}`}
      >
        <span className="flex items-center gap-2.5 text-[13px] font-extrabold tracking-[1.2px] uppercase xl:text-[11px]">
          <span aria-hidden="true" className="size-[9px] shrink-0 rounded-pill bg-white" />
          {labels.status[record.status]}
        </span>
        <span className="flex items-center gap-3">
          <span className="text-[13px] font-extrabold text-white xl:text-[11px]">{record.id}</span>
          <button
            type="button"
            onClick={onClose}
            aria-label={labels.close}
            className="flex size-11 cursor-pointer items-center justify-center rounded-pill border border-white/40 bg-white/15 text-body font-extrabold text-white hover:bg-white hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            ×
          </button>
        </span>
      </div>
      <div className="flex items-center gap-[18px] py-6">
        {photo ? (
          <div className="w-[88px] shrink-0 overflow-hidden rounded-[13px] border border-edge bg-tint max-md:w-[68px]">
            {photo}
          </div>
        ) : null}
        <div className="min-w-0">
          <h2
            id={titleId}
            className="m-0 text-[20px] leading-[1.22] tracking-[-0.4px] max-md:text-[18px] xl:text-[15px]"
          >
            {record.name}
          </h2>
          <p className="mt-1 mb-0 text-[14.5px] font-bold text-text-secondary xl:text-[11px]">
            {record.role}
          </p>
          {place ? (
            <p className="mt-0.5 mb-0 text-[13.5px] font-semibold text-text-tertiary xl:text-[11px]">
              {place}
            </p>
          ) : null}
          {record.canSign && record.status === 'active' ? (
            <p className="mt-[11px] mb-0 inline-flex rounded-pill bg-indigo px-[13px] py-[5px] text-[11.5px] font-extrabold tracking-[0.6px] text-white uppercase xl:text-[11px]">
              {labels.soleSignatory}
            </p>
          ) : null}
        </div>
      </div>
      {meta.length > 0 ? (
        <dl className="-mx-6 my-0 grid grid-cols-2 gap-px border-t border-[#e9f1f7] bg-[#e9f1f7]">
          {meta.map(([term, value]) => (
            <div key={term} className="bg-field-fill px-5 py-3.5 max-md:px-3.5 max-md:py-[11px]">
              <dt className="mb-1 text-[11px] font-extrabold tracking-[1.1px] text-text-tertiary uppercase xl:text-[11px]">
                {term}
              </dt>
              <dd className="m-0 text-[14.5px] font-extrabold break-words text-ink xl:text-[11px]">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      ) : null}
      {caps ? (
        <div className="-mx-6 grid grid-cols-2 gap-px bg-[#e9f1f7] max-md:grid-cols-1">
          <div className="bg-white px-6 py-5 max-md:px-[15px] max-md:py-[15px]">
            <h3 className="m-0 mb-[11px] text-[11.5px] font-extrabold tracking-[1.2px] text-success-text uppercase xl:text-[11px]">
              {labels.mayDo}
            </h3>
            <ul className="m-0 flex list-none flex-col gap-2 p-0">
              {caps.can.map((c) => (
                <li
                  key={c}
                  className="flex items-start gap-[9px] text-[13.5px] leading-[1.5] font-bold text-text-secondary xl:text-[11px]"
                >
                  <TickIcon size={13} className="mt-[3px] shrink-0 text-success-text" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-danger-surface px-6 py-5 max-md:px-[15px] max-md:py-[15px]">
            <h3 className="m-0 mb-[11px] text-[11.5px] font-extrabold tracking-[1.2px] text-danger uppercase xl:text-[11px]">
              {labels.mayNever}
            </h3>
            <ul className="m-0 flex list-none flex-col gap-2 p-0">
              {caps.never.map((c) => (
                <li
                  key={c}
                  className="flex items-start gap-[9px] text-[13.5px] leading-[1.5] font-bold text-[#7f1d1d] xl:text-[11px]"
                >
                  <CrossIcon size={12} className="mt-1 shrink-0 text-danger" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
      <div className="-mx-6 -mb-6 flex flex-wrap items-center justify-end gap-4 border-t border-[#e9f1f7] bg-field-fill px-6 py-[15px] max-md:px-[15px] max-md:py-[13px]">
        {recordUrl ? (
          <>
            <button
              type="button"
              onClick={() => void copy()}
              className={`inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-[10px] border-[1.5px] px-4 text-[13px] font-extrabold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe xl:text-[11px] ${copied ? 'border-success-soft-border bg-success-surface text-success-text' : 'border-edge bg-white text-indigo hover:border-blue hover:bg-pale-1'}`}
            >
              <CopyIcon size={13} className="shrink-0" />
              {copied ? labels.copied : labels.copyLink}
            </button>
            <span role="status" className="sr-only">
              {copied ? labels.copied : ''}
            </span>
          </>
        ) : null}
        <a
          href={`https://wa.me/${whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={reportWrong}
          className="inline-flex min-h-[44px] items-center text-[13.5px] font-extrabold text-danger no-underline hover:underline xl:text-[11px]"
        >
          {labels.wrong}
        </a>
      </div>
    </Dialog>
  );
}
