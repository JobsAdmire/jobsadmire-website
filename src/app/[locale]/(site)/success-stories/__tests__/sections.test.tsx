import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { testBundle } from '@/test/bundle';
import { collisionsInTree } from '@/test/class-collisions';
import { renderWithIntl } from '@/test/render';
import { ApprovalFrame } from '../_components/ApprovalFrame';
import { HeroStats } from '../_components/HeroStats';
import { LiveBadge } from '../_components/LiveBadge';
import { NumbersBox } from '../_components/NumbersBox';
import { Testimonials } from '../_components/Testimonials';
import { WorkerStories } from '../_components/WorkerStories';

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
  'success.051': '+19 gün',
  'success.052': 'Dosyalar eksik olduğunda ortalama gecikme',
  'success.053': 'Bu yüzden kotayı önce kontrol ediyoruz.',
  'success.054': 'İlk 3 ayda değiştirilenler',
  'success.055': 'Garanti süresi içinde değişim ücretsizdir.',
  'success.056': 'Reddettiğimiz iş emirleri',
  'success.057': 'Kota yok, SGK ödenmemiş.',
};
const HERO_STRINGS = {
  'success.028': 'Türk işverenlere yerleştirilen işçi',
  'success.029': "2019'dan bu yana hizmet verilen işveren",
  'success.030': 'gün',
  'success.031': 'Ortalama iş emrinden ilk vardiyaya',
  'success.032': '12 ay sonra hâlâ çalışıyor',
};
const QUOTE_STRINGS = {
  'success.058': 'Kendi sözleriyle',
  'success.059': 'Sezon bittiğinde işverenler ne diyor',
};
const QUOTE = {
  id: 't1',
  quote: '“Evrak süreci kolay ilerledi.”',
  role: 'İK Müdürü',
  org: 'Otel grubu · Kemer',
  initials: 'HK',
};

const tagIn = (el: HTMLElement) => el.querySelector('[data-sample-tag]');

describe('LiveBadge (design L452: the pulsing pill)', () => {
  it('the ICU headcount total with the pulsing dot, plus the design’s own “örnek veri” in sample mode', () => {
    const { container, rerender } = renderWithIntl(<LiveBadge count={0} />);
    expect(container).toBeEmptyDOMElement();
    rerender(<LiveBadge count={288} sampleLabel="örnek veri" />);
    const badge = screen.getByTestId('stories-live');
    expect(badge).toHaveTextContent('288 izin onaylandı · örnek veri');
    expect(badge.querySelector('.ja-live')).not.toBeNull();
    rerender(<LiveBadge count={42} />);
    expect(screen.getByTestId('stories-live')).toHaveTextContent(/^42 izin onaylandı$/);
  });
});

describe('HeroStats (design L465–482: the 2 × 2 sample stat cards)', () => {
  it('renders the four sample figures with their captions, the card entrance and the sample tag (TR)', () => {
    const { container } = renderWithIntl(
      <HeroStats bundle={testBundle({ strings: HERO_STRINGS })} locale="tr" />,
    );
    const stats = screen.getByTestId('stories-hero-stats');
    const cards = within(stats).getAllByRole('listitem');
    expect(cards).toHaveLength(4);
    expect(cards[0]).toHaveTextContent('1.240+');
    expect(cards[1]).toHaveTextContent('68');
    expect(cards[2]).toHaveTextContent('41 gün');
    expect(cards[3]).toHaveTextContent('%91'); // D18: the sign leads in Turkish
    expect(cards[3]).toHaveTextContent('12 ay sonra hâlâ çalışıyor');
    for (const c of cards) expect(c).toHaveClass('ja-card-in');
    expect(cards.map((c) => c.style.animationDelay)).toEqual(['0.08s', '0.16s', '0.24s', '0.32s']);
    expect(tagIn(stats)).not.toBeNull();
    expect(collisionsInTree(container)).toEqual([]);
  });

  it('formats the figures per locale (EN: 1,240+ and 91%)', () => {
    renderWithIntl(<HeroStats bundle={testBundle({ strings: HERO_STRINGS })} locale="en" />, {
      locale: 'en',
    });
    const cards = within(screen.getByTestId('stories-hero-stats')).getAllByRole('listitem');
    expect(cards[0]).toHaveTextContent('1,240+');
    expect(cards[3]).toHaveTextContent('91%');
  });
});

