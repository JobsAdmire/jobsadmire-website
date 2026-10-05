import { describe, expect, it } from 'vitest';
import { FORM_KEYS } from '@/analytics/forms';
import { fieldErrorsFromIssues } from '@/forms/errors';
import { newsletterSchema, newsletterSpec, newsletterToFields } from '../spec';

const codes = (result: ReturnType<typeof newsletterSchema.safeParse>) =>
  result.success ? {} : fieldErrorsFromIssues(result.error.issues);

/** The Operations catalog for `newsletter` (docs/INTEGRATIONS.md I4) — anything else inside
 *  `fields` would be dropped silently with a 200. */
const NEWSLETTER_CATALOG = ['email', 'name'];

describe('newsletter spec', () => {
  it('posts to the `newsletter` door with the consent checkbox (W79)', () => {
    expect(FORM_KEYS).toContain('newsletter');
    expect(newsletterSpec.key).toBe('newsletter');
    expect(newsletterSpec.consent).toBe('checkbox');
    expect(newsletterSpec.schema).toBe(newsletterSchema);
    expect(newsletterSpec.toFields).toBe(newsletterToFields);
  });

  it('requires an e-mail: empty reads `required`, a malformed one `email`', () => {
    expect(codes(newsletterSchema.safeParse({ email: '' }))).toEqual({ email: 'required' });
    expect(codes(newsletterSchema.safeParse({ email: '   ' }))).toEqual({ email: 'required' });
    expect(codes(newsletterSchema.safeParse({ email: 'not-an-email' }))).toEqual({
      email: 'email',
    });
    expect(newsletterSchema.safeParse({ email: 'hr@akdeniz.com.tr' }).success).toBe(true);
  });

  it('keeps the door caps: e-mail ≤ 254, name optional ≤ 120', () => {
    const long = `${'a'.repeat(250)}@x.co`;
    expect(Object.keys(codes(newsletterSchema.safeParse({ email: long })))).toEqual(['email']);
    expect(
      Object.keys(codes(newsletterSchema.safeParse({ email: 'a@b.co', name: 'x'.repeat(121) }))),
    ).toEqual(['name']);
  });

  it('maps onto catalog names only, trimming and leaving a blank name off', () => {
    const parsed = newsletterSchema.parse({ email: ' hr@akdeniz.com.tr ', name: '' });
    expect(newsletterToFields(parsed)).toEqual({ email: 'hr@akdeniz.com.tr' });
    const named = newsletterToFields(
      newsletterSchema.parse({ email: 'hr@akdeniz.com.tr', name: ' Ayşe ' }),
    );
    expect(named).toEqual({ email: 'hr@akdeniz.com.tr', name: 'Ayşe' });
    for (const key of Object.keys(named)) expect(NEWSLETTER_CATALOG).toContain(key);
  });
});
