import { describe, expect, it, vi } from 'vitest';
import { fieldErrorsFromIssues } from '@/forms/errors';
import { FormActionError } from '@/forms/types';
import { OPENING, opening } from '@/test/careers';
import {
  applySchema,
  applyToFields,
  normaliseSalary,
  portfolioUrlProblem,
  type ApplyContext,
} from '../_lib/apply';
import { openingView, salaryLine, type OpeningViewCopy, type SalaryCopy } from '../_lib/view';

const pdf = () => new File(['%PDF-1.4\n%fixture\n'], 'cv.pdf', { type: 'application/pdf' });
const VALID = {
  openingSlug: OPENING.slug,
  name: 'Aziz Karimov',
  email: 'aziz@example.com',
  phone: '+998 90 123 45 67',
  country: 'UZ',
  city: '',
  language: '',
  expectedSalary: '',
  linkedinUrl: '',
  portfolioUrl: '',
  coverLetter: '',
  cv: pdf(),
};
const parse = (over: Record<string, unknown> = {}) => applySchema.parse({ ...VALID, ...over });
/** The codes the kernel would answer (src/forms/errors.ts), by field. */
const errorsOf = (over: Record<string, unknown>) => {
  const result = applySchema.safeParse({ ...VALID, ...over });
  return result.success ? {} : fieldErrorsFromIssues(result.error.issues);
};
const ctx = (over: Partial<ApplyContext> = {}): ApplyContext => ({
  opening: OPENING,
  upload: vi.fn(async () => ({ cvKey: 'careers-cv/abc-123.pdf' })),
  messages: { closed: 'closed-msg', portfolioGate: 'portfolio-msg' },
  ...over,
});

describe('applySchema — the careers catalog names, validated like the door', () => {
  it('parses a valid application, upper-cases the ISO-2 country and keeps the CV file', () => {
    const p = parse({ country: 'uz' });
    expect(p.country).toBe('UZ');
    expect(p.cv).toBeInstanceOf(File);
    expect(p.expectedSalary).toBeUndefined();
  });

  it('required before format: an empty name, e-mail, phone, country or CV reads `required`', () => {
    expect(errorsOf({ name: '', email: '', phone: '', country: '', cv: undefined })).toEqual({
      name: 'required',
      email: 'required',
      phone: 'required',
      country: 'required',
      cv: 'required',
    });
    expect(errorsOf({ cv: new File([], 'cv.pdf', { type: 'application/pdf' }) })).toEqual({
      cv: 'required',
    });
  });

  it('then the format: a bad e-mail, a short phone, a free-text country, a non-numeric salary', () => {
    expect(
      errorsOf({ email: 'nope', phone: '12 34', country: 'Uzbekistan', expectedSalary: 'a lot' }),
    ).toEqual({ email: 'email', phone: 'phone', country: 'invalid', expectedSalary: 'invalid' });
  });

  it('the catalog caps — city 100, language 300, cover letter 5000, LinkedIn 500 (length only at the door)', () => {
    expect(
      errorsOf({
        city: 'x'.repeat(101),
        language: 'x'.repeat(301),
        coverLetter: 'x'.repeat(5001),
        linkedinUrl: 'x'.repeat(501),
      }),
    ).toEqual({ city: 'max', language: 'max', coverLetter: 'max', linkedinUrl: 'max' });
    expect(errorsOf({ linkedinUrl: 'linkedin.com/in/aziz karimov' })).toEqual({});
  });

  it('a tampered slug the door would refuse', () => {
    expect(errorsOf({ openingSlug: 'Bad Slug' })).toEqual({ openingSlug: 'invalid' });
  });

  it('the expected salary: separators dropped, a whole number up to 100,000,000 (PublicApplyDto)', () => {
    expect(parse({ expectedSalary: '150.000' }).expectedSalary).toBe('150000');
    expect(parse({ expectedSalary: '1 500' }).expectedSalary).toBe('1500');
    expect(errorsOf({ expectedSalary: '100000001' })).toEqual({ expectedSalary: 'invalid' });
    expect(normaliseSalary("45'000")).toBe('45000');
  });
});

