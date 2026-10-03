import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BundleSchema, type Bundle } from '../../../../../../../contract/website-bundle.v1';
import { makeTf, metricValues } from '@/content/pure';
import tr from '@/messages/tr.json';
import { renderWithIntl } from '@/test/render';
import { PARTNER_LOGOS } from '../../_lib/logos';
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
const hero = (
  <Hero locale="tr" tf={tfTr} metrics={metricValues(TR, 'tr')} whatsappHref={heroWhatsApp} />
);

describe('Hero', () => {
  it('holds the one page-h1 as the LCP slot, this page own crumbs (W109) and no photo slot (§10 #4)', () => {
    const { container } = renderWithIntl(hero);
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toHaveAttribute('data-testid', 'page-h1');
    expect(h1).toHaveAttribute('data-lcp-slot', 'h1');
    expect(h1).toHaveTextContent(tfTr('partner.023'));
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

describe('NetworkCard (W1)', () => {
  it('renders only the two signed rows — 13 source countries, 470+ placed — with desk/phone labels', () => {
    renderWithIntl(<NetworkCard tf={tfTr} metrics={metricValues(TR, 'tr')} />);
    const card = screen.getByTestId('partner-network');
    const rows = within(card).getAllByRole('listitem');
    expect(rows).toHaveLength(2);
    expect(rows[0]).toHaveTextContent('13');
    expect(rows[1]).toHaveTextContent('470+');
    expect(tokens(within(card).getByText(tfTr('partner.041')))).toContain('max-md:hidden');
    expect(tokens(within(card).getByText(tfTr('partner.042')))).toContain('md:hidden');
    expect(card).not.toHaveTextContent(tfTr('partner.037'));
    expect(card).not.toHaveTextContent(tfTr('partner.039'));
  });

  it('drops a row whose metric is unsigned (empty) — never a hard-typed number', () => {
    renderWithIntl(<NetworkCard tf={tfTr} metrics={{ countries: '13', placed: '' }} />);
    expect(within(screen.getByTestId('partner-network')).getAllByRole('listitem')).toHaveLength(1);
  });
});

describe('Logos (W6)', () => {
  it('renders nothing, not even its band, while no consented logo exists', () => {
    expect(PARTNER_LOGOS).toEqual([]);
    const { container } = renderWithIntl(<Logos logos={PARTNER_LOGOS} />);
    expect(container).toBeEmptyDOMElement();
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

  it('links the English route under /en', () => {
    renderWithIntl(<Chain tf={tfEn} />, { locale: 'en' });
    expect(screen.getByRole('link', { name: 'Hire Workers' })).toHaveAttribute(
      'href',
      '/en/hire-workers',
    );
  });
});

describe('Process', () => {
  it('is the four steps in order, step 4 with the Full access pill, the reply SLA filled (D17)', () => {
    renderWithIntl(<Process bundle={TR} locale="tr" tf={tfTr} />);
    const list = screen.getByTestId('partner-process').querySelector('ol#how-it-starts');
    expect(list).not.toBeNull();
    const steps = within(list as HTMLElement).getAllByRole('listitem');
    expect(steps.map((s) => within(s).getByRole('heading', { level: 3 }).textContent)).toEqual(
      ['partner.139', 'partner.141', 'partner.143', 'partner.145'].map(tfTr),
    );
    expect(steps[3]).toHaveTextContent(tfTr('partner.146'));
    expect(steps[0]).toHaveTextContent('4 iş saati');
  });
});

describe('Portal', () => {
  it('shows the Android badge only (W8), the {placed} claim (W1) and two named screenshot placeholders (W55)', () => {
    const { container } = renderWithIntl(
      <Portal bundle={TR} locale="tr" tf={tfTr} androidUrl={TR.settings.storeLinks.android} />,
    );
    const portal = screen.getByTestId('partner-portal');
    expect(within(portal).getByRole('link', { name: /Google Play/ })).toHaveAttribute(
      'href',
      TR.settings.storeLinks.android ?? '',
    );
    expect(within(portal).queryByRole('link', { name: /App Store/ })).toBeNull();
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
        email="info@jobsadmire.com"
        emailSubject={tr.sys.partner.faq.emailSubject}
      />,
    );
    const faq = screen.getByTestId('partner-faq');
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
    expect(within(faq).getByRole('link', { name: 'WhatsApp' })).toHaveAttribute(
      'href',
      `${WA}?text=${encodeURIComponent(tr.sys.partner.faq.whatsappText)}`,
    );
    expect(within(faq).getByRole('link', { name: 'Bizi arayın' })).toHaveAttribute(
      'href',
      'tel:+905011240340',
    );
    expect(within(faq).getByRole('link', { name: 'E-posta' })).toHaveAttribute(
      'href',
      `mailto:info@jobsadmire.com?subject=${encodeURIComponent(tr.sys.partner.faq.emailSubject)}`,
    );
  });
});

describe('Closing', () => {
  it('is the dark band #closing with #tracks and phone CTAs, the reply badge on phones only, the legal e-mail', () => {
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
    expect(container.querySelector('#closing')).not.toBeNull();
    expect(within(closing).getByRole('heading', { level: 2 })).toHaveTextContent(
      tfTr('partner.187'),
    );
    expect(within(closing).getByRole('link', { name: tfTr('partner.189') })).toHaveAttribute(
      'href',
      '#tracks',
    );
    expect(within(closing).getByRole('link', { name: '+90 501 124 03 40' })).toHaveAttribute(
      'href',
      'tel:+905011240340',
    );
    expect(tokens(within(closing).getByText(tfTr('partner.186')).closest('ul'))).toContain(
      'md:hidden',
    );
    expect(within(closing).getByRole('link', { name: 'info@jobsadmire.com' })).toHaveAttribute(
      'href',
      'mailto:info@jobsadmire.com',
    );
  });
});
