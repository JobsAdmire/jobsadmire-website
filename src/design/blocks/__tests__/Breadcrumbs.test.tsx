import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Breadcrumbs } from '../Breadcrumbs';
import { SITE_URL } from '@/lib/seo/routes';
import tr from '@/messages/tr.json';
import { renderWithIntl } from '@/test/render';

describe('Breadcrumbs', () => {
  it('is a labelled nav whose last crumb is the current page, plus a BreadcrumbList node', () => {
    const { container } = renderWithIntl(
      <Breadcrumbs
        locale="tr"
        items={[
          { name: 'Ana sayfa', href: '/' },
          { name: 'Rehberler', href: '/blog' },
          { name: 'İzinler', href: { pathname: '/blog/[slug]', params: { slug: 'izin' } } },
        ]}
      />,
      { locale: 'tr' },
    );
    const nav = screen.getByRole('navigation', { name: tr.sys.nav.breadcrumbs });
    expect(within(nav).getByRole('link', { name: 'Ana sayfa' })).toHaveAttribute('href', '/');
    expect(within(nav).getByRole('link', { name: 'Rehberler' })).toHaveAttribute('href', '/blog');
    expect(within(nav).queryByRole('link', { name: 'İzinler' })).toBeNull();
    expect(within(nav).getByText('İzinler')).toHaveAttribute('aria-current', 'page');
    const data = JSON.parse(
      container.querySelector('script[type="application/ld+json"]')!.textContent!,
    );
    expect(data['@type']).toBe('BreadcrumbList');
    expect(data.itemListElement[0].item).toBe(`${SITE_URL}/`);
    expect(data.itemListElement[2]).toMatchObject({
      position: 3,
      name: 'İzinler',
      item: `${SITE_URL}/blog/izin`,
    });
  });

  it('uses the English slugs under /en', () => {
    renderWithIntl(
      <Breadcrumbs
        locale="en"
        items={[
          { name: 'Home', href: '/' },
          { name: 'Hire workers', href: '/hire-workers' },
        ]}
      />,
      { locale: 'en' },
    );
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/en');
  });
});
