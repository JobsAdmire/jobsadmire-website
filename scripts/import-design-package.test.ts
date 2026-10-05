import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { BundleSchema } from '../contract/website-bundle.v1';
import { METRIC_KEYS, PAGE_KEYS } from '../src/content/collections';
import { buildBundles, buildNav, PlaceholdersSchema, rev } from './import-design-package';

const { tr, en, catalogue, report } = buildBundles();
const readJson = (rel: string) => JSON.parse(readFileSync(join(__dirname, rel), 'utf8'));
const overrides = readJson('content-overrides.json') as Record<
  string,
  { en?: string; tr?: string }
>;
const placeholders = readJson('metric-placeholders.json') as {
  literals: Record<string, string[]>;
  strings: Record<string, { key: string }[]>;
};
const baseline = readJson('metric-lint-baseline.json') as Record<string, string>;
const countriesFile = readJson('data/countries.json') as { code: string }[];

describe('import-design-package — strings', () => {
  it('imports every id in both locales with the same key set', () => {
    expect(Object.keys(tr.strings).length).toBe(3505);
    expect(Object.keys(en.strings).sort()).toEqual(Object.keys(tr.strings).sort());
  });
  it('keeps the seven deliberately-empty Turkish fragments empty', () => {
    // availworkers.026 is the seventh (W220 W-01): the locative moved into availworkers.025
    for (const id of [
      'hire.141',
      'calc.041',
      'calc.154',
      'calc.157',
      'calc.367',
      'jt.107',
      'availworkers.026',
    ]) {
      expect(tr.strings[id]).toBe('');
      expect(en.strings[id]).not.toBe('');
    }
  });
  it('records 380 legal strings in the catalogue', () => {
    expect(Object.values(catalogue).filter((c) => c.legal).length).toBe(380);
  });
  it('carries no HTML entities in values (the &amp; bug from the design)', () => {
    const bad = Object.entries(en.strings).filter(([, v]) => /&(amp|middot|nbsp);/.test(v));
    expect(bad).toEqual([]);
  });
  it('computes rev with the package algorithm (djb2, base-36)', () => {
    expect(rev('Get it on Google Play')).toBe('vaoule');
    expect(rev('Karachi · Tech office')).toBe('1dihier');
  });
});

