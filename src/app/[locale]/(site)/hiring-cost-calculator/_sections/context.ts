import 'server-only';
import { getTranslations } from 'next-intl/server';
import { getBundle, makeTf } from '@/content/adapter';
import { getCollection, getRateConfig } from '@/content/collections';
import type { FieldOption } from '@/forms/client/Field';
import type { Locale } from '@/i18n/routing';
import type { RateConfig } from '@/lib/calculator';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import {
  computeCardView,
  designRoles,
  roleLabelMaps,
  type CardView,
  type CardViewLabels,
  type DesignRole,
} from '../_lib/card-view';
import { makeCardCopy, type SysT } from '../_lib/copy';
import { DEFAULT_INPUTS } from '../_lib/estimate-inputs';
import {
  CARD_IDS,
  GUIDE_IDS,
  PASS_IDS,
  QUOTA_IDS,
  RECAP_IDS,
  SHEET_IDS,
  pickLabels,
  type CardLabels,
  type GuideLabels,
  type PassLabels,
  type QuotaLabels,
  type RecapLabels,
  type SheetLabels,
} from '../_lib/ids';

export type CalcLabels = {
  card: CardLabels;
  /** The four card labels the recap and the quote sheet need (islands get no more than that). */
  cardView: CardViewLabels;
  quota: QuotaLabels;
  pass: PassLabels;
  guide: GuideLabels;
  recap: RecapLabels;
  sheet: SheetLabels;
};

/** Everything the server sections read, resolved once per request. */
export type CalcCtx = {
  locale: Locale;
  bundle: Bundle;
  /** `makeTf(bundle, locale)` — W1: calc.050/101/104/381/481 carry {homepageReplyHours}. */
  t: (id: string) => string;
  /** The request locale's `sys` translator. */
  sys: SysT;
  settings: Bundle['settings'];
  rateConfig: RateConfig;
  /** The 12 design roles (W24: never the teaser presets); empty → the card's empty state. */
  roles: DesignRole[];
  roleLabels: Record<string, string>;
  industryLabels: Record<string, string>;
  labels: CalcLabels;
  /** The card at the design defaults — the skeleton, the recap and the fallbacks' first paint. */
  defaultView: CardView | null;
  /** ISO-2 values, localized names, sorted in the page's own collation. */
  countries: FieldOption[];
};

/** Pure: the context from a bundle and a `sys` translator (the unit tests call this directly). */
export function buildCalcCtx(bundle: Bundle, locale: Locale, sys: SysT): CalcCtx {
  const t = makeTf(bundle, locale);
  // Throws in every environment when absent: money never degrades silently (D17).
  const rateConfig = getRateConfig(bundle);
  const roles = designRoles(getCollection(bundle, 'calculatorRoles'));
  const { roleLabels, industryLabels } = roleLabelMaps(roles, t);
  const card = pickLabels(t, CARD_IDS);
  const cardView: CardViewLabels = {
    perWorker: card.perWorker,
    fullYear: card.fullYear,
    firstYear: card.firstYear,
    perMonthSuffix: card.perMonthSuffix,
  };
  const collator = new Intl.Collator(locale === 'tr' ? 'tr-TR' : 'en-US');
  const countries = getCollection(bundle, 'countries')
    .map((c) => ({ value: c.code, label: c.name }))
    .sort((a, b) => collator.compare(a.label, b.label));
  return {
    locale,
    bundle,
    t,
    sys,
    settings: bundle.settings,
    rateConfig,
    roles,
    roleLabels,
    industryLabels,
    labels: {
      card,
      cardView,
      quota: pickLabels(t, QUOTA_IDS),
      pass: pickLabels(t, PASS_IDS),
      guide: pickLabels(t, GUIDE_IDS),
      recap: pickLabels(t, RECAP_IDS),
      sheet: pickLabels(t, SHEET_IDS),
    },
    defaultView:
      roles.length > 0
        ? computeCardView({
            inputs: DEFAULT_INPUTS,
            roles,
            rateConfig,
            locale,
            roleLabels,
            industryLabels,
            labels: cardView,
            copy: makeCardCopy(sys),
          })
        : null,
    countries,
  };
}

/** The page's read: one bundle (React `cache()`d by the adapter) and the `sys` translator. */
export async function loadCalcCtx(locale: Locale): Promise<CalcCtx> {
  const [bundle, translate] = await Promise.all([
    getBundle(locale),
    getTranslations({ locale, namespace: 'sys' }),
  ]);
  return buildCalcCtx(bundle, locale, (key, values) => translate(key, values));
}
