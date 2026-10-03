import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createTranslator, type Messages } from 'next-intl';
import { describe, expect, it } from 'vitest';
import { RATE, role } from '@/lib/calculator/__tests__/fixtures';
import { effectiveFromLabel, effectiveYear, salaryFloor } from '@/lib/calculator';
import { formatInt, formatTRY } from '@/lib/format/money';
import en from '@/messages/en.json';
import tr from '@/messages/tr.json';
import { BundleSchema } from '../../../../../../../contract/website-bundle.v1';
import { makeCardCopy, makePassCopy, makeQuotaCopy, multiplierNumber, type SysT } from '../copy';

const MESSAGES = { tr: tr as Messages, en: en as Messages };
const sysOf = (locale: 'tr' | 'en') =>
  createTranslator({ locale, messages: MESSAGES[locale], namespace: 'sys' });
const strings = (locale: 'tr' | 'en') =>
  BundleSchema.parse(
    JSON.parse(
      readFileSync(join(process.cwd(), 'src', 'content', 'local', `bundle.${locale}.json`), 'utf8'),
    ),
  ).strings;

/** The page-level keys the server reads directly (the copy factories cover the rest). */
const PAGE_KEYS = [
  'seo.calc.title',
  'seo.calc.description',
  'calc.hero.badge',
  'calc.skeleton.activate',
  'calc.empty.title',
  'calc.empty.body',
  'calc.jump.label',
  'calc.a11y.decrease',
  'calc.a11y.increase',
  'calc.a11y.headcountPresets',
  'calc.a11y.industries',
  'calc.exemptions.tenStaff',
  'calc.exemptions.twentyStaff',
  'calc.exemptions.upTo5',
  'calc.exemptions.full',
  'calc.exemptions.timing',
  'calc.exemptions.upTo3',
  'calc.exemptions.exceptional',
  'calc.whatsapp.generic',
  'calc.quote.loading',
  'calc.quote.attached',
  'calc.summary.none',
  'calc.summary.rates',
] as const;

const get = (obj: unknown, path: string) =>
  path
    .split('.')
    .reduce<unknown>(
      (o, k) => (o && typeof o === 'object' ? (o as Record<string, unknown>)[k] : undefined),
      obj,
    );
const args = (s: string) =>
  [...new Set([...s.matchAll(/\{([a-zA-Z]+)[,}]/g)].map((m) => m[1]))].sort();

/** Every key the three factories read, recorded by calling each function once. */
function factoryKeys(): string[] {
  const seen: string[] = [];
  const rec: SysT = (key) => {
    seen.push(key);
    return key;
  };
  const card = makeCardCopy(rec);
  const quota = makeQuotaCopy(rec);
  const pass = makePassCopy(rec);
  card.forWorkers('2');
  card.nMonths(6);
  card.seasonTotal(6);
  card.threshold('a', 'm');
  card.yearNote(12, 1);
  card.whatsappEstimate('1', 'r', 's', 12);
  quota.allowed(1);
  quota.msgNo(1, 5, '4');
  quota.msgMore(5, 1);
  quota.vsOver('1', '5');
  quota.vizNone('4');
  quota.vizFull('25', 5, 5);
  quota.vizPart(1, 4, '1');
  quota.vizCap('9', 8, 0, '5');
  pass.count(1, 5, 4);
  pass.quotaOk('25', '5', '1');
  pass.quotaNo('9', '45', '25');
  pass.quotaFix('45', '9');
  pass.salary('r', 'a', 'm');
  pass.salaryFix('a');
  pass.amberN(2);
  pass.redN(2);
  pass.unanswered();
  pass.whatsapp('r', 1, '25', 's');
  return seen;
}

