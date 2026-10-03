import type { Locale } from '@/i18n/routing';
import {
  countryNameOf,
  ENGAGEMENT_OF,
  formatMoney,
  isNewOpening,
  languagesOf,
  locationOf,
  salaryCurrencyOf,
  salaryPartsOf,
  workModesOf,
  type Engagement,
  type PublicOpening,
  type SalaryPeriod,
  type WorkMode,
} from '@/lib/careers-pure';
import { formatDate } from '@/lib/format/date/formatDate';
import { askHrefOf } from '../../_lib/roles';

/** `sys.careers.salary.*` as closures (the page binds next-intl; the tests plain templates). */
export type SalaryCopy = {
  range: (min: string, max: string) => string;
  from: (amount: string) => string;
  upTo: (amount: string) => string;
  per: (period: SalaryPeriod) => string;
};

/** The pay line — null when the opening hides its pay; the money through `formatTRY` or Intl. */
export function salaryLine(o: PublicOpening, locale: Locale, copy: SalaryCopy): string | null {
  const parts = salaryPartsOf(o);
  if (!parts) return null;
  const money = (n: number) => formatMoney(n, parts.currency, locale);
  const amount =
    parts.kind === 'range' && parts.min !== null && parts.max !== null
      ? copy.range(money(parts.min), money(parts.max))
      : parts.kind === 'from' && parts.min !== null
        ? copy.from(money(parts.min))
        : parts.kind === 'upTo' && parts.max !== null
          ? copy.upTo(money(parts.max))
          : money(parts.min ?? parts.max ?? 0);
  return parts.period ? `${amount} · ${copy.per(parts.period)}` : amount;
}

export type OpeningViewCopy = {
  engagement: Record<Engagement, string>;
  workMode: Record<WorkMode, string>;
  posted: (date: string) => string;
  salary: SalaryCopy;
  askIntro: string;
  askTail: string;
};

/** Every string the detail sections render, resolved once on the server. */
export type OpeningView = {
  countryName: string;
  location: string;
  workModes: string;
  languages: string;
  engagement: string;
  posted: string;
  postedLine: string;
  pay: string | null;
  isNew: boolean;
  salaryCurrency: string | null;
  askHref: string;
};

export function openingView(
  o: PublicOpening,
  ctx: {
    locale: Locale;
    countries: ReadonlyArray<{ code: string; name: string }>;
    copy: OpeningViewCopy;
    whatsappNumber: string;
    now: Date;
  },
): OpeningView {
  const countryName = countryNameOf(o.country, ctx.countries, ctx.locale);
  const location = locationOf(o, countryName);
  const posted = formatDate(o.postedAt, ctx.locale);
  return {
    countryName,
    location,
    workModes: workModesOf(o)
      .map((mode) => ctx.copy.workMode[mode])
      .join(' · '),
    languages: languagesOf(o).join(', '),
    engagement: ctx.copy.engagement[ENGAGEMENT_OF[o.category]],
    posted,
    postedLine: ctx.copy.posted(posted),
    pay: salaryLine(o, ctx.locale, ctx.copy.salary),
    isNew: isNewOpening(o.postedAt, ctx.now),
    salaryCurrency: salaryCurrencyOf(o),
    askHref: askHrefOf(ctx.whatsappNumber, ctx.copy, o.title, location),
  };
}
