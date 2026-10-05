import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createTranslator, type Messages } from 'next-intl';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { COPY_DELTAS } from '@/lib/calculator/copy-deltas';
import { formatTRY } from '@/lib/format/money';
import en from '@/messages/en.json';
import tr from '@/messages/tr.json';
import { renderWithIntl } from '@/test/render';
import { BundleSchema, type Bundle } from '../../../../../../../contract/website-bundle.v1';
import { CalcSection } from '../CalcSection';
import { ClosingBand } from '../ClosingBand';
import {
  Basis,
  Compare,
  Faq,
  Incentives,
  JumpChips,
  PassCheck,
  Penalties,
  Quota,
  Salaries,
  Students,
} from '../content';
import { buildCalcCtx, type CalcCtx } from '../context';
import { CalculatorCard, Hero } from '../Hero';

// `context.ts` is `server-only` (an empty module under Vitest): its loader reads the request
// through next-intl and the adapter, stubbed here — only the pure `buildCalcCtx` runs.
vi.mock('next-intl/server', () => ({ getTranslations: vi.fn() }));
vi.mock('@/content/adapter', async () => ({
  ...(await import('@/content/pure')),
  getBundle: vi.fn(),
}));
vi.mock('next/navigation', async (importOriginal) => ({
  ...(await importOriginal<typeof import('next/navigation')>()),
  usePathname: () => '/maliyet-hesaplayici',
}));

// R56: the generated bundles are read from disk, never imported.
const load = (locale: 'tr' | 'en'): Bundle =>
  BundleSchema.parse(
    JSON.parse(
      readFileSync(join(process.cwd(), 'src', 'content', 'local', `bundle.${locale}.json`), 'utf8'),
    ),
  );
const MESSAGES = { tr: tr as Messages, en: en as Messages };
const ctxFor = (locale: 'tr' | 'en'): CalcCtx =>
  buildCalcCtx(
    load(locale),
    locale,
    createTranslator({ locale, messages: MESSAGES[locale], namespace: 'sys' }),
  );
const TR = ctxFor('tr');
const EN = ctxFor('en');
const NO_ROLES: CalcCtx = { ...TR, roles: [], defaultView: null };
const WA = `https://wa.me/${TR.settings.whatsappNumber}`;
const tokens = (el: Element) => (el.getAttribute('class') ?? '').split(/\s+/);
/** W231 review: an anchor jump clears the sticky chrome at its three heights — the homepage
 *  `#proposal` and Partner `#tracks` bands; `scroll-mt-5` landed it under the header. */
const ANCHOR_BANDS = ['scroll-mt-[90px]', 'lg:scroll-mt-[125px]', 'min-[1200px]:scroll-mt-[90px]'];
/** A COPY_DELTAS model figure (W142/W143) — the page's numbers are pinned to it. */
const model = (id: string) => {
  const row = COPY_DELTAS.find((r) => r.id === id);
  if (!row) throw new Error(`COPY_DELTAS has no row "${id}"`);
  return row.model;
};
const jsonLd = (root: HTMLElement) =>
  [...root.querySelectorAll('script[type="application/ld+json"]')].map(
    (s) => JSON.parse(s.textContent ?? '{}') as Record<string, unknown>,
  );
const ids = (list: string[]) => list.map((id) => TR.t(id));

afterEach(() => {
  vi.useRealTimers();
});

