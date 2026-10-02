import { render, screen } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { collisionsInTree } from '@/test/class-collisions';
import { ArticleSidebar, type ArticleSidebarProps } from '../_components/ArticleSidebar';
import { ArticleSidebarFallback } from '../_components/ArticleSidebarFallback';
import { ArticleSidebarIsland } from '../_components/ArticleSidebarIsland';

const PROPS: ArticleSidebarProps = {
  headings: [
    { id: 'who-can-hire', text: 'Who can hire?' },
    { id: 'documents', text: 'Documents' },
    { id: 'faq', text: 'FAQ' },
  ],
  tocLabel: 'In this article',
  readMinutes: 8,
  remaining: '≈ {n} min left',
  url: 'https://www.jobsadmire.com/en/blog/guide',
  title: "Turkey work permit: the employer's guide",
  share: {
    heading: 'Share',
    share: 'Share',
    whatsapp: 'Share on WhatsApp',
    linkedin: 'Share on LinkedIn',
    x: 'Share on X',
    copy: 'Copy link',
    copied: 'Copied!',
    copyFailed: 'The link could not be copied.',
  },
  printLabel: 'Print this article',
};

describe('the article sidebar island and its fallback (B-13, W132)', () => {
  it('the server fallback is DOM-identical to the island’s first render — the LazyIsland swap never shifts the layout', () => {
    expect(renderToStaticMarkup(<ArticleSidebarFallback {...PROPS} />)).toBe(
      renderToStaticMarkup(<ArticleSidebar {...PROPS} />),
    );
  });

  it('server-renders the TOC landmark (first entry current), the remaining time, the share links and the print button', () => {
    const html = renderToStaticMarkup(<ArticleSidebarFallback {...PROPS} />);
    expect(html).toContain('<nav aria-label="In this article">');
    expect(html).toContain('href="#who-can-hire" aria-current="location"');
    expect(html).toContain('≈ 8 min left');
    expect(html).toContain('https://wa.me/?text=');
    expect(html).toContain('print-hidden mt-3');
  });

  it('the binder shows the fallback until the wrapper is in view (jsdom has no IntersectionObserver)', () => {
    const { container } = render(
      <ArticleSidebarIsland {...PROPS} fallback={<ArticleSidebarFallback {...PROPS} />} />,
    );
    expect(screen.getByRole('navigation', { name: 'In this article' })).toBeInTheDocument();
    expect(screen.getByTestId('article-share')).toBeInTheDocument();
    expect(collisionsInTree(container)).toEqual([]);
  });
});