describe('import-design-package — W7 overrides', () => {
  it('applies the 63-id override table and logs every locale value it changed', () => {
    // 25 + calc.131 (T3 review A2, W190) + availworkers.025, verify.042/043/016 and calc.483
    // (QA W220 W-01 / V-02 / V-03 / calc-01) + the QA round-2 set (W221 E/A + conventions, W222 (4)):
    // 34 ids / 49 values — hire.201/203/215/221, 17 wording fixes, the brand / UK-English /
    // SEO-length conventions and the two capitalised leading tails
    // parity pass (owner 2026-10-05): the home.197 override is gone — the footer's Karachi label
    // is the package's "Teknoloji ofisi" again (one id, two values)
    expect(Object.keys(overrides)).toHaveLength(63);
    expect(report.overrides).toHaveLength(82);
    for (const row of report.overrides) expect(row.before).not.toBe(row.after);
  });
  it('fixes the three TR package defects', () => {
    expect(tr.strings['hire.043']).toBe('4 iş saati içinde geri dönüş');
    expect(en.strings['hire.043']).toBe('Reply in 4 working hours');
    // W220 W-01: the Turkish h1 is 024 + 025 — the locative joins the highlighted fragment
    expect(tr.strings['availworkers.025']).toBe("Türkiye'de başlamaya hazır"); // straight ' (W221)
    expect(tr.strings['availworkers.026']).toBe('');
    expect(en.strings['availworkers.025']).toBe('ready to start');
    expect(tr.strings['blogarticle.033']).toBe('işveren');
    expect(tr.strings['blogarticle.032']).toBe('Çalışma izni başvurusunu');
  });
  it('applies the QA W220 copy overrides — TR only, EN verbatim', () => {
    // V-02: the step-2 composition reads "İkisi de bir kayıt açmalıdır: bu sayfada. QR kodu…"
    expect(tr.strings['verify.042']).toBe('İkisi de bir kayıt açmalıdır:');
    expect(tr.strings['verify.043']).toBe('bu sayfada');
    expect(en.strings['verify.042']).toBe('Both must open a record on');
    expect(en.strings['verify.043']).toBe('this page');
    // V-03: the TR tail opens the label (tailFirst), so it is capitalised
    expect(tr.strings['verify.016']).toBe('Sahtekârı');
    expect(en.strings['verify.016']).toBe('an Impostor');
    // calc-01: the package's own typo, spelling only on a legal-flagged row (W190 A2)
    expect(tr.strings['calc.483']).toMatch(/aylık fark küçüktür\.$/);
    expect(tr.strings['calc.483']).not.toContain('aylk');
    expect(en.strings['calc.483']).toContain('the difference per month');
    expect(catalogue['calc.483'].legal).toBe(true);
    expect(catalogue['calc.483'].edits).toEqual(['override']);
  });
  it('keeps store-badge micro-copy English on the seven page files and the two chrome ids (W51)', () => {
    for (const id of [
      'partner.162',
      'partner.163',
      'contact.143',
      'contact.144',
      'availworkers.131',
      'availworkers.132',
      'success.105',
      'success.106',
      'blog.068',
      'blog.069',
      'blogarticle.117',
      'blogarticle.118',
      'crmlogin.017',
      'crmlogin.018',
      'hire.240',
      'hire.241',
    ])
      expect(tr.strings[id], id).toBe(en.strings[id]);
    expect(tr.strings['hire.240']).toBe('Get it on Google Play');
    expect(tr.strings['hire.241']).toBe('Download on the App Store');
  });
  it('makes Karachi the sourcing office (label ids + home.134 body)', () => {
    for (const id of ['hire.231', 'about.126', 'contact.137']) {
      expect(en.strings[id]).toBe('Karachi · Sourcing office');
      expect(tr.strings[id]).toBe('Karaçi · Tedarik ofisi');
    }
    // Owner 2026-10-05 (parity pass): the footer's canonical Karachi label is the design's own
    // "Teknoloji ofisi" again — the W7 override for home.197 is gone.
    expect(en.strings['home.197']).toBe('Karachi · Tech office');
    expect(tr.strings['home.197']).toBe('Karaçi · Teknoloji ofisi');
    expect(en.strings['home.134']).toMatch(/^Our sourcing team/);
    expect(tr.strings['home.134']).toMatch(/^Tedarik ekibimiz/);
  });
  it('recomputes rev over the emitted English and keeps the package rev', () => {
    expect(catalogue['home.134'].packageRev).toBe('q0a2zj');
    expect(catalogue['home.134'].rev).toBe(rev(en.strings['home.134']));
    expect(catalogue['home.134'].edits).toEqual(['override']);
    expect(catalogue['hire.043'].rev).toBe('1c4wmom'); // TR-only override: English unchanged
    expect(catalogue['hire.043'].packageRev).toBeUndefined();
    expect(catalogue['hire.240'].rev).toBe('vaoule'); // TR-only override keeps the package rev
    expect(catalogue['home.001'].edits).toBeUndefined();
  });
});

