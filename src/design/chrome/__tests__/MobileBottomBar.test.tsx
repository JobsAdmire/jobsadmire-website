import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MobileBottomBar, MobileBottomBarSpacer } from '../MobileBottomBar';
import { renderWithIntl } from '@/test/render';
import trBundle from '@/content/local/bundle.tr.json';
import { BundleSchema, type Bundle } from '../../../../contract/website-bundle.v1';

const bundle: Bundle = BundleSchema.parse(trBundle);

describe('MobileBottomBar', () => {
  it('is a named landmark, not a fixed div sitting outside any (M1)', () => {
    const { container } = renderWithIntl(<MobileBottomBar bundle={bundle} />);
    const nav = screen.getByRole('navigation', { name: 'Hızlı iletişim işlemleri' });
    expect(container.querySelector('nav')).toBe(nav);
  });

  it('carries the call and WhatsApp actions', () => {
    renderWithIntl(<MobileBottomBar bundle={bundle} />);
    expect(
      screen.getByRole('link', { name: new RegExp(bundle.strings['hire.032']!) }),
    ).toHaveAttribute('href', `tel:${bundle.settings.phone}`);
    expect(
      screen.getByRole('link', { name: new RegExp(bundle.strings['home.221']!) }),
    ).toHaveAttribute('href', expect.stringContaining('wa.me'));
  });
});

describe('MobileBottomBarSpacer', () => {
  it('reserves the fixed bar height, hidden from assistive tech', () => {
    const { container } = renderWithIntl(<MobileBottomBarSpacer />);
    const spacer = container.firstChild as HTMLElement;
    expect(spacer).toHaveAttribute('aria-hidden', 'true');
  });
});
