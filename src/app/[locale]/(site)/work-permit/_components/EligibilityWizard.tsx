'use client';
import { useEffect, useRef, useState, useSyncExternalStore, type MouseEvent } from 'react';
import { usePathname } from 'next/navigation';
import { track } from '@/analytics/track';
import { useContactClick } from '@/analytics/useContactClick';
import { ProgressBar } from '@/design/islands/ProgressBar';
import { Button } from '@/design/primitives/Button';
import { Link } from '@/i18n/navigation';
import { waLink } from '@/lib/contact';
import {
  evaluate,
  isComplete,
  prefillText,
  type PartialAnswers,
  type WizardProps,
} from '../_lib/eligibility';
import { AlertIcon, CheckIcon, ShieldIcon } from './icons';

// R18: "hydrated" is a browser fact, read through useSyncExternalStore — `false` on the server
// and while hydrating, `true` afterwards — so the page e2e can wait for a live island
// (`data-island="ready"`) without a setState in an effect.
const noSubscription = () => () => {};
const inBrowser = () => true;
const onServer = () => false;

const OPTION =
  'flex min-h-[52px] w-full items-center justify-between gap-3 rounded-xs border-[1.5px] border-border-1 bg-white px-4 py-3 text-left text-body font-bold text-ink transition-colors hover:border-blue-safe hover:bg-pale-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe';
// 44 px targets (the design's bare text buttons are ≈ 21 px tall — WCAG 2.2 target size, D20).
const QUIET =
  'inline-flex min-h-[44px] items-center justify-center text-body-sm font-bold text-text-tertiary hover:text-blue-safe focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe';

/**
 * The design's #eligibility card: four single-choice questions, a progress bar, Back / Start
 * again, a verdict with its points, a WhatsApp CTA and the Hire Workers cross-link. Every
 * string arrives resolved as a prop (W9) — nothing here reads `sys.*` (W148). State lives in
 * React only: nothing is stored and nothing reaches the door (the card promises "nothing is
 * stored", wp.045). Two side effects, both allow-listed: `eligibility_check_complete` with
 * the verdict bucket once per completed run (W26/W67 — never an answer), and
 * `whatsapp_click` (`page_cta`) when the result CTA opens the chat, whose prefilled URL is
 * composed on click and never sits in the DOM (W76/W95).
 */
