import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { testBundle } from '@/test/bundle';
import { renderWithIntl } from '@/test/render';
import { LiveBadge } from '../_components/LiveBadge';
import { NumbersBox } from '../_components/NumbersBox';
import { Testimonials } from '../_components/Testimonials';
import { WorkerStories } from '../_components/WorkerStories';
import type { Story } from '../_lib/stories';

const STORY: Story = {
  id: 'AP-2026-118',
  sector: 'tourism',
  roles: 'Kat görevlileri',
  headcount: 12,
  approvedAt: '2026-06-01',
  place: 'Antalya',
  countries: ['KG'],
};

const WORKER_STRINGS = {
  'success.070': 'Diğer taraf',
  'success.071': 'İşçi oraya gitmek için hiçbir şey ödemedi',
  'success.072': 'Bir yerleştirme, ancak iki taraf için de işe yaradıysa başarılıdır.',
  'success.073': 'Şimdi kimlerin müsait olduğunu görün →',
  'success.074': 'Partner bir enstitüde meslek sınavına girdi.',
  'success.075': '0 ödedi · 22 aydır işte',
  'success.076': 'Kat görevlisi · Nepal → Antalya',
  'success.077': 'Bizi bulmadan önce yerel bir aracı ondan “vize ücreti” istedi.',
  'success.078': '0 ödedi · aynı otelde ikinci sezon',
};
const KPI_STRINGS = {
  'success.046': 'Sakladığımız sayılar değil',
  'success.047': 'Kimse insanların %100’ünü zamanında yerleştiremez',
  'success.048': 'Bunlar bizimkiler.',
  'success.049': 'İlk seferde reddedilen izinler',
  'success.050': 'Tümü yeniden sunuldu ve onaylandı.',
};
const QUOTE_STRINGS = {
  'success.058': 'Kendi sözleriyle',
  'success.059': 'Sezon bittiğinde işverenler ne diyor',
};

describe('data-gated sections render nothing on empty/unsigned/unconsented data (W1, W6, §10 row 11)', () => {
  it('LiveBadge: null without stories, the ICU headcount total with them', () => {
    const { container, rerender } = renderWithIntl(<LiveBadge stories={[]} />);
    expect(container).toBeEmptyDOMElement();
    rerender(<LiveBadge stories={[STORY, { ...STORY, id: 'b', headcount: 30 }]} />);
    expect(screen.getByTestId('stories-live')).toHaveTextContent('42 izin onaylandı');
  });

  it('NumbersBox: null with no listed KPI, the box with a signed one', () => {
    const { container } = renderWithIntl(
      <NumbersBox bundle={testBundle()} locale="tr" kpis={[]} />,
    );
    expect(container).toBeEmptyDOMElement();

    // `placed` stands in for a future negative-KPI key: the test exercises the rendering path.
    const signed = testBundle({
      strings: KPI_STRINGS,
      collections: {
        metrics: [
          { key: 'placed', value: 7, text: null, suffix: '', labelId: 'success.049', unitId: null },
        ],
      },
    });
    renderWithIntl(
      <NumbersBox
        bundle={signed}
        locale="tr"
        kpis={[{ key: 'placed', labelId: 'success.049', bodyId: 'success.050' }]}
      />,
    );
    const box = screen.getByTestId('stories-numbers');
    expect(box).toHaveTextContent('Kimse insanların %100’ünü zamanında yerleştiremez');
    expect(box).toHaveTextContent('7');
    expect(box).toHaveTextContent('İlk seferde reddedilen izinler');
    expect(box).toHaveTextContent('Tümü yeniden sunuldu ve onaylandı.');
  });

  it('NumbersBox: a listed KPI whose metric is unsigned (value and text null) is skipped', () => {
    const b = testBundle({
      strings: KPI_STRINGS,
      collections: {
        metrics: [
          { key: 'placed', value: null, text: null, suffix: '', labelId: null, unitId: null },
        ],
      },
    });
    const { container } = renderWithIntl(
      <NumbersBox
        bundle={b}
        locale="tr"
        kpis={[{ key: 'placed', labelId: 'success.049', bodyId: 'success.050' }]}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('Testimonials: null on no rows, quote cards with rows — never the placeholder disclaimer', () => {
    const b = testBundle({ strings: QUOTE_STRINGS });
    const { container, rerender } = renderWithIntl(
      <Testimonials bundle={b} locale="tr" items={[]} />,
    );
    expect(container).toBeEmptyDOMElement();
    rerender(
      <Testimonials
        bundle={b}
        locale="tr"
        items={[
          {
            id: 't1',
            quote: '“Evrak süreci kolay ilerledi.”',
            role: 'İK Müdürü',
            org: 'Otel grubu · Kemer',
            initials: 'HK',
          },
        ]}
      />,
    );
    const sec = screen.getByTestId('stories-testimonials');
    expect(
      screen.getByRole('heading', { level: 2, name: 'Sezon bittiğinde işverenler ne diyor' }),
    ).toBeInTheDocument();
    expect(sec).toHaveTextContent('“Evrak süreci kolay ilerledi.”');
    expect(sec).toHaveTextContent('HK');
    expect(sec).toHaveTextContent('Otel grubu · Kemer');
    expect(sec).not.toHaveTextContent(/yer tutucu|placeholder/i);
  });

  it('WorkerStories: null while not visible (published but unconsented, or unpublished), the two cards when visible', () => {
    const b = testBundle({ strings: WORKER_STRINGS });
    const { container, rerender } = renderWithIntl(
      <WorkerStories bundle={b} locale="tr" visible={false} />,
    );
    expect(container).toBeEmptyDOMElement();
    rerender(<WorkerStories bundle={b} locale="tr" visible />);
    const sec = screen.getByTestId('stories-workers');
    expect(
      screen.getByRole('heading', { level: 2, name: WORKER_STRINGS['success.071'] }),
    ).toBeInTheDocument();
    expect(sec).toHaveTextContent('Kaynakçı · Özbekistan → Ankara'); // sys.stories.workers.card1Title
    expect(sec).toHaveTextContent('Kat görevlisi · Nepal → Antalya'); // success.076
    expect(screen.getByRole('link', { name: WORKER_STRINGS['success.073'] })).toHaveAttribute(
      'href',
      '/adaylar',
    );
  });
});
