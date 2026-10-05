import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { SlimBar } from '../SlimBar';
import { collisionsInTree } from '@/test/class-collisions';
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
  it('renders the slimBarRight group with localized hrefs, the verify accent, /blog and ONE external portal pill (W36)', () => {
    const { container } = renderWithIntl(<SlimBar bundle={bundle} />);
    expect(screen.getByRole('link', { name: t('home.009') })).toHaveAttribute('href', '/kariyer');
    const verify = screen.getByRole('link', { name: t('home.011') });
    expect(verify).toHaveAttribute('href', '/temsilci-dogrulama');
    expect(verify.className).toContain('rounded-pill');
    expect(container.querySelectorAll('a[href="/blog"]')).toHaveLength(1);
    // the portal login is the group's own row — one anchor, not a group row plus a hard-coded
    // copy (W36) — and external since 2026-10-05: the partner portal login, new tab
    const login = `${bundle.settings.portal.host}${bundle.settings.portal.loginPath}`;
    const portal = screen.getByRole('link', { name: t('home.012') });
    expect(portal).toHaveAttribute('href', login);
    expect(portal).toHaveAttribute('target', '_blank');
    expect(portal).toHaveAttribute('rel', 'noopener noreferrer');
    expect(portal.className).toContain('rounded-pill');
    expect(container.querySelectorAll(`a[href="${login}"]`)).toHaveLength(1);
    expect(container.querySelector('a[href="/portal-girisi"]')).toBeNull();
  });

  // W122/W155: PILL used to append `text-sky` onto LINK's `text-white/70`; Tailwind's
  // alphabetical order made white/70 win, so the pills never rendered sky. LINK and PILL now
  // share a colourless base and each carries its own colour pair.
  it('no element sets one property twice at one variant; the pills are sky, the links white/70 (W155)', () => {
    const { container } = renderWithIntl(<SlimBar bundle={bundle} />);
    expect(collisionsInTree(container)).toEqual([]);
    for (const name of [t('home.011'), t('home.012')]) {
      const pill = screen.getByRole('link', { name });
      expect(pill).toHaveClass('rounded-pill', 'text-sky', 'hover:text-white');
      expect(pill).not.toHaveClass('text-white/70');
    }
    expect(screen.getByRole('link', { name: t('home.009') })).toHaveClass(
      'text-white/70',
      'hover:text-white',
    );
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

  // W180: the design's slim bar (`.ja-slim`, padding 48 authored) is a full-bleed row on the
  // container's own gutter (20 / 48 / 36 px) — never the 960 px content box.
  it('lays its row out full-bleed on the container gutter, never in the content box (W180)', () => {
    renderWithIntl(<SlimBar bundle={bundle} />);
    const row = screen.getByRole('region', { name: 'İletişim ve lisans şeridi' }).firstElementChild;
    expect(row).toHaveClass('chrome-row');
    expect(row).not.toHaveClass('container-site');
  });

  it('is a named region, not a set of links sitting outside any landmark (M1)', () => {
    renderWithIntl(<SlimBar bundle={bundle} />);
    expect(screen.getByRole('region', { name: 'İletişim ve lisans şeridi' })).toBeInTheDocument();
  });
});
