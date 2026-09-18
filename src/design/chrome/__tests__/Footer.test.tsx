import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Footer } from '../Footer';
import { renderWithIntl } from '@/test/render';
import trBundle from '@/content/local/bundle.tr.json';
import fixture from '../../../../contract/website-bundle.v1.fixture.json';
import { BundleSchema } from '../../../../contract/website-bundle.v1';

const bundle = BundleSchema.parse({ ...fixture, strings: trBundle.strings });

const t = (id: string) => trBundle.strings[id as keyof typeof trBundle.strings];

describe('Footer', () => {
  it('renders the four column headings', () => {
    renderWithIntl(<Footer locale="tr" bundle={bundle} />);
    for (const id of ['home.189', 'home.190', 'home.191', 'home.194']) {
      expect(screen.getByRole('heading', { name: t(id) })).toBeInTheDocument();
    }
  });

  it('carries the licence number in the legal line', () => {
    renderWithIntl(<Footer locale="tr" bundle={bundle} />);
    expect(screen.getByRole('contentinfo')).toHaveTextContent(bundle.settings.licence.permitNo);
    expect(screen.getByText(t('home.228'))).toBeInTheDocument();
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
    expect(
      within(footer).getByRole('link', { name: bundle.settings.phoneDisplay }),
    ).toHaveAttribute('href', `tel:${bundle.settings.phone}`);
    expect(within(footer).getByRole('link', { name: bundle.settings.email })).toHaveAttribute(
      'href',
      `mailto:${bundle.settings.email}`,
    );
    expect(within(footer).getByRole('heading', { name: t('home.196') })).toBeInTheDocument();
    expect(within(footer).getByRole('heading', { name: t('home.197') })).toBeInTheDocument();
    expect(within(footer).getAllByRole('link', { name: t('home.192') })).toHaveLength(2);
  });

  it('shows the Android store link and no App Store link while storeLinks.ios is null', () => {
    renderWithIntl(<Footer locale="tr" bundle={bundle} />);
    const footer = screen.getByRole('contentinfo');
    expect(bundle.settings.storeLinks.ios).toBeNull();
    expect(within(footer).getByRole('link', { name: t('hire.240') })).toHaveAttribute(
      'href',
      bundle.settings.storeLinks.android,
    );
    expect(within(footer).queryByRole('link', { name: t('hire.241') })).toBeNull();
  });
});
