import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { waLink } from '@/lib/contact';
import { collisionsInTree } from '@/test/class-collisions';
import { renderWithIntl } from '@/test/render';
import { BUNDLES, tfFor, tokens } from '../../_lib/__tests__/helpers';
import { Costs } from '../Costs';
import { Documents } from '../Documents';
import { Exemptions } from '../Exemptions';
import { PermitTypes } from '../PermitTypes';
import { Process } from '../Process';
import { Renewal } from '../Renewal';
import { Rules } from '../Rules';
import { Timeline } from '../Timeline';

const tfTr = tfFor('tr');
const tfEn = tfFor('en');
const waTr = (tail: string) => waLink('905011240340', `Merhaba JobsAdmire, ${tail}`);
const waEn = (tail: string) => waLink('905011240340', `Hello JobsAdmire, ${tail}`);

describe('PermitTypes', () => {
  it('the featured fixed-term card (three bullets), four other types and the ask card’s WhatsApp door', () => {
    const { container } = renderWithIntl(<PermitTypes bundle={BUNDLES.en} tf={tfEn} />, {
      locale: 'en',
    });
    const region = screen.getByTestId('wp-types');
    expect(
      within(region).getByRole('heading', {
        level: 3,
        name: `${tfEn('wp.164')} ${tfEn('wp.165')}`,
      }),
    ).toBeInTheDocument();
    expect(within(screen.getByTestId('wp-types-featured')).getAllByRole('listitem')).toHaveLength(
      3,
    );
    expect(within(screen.getByTestId('wp-types-other')).getAllByRole('listitem')).toHaveLength(4);
    expect(within(region).getByRole('link', { name: tfEn('wp.186') })).toHaveAttribute(
      'href',
      waEn('which work permit type applies to my case?'),
    );
    expect(collisionsInTree(container)).toEqual([]);
  });

  // QA W221 WP-05: wp.165 is the Turkish term the EN card glosses ("· Süreli" after "Fixed-term
  // permit"); on the TR page the card title is already that word, so the gloss doubled it
  // ("Süreli izin · Süreli") — EN only.
  it('TR: the featured card carries no local-term gloss — the title is the Turkish term', () => {
    renderWithIntl(<PermitTypes bundle={BUNDLES.tr} tf={tfTr} />, { locale: 'tr' });
    const featured = screen.getByTestId('wp-types-featured');
    expect(within(featured).getByRole('heading', { level: 3 })).toHaveTextContent(tfTr('wp.164'));
    expect(featured.textContent).not.toContain(tfTr('wp.165'));
  });
});

describe('Rules', () => {
  it('#rules: six numbered rules, the four legal-flagged penalty lines verbatim, the W10 intro variants', () => {
    const { container } = renderWithIntl(<Rules tf={tfEn} />, { locale: 'en' });
    expect(container.querySelector('section#rules')).not.toBeNull();
    expect(within(screen.getByTestId('wp-rules-list')).getAllByRole('listitem')).toHaveLength(6);
    expect(
      within(screen.getByTestId('wp-penalties'))
        .getAllByRole('listitem')
        .map((li) => li.textContent),
    ).toEqual(['wp.196', 'wp.197', 'wp.198', 'wp.199'].map((id) => tfEn(id)));
    const desk = screen.getByTestId('wp-rules-desk');
    expect(tokens(desk)).toContain('max-md:hidden');
    expect(within(desk).getByRole('link', { name: tfEn('wp.190') })).toHaveAttribute(
      'href',
      '/en/hire-workers',
    );
    expect(desk.textContent).toContain(`${tfEn('wp.190')},`); // wp.191 opens with its comma (W23)
    expect(tokens(screen.getByTestId('wp-rules-mob'))).toContain('md:hidden');
    expect(collisionsInTree(container)).toEqual([]);
  });
});

describe('Exemptions', () => {
  it('#muafiyet: five Article-48 cards, the more-categories WhatsApp tile, four facts and the two in-page links', () => {
    const { container } = renderWithIntl(<Exemptions bundle={BUNDLES.tr} tf={tfTr} />);
    expect(container.querySelector('section#muafiyet')).not.toBeNull();
    const region = screen.getByTestId('wp-muafiyet');
    expect(within(region).getAllByRole('article')).toHaveLength(5);
    expect(within(region).getByRole('link', { name: tfTr('wp.215') })).toHaveAttribute(
      'href',
      '#rules',
    );
    expect(within(region).getByRole('link', { name: tfTr('wp.217') })).toHaveAttribute(
      'href',
      '#eligibility',
    );
    expect(within(region).getByRole('link', { name: tfTr('wp.186') })).toHaveAttribute(
      'href',
      waTr('durumum çalışma izni muafiyetine giriyor mu?'),
    );
    expect(region.querySelectorAll('dt')).toHaveLength(4);
    expect(collisionsInTree(container)).toEqual([]);
  });
});