describe('buildCalcCtx — the page’s one server read', () => {
  it('resolves the 12 design roles, the default view at the COPY_DELTAS model and locale-sorted countries', () => {
    expect(TR.roles).toHaveLength(12);
    expect(TR.roles.some((r) => r.preset)).toBe(false); // W24: the teaser presets never appear
    expect(TR.defaultView?.f.monthly.total).toBe(
      formatTRY(model('Hiring Cost Calculator.dc.html:2598 (mTotal, initial render)'), 'tr'),
    );
    expect(EN.defaultView?.f.contract.total).toBe(
      formatTRY(model('Hiring Cost Calculator.dc.html:2603 (yearTotal, initial render)'), 'en'),
    );
    const names = TR.countries.map((c) => c.label);
    expect(names).toEqual([...names].sort(new Intl.Collator('tr-TR').compare));
    expect(TR.countries.every((c) => /^[A-Z]{2}$/.test(c.value))).toBe(true);
  });

  it('fills the metric placeholders through makeTf (W1) and hands islands only the labels they need', () => {
    expect(TR.labels.sheet.intro).not.toMatch(/\{|calc\.\d{3}/); // calc.050 carries {homepageReplyHours}
    expect(TR.labels.recap.zFee).not.toMatch(/\{/); // calc.104
    expect(TR.labels.cardView).toEqual({
      perWorker: TR.t('calc.463'),
      fullYear: TR.t('calc.470'),
      firstYear: TR.t('calc.469'),
      perMonthSuffix: TR.t('calc.464'),
    });
  });
});

describe('Hero + CalculatorCard', () => {
  it('one h1 = the LCP slot, the calc-hero photo decorative (never the LCP, W233), W109 breadcrumbs, one BreadcrumbList', () => {
    const { container } = renderWithIntl(
      <Hero ctx={TR}>
        <CalculatorCard ctx={TR} />
      </Hero>,
    );
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toHaveAttribute('data-testid', 'page-h1');
    expect(h1).toHaveAttribute('data-lcp-slot', 'h1');
    expect(h1.textContent).toBe("Türkiye'de yabancı bir işçi gerçekte ne kadara mal olur?");
    expect(container.querySelectorAll('[data-lcp-slot]')).toHaveLength(1);
    expect(container.querySelector('[data-placeholder="calc-hero"]')).toBeNull();
    const photo = container.querySelector(
      `img[src*="${encodeURIComponent('/hero/hiring-cost-calculator.jpg')}"]`,
    );
    expect(photo).not.toBeNull();
    expect(photo).toHaveAttribute('alt', '');
    expect(photo).not.toHaveAttribute('data-lcp-slot');
    expect(photo!.closest('[aria-hidden="true"]')).not.toBeNull();
    // `priority` → next/image's `preload`: the photo is requested from the <head>
    expect(
      document.head.querySelector(
        `link[rel="preload"][as="image"][imagesrcset*="${encodeURIComponent('/hero/hiring-cost-calculator.jpg')}"]`,
      ),
    ).not.toBeNull();
    const nav = screen.getByRole('navigation', { name: tr.sys.nav.breadcrumbs });
    expect(within(nav).getByRole('link', { name: TR.t('calc.001') })).toHaveAttribute('href', '/');
    expect(within(nav).getByText(TR.t('calc.002'))).toHaveAttribute('aria-current', 'page');
    expect(jsonLd(container).filter((n) => n['@type'] === 'BreadcrumbList')).toHaveLength(1);
  });

  // W233 (QA W220 contact-01's fix): the width-driven 16:9 box ended 180–810 px down a hero of up
  // to 2,004 px, a hard edge under the h1 once a photo filled it. Cover mode at a fixed height per
  // band, ≥ 10 % above the tallest hero measured (card included), never sized from the text (W187).
  it('runs the calc-hero photo in cover mode over the whole hero (W233)', () => {
    const { container } = renderWithIntl(<Hero ctx={TR}>{null}</Hero>);
    const slot = container.querySelector<HTMLElement>(
      `img[src*="${encodeURIComponent('/hero/hiring-cost-calculator.jpg')}"]`,
    )!;
    expect(slot.parentElement).toHaveClass('absolute', 'inset-0', 'overflow-hidden');
    expect(slot).toHaveClass('w-full', 'object-cover', 'h-(--cover-h)', 'xl:h-(--cover-h-xl)');
    expect(slot).not.toHaveClass('h-auto');
    expect(slot.style.aspectRatio).toBe('');
    expect(slot.style.getPropertyValue('--cover-h')).toBe('1750px');
    expect(slot.style.getPropertyValue('--cover-h-sm')).toBe('1750px');
    expect(slot.style.getPropertyValue('--cover-h-md')).toBe('2250px');
    expect(slot.style.getPropertyValue('--cover-h-lg')).toBe('1700px');
    expect(slot.style.getPropertyValue('--cover-h-xl')).toBe('1200px');
  });

  // Final pass A7 (W189 A7, W190 A1b, W210 a): the design's global `@media (max-width: 600px)
  // { h1 { font-size: 32px; letter-spacing: -0.6px } }` — no repo breakpoint, so `max-[601px]:`
  // (never `max-sm:`); the ≤ 700 tracking/leading twins stay beside it (different variants).
  it('the hero h1 carries the design ≤ 600 px rule as max-[601px] twins (A7)', () => {
    renderWithIntl(<Hero ctx={TR}>{null}</Hero>);
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1.className.split(/\s+/)).toEqual(
      expect.arrayContaining(['max-[601px]:text-[32px]', 'max-[601px]:tracking-[-0.6px]']),
    );
    expect(h1.className).not.toMatch(/max-sm:/);
  });

  it('shows the D17 badge from rateConfig until reviewDueAt, then hides it (W150)', () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-09-28T12:00:00Z'));
    const first = renderWithIntl(<Hero ctx={TR}>{null}</Hero>);
    expect(screen.getByTestId('calc-badge')).toHaveTextContent(
      '2026 oranları · Ocak 2026 güncellemesi',
    );
    first.unmount();
    vi.setSystemTime(new Date(`${TR.rateConfig.reviewDueAt}T00:00:00Z`));
    renderWithIntl(<Hero ctx={TR}>{null}</Hero>);
    expect(screen.queryByTestId('calc-badge')).toBeNull();
  });

  it('EN: the badge reads exactly calc.003 at the seeded rates', () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-09-28T12:00:00Z'));
    renderWithIntl(<Hero ctx={EN}>{null}</Hero>, { locale: 'en' });
    expect(screen.getByTestId('calc-badge')).toHaveTextContent(EN.t('calc.003'));
  });

  it('the card carries #calculator + print-isolate and paints the skeleton at the model defaults (W13 amended/W152)', () => {
    const { container } = renderWithIntl(<CalculatorCard ctx={TR} />);
    const card = container.querySelector('#calculator');
    expect(card).not.toBeNull();
    expect(tokens(card!)).toContain('print-isolate');
    expect(tokens(card!)).toEqual(expect.arrayContaining(ANCHOR_BANDS));
    expect(tokens(card!)).not.toContain('scroll-mt-5');
    expect(screen.getByTestId('calc-card')).toHaveAttribute('data-island', 'idle');
    expect(screen.getByTestId('calc-monthly-total')).toHaveTextContent('60.321 ₺');
    expect(screen.getByTestId('calc-year-total')).toHaveTextContent('751.852 ₺');
    expect(screen.getByText(TR.t('calc.040'))).toBeInTheDocument();
  });

  it('without design roles the card is the designed empty state, its CTA an object Href to the band (W82)', () => {
    renderWithIntl(<CalculatorCard ctx={NO_ROLES} />);
    const empty = screen.getByTestId('calc-empty');
    expect(within(empty).getByRole('heading', { level: 2 })).toHaveTextContent(
      tr.sys.calc.empty.title,
    );
    expect(within(empty).getByRole('link', { name: TR.t('calc.105') })).toHaveAttribute(
      'href',
      '/maliyet-hesaplayici#calc-cta',
    );
  });
});

