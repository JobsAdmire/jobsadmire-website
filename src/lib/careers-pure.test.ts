import { describe, expect, it } from 'vitest';
import { OPENING, OPENING_WIRE, opening } from '@/test/careers';
import {
  baseSalaryOf,
  citiesOf,
  countryNameOf,
  descriptionBlocks,
  detailHref,
  employmentTypeOf,
  ENGAGEMENT_OF,
  formatMoney,
  isNewOpening,
  languagesOf,
  locationOf,
  OpeningDetailSchema,
  OpeningsPageSchema,
  parseOpenings,
  placeOf,
  PublicOpeningSchema,
  salaryCurrencyOf,
  salaryPartsOf,
  summaryOf,
  workModesOf,
} from './careers-pure';

describe('PublicOpeningSchema — the shapePublicOpening contract', () => {
  it('parses the wire shape unchanged', () => {
    expect(PublicOpeningSchema.parse(OPENING_WIRE)).toEqual(OPENING_WIRE);
  });

  it('upper-cases the country (W40) and defaults the arrays an older reader omits', () => {
    const legacy: Record<string, unknown> = { ...OPENING_WIRE, country: 'uz' };
    for (const key of ['cities', 'employmentArrangements', 'workModes', 'requiredLanguages'])
      delete legacy[key];
    const parsed = PublicOpeningSchema.parse(legacy);
    expect(parsed.country).toBe('UZ');
    expect([
      parsed.cities,
      parsed.employmentArrangements,
      parsed.workModes,
      parsed.requiredLanguages,
    ]).toEqual([[], [], [], []]);
  });

  it('accepts a hidden salary (Operations strips the numbers) and a null city, description and work mode', () => {
    const parsed = PublicOpeningSchema.parse({
      ...OPENING_WIRE,
      salaryMin: null,
      salaryMax: null,
      salaryCurrency: null,
      salaryPayType: null,
      salaryPeriod: null,
      salaryVisible: false,
      city: null,
      description: null,
      workMode: null,
    });
    expect(parsed.salaryVisible).toBe(false);
    expect([parsed.salaryMin, parsed.city, parsed.description, parsed.workMode]).toEqual([
      null,
      null,
      null,
      null,
    ]);
  });

  it('refuses what the door would refuse or the page cannot render', () => {
    for (const bad of [
      { slug: 'Bad Slug' },
      { slug: '' },
      { category: 'INTERN' },
      { country: 'Turkey' },
      { postedAt: 'yesterday' },
      { workModes: ['OFFICE'] },
      { salaryMin: '1,200' },
    ]) {
      expect(
        PublicOpeningSchema.safeParse({ ...OPENING_WIRE, ...bad }).success,
        JSON.stringify(bad),
      ).toBe(false);
    }
  });
});

describe('the envelopes and parseOpenings', () => {
  it('a list page needs its data array and its meta block; a detail needs its data', () => {
    const meta = { total: 1, page: 1, limit: 50, totalPages: 1 };
    expect(OpeningsPageSchema.safeParse({ data: [OPENING_WIRE], meta }).success).toBe(true);
    expect(OpeningsPageSchema.safeParse({ data: [OPENING_WIRE] }).success).toBe(false);
    expect(OpeningsPageSchema.safeParse([OPENING_WIRE]).success).toBe(false);
    expect(OpeningDetailSchema.safeParse({ data: OPENING_WIRE }).success).toBe(true);
  });

  it('keeps the valid rows and reports each broken one — one bad opening never hides the others', () => {
    const reported: string[] = [];
    const rows = parseOpenings(
      [
        OPENING_WIRE,
        { ...OPENING_WIRE, slug: 'Bad Slug' },
        { ...OPENING_WIRE, slug: 'second-role' },
      ],
      (index, issue) => reported.push(`${index} ${issue}`),
    );
    expect(rows.map((r) => r.slug)).toEqual([OPENING.slug, 'second-role']);
    expect(reported).toHaveLength(1);
    expect(reported[0]).toMatch(/^1 slug/);
  });
});

