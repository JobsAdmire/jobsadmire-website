import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TriState } from '../TriState';

const labels = { yes: 'Yes', no: 'No', unsure: 'Not sure' };

describe('TriState', () => {
  it('is a fieldset of three real radios named by the legend', async () => {
    const onChange = vi.fn();
    render(
      <TriState
        name="capital"
        legend="Paid-in capital ≥ ₺100,000?"
        value={null}
        onChange={onChange}
        labels={labels}
      />,
    );
    expect(screen.getByRole('group', { name: 'Paid-in capital ≥ ₺100,000?' })).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(3);
    await userEvent.click(screen.getByRole('radio', { name: 'No' }));
    expect(onChange).toHaveBeenCalledWith('no');
  });

  it('reflects the controlled value', () => {
    render(<TriState name="c" legend="Q" value="unsure" onChange={() => {}} labels={labels} />);
    expect(screen.getByRole('radio', { name: 'Not sure' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Yes' })).not.toBeChecked();
  });
});
