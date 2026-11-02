import {
  countryName,
  languagesLine,
  nationalityName,
  type PoolCandidate,
  type PoolLocale,
} from '@/content/pool-candidates';
import type { PoolWorker } from './pool-view';
import type { LangBand, SampleAvail } from './sample-pool';

/**
 * Real candidates (`POOL_SOURCE=OPS`, owner 2026-11-02) → the page's pool rows, every label
 * resolved in one locale (W9: the islands read no bundle). The filters keep the design's six
 * fields and bands, computed from the feed: profession = the position's key, country = the
 * nationality, industry = the position's group, the design's experience bands, the language
 * bands (`langBands`) and the availability band (`availBand`). Pure; `now` is injected.
 */

const DAY_MS = 86_400_000;
/** The design's "within 30 days" band (availworkers.208). */
export const SOON_DAYS = 30;
/** How long a newly published profile wears the "New" pill (availworkers.247). */
export const NEW_DAYS = 14;

/** 0 = available now (also a start date already passed), 1 = starts within 30 days, 2 = later. */
export function availBand(c: PoolCandidate, now: Date): SampleAvail {
  if (c.availability.status === 'NOW' || !c.availability.from) return 0;
  const start = Date.parse(c.availability.from);
  if (Number.isNaN(start)) return 0;
  const ahead = start - now.getTime();
  if (ahead <= 0) return 0;
  return ahead <= SOON_DAYS * DAY_MS ? 1 : 2;
}

/** B1 and above (or a word that says as much) — the design's "English (good|fluent)". A level
 *  the feed leaves out does not count: the filter promises good English. */
const GOOD_LEVEL = /^(?:B1|B2|C1|C2)\b|native|fluent|good|advanced|upper/i;

/** A language entry is Turkish / English by its code, or — without a code — by its label in
 *  either language ("Turkish", "Türkçe", "İngilizce"; lower-cased both ways, so the dotted and
 *  the dotless capital I both read). */
const LABELS = { tr: /^(?:turkish|türkçe|turkce)\b/, en: /^(?:english|ingilizce)\b/ } as const;
function isLang(l: PoolCandidate['languages'][number], code: 'tr' | 'en'): boolean {
  if (l.code !== null) return l.code === code;
  if (l.label === null) return false;
  const label = l.label.trim();
  return [label.toLowerCase(), label.toLocaleLowerCase('tr')].some((v) => LABELS[code].test(v));
}

/** The design's language bands, per candidate: `tr` for any Turkish, `en` for good English, both
 *  when both hold, else `other`. */
export function langBands(langs: PoolCandidate['languages']): LangBand[] {
  const bands: LangBand[] = [];
  if (langs.some((l) => isLang(l, 'tr'))) bands.push('tr');
  if (langs.some((l) => isLang(l, 'en') && l.level !== null && GOOD_LEVEL.test(l.level)))
    bands.push('en');
  return bands.length ? bands : ['other'];
}

/** The country filter's key: the ISO code, else the portal's label (one value per spelling),
 *  else '' (no value — the row joins no country chip). */
export function nationalityKey(c: PoolCandidate): string {
  if (c.nationality) return c.nationality;
  return c.nationalityLabel ? `label:${c.nationalityLabel.toLowerCase()}` : '';
}

/** A start date as the card prints it — "20 Kas 2026" / "20 Nov 2026", the day in Türkiye. */
export function startDate(iso: string, locale: PoolLocale): string {
  return new Intl.DateTimeFormat(locale === 'tr' ? 'tr-TR' : 'en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Europe/Istanbul',
  }).format(new Date(iso));
}

export type RealPoolOptions = {
  now: Date;
  /** the bundle's `sourceCountries` names in this locale (code → name) */
  countries?: ReadonlyMap<string, string>;
  /** `sys.workers.card.from` raw — "{date} itibarıyla" / "From {date}" */
  fromTemplate: string;
};

export function candidateToWorker(
  c: PoolCandidate,
  locale: PoolLocale,
  { now, countries, fromTemplate }: RealPoolOptions,
): PoolWorker {
  const avail = availBand(c, now);
  const bands = langBands(c.languages);
  const created = c.createdAt ? Date.parse(c.createdAt) : NaN;
  const age = now.getTime() - created;
  const where = [
    c.location.city,
    c.location.country ? countryName(c.location.country, locale, countries) : null,
  ].filter(Boolean);
  return {
    ref: c.ref,
    name: c.name,
    trade: c.position.label[locale],
    tradeKey: c.position.key,
    country: nationalityName(c, locale, countries),
    countryKey: nationalityKey(c),
    ...(c.nationality ? { flag: c.nationality } : {}),
    industry: c.group?.label[locale] ?? '',
    industryKey: c.group?.key ?? '',
    exp: c.yearsExperience,
    langs: languagesLine(c.languages, locale),
    lang: bands[0],
    langBands: bands,
    avail,
    ...(avail > 0 && c.availability.from
      ? { availLabel: fromTemplate.replace('{date}', startDate(c.availability.from, locale)) }
      : {}),
    tags: c.skills,
    added: !Number.isNaN(created) && age >= 0 && age <= NEW_DAYS * DAY_MS,
    ...(where.length ? { location: where.join(', ') } : {}),
    addedAt: c.addedAt,
  };
}
