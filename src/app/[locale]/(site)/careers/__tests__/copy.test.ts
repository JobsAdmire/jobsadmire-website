import { describe, expect, it } from 'vitest';
import en from '@/messages/en.json';
import tr from '@/messages/tr.json';

const leaves = (o: unknown, prefix = ''): [string, string][] =>
  typeof o === 'object' && o !== null
    ? Object.entries(o as Record<string, unknown>).flatMap(([k, v]) =>
        leaves(v, prefix ? `${prefix}.${k}` : k),
      )
    : [[prefix, String(o)]];

/** Every `sys.*` key this task adds (W9/W23): the careers namespace and the SEO fallbacks. */
const EXPECTED = [
  'seo.careers.title',
  'seo.careers.description',
  'careers.hero.hiringCount',
  'careers.hero.seeOpenings',
  'careers.filters.all',
  'careers.roles.resultAll',
  'careers.roles.resultFiltered',
  'careers.roles.showMore',
  'careers.roles.posted',
  'careers.workMode.REMOTE',
  'careers.workMode.HYBRID',
  'careers.workMode.ON_SITE',
  'careers.salary.range',
  'careers.salary.from',
  'careers.salary.upTo',
  'careers.salary.per.HOUR',
  'careers.salary.per.DAY',
  'careers.salary.per.WEEK',
  'careers.salary.per.MONTH',
  'careers.salary.per.YEAR',
  'careers.empty.title',
  'careers.empty.body',
  'careers.apply.whatsapp',
  'careers.apply.emailSubject',
  'careers.detail.metaTitle',
  'careers.detail.metaDescription',
  'careers.detail.about',
  'careers.detail.back',
  'careers.detail.applyLead',
  'careers.detail.whatsappIntro',
  'careers.detail.facts.title',
  'careers.detail.facts.location',
  'careers.detail.facts.workMode',
  'careers.detail.facts.languages',
  'careers.detail.facts.salary',
  'careers.detail.facts.posted',
  'careers.form.residency',
  'careers.form.expectedSalaryHint',
  'careers.form.closed',
  'careers.form.portfolioGate',
  'careers.emailPanel.title',
  'careers.emailPanel.body',
  'careers.emailPanel.subject',
  'careers.emailPanel.email',
];

const LOCALES = { en: en.sys, tr: tr.sys };
const careersKeys = (sys: unknown) =>
  new Map(
    leaves(sys).filter(([key]) => key.startsWith('careers.') || key.startsWith('seo.careers')),
  );

describe('sys.careers.* and sys.seo.careers* (W9/W23)', () => {
  it('both locales carry exactly this key set, and no value is empty', () => {
    expect(EXPECTED).toHaveLength(44);
    for (const [locale, sys] of Object.entries(LOCALES)) {
      const keys = careersKeys(sys);
      expect([...keys.keys()].sort(), locale).toEqual([...EXPECTED].sort());
      for (const [key, value] of keys) expect(value, `${locale} ${key}`).toMatch(/\S/);
    }
  });

  it('every template carries its arguments in both locales', () => {
    const ARGS: Record<string, string[]> = {
      'careers.hero.hiringCount': ['{count'],
      'careers.hero.seeOpenings': ['{count, plural,'],
      'careers.roles.resultAll': ['{count, plural,'],
      'careers.roles.resultFiltered': ['{shown}', '{total}'],
      'careers.roles.showMore': ['{count}'],
      'careers.roles.posted': ['{date}'],
      'careers.salary.range': ['{min}', '{max}'],
      'careers.salary.from': ['{amount}'],
      'careers.salary.upTo': ['{amount}'],
      'careers.detail.metaTitle': ['{title}'],
      'careers.detail.metaDescription': ['{title}', '{location}'],
      'careers.detail.whatsappIntro': ['{title}'],
      'careers.form.residency': ['{country}'],
      'careers.form.expectedSalaryHint': ['{currency}'],
      'careers.emailPanel.body': ['{email}'],
      'careers.emailPanel.subject': ['{title}'],
    };
    for (const [locale, sys] of Object.entries(LOCALES)) {
      const keys = careersKeys(sys);
      for (const [key, args] of Object.entries(ARGS))
        for (const arg of args) expect(keys.get(key), `${locale} ${key}`).toContain(arg);
    }
  });

  it('the two island templates are plain {token} strings — RolesList fills them itself (W148)', () => {
    for (const sys of Object.values(LOCALES)) {
      expect(sys.careers.roles.resultFiltered).not.toContain('plural');
      expect(sys.careers.roles.showMore).not.toContain('plural');
    }
  });

  it('the OG route reads sys.seo.<pageKey>.title without values: the index title is argument-free and the template page has no sys.seo key at all (W169, T12 pattern)', () => {
    for (const sys of Object.values(LOCALES)) {
      expect(sys.seo.careers.title).not.toContain('{');
      // W169: the detail's OG image is the index's /og/<locale>/careers.png (openGraph.images) and
      // its title template is sys.careers.detail.metaTitle; a `sys.seo.careersDetail.title` would
      // be drawn raw — `{title}` — on /og/<locale>/careersDetail.png.
      expect('careersDetail' in sys.seo).toBe(false);
    }
  });

  it('the careers thank-you line fits a per-opening application (D13)', () => {
    expect(en.sys.thankYou.forms.careers).not.toMatch(/suitable role opens/);
    expect(tr.sys.thankYou.forms.careers).not.toMatch(/pozisyon açıldığında/);
  });

  it('the portfolio hint accepts a scheme-less link — the door adds https:// itself (W178, W161)', () => {
    expect(en.sys.form.hints.portfolioUrl).toBe('A web address, e.g. behance.net/yourname.');
    expect(tr.sys.form.hints.portfolioUrl).toBe('Bir web adresi, ör. behance.net/adiniz.');
    for (const sys of Object.values(LOCALES)) {
      expect(sys.form.hints.portfolioUrl).not.toContain('https://');
    }
  });
});
