import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BundleSchema, type Bundle } from '../../../../../../../contract/website-bundle.v1';
import { getCollection } from '@/content/collections';
import { makeTf } from '@/content/pure';
import tr from '@/messages/tr.json';
import { renderWithIntl } from '@/test/render';
import { PARTNER_LOGO_SLOTS, PARTNER_LOGOS } from '../../_lib/logos';
import { Chain } from '../Chain';
import { Closing } from '../Closing';
import { Faq } from '../Faq';
import { Hero } from '../Hero';
import { Logos } from '../Logos';
import { NetworkCard } from '../NetworkCard';
import { Portal } from '../Portal';
import { Process } from '../Process';

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
const tokens = (el: Element | null) => (el?.getAttribute('class') ?? '').split(/\s+/);
const heroWhatsApp = `${WA}?text=${encodeURIComponent(tr.sys.partner.whatsapp.prefill)}`;
const METRICS_TR = getCollection(TR, 'metrics');
const hero = <Hero locale="tr" tf={tfTr} metrics={METRICS_TR} whatsappHref={heroWhatsApp} />;

describe('Hero', () => {
  it('holds the one page-h1 as the LCP slot, this page own crumbs (W109) and no photo slot (§10 #4)', () => {
    const { container } = renderWithIntl(hero);
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toHaveAttribute('data-testid', 'page-h1');
    expect(h1).toHaveAttribute('data-lcp-slot', 'h1');
    expect(h1).toHaveTextContent(tfTr('partner.023'));
    // S1.1: the design's sky accent on the agency phrase, the rest white
    expect(within(h1).getByText('işe alım ajansıyla')).toHaveClass('text-sky');
    expect(container.querySelector('[data-placeholder]')).toBeNull();
    const crumbs = screen.getByRole('navigation', { name: tr.sys.nav.breadcrumbs });
    expect(within(crumbs).getByRole('link', { name: 'Ana Sayfa' })).toHaveAttribute('href', '/');
    expect(within(crumbs).getByText('İş Ortağı Olun')).toHaveAttribute('aria-current', 'page');
  });

  it('renders both lead variants with CSS visibility (W10/W119) and the two ticks', () => {
    renderWithIntl(hero);
    expect(tokens(screen.getByText(tfTr('partner.024')))).toContain('max-md:hidden');
    expect(tokens(screen.getByText(tfTr('partner.025')))).toContain('md:hidden');
    for (const id of ['partner.026', 'partner.028'])
      expect(screen.getByText(tfTr(id)).tagName).toBe('STRONG');
  });

  it('links to #tracks and to WhatsApp with the static partnership prefill only (W95)', () => {
    renderWithIntl(hero);
    expect(screen.getByRole('link', { name: tfTr('partner.030') })).toHaveAttribute(
      'href',
      '#tracks',
    );
    const wa = screen.getByRole('link', { name: tfTr('partner.031') });
    expect(wa).toHaveAttribute('href', heroWhatsApp);
    expect(wa).toHaveAttribute('target', '_blank');
  });
});

describe('NetworkCard (W1, owner 2026-10-05)', () => {
  it('renders the design four rows in order — the 5+/20+ samples with the SampleTag, then the signed 13 and 470+', () => {
    renderWithIntl(<NetworkCard tf={tfTr} metrics={METRICS_TR} locale="tr" />);
    const card = screen.getByTestId('partner-network');
    const rows = within(card).getAllByRole('listitem');
    expect(rows).toHaveLength(4);
    expect(rows.map((r) => r.querySelector('.sr-only')?.textContent)).toEqual([
      '5+',
      '20+',
      '13',
      '470+',
    ]);
    expect(rows[0]).toHaveTextContent(tfTr('partner.037'));
    expect(rows[1]).toHaveTextContent(tfTr('partner.039'));
    // the two sample rows wear the tag, the signed ones never do
    expect(rows.map((r) => r.querySelector('[data-sample-tag]') !== null)).toEqual([
      true,
      true,
      false,
      false,
    ]);
    expect(tokens(within(card).getByText(tfTr('partner.041')))).toContain('max-md:hidden');
    expect(tokens(within(card).getByText(tfTr('partner.042')))).toContain('md:hidden');
    // the rows slide in once in view, the figures count up (`Stat`), the live dot pulses
    expect(tokens(card.querySelector('ul'))).toContain('ja-reveal-group');
    for (const row of rows) expect(tokens(row)).toContain('ja-net-row');
    expect(card.querySelectorAll('[data-count-up]')).toHaveLength(4);
    expect(tokens(card.querySelector('[aria-hidden="true"].rounded-pill'))).toContain('ja-live');
  });

  it('drops a signed row whose metric is unsigned (null) — never a hard-typed number', () => {
    const metrics = METRICS_TR.map((m) => (m.key === 'placed' ? { ...m, value: null } : m));
    renderWithIntl(<NetworkCard tf={tfTr} metrics={metrics} locale="tr" />);
    const rows = within(screen.getByTestId('partner-network')).getAllByRole('listitem');
    expect(rows).toHaveLength(3);
    expect(screen.getByTestId('partner-network')).not.toHaveTextContent('470');
  });
});

