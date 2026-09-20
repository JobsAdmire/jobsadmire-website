import { describe, expect, it } from 'vitest';
import { CONSENT_VERSION } from '../consent';
import { buildEnvelope } from '../wire';

describe('CONSENT_VERSION', () => {
  it('fits the door DTO (≤ 40 chars) and never changes shape by accident', () => {
    expect(CONSENT_VERSION).toBe('kvkk-2026-09');
    expect(CONSENT_VERSION.length).toBeLessThanOrEqual(40);
  });
});

describe('buildEnvelope', () => {
  it('always sends the site-wide consent version and the locale', () => {
    const env = buildEnvelope({ locale: 'tr', fields: { name: 'Ali' } });
    expect(env).toEqual({ locale: 'tr', consentVersion: CONSENT_VERSION, fields: { name: 'Ali' } });
  });

  it('drops empty strings, undefined and empty arrays from fields', () => {
    const env = buildEnvelope({
      locale: 'en',
      fields: {
        name: 'Ali',
        company: '',
        // a page's toFields may hand through an optional that is simply not there
        city: undefined as unknown as string,
        evidenceKeys: ['website-fraud/a.png', '', 'website-fraud/b.png'],
        empty: [],
      },
    });
    expect(env.fields).toEqual({
      name: 'Ali',
      evidenceKeys: ['website-fraud/a.png', 'website-fraud/b.png'],
    });
  });

  it('omits captchaToken/honeypot/sourcePath when null, undefined or blank, and clips them to the DTO caps', () => {
    expect(
      buildEnvelope({
        locale: 'tr',
        fields: {},
        captchaToken: null,
        honeypot: '',
        sourcePath: undefined,
      }),
    ).toEqual({
      locale: 'tr',
      consentVersion: CONSENT_VERSION,
      fields: {},
    });
    const env = buildEnvelope({
      locale: 'tr',
      fields: {},
      captchaToken: 'x'.repeat(3000),
      honeypot: 'y'.repeat(600),
      sourcePath: '/'.padEnd(400, 'p'),
    });
    expect(env.captchaToken).toHaveLength(2048);
    expect(env.honeypot).toHaveLength(500);
    expect(env.sourcePath).toHaveLength(300);
  });

  it('never carries a key the door would reject at the top level', () => {
    const env = buildEnvelope({ locale: 'tr', fields: { a: 'b' }, sourcePath: '/isci-talebi' });
    expect(Object.keys(env).sort()).toEqual(['consentVersion', 'fields', 'locale', 'sourcePath']);
  });
});
