import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithIntl } from '@/test/render';
import { LegalDocument, type LegalDocumentProps } from '../LegalDocument';

const base: LegalDocumentProps = {
  locale: 'en',
  href: '/privacy',
  homeLabel: 'Home',
  title: 'Privacy Policy',
  intro: 'How JobsAdmire processes personal data.',
  updatedAt: '2026-09-29',
  updatedLabel: 'Last updated',
  contentsLabel: 'Contents',
  sections: [
    {
      id: 'scope',
      title: 'Scope',
      body: 'JobsAdmire processes data when you:\n\n- **browse** this website\n- apply for jobs',
    },
    { id: 'contact', title: 'Contact', body: 'E-mail info@jobsadmire.com.' },
  ],
};

describe('LegalDocument (T13)', () => {
  it('renders one h1 as the LCP slot, a dated line, and a contents list that matches the numbered sections', () => {
    const { container } = renderWithIntl(<LegalDocument {...base} />, { locale: 'en' });
    const h1 = screen.getByRole('heading', { level: 1, name: 'Privacy Policy' });
    expect(h1).toHaveAttribute('data-testid', 'page-h1');
    expect(h1).toHaveAttribute('data-lcp-slot', 'h1');
    expect(container.querySelectorAll('[data-lcp-slot]')).toHaveLength(1);
    const time = screen.getByTestId('legal-updated').querySelector('time');
    expect(time).toHaveAttribute('datetime', '2026-09-29');
    expect(time).toHaveTextContent('29 September 2026');
    const toc = screen.getByRole('navigation', { name: 'Contents' });
    expect(
      within(toc)
        .getAllByRole('link')
        .map((a) => a.getAttribute('href')),
    ).toEqual(['#scope', '#contact']);
    expect(screen.getByRole('heading', { level: 2, name: '1. Scope' })).toBeInTheDocument();
    expect(container.querySelector('#contact')).toHaveAttribute('data-legal-section');
    const list = container.querySelector('#scope ul');
    expect(list?.querySelectorAll('li')).toHaveLength(2);
    expect(list?.querySelector('strong')).toHaveTextContent('browse');
    // the page's one Breadcrumbs block → one BreadcrumbList node
    expect(container.querySelectorAll('script[type="application/ld+json"]')).toHaveLength(1);
    // W109/W176: the trail is the Home label (the package string) then the page's own title
    const trail = screen.getByRole('navigation', { name: 'Breadcrumb' });
    expect(within(trail).getByRole('link', { name: 'Home' })).toBeInTheDocument();
    expect(within(trail).getByText('Privacy Policy')).toHaveAttribute('aria-current', 'page');
    expect(container.querySelector('[data-placeholder]')).toBeNull();
  });

  it('a notice is a named placeholder; an English body on a Turkish page carries lang="en"', () => {
    const { container } = renderWithIntl(
      <LegalDocument
        {...base}
        locale="tr"
        homeLabel="Ana Sayfa"
        updatedLabel="Son güncelleme"
        contentsLabel="İçindekiler"
        bodyLang="en"
        notice={{
          testId: 'legal-notice',
          placeholder: 'legal-terms-tr',
          body: 'Metin şimdilik İngilizcedir.',
        }}
      />,
      { locale: 'tr' },
    );
    const notice = screen.getByTestId('legal-notice');
    expect(notice).toHaveAttribute('role', 'note');
    expect(notice).toHaveAttribute('data-placeholder', 'legal-terms-tr');
    expect(notice).not.toHaveAttribute('data-lcp-slot');
    expect(screen.getByTestId('legal-body')).toHaveAttribute('lang', 'en');
    expect(screen.getByTestId('legal-intro')).toHaveAttribute('lang', 'en');
    expect(screen.getByTestId('legal-updated').querySelector('time')).toHaveTextContent(
      '29 Eylül 2026',
    );
    expect(container.querySelectorAll('[data-lcp-slot]')).toHaveLength(1);
    // W176: the Turkish Home crumb is the package's "Ana Sayfa" (capital S), as on every page
    const trail = screen.getByRole('navigation', { name: 'Sayfa yolu' });
    expect(within(trail).getByRole('link', { name: 'Ana Sayfa' })).toBeInTheDocument();
  });

  it('renders no contents list when there are no sections (the KVKK placeholder)', () => {
    const { container } = renderWithIntl(<LegalDocument {...base} sections={[]} />, {
      locale: 'en',
    });
    expect(screen.queryByRole('navigation', { name: 'Contents' })).toBeNull();
    expect(container.querySelectorAll('[data-legal-section]')).toHaveLength(0);
  });
});
