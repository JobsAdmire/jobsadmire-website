'use client';
import type { MouseEvent } from 'react';
import { ContactLink } from '@/analytics/ContactLink';
import { useContactClick } from '@/analytics/useContactClick';
import { WhatsAppIcon } from '@/design/chrome/icons';
import { Button, buttonClassName } from '@/design/primitives/Button';
import { telLink, waLink } from '@/lib/contact';
import { splitAtQuery } from '../_lib/lookup';
import { WarningIcon } from './icons';
import { LOOKUP_OUTCOME, RESULT_ID, useLookup } from './LookupContext';

/** Every label arrives resolved (W9/W148): this island calls no `useTranslations`. */
export type ResultLabels = {
  title: string; // sys.verify.lookup.resultTitle
  body: string; // sys.verify.lookup.resultBody, RAW — split here at {query}
  call: string; // verify.051
  whatsapp: string; // sys.verify.lookup.whatsapp
  whatsappIntro: string; // verify.228 — the visitor's own opening line
};

/**
 * The lookup's answer as its own card below the hero (S2.1 — the design's `#verify` no-match
 * card, Verify ll. 651–674: a 720 px card, a coloured header strip with the ⚠ glyph, the body and
 * two r12 buttons; `ja-card-in`). Phase A keeps the AMBER tone and the neutral `sys` copy: over an
 * empty register "Not on our authorised list — treat this person as unauthorised" (verify.048–050)
 * would be false about every genuine employee (W6). The header strip is the contrast-safe amber
 * (#b45309, white text 5.6:1 — D20). Announced once through the status line when it appears;
 * the echo below changes on every keystroke. W95: the WhatsApp href in the DOM is the bare chat;
 * what the visitor typed joins the message only on click.
 */
export function LookupResult({
  labels,
  phone,
  whatsappNumber,
}: {
  labels: ResultLabels;
  phone: string;
  whatsappNumber: string;
}) {
  const { query, showResult } = useLookup();
  const fireContact = useContactClick('page_cta');
  const body = splitAtQuery(labels.body);

  const askOnWhatsApp = (e: MouseEvent<HTMLElement>) => {
    fireContact('whatsapp');
    e.preventDefault();
    window.open(waLink(whatsappNumber, `${labels.whatsappIntro} ${query}`), '_blank', 'noopener');
  };

  return (
    <>
      <p role="status" className="sr-only">
        {showResult ? labels.title : ''}
      </p>
      {showResult ? (
        <div
          id={RESULT_ID}
          className="container-site scroll-mt-24 pt-[52px] pb-[34px] max-md:pt-6 max-md:pb-4"
        >
          <div
            data-testid="verify-lookup-result"
            data-outcome={LOOKUP_OUTCOME}
            className="ja-card-in mx-auto max-w-[720px] overflow-hidden rounded-lg border-2 border-warning-border bg-white shadow-[0_22px_52px_rgba(180,83,9,0.13)] xl:max-w-[540px]"
          >
            <div className="flex items-center gap-[11px] bg-warning-text px-7 py-[17px] text-white max-md:px-4">
              <WarningIcon size={18} className="shrink-0" />
              <h2 className="m-0 text-[13px] font-extrabold uppercase leading-[1.35] tracking-[1.2px] text-white max-md:text-[13px] xl:text-[11px]">
                {labels.title}
              </h2>
            </div>
            <div className="px-7 pt-6 pb-[26px] max-md:px-4 max-md:pt-4 max-md:pb-[18px]">
              <p className="m-0 mb-[18px] text-[15px] leading-[1.6] font-semibold text-text-secondary max-md:text-[14px] max-md:leading-[1.55] xl:text-[11.25px]">
                {body.before}
                {body.hasQuery ? (
                  <strong className="font-extrabold text-ink">{query}</strong>
                ) : null}
                {body.after}
              </p>
              <div className="flex flex-wrap gap-2.5">
                <ContactLink
                  href={telLink(phone)}
                  placement="page_cta"
                  className={buttonClassName(
                    'primary',
                    'md',
                    'max-md:min-h-[48px] max-md:flex-[1_1_100%]',
                    {
                      shape: 'rect',
                      radius: 12,
                    },
                  )}
                >
                  {labels.call}
                </ContactLink>
                <Button
                  variant="success-solid"
                  shape="rect"
                  radius={12}
                  href={`https://wa.me/${whatsappNumber}`}
                  external
                  onClick={askOnWhatsApp}
                  icon={<WhatsAppIcon size={16} />}
                  className="max-md:min-h-[48px] max-md:flex-[1_1_100%]"
                >
                  {labels.whatsapp}
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