describe('Logos (owner 2026-10-05, W6)', () => {
  it('without consented logos shows the 25+ sample figure, its caption and tag, and the 20 labelled slots', () => {
    expect(PARTNER_LOGOS).toEqual([]);
    const { container } = renderWithIntl(<Logos tf={tfTr} logos={PARTNER_LOGOS} />);
    const band = screen.getByTestId('partner-logos');
    expect(band).toHaveTextContent('25+');
    expect(band).toHaveTextContent(tfTr('partner.045'));
    expect(band.querySelector('[data-sample-tag]')).not.toBeNull();
    const slots = [...container.querySelectorAll('[data-placeholder^="logo-"]')];
    // the marquee renders its track twice for the seamless loop; the first lap is the 20 slots
    expect(slots.length).toBeGreaterThanOrEqual(PARTNER_LOGO_SLOTS.length);
    expect(slots[0]).toHaveTextContent('İş ortağı logosu 1');
    expect(slots[9]).toHaveTextContent('İş ortağı logosu 10');
    expect(slots[10]).toHaveTextContent('İş ortağı logosu 1');
  });

  it('with consented logos runs the logos instead of the slots', () => {
    const { container } = renderWithIntl(
      <Logos
        tf={tfTr}
        logos={[{ src: '/brand/logos/acme.svg', alt: 'Acme Lojistik', width: 160, height: 60 }]}
      />,
    );
    expect(container.querySelector('[data-placeholder^="logo-"]')).toBeNull();
    expect(screen.getAllByRole('img', { name: 'Acme Lojistik' }).length).toBeGreaterThan(0);
  });
});

describe('Chain', () => {
  it('composes the split sentence around the typed Hire Workers link (W23) and renders three nodes', () => {
    renderWithIntl(<Chain tf={tfTr} />);
    const chain = screen.getByTestId('partner-chain');
    const link = within(chain).getByRole('link', { name: 'İşçi Talebi' });
    expect(link).toHaveAttribute('href', '/isci-talebi');
    expect(tokens(link)).toContain('underline');
    expect(link.closest('p')).toHaveTextContent(
      `${tfTr('partner.048')} İşçi Talebi ${tfTr('partner.049')}`,
    );
    for (const id of ['partner.051', 'partner.054', 'partner.057'])
      expect(within(chain).getByText(tfTr(id))).toBeInTheDocument();
    const arrows = within(chain).getAllByText('→');
    expect(arrows).toHaveLength(2);
    for (const arrow of arrows) {
      expect(arrow).toHaveAttribute('aria-hidden', 'true');
      expect(tokens(arrow)).toContain('max-lg:hidden');
    }
  });

  it('hangs the nodes off the design rail on phones (M5): a 26 px gutter, ring dots per node', () => {
    renderWithIntl(<Chain tf={tfTr} />);
    const node = screen.getByText(tfTr('partner.051')).parentElement as HTMLElement;
    const grid = node.parentElement as HTMLElement;
    expect(tokens(grid)).toEqual(
      expect.arrayContaining(['max-md:grid-cols-[26px_1fr]', "max-md:before:content-['']"]),
    );
    expect(tokens(node)).toEqual(
      expect.arrayContaining(['max-md:col-start-2', 'max-md:before:border-blue']),
    );
  });

  it('links the English route under /en', () => {
    renderWithIntl(<Chain tf={tfEn} />, { locale: 'en' });
    expect(screen.getByRole('link', { name: 'Hire Workers' })).toHaveAttribute(
      'href',
      '/en/hire-workers',
    );
  });
});