describe('sys.calc — every key exists in both locales with the same ICU arguments (W9/W23)', () => {
  const keys = [...new Set([...PAGE_KEYS, ...factoryKeys()])];
  it('reads 47 keys in all (45 under sys.calc, 2 under sys.seo.calc)', () => {
    expect(keys).toHaveLength(47);
  });
  for (const key of keys) {
    it(key, () => {
      const t = get(tr, `sys.${key}`);
      const e = get(en, `sys.${key}`);
      expect(typeof t, `tr sys.${key}`).toBe('string');
      expect(typeof e, `en sys.${key}`).toBe('string');
      expect(args(t as string), key).toEqual(args(e as string));
    });
  }
});

describe('the templates reproduce the legal-flagged samples calc.557–561 at the model figures (W142)', () => {
  for (const locale of ['tr', 'en'] as const) {
    it(locale, () => {
      const S = strings(locale);
      const sys = sysOf(locale);
      const card = makeCardCopy(sys);
      const quota = makeQuotaCopy(sys);
      const pass = makePassCopy(sys);
      // COPY_DELTAS pins calc.557 to the model floor 49,545 — the exact 1.5× floor, never 50,000 (W2)
      const floor = formatTRY(salaryFloor(role('welder'), RATE), locale);
      expect(card.threshold(floor, multiplierNumber(1.5, locale))).toBe(S['calc.557']);
      expect(quota.vizFull(formatInt(25, locale), 5, RATE.quotaRatio)).toBe(S['calc.558']);
      expect(pass.quotaOk('25', '5', '1')).toBe(S['calc.559']);
      expect(card.yearNote(12, 1)).toBe(S['calc.560']);
      expect(pass.count(1, 5, 4)).toBe(S['calc.561']);
    });
  }

  it('EN hero badge equals calc.003 at the seeded rates (D17); TR drops the year-dependent suffix', () => {
    const badge = (locale: 'tr' | 'en') =>
      sysOf(locale)('calc.hero.badge', {
        // a string: an ICU number argument would be grouped ("2,026")
        year: String(effectiveYear(RATE)),
        month: effectiveFromLabel(RATE, locale),
      });
    expect(badge('en')).toBe(strings('en')['calc.003']);
    expect(badge('tr')).toBe('2026 oranları · Ocak 2026 güncellemesi');
  });
});

describe('plurals and branches', () => {
  it('EN', () => {
    const sys = sysOf('en');
    const quota = makeQuotaCopy(sys);
    const card = makeCardCopy(sys);
    expect(quota.allowed(1)).toBe('1 foreign worker');
    expect(quota.allowed(2)).toBe('2 foreign workers');
    expect(quota.msgNo(1, 5, '4')).toBe(
      'With 1 Turkish employee you do not reach the 5:1 rule yet. You need 4 more, or one of the exemptions below.',
    );
    expect(quota.vizPart(1, 4, '1')).toBe(
      '1 complete block plus 4 spare employees — 1 more unlock one further place.',
    );
    expect(quota.vizCap('10', 8, 0, '5')).toBe('10 complete blocks (first 8 shown) plus 0 spare.');
    expect(quota.vizCap('10', 8, 2, '3')).toBe(
      '10 complete blocks (first 8 shown) plus 2 spare. 3 more unlock one further place.',
    );
    expect(card.yearNote(6, 5)).toBe('6 months of payroll + one-off costs for 5 workers');
    expect(makePassCopy(sys).count(5, 5, 0)).toBe('5 of 5 checks clear');
  });
  it('TR', () => {
    const sys = sysOf('tr');
    expect(makeCardCopy(sys).yearNote(6, 5)).toBe(
      '6 aylık bordro + tek seferlik maliyetler (5 işçi için)',
    );
    expect(makeCardCopy(sys).seasonTotal(6)).toBe('6 aylık sezon toplamı');
    expect(makeQuotaCopy(sys).allowed(3)).toBe('3 yabancı işçi');
    expect(multiplierNumber(1.5, 'tr')).toBe('1,5');
    expect(multiplierNumber(1, 'en')).toBe('1');
  });
});
