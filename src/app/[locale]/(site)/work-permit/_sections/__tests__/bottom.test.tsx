import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { getCollection } from '@/content/collections';
import { waLink } from '@/lib/contact';
import en from '@/messages/en.json';
import { collisionsInTree } from '@/test/class-collisions';
import { renderWithIntl } from '@/test/render';
import type { Bundle } from '../../../../../../../contract/website-bundle.v1';
import { BUNDLES, tfFor, tokens } from '../../_lib/__tests__/helpers';
import { Faq } from '../Faq';
import { PermitCta } from '../PermitCta';
import { RelatedArticles, RELATED_LIMIT } from '../RelatedArticles';

const tfTr = tfFor('tr');
const tfEn = tfFor('en');
const PERMIT_ONLY_TR = waLink(
  '905011240340',
  'Merhaba JobsAdmire, kendi işçim var — çalışma iznini siz yürütebilir misiniz?',
);

type Node = Record<string, unknown> & { '@type'?: string };

describe('Faq', () => {
  it('#faq: nine pairs, the first open, one FAQPage node whose fourth answer is the sys copy, and the W83 ask card', () => {
    const { container } = renderWithIntl(<Faq bundle={BUNDLES.en} locale="en" tf={tfEn} />, {
      locale: 'en',
    });
    expect(container.querySelector('section#faq')).not.toBeNull();
    expect(container.querySelectorAll('[id="faq"]')).toHaveLength(1); // FaqBlock's own root is #faq-list
    const region = screen.getByTestId('wp-faq');
    expect(within(region).getAllByRole('button', { expanded: true })).toHaveLength(1);
    expect(within(region).getAllByRole('button', { expanded: false })).toHaveLength(8);
    const nodes = Array.from(container.querySelectorAll('script[type="application/ld+json"]')).map(
      (s) => JSON.parse(s.textContent ?? '{}') as Node,
    );
    const faq = nodes.filter((n) => n['@type'] === 'FAQPage') as unknown as {
      mainEntity: { name: string; acceptedAnswer: { text: string } }[];
    }[];
    expect(faq).toHaveLength(1);
    expect(faq[0].mainEntity).toHaveLength(9);
    expect(faq[0].mainEntity[3].name).toBe(tfEn('wp.340'));
    expect(faq[0].mainEntity[3].acceptedAnswer.text).toBe(en.sys.wp.faq.exemptionAnswer);
    expect(within(region).getByRole('link', { name: new RegExp(tfEn('wp.332')) })).toHaveAttribute(
      'href',
      waLink('905011240340', 'Hello JobsAdmire, I have a work permit question.'),
    );
    expect(within(region).getByRole('link', { name: new RegExp(tfEn('wp.333')) })).toHaveAttribute(
      'href',
      `mailto:info@jobsadmire.com?subject=${encodeURIComponent('Work permit question')}`,
    );
    // parity S14.2: the rows layout shows the numbers, and ≤ 700 px the card is hidden
    expect(region).toHaveTextContent('+90 501 124 03 40');
    expect(region).toHaveTextContent('info@jobsadmire.com');
    expect(collisionsInTree(container)).toEqual([]);
  });
});