describe('Process', () => {
  it('is the four-card journey in order with its icons, step 4 with the Full access pill, the reply SLA filled (D17)', () => {
    renderWithIntl(<Process bundle={TR} locale="tr" tf={tfTr} />);
    const journey = screen.getByTestId('partner-process').querySelector('#how-it-starts');
    expect(journey).toHaveAttribute('data-variant', 'row');
    const list = (journey as HTMLElement).querySelector('ol');
    expect(list).not.toBeNull();
    const steps = within(list as HTMLElement).getAllByRole('listitem');
    // S7.2: step 4's uppercase "Full access" pill sits inline after its title
    expect(steps.map((s) => within(s).getByRole('heading', { level: 3 }).textContent)).toEqual([
      ...['partner.139', 'partner.141', 'partner.143'].map(tfTr),
      `${tfTr('partner.145')}${tfTr('partner.146')}`,
    ]);
    expect(steps[0]).toHaveTextContent('4 iş saati');
    for (const step of steps) expect(step.querySelector('svg')).not.toBeNull();
    expect(steps[3].querySelector('svg')).toHaveClass('text-success');
    // the cards rise and the line draws once in view (motion `steps`)
    expect(tokens(journey)).toContain('ja-reveal-group');
    expect((journey as HTMLElement).querySelector('.ja-journey-line')).not.toBeNull();
  });
});

describe('Portal', () => {
  it('shows both store badges, App Store first (W227, S8.1), the {placed} claim (W1) and two named screenshot placeholders (W55)', () => {
    const { container } = renderWithIntl(
      <Portal
        bundle={TR}
        locale="tr"
        tf={tfTr}
        androidUrl={TR.settings.storeLinks.android}
        iosUrl={TR.settings.storeLinks.ios}
      />,
    );
    const portal = screen.getByTestId('partner-portal');
    expect(within(portal).getByRole('link', { name: /Google Play/ })).toHaveAttribute(
      'href',
      TR.settings.storeLinks.android ?? '',
    );
    expect(within(portal).getByRole('link', { name: /App Store/ })).toHaveAttribute(
      'href',
      TR.settings.storeLinks.ios ?? '',
    );
    expect(
      within(portal)
        .getAllByRole('link')
        .map((a) => a.getAttribute('href')),
    ).toEqual([TR.settings.storeLinks.ios, TR.settings.storeLinks.android]);
    expect(portal).toHaveTextContent('470+ yerleştirme');
    expect(
      [...container.querySelectorAll('[data-placeholder]')].map((el) =>
        el.getAttribute('data-placeholder'),
      ),
    ).toEqual(['partner-portal-screen', 'partner-portal-mobile']);
    expect(container.querySelector('[data-lcp-slot]')).toBeNull();
    const phone = container.querySelector('[data-placeholder="partner-portal-mobile"]');
    expect(tokens(phone?.parentElement ?? null)).toContain('max-md:hidden');
  });

  // QA W220 P-03: the phone wrapper carries its × 0.75 `xl:` twin (design 150 px → 112.5 px from
  // 1101) and the laptop slot runs the W189 cover mode at the design's fixed heights (240 ≤ 700,
  // the authored 340 to 1100, 255 from 1101) instead of a width-driven 720 × 340 ratio box, so the
  // phone tucks into the laptop's lower-right corner and the address bar stays visible.
  it('sizes the laptop by cover height and the phone with its xl twin (P-03)', () => {
    const { container } = renderWithIntl(
      <Portal bundle={TR} locale="tr" tf={tfTr} androidUrl={TR.settings.storeLinks.android} />,
    );
    const phone = container.querySelector('[data-placeholder="partner-portal-mobile"]');
    expect(tokens(phone?.parentElement ?? null)).toEqual(
      expect.arrayContaining(['w-[150px]', 'xl:w-[112.5px]']),
    );
    const laptop = container.querySelector<HTMLElement>(
      '[data-placeholder="partner-portal-screen"]',
    )!;
    expect(laptop).toHaveClass(
      'w-full',
      'object-cover',
      'h-(--cover-h)',
      'md:h-(--cover-h-md)',
      'xl:h-(--cover-h-xl)',
    );
    expect(laptop.style.aspectRatio).toBe('');
    expect(laptop.style.getPropertyValue('--cover-h')).toBe('240px');
    expect(laptop.style.getPropertyValue('--cover-h-md')).toBe('340px');
    expect(laptop.style.getPropertyValue('--cover-h-lg')).toBe('340px');
    expect(laptop.style.getPropertyValue('--cover-h-xl')).toBe('255px');
  });
});

