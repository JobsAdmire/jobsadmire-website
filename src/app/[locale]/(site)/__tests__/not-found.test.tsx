import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithIntl } from '@/test/render';

// QA W221 SYS-03: `container-site max-w-[720px]` on ONE element never narrowed anything (final
// pass D3, W178 — `.container-site` is unlayered and its own max-width wins), so the 404's 720 px
// reading column is an inner, centred wrapper like the thank-you page's; and the global reset
// zeroes paragraph margins, so the body line carries its own `mt-3`. The request scope is stubbed
// (the thank-you page test's pattern).
vi.mock('next-intl/server', () => ({
  getTranslations: async () => (key: string) => key,
}));

import LocaleNotFound from '../not-found';

describe('404 page — the 720 px column is an inner wrapper inside the container (SYS-03, D3)', () => {
  it('the container carries no max-width class; the h1 and the spaced body sit in a centred max-w-[720px] wrapper', async () => {
    renderWithIntl(await LocaleNotFound(), { locale: 'tr' });
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toHaveTextContent('notFoundTitle');
    const container = h1.closest('.container-site')!;
    expect(container).not.toBeNull();
    expect(container.className.split(/\s+/)).not.toContain('max-w-[720px]');
    const column = h1.parentElement!;
    expect(column).not.toBe(container);
    expect(column).toHaveClass('mx-auto', 'max-w-[720px]');
    expect(container).toContainElement(column);
    expect(screen.getByText('notFoundBody')).toHaveClass('mt-3', 'text-body-lg');
    expect(screen.getByRole('link', { name: 'nav.home' })).toHaveAttribute('href', '/');
  });
});
