'use client';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useEffect, useId, useRef, useState, useSyncExternalStore, type MouseEvent } from 'react';
import { ContactLink } from '@/analytics/ContactLink';
import { track } from '@/analytics/track';
import { useContactClick } from '@/analytics/useContactClick';
import { Button, buttonClassName } from '@/design/primitives/Button';
import { telLink, waLink } from '@/lib/contact';
import { RECORD_DIALOG_ENABLED } from '../_lib/flags';
import { LOOKUP_MIN_CHARS, normaliseQuery, readDeepLinkId, splitAtQuery } from '../_lib/lookup';
import type { Representative } from '../_lib/register';
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
  resultTitle: string; // sys.verify.lookup.resultTitle
  resultBody: string; // sys.verify.lookup.resultBody, RAW — split here at {query}
  resultCall: string; // verify.051
  resultWhatsapp: string; // sys.verify.lookup.whatsapp
  whatsappIntro: string; // verify.228 — the visitor's own opening line
};

export type LookupCardProps = {
  labels: LookupLabels;
  phone: string;
  whatsappNumber: string;
  /** `<n> people authorised today` from the register rows; null hides it (W6/D17). */
  livePill: string | null;
  /** `Register last updated: <date>` from the rows; null hides it (D17 — never "today"). */
  updatedLabel: string | null;
  /** Resolved only while RECORD_DIALOG_ENABLED (v1.1); null in Phase A. */
  recordLabels: RecordLabels | null;
};

/** The one outcome Phase A can have (W6/W67): there is no published register to match. */
const OUTCOME = 'register_unavailable' as const;

const subscribeNoop = () => () => {};
const readClientDeepLink = () => readDeepLinkId(window.location.search, window.location.hash);
const readServerDeepLink = () => null;

const INPUT =
  'min-h-[52px] w-full rounded-xs border border-border-1 bg-pale-3 px-4 text-body font-extrabold tracking-[0.02em] text-ink focus-visible:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe';

/**
 * The authority check (`#check`). Phase A (W6): no register is published, so every query of three
 * characters or more answers the NEUTRAL "not published yet — verify with the office" card with
 * the office's phone and WhatsApp; the design's red "Not on our authorised list" verdict
 * (verify.048–050) is a legal claim about a person and never renders. Client-only: nothing is
 * stored, nothing is fetched, Operations is never called (D6); the query leaves the page only
 * inside the WhatsApp message the visitor sends themselves (composed on click, W95).
 */
export function LookupCard({
  labels,
  phone,
  whatsappNumber,
  livePill,
  updatedLabel,
  recordLabels,
}: LookupCardProps) {
  const locale = useLocale();
  // R35: the real URL path, never next-intl's internal key.
  const page = usePathname() ?? '/';
  const fireContact = useContactClick('page_cta');
  const inputId = useId();
  const hintId = `${inputId}-hint`;

  // V-1: the deep link is a browser fact read after hydration (R18 — the server and the
  // hydrating client both see null: no mismatch, no setState in an effect). Once the visitor
  // types, `typed` wins; Clear sets '' (not null) so the URL's id does not come back.
  const deepLink = useSyncExternalStore(subscribeNoop, readClientDeepLink, readServerDeepLink);
  const [typed, setTyped] = useState<string | null>(null);
  const raw = typed ?? deepLink ?? '';
  const query = normaliseQuery(raw);
  const showResult = query.length >= LOOKUP_MIN_CHARS;
  const body = splitAtQuery(labels.resultBody);

  // v1.1: set by the record fetch (the website's own no-store handler, V-1); null in Phase A.
  const [record, setRecord] = useState<Representative | null>(null);

  // One event per query session: fires when the answer first appears, re-arms on clear.
  const fired = useRef(false);
  useEffect(() => {
    if (!showResult) {
      fired.current = false;
      return;
    }
    if (fired.current) return;
    fired.current = true;
    track('verify_lookup', { page, locale, outcome: OUTCOME });
  }, [showResult, page, locale]);

  const clear = () => setTyped('');

  // W95: the prefill carries what the visitor typed, so the DOM href is the bare chat and the
  // prefilled URL is composed on click (the FallbackPanel contract).
  const askOnWhatsApp = (e: MouseEvent<HTMLElement>) => {
    fireContact('whatsapp');
    e.preventDefault();
    window.open(waLink(whatsappNumber, `${labels.whatsappIntro} ${query}`), '_blank', 'noopener');
  };

  return (
    <div
      id="check"
      data-testid="verify-check"
      className="scroll-mt-24 overflow-hidden rounded-lg bg-white text-ink shadow-hero-form"
    >
      <div
        aria-hidden="true"
        className="h-1 bg-[linear-gradient(90deg,#1899d5_55%,#d8ecf7_45%)] bg-[length:18px_4px]"
      />
      <div className="px-7 pt-6 pb-1.5">
        <h2 className="m-0 text-card-title tracking-[-0.02em]">{labels.heading}</h2>
        {livePill ? (
          <p
            data-testid="verify-live-pill"
            className="mt-2 mb-0 inline-flex items-center gap-2 rounded-pill border border-success-border bg-success-surface px-3 py-1 text-body-sm font-bold text-success-text"
          >
            <span aria-hidden="true" className="size-2 rounded-pill bg-success" />
            {livePill}
          </p>
        ) : null}
      </div>
      <div className="px-7 pt-5 pb-7">
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
          onChange={(e) => setTyped(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') clear();
          }}
          autoComplete="off"
          spellCheck={false}
          aria-describedby={hintId}
          className={INPUT}
        />
        <p id={hintId} className="mt-1.5 mb-0 text-body-sm text-text-tertiary">
          {labels.hint}
        </p>
        <div className="mt-3 flex flex-wrap gap-2.5">
          <button type="button" onClick={clear} className={buttonClassName('secondary')}>
            {labels.clear}
          </button>
          <ContactLink
            href={telLink(phone)}
            placement="page_cta"
            className={buttonClassName('secondary')}
          >
            {labels.callOffice}
          </ContactLink>
        </div>

        {/* Announced once when the answer appears — the echo below changes on every keystroke. */}
        <p role="status" className="sr-only">
          {showResult ? labels.resultTitle : ''}
        </p>
        {showResult ? (
          <div
            data-testid="verify-lookup-result"
            data-outcome={OUTCOME}
            className="mt-5 rounded-base border border-warning-border bg-warning-surface p-5"
          >
            <p className="m-0 text-body-lg font-extrabold">{labels.resultTitle}</p>
            <p className="mt-2 mb-0 text-body-sm text-text-secondary">
              {body.before}
              {body.hasQuery ? <strong className="text-ink">{query}</strong> : null}
              {body.after}
            </p>
            <div className="mt-4 flex flex-wrap gap-2.5">
              <ContactLink
                href={telLink(phone)}
                placement="page_cta"
                className={buttonClassName('primary')}
              >
                {labels.resultCall}
              </ContactLink>
              <Button
                variant="success"
                href={`https://wa.me/${whatsappNumber}`}
                external
                onClick={askOnWhatsApp}
              >
                {labels.resultWhatsapp}
              </Button>
            </div>
          </div>
        ) : null}

        <p className="mt-5 mb-0 border-t border-dashed border-border-1 pt-4 text-body-sm text-text-tertiary">
          {labels.note}
        </p>
        {updatedLabel ? (
          <p
            data-testid="verify-updated"
            className="mt-3 mb-0 text-body-sm font-extrabold text-text-tertiary"
          >
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
