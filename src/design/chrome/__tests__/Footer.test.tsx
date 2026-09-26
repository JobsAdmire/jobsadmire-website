import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { Footer } from '../Footer';
import { renderWithIntl } from '@/test/render';
import trBundle from '@/content/local/bundle.tr.json';
import tr from '@/messages/tr.json';
import { BundleSchema, type Bundle } from '../../../../contract/website-bundle.v1';

// R13: a parsed bundle, never a cast. The real generated TR bundle, whole: since T0b the nav
// groups differ from the golden fixture's single `desktopNav` group, and `blogNavVisible`
// reads the 22 blog rows.
const bundle: Bundle = BundleSchema.parse(trBundle);
const t = (id: string) => bundle.strings[id] ?? '';
type Entry = Record<string, unknown>;

// Each column is rendered twice — once in the `lg+` grid, once in the mobile accordion — and
// jsdom applies no CSS, so both copies are in the tree. Only the accordion's own headers are
// exposed while it is collapsed: its panels carry `hidden`, which role queries skip — so a
// link query sees ONE anchor per entry until a panel is opened (W52).
const COLUMNS = ['home.189', 'home.190', 'home.191', 'home.194'];

beforeEach(() => {
  (window as unknown as { dataLayer: Entry[] }).dataLayer = [];
});