describe('CalcSection — the ≤ 700 px accordion (W10)', () => {
  it('keeps the h2 pair in the accessibility tree and toggles the body through data-open', async () => {
    const { container } = renderWithIntl(
      <CalcSection
        id="basis"
        tone="light"
        testId="calc-basis"
        toggle={{ title: 'Trigger', subtitle: 'Subtitle' }}
        head={{ title: 'Heading', sub: 'Sub' }}
      >
        <p>body</p>
      </CalcSection>,
    );
    expect(container.querySelector('section#basis')).not.toBeNull();
    const h2 = screen.getByRole('heading', { level: 2, name: 'Heading' });
    expect(tokens(h2.parentElement!)).toContain('max-md:sr-only');
    const toggle = screen.getByRole('button', { name: /Trigger/ });
    expect(tokens(toggle)).toContain('md:hidden');
    const body = within(screen.getByTestId('calc-basis')).getByTestId('section-body');
    expect(toggle).toHaveAttribute('aria-controls', body.id);
    expect(body).toHaveAttribute('data-open', 'false');
    expect(tokens(body)).toContain('max-md:hidden');
    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(body).toHaveAttribute('data-open', 'true');
    expect(tokens(body)).not.toContain('max-md:hidden');
  });

  it.each(['basis', 'section'] as const)(
    'the %s padding keeps an anchor jump clear of the sticky chrome (W231 review)',
    (pad) => {
      const { container } = renderWithIntl(
        <CalcSection
          id="quota"
          tone="light"
          testId="calc-quota"
          toggle={{ title: 'Trigger', subtitle: 'Subtitle' }}
          pad={pad}
        >
          <p>body</p>
        </CalcSection>,
      );
      const section = container.querySelector('section#quota')!;
      expect(tokens(section)).toEqual(expect.arrayContaining(ANCHOR_BANDS));
      expect(tokens(section)).not.toContain('scroll-mt-5');
    },
  );
});

