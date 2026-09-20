// Runtime-agnostic content helpers: no `server-only`, so tests and (later) client-safe
// callers can use them. Server-only loading lives in ./adapter.
import type { Bundle } from '../../contract/website-bundle.v1';
import { FIXTURE_ONLY_COLLECTIONS, type ContentSource } from './config';
import type { Locale } from '@/i18n/routing';
import { formatInt } from '@/lib/format/money';
import { getCollection } from './collections';

export class BundleUnavailableError extends Error {}

export function assertServableInProduction(
  bundle: Bundle,
  source: ContentSource,
  env = process.env.NODE_ENV,
) {
  if (env !== 'production' || source === 'OPS') return;
  const offending = FIXTURE_ONLY_COLLECTIONS.filter(
    (k) => (bundle.collections[k]?.length ?? 0) > 0,
  );
  if (offending.length)
    throw new Error(
      `collections ${offending.join(', ')} are never served from LOCAL in production (D23)`,
    );
}

/**
 * Phase A's analytics door (R54). The `LOCAL` bundle ships every analytics id as `null` — the
 * design package has none — so GTM, the consent banner and the Ads conversion are dark by
 * configuration until the Operations Integrations screen owns these values in Phase B (D12).
 * This overlays the public identifiers from the environment so a Phase A preview or production
 * deployment can turn analytics on without editing the generated bundle.
 *
 * These are `NEXT_PUBLIC_*` on purpose: a GTM container id, a GA4 measurement id, an Ads
 * conversion id and a Turnstile site key all ship in the page source by nature of how those
 * products work. They are public identifiers, not secrets. An unset or empty variable leaves
 * the bundle's own value (usually `null`) alone, so "configured nowhere" stays "off".
 *
 * Applied by `loadLocal` only — never by `loadOps`, where the CMS is the source of truth (D12).
 */
export function applyPublicSettings(bundle: Bundle, env: NodeJS.ProcessEnv): Bundle {
  const pick = (value: string | undefined, current: string | null) =>
    typeof value === 'string' && value.length > 0 ? value : current;
  const { analytics } = bundle.settings;
  return {
    ...bundle,
    settings: {
      ...bundle.settings,
      analytics: {
        ...analytics,
        ga4Id: pick(env.NEXT_PUBLIC_GA4_ID, analytics.ga4Id),
        gtmId: pick(env.NEXT_PUBLIC_GTM_ID, analytics.gtmId),
        adsId: pick(env.NEXT_PUBLIC_ADS_ID, analytics.adsId),
        adsConversionLabel: pick(
          env.NEXT_PUBLIC_ADS_CONVERSION_LABEL,
          analytics.adsConversionLabel,
        ),
      },
      turnstileSiteKey: pick(env.NEXT_PUBLIC_TURNSTILE_SITE_KEY, bundle.settings.turnstileSiteKey),
    },
  };
}

/** Content strings by package id. Empty values are legitimate (six TR fragments) and returned as ''. */
export function makeT(bundle: Bundle) {
  return (id: string): string => {
    const v = bundle.strings[id];
    if (v === undefined) {
      if (process.env.NODE_ENV !== 'production') throw new Error(`unknown string id: ${id}`);
      return '';
    }
    return v;
  };
}

const PLACEHOLDER = /\{([A-Za-z][A-Za-z0-9]*)\}/g;

/**
 * D17 placeholder fill: `{placed}` → values.placed. Unknown keys throw in development and are
 * left in place in production (R28). The pattern requires a bare identifier, so the two
 * package strings carrying mustache tokens (`{{ queryEcho }}`, verify.050/119) pass through.
 */
export function fill(template: string, values: Record<string, string>): string {
  return template.replace(PLACEHOLDER, (token, key: string) => {
    const v = values[key];
    if (v !== undefined) return v;
    if (process.env.NODE_ENV !== 'production')
      throw new Error(`fill: no value for placeholder ${token}`);
    return token;
  });
}

/** Every metric as display text: `formatInt(value) + suffix`, or `text` for ranges (W1). */
export function metricValues(bundle: Bundle, locale: Locale): Record<string, string> {
  const out: Record<string, string> = {};
  for (const m of getCollection(bundle, 'metrics'))
    out[m.key] = m.text ?? (m.value === null ? '' : `${formatInt(m.value, locale)}${m.suffix}`);
  return out;
}

/** `t(id)` with the metric placeholders filled — the accessor for re-authored package ids. */
export function makeTf(bundle: Bundle, locale: Locale) {
  const t = makeT(bundle);
  const values = metricValues(bundle, locale);
  return (id: string): string => fill(t(id), values);
}
