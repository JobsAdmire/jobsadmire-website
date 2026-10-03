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
import { CLIENT_LOGOS } from '../../_lib/assets';
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
  it('renders nothing while no consented logo exists (W6, §10 #11)', () => {
    const { container } = renderWithIntl(
      <ClientLogos tf={tfTr} employers="22+" logos={CLIENT_LOGOS} />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});

describe('Industries', () => {
  it('six sector rows in design order, one open at a time, each CTA a #request-form anchor', async () => {
    const { container } = renderWithIntl(<Industries bundle={TR} tf={tfTr} />);
    expect(container.querySelector('section#industries')).not.toBeNull();
    const region = screen.getByTestId('hire-industries');
    const names = [
      '01 · Fabrika / Üretim',
      '02 · İnşaat',
      '03 · Turizm / Konaklama',
      '04 · Tarım',
      '05 · Tekstil',
      '06 · Lojistik / Depo',
    ];
    for (const name of names)
      expect(within(region).getByRole('button', { name })).toHaveAttribute(
        'aria-expanded',
        'false',
      );
    await userEvent.click(within(region).getByRole('button', { name: '05 · Tekstil' }));
    expect(within(region).getByRole('button', { name: '05 · Tekstil' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    expect(within(region).getByRole('link', { name: tfTr('hire.134') })).toHaveAttribute(
      'href',
      '#request-form',
    );
    await userEvent.click(within(region).getByRole('button', { name: '01 · Fabrika / Üretim' }));
    expect(within(region).getByRole('button', { name: '05 · Tekstil' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    // every one of the 41 role chips is server-rendered (closed panels are `hidden`, still in the DOM)
    for (const row of INDUSTRIES)
      for (const id of [...row.visibleRoleIds, ...row.moreRoleIds])
        expect(region.textContent).toContain(tfTr(id));
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
    const phone = region.querySelector('[data-placeholder="portal-mobile-app"]')!;
    expect(phone.closest('[class~="max-md:hidden"]')).not.toBeNull(); // ≤ 700 px: no phone mock
    expect(within(region).getByRole('link', { name: tfTr('hire.193') })).toHaveAttribute(
      'href',
      `${WA}?text=${encodeURIComponent(tfTr('hire.251'))}`,
    );
    expect(within(region).getByRole('link', { name: /Google Play/ })).toBeInTheDocument();
    expect(within(region).queryByRole('link', { name: /App Store/ })).toBeNull(); // W8
    expect(region.textContent).not.toMatch(/✓/);
  });
});

describe('Faq', () => {
  it('seven single-open pairs (first open), the WhatsApp + call ask card, one FAQPage node, #faq on the section', () => {
    const { container } = renderWithIntl(<Faq bundle={TR} locale="tr" tf={tfTr} />);
    expect(container.querySelector('section#faq')).not.toBeNull();
    const region = screen.getByTestId('hire-faq');
    const triggers = within(region).getAllByRole('button');
    expect(triggers).toHaveLength(7);
    expect(triggers[0]).toHaveAttribute('aria-expanded', 'true');
    expect(within(region).getByRole('link', { name: tfTr('hire.041') })).toHaveAttribute(
      'href',
      `${WA}?text=${encodeURIComponent(tfTr('hire.252'))}`,
    );
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
