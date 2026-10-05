import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Button, buttonClassName } from '../index';
import { renderWithIntl } from '@/test/render';

describe('Button', () => {
  it('renders an internal href through the localized next-intl Link', () => {
    renderWithIntl(
      <Button variant="primary" href="/hire-workers">
        Talep
      </Button>,
    );
    expect(screen.getByRole('link', { name: 'Talep' })).toHaveAttribute('href', '/isci-talebi');
  });

  it('renders an external href as a safe new-tab anchor', () => {
    renderWithIntl(
      <Button variant="secondary" href="https://portal.jobsadmire.com/auth/login" external>
        Portal
      </Button>,
    );
    const link = screen.getByRole('link', { name: 'Portal' });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders a real button when there is no href', () => {
    renderWithIntl(
      <Button variant="ghost" type="submit">
        Gönder
      </Button>,
    );
    expect(screen.getByRole('button', { name: 'Gönder' })).toHaveAttribute('type', 'submit');
  });

  it('success is the design pale green WhatsApp face, a variant rather than caller classes (W127, SHARED 5.2a)', () => {
    renderWithIntl(
      <Button variant="success" href="https://wa.me/905011240340">
        WhatsApp
      </Button>,
    );
    const link = screen.getByRole('link', { name: 'WhatsApp' });
    expect(link).toHaveClass(
      'border-[1.5px]',
      'border-success-soft-border',
      'bg-success-soft',
      'text-success-text',
      'hover:bg-success-surface',
    );
    expect(link.className).toBe(buttonClassName('success'));
  });

  it('success-solid is the contrast-safe solid green (SHARED 5.2b), primary darkens on hover (5.4)', () => {
    expect(buttonClassName('success-solid')).toContain('bg-success-text');
    expect(buttonClassName('success-solid')).toContain('text-white');
    expect(buttonClassName('primary')).toContain('hover:bg-blue-deep');
    expect(buttonClassName('primary')).not.toContain('hover:bg-ink');
  });

  it('pills by default; rect + radius gives the design rectangles; lift on unless turned off (SHARED 5.1)', () => {
    expect(buttonClassName('primary')).toContain('rounded-pill');
    expect(buttonClassName('primary')).toContain('ja-hover-lift');
    const rect = buttonClassName('primary', 'md', undefined, { shape: 'rect', radius: 11 });
    expect(rect).toContain('rounded-[11px]');
    expect(rect).not.toContain('rounded-pill');
    expect(buttonClassName('primary', 'md', undefined, { lift: false })).not.toContain(
      'ja-hover-lift',
    );
  });

  it('renders the leading and trailing glyphs around the label (SHARED 5.3)', () => {
    renderWithIntl(
      <Button
        variant="primary"
        href="/hire-workers"
        icon={<svg data-testid="lead" aria-hidden="true" />}
        iconEnd={<svg data-testid="trail" aria-hidden="true" />}
      >
        Talep
      </Button>,
    );
    const link = screen.getByRole('link', { name: 'Talep' });
    expect(link.firstElementChild).toHaveAttribute('data-testid', 'lead');
    expect(link.lastElementChild).toHaveAttribute('data-testid', 'trail');
  });

  it('inverse-dark is the green band face: white on a darkened surface (W128b)', () => {
    renderWithIntl(
      <Button variant="inverse-dark" href="tel:+905011240340">
        Ara
      </Button>,
    );
    const link = screen.getByRole('link', { name: 'Ara' });
    expect(link).toHaveClass(
      'border',
      'border-white/40',
      'bg-black/15',
      'text-white',
      'hover:bg-black/25',
    );
    expect(link.className).toBe(buttonClassName('inverse-dark'));
  });

  it('nav is the header CTA face: ink at rest, blue-safe on hover — a variant, never caller classes (W155)', () => {
    renderWithIntl(
      <Button variant="nav" href="/hire-workers">
        Talep
      </Button>,
    );
    const link = screen.getByRole('link', { name: 'Talep' });
    expect(link).toHaveClass('bg-ink', 'text-white', 'hover:bg-blue-safe');
    expect(link).not.toHaveClass('bg-blue-safe');
    expect(link.className).toBe(buttonClassName('nav'));
  });
});
