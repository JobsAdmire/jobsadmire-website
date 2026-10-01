import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { getRateConfig } from '@/content/collections';
import type { Locale } from '@/i18n/routing';
import { waLink } from '@/lib/contact';
import en from '@/messages/en.json';
import tr from '@/messages/tr.json';
import { collisionsInTree } from '@/test/class-collisions';
import { renderWithIntl } from '@/test/render';
import { BUNDLES, sysFor, tfFor, tokens } from '../../_lib/__tests__/helpers';
import { JUMP_LINKS } from '../../_lib/tables';
import { buildWizardProps } from '../../_lib/wizard-props';
import { AudienceRouter } from '../AudienceRouter';
import { Hero } from '../Hero';
import { JumpNav } from '../JumpNav';
import { RoutesComparison } from '../RoutesComparison';

const tfTr = tfFor('tr');
const tfEn = tfFor('en');
const BADGE_TR = 'Güncelleme: Ocak 2026 · JobsAdmire izin ekibi tarafından incelendi';
const wizardFor = (locale: Locale) =>
  buildWizardProps({
    locale,
    whatsappNumber: BUNDLES[locale].settings.whatsappNumber,
    quotaRatio: getRateConfig(BUNDLES[locale]).quotaRatio,
    tf: tfFor(locale),
    sys: sysFor(locale),
  });
const renderHero = (locale: Locale, badge: string | null) =>
  renderWithIntl(
    <Hero
      bundle={BUNDLES[locale]}
      locale={locale}
      tf={tfFor(locale)}
      badge={badge}
      wizard={wizardFor(locale)}
    />,
    { locale },
  );

describe('Hero', () => {
  it('one page-h1 holding the only data-lcp-slot; wp-hero is a named, decorative placeholder (D26/W55)', () => {
    const { container } = renderHero('tr', BADGE_TR);
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toHaveAttribute('data-testid', 'page-h1');
    expect(h1).toHaveAttribute('data-lcp-slot', 'h1');
    expect(h1.textContent).toBe(`${tfTr('wp.023')} ${tfTr('wp.024')}`);
    expect(container.querySelectorAll('[data-lcp-slot]')).toHaveLength(1);
    const slot = container.querySelector('[data-placeholder="wp-hero"]');
    expect(slot).not.toBeNull();
    expect(slot).toHaveAttribute('aria-hidden', 'true');
    expect(slot).not.toHaveAttribute('data-lcp-slot');
    expect(collisionsInTree(container)).toEqual([]);
  });

  it('carries this page’s own crumbs (W109), the D17 badge, the metric benefit and three chips — no fine chip', () => {
    const { container } = renderHero('tr', BADGE_TR);
    const nav = screen.getByRole('navigation', { name: tr.sys.nav.breadcrumbs });
    expect(within(nav).getByRole('link', { name: tfTr('wp.021') })).toHaveAttribute('href', '/');
    expect(within(nav).getByText(tfTr('wp.011'))).toHaveAttribute('aria-current', 'page');
    expect(screen.getByTestId('wp-updated')).toHaveTextContent(BADGE_TR);
    expect(screen.getByText('470+ izin dosyalandı')).toBeInTheDocument(); // wp.030 {placed} (W1)
    expect(screen.getByTestId('wp-chips').querySelectorAll('li')).toHaveLength(3);
    expect(container.textContent).not.toContain(tfTr('wp.052')); // delta 2
    expect(container.textContent).not.toContain(tfTr('wp.022')); // D17
  });

  it('renders no badge once the review is due (heroBadge → null)', () => {
    renderHero('tr', null);
    expect(screen.queryByTestId('wp-updated')).toBeNull();
  });

  it('W10: the ≤ 700 px copy variants and the CTA row are CSS switches on server-rendered markup', () => {
    renderHero('en', null);
    expect(tokens(screen.getByTestId('wp-intro-desk'))).toContain('max-md:hidden');
    expect(tokens(screen.getByTestId('wp-intro-mob'))).toContain('md:hidden');
    const ctas = screen.getByTestId('wp-hero-ctas');
    expect(tokens(ctas)).toContain('max-md:hidden');
    expect(tokens(ctas)).not.toContain('hidden');
    expect(within(ctas).getByRole('link', { name: tfEn('wp.034') })).toHaveAttribute(
      'href',
      '#eligibility',
    );
    const wa = within(ctas).getByRole('link', { name: tfEn('wp.035') });
    expect(wa).toHaveAttribute(
      'href',
      waLink('905011240340', 'Hello JobsAdmire, I have a work permit question.'),
    );
    expect(wa).toHaveAttribute('target', '_blank');
    expect(screen.getByTestId('wp-eligibility')).toHaveAttribute('id', 'eligibility');
  });
});

