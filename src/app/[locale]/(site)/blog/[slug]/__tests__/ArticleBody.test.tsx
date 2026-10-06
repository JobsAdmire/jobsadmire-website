import { render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { BlogPost } from '@/content/collections';
import { BLOCK_STRINGS, testBundle } from '@/test/bundle';
import { collisionsInTree } from '@/test/class-collisions';
import { renderWithIntl } from '@/test/render';
import { ARTICLE_H2, ArticleBody } from '../_components/ArticleBody';
import { RelatedPosts } from '../_components/RelatedPosts';
import { parseMarkdown } from '../_lib/markdown';

const MD = [
  'Intro **bold**.',
  '> **Takeaways**\n>\n> - One',
  '## First section',
  '**Rule** — A lead card.',
  '- Contract\n- Passport',
  '- Salary below the ministry minimum for the role, the most common reason\n- Contract details that do not match the online application',
  '## Second section',
  '1. **Step.** Do it.',
  '> Quote.',
].join('\n\n');

describe('ArticleBody (B-8, B-11)', () => {
  it('renders the headings with their TOC ids, the takeaways box, a lead card, the lists, the steps and the quote', () => {
    const { container } = render(<ArticleBody blocks={parseMarkdown(MD)} />);
    expect(screen.getAllByRole('heading', { level: 2 }).map((h) => h.id)).toEqual([
      'first-section',
      'second-section',
    ]);
    expect(screen.getByTestId('article-takeaways')).toHaveTextContent('Takeaways');
    expect(screen.getByText('Rule').tagName).toBe('P');
    expect(screen.getByText('Step.').tagName).toBe('STRONG');
    expect(screen.getByText('Quote.').closest('blockquote')).not.toBeNull();
    expect(collisionsInTree(container)).toEqual([]);
  });

  it('a list of short items is the two-column checklist; long items stay one column', () => {
    const { container } = render(<ArticleBody blocks={parseMarkdown(MD)} />);
    const [, checklist, reasons] = screen.getAllByRole('list');
    expect(checklist.className).toContain('lg:grid-cols-2');
    expect(reasons.className).not.toContain('lg:grid-cols-2');
    // QA W221 BLOG-08: `list-none` strips the list semantics in Safari/VoiceOver — every list
    // (takeaways, checklist, reasons, steps) keeps them with an explicit role
    const lists = container.querySelectorAll('ul, ol');
    expect(lists.length).toBeGreaterThanOrEqual(4);
    for (const list of lists) {
      expect(list.className).toContain('list-none');
      expect(list).toHaveAttribute('role', 'list');
    }
  });

  it('two-up grids collapse at ≤ 900 px like the design, and the body h2 steps down at ≤ 700 px (D27 run 1)', () => {
    const { container } = render(<ArticleBody blocks={parseMarkdown(MD)} />);
    const leads = screen.getByText('Rule').closest('div')?.parentElement;
    expect(leads?.className).toContain('lg:grid-cols-2');
    expect(leads?.className).not.toContain('md:grid-cols-2');
    expect(container.innerHTML).not.toContain('sm:grid-cols-2');
    expect(ARTICLE_H2).toContain('max-md:text-[22px]');
  });

  it('the checklist wears green ✓ circles; the long-item list is the amber ⚠ box (S3.1, S3.2)', () => {
    render(<ArticleBody blocks={parseMarkdown(MD)} />);
    const checks = screen.getAllByTestId('article-check');
    expect(checks).toHaveLength(2);
    expect(checks[0].className).toContain('bg-success');
    expect(checks[0]).toHaveTextContent('✓');
    const warning = screen.getByTestId('article-warning');
    expect(warning.className).toContain('bg-[#fef8ec]');
    expect(warning.querySelectorAll('li')).toHaveLength(2);
    expect(warning).toHaveTextContent('⚠');
  });

  it('each h2 and its blocks is a collapsible section; the pull quote closes the last one (M1)', () => {
    render(<ArticleBody blocks={parseMarkdown(MD)} />);
    const sections = screen.getAllByTestId('article-section');
    expect(sections).toHaveLength(2);
    expect(sections[0].className).toContain('max-md:border-t');
    expect(sections[0].querySelector('h2')?.id).toBe('first-section');
    expect(sections[1]).not.toContainElement(screen.getByTestId('article-quote'));
  });

  it('the pull-quote button is hidden on phones and the mark is straight (M3, S3.5)', () => {
    render(<ArticleBody blocks={parseMarkdown(MD)} closingCta={<a href="#talk">Talk</a>} />);
    expect(screen.getByRole('link', { name: 'Talk' }).parentElement?.className).toContain(
      'max-md:hidden',
    );
    expect(screen.getByTestId('article-quote')).toHaveTextContent('"');
    expect(screen.getByTestId('article-quote')).not.toHaveTextContent('“');
  });

  it('puts the closing CTA inside the final quote box', () => {
    render(<ArticleBody blocks={parseMarkdown(MD)} closingCta={<a href="#talk">Talk</a>} />);
    expect(screen.getByTestId('article-quote')).toContainElement(
      screen.getByRole('link', { name: 'Talk' }),
    );
  });

  it('puts it after the body when the last block is not a quote', () => {
    render(
      <ArticleBody blocks={parseMarkdown('Just text.')} closingCta={<a href="#talk">Talk</a>} />,
    );
    expect(screen.queryByTestId('article-quote')).toBeNull();
    expect(screen.getByRole('link', { name: 'Talk' })).toBeInTheDocument();
  });

  it('never turns body text into markup', () => {
    const { container } = render(
      <ArticleBody blocks={parseMarkdown('<b>x</b> <script>y</script>')} />,
    );
    expect(container.querySelector('b, script')).toBeNull();
    expect(container.textContent).toContain('<b>x</b>');
  });
});

describe('ArticleBody — the blog.v1 additions (W248)', () => {
  const V1 = [
    'Read *this* and [the guide](/en/work-permit), the [rules](https://www.csgb.gov.tr/) or [write](mailto:info@jobsadmire.com).',
    '## Costs',
    '### Fees',
    'Bad [link](javascript:void0) and [plain](http://example.com) stay text; 5 \\* 3 stays literal.',
    '![A recruiter at work](https://operations.jobsadmire.com/api/website/v1/media/m1/1200.webp)',
    '![tracker](https://evil.example.com/pixel.webp)',
  ].join('\n\n');

  it('renders italics, site links through next/link, external links in a new tab with noopener, mailto plainly', () => {
    const { container } = render(<ArticleBody blocks={parseMarkdown(V1)} />);
    expect(screen.getByText('this').tagName).toBe('EM');
    const site = screen.getByRole('link', { name: 'the guide' });
    expect(site).toHaveAttribute('href', '/en/work-permit');
    expect(site).not.toHaveAttribute('target');
    const ext = screen.getByRole('link', { name: 'rules' });
    expect(ext).toHaveAttribute('href', 'https://www.csgb.gov.tr/');
    expect(ext).toHaveAttribute('target', '_blank');
    expect(ext).toHaveAttribute('rel', 'noopener');
    const mail = screen.getByRole('link', { name: 'write' });
    expect(mail).toHaveAttribute('href', 'mailto:info@jobsadmire.com');
    expect(mail).not.toHaveAttribute('target');
    for (const a of container.querySelectorAll('a')) expect(a.className).toContain('underline');
  });

  it('an unsafe or http link renders its text only; an escaped star is a literal star', () => {
    const { container } = render(<ArticleBody blocks={parseMarkdown(V1)} />);
    expect(container.querySelectorAll('a')).toHaveLength(3);
    expect(container.textContent).toContain('Bad link and plain stay text; 5 * 3 stays literal.');
    expect(container.innerHTML).not.toContain('javascript:');
  });

  it('an h3 sits inside its h2 section; only the media route image renders, sized and never cropped', () => {
    render(<ArticleBody blocks={parseMarkdown(V1)} />);
    const h3 = screen.getByRole('heading', { level: 3, name: 'Fees' });
    expect(h3.closest('[data-testid="article-section"]')?.querySelector('h2')?.id).toBe('costs');
    const figures = screen.getAllByTestId('article-image');
    expect(figures).toHaveLength(1);
    const img = within(figures[0]).getByRole('img', { name: 'A recruiter at work' });
    expect(img.getAttribute('src')).toContain(
      encodeURIComponent('https://operations.jobsadmire.com/api/website/v1/media/m1/1200.webp'),
    );
    expect(img).toHaveAttribute('sizes');
    expect(img.className).toContain('h-auto');
    expect(img.className).not.toContain('object-cover');
    expect(document.body.innerHTML).not.toContain('evil.example.com');
  });
});

const row = (key: string): BlogPost => ({
  key,
  slug: { tr: `${key}-tr`, en: key },
  title: { tr: `Başlık ${key}`, en: `Title ${key}` },
  excerpt: { tr: 'Özet', en: 'Excerpt' },
  category: 'workPermits',
  categoryLabelId: 'home.263',
  author: 'JobsAdmire',
  publishedAt: '2026-06-12',
  readMinutes: 5,
  hasBody: { tr: true, en: true },
  body: { tr: 'metin', en: 'text' },
});
const bundle = testBundle({
  strings: {
    ...BLOCK_STRINGS,
    'home.263': 'Work Permits',
    'blogarticle.081': 'Related articles',
    'blogarticle.082': '← Previous article',
    'blogarticle.083': 'Next article →',
  },
});

describe('RelatedPosts (W248: written articles only, no "yakında" cards)', () => {
  it('never renders a card or a neighbour for an article without a body here', () => {
    const bodiless: BlogPost = {
      ...row('x'),
      hasBody: { tr: false, en: false },
      body: { tr: null, en: null },
    };
    renderWithIntl(
      <RelatedPosts
        bundle={bundle}
        locale="en"
        related={[row('a'), bodiless]}
        prev={null}
        next={bodiless}
      />,
      { locale: 'en' },
    );
    const cards = screen.getAllByTestId('article-related-card');
    expect(cards).toHaveLength(1);
    expect(cards[0].querySelector('a')).toHaveAttribute('href', '/en/blog/a');
    expect(screen.queryByTestId('article-next')).toBeNull();
    expect(document.querySelector('[data-soon-tag], [data-testid="article-soon"]')).toBeNull();
  });

  it('a related card shows the post cover photo when it has one', () => {
    const { container } = renderWithIntl(
      <RelatedPosts
        bundle={bundle}
        locale="en"
        related={[
          {
            ...row('a'),
            cover: {
              url: 'https://operations.jobsadmire.com/api/website/v1/media/m1/1600.webp',
              width: 1600,
              height: 900,
            },
          },
        ]}
        prev={null}
        next={null}
      />,
      { locale: 'en' },
    );
    expect(container.querySelector('[data-cover-photo="blog-cover-a"] img')).not.toBeNull();
    expect(container.querySelector('[data-placeholder="blog-cover-a"]')).toBeNull();
  });
});

describe('RelatedPosts (B-2)', () => {
  it('renders nothing without related articles or neighbours — the Phase A state', () => {
    const { container } = renderWithIntl(
      <RelatedPosts bundle={bundle} locale="en" related={[]} prev={null} next={null} />,
      { locale: 'en' },
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the related cards (the third hidden on phones) and the neighbour links', () => {
    const { container } = renderWithIntl(
      <RelatedPosts
        bundle={bundle}
        locale="en"
        related={[row('a'), row('b'), row('c')]}
        prev={row('p')}
        next={null}
      />,
      { locale: 'en' },
    );
    expect(screen.getByRole('heading', { level: 2, name: 'Related articles' })).toBeInTheDocument();
    const items = screen.getByTestId('article-related').querySelectorAll('li');
    expect(items).toHaveLength(3);
    expect(items[2].className).toContain('max-md:hidden');
    expect(screen.getByTestId('article-prev')).toHaveAttribute('href', '/en/blog/p');
    expect(screen.queryByTestId('article-next')).toBeNull();
    expect(collisionsInTree(container)).toEqual([]);
  });
});

describe('ArticleBody — the video block (W249)', () => {
  const TITLE = 'ATV Vizyon: JobsAdmire kurucusu Haris Jiva ile röportaj';
  const MD_VIDEO = `Intro.\n\n!video[${TITLE}](atv-vizyon-haris-jiva)\n\n## Section\n\nText.`;

  it('a captioned native player in a fixed 16:9 box: poster, MP4 source, Turkish + English tracks, no autoplay', () => {
    const { container } = render(<ArticleBody blocks={parseMarkdown(MD_VIDEO)} locale="tr" />);
    const figure = screen.getByTestId('article-video');
    expect(figure.tagName).toBe('FIGURE');
    expect(figure).toHaveAttribute('data-video-key', 'atv-vizyon-haris-jiva');
    // the box reserves the player's space before anything loads; the body's image face
    const box = figure.firstElementChild as HTMLElement;
    expect(box.className).toContain('aspect-video');
    expect(box.className).toContain('rounded-base');
    expect(box.className).toContain('border-tint-border');
    const video = figure.querySelector('video')!;
    expect(video).toHaveAttribute('controls');
    expect(video).toHaveAttribute('preload', 'none');
    expect(video).toHaveAttribute('playsinline');
    expect(video).not.toHaveAttribute('autoplay');
    expect(video).toHaveAttribute('poster', '/media/blog/atv-vizyon-haris-jiva.jpg');
    expect(video).toHaveAttribute('width', '1920');
    expect(video).toHaveAttribute('height', '1080');
    expect(video).toHaveAttribute('aria-label', TITLE);
    const source = video.querySelector('source')!;
    expect(source).toHaveAttribute('src', '/media/blog/atv-vizyon-haris-jiva.mp4');
    expect(source).toHaveAttribute('type', 'video/mp4');
    // W250: the Turkish captions and their English translation; the page's language is on
    const tracks = video.querySelectorAll('track');
    expect(tracks).toHaveLength(2);
    expect([...tracks].map((t) => t.getAttribute('kind'))).toEqual(['captions', 'captions']);
    expect(tracks[0]).toHaveAttribute('srclang', 'tr');
    expect(tracks[0]).toHaveAttribute('label', 'Türkçe');
    expect(tracks[0]).toHaveAttribute('src', '/media/blog/atv-vizyon-haris-jiva.tr.vtt');
    expect(tracks[0]).toHaveAttribute('default');
    expect(tracks[1]).toHaveAttribute('srclang', 'en');
    expect(tracks[1]).toHaveAttribute('label', 'English');
    expect(tracks[1]).toHaveAttribute('src', '/media/blog/atv-vizyon-haris-jiva.en.vtt');
    expect(tracks[1]).not.toHaveAttribute('default');
    expect(within(figure).getByText(TITLE).tagName).toBe('FIGCAPTION');
    // before the first h2: outside every collapsible section, so never folded away on phones
    expect(figure.closest('[data-testid="article-section"]')).toBeNull();
    expect(collisionsInTree(container)).toEqual([]);
  });

  it('the default track follows the page: English on an English page, Turkish on a Turkish one (W250)', () => {
    const on = (locale: 'tr' | 'en') => {
      const { unmount } = render(<ArticleBody blocks={parseMarkdown(MD_VIDEO)} locale={locale} />);
      const tracks = [...screen.getByTestId('article-video').querySelectorAll('track')];
      const defaults = tracks.filter((t) => t.hasAttribute('default'));
      unmount();
      return defaults.map((t) => t.getAttribute('srclang'));
    };
    expect(on('en')).toEqual(['en']);
    expect(on('tr')).toEqual(['tr']);
    // no page language: every track offered, none forced on
    render(<ArticleBody blocks={parseMarkdown(MD_VIDEO)} />);
    const tracks = screen.getByTestId('article-video').querySelectorAll('track');
    expect(tracks).toHaveLength(2);
    expect([...tracks].some((t) => t.hasAttribute('default'))).toBe(false);
  });

  it('a key the registry does not know renders nothing (and says so outside production)', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { container } = render(
      <ArticleBody blocks={parseMarkdown('Before.\n\n!video[Soon](not-yet)\n\nAfter.')} />,
    );
    expect(screen.queryByTestId('article-video')).toBeNull();
    expect(container.querySelector('video, figure')).toBeNull();
    expect(container).toHaveTextContent('Before.After.');
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('"not-yet"'));
    warn.mockRestore();
  });

  it('a pull quote inside the body stays in its section; only the closing one stands outside', () => {
    const md = [
      '## One',
      'Text.',
      '> A quote mid-section.',
      'More of one.',
      '## Two',
      '> Closing.',
    ];
    render(<ArticleBody blocks={parseMarkdown(md.join('\n\n'))} />);
    const [one, two] = screen.getAllByTestId('article-section');
    const [mid, closing] = screen.getAllByTestId('article-quote');
    expect(one).toContainElement(mid);
    expect(one).toHaveTextContent('More of one.');
    expect(two).not.toContainElement(closing);
  });
});