describe('import-design-package — QA round 2 overrides and house style (W221, W222)', () => {
  const of = (locale: 'tr' | 'en') => (locale === 'tr' ? tr : en).strings;
  it('HW-06: the Hire Workers copy describes the door flow, never a WhatsApp hand-off', () => {
    for (const id of ['hire.201', 'hire.203', 'hire.215', 'hire.221']) {
      expect(en.strings[id], id).not.toMatch(/WhatsApp/);
      expect(tr.strings[id], id).not.toMatch(/WhatsApp/);
    }
    expect(en.strings['hire.215']).toBe('Takes 1 minute.');
    expect(tr.strings['hire.203']).toBe('— talebiniz ekibimize ulaşır');
    expect(catalogue['hire.201'].legal).toBe(true); // owner signs the words (WP-C)
    expect(catalogue['hire.201'].edits).toEqual(['override']);
  });
  it('bucket A copy: the dative, the page name, the plural, the chain tail, the labels, the spellings', () => {
    expect(tr.strings['calc.113']).toBe("'e çıkar.");
    expect(tr.strings['wp.346']).toContain('İş Ortağı Olun sayfasında');
    expect(tr.strings['wp.267']).toBe('2–6. haftalar');
    expect(tr.strings['partner.048']).toMatch(/işverenler$/);
    expect(tr.strings['partner.049']).toBe('sayfasından başlayabilir.');
    expect(en.strings['partner.118']).not.toMatch(/monthly/);
    expect(tr.strings['about.022']).toBe('Hakkında');
    expect(tr.strings['contact.115']).toContain('onaylar.');
    expect(en.strings['availworkers.144']).toBe('Which roles?');
    expect(tr.strings['availworkers.152']).toBe('Hizmet verdiğiniz sektörler');
    expect(tr.strings['availworkers.016']).toBe('Adayları gör');
    for (const id of ['home.006', 'hire.007', 'calc.316'])
      expect(tr.strings[id], id).toBe('Başarı Hikâyeleri');
    expect(tr.strings['verify.089']).toBe(
      'Bugün imzalamanız ya da ödeme yapmanız için baskı yapıyor.',
    );
    expect(tr.strings['jt.312']).toBe('pozisyonu (');
    expect(tr.strings['home.219']).toBe('Kullanım Koşulları');
    expect(tr.strings['home.228']).toMatch(/^İŞKUR İzin Belgesi No: 1730 · /);
  });
  it('house style: the brand is one word, UK English, the capitalised leading tails', () => {
    for (const locale of ['tr', 'en'] as const) {
      expect(of(locale)['partner.214']).toBe('© 2026 JobsAdmire');
      expect(of(locale)['about.023']).toBe('JobsAdmire');
    }
    expect(en.strings['about.052']).toContain('licence');
    expect(en.strings['about.080']).toContain('standardised');
    // W222 (4): the TR tails open their CTA (tailFirst), so they are title-cased like verify.016
    expect(tr.strings['wp.017']).toBe('İzin İçin');
    expect(tr.strings['partner.018']).toBe('İş Ortaklığı İçin');
    expect(tr.strings['wp.016']).toBe('Başvurun'); // the stand-alone short form at 901–1100
  });
  it('SEO lengths on the two trimmed pages: titles ≤ 66, descriptions ≤ 160 in both locales', () => {
    for (const locale of ['tr', 'en'] as const) {
      const s = of(locale);
      for (const id of ['hire.264', 'partner.222']) {
        expect(s[id].length, `${id} ${locale}`).toBeLessThanOrEqual(66);
        expect(s[id], id).toMatch(/\| JobsAdmire$/);
      }
      for (const id of ['hire.265', 'partner.223'])
        expect(s[id].length, `${id} ${locale}`).toBeLessThanOrEqual(160);
      // the same claims survive the trim
      expect(s['hire.265']).toMatch(/6–8/);
      expect(s['hire.265']).toMatch(/1730/);
      expect(s['hire.265']).toMatch(/24/);
    }
  });
  it('the apostrophe rule: every TR value is straight, EN and the catalogue rev untouched', () => {
    expect(report.apostrophe).toBe(90);
    for (const [id, v] of Object.entries(tr.strings)) expect(v, id).not.toContain('’');
    // EN keeps its three typographic apostrophes — the rule is Turkish copy only
    expect(en.strings['verify.090']).toContain('’');
    expect(catalogue['contact.027'].edits).toEqual(['apostrophe']);
    expect(catalogue['contact.027'].packageRev).toBeUndefined(); // TR-only: the package rev stands
    // an override written straight needs no normalisation (and pre-empts the Türkiye rule)
    expect(catalogue['partner.222'].edits).toEqual(['override']);
    expect(catalogue['availworkers.025'].edits).toEqual(['override']);
    // the W87 literal is matched in the straight spelling after the rule
    expect(placeholders.literals.countries).toContain("[12'den fazla] ülke");
  });
});

