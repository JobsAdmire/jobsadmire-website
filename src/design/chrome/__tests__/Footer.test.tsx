import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Footer } from '../Footer';
import { renderWithIntl } from '@/test/render';
import trBundle from '@/content/local/bundle.tr.json';
import tr from '@/messages/tr.json';
import fixture from '../../../../contract/website-bundle.v1.fixture.json';
import { BundleSchema } from '../../../../contract/website-bundle.v1';

const bundle = BundleSchema.parse({ ...fixture, strings: trBundle.strings });

const t = (id: string) => trBundle.strings[id as keyof typeof trBundle.strings];

// Each column is rendered twice — once in the `lg+` grid, once in the mobile accordion — and
// jsdom applies no CSS, so both copies are in the tree. Only the accordion's own headers are
// exposed while it is collapsed: its panels carry `hidden`, which role queries skip.
const COLUMNS = ['home.189', 'home.190', 'home.191', 'home.194'];

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

  it('carries the licence number in the legal line', () => {
    renderWithIntl(<Footer locale="tr" bundle={bundle} />);
    expect(screen.getByRole('contentinfo')).toHaveTextContent(bundle.settings.licence.permitNo);
    expect(screen.getByText(t('home.228'))).toBeInTheDocument();
  });

  it('offers the cookie-preferences door in the legal row once a container id exists (R36)', () => {
    const withGtm: typeof bundle = {
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

  it('opens the portal login in a new tab from the employers column', () => {
    renderWithIntl(<Footer locale="tr" bundle={bundle} />);
    for (const link of within(screen.getByRole('contentinfo')).getAllByRole('link', {
      name: t('home.012'),
    })) {
      expect(link).toHaveAttribute(
        'href',
        `${bundle.settings.portal.host}${bundle.settings.portal.loginPath}`,
      );
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    }
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
