import { render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { QrCode } from '../QrCode';

describe('QrCode', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the labelled SVG inline', () => {
    const { container } = render(
      <QrCode text="https://wa.me/905011240340" label="Scan to chat on WhatsApp" />,
    );
    expect(container.querySelector('svg[role="img"]')).toHaveAttribute(
      'aria-label',
      'Scan to chat on WhatsApp',
    );
  });

  it('renders nothing for empty text instead of throwing in the server render', () => {
    const { container } = render(<QrCode text="" label="QR" />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing for text too big to encode, and logs outside production', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { container } = render(<QrCode text={'x'.repeat(3000)} label="QR" />);
    expect(container).toBeEmptyDOMElement();
    expect(error).toHaveBeenCalled();
  });
});