describe('import-design-package — Türkiye rule (W7, README)', () => {
  it('normalises every EN "Turkey" and logs the count', () => {
    // 93 package values; the W221 overrides of hire.264/265 and partner.222 already say Türkiye,
    // so the rule meets three fewer
    expect(report.turkiye).toBe(90);
    for (const v of Object.values(en.strings)) expect(v).not.toMatch(/\bTURKEY\b|\bTurkey\b/);
    expect(en.strings['availworkers.026']).toBe('in Türkiye');
    expect(en.strings['about.091']).toBe('HEAD OFFICE · TÜRKİYE');
    expect(en.strings['hire.265']).toContain('in Türkiye in 6–8 weeks');
  });
  it('reaches the blog rows’ EN title and excerpt from blog-posts.js (W220 BLOG-01)', () => {
    expect(report.turkiyeBlog).toBe(11);
    for (const bundle of [en, tr]) {
      const rows = bundle.collections.blog as { title: { en: string }; excerpt: { en: string } }[];
      expect(rows.length).toBeGreaterThan(0);
      for (const row of rows)
        expect(`${row.title.en} ${row.excerpt.en}`).not.toMatch(/\bTURKEY\b|\bTurkey\b/);
    }
    const guide = (en.collections.blog as { key: string; title: { en: string } }[]).find(
      (p) => p.key === 'turkey-work-permit-process-employer-guide',
    )!;
    expect(guide.title.en).toMatch(/^Türkiye work permit process/);
  });
  it('leaves "Turkish" alone', () => {
    expect(Object.values(en.strings).filter((v) => /\bTurkish\b/.test(v)).length).toBe(88);
  });
});

