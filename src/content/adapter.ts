import 'server-only';
import { cache } from 'react';
import type { Locale } from '@/i18n/routing';
import { BundleSchema, type Bundle } from '../../contract/website-bundle.v1';
import { contentSource } from './config';
import { assertServableInProduction, BundleUnavailableError } from './pure';

export * from './pure';
export { contentSource };

async function loadLocal(locale: Locale): Promise<Bundle> {
  const raw = (await import(`./local/bundle.${locale}.json`)).default as unknown;
  return BundleSchema.parse(raw);
}

async function loadOps(locale: Locale): Promise<Bundle> {
  const res = await fetch(`${process.env.OPS_API_URL}/api/website/v1/bundle?locale=${locale}`, {
    headers: { Authorization: `Bearer ${process.env.OPS_WEBSITE_READ_TOKEN}` },
    next: { revalidate: 900, tags: [`site:${locale}`] }, // time floor + tag (D8)
  });
  if (!res.ok) throw new BundleUnavailableError(`bundle ${locale}: HTTP ${res.status}`);
  const parsed = BundleSchema.safeParse(await res.json());
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
