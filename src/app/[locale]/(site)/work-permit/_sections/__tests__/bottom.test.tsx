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

describe('RelatedArticles (W4)', () => {
  it('below the blog threshold (0 Turkish bodies) shows the design’s three sample cards with the örnek tag and no /blog link', () => {
    const { container } = renderWithIntl(
      <RelatedArticles bundle={BUNDLES.tr} locale="tr" tf={tfTr} />,
    );
    const region = screen.getByTestId('wp-related');
    expect(region).toHaveTextContent(tfTr('wp.351'));
    expect(container.querySelector('[data-sample-tag]')).not.toBeNull();
    const cards = within(screen.getByTestId('wp-related-sample')).getAllByRole('article');
    expect(cards).toHaveLength(3);
    expect(cards[0]).toHaveTextContent(tfTr('wp.353'));
    expect(cards[2]).toHaveTextContent(tfTr('wp.358'));
    expect(within(region).queryAllByRole('link')).toHaveLength(0);
  });

  it('once the threshold is met, shows up to three work-permit posts with a body in this locale', () => {
    const posts = getCollection(BUNDLES.tr, 'blog').map((p, i) => ({
      ...p,
      slug: { ...p.slug, tr: p.slug.tr ?? `yazi-${i}` },
      title: { ...p.title, tr: p.title.tr ?? `Yazı ${i}` },
      hasBody: { ...p.hasBody, tr: true },
      body: { ...p.body, tr: '# Başlık' },
    }));
    const bundle: Bundle = {
      ...BUNDLES.tr,
      collections: { ...BUNDLES.tr.collections, blog: posts },
    };
    const { container } = renderWithIntl(<RelatedArticles bundle={bundle} locale="tr" tf={tfTr} />);
    const region = screen.getByTestId('wp-related');
    const cards = within(region).getAllByRole('article');
    expect(cards).toHaveLength(RELATED_LIMIT);
    const expected = posts.filter((p) => p.category === 'workPermits').slice(0, RELATED_LIMIT);
    expect(cards.map((c) => within(c).getByRole('link').getAttribute('href'))).toEqual(
      expected.map((p) => `/blog/${p.slug.tr}`),
    );
    expect(within(region).getByRole('link', { name: tfTr('wp.352') })).toHaveAttribute(
      'href',
      '/blog',
    );
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
