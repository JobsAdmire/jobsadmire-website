import 'server-only';
import { cache } from 'react';
import type { Locale } from '@/i18n/routing';
import { BundleSchema, type Bundle } from '../../contract/website-bundle.v1';
import { contentSource } from './config';
import { applyPublicSettings, assertServableInProduction, BundleUnavailableError } from './pure';

export * from './pure';
export { contentSource };

async function loadLocal(locale: Locale): Promise<Bundle> {
  const raw = (await import(`./local/bundle.${locale}.json`)).default as unknown;
  // R54: the environment's public analytics/Turnstile identifiers overlay the generated
  // bundle's nulls here, and here only — under OPS the CMS owns these values (D12).
  return applyPublicSettings(BundleSchema.parse(raw), process.env);
}

async function loadOps(locale: Locale): Promise<Bundle> {
  const res = await fetch(`${process.env.OPS_API_URL}/api/website/v1/bundle?locale=${locale}`, {
    headers: { Authorization: `Bearer ${process.env.OPS_WEBSITE_READ_TOKEN}` },
    next: { revalidate: 900, tags: [`site:${locale}`] }, // time floor + tag (D8)
  });
  if (!res.ok) throw new BundleUnavailableError(`bundle ${locale}: HTTP ${res.status}`);
  // R28: an HTML error page served with a 200 (a proxy, a login wall) is the same outage as
  // a 500 — one error class, so every caller's fallback path is the same one.
  let raw: unknown;
  try {
    raw = await res.json();
  } catch {
    throw new BundleUnavailableError(`bundle ${locale}: invalid JSON`);
  }
  const parsed = BundleSchema.safeParse(raw);
  if (!parsed.success)
    throw new BundleUnavailableError(
      `bundle ${locale}: contract violation ${parsed.error.issues[0]?.path.join('.')}`,
    );
  return parsed.data;
}

/** One bundle per locale per request (React cache); ISR keeps last-good HTML when OPS fails. */
export const getBundle = cache(async (locale: Locale): Promise<Bundle> => {
  const source = contentSource();
  const bundle = source === 'OPS' ? await loadOps(locale) : await loadLocal(locale);
  assertServableInProduction(bundle, source);
  return bundle;
});
