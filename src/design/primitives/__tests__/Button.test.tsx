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

  it('success is the design green WhatsApp outline, a variant rather than caller classes (W127)', () => {
    renderWithIntl(
      <Button variant="success" href="https://wa.me/905011240340">
        WhatsApp
      </Button>,
    );
    const link = screen.getByRole('link', { name: 'WhatsApp' });
    expect(link).toHaveClass(
      'border',
      'border-success-border',
      'bg-white',
      'text-success-text',
      'hover:bg-success-surface',
    );
    expect(link.className).toBe(buttonClassName('success'));
  });
});
