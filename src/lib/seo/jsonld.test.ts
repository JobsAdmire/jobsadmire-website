import { describe, expect, it } from 'vitest';
import { faqJsonLd, organizationJsonLd } from './jsonld';
import fixture from '../../../contract/website-bundle.v1.fixture.json';
import { BundleSchema } from '../../../contract/website-bundle.v1';

// R13/R23: parse the fixture rather than casting it — the cast would hide a contract drift
// that the schema catches here.
const settings = BundleSchema.parse(fixture).settings;

describe('jsonld', () => {
  it('organization carries the İŞKUR permit, tax id and social profiles', () => {
    const o = organizationJsonLd(settings, {
      name: 'JobsAdmire',
      description: 'x',
    });
    expect(o['@type']).toEqual(['Organization', 'EmploymentAgency']);
    expect(JSON.stringify(o)).toContain('1730');
    expect(o.sameAs.length).toBe(6);
  });
  it('faq pairs become a FAQPage', () => {
    const f = faqJsonLd([{ q: 'Q?', a: 'A.' }]);
    expect(f.mainEntity[0].acceptedAnswer.text).toBe('A.');
  });
});