describe('RelatedArticles (W248: real posts, the samples only while none exists)', () => {
  it('TR on the LOCAL bundle (no Turkish article): the design’s three sample cards with the örnek tag, each into /blog', () => {
    const { container } = renderWithIntl(
      <RelatedArticles bundle={BUNDLES.tr} locale="tr" tf={tfTr} />,
    );
    const region = screen.getByTestId('wp-related');
    expect(region).toHaveTextContent(tfTr('wp.351'));
    expect(container.querySelector('[data-sample-tag]')).not.toBeNull();
    const list = screen.getByTestId('wp-related-sample');
    const cards = within(list).getAllByRole('link');
    expect(cards).toHaveLength(3);
    expect(cards[0]).toHaveTextContent(tfTr('wp.353'));
    expect(cards[2]).toHaveTextContent(tfTr('wp.358'));
    for (const card of cards) expect(card).toHaveAttribute('href', '/blog');
    expect(within(region).getByRole('link', { name: tfTr('wp.352') })).toHaveAttribute(
      'href',
      '/blog',
    );
  });

  it('EN on the LOCAL bundle: the one written article is the one card — no samples, no empty slots', () => {
    renderWithIntl(<RelatedArticles bundle={BUNDLES.en} locale="en" tf={tfEn} />, {
      locale: 'en',
    });
    const region = screen.getByTestId('wp-related');
    expect(region.querySelector('[data-sample-tag]')).toBeNull();
    const cards = within(region).getAllByRole('article');
    expect(cards).toHaveLength(1);
    expect(within(cards[0]).getByRole('link').getAttribute('href')).toBe(
      '/en/blog/turkey-work-permit-process-employer-guide',
    );
  });

  it('with more posts: work-permit articles first, then the newest others, capped at three', () => {
    const base = getCollection(BUNDLES.tr, 'blog')[0];
    const make = (key: string, category: typeof base.category, publishedAt: string) => ({
      ...base,
      key,
      category,
      publishedAt,
      slug: { tr: key, en: null },
      title: { tr: `Yazı ${key}`, en: null },
      hasBody: { tr: true, en: false },
      body: { tr: 'Metin', en: null },
    });
    const posts = [
      make('r-new', 'recruitment', '2026-09-01'),
      make('wp-old', 'workPermits', '2026-01-01'),
      make('c-mid', 'compliance', '2026-05-01'),
      make('wp-new', 'workPermits', '2026-08-01'),
    ];
    const bundle: Bundle = {
      ...BUNDLES.tr,
      collections: { ...BUNDLES.tr.collections, blog: posts },
    };
    const { container } = renderWithIntl(<RelatedArticles bundle={bundle} locale="tr" tf={tfTr} />);
    const region = screen.getByTestId('wp-related');
    const cards = within(region).getAllByRole('article');
    expect(cards).toHaveLength(RELATED_LIMIT);
    expect(cards.map((c) => within(c).getByRole('link').getAttribute('href'))).toEqual([
      '/blog/wp-new',
      '/blog/wp-old',
      '/blog/r-new',
    ]);
    expect(collisionsInTree(container)).toEqual([]);
  });
});

describe('PermitCta', () => {
  it('renders #permit-cta — the header CTA’s target (W152/W158) — with the W10 CTA sets and the licence line', () => {
    const { container } = renderWithIntl(<PermitCta bundle={BUNDLES.tr} tf={tfTr} />);
    const band = container.querySelector<HTMLElement>('section#permit-cta');
    expect(band).not.toBeNull();
    expect(tokens(screen.getByTestId('wp-cta-desk'))).toContain('max-md:hidden');
    expect(tokens(screen.getByTestId('wp-cta-mob'))).toContain('md:hidden');
    const buttons = screen.getByTestId('wp-cta-buttons');
    expect(tokens(buttons)).toContain('max-md:hidden');
    expect(
      within(buttons)
        .getAllByRole('link')
        .map((a) => a.getAttribute('href')),
    ).toEqual(['/isci-talebi', PERMIT_ONLY_TR, 'tel:+905011240340']);
    const routes = screen.getByTestId('wp-cta-routes');
    expect(tokens(routes)).toContain('md:hidden');
    expect(
      within(routes)
        .getAllByRole('link')
        .map((a) => a.getAttribute('href')),
    ).toEqual(['/isci-talebi', PERMIT_ONLY_TR]);
    expect(band).toHaveTextContent(tfTr('wp.395'));
    expect(within(band!).getByRole('link', { name: 'info@jobsadmire.com' })).toHaveAttribute(
      'href',
      'mailto:info@jobsadmire.com',
    );
    expect(collisionsInTree(container)).toEqual([]);
  });
});
