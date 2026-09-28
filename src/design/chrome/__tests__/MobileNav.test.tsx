import { cleanup, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { MobileNav } from '../MobileNav';
import { renderWithIntl } from '@/test/render';

afterEach(cleanup);

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
    expect(screen.getByRole('button', { name: 'Main menu' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });
});