describe('Footer', () => {
  it('renders the four column headings in both the grid and the accordion', () => {
    renderWithIntl(<Footer locale="tr" bundle={bundle} />);
    for (const id of COLUMNS) {
      expect(screen.getAllByRole('heading', { name: t(id) })).toHaveLength(2);
    }
  });

  it('collapses the columns into real accordion buttons for mobile', async () => {
    renderWithIntl(<Footer locale="tr" bundle={bundle} />);
    const first = screen.getByRole('button', { name: t('home.189') });
    expect(first).toHaveAttribute('aria-expanded', 'false');
    const panel = document.getElementById(first.getAttribute('aria-controls')!)!;
    expect(panel).not.toBeVisible();

    await userEvent.click(first);
    expect(screen.getByRole('button', { name: t('home.189') })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    expect(panel).toBeVisible();
    expect(within(panel).getByRole('link', { name: t('home.002') })).toHaveAttribute(
      'href',
      '/isci-talebi',
    );
    // several columns open at once: a footer is a directory, not a wizard
    await userEvent.click(screen.getByRole('button', { name: t('home.190') }));
    expect(screen.getByRole('button', { name: t('home.189') })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('fills the two link columns from the footerEmployers/footerCompany groups, never /blog (W4)', async () => {
    renderWithIntl(<Footer locale="tr" bundle={bundle} />);
    const footer = screen.getByRole('contentinfo');
    const rows = (group: Bundle['nav'][number]['group']) =>
      bundle.nav.filter((n) => n.group === group).sort((a, b) => a.order - b.order);
    expect(rows('footerEmployers').length).toBeGreaterThanOrEqual(5);
    expect(rows('footerCompany').length).toBeGreaterThanOrEqual(5);
    // one anchor per entry while the accordion is collapsed (W52) …
    expect(within(footer).getAllByRole('link', { name: t('home.001') })).toHaveLength(1);
    expect(within(footer).getByRole('link', { name: t('home.001') })).toHaveAttribute(
      'href',
      '/hakkimizda',
    );
    expect(within(footer).getByRole('link', { name: t('home.005') })).toHaveAttribute(
      'href',
      '/maliyet-hesaplayici',
    );
    // … and two once the company panel is open (grid + accordion copy of the same body)
    await userEvent.click(screen.getByRole('button', { name: t('home.190') }));
    expect(within(footer).getAllByRole('link', { name: t('home.001') })).toHaveLength(2);
    expect(footer.querySelectorAll('a[href="/blog"]')).toHaveLength(0);
    expect(footer.querySelectorAll('a[href^="/blog/"]')).toHaveLength(0);
  });

  it('carries the licence number and the Privacy/Terms links in the legal row (home.218/219)', () => {
    renderWithIntl(<Footer locale="tr" bundle={bundle} />);
    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveTextContent(bundle.settings.licence.permitNo);
    expect(screen.getByText(t('home.228'))).toBeInTheDocument();
    const legal = within(footer).getByRole('navigation', { name: tr.sys.nav.legal });
    expect(within(legal).getByRole('link', { name: t('home.218') })).toHaveAttribute(
      'href',
      '/gizlilik',
    );
    expect(within(legal).getByRole('link', { name: t('home.219') })).toHaveAttribute(
      'href',
      '/kullanim-kosullari',
    );
  });

  it('offers the cookie-preferences door in the legal row once a container id exists (R36)', () => {
    const withGtm: Bundle = {
      ...bundle,
      settings: {
        ...bundle.settings,
        analytics: { ...bundle.settings.analytics, gtmId: 'GTM-TEST123' },
      },
    };
    renderWithIntl(<Footer locale="tr" bundle={withGtm} />);
    const button = within(screen.getByRole('contentinfo')).getByRole('button', {
      name: tr.sys.consent.manage,
    });
    expect(button).toHaveAttribute('type', 'button');
  });

  it('hides it while no tag can fire, exactly like the banner (R40)', () => {
    expect(bundle.settings.analytics.gtmId).toBeNull();
    renderWithIntl(<Footer locale="tr" bundle={bundle} />);
    expect(
      within(screen.getByRole('contentinfo')).queryByRole('button', {
        name: tr.sys.consent.manage,
      }),
    ).toBeNull();
  });

  it('gives every social and contact link an accessible name', () => {
    renderWithIntl(<Footer locale="tr" bundle={bundle} />);
    const footer = screen.getByRole('contentinfo');
    const expected: Array<[string, string]> = [
      ['Instagram', bundle.settings.social.instagram],
      ['TikTok', bundle.settings.social.tiktok],
      ['LinkedIn', bundle.settings.social.linkedin],
      ['Facebook', bundle.settings.social.facebook],
      [
        'WhatsApp',
        `https://wa.me/${bundle.settings.whatsappNumber}?text=Merhaba%20JobsAdmire%2C%20`,
      ],
      ['Telegram', bundle.settings.telegramUrl],
    ];
    for (const [name, href] of expected) {
      expect(within(footer).getByRole('link', { name })).toHaveAttribute('href', href);
    }
  });

  it('links the phone, e-mail and both offices', () => {
    renderWithIntl(<Footer locale="tr" bundle={bundle} />);
    const footer = screen.getByRole('contentinfo');
    for (const phone of within(footer).getAllByRole('link', {
      name: bundle.settings.phoneDisplay,
    })) {
      expect(phone).toHaveAttribute('href', `tel:${bundle.settings.phone}`);
    }
    for (const mail of within(footer).getAllByRole('link', { name: bundle.settings.email })) {
      expect(mail).toHaveAttribute('href', `mailto:${bundle.settings.email}`);
    }
    expect(within(footer).getByRole('heading', { name: t('home.196') })).toBeInTheDocument();
    expect(within(footer).getByRole('heading', { name: t('home.197') })).toBeInTheDocument();
    expect(within(footer).getAllByRole('link', { name: t('home.192') })).toHaveLength(2);
  });

  it('fires whatsapp_click / call_click with placement footer (W12)', async () => {
    renderWithIntl(<Footer locale="tr" bundle={bundle} />);
    const footer = screen.getByRole('contentinfo');
    const wa = within(footer).getByRole('link', { name: t('home.193') });
    const phone = within(footer).getByRole('link', { name: bundle.settings.phoneDisplay });
    const tile = within(footer).getByRole('link', { name: 'WhatsApp' });
    const instagram = within(footer).getByRole('link', { name: 'Instagram' });
    for (const a of [wa, phone, tile, instagram]) {
      a.addEventListener('click', (e) => e.preventDefault());
    }
    await userEvent.click(wa);
    await userEvent.click(phone);
    await userEvent.click(tile);
    await userEvent.click(instagram);
    expect((window as unknown as { dataLayer: Entry[] }).dataLayer).toEqual([
      { event: 'whatsapp_click', page: '/', locale: 'tr', placement: 'footer' },
      { event: 'call_click', page: '/', locale: 'tr', placement: 'footer' },
      { event: 'whatsapp_click', page: '/', locale: 'tr', placement: 'footer' },
    ]);
  });

  it('links the portal chooser page from the employers column — the group row, once (W36, W88)', () => {
    renderWithIntl(<Footer locale="tr" bundle={bundle} />);
    const footer = screen.getByRole('contentinfo');
    const links = within(footer).getAllByRole('link', { name: t('home.012') });
    expect(links).toHaveLength(1);
    // W88: an internal row — /portal-girisi is the chooser that links out to the portal host
    expect(links[0]).toHaveAttribute('href', '/portal-girisi');
    expect(links[0]).not.toHaveAttribute('target');
    // grid + collapsed accordion: two anchors in the DOM, still no hard-coded third
    expect(footer.querySelectorAll('a[href="/portal-girisi"]')).toHaveLength(2);
    expect(footer.querySelector(`a[href^="${bundle.settings.portal.host}"]`)).toBeNull();
  });

  it('shows the Android store link and no App Store link while storeLinks.ios is null', () => {
    renderWithIntl(<Footer locale="tr" bundle={bundle} />);
    const footer = screen.getByRole('contentinfo');
    expect(bundle.settings.storeLinks.ios).toBeNull();
    for (const link of within(footer).getAllByRole('link', { name: t('hire.240') })) {
      expect(link).toHaveAttribute('href', bundle.settings.storeLinks.android);
    }
    expect(within(footer).queryAllByRole('link', { name: t('hire.241') })).toHaveLength(0);
  });
});
