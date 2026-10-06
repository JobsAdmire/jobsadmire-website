import { existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import en from '@/messages/en.json';
import tr from '@/messages/tr.json';
import { LICENCE_DOCS, PROFILE_SLOT, licenceDocHref, type LicenceDoc } from '../licence';

const PUBLIC = join(process.cwd(), 'public');

describe('LICENCE_DOCS (the #lisans slots, D26)', () => {
  it('names eight slots — four licence PDFs, three certificates and the company profile — each unique', () => {
    expect(LICENCE_DOCS).toHaveLength(8);
    const slots = LICENCE_DOCS.map((d) => d.slot);
    expect(new Set(slots).size).toBe(8);
    for (const slot of slots) expect(slot).toMatch(/^licence-pdf-[a-z0-9-]+$/);
  });

  it('labels every slot from copy that exists in both locales', () => {
    for (const doc of LICENCE_DOCS) {
      if (doc.label.kind === 'sys') {
        expect(en.sys.about.licence.docs).toHaveProperty(doc.label.key);
        expect(tr.sys.about.licence.docs).toHaveProperty(doc.label.key);
      } else {
        expect(doc.label.id).toMatch(/^about\.\d{3}$/);
      }
    }
  });

  it('a filled slot is a PDF under /docs/licence/', () => {
    const filled: LicenceDoc = { ...LICENCE_DOCS[0], file: 'iskur-permit.pdf' };
    expect(licenceDocHref(filled)).toBe('/docs/licence/iskur-permit.pdf');
  });

  it('publishes the owner-supplied files (W246) and keeps the annex/ÖİB slots as placeholders', () => {
    const filled = LICENCE_DOCS.filter((d) => licenceDocHref(d) !== null).map((d) => d.slot);
    expect(filled).toEqual([
      'licence-pdf-iskur-permit',
      'licence-pdf-iso-21001',
      'licence-pdf-iso-10002',
      'licence-pdf-trusted-brand',
      PROFILE_SLOT,
    ]);
    const pending = LICENCE_DOCS.filter((d) => licenceDocHref(d) === null).map((d) => d.slot);
    expect(pending).toEqual([
      'licence-pdf-iskur-annex',
      'licence-pdf-oib-certificate',
      'licence-pdf-oib-annex',
    ]);
  });

  it('every set file exists under public/docs/licence/ as an ASCII-named, non-empty PDF', () => {
    for (const doc of LICENCE_DOCS) {
      const href = licenceDocHref(doc);
      if (!href) continue;
      expect(doc.file).toMatch(/^[a-z0-9-]+\.pdf$/);
      const path = join(PUBLIC, href);
      expect(existsSync(path), href).toBe(true);
      expect(statSync(path).size).toBeGreaterThan(10_000);
    }
  });

  it('every certificate title carries its validity dates (owner, W246 — they expired in 2025)', () => {
    for (const key of ['iso21001', 'iso10002', 'trustedBrand'] as const) {
      for (const messages of [tr, en]) {
        expect(messages.sys.about.licence.docs[key]).toMatch(
          /\(\D+, \d{2}\.\d{2}\.2024 – \d{2}\.\d{2}\.2025\)$/,
        );
      }
    }
  });
});
