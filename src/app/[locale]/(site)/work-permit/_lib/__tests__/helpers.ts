import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createTranslator, type Messages } from 'next-intl';
import { makeTf } from '@/content/pure';
import type { Locale } from '@/i18n/routing';
import en from '@/messages/en.json';
import tr from '@/messages/tr.json';
import { BundleSchema, type Bundle } from '../../../../../../../contract/website-bundle.v1';
import type { SysT } from '../wizard-props';

/** The real LOCAL bundles read from disk — the sanctioned test bypass (D23 governs how the
 *  running site loads a bundle, never a test fixture read): the tests render the package's
 *  own copy, so an unknown id throws exactly as `makeTf` does in development. */
export function loadBundle(locale: Locale): Bundle {
  return BundleSchema.parse(
    JSON.parse(
      readFileSync(join(process.cwd(), 'src', 'content', 'local', `bundle.${locale}.json`), 'utf8'),
    ),
  );
}
export const BUNDLES: Record<Locale, Bundle> = { tr: loadBundle('tr'), en: loadBundle('en') };
export const tfFor = (locale: Locale) => makeTf(BUNDLES[locale], locale);

// `Messages` (next-intl's un-augmented `Record<string, any>`) keeps the key typing loose,
// exactly as `formatReadMinutes.ts` does.
const MESSAGES: Record<Locale, Messages> = { tr, en };
/** The `sys` translator in the call shape the page hands to the `_lib` builders
 *  (`getTranslations('sys')`). */
export function sysFor(locale: Locale): SysT {
  const t = createTranslator({ locale, messages: MESSAGES[locale], namespace: 'sys' });
  return (key, values) => t(key, values);
}

/** An element's class list as tokens. */
export const tokens = (el: Element) => (el.getAttribute('class') ?? '').split(/\s+/);
