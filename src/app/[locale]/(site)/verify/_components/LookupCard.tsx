'use client';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { useId, useState } from 'react';
import { ContactLink } from '@/analytics/ContactLink';
import { ClockIcon } from '@/design/chrome/icons';
import { telLink } from '@/lib/contact';
import { RECORD_DIALOG_ENABLED } from '../_lib/flags';
import type { Representative } from '../_lib/register';
import { revealResult, useLookup } from './LookupContext';
import motion from './motion.module.css';
import type { RecordLabels } from './RecordDialog';

// The v1.1 chunk. `ssr: false` is legal only because this module is 'use client' (§6); declared
// here so the flag flip is one line — never fetched while RECORD_DIALOG_ENABLED is false.
const RecordDialog = dynamic(() => import('./RecordDialog'), { ssr: false });

/** Every label arrives resolved (W9/W148): this island calls no `useTranslations`. */
export type LookupLabels = {
  heading: string; // verify.031
  inputLabel: string; // verify.032
  hint: string; // sys.verify.lookup.hint, {min} filled on the server
  clear: string; // verify.033
  callOffice: string; // verify.034
  note: string; // verify.035
};

export type LookupCardProps = {
  labels: LookupLabels;
  /** The design's format hint in the empty input (`JA-REP-014`, Verify l. 603) — an id shape,
   *  not a person. */
  placeholder: string;
  phone: string;
  whatsappNumber: string;
  /** `<n> people authorised today` from the register rows; null hides it (W6/D17). */
  livePill: string | null;
  /** `Register last updated: <date>` from the rows; null hides it (D17 — never "today"). */
  updatedLabel: string | null;
  /** Resolved only while RECORD_DIALOG_ENABLED (v1.1); null in Phase A. */
  recordLabels: RecordLabels | null;
};

/** The design's input (Verify l. 603): 17 px / 800 on the pale #f9fcfe fill, a 1.5 px #d3e6f2
 *  edge, r12; brand-blue edge and white on focus, with the site's visible focus ring (D20). */
const INPUT =
  'min-h-[52px] w-full rounded-xs border-[1.5px] border-edge bg-field-fill px-[18px] text-[17px] font-extrabold tracking-[0.02em] text-ink placeholder:text-text-tertiary focus:border-blue focus:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe max-md:text-[16px] xl:text-[12.75px]';

/** The lookup's two r11 rectangles (Verify ll. 605–606): Clear on white with the secondary grey,
 *  the call on the pale fill in indigo. Full width, centred and 46 px tall ≤ 700 (l. 279). */
const BUTTON =
  'ja-hover-lift inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[11px] border-[1.5px] border-edge px-5 text-body-sm font-extrabold no-underline transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe max-md:min-h-[46px] max-md:flex-1';
const CLEAR = `${BUTTON} bg-white text-text-secondary hover:bg-pale-1`;
const CALL = `${BUTTON} bg-pale-1 text-indigo hover:bg-tint`;

/**
 * The authority check (`#check`): the input, Clear and the office call. The answer is its own
 * card below the hero (`LookupResult`, the design's `#verify`) — both read the page's one query
 * (`LookupProvider`). Phase A (W6): no register is published, so every answer is the neutral
 * "not published yet — verify with the office" card; the design's red "Not on our authorised
 * list" verdict (verify.048–050) is a legal claim about a person and never renders.
 */
export function LookupCard({
  labels,
  placeholder,
  phone,
  whatsappNumber,
  livePill,
  updatedLabel,
  recordLabels,
}: LookupCardProps) {
  // R35: the real URL path, never next-intl's internal key.
  const page = usePathname() ?? '/';
  const inputId = useId();
  const hintId = `${inputId}-hint`;
  const { raw, setTyped, clear } = useLookup();

  // v1.1: set by the record fetch (the website's own no-store handler, V-1); null in Phase A.
  const [record, setRecord] = useState<Representative | null>(null);

  return (
    <div
      id="check"
      data-testid="verify-check"
      className="ja-card-in scroll-mt-24 overflow-hidden rounded-lg bg-white text-ink shadow-hero-form max-md:rounded-md max-md:shadow-[0_18px_40px_rgba(3,10,26,0.45)]"
    >
      <div
        aria-hidden="true"
        className={`h-1 bg-[linear-gradient(90deg,#1899d5_55%,#d8ecf7_45%)] bg-[length:18px_4px] ${motion.dashFast}`}
      />
      <div className="px-7 pt-6 pb-1.5 max-md:px-[18px] max-md:pt-[18px] max-md:pb-1">
        <h2 className="m-0 mb-1.5 text-[21px] leading-[1.2] tracking-[-0.5px] max-md:text-[18.5px] max-md:tracking-[-0.4px] xl:text-[15.75px]">
          {labels.heading}
        </h2>
        {livePill ? (
          <p
            data-testid="verify-live-pill"
            className="m-0 inline-flex items-center gap-2 rounded-pill border border-success-soft-border bg-success-surface px-3 py-1 text-body-sm font-bold text-success-text"
          >
            <span aria-hidden="true" className="ja-live size-2 rounded-pill bg-success" />
            {livePill}
          </p>
        ) : null}
      </div>
      <div className="px-7 pt-5 pb-[26px] max-md:px-[18px] max-md:pt-3.5 max-md:pb-5">
        <label
          htmlFor={inputId}
          className="mb-2 block text-eyebrow font-extrabold uppercase tracking-[1.2px] text-text-tertiary"
        >
          {labels.inputLabel}
        </label>
        <input
          id={inputId}
          type="text"
          value={raw}
          placeholder={placeholder}
          onChange={(e) => setTyped(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') clear();
            if (e.key === 'Enter') revealResult();
          }}
          autoComplete="off"
          spellCheck={false}
          aria-describedby={hintId}
          className={INPUT}
        />
        {/* S1.4: the design draws no hint; it stays the input's description for assistive tech */}
        <p id={hintId} className="sr-only">
          {labels.hint}
        </p>
        <div className="mt-3 flex flex-wrap gap-2.5">
          <button type="button" onClick={clear} className={CLEAR}>
            {labels.clear}
          </button>
          <ContactLink href={telLink(phone)} placement="page_cta" className={CALL}>
            {labels.callOffice}
          </ContactLink>
        </div>

        <p className="mt-5 mb-0 border-t border-dashed border-border-1 pt-4 text-body-sm text-text-tertiary">
          {labels.note}
        </p>
        {updatedLabel ? (
          <p
            data-testid="verify-updated"
            className="mt-3 mb-0 flex items-center gap-2 text-[12px] font-extrabold tracking-[0.4px] text-text-tertiary max-md:hidden xl:text-[11px]"
          >
            <ClockIcon size={12} className="shrink-0" />
            {updatedLabel}
          </p>
        ) : null}
      </div>

      {RECORD_DIALOG_ENABLED && record && recordLabels ? (
        <RecordDialog
          open
          record={record}
          labels={recordLabels}
          recordUrl={`${page}?id=${encodeURIComponent(record.id)}`}
          whatsappNumber={whatsappNumber}
          onClose={() => setRecord(null)}
        />
      ) : null}
    </div>
  );
}
