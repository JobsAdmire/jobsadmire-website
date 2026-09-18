import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Button } from '../index';
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
});