describe('import-design-package — metric placeholders (W1, D17)', () => {
  it('re-authors the 41 listed ids in both locales and logs 44 replacements', () => {
    expect(Object.keys(placeholders.strings)).toHaveLength(41);
    expect(report.placeholders).toHaveLength(44);
    for (const [id, entries] of Object.entries(placeholders.strings))
      for (const { key } of entries) {
        expect(tr.strings[id], `${id} tr`).toContain(`{${key}}`);
        expect(en.strings[id], `${id} en`).toContain(`{${key}}`);
        expect(catalogue[id].edits).toContain('placeholder');
        expect(catalogue[id].legal).toBe(false);
      }
  });
  it('replaces only the value span, so the copy keeps its unit word', () => {
    expect(en.strings['about.057']).toBe('{placed} workers placed, {employers} clients');
    expect(tr.strings['about.057']).toBe('{placed} işçi yerleştirildi, {employers} müşteri');
    expect(tr.strings['about.082']).toBe(
      'Yapay zekâmız {countries} ülkeden adayları tam olarak sizin ihtiyacınıza eşleştirir — doğru beceriler, ilk seferde.',
    );
    expect(en.strings['home.107']).toBe('{homepageReplyHours} hours');
    expect(tr.strings['home.107']).toBe('{homepageReplyHours} saat');
    expect(en.strings['wp.264']).toBe('~{firstDayWeeks} weeks');
    expect(en.strings['availworkers.220']).toContain('start in {firstDayWeeksInCountry} weeks');
    expect(en.strings['availworkers.220']).toContain('about {firstDayWeeks} weeks');
    expect(tr.strings['home.120']).toBe('{countries} ülkede denetlenen iş ortağı acenteler');
    expect(en.strings['home.024']).toBe('Free proposal within {homepageReplyHours} hours');
    expect(tr.strings['blog.045']).toBe('{homepageReplyHours} saatte ücretsiz teklif');
    expect(en.strings['contact.040']).toBe('Reply within ~{replySlaHours} business hours');
  });
  it('re-authors the W87 spellings: 12+ countries → {countries}, one business day → {replySlaHours} working hours', () => {
    expect(placeholders.literals.countries).toEqual(
      expect.arrayContaining(['[12+] countries', "[12'den fazla] ülke"]),
    );
    expect(placeholders.literals.replySlaHours).toEqual(
      expect.arrayContaining(['[one business day]', '[bir iş günü]']),
    );
    expect(en.strings['partner.077']).toBe('Shortlists from {countries} countries');
    expect(tr.strings['partner.077']).toBe('{countries} ülkeden aday listeleri');
    // the unit moves with the metric: a business day is not the 4-working-hour SLA's unit
    expect(en.strings['partner.059']).toBe(
      'Ready to work together? Pick your track — we reply within {replySlaHours} working hours.',
    );
    expect(tr.strings['partner.059']).toBe(
      'Birlikte çalışmaya hazır mısınız? Yolunuzu seçin — {replySlaHours} iş saati içinde yanıt veriyoruz.',
    );
    expect(catalogue['partner.059'].packageRev).toBe('udmxuf');
    expect(catalogue['partner.059'].rev).toBe(rev(en.strings['partner.059']));
    // the literal finder over the new spellings: no other id carries them, in either locale
    const hits = (strings: Record<string, string>, re: RegExp) =>
      Object.keys(strings).filter((id) => re.test(strings[id]));
    expect(hits(en.strings, /12\+|one business day/i)).toEqual([]);
    expect(hits(tr.strings, /12\+|12['’]den fazla|bir iş günü/i)).toEqual([]);
  });
  it('refuses a unit rewrite (`as`) without a pinned literal or without its {key} exactly once', () => {
    const file = (entry: Record<string, unknown>) =>
      PlaceholdersSchema.safeParse({ literals: {}, strings: { 'x.1': [entry] } }).success;
    const as = { en: '{replySlaHours} working hours' };
    expect(file({ key: 'replySlaHours', en: '[one business day]', as })).toBe(true);
    expect(file({ key: 'replySlaHours', as })).toBe(false);
    expect(file({ key: 'replySlaHours', en: '[x]', as: { en: 'working hours' } })).toBe(false);
    expect(
      file({ key: 'replySlaHours', en: '[x]', as: { en: '{replySlaHours}–{replySlaHours}' } }),
    ).toBe(false);
  });
  it('lists only legal-flagged or not-a-metric strings in the baseline', () => {
    expect(Object.keys(baseline)).toHaveLength(32);
    for (const [id, reason] of Object.entries(baseline)) {
      expect(en.strings[id].length, id).toBeGreaterThan(0);
      if (reason.startsWith('legal:')) expect(catalogue[id].legal, id).toBe(true);
      else expect(reason, id).toMatch(/^not-a-metric: /);
    }
  });
  it('has a literal spelling for every metric that carries a value', () => {
    for (const key of METRIC_KEYS) expect(placeholders.literals[key], key).toBeDefined();
  });
});

describe('import-design-package — collections', () => {
  const metrics = tr.collections.metrics as {
    key: string;
    value: number | null;
    text: string | null;
    suffix: string;
  }[];
  it('emits the W1 metric set', () => {
    expect(metrics.map((m) => [m.key, m.value, m.text, m.suffix])).toEqual([
      ['placed', 470, null, '+'],
      ['employers', 22, null, '+'],
      ['countries', 13, null, ''],
      ['permitDays', 45, null, ''],
      ['firstDayWeeks', null, '6–8', ''],
      ['firstDayWeeksInCountry', null, '4–6', ''],
      ['replySlaHours', 4, null, ''],
      ['homepageReplyHours', 24, null, ''],
      ['sectors', 6, null, ''],
    ]);
  });
  it('emits the W2 rate config', () => {
    expect(tr.collections.rateConfig).toEqual([
      {
        version: '2026-01',
        effectiveFrom: '2026-01-01',
        reviewDueAt: '2026-12-20',
        updatedAt: '2026-01-15',
        currency: 'TRY',
        legalMinGross: 33030,
        sgkEmployerRate: 0.2175,
        sgkRates: { manufacturing: 0.1875, other: 0.2175, none: 0.2375 },
        supportMonthly: 1270,
        permitFeeTRY: 16000,
        flightTRY: 12000,
        housingMonthlyTRY: 5000,
        quotaRatio: 5,
      },
    ]);
  });
  it('emits the 12 calculator roles exactly as the design table, plus the 3 homepage presets', () => {
    const roles = tr.collections.calculatorRoles as {
      key: string;
      preset: boolean;
      industry: string | null;
      salaryMin: number | null;
      salaryMax: number | null;
      multiplier: number;
    }[];
    const html = readFileSync(
      join(__dirname, '..', 'design-package', 'design', 'Hiring Cost Calculator.dc.html'),
      'utf8',
    );
    const design = [
      ...html.matchAll(
        /\{ v: "(\w+)", label: "[^"]+", industry: "(\w+)", min: (\d+), max: (\d+), mult: ([\d.]+) \}/g,
      ),
    ].map((m) => [m[1], m[2].toLowerCase(), Number(m[3]), Number(m[4]), Number(m[5])]);
    expect(design).toHaveLength(12);
    expect(
      roles
        .filter((r) => !r.preset)
        .map((r) => [r.key, r.industry, r.salaryMin, r.salaryMax, r.multiplier]),
    ).toEqual(design);
    expect(roles.filter((r) => r.preset).map((r) => r.multiplier)).toEqual([1, 1.5, 2]);
  });
  it('emits 13 upper-case source countries (source-map.js + Sri Lanka) with locale names and dial codes (W25, W40)', () => {
    type Row = { code: string; nameId: string | null; name: string; dial: string; flag: string };
    const rows = tr.collections.sourceCountries as Row[];
    expect(rows.map((c) => c.code)).toEqual([
      'PK',
      'NP',
      'IN',
      'UZ',
      'KG',
      'TM',
      'PH',
      'ID',
      'RU',
      'ML',
      'SN',
      'CM',
      'LK',
    ]);
    const uz = (locale: typeof tr) =>
      (locale.collections.sourceCountries as Row[]).find((c) => c.code === 'UZ')!.name;
    expect(uz(tr)).toBe('Özbekistan');
    expect(uz(en)).toBe('Uzbekistan');
    const sn = rows.find((c) => c.code === 'SN')!;
    expect(sn.nameId).toBeNull();
    expect(sn.name).toBe('Senegal');
    expect(sn.flag).toBe('🇸🇳');
    expect(rows.find((c) => c.code === 'PK')!.dial).toBe('+92');
    expect(rows.find((c) => c.code === 'LK')!.dial).toBe('+94');
  });
  it('emits the general country list from scripts/data/countries.json (W25)', () => {
    type Row = { code: string; name: string; dial: string };
    const rows = tr.collections.countries as Row[];
    expect(rows).toHaveLength(countriesFile.length);
    expect(rows).toHaveLength(64);
    expect(new Set(rows.map((c) => c.code)).size).toBe(rows.length);
    for (const c of rows) {
      expect(c.code).toMatch(/^[A-Z]{2}$/);
      expect(c.dial).toMatch(/^\+\d{1,4}$/);
    }
    expect(rows.find((c) => c.code === 'TR')).toEqual({ code: 'TR', name: 'Türkiye', dial: '+90' });
    expect(rows.find((c) => c.code === 'DE')!.name).toBe('Almanya');
    expect((en.collections.countries as Row[]).find((c) => c.code === 'DE')!.name).toBe('Germany');
    const codes = new Set(rows.map((c) => c.code));
    for (const s of tr.collections.sourceCountries as Row[])
      expect(codes.has(s.code), s.code).toBe(true);
  });
  it('emits the two offices, the seven sectors and 22 blog rows', () => {
    expect(
      (tr.collections.offices as { key: string; kind: string; hours: { days: number[] } }[]).map(
        (o) => [o.key, o.kind, o.hours.days],
      ),
    ).toEqual([
      ['antalya', 'hq', [1, 2, 3, 4, 5]],
      ['karachi', 'sourcing', [1, 2, 3, 4, 5, 6]],
    ]);
    expect((tr.collections.sectors as { key: string }[]).map((s) => s.key)).toEqual([
      'factory',
      'construction',
      'tourism',
      'agriculture',
      'textile',
      'logistics',
      'other',
    ]);
    const blog = tr.collections.blog as {
      key: string;
      slug: { tr: string | null };
      hasBody: { tr: boolean; en: boolean };
      publishedAt: string;
      readMinutes: number;
    }[];
    expect(blog).toHaveLength(22);
    expect(blog.filter((p) => p.slug.tr).length).toBe(4);
    expect(blog.filter((p) => p.hasBody.en).length).toBe(1);
    expect(blog.filter((p) => p.hasBody.tr).length).toBe(0);
    expect(blog[0]).toMatchObject({
      key: 'turkey-work-permit-process-employer-guide',
      publishedAt: '2026-06-12',
      readMinutes: 8,
      slug: { tr: 'yabanci-isciler-calisma-izni-rehberi' },
    });
    expect(report.blog).toEqual({ rows: 22, trBodies: 0, navVisible: false }); // the threshold flag is report-only now
  });
  it('carries the one written article as Markdown composed from the Blog Article package ids (W28)', () => {
    type Row = {
      key: string;
      hasBody: { tr: boolean; en: boolean };
      body: { tr: string | null; en: string | null };
    };
    const blog = tr.collections.blog as Row[];
    expect(blog.filter((p) => p.body.en !== null)).toHaveLength(1);
    expect(blog.filter((p) => p.body.tr !== null)).toHaveLength(0);
    const guide = blog.find((p) => p.key === 'turkey-work-permit-process-employer-guide')!;
    expect(guide.hasBody).toEqual({ en: true, tr: false });
    const body = guide.body.en!;
    expect(body.startsWith(en.strings['blogarticle.025'])).toBe(true);
    expect(body).toContain(
      `> **${en.strings['blogarticle.026']}**\n>\n> - ${en.strings['blogarticle.027']}`,
    );
    expect(body).toContain(`\n\n## ${en.strings['blogarticle.031']}\n\n`);
    expect(body).toContain('Work permits are applied for by the **employer**, not the worker.');
    expect(body).toContain(
      `**${en.strings['blogarticle.035']}** — ${en.strings['blogarticle.036']}`,
    );
    expect(body).toContain(
      `- ${en.strings['blogarticle.041']}\n- ${en.strings['blogarticle.042']}`,
    );
    expect(body).toContain(
      `1. **${en.strings['blogarticle.048']}** ${en.strings['blogarticle.049']}`,
    );
    expect(body.endsWith(`> ${en.strings['blogarticle.063']}`)).toBe(true);
    expect(body).not.toMatch(/\bTurkey\b/);
    expect(body).not.toMatch(/\{[a-z]+\}/i);
    expect((en.collections.blog as Row[]).find((p) => p.key === guide.key)!.body).toEqual(
      guide.body,
    );
  });
  it('emits the one founder row, published with the owner photo (W86 closed 2026-10-05)', () => {
    const row = {
      name: 'Haris Jiva',
      titleId: 'about.047',
      photoSrc: '/team/haris-jiva.jpg',
      published: true,
    };
    expect(tr.collections.founder).toEqual([row]);
    expect(en.collections.founder).toEqual([row]);
    expect(en.strings['about.047']).toBe('Founder & CEO, JobsAdmire');
  });
  it('resolves every *Id field of every row to a catalogue id', () => {
    for (const rows of Object.values(tr.collections))
      for (const row of rows)
        for (const [k, v] of Object.entries(row))
          if (/Id$/.test(k) && typeof v === 'string')
            expect(v in catalogue, `${k}=${v}`).toBe(true);
  });
});

describe('import-design-package — nav and pages', () => {
  it('always lists /blog (owner 2026-10-05), fills five groups and carries the portal row only in the groups (W36)', () => {
    const hrefs = (group: string) => tr.nav.filter((n) => n.group === group).map((n) => n.href);
    // owner 2026-10-05: the portal row is the external partner-portal login (new tab); the
    // /portal-login chooser page is retired
    const portal = 'https://portal.jobsadmire.com/auth/login';
    // the design's order (Homepage v4 ll. 289–297 / 315–327): About first
    expect(hrefs('desktopNav')).toEqual([
      '/about',
      '/hire-workers',
      '/available-workers',
      '/work-permit',
      '/hiring-cost-calculator',
      '/success-stories',
      '/blog',
      '/verify',
      '/partner-with-us',
      '/careers',
      '/contact',
    ]);
    expect(hrefs('hamburger')).toEqual([...hrefs('desktopNav'), portal]);
    expect(hrefs('slimBarRight')).toEqual(['/blog', '/careers', '/verify', portal]);
    expect(hrefs('footerEmployers')).toEqual([
      '/hire-workers',
      '/available-workers',
      '/hiring-cost-calculator',
      '/work-permit',
      '/verify',
      portal,
    ]);
    expect(hrefs('footerCompany')).toEqual([
      '/about',
      '/success-stories',
      '/blog',
      '/partner-with-us',
      '/careers',
      '/contact',
    ]);
    for (const g of ['slimBarLeft', 'footerContact', 'mobileBottomBar', 'socialRail'])
      expect(hrefs(g)).toEqual([]);
    expect(tr.nav).toHaveLength(39);
    expect(tr.nav.find((n) => n.href === '/verify')?.labelId).toBe('home.011');
    expect(tr.strings['home.011']).toBe('Temsilci Doğrulama');
    expect(
      tr.nav.filter((n) => n.href === portal).map((n) => [n.group, n.labelId, n.external]),
    ).toEqual([
      ['hamburger', 'home.012', true],
      ['slimBarRight', 'home.012', true],
      ['footerEmployers', 'home.012', true],
    ]);
    // the portal login rows are the only external rows, in both locales
    expect(tr.nav.filter((n) => n.external)).toHaveLength(3);
    expect(en.nav.filter((n) => n.external)).toHaveLength(3);
    for (const group of new Set(tr.nav.map((n) => n.group))) {
      const rows = tr.nav.filter((n) => n.group === group);
      expect(
        rows.map((n) => n.order),
        group,
      ).toEqual(rows.map((_, i) => i));
    }
  });
  it('puts /blog in four groups (always — the threshold no longer gates the nav)', () => {
    const visible = buildNav();
    expect(visible).toHaveLength(39);
    const groups = visible.filter((n) => n.href === '/blog').map((n) => [n.group, n.labelId]);
    expect(groups).toEqual([
      ['desktopNav', 'home.010'],
      ['hamburger', 'home.010'],
      ['slimBarRight', 'home.013'],
      ['footerCompany', 'home.013'],
    ]);
    expect(
      visible
        .filter((n) => n.group === 'desktopNav')
        .map((n) => n.href)
        .indexOf('/blog'),
    ).toBe(6);
  });
  it('emits one page record per PAGE_KEYS entry with package SEO ids where they exist', () => {
    expect(Object.keys(tr.pages).sort()).toEqual([...PAGE_KEYS].sort());
    expect(tr.pages.hire).toMatchObject({
      titleId: 'hire.264',
      descriptionId: 'hire.265',
      robots: 'index',
    });
    expect(tr.pages.partner).toMatchObject({
      titleId: 'partner.222',
      descriptionId: 'partner.223',
    });
    expect(tr.pages.home).toMatchObject({
      titleId: '',
      descriptionId: '',
      ogImage: null,
      canonical: null,
      jsonLd: ['organization', 'website', 'faq'],
    });
    expect(tr.pages.blog.robots).toBe('index'); // owner 2026-10-05
    for (const key of ['blogArticle', 'thankYou', 'newsletterConfirm', 'newsletterUnsubscribe'])
      expect(tr.pages[key].robots, key).toBe('noindex');
    expect(tr.pages.careersDetail.jsonLd).toEqual(['breadcrumb', 'jobPosting']);
    expect(tr.pages.blogArticle.jsonLd).toEqual(['breadcrumb', 'article', 'faq']);
  });
  it('validates against the frozen contract without a contract change', () => {
    expect(() => BundleSchema.parse(tr)).not.toThrow();
    expect(() => BundleSchema.parse(en)).not.toThrow();
    expect(tr.contractVersion).toBe('1.0');
    expect(Object.keys(tr.collections)).toEqual([
      'metrics',
      'rateConfig',
      'calculatorRoles',
      'sourceCountries',
      'countries',
      'offices',
      'sectors',
      'blog',
      'founder',
    ]);
  });
});
