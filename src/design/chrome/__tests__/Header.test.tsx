import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Header } from '../Header';
import { renderWithIntl } from '@/test/render';
import trBundle from '@/content/local/bundle.tr.json';
import fixture from '../../../../contract/website-bundle.v1.fixture.json';
import { BundleSchema } from '../../../../contract/website-bundle.v1';

// R13: a parsed bundle, never a cast. The golden fixture carries 20 ids while chrome reads
// the whole chrome catalogue, so the strings come from the real TR bundle — its `nav` and
// `settings` are byte-identical to the fixture's.
const bundle = BundleSchema.parse({ ...fixture, strings: trBundle.strings });

const t = (id: string) => trBundle.strings[id as keyof typeof trBundle.strings];

const desktopNav = bundle.nav.filter((n) => n.group === 'desktopNav');

/** The importer fills no external entry today; the chrome still has to honour one. */
const withExternalItem = BundleSchema.parse({
  ...fixture,
  strings: trBundle.strings,
  nav: [
    ...fixture.nav,
    {
      group: 'desktopNav',
      order: 11,
      labelId: 'home.012',
      href: 'https://portal.jobsadmire.com/auth/login',
      external: true,
      visibleOn: ['desktop', 'mobile'],
    },
  ],
});

describe('Header', () => {
  it('renders the desktop nav from bundle.nav with localized hrefs', () => {
    renderWithIntl(<Header locale="tr" bundle={bundle} primaryCta={{ href: '/hire-workers' }} />);
    const nav = screen.getByRole('navigation', { name: 'Ana menü' });
    expect(within(nav).getAllByRole('link').length).toBeGreaterThanOrEqual(7);
    expect(within(nav).getByRole('link', { name: t('home.002') })).toHaveAttribute(
      'href',
      '/isci-talebi',
    );
    expect(within(nav).getByRole('link', { name: t('home.005') })).toHaveAttribute(
      'href',
      '/maliyet-hesaplayici',
    );
  });

  it('labels the hamburger and reports the panel state on it', async () => {
    renderWithIntl(<Header locale="tr" bundle={bundle} primaryCta={{ href: '/hire-workers' }} />);
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
    // the panel keeps every nav item, including the four the desktop row promotes elsewhere
    const menu = within(panel).getByRole('navigation', { name: t('hire.239') });
    expect(within(menu).getAllByRole('link')).toHaveLength(desktopNav.length);
    expect(within(menu).getByRole('link', { name: t('home.011') })).toHaveAttribute(
      'href',
      '/temsilci-dogrulama',
    );

    await userEvent.click(opened);
    expect(screen.getByRole('button', { name: t('hire.239') })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });

  it('renders an external nav entry as a new-tab anchor in both rows', async () => {
    renderWithIntl(
      <Header locale="tr" bundle={withExternalItem} primaryCta={{ href: '/hire-workers' }} />,
    );
    const inRow = within(screen.getByRole('navigation', { name: 'Ana menü' })).getByRole('link', {
      name: t('home.012'),
    });
    expect(inRow).toHaveAttribute('href', 'https://portal.jobsadmire.com/auth/login');
    expect(inRow).toHaveAttribute('target', '_blank');
    expect(inRow).toHaveAttribute('rel', 'noopener noreferrer');

    await userEvent.click(screen.getByRole('button', { name: t('hire.239') }));
    const inPanel = within(screen.getByRole('navigation', { name: t('hire.239') })).getByRole(
      'link',
      { name: t('home.012') },
    );
    expect(inPanel).toHaveAttribute('target', '_blank');
    expect(inPanel).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders the split primary CTA and the partner secondary CTA', () => {
    renderWithIntl(<Header locale="tr" bundle={bundle} primaryCta={{ href: '/hire-workers' }} />);
    const banner = screen.getByRole('banner');
    expect(
      within(banner).getByRole('link', { name: `${t('home.014')} ${t('home.015')}` }),
    ).toHaveAttribute('href', '/isci-talebi');
    expect(within(banner).getByRole('link', { name: t('home.008') })).toHaveAttribute(
      'href',
      '/ortak-olun',
    );
  });

  it('offers the other language with aria-current on the active one', () => {
    renderWithIntl(<Header locale="tr" bundle={bundle} primaryCta={{ href: '/hire-workers' }} />);
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
