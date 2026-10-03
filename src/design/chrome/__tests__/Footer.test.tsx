import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { Footer } from '../Footer';
import { getOffice } from '@/content/collections';
import { BRAND } from '@/design/assets/brand';
import { collisionsInTree } from '@/test/class-collisions';
import { renderWithIntl } from '@/test/render';
import trBundle from '@/content/local/bundle.tr.json';
import tr from '@/messages/tr.json';
import { BundleSchema, type Bundle } from '../../../../contract/website-bundle.v1';

// R13: a parsed bundle, never a cast. The real generated TR bundle, whole: since T0b the nav
// groups differ from the golden fixture's single `desktopNav` group, and `blogNavVisible`
// reads the 22 blog rows.
const bundle: Bundle = BundleSchema.parse(trBundle);
const t = (id: string) => bundle.strings[id] ?? '';
const rx = (s: string) => new RegExp(s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
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

  it('carries the licence number and the four legal links in the legal row (home.218/219 + sys.legal.*.title, LEGAL-04)', () => {
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
    // QA W221 LEGAL-04: the KVKK notice and the Cookie Policy were orphan pages — the consent
    // checkboxes name them and the sitemap lists them, but nothing linked them while the consent
    // banner is unmounted (gtmId null). Their labels are the pages' own sys titles (no package id).
    expect(within(legal).getByRole('link', { name: tr.sys.legal.kvkk.title })).toHaveAttribute(
      'href',
      '/kvkk',
    );
    expect(
      within(legal).getByRole('link', { name: tr.sys.legal.cookiePolicy.title }),
    ).toHaveAttribute('href', '/cerez-politikasi');
    expect(within(legal).getAllByRole('link')).toHaveLength(4);
    expect(legal).toHaveClass('flex-wrap');
  });

  // QA W221 H-04: the design's legal row ends with `<span>© 2026 Jobs Admire</span>` (Homepage v4
  // l. 1222); the package carries the line as partner.214 (brand one word since W221) — the
  // chrome's canonical id for it, beside the legal nav in the right-hand group.
  it('prints the © line from partner.214 beside the legal links (H-04)', () => {
    renderWithIntl(<Footer locale="tr" bundle={bundle} />);
    const legalRow = screen.getByRole('contentinfo').children[1] as HTMLElement;
    const copyright = within(legalRow).getByText(t('partner.214'));
    expect(copyright.tagName).toBe('SPAN');
    expect(copyright).toHaveClass('text-white/50');
    expect(copyright.parentElement).toContainElement(
      screen.getByRole('navigation', { name: tr.sys.nav.legal }),
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
      ['LinkedIn', bundle.settings.social.linkedin],
      ['Facebook', bundle.settings.social.facebook],
      [
        'WhatsApp',
        `https://wa.me/${bundle.settings.whatsappNumber}?text=Merhaba%20JobsAdmire%2C%20`,
      ],
    ];
    for (const [name, href] of expected) {
      expect(within(footer).getByRole('link', { name })).toHaveAttribute('href', href);
    }
    // W226: the owner's channels only — no Telegram, no TikTok anywhere in the footer.
    expect(footer.querySelector(`a[href="${bundle.settings.telegramUrl}"]`)).toBeNull();
    expect(footer.querySelector(`a[href="${bundle.settings.social.tiktok}"]`)).toBeNull();
    expect(within(footer).queryByRole('link', { name: 'Telegram' })).toBeNull();
    expect(within(footer).queryByRole('link', { name: 'TikTok' })).toBeNull();
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

  // QA W220 H-01: the design's footer prints each office's two address lines under its label
  // (Homepage v4 ll. 1170/1176) — the offices row's own ids (contact.133/134, contact.105/103, W34),
  // the same ones OfficeCard and the Organization JSON-LD read. Grid + collapsed accordion: two
  // text nodes per line in the DOM.
  it('prints both offices’ two address lines from the offices collection (H-01)', () => {
    renderWithIntl(<Footer locale="tr" bundle={bundle} />);
    const footer = screen.getByRole('contentinfo');
    for (const key of ['antalya', 'karachi'] as const) {
      const row = getOffice(bundle, key);
      // the span's own text nodes join across the `<br />`, so a regex, not an exact match
      expect(within(footer).getAllByText(rx(t(row.addressId)))).toHaveLength(2);
      expect(within(footer).getAllByText(rx(t(row.addressLine2Id)))).toHaveLength(2);
      // the address sits between the office label and its hours, like the design's column
      const label = within(footer).getByRole('heading', { name: t(row.footerLabelId) });
      const address = label.nextElementSibling!;
      expect(address).toHaveTextContent(t(row.addressId));
      expect(address).toHaveTextContent(t(row.addressLine2Id));
      expect(address).toHaveClass('text-white/60');
    }
  });

  // QA W220 H-02: the design's dark switcher shell is `width: fit-content` (Homepage v4 l. 1126);
  // without it the bordered pill fills the single-column footer below lg.
  it('keeps the language switcher shell at its content width (H-02)', () => {
    renderWithIntl(<Footer locale="tr" bundle={bundle} />);
    expect(screen.getByRole('group', { name: t('home.016') })).toHaveClass('flex', 'w-fit');
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

  // W122/W155: STORE used to append `text-white` onto FLINK's `text-white/60`; Tailwind's
  // alphabetical order made white/60 win, so the store badges never rendered white. FLINK and
  // STORE now share a colourless base and each carries its own colour pair.
  it('no element sets one property twice at one variant; the store badges are white (W155)', async () => {
    const { container } = renderWithIntl(<Footer locale="tr" bundle={bundle} />);
    // open every accordion panel so the mobile copies of the links are in the sweep too
    for (const id of COLUMNS) await userEvent.click(screen.getByRole('button', { name: t(id) }));
    expect(collisionsInTree(container)).toEqual([]);
    const badges = within(screen.getByRole('contentinfo')).getAllByRole('link', {
      name: t('hire.240'),
    });
    expect(badges.length).toBeGreaterThan(0);
    for (const badge of badges) {
      expect(badge).toHaveClass('text-white', 'hover:text-sky');
      expect(badge).not.toHaveClass('text-white/60');
    }
  });

  // W180: unlike the slim bar and the header, the design's footer content sits in the same
  // `max-width:1280px` wrapper as every section — the 960 px content box from 1101 px.
  it('keeps both footer rows in the content container (W180)', () => {
    renderWithIntl(<Footer locale="tr" bundle={bundle} />);
    const rows = [...screen.getByRole('contentinfo').children];
    expect(rows).toHaveLength(2);
    for (const row of rows) expect(row).toHaveClass('container-site');
  });

  // Final pass A6 (T1b M7): the design's legal-row divider spans the whole content box, gutters
  // included — so the border sits on an inner div inside the container row, never on the
  // container itself (whose padding would otherwise leave the line short of the gutters).
  it('draws the legal-row divider on an inner div inside the container (A6)', () => {
    renderWithIntl(<Footer locale="tr" bundle={bundle} />);
    const legalRow = screen.getByRole('contentinfo').children[1] as HTMLElement;
    expect(legalRow).toHaveClass('container-site');
    expect(legalRow).not.toHaveClass('border-t', 'py-5');
    const inner = legalRow.firstElementChild as HTMLElement;
    expect(inner).toHaveClass('border-t', 'border-white/15', 'py-5', 'flex');
    expect(inner).toContainElement(screen.getByRole('navigation', { name: tr.sys.nav.legal }));
  });

  // W183: the design's footer shows the full logo too, white through its own
  // `filter: brightness(0) invert(1)` (opacity .95), 50 px tall — 37.5 px from 1101 (D19) —
  // never the mark. Decorative: the header's logo already names the site.
  it('renders the full wordmark in white at the design heights, never the mark (W183)', () => {
    const { container } = renderWithIntl(<Footer locale="tr" bundle={bundle} />);
    const logo = container.querySelector('footer img')!;
    expect(decodeURIComponent(logo.getAttribute('src')!)).toContain(BRAND.logo.src);
    expect(logo).toHaveAttribute('alt', '');
    expect(logo).toHaveAttribute('width', '254');
    expect(logo).toHaveAttribute('height', '50');
    expect(logo).toHaveClass(
      'brightness-0',
      'invert',
      'opacity-95',
      'h-[50px]',
      'xl:h-[37.5px]',
      'object-contain',
      'xl:max-w-none',
    );
    expect(container.querySelector('footer img[src*="ja-mark"]')).toBeNull();
  });

  // W180 follow-through (D19): inside the 960 px box the design's footer still sets its five
  // columns in one row from 1101 — its `minmax(200px, 1fr)` and `gap: 40px 36px` × 0.75; at 200 px
  // the fifth column wrapped onto a second row.
  it('scales the column grid from 1101 so the five columns fit the 960 px box (W180, D19)', () => {
    const { container } = renderWithIntl(<Footer locale="tr" bundle={bundle} />);
    expect(container.querySelector('footer > div')).toHaveClass(
      'lg:grid-cols-[repeat(auto-fit,minmax(200px,1fr))]',
      'xl:grid-cols-[repeat(auto-fit,minmax(150px,1fr))]',
      'xl:gap-x-[27px]',
      'xl:gap-y-[30px]',
    );
  });

  it('shows both store links (W227: the App Store link exists)', () => {
    renderWithIntl(<Footer locale="tr" bundle={bundle} />);
    const footer = screen.getByRole('contentinfo');
    expect(bundle.settings.storeLinks.ios).not.toBeNull();
    for (const link of within(footer).getAllByRole('link', { name: t('hire.240') })) {
      expect(link).toHaveAttribute('href', bundle.settings.storeLinks.android);
    }
    const ios = within(footer).getAllByRole('link', { name: t('hire.241') });
    expect(ios.length).toBeGreaterThan(0);
    for (const link of ios) expect(link).toHaveAttribute('href', bundle.settings.storeLinks.ios);
  });
});
