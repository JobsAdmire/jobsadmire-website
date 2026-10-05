import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
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

describe('RelatedPosts (owner ruling 2026-10-05)', () => {
  it('a card whose article has no body here is not a link and wears the soon tag', () => {
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
    expect(cards[0]).toHaveAttribute('data-linked', 'true');
    expect(cards[0].querySelector('a')).toHaveAttribute('href', '/en/blog/a');
    expect(cards[1]).toHaveAttribute('data-linked', 'false');
    expect(cards[1].querySelector('a')).toBeNull();
    expect(screen.getAllByTestId('article-soon')).toHaveLength(2); // the card + the Next card
    const next = screen.getByTestId('article-next');
    expect(next.tagName).not.toBe('A');
    expect(next.className).toContain('text-right');
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
