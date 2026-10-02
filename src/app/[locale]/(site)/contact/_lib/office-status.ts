// Pure office-hours arithmetic over the `offices` rows' `hours` ({ tz, days — JS getDay() 0 = Sun
// … 6 = Sat (W43) — open, close }). Every function takes `now` as an argument, so the tests pin
// fixed instants and the islands feed it the page's minute clock (R18). `Intl` only — no date
// library reaches the client (W13). Both offices sit in zones without DST (Istanbul since 2016,
// Karachi), so a 24 h step is one calendar day.

export type OfficeHours = { tz: string; days: number[]; open: string; close: string };

export type OfficeStatus =
  | { open: true; clock: string }
  | {
      open: false;
      clock: string;
      reason: 'beforeOpen' | 'afterClose' | 'closedDay';
      /** JS getDay() index of the next open day — today when `beforeOpen`. */
      nextOpenDay: number;
      opensTomorrow: boolean;
    };

const WEEKDAY_INDEX: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

/** Weekday and wall clock of `now` in `tz` (`en-GB` parts are stable across engines; `h23` and the
 *  `% 24` guard keep midnight at `00`). */
export function localParts(now: Date, tz: string): { day: number; minutes: number; clock: string } {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: tz,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? '';
  const h = Number(get('hour')) % 24;
  const m = Number(get('minute'));
  const day = WEEKDAY_INDEX[get('weekday')];
  if (day === undefined) throw new RangeError(`localParts: no weekday for zone ${tz}`);
  return {
    day,
    minutes: h * 60 + m,
    clock: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`,
  };
}

const toMinutes = (hhmm: string): number => {
  const [h = 0, m = 0] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

/** Open or closed at `now`, and when the office opens next. A row with no open day is a data
 *  defect: closed, never a throw on a live page. */
export function officeStatus(now: Date, hours: OfficeHours): OfficeStatus {
  const { day, minutes, clock } = localParts(now, hours.tz);
  const openAt = toMinutes(hours.open);
  const closeAt = toMinutes(hours.close);
  const todayOpen = hours.days.includes(day);
  if (todayOpen && minutes >= openAt && minutes < closeAt) return { open: true, clock };
  if (todayOpen && minutes < openAt)
    return { open: false, clock, reason: 'beforeOpen', nextOpenDay: day, opensTomorrow: false };
  for (let d = 1; d <= 7; d++) {
    const next = (day + d) % 7;
    if (hours.days.includes(next))
      return {
        open: false,
        clock,
        reason: todayOpen ? 'afterClose' : 'closedDay',
        nextOpenDay: next,
        opensTomorrow: d === 1,
      };
  }
  return { open: false, clock, reason: 'closedDay', nextOpenDay: day, opensTomorrow: false };
}

/** Localized long weekday name for a JS getDay() index (2023-01-01 was a Sunday). */
export function weekdayName(day: number, locale: string): string {
  return new Intl.DateTimeFormat(locale, { weekday: 'long', timeZone: 'UTC' }).format(
    new Date(Date.UTC(2023, 0, 1 + day)),
  );
}

/** The next `count` open days AFTER today in the office's zone (the design's visit chips start
 *  tomorrow), as ISO calendar dates; looks at most 21 days ahead. */
export function nextOpenDates(now: Date, hours: OfficeHours, count: number): string[] {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: hours.tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
  });
  const out: string[] = [];
  for (let offset = 1; offset <= 21 && out.length < count; offset++) {
    const parts = fmt.formatToParts(new Date(now.getTime() + offset * 86_400_000));
    const get = (type: Intl.DateTimeFormatPartTypes) =>
      parts.find((p) => p.type === type)?.value ?? '';
    const day = WEEKDAY_INDEX[get('weekday')];
    if (day === undefined || !hours.days.includes(day)) continue;
    out.push(`${get('year')}-${get('month')}-${get('day')}`);
  }
  return out;
}

/** "Mon 28 Sept" / "28 Eyl Pzt" for an ISO calendar date — formatted in UTC so the runtime zone
 *  can never shift the day. */
export function formatVisitDay(iso: string, locale: string): string {
  return new Intl.DateTimeFormat(locale === 'tr' ? 'tr-TR' : 'en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  }).format(new Date(`${iso}T00:00:00Z`));
}
