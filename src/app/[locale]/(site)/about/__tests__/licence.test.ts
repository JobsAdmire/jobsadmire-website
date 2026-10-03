import { describe, expect, it } from 'vitest';
import en from '@/messages/en.json';
import tr from '@/messages/tr.json';
import { LICENCE_DOCS, licenceDocHref, type LicenceDoc } from '../licence';

describe('LICENCE_DOCS (the #lisans slots, D26)', () => {
  it('names five slots — the four licence PDFs plus the company profile — each unique', () => {
    expect(LICENCE_DOCS).toHaveLength(5);
    const slots = LICENCE_DOCS.map((d) => d.slot);
    expect(new Set(slots).size).toBe(5);
    for (const slot of slots) expect(slot).toMatch(/^licence-pdf-[a-z-]+$/);
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

  it('ships every slot as a placeholder today — the PDFs are a §10 row 3 owner input', () => {
    expect(LICENCE_DOCS.every((d) => licenceDocHref(d) === null)).toBe(true);
  });
});