describe('the section bodies (real TR bundle; every island shows its server fallback)', () => {
  it('JumpChips: a labelled phone-only nav of the six design anchors', () => {
    renderWithIntl(<JumpChips ctx={TR} />);
    const nav = screen.getByRole('navigation', { name: tr.sys.calc.jump.label });
    expect(tokens(nav)).toContain('md:hidden');
    expect(
      within(nav)
        .getAllByRole('link')
        .map((a) => a.getAttribute('href')),
    ).toEqual(['#salaries', '#quota', '#incentives', '#passcheck', '#penalties', '#faq']);
  });

  it('Basis: four source cards, the note, the "last updated" pill from rateConfig (D17), the Work Permit link', () => {
    renderWithIntl(<Basis ctx={TR} />);
    expect(screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual(
      ids(['calc.078', 'calc.080', 'calc.082', 'calc.085']),
    );
    expect(screen.getByTestId('calc-updated')).toHaveTextContent('15 Ocak 2026');
    expect(screen.getByRole('link', { name: TR.t('calc.084') })).toHaveAttribute(
      'href',
      '/calisma-izni',
    );
    expect(screen.getByText(TR.t('calc.087')).closest('div')?.textContent).toBe(
      `${TR.t('calc.087')} ${TR.t('calc.088')}`,
    );
  });

  it('Parity: page-local SVG icons — four basis tiles + note, the legend sits under the chips, underline tabs', () => {
    const { container, unmount } = renderWithIntl(<Basis ctx={TR} />);
    // 4 tiles + the amber note's alert + the updated pill's clock
    expect(container.querySelectorAll('svg[aria-hidden="true"]')).toHaveLength(6);
    expect(container.querySelector('svg')).toHaveAttribute('viewBox', '0 0 24 24');
    unmount();
    const sal = renderWithIntl(<Salaries ctx={TR} />);
    const guide = screen.getByTestId('guide-view');
    const [chips, legend] = [...guide.children];
    expect(chips.querySelector('[role="radiogroup"], span')).not.toBeNull();
    expect(legend.tagName).toBe('UL'); // chips first, then the colour key, then the cards
    sal.unmount();
    renderWithIntl(<Quota ctx={TR} />);
    const tabs = within(screen.getByTestId('calc-exemptions')).getAllByRole('tab');
    expect(tabs).toHaveLength(3);
    expect(tabs[0].parentElement).toHaveClass('grid', 'bg-pale-2');
  });

  it('Salaries: the legend’s minimum wage from rateConfig, the guide fallback at the model floor (W2/W59)', () => {
    const { container } = renderWithIntl(<Salaries ctx={TR} />);
    expect(container.textContent).toContain(`${TR.t('calc.094')} 33.030 ₺`);
    const guide = screen.getByTestId('guide-view');
    expect(guide).toHaveAttribute('data-live', 'false');
    const cards = within(guide).getAllByRole('article');
    expect(cards).toHaveLength(12);
    const welder = cards.find((a) => a.dataset.role === 'welder')!;
    expect(welder).toHaveTextContent(`${formatTRY(model('calc.557'), 'tr')} – `); // 49.545 ₺, never 50.000
    expect(welder).toHaveTextContent(
      formatTRY(model('Hiring Cost Calculator.dc.html:2718 (salary guide employer cost)'), 'tr'),
    );
  });

  it('Compare: a real table (seven row headers, desktop only), the phone short answer, the spread from rateConfig', () => {
    renderWithIntl(<Compare ctx={TR} />);
    const table = screen.getByRole('table');
    expect(
      within(table)
        .getAllByRole('rowheader')
        .map((th) => th.textContent),
    ).toEqual(
      ids(['calc.195', 'calc.200', 'calc.204', 'calc.208', 'calc.212', 'calc.216', 'calc.221']),
    );
    expect(tokens(table.parentElement!)).toContain('max-md:hidden');
    expect(screen.getByTestId('calc-compare-mobile').textContent).toContain(
      'Maaş ve SGK, yerli ve yurt dışından işe alımda birebir aynıdır. Yalnızca iki şey değişir.',
    );
    const spread = screen.getByTestId('calc-spread');
    expect(spread).toHaveTextContent('28.000 ₺'); // permitFeeTRY + flightTRY (delta 6)
    expect(spread).toHaveTextContent('2.333 ₺ / ay');
    expect(spread).toHaveTextContent('778 ₺ / ay');
  });

  it('Quota: both Gate 1 fallbacks at 25 staff (calc.558), the exemptions tabs with the sys badges', async () => {
    renderWithIntl(<Quota ctx={TR} />);
    expect(screen.getByTestId('quota-view')).toHaveAttribute('data-live', 'false');
    expect(screen.getByTestId('quota-allowed')).toHaveTextContent('5 yabancı işçi');
    expect(screen.getByTestId('quota-viz-note')).toHaveTextContent(TR.t('calc.558'));
    expect(screen.getByTestId('quota-allowed-m')).toHaveTextContent('5 yabancı işçi');
    const ex = screen.getByTestId('calc-exemptions');
    expect(
      within(ex)
        .getAllByRole('tab')
        .map((tab) => tab.textContent),
    ).toEqual(ids(['calc.430', 'calc.431', 'calc.432']));
    const panel = within(ex).getByRole('tabpanel');
    expect(panel).toHaveTextContent(TR.t('calc.549'));
    expect(panel).toHaveTextContent(tr.sys.calc.exemptions.tenStaff);
    await userEvent.click(within(ex).getByRole('tab', { name: TR.t('calc.431') }));
    expect(within(ex).getByRole('tabpanel')).toHaveTextContent(tr.sys.calc.exemptions.full);
  });

  it('PassCheck: the server fallback at the defaults (calc.561) with the bare WhatsApp href (W95); nothing is a form', () => {
    renderWithIntl(<PassCheck ctx={TR} />);
    expect(screen.getByTestId('pass-view')).toHaveAttribute('data-live', 'false');
    expect(screen.getByTestId('pass-verdict')).toHaveAttribute('data-tone', 'idle');
    expect(screen.getByText(TR.t('calc.561'))).toBeInTheDocument();
    expect(screen.getByTestId('pass-send')).toHaveAttribute('href', WA);
    expect(document.querySelector('form')).toBeNull();
  });

  it('PassCheck renders nothing without design roles', () => {
    const { container } = renderWithIntl(<PassCheck ctx={NO_ROLES} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('Incentives: the three SGK rates and the ten-worker support from rateConfig (D17); the phone card’s live rate', () => {
    const { container } = renderWithIntl(<Incentives ctx={TR} />);
    expect(
      within(screen.getByTestId('calc-sgk-rates'))
        .getAllByRole('definition')
        .map((d) => d.textContent),
    ).toEqual(['%23,75', '%21,75', '%18,75']);
    expect(container.textContent).toContain('12.700 ₺'); // formatTRY(10 × supportMonthly); the package's "₺12.700" leads with the sign
    expect(screen.getByTestId('calc-incentives-mobile')).toHaveTextContent('%21,75');
  });

  it('Penalties: calc.408 inside the fine sentence, the <br /> labels, the consequence cards at every width', () => {
    const { container } = renderWithIntl(<Penalties ctx={TR} />);
    expect(container.textContent).toContain(`${TR.t('calc.408')}'e çıkar.`);
    expect(container.querySelectorAll('dt br')).toHaveLength(2);
    const consequences = screen.getByTestId('calc-consequences');
    expect(tokens(consequences)).not.toContain('max-md:hidden');
    expect(within(consequences).getAllByRole('heading', { level: 3 })).toHaveLength(3);
  });

  it('Students: the package’s own tier subtitles (calc.263/271), the phone rules list with the amber last row', () => {
    renderWithIntl(<Students ctx={TR} />);
    expect(screen.getAllByText(TR.t('calc.263')).length).toBeGreaterThan(0);
    expect(screen.getAllByText(TR.t('calc.271')).length).toBeGreaterThan(0);
    const rows = within(screen.getByTestId('calc-students-rules')).getAllByRole('listitem');
    expect(rows).toHaveLength(4);
    expect(tokens(rows[3])).toContain('bg-warning-surface');
  });

  it('Faq: one FAQPage of the 15 pairs, the ask card’s generic WhatsApp prefill and the e-mail row (W83, W95)', () => {
    const { container } = renderWithIntl(<Faq ctx={TR} />);
    const faq = jsonLd(container).filter((n) => n['@type'] === 'FAQPage');
    expect(faq).toHaveLength(1);
    expect(faq[0].mainEntity).toHaveLength(15);
    expect(screen.getByRole('link', { name: (n) => n.includes(TR.t('calc.052')) })).toHaveAttribute(
      'href',
      `${WA}?text=${encodeURIComponent(tr.sys.calc.whatsapp.generic)}`,
    );
    expect(screen.getByRole('link', { name: (n) => n.includes(TR.t('calc.406')) })).toHaveAttribute(
      'href',
      `mailto:${TR.settings.email}?subject=${encodeURIComponent(TR.t('calc.002'))}`,
    );
    expect(container.textContent).not.toMatch(/\{homepageReplyHours\}/); // calc.381 via makeTf (W1)
  });

  it('ClosingBand: #calc-cta, the band quote button, the phone recap fallback, Available Workers, the tracked e-mail', () => {
    const { container } = renderWithIntl(<ClosingBand ctx={TR} />);
    expect(container.querySelector('section#calc-cta')).not.toBeNull();
    expect(screen.getByTestId('calc-quote-open-band')).toHaveTextContent(TR.t('calc.105'));
    const recap = screen.getByTestId('calc-recap');
    expect(tokens(recap)).toContain('md:hidden');
    expect(within(recap).getByTestId('recap-total')).toHaveTextContent('751.852 ₺');
    expect(screen.getByRole('link', { name: TR.t('calc.106') })).toHaveAttribute(
      'href',
      '/adaylar',
    );
    expect(screen.getByRole('link', { name: TR.settings.email })).toHaveAttribute(
      'href',
      `mailto:${TR.settings.email}`,
    );
  });
});

describe('pixel run 1 (d) fixes — Cycle 8(a)', () => {
  it('the h1 is the design page’s own clamp (54 px, × 0.75 from 1101), never the homepage token', () => {
    renderWithIntl(<Hero ctx={TR}>{null}</Hero>);
    const h1 = tokens(screen.getByRole('heading', { level: 1 }));
    expect(h1).toContain('text-[clamp(36px,4.2vw,54px)]');
    expect(h1).toContain('xl:text-[clamp(27px,3.15vw,40.5px)]');
    expect(h1).not.toContain('text-h1');
  });

  it('the card stacks up to 900 px, keeps the salary row on phones, and holds back the estimate head and total there', () => {
    renderWithIntl(<CalculatorCard ctx={TR} />);
    const grid = tokens(screen.getByTestId('calc-skeleton'));
    expect(grid).toContain('lg:grid-cols-[1fr_1.05fr]');
    expect(grid.some((c) => c.startsWith('md:grid-cols'))).toBe(false);
    expect(tokens(screen.getByTestId('calc-salary-row'))).not.toContain('max-md:hidden');
    expect(tokens(screen.getByTestId('calc-out-head'))).toContain('max-md:hidden');
    expect(tokens(screen.getByTestId('calc-total-card'))).toContain('max-md:hidden');
  });

  it('every multi-column section grid starts at 901 px — the design collapses its grids at ≤ 900', () => {
    const { container } = renderWithIntl(
      <>
        <Salaries ctx={TR} />
        <Compare ctx={TR} />
        <Quota ctx={TR} />
        <Penalties ctx={TR} />
        <Students ctx={TR} />
        <Basis ctx={TR} />
        <Incentives ctx={TR} />
      </>,
    );
    const early = [...container.querySelectorAll('[class]')]
      .flatMap((el) => tokens(el))
      .filter((c) => /^(sm|md):grid-cols-/.test(c));
    expect(early).toEqual([]);
  });
});

describe('page.tsx (static checks — the page itself is proven by the Cycle 7 build + gate)', () => {
  const source = () =>
    readFileSync(
      join(process.cwd(), 'src/app/[locale]/(site)/hiring-cost-calculator/page.tsx'),
      'utf8',
    );
  it('revalidates daily for the D17 badge (W150) and builds its metadata from sys.seo.calc (W23/W38)', () => {
    const src = source();
    expect(src).toMatch(/^export const revalidate = 86400;$/m);
    expect(src).toContain("pageKey: 'calc'");
    expect(src).toContain("fallbackTitle: sys('seo.calc.title')");
    expect(src).toContain("fallbackDescription: sys('seo.calc.description')");
  });
  it('mounts the sticky bar only through the lazy binder, hidden near #calc-cta (W18/W13 amended)', () => {
    const src = source();
    expect(src).toContain('<LazyStickyBar');
    expect(src).toContain('hideNearId="calc-cta"');
    expect(src).toMatch(/^import type \{ StickyCta \} from '@\/design\/chrome\/StickyCtaBar';$/m);
  });
});
