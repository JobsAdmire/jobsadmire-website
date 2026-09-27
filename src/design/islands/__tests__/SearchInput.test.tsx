import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SearchInput } from '../SearchInput';

describe('SearchInput', () => {
  it('is a labelled searchbox with a clear button that appears when there is text', async () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <SearchInput
        id="q"
        label="Search articles"
        value=""
        onChange={onChange}
        clearLabel="Clear search"
      />,
    );
    expect(screen.getByRole('searchbox', { name: 'Search articles' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Clear search' })).toBeNull();
    rerender(
      <SearchInput
        id="q"
        label="Search articles"
        value="permit"
        onChange={onChange}
        clearLabel="Clear search"
        resultText="3 articles"
      />,
    );
    expect(screen.getByRole('status')).toHaveTextContent('3 articles');
    await userEvent.click(screen.getByRole('button', { name: 'Clear search' }));
    expect(onChange).toHaveBeenLastCalledWith('');
  });

  it('clears on Escape', async () => {
    const onChange = vi.fn();
    render(
      <SearchInput id="q" label="Search" value="abc" onChange={onChange} clearLabel="Clear" />,
    );
    screen.getByRole('searchbox').focus();
    await userEvent.keyboard('{Escape}');
    expect(onChange).toHaveBeenLastCalledWith('');
  });
});