export function EligibilityWizard({ locale, whatsappNumber, questions, copy }: WizardProps) {
  // R35: the real URL pathname (`/calisma-izni`), never next-intl's internal key.
  const page = usePathname() ?? '/';
  const fire = useContactClick('page_cta');
  const ready = useSyncExternalStore(noSubscription, inBrowser, onServer);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<PartialAnswers>({});
  const [done, setDone] = useState(false);
  const promptRef = useRef<HTMLParagraphElement>(null);
  const resultRef = useRef<HTMLHeadingElement>(null);
  // D20: after a pick, Back or Start again, focus follows the content the click replaced —
  // never on the first render.
  const moveFocus = useRef(false);

  useEffect(() => {
    if (!moveFocus.current) return;
    moveFocus.current = false;
    (done ? resultRef.current : promptRef.current)?.focus();
  }, [step, done]);

  const total = questions.length;
  const current = questions[step];
  const complete = done && isComplete(answers) ? answers : null;
  const outcome = complete ? evaluate(complete) : null;

  const pick = (optionKey: string) => {
    const next: PartialAnswers = { ...answers, [current.key]: optionKey };
    setAnswers(next);
    moveFocus.current = true;
    if (step < total - 1) {
      setStep(step + 1);
      return;
    }
    if (!isComplete(next)) return;
    setDone(true);
    track('eligibility_check_complete', { page, locale, result: evaluate(next).verdict });
  };
  const back = () => {
    moveFocus.current = true;
    setStep(step - 1);
  };
  const restart = () => {
    moveFocus.current = true;
    setAnswers({});
    setStep(0);
    setDone(false);
  };
  // W76/W95: the answers ride only in the URL opened here; a ctrl/cmd-click still lands in this
  // handler (the prefilled chat), only a genuine middle click reaches the bare DOM href.
  const openWhatsApp = (e: MouseEvent<HTMLElement>) => {
    fire('whatsapp');
    if (!complete || !outcome) return;
    e.preventDefault();
    const text = prefillText(
      copy.prefillIntro,
      questions,
      complete,
      copy.prefillResult[outcome.verdict],
    );
    window.open(waLink(whatsappNumber, text), '_blank', 'noopener');
  };
  const countMiddleClick = (e: MouseEvent<HTMLElement>) => {
    if (e.button === 1) fire('whatsapp');
  };

  return (
    <div
      id="eligibility"
      data-testid="wp-eligibility"
      data-island={ready ? 'ready' : undefined}
      className="w-full scroll-mt-24 overflow-hidden rounded-lg border border-tint-border bg-white text-ink shadow-[0_24px_60px_rgba(22,60,90,0.14)] max-md:rounded-md lg:scroll-mt-32 xl:scroll-mt-40"
    >
      {/* D20: `blue-safe`, not the design's #1899d5 → #1073a8 gradient (white on #1899d5 is 3.2:1). */}
      <div className="bg-blue-safe px-8 pt-6 pb-5 text-white max-md:px-4 max-md:pt-4 max-md:pb-4">
        <div className="mb-1 flex items-center justify-between gap-3">
          {/* D20: an h2 — the design's h3 sat directly under the page's h1. */}
          <h2 className="m-0 text-card-title text-white">{copy.heading}</h2>
          {done ? null : (
            <span
              data-testid="wp-eligibility-step"
              className="rounded-pill bg-white px-3 py-1 text-eyebrow font-extrabold whitespace-nowrap text-blue-safe"
            >
              {copy.progress[step]}
            </span>
          )}
        </div>
        <p className="m-0 mb-3.5 text-body-sm text-white">{copy.subtitle}</p>
        <ProgressBar
          value={done ? total : step}
          max={total}
          label={copy.progressLabel}
          tone="green"
        />
      </div>
      <div className="px-8 py-7 max-md:px-4 max-md:py-5">
        {complete && outcome ? (
          <div data-testid="wp-eligibility-result">
            <div className="mb-3.5 flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className={`flex h-9 w-9 flex-none items-center justify-center rounded-pill text-white ${outcome.verdict === 'eligible' ? 'bg-success-text' : 'bg-warning-text'}`}
              >
                {outcome.verdict === 'eligible' ? <CheckIcon size={16} /> : <AlertIcon size={16} />}
              </span>
              <h3
                ref={resultRef}
                tabIndex={-1}
                className="m-0 text-body-lg font-extrabold focus:outline-none"
              >
                {copy.titles[outcome.verdict]}
              </h3>
            </div>
            <ul className="mb-5 flex flex-col gap-2.5">
              {outcome.points.map((p) => (
                <li key={p} className="flex items-start gap-2.5 text-body-sm text-text-secondary">
                  <span
                    aria-hidden="true"
                    className="mt-2 h-1.5 w-1.5 flex-none rounded-pill bg-blue-safe"
                  />
                  <span>{copy.points[p]}</span>
                </li>
              ))}
            </ul>
            {/* W127: the WhatsApp face is `success` (the design's solid green — white on #16a34a
                is 3.3:1); the href is the bare chat (W76/W95). */}
            <Button
              variant="success"
              size="lg"
              href={`https://wa.me/${whatsappNumber}`}
              external
              className="w-full"
              onClick={openWhatsApp}
              onAuxClick={countMiddleClick}
            >
              {copy.whatsapp}
            </Button>
            <p className="m-0 mt-3 text-center text-body-sm text-text-tertiary">
              {copy.needWorkers}{' '}
              <Link
                prefetch={false}
                href="/hire-workers"
                className="font-extrabold text-blue-safe no-underline hover:underline"
              >
                {copy.seeHiring}
              </Link>
            </p>
            <button type="button" onClick={restart} className={`mt-3 w-full ${QUIET}`}>
              {copy.restart}
            </button>
          </div>
        ) : (
          <>
            <div role="group" aria-labelledby="wp-elig-q">
              <p
                id="wp-elig-q"
                ref={promptRef}
                tabIndex={-1}
                className="m-0 mb-4 text-body-lg leading-snug font-extrabold focus:outline-none"
              >
                {current.question}
              </p>
              <ul className="flex flex-col gap-2.5">
                {current.options.map((o) => (
                  <li key={o.key}>
                    <button
                      type="button"
                      className={OPTION}
                      onClick={() => pick(o.key)}
                      aria-current={answers[current.key] === o.key ? 'true' : undefined}
                    >
                      <span>{o.label}</span>
                      {answers[current.key] === o.key ? (
                        <CheckIcon size={16} className="flex-none text-blue-safe" />
                      ) : null}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            {step > 0 ? (
              <button type="button" onClick={back} className={`mt-3.5 ${QUIET}`}>
                {copy.back}
              </button>
            ) : null}
          </>
        )}
      </div>
      <p className="m-0 flex items-center gap-2 border-t border-border-3 bg-pale-2 px-8 py-3.5 text-body-sm text-text-tertiary max-md:px-4">
        <ShieldIcon size={14} className="flex-none text-success-text" />
        <span>{copy.footer}</span>
      </p>
    </div>
  );
}
