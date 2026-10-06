import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { getCollection } from '@/content/collections';
import { atvPost } from '@/test/blog-fixtures';
import { BundleSchema } from '../../../../../../../contract/website-bundle.v1';
import {
  headingId,
  headings,
  inlineText,
  parseInline,
  parseMarkdown,
  safeHref,
  unescapeText,
  VIDEO_KEY_RE,
} from '../_lib/markdown';

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

const text = (t: string) => ({ kind: 'text' as const, text: t });
const strong = (t: string) => ({ kind: 'strong' as const, children: [text(t)] });

describe('parseInline', () => {
  it('splits **bold** spans and keeps everything else as text', () => {
    expect(parseInline('a **b** c')).toEqual([text('a '), strong('b'), text(' c')]);
    expect(parseInline('plain')).toEqual([text('plain')]);
    expect(parseInline('<script>x</script>')).toEqual([text('<script>x</script>')]);
  });

  it('*italic*, nested in bold and bold in italic (blog.v1)', () => {
    expect(parseInline('a *b* c')).toEqual([
      text('a '),
      { kind: 'em', children: [text('b')] },
      text(' c'),
    ]);
    expect(parseInline('**bold *it***')).toEqual([
      { kind: 'strong', children: [text('bold '), { kind: 'em', children: [text('it')] }] },
    ]);
    expect(parseInline('*an **x** y*')).toEqual([
      { kind: 'em', children: [text('an '), strong('x'), text(' y')] },
    ]);
  });

  it('a star next to a space is not emphasis; an unclosed span is text', () => {
    expect(parseInline('5 * 3 * 2')).toEqual([text('5 * 3 * 2')]);
    expect(parseInline('**not closed')).toEqual([text('**not closed')]);
    expect(parseInline('* a*')).toEqual([text('* a*')]);
  });

  it('[text](url): https (external), site-relative, mailto; link text may carry emphasis', () => {
    expect(parseInline('see [the **guide**](/en/work-permit).')).toEqual([
      text('see '),
      {
        kind: 'link',
        href: '/en/work-permit',
        external: false,
        children: [text('the '), strong('guide')],
      },
      text('.'),
    ]);
    expect(parseInline('[x](https://a.example/p?q=1)')).toEqual([
      { kind: 'link', href: 'https://a.example/p?q=1', external: true, children: [text('x')] },
    ]);
    expect(parseInline('[mail](mailto:info@jobsadmire.com)')[0]).toMatchObject({
      kind: 'link',
      href: 'mailto:info@jobsadmire.com',
      external: false,
    });
  });

  it('any other link target renders its text only; links never nest', () => {
    for (const href of ['http://a.example', 'javascript:void0', '//evil.example', 'ftp://x', 'x'])
      expect(parseInline(`[t](${href})`)).toEqual([text('t')]);
    const nested = parseInline('[a [b](/x)](/y)');
    expect(nested.filter((n) => n.kind === 'link')).toHaveLength(1);
    expect(inlineText(nested)).toBe('a [b](/y)');
  });

  it('\\ escapes *, [ and ] — the escaped character is literal, any other backslash stays', () => {
    expect(parseInline('5 \\* 3 \\[a\\] \\n')).toEqual([text('5 * 3 [a] \\n')]);
    expect(parseInline('**a \\*\\* b**')).toEqual([strong('a ** b')]);
    expect(parseInline('\\[not](/link)')).toEqual([text('[not](/link)')]);
    expect(unescapeText('\\*\\[\\]')).toBe('*[]');
  });
});

describe('safeHref', () => {
  it('allows https, mailto and one site-relative path — nothing else', () => {
    expect(safeHref('https://www.csgb.gov.tr/')).toBe('https://www.csgb.gov.tr/');
    expect(safeHref('/blog')).toBe('/blog');
    expect(safeHref('mailto:a@b.co')).toBe('mailto:a@b.co');
    for (const bad of [
      'http://x.co',
      '//x.co',
      'javascript:x',
      'data:text/html,x',
      'mailto:nobody',
      'https://',
    ])
      expect(safeHref(bad), bad).toBeNull();
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
      [text('First point')],
      [text('Second '), strong('point')],
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
    expect(ol.kind === 'ol' && ol.items[0][0]).toEqual(strong('Offer.'));
  });

  it('any other blockquote is a pull quote', () => {
    const quote = blocks[7];
    expect(quote.kind === 'quote' && quote.inlines).toEqual([text('Closing quote.')]);
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
    const [p] = parseMarkdown('<img src=x onerror=alert(1)> #### h4 `code` _u_');
    expect(p.kind === 'p' && p.inlines).toEqual([
      text('<img src=x onerror=alert(1)> #### h4 `code` _u_'),
    ]);
  });

  it('### is an h3 (no TOC entry); markup in a heading is dropped to text', () => {
    const md = '## A *b* \\[c\\]\n\n### Sub **x**\n\nText';
    expect(parseMarkdown(md)).toEqual([
      { kind: 'h2', id: 'a-b-c', text: 'A b [c]' },
      { kind: 'h3', text: 'Sub x' },
      { kind: 'p', inlines: [text('Text')] },
    ]);
    expect(headings(parseMarkdown(md))).toEqual([{ id: 'a-b-c', text: 'A b [c]' }]);
  });

  it('an image line is a block of its own — only from the media route or the site, alt unescaped', () => {
    const media = 'https://operations.jobsadmire.com/api/website/v1/media/m1/1200.webp';
    const md = `Before\n![A \\[photo\\]](${media})\nAfter\n\n![x](/hero/blog.jpg)\n\n![y](https://evil.example/p.webp)\n\n![z](${media.replace('/m1/', '/../')})`;
    expect(parseMarkdown(md)).toEqual([
      { kind: 'p', inlines: [text('Before')] },
      { kind: 'image', src: media, alt: 'A [photo]' },
      { kind: 'p', inlines: [text('After')] },
      { kind: 'image', src: '/hero/blog.jpg', alt: 'x' },
    ]);
  });

  it('parses the contract fixture bodies without leaking markup characters', () => {
    const fixture = JSON.parse(
      readFileSync(join(process.cwd(), 'contract/blog-feed.v1.fixture.json'), 'utf8'),
    ) as { posts: { body: { tr: string | null; en: string | null } }[] };
    for (const post of fixture.posts)
      for (const body of [post.body.tr, post.body.en]) {
        if (!body) continue;
        const blocks = parseMarkdown(body, ['faq']);
        const flat = JSON.stringify(blocks);
        expect(flat).not.toMatch(/\*\*|\]\(|\\\\/);
      }
  });
});

