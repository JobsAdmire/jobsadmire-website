import { describe, expect, it } from 'vitest';
import en from './en.json';
import tr from './tr.json';

/**
 * docs/PRD.md §3: the company refers to itself as "JobsAdmire", never "we" (formal register,
 * Turkish "siz"). Checked over every `sys.form.*` string, so a later addition cannot slip back
 * into the first person. A net, not a proof: review still reads the copy (a Turkish
 * first-person possessive other than "ekibimiz…", e.g. "sitemiz", is not caught here).
 */

/** Keys written in the VISITOR's voice ("Hello JobsAdmire, I could not send…"), not the company's. */
const VISITOR_VOICE = ['fallback.whatsappIntro'];

const EN_FIRST_PERSON = new Set(['we', 'us', 'our', 'ours', 'ourselves']);
const TR_PRONOUNS = new Set([
  'biz',
  'bize',
  'bizi',
  'bizim',
  'bizde',
  'bizden',
  'bizimle',
  'bizler',
  'bizlere',
  'bizleri',
  'bizimki',
  'bizimkiler',
]);
/**
 * First-person plural verbs: aorist (yaparız, ederiz), present continuous (yapıyoruz), future
 * (yapacağız), necessity (yapmalıyız) and past (kapattık, ilettik).
 */
const TR_VERB_1PL =
  /^\p{L}{2,}(?:r[ıiuü]z|yor[uü]z|[ae]c[ae]ğ[ıi]z|m[ae]l[ıi]y[ıi]z|[dt][ıiuü]k)$/u;
/**
 * Words those endings catch that are not verbs: the ones found in the design package's Turkish
 * copy, plus a few common loanwords.
 */
const TR_NOT_VERBS = new Set([
  'artık',
  'otomatik',
  'lojistik',
  'diplomatik',
  'tasdik',
  'plastik',
  'pratik',
  'kritik',
  'elektrik',
  'tanıdık',
  'sürpriz',
]);

/** The first-person words in one string, lower-cased. */
function firstPerson(locale: 'tr' | 'en', value: string): string[] {
  const words = value.toLocaleLowerCase(locale).match(/[\p{L}\p{N}]+/gu) ?? [];
  return words.filter((w) =>
    locale === 'en'
      ? EN_FIRST_PERSON.has(w)
      : TR_PRONOUNS.has(w) ||
        w.startsWith('ekibimiz') ||
        (TR_VERB_1PL.test(w) && !TR_NOT_VERBS.has(w)),
  );
}

/** Every leaf of a message object as `[path, value]`, `a.b.c` style. */
function strings(obj: Record<string, unknown>, prefix = ''): [string, string][] {
  return Object.entries(obj).flatMap(([k, v]): [string, string][] =>
    typeof v === 'object' && v !== null
      ? strings(v as Record<string, unknown>, `${prefix}${k}.`)
      : [[`${prefix}${k}`, String(v)]],
  );
}

describe('sys.form.* — the company is "JobsAdmire", never "we" (docs/PRD.md §3)', () => {
  for (const [locale, file] of [
    ['tr', tr],
    ['en', en],
  ] as const) {
    it(`${locale}: no first-person plural outside the visitor-voice keys`, () => {
      const hits = strings(file.sys.form)
        .filter(([key]) => !VISITOR_VOICE.includes(key))
        .flatMap(([key, value]) => firstPerson(locale, value).map((w) => `sys.form.${key}: ${w}`));
      expect(hits).toEqual([]);
    });
  }

  it('the visitor-voice allowlist names keys that exist in both locales', () => {
    for (const file of [tr, en]) {
      const keys = strings(file.sys.form).map(([key]) => key);
      for (const key of VISITOR_VOICE) expect(keys, key).toContain(key);
    }
  });

  it('the checker catches the forms it is meant to, and leaves look-alikes alone', () => {
    expect(firstPerson('en', "Tell us; we'll call. Our team, ours.")).toEqual([
      'us',
      'we',
      'our',
      'ours',
    ]);
    expect(
      firstPerson(
        'tr',
        'Bizi arayın, bize yazın. Ekibimize ilettik; en kısa sürede dönüş yaparız, yapıyoruz, yapacağız, yapmalıyız.',
      ),
    ).toEqual([
      'bizi',
      'bize',
      'ekibimize',
      'ilettik',
      'yaparız',
      'yapıyoruz',
      'yapacağız',
      'yapmalıyız',
    ]);
    expect(
      firstPerson(
        'tr',
        'Bizzat iletebilirsiniz; artık otomatik. Yazdıklarınızı gönderin. Kriz? Formu gönderemedim.',
      ),
    ).toEqual([]);
    expect(firstPerson('en', 'Your business, thus used by users; yours, within hours.')).toEqual(
      [],
    );
  });
});
