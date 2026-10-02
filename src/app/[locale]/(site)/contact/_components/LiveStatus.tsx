'use client';
import type { Locale } from '@/i18n/routing';
import { liveStatusText, type LiveStatusSpec } from '../_lib/live-status-text';
import { officeStatus, type OfficeHours } from '../_lib/office-status';
import { useMinuteTick } from './useMinuteTick';

export type LiveStatusProps = LiveStatusSpec & {
  hours: OfficeHours;
  locale: Locale;
  /** The server and hydration text — the office row's own hours string (contact.100/106/135) —
   *  shown until the client clock is known (R18). */
  fallback: string;
  /** Appended as ` · <suffix>` to the live text (the phone cards' contact.135). */
  suffix?: string;
  /** Face only — never a display/alignment/gap utility (the base sets them, W122). */
  className?: string;
};

const DOT = {
  unknown: 'bg-muted',
  open: 'bg-success motion-safe:animate-pulse',
  closed: 'bg-warning',
} as const;

/** One open/closed pill over an `offices` row's hours. The dot is decorative; the text carries the
 *  state (D20). No live region: the text changes once a minute and would chatter. */
export function LiveStatus(props: LiveStatusProps) {
  const { hours, locale, fallback, suffix, className } = props;
  const tick = useMinuteTick();
  const status = tick === null ? null : officeStatus(new Date(tick * 60_000), hours);
  const text =
    status === null
      ? fallback
      : [liveStatusText(props, status, hours, locale), suffix].filter(Boolean).join(' · ');
  const state = status === null ? 'unknown' : status.open ? 'open' : 'closed';
  return (
    <span
      data-testid="live-status"
      data-variant={props.variant}
      data-open={status === null ? undefined : String(status.open)}
      className={['inline-flex items-center gap-2', className].filter(Boolean).join(' ')}
    >
      <span
        aria-hidden="true"
        className={['inline-block h-2 w-2 shrink-0 rounded-full', DOT[state]].join(' ')}
      />
      {text}
    </span>
  );
}
