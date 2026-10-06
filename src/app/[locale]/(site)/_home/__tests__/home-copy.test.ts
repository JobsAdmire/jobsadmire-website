import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { getRateConfig } from '@/content/collections';
import { makeTf } from '@/content/pure';
import { effectiveYear, sgkRateLabel } from '@/lib/calculator';
// Authoring-time data (W143): a TEST may read it; no module under src/ does (M18 guard).
import { COPY_DELTAS } from '@/lib/calculator/copy-deltas';
import { formatTRY } from '@/lib/format/money';
import en from '@/messages/en.json';
import tr from '@/messages/tr.json';
import { homeBundle } from './fixtures';

/** Every `sys.*` key the homepage reads (W9/W23). A missing key throws at render in dev and
 *  renders the raw key in production, so the set is pinned here. */
const HOME_SYS_KEYS = [
  'seo.home.title',
  'seo.home.description',
  'home.form.callbackSubmit',
  'home.whatsapp.hire',
  'home.whatsapp.partner',
  'home.whatsapp.estimate',
  'home.pool.empty.title',
  'home.pool.empty.body',
  'home.pool.empty.cta',
  'home.calc.eyebrowUndated',
  'home.calc.grossFloor',
  'home.calc.supportSeparate',
  'home.calc.headcount',
  'home.calc.monthlyPayroll',
  'home.season.agricultureSub',
  'home.season.range',
  'home.season.also',
  'home.season.signBy',
  'home.season.noPeak',
  'home.season.gridLabel',
  'home.season.selectHint',
  'home.network.mapTitle',
  'home.network.turkiye',
  'home.portal.platforms',
  'home.press.title', // W249: the press strip
  'home.press.sub',
  'home.press.cta',
] as const;

function get(obj: unknown, path: string): unknown {
  return path
    .split('.')
    .reduce<unknown>((acc, k) => (acc as Record<string, unknown> | undefined)?.[k], obj);
}
const sysOf = (messages: unknown) => (messages as { sys: unknown }).sys;

describe('sys.home.* / sys.seo.home.* (W9/W23/W80)', () => {
  it.each(HOME_SYS_KEYS)('%s is a non-empty string in both message files', (key) => {
    for (const messages of [tr, en]) {
      const value = get(sysOf(messages), key);
      expect(typeof value, key).toBe('string');
      expect((value as string).length).toBeGreaterThan(0);
    }
  });

  it('sys.home is the homepage object; the Home crumb stays at sys.nav.home (W80)', () => {
    for (const messages of [tr, en]) {
      const home = get(sysOf(messages), 'home');
      expect(typeof home).toBe('object');
      expect(home).not.toBeNull();
      expect(typeof get(sysOf(messages), 'nav.home')).toBe('string');
    }
  });

  it('the ICU arguments are in place in both locales', () => {
    for (const messages of [tr, en]) {
      const sys = sysOf(messages);
      expect(get(sys, 'home.calc.headcount')).toMatch(/\{n, plural,/);
      expect(get(sys, 'home.calc.grossFloor')).toContain('{multiplier}');
      for (const key of ['home.season.range', 'home.season.also'])
        for (const arg of ['{from}', '{to}']) expect(get(sys, key)).toContain(arg);
      for (const arg of ['{start}', '{signBy}'])
        expect(get(sys, 'home.season.signBy')).toContain(arg);
      expect(get(sys, 'home.season.noPeak')).toContain('{permitDays}');
      for (const arg of ['{role}', '{headcount}', '{monthly}', '{oneOff}'])
        expect(get(sys, 'home.whatsapp.estimate')).toContain(arg);
    }
  });

  it('no sys.home template carries a figure — the engine and the metrics fill them (D17/W142)', () => {
    for (const messages of [tr, en]) {
      const sys = sysOf(messages);
      expect(get(sys, 'seo.home.description')).not.toMatch(/\d/);
      for (const key of ['home.calc.supportSeparate', 'home.calc.grossFloor', 'home.season.noPeak'])
        expect(get(sys, key)).not.toMatch(/\d/);
    }
  });
});

describe('the rate-bearing package copy agrees with rateConfig (D17)', () => {
  it.each(['tr', 'en'] as const)('%s: the year, the SGK rate and the one-off fees', (locale) => {
    const bundle = homeBundle(locale);
    const rc = getRateConfig(bundle);
    const tf = makeTf(bundle, locale);
    const year = String(effectiveYear(rc));
    for (const id of ['home.068', 'home.079', 'home.090']) expect(tf(id), id).toContain(year);
    expect(tf('home.081')).toContain(sgkRateLabel(rc, 'other', locale));
    expect(tf('home.086')).toContain(formatTRY(rc.permitFeeTRY, locale));
    expect(tf('home.086')).toContain(formatTRY(rc.flightTRY, locale));
  });

  it.each(['tr', 'en'] as const)(
    '%s: home.299 renders verbatim with the design figure the WP-C sheet lists (W142(a))',
    (locale) => {
      const row = COPY_DELTAS.find((r) => r.id === 'home.299');
      expect(row?.legal).toBe(true);
      expect(row?.agrees).toBe(false);
      const tf = makeTf(homeBundle(locale), locale);
      expect(tf('home.299')).toContain(formatTRY(row!.design, locale));
    },
  );
});

describe('W150: the page re-renders daily for the dated teaser badge', () => {
  it('src/app/[locale]/(site)/page.tsx exports revalidate = 86400', () => {
    expect(readFileSync('src/app/[locale]/(site)/page.tsx', 'utf8')).toMatch(
      /^export const revalidate = 86400;$/m,
    );
  });
});