describe('ApprovalFrame (design .ja-ss-frame: slot, redaction, watermark, badges)', () => {
  it('renders the labelled ImageSlot placeholder, the bars, the decorative watermark and both badges', () => {
    const { container } = renderWithIntl(
      <div className="group/card" data-open="false">
        <ApprovalFrame
          slot="approval-a1"
          variant="grid"
          sectorLabel="Otel ve turizm"
          approvedLabel="Onaylandı"
          monthLabel="Ağustos 2025"
          redact={[{ x: 9, y: 72, w: 42, h: 6 }]}
        />
      </div>,
    );
    // never nothing: the labelled placeholder names its slot (W55)
    expect(container.querySelector('[data-placeholder="approval-a1"]')).not.toBeNull();
    const wm = screen.getByTestId('approval-watermark');
    expect(wm).toHaveAttribute('aria-hidden', 'true');
    const lines = Array.from(wm.querySelectorAll('[data-wm]')).map((l) =>
      l.getAttribute('data-wm'),
    );
    expect(lines).toHaveLength(3);
    expect(lines[0]).toBe(
      'jobsadmire.com · doğrulanmış kopya · jobsadmire.com · doğrulanmış kopya · jobsadmire.com',
    );
    expect(lines[1]).toContain('izin Ağustos 2025 · jobsadmire.com');
    // generated content only: the watermark adds no text to the page
    expect(wm).toHaveTextContent(/^$/);
    expect(container).toHaveTextContent('Otel ve turizm');
    expect(container).toHaveTextContent('Onaylandı');
    // the grid variant's badges hide on a closed phone card, show on an open one
    const badge = screen.getByText('Otel ve turizm');
    expect(badge.className.split(' ')).toEqual(
      expect.arrayContaining(['max-md:hidden', 'max-md:group-data-[open=true]/card:inline-flex']),
    );
    expect(collisionsInTree(container)).toEqual([]);
  });
});

describe('NumbersBox (design L686–720)', () => {
  it('shows the design’s four sample KPIs with the sample tag while no KPI is signed (W1)', () => {
    const { container } = renderWithIntl(
      <NumbersBox bundle={testBundle({ strings: KPI_STRINGS })} locale="tr" kpis={[]} />,
    );
    const box = screen.getByTestId('stories-numbers');
    expect(box).toHaveTextContent('Kimse insanların %100’ünü zamanında yerleştiremez');
    const cells = within(box).getAllByRole('listitem');
    expect(cells.map((c) => c.querySelector('p')?.textContent)).toEqual([
      '%7',
      '+19 gün',
      '%4',
      '11',
    ]);
    expect(cells[0]).toHaveTextContent('İlk seferde reddedilen izinler');
    expect(cells[0]).toHaveTextContent('Tümü yeniden sunuldu ve onaylandı.');
    expect(tagIn(box)).not.toBeNull();
    expect(collisionsInTree(container)).toEqual([]);
  });

  it('renders a signed KPI from the metrics collection, untagged', () => {
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
    expect(within(box).getAllByRole('listitem')).toHaveLength(1);
    expect(box).toHaveTextContent('7');
    expect(box).toHaveTextContent('İlk seferde reddedilen izinler');
    expect(tagIn(box)).toBeNull();
  });

  it('falls back to the sample when the listed KPI is unsigned (value and text null)', () => {
    const b = testBundle({
      strings: KPI_STRINGS,
      collections: {
        metrics: [
          { key: 'placed', value: null, text: null, suffix: '', labelId: null, unitId: null },
        ],
      },
    });
    renderWithIntl(
      <NumbersBox
        bundle={b}
        locale="tr"
        kpis={[{ key: 'placed', labelId: 'success.049', bodyId: 'success.050' }]}
      />,
    );
    const box = screen.getByTestId('stories-numbers');
    expect(within(box).getAllByRole('listitem')).toHaveLength(4);
    expect(tagIn(box)).not.toBeNull();
  });
});

describe('Testimonials (design L722–761)', () => {
  it('null on no rows; quote cards with the sample tag in sample mode, untagged for consented rows', () => {
    const b = testBundle({ strings: QUOTE_STRINGS });
    const { container, rerender } = renderWithIntl(
      <Testimonials bundle={b} locale="tr" items={[]} />,
    );
    expect(container).toBeEmptyDOMElement();
    rerender(
      <Testimonials
        bundle={b}
        locale="tr"
        items={[QUOTE, { ...QUOTE, id: 't2', initials: 'SC', tone: 'navy' }]}
        sample
      />,
    );
    const sec = screen.getByTestId('stories-testimonials');
    expect(
      screen.getByRole('heading', { level: 2, name: 'Sezon bittiğinde işverenler ne diyor' }),
    ).toBeInTheDocument();
    expect(sec).toHaveTextContent('“Evrak süreci kolay ilerledi.”');
    expect(sec).toHaveTextContent('Otel grubu · Kemer');
    expect(tagIn(sec)).not.toBeNull();
    // the SC tile is navy on #edf1f9, the others blue on the tint (design L742)
    expect(screen.getByText('SC')).toHaveClass('text-indigo');
    expect(screen.getByText('HK')).toHaveClass('text-blue-safe');
    // the design's "Placeholder quotes…" footnote never renders — the tag replaces it
    expect(sec).not.toHaveTextContent(/yer tutucu|placeholder/i);
    expect(collisionsInTree(container)).toEqual([]);
    rerender(<Testimonials bundle={b} locale="tr" items={[QUOTE]} />);
    expect(tagIn(screen.getByTestId('stories-testimonials'))).toBeNull();
  });
});

describe('WorkerStories (design L763–789)', () => {
  it('always shows the two cards; tagged as sample unless published and consented', () => {
    const b = testBundle({ strings: WORKER_STRINGS });
    const { container, rerender } = renderWithIntl(<WorkerStories bundle={b} locale="tr" sample />);
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
    expect(tagIn(sec)).not.toBeNull();
    expect(collisionsInTree(container)).toEqual([]);
    rerender(<WorkerStories bundle={b} locale="tr" sample={false} />);
    expect(tagIn(screen.getByTestId('stories-workers'))).toBeNull();
  });
});
