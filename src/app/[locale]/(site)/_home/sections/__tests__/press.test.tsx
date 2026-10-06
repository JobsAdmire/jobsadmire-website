import { cleanup, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { feedToRows, withBlogRows } from '@/content/blog-feed';
import type { BlogPost } from '@/content/collections';
import { ATV_KEY, ATV_SLUG, doorFeed } from '@/test/blog-fixtures';
import { collisionsInTree } from '@/test/class-collisions';
import { renderWithIntl } from '@/test/render';
import { homeBundle } from '../../__tests__/fixtures';
import { pressFeature } from '../../lib/press';
import { GuidesSection } from '../GuidesSection';
import { PressStrip } from '../PressStrip';

/** The homepage under `BLOG_SOURCE=OPS` with the fixture door's feed (W249): the owner's ATV post
 *  (TR only, featured, no cover) first, then the contract fixture's three posts. */
const ROWS = feedToRows(doorFeed(), vi.fn()).rows;
const TR = withBlogRows(homeBundle('tr'), ROWS);
const EN = withBlogRows(homeBundle('en'), ROWS);
const POSTER = encodeURIComponent('/media/blog/atv-vizyon-haris-jiva.jpg');
const atv = ROWS.find((r) => r.key === ATV_KEY)!;
const rowsWith = (row: BlogPost) => [row, ...ROWS.filter((r) => r.key !== ATV_KEY)];

describe('pressFeature (W249: the newest featured article showing the press video)', () => {
  it('TR: the ATV post; EN: none — no English article carries the interview', () => {
    expect(pressFeature(TR, 'tr')).toMatchObject({
      slug: ATV_SLUG,
      post: { key: ATV_KEY },
      video: { key: 'atv-vizyon-haris-jiva', video: { press: true } },
    });
    expect(pressFeature(EN, 'en')).toBeNull();
  });

  it('follows the feed: not featured, unpublished or without the video → no strip', () => {
    const unflagged = withBlogRows(homeBundle('tr'), rowsWith({ ...atv, featured: false }));
    expect(pressFeature(unflagged, 'tr')).toBeNull();
    const gone = withBlogRows(
      homeBundle('tr'),
      rowsWith({ ...atv, hasBody: { tr: false, en: false }, body: { tr: null, en: null } }),
    );
    expect(pressFeature(gone, 'tr')).toBeNull();
    const noVideo = withBlogRows(
      homeBundle('tr'),
      rowsWith({ ...atv, body: { tr: 'Metin.\n\n!video[Yakında](unknown-video)', en: null } }),
    );
    expect(pressFeature(noVideo, 'tr')).toBeNull();
    expect(pressFeature(homeBundle('tr'), 'tr')).toBeNull(); // the LOCAL bundle
  });

  it('an English article showing the interview puts the strip on the English home too', () => {
    const bilingual: BlogPost = {
      ...atv,
      slug: { ...atv.slug, en: 'atv-interview' },
      title: { ...atv.title, en: 'JobsAdmire on ATV' },
      hasBody: { tr: true, en: true },
      body: { ...atv.body, en: 'Intro.\n\n!video[The interview](atv-vizyon-haris-jiva)' },
    };
    expect(pressFeature(withBlogRows(homeBundle('en'), rowsWith(bilingual)), 'en')?.slug).toBe(
      'atv-interview',
    );
  });
});

describe('PressStrip (W249)', () => {
  it('TR: one link to the article — the decorative play thumbnail, the title, the line, the CTA', () => {
    const { container } = renderWithIntl(<PressStrip locale="tr" bundle={TR} />);
    const strip = screen.getByTestId('home-press');
    expect(strip.className).toContain('ja-reveal');
    const links = within(strip).getAllByRole('link');
    expect(links).toHaveLength(1);
    const [link] = links;
    expect(link).toHaveAttribute('href', `/blog/${ATV_SLUG}`);
    expect(link).toHaveAccessibleName(
      'ATV Vizyon’da JobsAdmire Kurucu Haris Jiva ile röportaj Röportajı izleyin →',
    );
    // a fixed height per band, so it never moves what follows
    expect(link.className).toContain('h-[88px]');
    expect(link.className).toContain('max-xs:h-[74px]');
    expect(link.className).toContain('focus-visible:outline-blue-safe');
    const thumb = link.querySelector('[aria-hidden="true"]')!;
    const img = thumb.querySelector('img')!;
    expect(img).toHaveAttribute('alt', '');
    expect(img.getAttribute('src')).toContain(POSTER);
    expect(thumb.querySelector('svg')).not.toBeNull(); // the play mark
    expect(container.textContent).not.toMatch(/\bbiz\b|\bour\b|\{|sys\./i);
    expect(collisionsInTree(container)).toEqual([]);
  });

  it('EN: nothing — no English article carries the interview yet', () => {
    const { container } = renderWithIntl(<PressStrip locale="en" bundle={EN} />, {
      locale: 'en',
    });
    expect(container).toBeEmptyDOMElement();
  });

  it('EN, once an English article shows it: the English copy and the English article', () => {
    const bilingual: BlogPost = {
      ...atv,
      slug: { ...atv.slug, en: 'atv-interview' },
      title: { ...atv.title, en: 'JobsAdmire on ATV' },
      hasBody: { tr: true, en: true },
      body: { ...atv.body, en: 'Intro.\n\n!video[The interview](atv-vizyon-haris-jiva)' },
    };
    renderWithIntl(
      <PressStrip locale="en" bundle={withBlogRows(homeBundle('en'), rowsWith(bilingual))} />,
      { locale: 'en' },
    );
    expect(screen.getByRole('link')).toHaveAttribute('href', '/en/blog/atv-interview');
    expect(screen.getByRole('link')).toHaveAccessibleName(
      'JobsAdmire on ATV Vizyon Interview with founder Haris Jiva Watch the interview →',
    );
  });
});

describe('GuidesSection with the fixture door’s feed (W249: the poster as the cover)', () => {
  it('TR: the ATV post is the featured card, showing its video’s poster, linking to the article', () => {
    renderWithIntl(<GuidesSection locale="tr" bundle={TR} />);
    const featured = screen.getByTestId('guide-featured');
    expect(featured).toHaveAttribute('href', `/blog/${ATV_SLUG}`);
    const img = within(featured).getByRole('img', {
      name: 'ATV Vizyon: JobsAdmire kurucusu Haris Jiva ile röportaj',
    });
    expect(img.getAttribute('src')).toContain(POSTER);
    expect(featured.querySelector('[data-placeholder]')).toBeNull();
    // the other two Turkish articles are the side rows
    const rows = screen.getByTestId('guides-list').querySelectorAll('[data-guide-row]');
    expect([...rows].map((r) => r.getAttribute('data-guide-row'))).toEqual([
      'cmgblog0000000000000000001',
      'cmgblog0000000000000000002',
    ]);
    cleanup();
    // EN: the Pakistan guide (featured, its own cover) leads; no ATV card in English
    renderWithIntl(<GuidesSection locale="en" bundle={EN} />, { locale: 'en' });
    expect(screen.getByTestId('guide-featured')).toHaveAttribute(
      'href',
      '/en/blog/hiring-from-pakistan-employer-guide',
    );
  });
});
