import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { BundleSchema, type Bundle } from '../../../../../../../contract/website-bundle.v1';
import { makeTf, metricValues } from '@/content/pure';
import en from '@/messages/en.json';
import tr from '@/messages/tr.json';
import { renderWithIntl } from '@/test/render';
import { CLIENT_LOGOS, CLIENT_LOGO_SLOT_COUNT } from '../../_lib/assets';
import { INDUSTRIES } from '../../_lib/tables';
import { ClientLogos } from '../ClientLogos';
import { Comparison } from '../Comparison';
import { Faq } from '../Faq';
import { Industries } from '../Industries';
import { JumpNav } from '../JumpNav';
import { PortalPreview } from '../PortalPreview';
import { Process } from '../Process';
import { SourceCountries } from '../SourceCountries';

// The real LOCAL bundles read from disk (the sanctioned test bypass: D23 governs how the running
// site loads a bundle, never a test fixture read) — the sections render the package's own copy.
const load = (locale: 'tr' | 'en'): Bundle =>
  BundleSchema.parse(
    JSON.parse(
      readFileSync(join(process.cwd(), 'src', 'content', 'local', `bundle.${locale}.json`), 'utf8'),
    ),
  );
const TR = load('tr');
const EN = load('en');
const tfTr = makeTf(TR, 'tr');
const tfEn = makeTf(EN, 'en');
const WA = 'https://wa.me/905011240340';
const tokens = (el: Element) => (el.getAttribute('class') ?? '').split(/\s+/);
const scSys = (m: typeof tr) => ({
  titleTail: m.sys.hire.sc.titleTail,
  mapTitle: m.sys.hire.sc.mapTitle,
  pause: m.sys.marquee.pause,
  play: m.sys.marquee.play,
});

describe('JumpNav', () => {
  it('is a labelled ≤ 700 px nav of the five designed anchors (W10: CSS, not conditional)', () => {
    renderWithIntl(<JumpNav tf={tfTr} label={tr.sys.hire.jump.label} />);
    const nav = screen.getByRole('navigation', { name: tr.sys.hire.jump.label });
    expect(tokens(nav)).toContain('md:hidden');
    expect(
      within(nav)
        .getAllByRole('link')
        .map((a) => a.getAttribute('href')),
    ).toEqual(['#industries', '#compare', '#process', '#faq', '#request-form']);
  });
});

