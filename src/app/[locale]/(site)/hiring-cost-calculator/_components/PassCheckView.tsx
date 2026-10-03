import type { ReactNode } from 'react';
import type { PassLabels } from '../_lib/ids';
import type { ManualRow, PassView, Tone } from '../_lib/pass-check';

/** The reset control's face (a text button, `invisible` until a manual answer exists). */
export const RESET =
  'cursor-pointer border-0 bg-transparent p-0 text-[12.5px] xl:text-[11px] font-extrabold text-text-tertiary';

const MARK = {
  yes: 'bg-success-surface text-success-text',
  no: 'bg-danger-surface text-danger',
  unsure: 'bg-warning-surface text-warning-text',
  none: 'bg-pale-1 text-text-secondary',
} as const;
const VERDICT: Record<Tone, string> = {
  idle: 'border-tint-border bg-white',
  progress: 'border-tint-border bg-white',
  green: 'border-success-border bg-success-surface',
  amber: 'border-warning-border bg-warning-surface',
  red: 'border-danger-border bg-danger-surface',
};
const ACCENT: Record<Tone, string> = {
  idle: 'text-text-tertiary',
  progress: 'text-blue-safe',
  green: 'text-success-text',
  amber: 'text-warning-text',
  red: 'text-danger',
};
const QUOTA_CHIP =
  'inline-flex min-h-[36px] items-center rounded-pill border-[1.5px] px-[15px] xl:px-[11.25px] text-body-sm font-extrabold no-underline';

/** The pass check (design 1179–1242): five rows (the quota row answered from the store), the
 *  sticky verdict, the fix list and "Send my result". `controls` (TriState / TriStateLook),
 *  `reset`, `bar` (ProgressBar / BarLook) and `send` (the click-time composer / a tracked bare
 *  link) are the only parts that differ between the island and the server fallback. calc.378
 *  holds: nothing here is posted — the state lives in the island (W3). */
export function PassCheckView({
  view,
  labels,
  controls,
  reset,
  bar,
  send,
  live,
}: {
  view: PassView;
  labels: PassLabels;
  controls: Record<ManualRow, ReactNode>;
  reset: ReactNode;
  bar: ReactNode;
  send: ReactNode;
  live: boolean;
}) {
  return (
    <div
      data-testid="pass-view"
      data-live={live}
      className="grid items-start gap-7 lg:grid-cols-[1.15fr_0.85fr]"
    >
      <div className="overflow-hidden rounded-lg border border-tint-border bg-white shadow-[0_18px_44px_rgba(22,60,90,0.10)]">
        <div className="flex items-center justify-between gap-3 border-b border-border-3 bg-pale-2 px-[26px] xl:px-[19.5px] py-4">
          <span className="text-eyebrow font-extrabold uppercase tracking-[1px] xl:tracking-[0.75px] text-text-tertiary">
            {labels.pcK}
          </span>
          {reset}
        </div>
        <ol className="m-0 list-none px-[26px] xl:px-[19.5px] pb-2 pt-2 max-md:px-[15px]">
          {view.rows.map((row) => (
            <li
              key={row.key}
              className="grid grid-cols-[30px_1fr] items-start gap-3.5 border-b border-border-3 py-[18px] xl:py-[13.5px]"
            >
              <span
                aria-hidden="true"
                className={`mt-0.5 grid h-[30px] w-[30px] place-items-center rounded-[9px] text-[14px] xl:text-[11px] font-extrabold ${MARK[row.value ?? 'none']}`}
              >
                {row.mark}
              </span>
              <div>
                <p className="m-0 mb-1 text-body font-extrabold text-ink">{row.title}</p>
                <p className="m-0 mb-[11px] xl:mb-[8.25px] text-body-sm text-text-tertiary xl:max-w-[520px]">
                  {row.body}
                </p>
                {row.key === 'quota' ? (
                  <a
                    href="#quota"
                    className={
                      view.quotaOk
                        ? `${QUOTA_CHIP} border-success-border bg-success-surface text-success-text`
                        : `${QUOTA_CHIP} border-danger-border bg-danger-surface text-danger`
                    }
                  >
                    {view.quotaOk ? labels.pcClear : labels.pcShort}
                  </a>
                ) : (
                  controls[row.key]
                )}
              </div>
            </li>
          ))}
        </ol>
        <p className="m-0 px-[26px] xl:px-[19.5px] pb-[22px] xl:pb-[16.5px] pt-4 text-body-sm text-text-tertiary max-md:px-[15px]">
          {labels.pcPriv}
        </p>
      </div>
      <div className="flex flex-col gap-4 lg:sticky lg:top-5">
        {/* QA W221 calc-05: the verdict changes with every answer — a polite, atomic live region */}
        <div
          data-testid="pass-verdict"
          data-tone={view.tone}
          aria-live="polite"
          aria-atomic="true"
          className={`rounded-lg border-[1.5px] px-[26px] xl:px-[19.5px] py-6 shadow-[0_14px_34px_rgba(22,60,90,0.08)] ${VERDICT[view.tone]}`}
        >
          <p
            className={`m-0 mb-[9px] xl:mb-[6.75px] text-eyebrow font-extrabold uppercase tracking-[1px] xl:tracking-[0.75px] ${ACCENT[view.tone]}`}
          >
            {view.kicker}
          </p>
          <p className="m-0 mb-[9px] xl:mb-[6.75px] text-[25px] font-extrabold leading-[1.2] tracking-[-0.6px] xl:tracking-[-0.45px] text-ink xl:text-[18.75px]">
            {view.title}
          </p>
          <p className="m-0 mb-4 text-body-sm text-text-secondary">{view.body}</p>
          {bar}
        </div>
        {view.fixes.length > 0 ? (
          <div className="rounded-md border border-tint-border bg-white px-6 py-[22px] xl:py-[16.5px]">
            <p className="m-0 mb-3 text-body font-extrabold text-ink">{labels.pcFix}</p>
            <ul className="m-0 flex list-none flex-col gap-[11px] xl:gap-[8.25px] p-0">
              {view.fixes.map((f) => (
                <li
                  key={f.key}
                  className="flex items-start gap-[11px] xl:gap-[8.25px] text-body-sm text-text-secondary"
                >
                  <span
                    aria-hidden="true"
                    className={
                      f.unsure
                        ? 'mt-[7px] xl:mt-[5.25px] h-2 w-2 shrink-0 rounded-pill bg-warning'
                        : 'mt-[7px] xl:mt-[5.25px] h-2 w-2 shrink-0 rounded-pill bg-danger'
                    }
                  />
                  {f.text}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {send}
      </div>
    </div>
  );
}