describe('the design axes', () => {
  it('placeOf: Türkiye is the Antalya office, anywhere else is overseas', () => {
    expect(placeOf(opening({ country: 'TR' }))).toBe('office');
    expect(placeOf(OPENING)).toBe('overseas');
  });

  it('ENGAGEMENT_OF maps the four hiring categories onto the three design filters', () => {
    expect(ENGAGEMENT_OF).toEqual({
      FULL_TIME: 'fullTime',
      COUNTRY_REPRESENTATIVE: 'fullTime',
      FREELANCER: 'partTime',
      PROJECT_BASED: 'project',
    });
  });

  it('employmentTypeOf: the first İŞKUR arrangement it knows, else the hiring category', () => {
    expect(employmentTypeOf(OPENING)).toBe('FULL_TIME');
    expect(employmentTypeOf(opening({ employmentArrangements: ['HOURLY', 'PART_TIME'] }))).toBe(
      'PART_TIME',
    );
    expect(
      employmentTypeOf(opening({ employmentArrangements: [], employmentArrangement: 'contract' })),
    ).toBe('CONTRACTOR');
    expect(
      employmentTypeOf(
        opening({
          employmentArrangements: [],
          employmentArrangement: null,
          category: 'PROJECT_BASED',
        }),
      ),
    ).toBe('TEMPORARY');
    expect(
      employmentTypeOf(opening({ employmentArrangements: ['SEASONAL'], category: 'FREELANCER' })),
    ).toBe('CONTRACTOR');
  });

  it('isNewOpening: posted within 14 days of now', () => {
    const now = new Date('2026-09-20T00:00:00Z');
    expect(isNewOpening('2026-09-15T08:00:00.000Z', now)).toBe(true);
    expect(isNewOpening('2026-09-06T00:00:00.000Z', now)).toBe(true);
    expect(isNewOpening('2026-09-05T23:59:59.000Z', now)).toBe(false);
    expect(isNewOpening('not a date', now)).toBe(false);
  });

  it('detailHref is the typed next-intl href of one opening — the same slug in both locales', () => {
    expect(detailHref('x-role')).toEqual({
      pathname: '/careers/[slug]',
      params: { slug: 'x-role' },
    });
  });
});

describe('the description', () => {
  it('summaryOf: the first paragraph, cut at a word with an ellipsis', () => {
    expect(summaryOf(OPENING.description)).toBe(
      'Own the whole JobsAdmire pipeline in Uzbekistan — partners, candidates and quality.',
    );
    const cut = summaryOf('word '.repeat(60).trim(), 40);
    expect(cut.endsWith('…')).toBe(true);
    expect(cut.length).toBeLessThanOrEqual(41);
    expect(summaryOf(null)).toBe('');
  });

  it('descriptionBlocks: paragraphs, and consecutive "- " / "* " / "• " lines as one list — text, never HTML', () => {
    expect(descriptionBlocks(OPENING.description)).toEqual([
      {
        type: 'p',
        text: 'Own the whole JobsAdmire pipeline in Uzbekistan — partners, candidates and quality.',
      },
      { type: 'p', text: 'The work:' },
      { type: 'ul', items: ['Find and manage licensed partner agencies', 'Run first interviews'] },
      { type: 'p', text: 'The profile:' },
      { type: 'ul', items: ['A working network among agencies'] },
    ]);
    expect(descriptionBlocks('• a\n* b\r\n- c')).toEqual([{ type: 'ul', items: ['a', 'b', 'c'] }]);
    expect(descriptionBlocks('a < b, 3 > 2')).toEqual([{ type: 'p', text: 'a < b, 3 > 2' }]);
    expect(descriptionBlocks(null)).toEqual([]);
  });
});

// W230: Operations' rich-text editor stores HTML; these are the live postings' shapes (2026-10-03).
const RICH_TR =
  '<ul><li><h1>BÜRO PERSONELİ İŞ İLANI</h1><p><strong>Meslek:</strong> Büro Personeli<br>' +
  '<strong>Çalışma Yeri:</strong> Antalya / Türkiye</p><h2>İş Tanımı</h2>' +
  '<p>Misafirleri karşılar&nbsp;ve yönlendirir.</p></li></ul>';
