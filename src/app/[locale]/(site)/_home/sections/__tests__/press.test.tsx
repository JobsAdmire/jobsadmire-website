import { cleanup, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { feedToRows, withBlogRows } from '@/content/blog-feed';
import type { BlogPost } from '@/content/collections';
import { ATV_EN_SLUG, ATV_KEY, ATV_SLUG, atvFixtureFeed } from '@/test/blog-fixtures';
import { collisionsInTree } from '@/test/class-collisions';
import { renderWithIntl } from '@/test/render';
import { homeBundle } from '../../__tests__/fixtures';
import { pressFeature } from '../../lib/press';
import { GuidesSection } from '../GuidesSection';
import { PressStrip } from '../PressStrip';

/** The homepage under `BLOG_SOURCE=OPS` (W249): the owner's ATV post (Turkish and, since W250,
 *  English; featured, no cover) first, then the contract fixture's three posts. */
const ROWS = feedToRows(atvFixtureFeed(), vi.fn()).rows;
const TR = withBlogRows(homeBundle('tr'), ROWS);
const EN = withBlogRows(homeBundle('en'), ROWS);
const POSTER = encodeURIComponent('/media/blog/atv-vizyon-haris-jiva.jpg');
const atv = ROWS.find((r) => r.key === ATV_KEY)!;
const rowsWith = (row: BlogPost) => [row, ...ROWS.filter((r) => r.key !== ATV_KEY)];

describe('pressFeature (W249: the newest featured article showing the press video)', () => {
  it('TR: the ATV post; EN: its English version (W250) — the same interview', () => {
    expect(pressFeature(TR, 'tr')).toMatchObject({
      slug: ATV_SLUG,
      post: { key: ATV_KEY },
      video: { key: 'atv-vizyon-haris-jiva', video: { press: true } },
    });
    expect(pressFeature(EN, 'en')).toMatchObject({
      slug: ATV_EN_SLUG,
      post: { key: ATV_KEY },
      video: {
        key: 'atv-vizyon-haris-jiva',
        title: 'ATV Vizyon: interview with JobsAdmire founder Haris Jiva',
      },
    });
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
      rowsWith({
        ...atv,
        body: { tr: 'Metin.\n\n!video[Yakında](unknown-video)', en: null },
        hasBody: { tr: true, en: false },
      }),
    );
    expect(pressFeature(noVideo, 'tr')).toBeNull();
    // an English home without the English version: no strip there
    const trOnly = withBlogRows(
      homeBundle('en'),
      rowsWith({
        ...atv,
        slug: { ...atv.slug, en: null },
        title: { ...atv.title, en: null },
        body: { ...atv.body, en: null },
        hasBody: { tr: true, en: false },
      }),
    );
    expect(pressFeature(trOnly, 'en')).toBeNull();
    expect(pressFeature(homeBundle('tr'), 'tr')).toBeNull(); // the LOCAL bundle
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

  it('EN (W250): the English copy, one link to the English article', () => {
    const { container } = renderWithIntl(<PressStrip locale="en" bundle={EN} />, {
      locale: 'en',
    });
    const links = within(screen.getByTestId('home-press')).getAllByRole('link');
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute('href', `/en/blog/${ATV_EN_SLUG}`);
    expect(links[0]).toHaveAccessibleName(
      'JobsAdmire on ATV Vizyon Interview with founder Haris Jiva Watch the interview →',
    );
    expect(links[0].querySelector('img')?.getAttribute('src')).toContain(POSTER);
    expect(collisionsInTree(container)).toEqual([]);
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
    // EN (W250): the English interview leads — the newest flagged post — with the same poster,
    // its English video title as the alt; the Pakistan guide and the work-permit guide follow
    renderWithIntl(<GuidesSection locale="en" bundle={EN} />, { locale: 'en' });
    const en = screen.getByTestId('guide-featured');
    expect(en).toHaveAttribute('href', `/en/blog/${ATV_EN_SLUG}`);
    expect(
      within(en)
        .getByRole('img', { name: 'ATV Vizyon: interview with JobsAdmire founder Haris Jiva' })
        .getAttribute('src'),
    ).toContain(POSTER);
    const enRows = screen.getByTestId('guides-list').querySelectorAll('[data-guide-row]');
    expect([...enRows].map((r) => r.getAttribute('data-guide-row'))).toEqual([
      'cmgblog0000000000000000001',
      'cmgblog0000000000000000003',
    ]);
  });
});
