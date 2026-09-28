import { cleanup, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MobileNav } from '../MobileNav';
import { renderWithIntl } from '@/test/render';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const ITEMS = [{ href: '/hire-workers', label: 'Hire workers', external: false }];

const open = async () => {
  renderWithIntl(
    <MobileNav
      items={ITEMS}
      locale="tr"
      menuLabel="Main menu"
      closeLabel="Close"
      languageLabel="Language"
    />,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Main menu' }));
  expect(screen.getByRole('button', { name: 'Close' })).toHaveAttribute('aria-expanded', 'true');
};

describe('MobileNav disclosure (M2)', () => {
  it('closes on Escape and returns focus to the trigger', async () => {
    await open();
    await userEvent.keyboard('{Escape}');
    const trigger = screen.getByRole('button', { name: 'Main menu' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveFocus();
  });

  it('closes on a click outside the panel', async () => {
    await open();
    await userEvent.click(document.body);
    expect(screen.getByRole('button', { name: 'Main menu' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });

  it('a click inside the panel (a nav link) does not trigger the outside-click close itself', async () => {
    await open();
    // The link's own onClick already closes the panel (existing behaviour) — the outside-click
    // handler must not double-fire or throw when the click target is removed from the DOM.
    await userEvent.click(screen.getByRole('link', { name: 'Hire workers' }));
    expect(screen.getByRole('button', { name: 'Main menu' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });

  it('Escape while closed does nothing (no listener attached)', async () => {
    renderWithIntl(
      <MobileNav
        items={ITEMS}
        locale="tr"
        menuLabel="Main menu"
        closeLabel="Close"
        languageLabel="Language"
      />,
    );
    await userEvent.keyboard('{Escape}');
    const trigger = screen.getByRole('button', { name: 'Main menu' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    // N11: a leaked or always-on keydown listener would still pull focus to the trigger here —
    // closing is idempotent, so `aria-expanded` alone cannot tell the two apart.
    expect(trigger).not.toHaveFocus();
  });
});

// N11 (final re-review): the two document listeners exist only while the panel is open, and the
// SAME functions are removed on every way out — Escape, an outside click, unmounting while open.
// Driven by `fireEvent`, not user-event, so no listener but the component's reaches the spies.
describe('MobileNav document listeners (N11)', () => {
  const renderNav = () =>
    renderWithIntl(
      <MobileNav
        items={ITEMS}
        locale="tr"
        menuLabel="Main menu"
        closeLabel="Close"
        languageLabel="Language"
      />,
    );
  /** The component's keydown/mousedown (type, listener) pairs, in call order. */
  const spies = () => {
    const add = vi.spyOn(document, 'addEventListener');
    const remove = vi.spyOn(document, 'removeEventListener');
    const ours = (spy: typeof add) =>
      spy.mock.calls
        .filter(([type]) => type === 'keydown' || type === 'mousedown')
        .map(([type, listener]) => [type, listener]);
    return { added: () => ours(add), removed: () => ours(remove) };
  };
  const toggle = () => fireEvent.click(screen.getByRole('button', { name: /Main menu|Close/ }));

  it('attaches nothing while closed; opening adds one keydown and one mousedown listener', () => {
    const { added, removed } = spies();
    renderNav();
    expect(added()).toEqual([]);
    toggle();
    expect(added()).toHaveLength(2);
    expect(removed()).toEqual([]);
  });

  it('closing by Escape, then by an outside click, removes exactly the listeners each opening added', () => {
    const { added, removed } = spies();
    renderNav();
    toggle();
    const first = added();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(removed()).toEqual(first);

    toggle();
    const second = added().slice(first.length);
    expect(second).toHaveLength(2);
    fireEvent.mouseDown(document.body);
    expect(screen.getByRole('button', { name: 'Main menu' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    expect(removed()).toEqual([...first, ...second]);
  });

  it('unmounting while open removes both listeners — nothing outlives the component', () => {
    const { added, removed } = spies();
    const { unmount } = renderNav();
    toggle();
    expect(added()).toHaveLength(2);
    unmount();
    expect(removed()).toEqual(added());
  });
});