describe('ClientLogos', () => {
  const slots = Array.from(
    { length: CLIENT_LOGO_SLOT_COUNT },
    (_, i) => `${tfTr('hire.245')} ${i + 1}`,
  );

  it('until consented logos exist: the "22+" figure, hire.073, the sample tag and the ten labelled slots (owner 2026-10-05, design ll. 694–711)', () => {
    renderWithIntl(
      <ClientLogos tf={tfTr} employers="22+" logos={CLIENT_LOGOS} slotLabels={slots} />,
    );
    const band = screen.getByTestId('hire-logos');
    expect(tokens(band)).toContain('max-md:hidden'); // the design's `.ja-hw-logos` ≤ 700 rule
    expect(band).toHaveAttribute('data-sample', 'true');
    expect(within(band).getByText('22+')).toBeInTheDocument();
    expect(within(band).getByText(tfTr('hire.073'))).toBeInTheDocument();
    expect(band.querySelectorAll('[data-sample-tag]')).toHaveLength(1);
    expect(band.querySelector('[data-sample-tag]')?.textContent).toContain(tr.sys.sample.tag);
    // the first copy of the marquee is the visible one; the second is the inert loop filler
    const visible = Array.from(band.querySelectorAll('[data-placeholder^="logo-"]')).filter(
      (el) => !el.closest('[aria-hidden="true"]'),
    );
    expect(visible.map((el) => el.textContent)).toEqual([
      'Müşteri logosu 1',
      'Müşteri logosu 2',
      'Müşteri logosu 3',
      'Müşteri logosu 4',
      'Müşteri logosu 5',
      'Müşteri logosu 6',
      'Müşteri logosu 7',
      'Müşteri logosu 8',
      'Müşteri logosu 9',
      'Müşteri logosu 10',
    ]);
  });

  it('an unsigned employers metric drops the figure, never the band (W1)', () => {
    renderWithIntl(<ClientLogos tf={tfTr} employers="" logos={CLIENT_LOGOS} slotLabels={slots} />);
    const band = screen.getByTestId('hire-logos');
    expect(band.textContent).not.toContain(tfTr('hire.073'));
    expect(band.querySelectorAll('[data-sample-tag]')).toHaveLength(1);
  });

  it('renders nothing with neither logos nor slots', () => {
    const { container } = renderWithIntl(
      <ClientLogos tf={tfTr} employers="22+" logos={CLIENT_LOGOS} slotLabels={[]} />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});

describe('Industries', () => {
  const names = [
    'Fabrika / Üretim',
    'İnşaat',
    'Turizm / Konaklama',
    'Tarım',
    'Tekstil',
    'Lojistik / Depo',
  ];

  it('six sector rows in design order, one open at a time, each CTA a #request-form anchor', async () => {
    const { container } = renderWithIntl(<Industries bundle={TR} tf={tfTr} />);
    expect(container.querySelector('section#industries')).not.toBeNull();
    const region = screen.getByTestId('hire-industries');
    // the h3 is the toggle: one real button per row, named by the sector title
    expect(
      within(region)
        .getAllByRole('heading', { level: 3 })
        .map((h) => h.textContent),
    ).toEqual(names);
    for (const name of names)
      expect(within(region).getByRole('button', { name })).toHaveAttribute(
        'aria-expanded',
        'false',
      );
    await userEvent.click(within(region).getByRole('button', { name: 'Tekstil' }));
    expect(within(region).getByRole('button', { name: 'Tekstil' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    const panel = region.querySelector<HTMLElement>(
      `#${CSS.escape(within(region).getByRole('button', { name: 'Tekstil' }).getAttribute('aria-controls')!)}`,
    )!;
    expect(panel).not.toHaveAttribute('hidden');
    expect(within(panel).getByRole('link', { name: tfTr('hire.134') })).toHaveAttribute(
      'href',
      '#request-form',
    );
    await userEvent.click(within(region).getByRole('button', { name: 'Fabrika / Üretim' }));
    expect(within(region).getByRole('button', { name: 'Tekstil' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    expect(panel).toHaveAttribute('hidden');
    // every one of the 41 role chips is server-rendered (closed panels are `hidden`, still in the DOM)
    for (const row of INDUSTRIES)
      for (const id of [...row.visibleRoleIds, ...row.moreRoleIds])
        expect(region.textContent).toContain(tfTr(id));
  });

  it('S7.1: at rest each row shows its number tile, subtitle and row chips — only the "more roles" sit in the hidden panel', () => {
    renderWithIntl(<Industries bundle={TR} tf={tfTr} />);
    const region = screen.getByTestId('hire-industries');
    const rows = region.querySelectorAll(':scope li.ja-row');
    expect(rows).toHaveLength(6);
    rows.forEach((row, i) => {
      const tile = row.querySelector('.ja-num')!;
      expect(tile.textContent).toBe(String(i + 1).padStart(2, '0'));
      expect(tile).toHaveAttribute('aria-hidden', 'true');
      for (const id of INDUSTRIES[i].visibleRoleIds) {
        const chip = within(row as HTMLElement).getByText(tfTr(id));
        expect(chip.closest('[hidden]')).toBeNull();
      }
      for (const id of INDUSTRIES[i].moreRoleIds) {
        const chip = within(row as HTMLElement).getByText(tfTr(id));
        expect(chip.closest('[hidden]')).not.toBeNull();
      }
    });
    // row 1's subtitle carries the design's green dot; every sector subtitle is at rest
    expect(rows[0].querySelector('h3 + p span[aria-hidden="true"]')).not.toBeNull();
  });

  it('S7.4: each row’s round → prefills the form like the panel CTA, named by the CTA words (no arrow glyph)', () => {
    renderWithIntl(<Industries bundle={TR} tf={tfTr} />);
    const region = screen.getByTestId('hire-industries');
    const arrows = region.querySelectorAll('a.ja-arrow');
    expect(arrows).toHaveLength(6);
    expect(arrows[0]).toHaveAttribute('href', '#request-form');
    expect(arrows[0]).toHaveAttribute('aria-label', tfTr('hire.130').replace(/\s*→\s*$/, ''));
    expect(arrows[0].querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    expect(tokens(arrows[0])).toContain('max-md:hidden'); // ≤ 700 px the design hides it
  });
});

describe('SourceCountries', () => {
  it('TR: the metric heading, the map with 13 sources + Türkiye, sprite flags, the static list and the ≤ 700 px marquee', () => {
    renderWithIntl(
      <SourceCountries
        bundle={TR}
        tf={tfTr}
        countries={metricValues(TR, 'tr').countries}
        sys={scSys(tr)}
      />,
    );
    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe(
      '13+ ülkeden belgeli işçiler',
    );
    expect(screen.getByRole('img', { name: tr.sys.hire.sc.mapTitle })).toBeInTheDocument();
    const map = screen.getByTestId('hire-map');
    expect(map.querySelectorAll('g[data-country]')).toHaveLength(14);
    expect(map.querySelector('g[data-country="TR"] > title')?.textContent).toBe('Türkiye');
    expect(map.querySelector('g[data-country="LK"] > title')?.textContent).toBe('Sri Lanka');
    const flags = screen.getByTestId('hire-flags');
    const list = flags.querySelector('ul')!;
    expect(list.querySelectorAll('li')).toHaveLength(13);
    expect(tokens(list)).toContain('max-md:hidden');
    expect(flags.querySelector('use[href="/brand/flags.svg#flag-PK"]')).not.toBeNull();
    expect(within(flags).getByRole('button', { name: tr.sys.marquee.pause })).toBeInTheDocument();
  });

  it('EN: "Vetted talent from 13+ countries" — the Turkish-only tail is empty', () => {
    renderWithIntl(
      <SourceCountries
        bundle={EN}
        tf={tfEn}
        countries={metricValues(EN, 'en').countries}
        sys={scSys(en)}
      />,
      { locale: 'en' },
    );
    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe(
      'Vetted talent from 13+ countries',
    );
  });
});

describe('Comparison', () => {
  it('two cards of five rows; the ✓/× marks are SVG, never text (axe color-contrast, D20)', () => {
    const { container } = renderWithIntl(<Comparison tf={tfTr} />);
    expect(container.querySelector('section#compare')).not.toBeNull();
    const region = screen.getByTestId('hire-compare');
    expect(
      within(region)
        .getAllByRole('heading', { level: 3 })
        .map((h) => h.textContent),
    ).toEqual([tfTr('hire.148'), tfTr('hire.149')]);
    expect(within(region).getAllByRole('listitem')).toHaveLength(10);
    expect(region.textContent).not.toMatch(/[✓×]/);
  });
});

describe('Process', () => {
  it('six numbered steps, the composed heading and the locale-aware cross-links', () => {
    const { container } = renderWithIntl(<Process bundle={TR} locale="tr" tf={tfTr} />);
    expect(container.querySelector('section#process')).not.toBeNull();
    const region = screen.getByTestId('hire-process');
    expect(within(region).getByRole('heading', { level: 2 }).textContent).toBe(
      `${tfTr('hire.170')} ${tfTr('hire.171')}`,
    );
    expect(within(region).getAllByRole('heading', { level: 3 })).toHaveLength(6);
    // SHARED 8.2: the design's numbered timeline (46 px gradient dots, white r18 cards)
    expect(region.querySelector('ol[data-variant="numbered"]')).not.toBeNull();
    // the total-duration pill carries its clock
    expect(screen.getByText(tfTr('hire.173')).querySelector('svg')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
    expect(within(region).getByRole('link', { name: tfTr('hire.175') })).toHaveAttribute(
      'href',
      '/calisma-izni',
    );
    expect(within(region).getByRole('link', { name: tfTr('hire.178') })).toHaveAttribute(
      'href',
      '/maliyet-hesaplayici',
    );
  });
});

describe('PortalPreview', () => {
  it('shows at every width (the design hides nothing at ≤ 460 px), with the host, named slots, the demo CTA and Android-only badges', () => {
    renderWithIntl(<PortalPreview bundle={TR} locale="tr" tf={tfTr} />);
    const region = screen.getByTestId('hire-portal');
    expect(region.closest('[class*="hidden"]')).toBeNull();
    expect(region.textContent).toContain('portal.jobsadmire.com');
    expect(region.querySelector('[data-placeholder="portal-shortlist"]')).not.toBeNull();
    // S11.1: each placeholder wears the design's own caption (hire.243 / hire.244)
    expect(region.textContent).toContain(tfTr('hire.243'));
    expect(region.textContent).toContain(tfTr('hire.244'));
    const phone = region.querySelector('[data-placeholder="portal-mobile-app"]')!;
    expect(phone.closest('[class~="max-md:hidden"]')).not.toBeNull(); // ≤ 700 px: no phone mock
    const demo = within(region).getByRole('link', { name: tfTr('hire.193') });
    expect(demo).toHaveAttribute('href', `${WA}?text=${encodeURIComponent(tfTr('hire.251'))}`);
    expect(tokens(demo)).toEqual(expect.arrayContaining(['rounded-[11px]', 'max-md:w-full']));
    expect(within(region).getByRole('link', { name: /Google Play/ })).toBeInTheDocument();
    expect(within(region).getByRole('link', { name: /App Store/ })).toBeInTheDocument(); // W227
    expect(region.textContent).not.toMatch(/✓/);
  });
});

describe('Faq', () => {
  it('seven single-open pairs (first open), the WhatsApp + call ask card, one FAQPage node, #faq on the section', () => {
    const { container } = renderWithIntl(<Faq bundle={TR} locale="tr" tf={tfTr} />);
    expect(container.querySelector('section#faq')).not.toBeNull();
    const region = screen.getByTestId('hire-faq');
    expect(region.querySelector('[data-variant="cards"]')).not.toBeNull(); // S12.1
    const triggers = within(region).getAllByRole('button');
    expect(triggers).toHaveLength(7);
    expect(triggers[0]).toHaveAttribute('aria-expanded', 'true');
    // the ask card's WhatsApp (lg+) and the ≤ 900 px full-width copy after the list (M10)
    const wa = within(region).getAllByRole('link', { name: tfTr('hire.041') });
    expect(wa).toHaveLength(2);
    for (const a of wa)
      expect(a).toHaveAttribute('href', `${WA}?text=${encodeURIComponent(tfTr('hire.252'))}`);
    expect(tokens(wa[1])).toEqual(expect.arrayContaining(['w-full', 'lg:hidden']));
    expect(within(region).getByRole('link', { name: tfTr('hire.032') })).toHaveAttribute(
      'href',
      'tel:+905011240340',
    );
    const nodes = Array.from(
      container.querySelectorAll('script[type="application/ld+json"]'),
      (s) => JSON.parse(s.textContent ?? '{}') as { '@type'?: string; mainEntity?: unknown[] },
    );
    const faqNodes = nodes.filter((n) => n['@type'] === 'FAQPage');
    expect(faqNodes).toHaveLength(1);
    expect(faqNodes[0].mainEntity).toHaveLength(7);
  });
});

describe('pixel run 1 (d) items (Cycle 8(a), W187)', () => {
  /** The design's h2 style on this page: clamp(28px, 3.2vw, 42px), letter-spacing -1.6px
   *  (× 0.75 from 1101 px, D19), line-height 1.05 — `text-h2` alone inherits body leading 1.55. */
  const DESIGN_H2 = ['text-h2', 'leading-[1.05]', 'tracking-[-1.6px]', 'xl:tracking-[-1.2px]'];

  it('every page-owned section h2 carries the design tracking and leading; process uses the same size as the others', () => {
    const sections = [
      <Industries key="i" bundle={TR} tf={tfTr} />,
      <SourceCountries
        key="s"
        bundle={TR}
        tf={tfTr}
        countries={metricValues(TR, 'tr').countries}
        sys={scSys(tr)}
      />,
      <Comparison key="c" tf={tfTr} />,
      <Process key="p" bundle={TR} locale="tr" tf={tfTr} />,
      <PortalPreview key="pp" bundle={TR} locale="tr" tf={tfTr} />,
    ];
    for (const el of sections) {
      const { container, unmount } = renderWithIntl(el);
      const h2s = container.querySelectorAll('h2');
      expect(h2s).toHaveLength(1);
      expect(tokens(h2s[0])).toEqual(expect.arrayContaining(DESIGN_H2));
      expect(tokens(h2s[0])).not.toContain('text-h2-process');
      unmount();
    }
  });

  // Final pass A7 (W189 A7, W190 A1b, W210 a): the design's global ≤ 600 px rule (`h2 { 25px;
  // -0.4px }`) lands as `max-[601px]:` twins on the three centred section h2s whose own ≤ 700
  // size the page never set; the portal/request/source h2s keep their class-specific ≤ 700 sizes
  // (24/25 px), which in the design beat the global rule by specificity.
  it('industries, compare and process h2s carry the design ≤ 600 px rule as max-[601px] twins (A7)', () => {
    const SIX_HUNDRED = ['max-[601px]:text-[25px]', 'max-[601px]:tracking-[-0.4px]'];
    const centred = [
      <Industries key="i" bundle={TR} tf={tfTr} />,
      <Comparison key="c" tf={tfTr} />,
      <Process key="p" bundle={TR} locale="tr" tf={tfTr} />,
    ];
    for (const el of centred) {
      const { container, unmount } = renderWithIntl(el);
      const h2 = container.querySelector('h2')!;
      expect(tokens(h2)).toEqual(expect.arrayContaining([...DESIGN_H2, ...SIX_HUNDRED]));
      expect(h2.className).not.toMatch(/max-sm:/);
      unmount();
    }
    const { container } = renderWithIntl(<PortalPreview bundle={TR} locale="tr" tf={tfTr} />);
    expect(tokens(container.querySelector('h2')!)).not.toEqual(expect.arrayContaining(SIX_HUNDRED));
  });

  it('portal ≤ 700 px: the design .ja-pd-copy sizes (h2 24 px, sub 14.5 px, checks 14 px, card text 12.5 px, proof 13 px)', () => {
    renderWithIntl(<PortalPreview bundle={TR} locale="tr" tf={tfTr} />);
    const region = screen.getByTestId('hire-portal');
    expect(tokens(region.querySelector('h2')!)).toEqual(
      expect.arrayContaining([
        'max-md:text-[24px]',
        'max-md:leading-[1.14]',
        'max-md:tracking-[-0.5px]',
      ]),
    );
    expect(tokens(screen.getByText(tfTr('hire.184')))).toContain('max-md:text-[14.5px]');
    expect(tokens(screen.getByText(tfTr('hire.185')).closest('li')!)).toContain(
      'max-md:text-[14px]',
    );
    expect(tokens(screen.getByText(tfTr('hire.188')))).toContain('max-md:text-[12.5px]');
    expect(tokens(screen.getByText(tfTr('hire.191')).closest('p')!)).toContain(
      'max-md:text-[13px]',
    );
  });

  it('portal feature cards carry their design icons (star, phone) as decorative SVG', () => {
    renderWithIntl(<PortalPreview bundle={TR} locale="tr" tf={tfTr} />);
    for (const id of ['hire.187', 'hire.189']) {
      const row = screen.getByText(tfTr(id)).parentElement!;
      const svg = row.querySelector('svg');
      expect(svg).not.toBeNull();
      expect(svg).toHaveAttribute('aria-hidden', 'true');
    }
  });
});
