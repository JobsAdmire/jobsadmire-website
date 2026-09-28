import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Header } from '../Header';
import { buttonClassName } from '@/design/primitives/Button';
import { collisionsInTree } from '@/test/class-collisions';
import { renderWithIntl } from '@/test/render';
import trBundle from '@/content/local/bundle.tr.json';
import { BundleSchema, type Bundle } from '../../../../contract/website-bundle.v1';

// W17: next-intl's `usePathname()` reads next/navigation's, which is `null` outside the App
// Router. Steering it with the *external* path walks the CTA table page by page (next-intl
// maps `/iletisim` back to the internal `/contact` key). `next-intl` is inlined by
// vitest.config.mts, so its own import of next/navigation sees this mock too.
const nav = vi.hoisted(() => ({ pathname: null as string | null }));
vi.mock('next/navigation', async (importOriginal) => ({
  ...(await importOriginal<typeof import('next/navigation')>()),
  usePathname: () => nav.pathname,
}));

// R13: a parsed bundle, never a cast. The real generated TR bundle, whole: since T0b the nav
// groups differ from the golden fixture's single `desktopNav` group.
const bundle: Bundle = BundleSchema.parse(trBundle);
const t = (id: string) => bundle.strings[id] ?? '';

// what the hamburger must list: its own group (T0b: desktopNav + the portal login), minus the
// blog while under the threshold (W4)
const hamburger = bundle.nav.filter((n) => n.group === 'hamburger' && !n.href.startsWith('/blog'));

/** No group carries an external row since W88 (the portal login is the internal
 *  /portal-login chooser), but the desktop row and the panel still have to honour one — an
 *  OPS bundle may send it. The store link stands in, added to both lists. */
const STORE = bundle.settings.storeLinks.android!;
const externalRow = (group: 'desktopNav' | 'hamburger'): Bundle['nav'][number] => ({
  group,
  order: 99,
  labelId: 'hire.240',
  href: STORE,
  external: true,
  visibleOn: ['desktop', 'mobile'],
});
const withExternalItem: Bundle = {
  ...bundle,
  nav: [...bundle.nav, externalRow('desktopNav'), externalRow('hamburger')],
};

beforeEach(() => {
  nav.pathname = null;
});