describe('the video line (W249): !video[Title](key), a block of its own', () => {
  const video = (key: string, title: string) => ({ kind: 'video' as const, key, title });

  it('a line of its own is a video block — blank lines or not, the title unescaped and trimmed', () => {
    expect(
      parseMarkdown('Intro.\n\n!video[ATV: an interview](atv-vizyon-haris-jiva)\n\nAfter.'),
    ).toEqual([
      { kind: 'p', inlines: [text('Intro.')] },
      video('atv-vizyon-haris-jiva', 'ATV: an interview'),
      { kind: 'p', inlines: [text('After.')] },
    ]);
    // glued to its neighbours, like an image line
    expect(parseMarkdown('Before\n!video[A \\[cut\\] ](clip-2)\nAfter')).toEqual([
      { kind: 'p', inlines: [text('Before')] },
      video('clip-2', 'A [cut]'),
      { kind: 'p', inlines: [text('After')] },
    ]);
    // the key is not checked here: the renderer looks it up (an unknown one shows nothing)
    expect(parseMarkdown('!video[Soon](not-in-the-registry)')).toEqual([
      video('not-in-the-registry', 'Soon'),
    ]);
  });

  it('a malformed video line is a paragraph, never a video', () => {
    for (const line of [
      '!video[](atv-vizyon-haris-jiva)', // no title
      '!video[   ](atv-vizyon-haris-jiva)', // a blank title
      '!video[Title](ATV-Vizyon)', // upper case
      '!video[Title](atv_vizyon)', // not words and hyphens
      '!video[Title](atv--vizyon)',
      '!video[Title](-atv)',
      '!video[Title](https://example.com/v.mp4)', // a URL is not a key
      '!video[Title](atv vizyon)',
      '!video[Title](atv-vizyon) and more', // anything else on its line
      '!video [Title](atv-vizyon)',
      '!VIDEO[Title](atv-vizyon)',
    ]) {
      const blocks = parseMarkdown(line);
      expect(
        blocks.map((b) => b.kind),
        line,
      ).toEqual(['p']);
    }
  });

  it('inline, in a list or in a quote it is not a video', () => {
    const md = [
      'Watch !video[Title](atv-vizyon-haris-jiva) here.',
      '- !video[Title](atv-vizyon-haris-jiva)',
      '> !video[Title](atv-vizyon-haris-jiva)',
    ].join('\n\n');
    expect(parseMarkdown(md).map((b) => b.kind)).toEqual(['p', 'ul', 'quote']);
  });

  it('the owner’s first post: the intro, then the interview, then the sections', () => {
    const body = (atvPost() as { body: { tr: string } }).body.tr;
    const blocks = parseMarkdown(body, ['faq']);
    expect(blocks.slice(0, 3).map((b) => b.kind)).toEqual(['p', 'video', 'h2']);
    expect(blocks[1]).toEqual(
      video('atv-vizyon-haris-jiva', 'ATV Vizyon: JobsAdmire kurucusu Haris Jiva ile röportaj'),
    );
    expect(blocks.filter((b) => b.kind === 'video')).toHaveLength(1);
    // the interview's highlights are the Key-takeaways box (title, a blank `>`, the items)
    const callout = blocks.find((b) => b.kind === 'callout');
    expect(callout?.kind === 'callout' && callout.title).toBe('Röportajdan öne çıkanlar');
    expect(callout?.kind === 'callout' && callout.items).toHaveLength(4);
    expect(JSON.stringify(blocks)).not.toMatch(/!video|\]\(/);
  });

  it('the key pattern is the slug shape', () => {
    for (const ok of ['atv', 'atv-vizyon-haris-jiva', 'clip-2026'])
      expect(VIDEO_KEY_RE.test(ok), ok).toBe(true);
    for (const bad of ['', 'Atv', 'atv_1', 'atv-', '-atv', 'a--b', 'a b'])
      expect(VIDEO_KEY_RE.test(bad), bad).toBe(false);
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