describe('Process', () => {
  it('four ordered steps, the last with the SGK day-one badge, and the permit-only banner', () => {
    const { container } = renderWithIntl(<Process bundle={BUNDLES.tr} tf={tfTr} />);
    const region = screen.getByTestId('wp-process');
    const steps = within(region).getAllByRole('listitem');
    expect(steps).toHaveLength(4);
    expect(steps[3]).toHaveTextContent(tfTr('wp.255'));
    expect(within(region).getByRole('link', { name: tfTr('wp.090') })).toHaveAttribute(
      'href',
      waTr('kendi işçim var — çalışma iznini siz yürütebilir misiniz?'),
    );
    expect(collisionsInTree(container)).toEqual([]);
  });
});

describe('Timeline', () => {
  it('#timeline: both cards at every width — no tabs (D20) — with the metric durations (W1)', () => {
    const { container } = renderWithIntl(<Timeline tf={tfTr} />);
    expect(container.querySelector('section#timeline')).not.toBeNull();
    const abroad = screen.getByTestId('wp-timeline-abroad');
    const here = screen.getByTestId('wp-timeline-here');
    for (const card of [abroad, here])
      expect(tokens(card).some((t) => t.endsWith('hidden'))).toBe(false);
    expect(abroad).toHaveTextContent('~6–8 hafta'); // wp.264 {firstDayWeeks}
    expect(here).toHaveTextContent('~4–6 hafta'); // wp.274 {firstDayWeeksInCountry}
    expect(abroad.querySelectorAll('dt')).toHaveLength(4);
    expect(here.querySelectorAll('dt')).toHaveLength(3);
    expect(here).toHaveTextContent(tfTr('wp.280'));
    expect(screen.queryAllByRole('tab')).toHaveLength(0);
    expect(collisionsInTree(container)).toEqual([]);
  });
});

describe('Costs', () => {
  it('#costs: three cost lines, no amount anywhere, the quote CTA on the service-fee card', () => {
    const { container } = renderWithIntl(<Costs bundle={BUNDLES.en} tf={tfEn} />, {
      locale: 'en',
    });
    expect(container.querySelector('section#costs')).not.toBeNull();
    const region = screen.getByTestId('wp-costs');
    expect(within(region).getAllByRole('article')).toHaveLength(3);
    expect(region.textContent).not.toMatch(/₺|\bTRY\b/);
    expect(within(region).getByRole('link', { name: tfEn('wp.296') })).toHaveAttribute(
      'href',
      waEn('what would a work permit cost for my case?'),
    );
    expect(collisionsInTree(container)).toEqual([]);
  });
});

describe('Documents', () => {
  it('#documents: two lists of six, each count computed from its list (D17)', () => {
    const { container } = renderWithIntl(<Documents tf={tfTr} locale="tr" />);
    expect(container.querySelector('section#documents')).not.toBeNull();
    for (const key of ['employer', 'worker']) {
      const list = screen.getByTestId(`wp-docs-${key}`);
      expect(within(list).getAllByRole('listitem')).toHaveLength(6);
      expect(list).toHaveTextContent('6 belge');
    }
    expect(collisionsInTree(container)).toEqual([]);
  });

  it('EN pluralises the computed count — never wp.300’s typed "6 docs"', () => {
    renderWithIntl(<Documents tf={tfEn} locale="en" />, { locale: 'en' });
    const worker = screen.getByTestId('wp-docs-worker');
    expect(worker).toHaveTextContent('6 documents');
    expect(worker.textContent).not.toContain(tfEn('wp.300'));
  });

  // QA W221 WP-04: the parenthetical notes (wp.302 "(vergi levhası)", 304, 308, 310) gloss the
  // Turkish document names for English readers; on the TR page the item text IS that name, so
  // the note doubled it ("Vergi levhası (vergi levhası)") — EN only.
  it('renders the document-name glosses on the EN page only (WP-04)', () => {
    const { unmount } = renderWithIntl(<Documents tf={tfEn} locale="en" />, { locale: 'en' });
    expect(screen.getByTestId('wp-docs-employer').textContent).toContain(tfEn('wp.302'));
    unmount();
    renderWithIntl(<Documents tf={tfTr} locale="tr" />);
    expect(screen.getByTestId('wp-docs-employer').textContent).not.toContain(tfTr('wp.302'));
    expect(within(screen.getByTestId('wp-docs-employer')).getAllByRole('listitem')).toHaveLength(6);
  });
});

describe('Renewal', () => {
  it('the W10 renewal variants, the ≤ 700 px window line and the renewal WhatsApp door', () => {
    const { container } = renderWithIntl(<Renewal bundle={BUNDLES.en} tf={tfEn} />, {
      locale: 'en',
    });
    const banner = screen.getByTestId('wp-renewal');
    expect(tokens(screen.getByTestId('wp-renewal-desk'))).toContain('max-md:hidden');
    expect(tokens(screen.getByTestId('wp-renewal-mob'))).toContain('md:hidden');
    expect(tokens(screen.getByText(tfEn('wp.326')))).toContain('md:hidden');
    expect(within(banner).getByRole('link', { name: tfEn('wp.327') })).toHaveAttribute(
      'href',
      waEn('I need help renewing a work permit.'),
    );
    expect(collisionsInTree(container)).toEqual([]);
  });
});