describe('Faq', () => {
  it('six pairs with the first open, one FAQPage node, and WhatsApp / call / e-mail ask rows (W83)', () => {
    const { container } = renderWithIntl(
      <Faq
        bundle={TR}
        locale="tr"
        tf={tfTr}
        whatsappNumber="905011240340"
        whatsappText={tr.sys.partner.faq.whatsappText}
        phone="+905011240340"
        phoneDisplay="+90 501 124 03 40"
        email="info@jobsadmire.com"
        emailSubject={tr.sys.partner.faq.emailSubject}
      />,
    );
    const faq = screen.getByTestId('partner-faq');
    expect(faq.querySelector('#faq')).toHaveAttribute('data-variant', 'cards');
    const triggers = within(faq).getAllByRole('button');
    expect(triggers).toHaveLength(6);
    expect(triggers[0]).toHaveAttribute('aria-expanded', 'true');
    expect(triggers[1]).toHaveAttribute('aria-expanded', 'false');
    const nodes = [...container.querySelectorAll('script[type="application/ld+json"]')].map(
      (s) => JSON.parse(s.textContent ?? '{}') as { '@type'?: string; mainEntity?: unknown[] },
    );
    const faqNodes = nodes.filter((n) => n['@type'] === 'FAQPage');
    expect(faqNodes).toHaveLength(1);
    expect(faqNodes[0].mainEntity).toHaveLength(6);
    // S9.2: the design's contact rows — label + the bold number / address
    expect(
      within(faq).getByRole('link', { name: /^WhatsApp\s*\+90 501 124 03 40$/ }),
    ).toHaveAttribute('href', `${WA}?text=${encodeURIComponent(tr.sys.partner.faq.whatsappText)}`);
    expect(
      within(faq).getByRole('link', { name: /^Bizi arayın\s*\+90 501 124 03 40$/ }),
    ).toHaveAttribute('href', 'tel:+905011240340');
    expect(
      within(faq).getByRole('link', { name: /^E-posta\s*info@jobsadmire\.com$/ }),
    ).toHaveAttribute(
      'href',
      `mailto:info@jobsadmire.com?subject=${encodeURIComponent(tr.sys.partner.faq.emailSubject)}`,
    );
  });
});

describe('Closing', () => {
  it('is the light centred band #closing with #tracks and phone CTAs, the reply badge on phones only, the legal e-mail', () => {
    const { container } = renderWithIntl(
      <Closing
        bundle={TR}
        locale="tr"
        tf={tfTr}
        phone="+905011240340"
        phoneDisplay="+90 501 124 03 40"
        email="info@jobsadmire.com"
      />,
    );
    const closing = screen.getByTestId('partner-closing');
    expect(container.querySelector('#closing')).toHaveAttribute('data-tone', 'light');
    expect(within(closing).getByRole('heading', { level: 2 })).toHaveTextContent(
      tfTr('partner.187'),
    );
    const apply = within(closing).getByRole('link', { name: tfTr('partner.189') });
    expect(apply).toHaveAttribute('href', '#tracks');
    expect(tokens(apply)).toContain('bg-blue-safe'); // the design's blue primary, not the green
    expect(within(closing).getByRole('link', { name: '+90 501 124 03 40' })).toHaveAttribute(
      'href',
      'tel:+905011240340',
    );
    expect(tokens(within(closing).getByText(tfTr('partner.186')))).toContain('md:hidden');
    expect(within(closing).getByRole('link', { name: 'info@jobsadmire.com' })).toHaveAttribute(
      'href',
      'mailto:info@jobsadmire.com',
    );
  });
});