const RICH_EN =
  '<p><strong>Company Description</strong>: JobsAdmire is a recruitment agency.</p>\n\n' +
  '<h3>What you will do</h3>\n<ul>\n<li><strong>Be the contact</strong> for partners.</li>\n' +
  '<li>Explain the <b>process</b>.</li>\n</ul><ol><li><p>First</p></li><li><p>Second</p></li></ol>';

describe('the rich-text description (W230)', () => {
  it('descriptionBlocks: headings, paragraphs with their <br> lines, lists — the text, never a tag', () => {
    expect(descriptionBlocks(RICH_TR)).toEqual([
      { type: 'h', text: 'BÜRO PERSONELİ İŞ İLANI' },
      { type: 'p', text: 'Meslek: Büro Personeli\nÇalışma Yeri: Antalya / Türkiye' },
      { type: 'h', text: 'İş Tanımı' },
      { type: 'p', text: 'Misafirleri karşılar ve yönlendirir.' },
    ]);
    expect(descriptionBlocks(RICH_EN)).toEqual([
      { type: 'p', text: 'Company Description: JobsAdmire is a recruitment agency.' },
      { type: 'h', text: 'What you will do' },
      { type: 'ul', items: ['Be the contact for partners.', 'Explain the process.'] },
      { type: 'ol', items: ['First', 'Second'] },
    ]);
  });

  it('drops script and style content, decodes entities as text, keeps a typed "- " line a list item', () => {
    expect(
      descriptionBlocks(
        '<p>a<script>alert(1)</script> b &lt;i&gt; c &amp; d&#39;s &#x2014; e</p><style>p{}</style>' +
          '<p>Needs:<br>- Russian<br>- Uzbek</p><!-- note --><div><br></div>',
      ),
    ).toEqual([
      { type: 'p', text: "a b <i> c & d's — e" },
      { type: 'p', text: 'Needs:' },
      { type: 'ul', items: ['Russian', 'Uzbek'] },
    ]);
  });

  it('summaryOf: the first block that is not a heading, its lines joined by " · ", cut cleanly', () => {
    expect(summaryOf(RICH_TR)).toBe('Meslek: Büro Personeli · Çalışma Yeri: Antalya / Türkiye');
    expect(summaryOf(RICH_EN)).toBe('Company Description: JobsAdmire is a recruitment agency.');
    expect(summaryOf('<ul><li>One</li><li>Two</li></ul>')).toBe('One · Two');
    expect(summaryOf('<h2>Only a title</h2>')).toBe('Only a title');
    const cut = summaryOf(RICH_TR, 30);
    expect(cut).toBe('Meslek: Büro Personeli…');
    expect(summaryOf('<p>' + 'word · '.repeat(30) + '</p>', 40)).not.toMatch(/·…$/);
  });
});

