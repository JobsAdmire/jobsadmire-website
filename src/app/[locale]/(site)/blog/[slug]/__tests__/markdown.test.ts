import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { getCollection } from '@/content/collections';
import { BundleSchema } from '../../../../../../../contract/website-bundle.v1';
import { headingId, headings, parseInline, parseMarkdown } from '../_lib/markdown';

const SAMPLE = [
  'Intro paragraph with **bold** inside.',
  '> **Key takeaways**\n>\n> - First point\n> - Second **point**',
  '## Who can hire in Türkiye?',
  '**5 : 1 rule** — Five Turkish employees per foreign worker.',
  '**Capital** — At least the ministry threshold.',
  '- Contract\n- Passport',
  '## Steps',
  '1. **Offer.** Sign it.\n2. **File.** Submit it.',
  '> Closing quote.',
].join('\n\n');

describe('parseInline', () => {
  it('splits **bold** spans and keeps everything else as text', () => {
    expect(parseInline('a **b** c')).toEqual([
      { kind: 'text', text: 'a ' },
      { kind: 'strong', text: 'b' },
      { kind: 'text', text: ' c' },
    ]);
    expect(parseInline('plain')).toEqual([{ kind: 'text', text: 'plain' }]);
    expect(parseInline('<script>x</script>')).toEqual([
      { kind: 'text', text: '<script>x</script>' },
    ]);
  });
});

describe('headingId', () => {
  it('slugifies, folds Turkish letters to ASCII and never collides', () => {
    const used = new Set<string>(['faq']);
    expect(headingId("Documents you'll need", used)).toBe('documents-you-ll-need');
    expect(headingId('Türkiye’de kimler yabancı işçi çalıştırabilir?', used)).toBe(
      'turkiye-de-kimler-yabanci-isci-calistirabilir',
    );
    expect(headingId("Documents you'll need", used)).toBe('documents-you-ll-need-2');
    expect(headingId('FAQ', used)).toBe('faq-2'); // a reserved page id is never reused
    expect(headingId('???', used)).toBe('section');
  });
});

describe('parseMarkdown (the importer grammar, B-8)', () => {
  const blocks = parseMarkdown(SAMPLE);

  it('recognises every block kind in order', () => {
    expect(blocks.map((b) => b.kind)).toEqual([
      'p',
      'callout',
      'h2',
      'leads',
      'ul',
      'h2',
      'ol',
      'quote',
    ]);
  });

  it('a blockquote of a bold title line + bullet items is the takeaways callout', () => {
    const callout = blocks[1];
    expect(callout.kind === 'callout' && callout.title).toBe('Key takeaways');
    expect(callout.kind === 'callout' && callout.items).toEqual([
      [{ kind: 'text', text: 'First point' }],
      [
        { kind: 'text', text: 'Second ' },
        { kind: 'strong', text: 'point' },
      ],
    ]);
  });

  it('consecutive "**lead** — body" paragraphs merge into one leads block', () => {
    const leads = blocks[3];
    expect(leads.kind === 'leads' && leads.items.map((i) => i.lead)).toEqual([
      '5 : 1 rule',
      'Capital',
    ]);
  });

  it('numbered steps keep their bold lead as the first inline', () => {
    const ol = blocks[6];
    expect(ol.kind === 'ol' && ol.items[0][0]).toEqual({ kind: 'strong', text: 'Offer.' });
  });

  it('any other blockquote is a pull quote', () => {
    const quote = blocks[7];
    expect(quote.kind === 'quote' && quote.inlines).toEqual([
      { kind: 'text', text: 'Closing quote.' },
    ]);
  });

  it('headings() lists the h2s with their ids; reserved ids are skipped', () => {
    expect(headings(blocks)).toEqual([
      { id: 'who-can-hire-in-turkiye', text: 'Who can hire in Türkiye?' },
      { id: 'steps', text: 'Steps' },
    ]);
    expect(headings(parseMarkdown('## Steps', ['steps']))).toEqual([
      { id: 'steps-2', text: 'Steps' },
    ]);
  });

  it('CRLF, stray blank lines and a heading glued to its paragraph do not change the result', () => {
    expect(parseMarkdown(`${SAMPLE.replace(/\n/g, '\r\n')}\n\n\n`)).toEqual(blocks);
    expect(parseMarkdown('## Title\nText right under it.').map((b) => b.kind)).toEqual(['h2', 'p']);
  });

  it('unknown syntax is text, never markup', () => {
    const [p] = parseMarkdown('<img src=x onerror=alert(1)> [link](https://x)');
    expect(p.kind === 'p' && p.inlines).toEqual([
      { kind: 'text', text: '<img src=x onerror=alert(1)> [link](https://x)' },
    ]);
  });
});

describe('the committed EN body (W64) parses into the design structure', () => {
  const bundle = BundleSchema.parse(
    JSON.parse(readFileSync(join(process.cwd(), 'src/content/local/bundle.en.json'), 'utf8')),
  );
  const row = getCollection(bundle, 'blog').find(
    (p) => p.key === 'turkey-work-permit-process-employer-guide',
  );
  const blocks = parseMarkdown(row?.body.en ?? '', ['faq']);

  it('intro, takeaways, four H2 sections, two lead cards, three lists, five steps, one quote', () => {
    expect(blocks.map((b) => b.kind)).toEqual([
      'p',
      'callout',
      'h2',
      'p',
      'leads',
      'p',
      'h2',
      'ul',
      'h2',
      'ol',
      'h2',
      'ul',
      'quote',
    ]);
    expect(headings(blocks).map((h) => h.id)).toEqual([
      'who-can-hire-foreign-workers-in-turkiye',
      'documents-you-ll-need',
      'the-application-step-by-step',
      'mistakes-that-get-applications-rejected',
    ]);
    const callout = blocks[1];
    expect(callout.kind === 'callout' && callout.items).toHaveLength(4);
    const leads = blocks[4];
    expect(leads.kind === 'leads' && leads.items.map((i) => i.lead)).toEqual([
      '5 : 1 rule',
      'Capital / turnover',
    ]);
    const ol = blocks[9];
    expect(ol.kind === 'ol' && ol.items).toHaveLength(5);
  });

  it('carries no {placeholder} — v1 bodies are not passed through fill (B-8)', () => {
    expect(row?.body.en).not.toMatch(/\{[A-Za-z][A-Za-z0-9]*\}/);
  });
});
