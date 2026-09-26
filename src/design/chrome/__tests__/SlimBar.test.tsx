import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { SlimBar } from '../SlimBar';
import { renderWithIntl } from '@/test/render';
import trBundle from '@/content/local/bundle.tr.json';
import { BundleSchema, type Bundle } from '../../../../contract/website-bundle.v1';

// R13: a parsed bundle, never a cast. The real generated TR bundle carries the nav groups
// T0b's importer fills (the golden fixture only carries `desktopNav`) and the 22 blog rows
// `blogNavVisible` reads.
const bundle: Bundle = BundleSchema.parse(trBundle);
const t = (id: string) => bundle.strings[id] ?? '';
type Entry = Record<string, unknown>;

beforeEach(() => {
  (window as unknown as { dataLayer: Entry[] }).dataLayer = [];
});

describe('SlimBar', () => {
  it('renders the slimBarRight group with localized hrefs, the verify accent and ONE portal pill (W36, W88), never /blog', () => {
    const { container } = renderWithIntl(<SlimBar bundle={bundle} />);
    expect(screen.getByRole('link', { name: t('home.009') })).toHaveAttribute('href', '/kariyer');
    const verify = screen.getByRole('link', { name: t('home.011') });
    expect(verify).toHaveAttribute('href', '/temsilci-dogrulama');
    expect(verify.className).toContain('rounded-pill');
    expect(container.querySelector('a[href="/blog"]')).toBeNull();
    // the portal login is the group's own row — one anchor, not a group row plus a hard-coded
    // copy (W36) — and internal: the chooser page links out to the portal host (W88)
    const portal = screen.getByRole('link', { name: t('home.012') });
    expect(portal).toHaveAttribute('href', '/portal-girisi');
    expect(portal).not.toHaveAttribute('target');
    expect(portal.className).toContain('rounded-pill');
    expect(container.querySelectorAll('a[href="/portal-girisi"]')).toHaveLength(1);
    expect(container.querySelector(`a[href^="${bundle.settings.portal.host}"]`)).toBeNull();
  });

  it('fires call_click / email_click with placement slimbar (W12)', async () => {
    renderWithIntl(<SlimBar bundle={bundle} />);
    const phone = screen.getByRole('link', { name: bundle.settings.phoneDisplay });
    const mail = screen.getByRole('link', { name: bundle.settings.email });
    expect(phone).toHaveAttribute('href', `tel:${bundle.settings.phone}`);
    expect(mail).toHaveAttribute('href', `mailto:${bundle.settings.email}`);
    for (const a of [phone, mail]) a.addEventListener('click', (e) => e.preventDefault());
    await userEvent.click(phone);
    await userEvent.click(mail);
    expect((window as unknown as { dataLayer: Entry[] }).dataLayer).toEqual([
      { event: 'call_click', page: '/', locale: 'tr', placement: 'slimbar' },
      { event: 'email_click', page: '/', locale: 'tr', placement: 'slimbar' },
    ]);
  });
});