describe('place, languages and pay', () => {
  const rows = [{ code: 'UZ', name: 'Özbekistan' }];

  it('countryNameOf: the countries collection, then Intl, then the code itself', () => {
    expect(countryNameOf('uz', rows, 'tr')).toBe('Özbekistan');
    expect(countryNameOf('PK', rows, 'en')).toBe('Pakistan');
    expect(countryNameOf('IN', rows, 'tr')).toBe('Hindistan');
    expect(countryNameOf('XY', rows, 'en')).toBe('XY');
  });

  it('citiesOf, locationOf, workModesOf and languagesOf read the arrays first, the legacy singles second', () => {
    expect(citiesOf(OPENING)).toBe('Tashkent');
    expect(locationOf(OPENING, 'Uzbekistan')).toBe('Tashkent · Uzbekistan');
    expect(locationOf(opening({ cities: ['Karachi', 'Lahore'] }), 'Pakistan')).toBe(
      'Karachi, Lahore · Pakistan',
    );
    expect(locationOf(opening({ cities: [], city: null }), 'India')).toBe('India');
    expect(workModesOf(opening({ workModes: [], workMode: 'HYBRID' }))).toEqual(['HYBRID']);
    expect(workModesOf(opening({ workModes: [], workMode: null }))).toEqual([]);
    expect(languagesOf(OPENING)).toEqual(['Uzbek', 'Russian', 'English']);
    expect(languagesOf(opening({ requiredLanguages: [], requiredLanguage: 'Urdu' }))).toEqual([
      'Urdu',
    ]);
  });

  it('salaryPartsOf: nothing when hidden, else the pay-type shape (Operations storage rule)', () => {
    expect(salaryPartsOf(opening({ salaryVisible: false }))).toBeNull();
    expect(salaryPartsOf(opening({ salaryCurrency: null }))).toBeNull();
    expect(salaryPartsOf(opening({ salaryMin: null, salaryMax: null }))).toBeNull();
    expect(salaryPartsOf(OPENING)).toEqual({
      kind: 'range',
      min: 800,
      max: 1200,
      currency: 'USD',
      period: 'MONTH',
    });
    expect(salaryPartsOf(opening({ salaryPayType: 'STARTING', salaryMax: null }))).toEqual({
      kind: 'from',
      min: 800,
      max: null,
      currency: 'USD',
      period: 'MONTH',
    });
    expect(salaryPartsOf(opening({ salaryPayType: 'MAXIMUM', salaryMin: null }))).toEqual({
      kind: 'upTo',
      min: null,
      max: 1200,
      currency: 'USD',
      period: 'MONTH',
    });
    expect(
      salaryPartsOf(
        opening({
          salaryPayType: 'EXACT',
          salaryMin: '45000',
          salaryMax: '45000',
          salaryCurrency: 'TRY',
        }),
      ),
    ).toEqual({ kind: 'exact', min: 45000, max: 45000, currency: 'TRY', period: 'MONTH' });
    expect(salaryPartsOf(opening({ salaryPayType: null, salaryMax: null }))?.kind).toBe('from');
    expect(salaryPartsOf(opening({ salaryPayType: null, salaryMin: null }))?.kind).toBe('upTo');
  });

  it('formatMoney: lira through formatTRY (D18), any other ISO code through Intl, whole units', () => {
    expect(formatMoney(38944, 'TRY', 'tr')).toBe('38.944 ₺');
    expect(formatMoney(38944, 'try', 'en')).toBe('₺38,944');
    expect(formatMoney(1200, 'USD', 'en')).toBe('$1,200');
    expect(formatMoney(1200, 'USD', 'tr')).toBe('$1.200');
    expect(formatMoney(150000, 'PKR', 'en').replace(/\s/g, ' ')).toBe('PKR 150,000');
    expect(formatMoney(5, 'USDX', 'en')).toBe('5 USDX');
  });

  it('baseSalaryOf: a MonetaryAmount for HOUR, MONTH and YEAR only — never a guessed figure (D17)', () => {
    expect(baseSalaryOf(OPENING)).toEqual({
      currency: 'USD',
      value: { min: 800, max: 1200 },
      unitText: 'MONTH',
    });
    expect(
      baseSalaryOf(opening({ salaryPayType: 'EXACT', salaryMin: '1000', salaryMax: '1000' })),
    ).toEqual({ currency: 'USD', value: 1000, unitText: 'MONTH' });
    expect(baseSalaryOf(opening({ salaryPeriod: 'WEEK' }))).toBeUndefined();
    expect(baseSalaryOf(opening({ salaryPeriod: null }))).toBeUndefined();
    expect(baseSalaryOf(opening({ salaryVisible: false }))).toBeUndefined();
  });

  it('salaryCurrencyOf: the opening pay currency, PKR for a Pakistan opening without one, else none', () => {
    expect(salaryCurrencyOf(OPENING)).toBe('USD');
    expect(salaryCurrencyOf(opening({ country: 'PK', payCurrency: null }))).toBe('PKR');
    expect(salaryCurrencyOf(opening({ payCurrency: null }))).toBeNull();
  });
});