describe('JumpNav', () => {
  it('is a labelled nav of the eight in-page anchors, sticky only from 1101 px under the 79 px header', () => {
    const { container } = renderWithIntl(<JumpNav tf={tfTr} />);
    const nav = screen.getByRole('navigation', { name: tfTr('wp.056') });
    expect(
      within(nav)
        .getAllByRole('link')
        .map((a) => a.getAttribute('href')),
    ).toEqual(JUMP_LINKS.map((j) => j.hash));
    expect(tokens(nav)).toEqual(expect.arrayContaining(['xl:sticky', 'xl:top-[79px]']));
    expect(collisionsInTree(container)).toEqual([]);
  });
});

describe('AudienceRouter', () => {
  it('TR: three localized internal cards and the permit-only WhatsApp door, in design order', () => {
    const { container } = renderWithIntl(<AudienceRouter bundle={BUNDLES.tr} tf={tfTr} />);
    const links = within(screen.getByTestId('wp-router')).getAllByRole('link');
    expect(links.map((a) => a.getAttribute('href'))).toEqual([
      '/isci-talebi',
      waLink(
        '905011240340',
        'Merhaba JobsAdmire, kendi işçim var — çalışma iznini siz yürütebilir misiniz?',
      ),
      '/ortak-olun',
      '/maliyet-hesaplayici',
    ]);
    expect(links[1]).toHaveAttribute('target', '_blank');
    // ≤ 700 px the design drops each card's body line (W10)
    expect(tokens(screen.getByText(tfTr('wp.086')))).toContain('max-md:hidden');
    expect(collisionsInTree(container)).toEqual([]);
  });
});

describe('RoutesComparison + SampleCard', () => {
  it('stacks both routes with real captions instead of the design’s tabs (D20/W10)', () => {
    const { container } = renderWithIntl(<RoutesComparison tf={tfEn} />, { locale: 'en' });
    expect(container.querySelector('section#routes')).not.toBeNull();
    const region = screen.getByTestId('wp-routes');
    expect(within(region).queryAllByRole('tab')).toHaveLength(0);
    expect(within(region).getByTestId('wp-routes-permit')).toHaveTextContent(tfEn('wp.102'));
    expect(within(region).getByTestId('wp-routes-exempt')).toHaveTextContent(tfEn('wp.106'));
    const captions = [
      ...within(region).getAllByText(tfEn('wp.099')),
      ...within(region).getAllByText(tfEn('wp.100')),
    ];
    expect(captions).toHaveLength(10);
    for (const caption of captions) {
      expect(tokens(caption)).toContain('lg:sr-only');
      expect(tokens(caption)).not.toContain('hidden');
    }
    // fragments joined as the package splits them (W23): no space before wp.119's comma
    expect(region.textContent).toContain("The employer, on the Ministry's online system");
    expect(region.textContent).toContain(tfEn('wp.138'));
    expect(collisionsInTree(container)).toEqual([]);
  });

  it('shows the sample card as one named picture with the always-on caption; the watermark is no text node', () => {
    const { container } = renderWithIntl(<RoutesComparison tf={tfTr} />);
    const card = screen.getByRole('img', { name: tr.sys.wp.sample.label });
    expect(card).toHaveTextContent(tr.sys.wp.sample.foreignerId);
    expect(card).toHaveTextContent(tfTr('wp.148'));
    const watermark = container.querySelector('[data-watermark]');
    expect(watermark).toHaveAttribute('data-watermark', tfTr('wp.143'));
    expect(watermark?.textContent).toBe('');
    expect(screen.getByText(tfTr('wp.160'))).toBeInTheDocument();
    expect(en.sys.wp.sample.validity).toBe(tr.sys.wp.sample.validity);
  });
});