describe("portfolioUrlProblem — the door's v1.1 url rule (W161): never stricter, never looser", () => {
  it('accepts what the door accepts — a scheme-less link included', () => {
    for (const ok of [
      'behance.net/aziz',
      'https://aziz.example/work',
      'www.dribbble.com/aziz?tab=shots',
      'http://10.0.0.10/cv',
      '10.0.0.10',
      'http://[::1]/x',
    ])
      expect(portfolioUrlProblem(ok), ok).toBeNull();
  });

  it('refuses what the door refuses', () => {
    for (const bad of [
      '12345',
      '0555-123-4567',
      '+90 555 123 45 67',
      'see attached',
      'localhost:3000',
      'user:pw@site.com',
      'ftp://site.com/x',
      'mailto:a@b.com',
      'javascript:alert(1)',
    ])
      expect(portfolioUrlProblem(bad), bad).toBe('url');
  });

  it('measures the length after the door adds https:// (≤ 500)', () => {
    const long = `${'a'.repeat(488)}.com`; // 492 as typed, 500 once https:// is added
    expect(portfolioUrlProblem(long)).toBeNull();
    expect(portfolioUrlProblem(`a${long}`)).toBe('max'); // 493 as typed → 501
    expect(portfolioUrlProblem('x'.repeat(501))).toBe('max');
  });

  it('lands on the portfolioUrl field through the schema', () => {
    expect(errorsOf({ portfolioUrl: 'localhost' })).toEqual({ portfolioUrl: 'url' });
    expect(errorsOf({ portfolioUrl: 'behance.net/aziz' })).toEqual({});
  });
});

describe("applyToFields — the door's own rules, checked before the CV is uploaded", () => {
  it('uploads the CV and sends exactly the required catalog names — no empty field', async () => {
    const c = ctx();
    expect(await applyToFields(parse(), c)).toEqual({
      openingSlug: OPENING.slug,
      cvKey: 'careers-cv/abc-123.pdf',
      name: 'Aziz Karimov',
      email: 'aziz@example.com',
      phone: '+998 90 123 45 67',
      country: 'UZ',
    });
    expect(c.upload).toHaveBeenCalledTimes(1);
  });

  it('sends the optional fields when typed — the salary in the opening currency, never currentSalary', async () => {
    const fields = await applyToFields(
      parse({
        city: 'Tashkent',
        language: 'Uzbek, Russian',
        expectedSalary: '1000',
        linkedinUrl: 'linkedin.com/in/aziz',
        portfolioUrl: 'behance.net/aziz',
        coverLetter: 'Three institutes, one network.',
      }),
      ctx(),
    );
    expect(fields).toEqual({
      openingSlug: OPENING.slug,
      cvKey: 'careers-cv/abc-123.pdf',
      name: 'Aziz Karimov',
      email: 'aziz@example.com',
      phone: '+998 90 123 45 67',
      country: 'UZ',
      city: 'Tashkent',
      language: 'Uzbek, Russian',
      expectedSalary: '1000',
      expectedSalaryCurrency: 'USD',
      linkedinUrl: 'linkedin.com/in/aziz',
      portfolioUrl: 'behance.net/aziz',
      coverLetter: 'Three institutes, one network.',
    });
  });

  it("residency: a country other than the opening's lands on `country`, before any upload", async () => {
    const c = ctx();
    await expect(applyToFields(parse({ country: 'TR' }), c)).rejects.toMatchObject({
      field: { name: 'country', code: 'invalid' },
    });
    expect(c.upload).not.toHaveBeenCalled();
  });

  it('Pakistan: no expected salary lands on `expectedSalary`; with one it rides in PKR by default', async () => {
    const pk = opening({ country: 'PK', payCurrency: null });
    await expect(
      applyToFields(parse({ country: 'PK' }), ctx({ opening: pk })),
    ).rejects.toMatchObject({ field: { name: 'expectedSalary', code: 'required' } });
    expect(
      await applyToFields(
        parse({ country: 'PK', expectedSalary: '150.000' }),
        ctx({ opening: pk }),
      ),
    ).toMatchObject({ expectedSalary: '150000', expectedSalaryCurrency: 'PKR' });
  });

  it('W56: a portfolio opening is refused with the visitor message, before any upload', async () => {
    const c = ctx({ opening: opening({ portfolioRequired: true }) });
    const err = await applyToFields(parse(), c).catch((e: unknown) => e);
    expect(err).toBeInstanceOf(FormActionError);
    expect((err as FormActionError).visitorMessage).toBe('portfolio-msg');
    expect((err as FormActionError).field).toBeUndefined();
    expect(c.upload).not.toHaveBeenCalled();
  });

  it('a closed opening (null) or another slug is the closed message', async () => {
    await expect(applyToFields(parse(), ctx({ opening: null }))).rejects.toMatchObject({
      visitorMessage: 'closed-msg',
    });
    await expect(applyToFields(parse({ openingSlug: 'other-role' }), ctx())).rejects.toMatchObject({
      visitorMessage: 'closed-msg',
    });
  });

  it("the uploader's own refusal propagates untouched (a `file` field error or a door failure)", async () => {
    const refusal = new FormActionError('not a PDF', { name: 'cv', code: 'file' });
    await expect(
      applyToFields(parse(), ctx({ upload: vi.fn(async () => Promise.reject(refusal)) })),
    ).rejects.toBe(refusal);
  });
});