describe('Header', () => {
  it('renders the desktop nav from the desktopNav group with localized hrefs, never /blog', () => {
    renderWithIntl(<Header locale="tr" bundle={bundle} />);
    const row = screen.getByRole('navigation', { name: 'Ana menü' });
    expect(within(row).getAllByRole('link').length).toBeGreaterThanOrEqual(7);
    expect(within(row).getByRole('link', { name: t('home.002') })).toHaveAttribute(
      'href',
      '/isci-talebi',
    );
    expect(within(row).getByRole('link', { name: t('home.005') })).toHaveAttribute(
      'href',
      '/maliyet-hesaplayici',
    );
    expect(row.querySelector('a[href="/blog"]')).toBeNull();
    // the four promoted routes leave the row (slim bar / secondary CTA) but stay in the panel
    expect(within(row).queryByRole('link', { name: t('home.011') })).toBeNull();
    expect(within(row).queryByRole('link', { name: t('home.008') })).toBeNull();
  });

  it('labels the hamburger and reports the panel state on it', async () => {
    renderWithIntl(<Header locale="tr" bundle={bundle} />);
    const toggle = screen.getByRole('button', { name: t('hire.239') });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    const panelId = toggle.getAttribute('aria-controls')!;
    expect(document.getElementById(panelId)).not.toBeVisible();
    expect(screen.queryByRole('navigation', { name: t('hire.239') })).toBeNull();

    await userEvent.click(toggle);
    const opened = screen.getByRole('button', { name: 'Kapat' });
    expect(opened).toHaveAttribute('aria-expanded', 'true');
    const panel = document.getElementById(panelId)!;
    expect(panel).toBeVisible();
    // the panel keeps every `hamburger` entry, including the four the desktop row promotes
    const menu = within(panel).getByRole('navigation', { name: t('hire.239') });
    expect(within(menu).getAllByRole('link')).toHaveLength(hamburger.length);
    expect(within(menu).getByRole('link', { name: t('home.011') })).toHaveAttribute(
      'href',
      '/temsilci-dogrulama',
    );
    expect(menu.querySelector('a[href="/blog"]')).toBeNull();

    await userEvent.click(opened);
    expect(screen.getByRole('button', { name: t('hire.239') })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });

  it('renders an external nav entry as a new-tab anchor in both rows', async () => {
    renderWithIntl(<Header locale="tr" bundle={withExternalItem} />);
    const inRow = within(screen.getByRole('navigation', { name: 'Ana menü' })).getByRole('link', {
      name: t('hire.240'),
    });
    expect(inRow).toHaveAttribute('href', STORE);
    expect(inRow).toHaveAttribute('target', '_blank');
    expect(inRow).toHaveAttribute('rel', 'noopener noreferrer');

    await userEvent.click(screen.getByRole('button', { name: t('hire.239') }));
    const menu = within(screen.getByRole('navigation', { name: t('hire.239') }));
    const inPanel = menu.getByRole('link', { name: t('hire.240') });
    expect(inPanel).toHaveAttribute('href', STORE);
    expect(inPanel).toHaveAttribute('target', '_blank');
    expect(inPanel).toHaveAttribute('rel', 'noopener noreferrer');
    // T0b's own portal row — exactly one in the panel (W36), internal since W88: the chooser
    // page links out to the portal host, the chrome never does
    const portal = menu.getByRole('link', { name: t('home.012') });
    expect(portal).toHaveAttribute('href', '/portal-girisi');
    expect(portal).not.toHaveAttribute('target');
  });

  it('renders the default split primary CTA and the partner secondary CTA off the table', () => {
    renderWithIntl(<Header locale="tr" bundle={bundle} />);
    const banner = screen.getByRole('banner');
    expect(
      within(banner).getByRole('link', { name: `${t('home.014')} ${t('home.015')}` }),
    ).toHaveAttribute('href', '/isci-talebi#request-form');
    expect(within(banner).getByRole('link', { name: t('home.008') })).toHaveAttribute(
      'href',
      '/ortak-olun',
    );
  });

  it('swaps both CTAs per page from CTA_BY_PATHNAME through the internal pathname (W17)', () => {
    nav.pathname = '/iletisim';
    const { unmount } = renderWithIntl(<Header locale="tr" bundle={bundle} />);
    let banner = screen.getByRole('banner');
    expect(
      within(banner).getByRole('link', { name: `${t('contact.015')} ${t('contact.016')}` }),
    ).toHaveAttribute('href', '/iletisim#message');
    // the secondary CTA is home.002 → /hire-workers; the desktop row's first entry carries the
    // same canonical label (R15), so the CTA is the one outside the nav
    const row = within(banner).getByRole('navigation', { name: 'Ana menü' });
    const secondary = within(banner)
      .getAllByRole('link', { name: t('home.002') })
      .filter((a) => !row.contains(a));
    expect(secondary).toHaveLength(1);
    expect(secondary[0]).toHaveAttribute('href', '/isci-talebi');
    expect(within(banner).queryByRole('link', { name: t('home.008') })).toBeNull();
    unmount();

    nav.pathname = '/temsilci-dogrulama';
    renderWithIntl(<Header locale="tr" bundle={bundle} />);
    banner = screen.getByRole('banner');
    const report = within(banner).getByRole('link', {
      name: `${t('verify.015')} ${t('verify.016')}`,
    });
    expect(report).toHaveAttribute('href', '/temsilci-dogrulama#report');
    expect(report.className).toContain('bg-danger');
  });

  // W122/W155: Tailwind orders rules by variant, property and name, never by class-string
  // position, so a caller class appended onto a variant that sets the same property loses or
  // wins by alphabetical accident — the header CTA's `hover:bg-blue-safe` lost to the primary
  // variant's `hover:bg-ink` and the designed blue hover never rendered. The CTA is now the
  // `nav` variant (ink at rest, blue-safe on hover) with no colour classes appended.
  it('no element sets one property twice at one variant; the primary CTA is the nav face (W155)', async () => {
    const { container, unmount } = renderWithIntl(<Header locale="tr" bundle={bundle} />);
    await userEvent.click(screen.getByRole('button', { name: t('hire.239') }));
    expect(collisionsInTree(container)).toEqual([]);
    const cta = within(screen.getByRole('banner')).getByRole('link', {
      name: `${t('home.014')} ${t('home.015')}`,
    });
    expect(cta).toHaveClass('bg-ink', 'text-white', 'hover:bg-blue-safe', 'whitespace-nowrap');
    expect(cta).not.toHaveClass('bg-blue-safe');
    expect(cta).not.toHaveClass('hover:bg-ink');
    expect(cta.className).toBe(buttonClassName('nav', 'md', 'whitespace-nowrap'));
    unmount();

    // the danger face (the verify page's "Report an Impostor") stays collision-free too
    nav.pathname = '/temsilci-dogrulama';
    const { container: verify } = renderWithIntl(<Header locale="tr" bundle={bundle} />);
    expect(collisionsInTree(verify)).toEqual([]);
  });

  it('offers the other language with aria-current on the active one', () => {
    renderWithIntl(<Header locale="tr" bundle={bundle} />);
    const banner = screen.getByRole('banner');
    expect(within(banner).getByRole('link', { name: 'Türkçe' })).toHaveAttribute(
      'aria-current',
      'true',
    );
    expect(within(banner).getByRole('link', { name: 'English' })).not.toHaveAttribute(
      'aria-current',
    );
  });
});