const SALARY: SalaryCopy = {
  range: (min, max) => `${min} – ${max}`,
  from: (amount) => `from ${amount}`,
  upTo: (amount) => `up to ${amount}`,
  per: (period) => `per ${period.toLowerCase()}`,
};

describe('salaryLine and openingView', () => {
  it('the pay line: range, from, up to, exact, hidden', () => {
    expect(salaryLine(OPENING, 'en', SALARY)).toBe('$800 – $1,200 · per month');
    expect(salaryLine(opening({ salaryPayType: 'STARTING', salaryMax: null }), 'en', SALARY)).toBe(
      'from $800 · per month',
    );
    expect(salaryLine(opening({ salaryPayType: 'MAXIMUM', salaryMin: null }), 'en', SALARY)).toBe(
      'up to $1,200 · per month',
    );
    expect(
      salaryLine(
        opening({
          salaryPayType: 'EXACT',
          salaryMin: '45000',
          salaryMax: '45000',
          salaryCurrency: 'TRY',
          salaryPeriod: null,
        }),
        'tr',
        SALARY,
      ),
    ).toBe('45.000 ₺');
    expect(salaryLine(opening({ salaryVisible: false }), 'en', SALARY)).toBeNull();
  });

  it('openingView resolves every string the detail sections render', () => {
    const copy: OpeningViewCopy = {
      engagement: { fullTime: 'Full-time', partTime: 'Part-time', project: 'Project-based' },
      workMode: { REMOTE: 'Remote', HYBRID: 'Hybrid', ON_SITE: 'On site' },
      posted: (date) => `Posted ${date}`,
      salary: SALARY,
      askIntro: 'Hello JobsAdmire, I have a question about the',
      askTail: 'role (',
    };
    expect(
      openingView(OPENING, {
        locale: 'en',
        countries: [{ code: 'UZ', name: 'Uzbekistan' }],
        copy,
        whatsappNumber: '905011240340',
        now: new Date('2026-09-20T00:00:00Z'),
      }),
    ).toEqual({
      countryName: 'Uzbekistan',
      location: 'Tashkent · Uzbekistan',
      workModes: 'Remote',
      languages: 'Uzbek, Russian, English',
      engagement: 'Full-time',
      posted: '15 September 2026',
      postedLine: 'Posted 15 September 2026',
      pay: '$800 – $1,200 · per month',
      isNew: true,
      salaryCurrency: 'USD',
      askHref: `https://wa.me/905011240340?text=${encodeURIComponent(
        'Hello JobsAdmire, I have a question about the Country Representative — Uzbekistan role (Tashkent · Uzbekistan)',
      )}`,
    });
  });
});
