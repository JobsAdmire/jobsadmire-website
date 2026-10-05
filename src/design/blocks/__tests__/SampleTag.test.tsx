import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SampleTag } from '../SampleTag';
import { SampleTag as FromBarrel } from '../index';
import en from '@/messages/en.json';
import tr from '@/messages/tr.json';
import { renderWithIntl } from '@/test/render';

describe('SampleTag', () => {
  it('prints sys.sample.tag with sys.sample.title as the title and the visually hidden reason', () => {
    const { container } = renderWithIntl(<SampleTag />);
    const tag = container.querySelector('[data-sample-tag]')!;
    expect(tag).toHaveAttribute('title', tr.sys.sample.title);
    expect(tag).toHaveTextContent(tr.sys.sample.tag);
    expect(screen.getByText(`— ${tr.sys.sample.title}`, { exact: false })).toHaveClass('sr-only');
    // the design's amber "sample data" pill on light surfaces
    expect(tag).toHaveClass('bg-amber-surface', 'border-amber-border', 'text-warning-text');
  });

  it('has a dark tone for navy bands and is exported from the blocks barrel', () => {
    const { container } = renderWithIntl(<FromBarrel tone="dark" className="ml-2" />);
    expect(container.querySelector('[data-sample-tag]')).toHaveClass('bg-night/70', 'ml-2');
  });

  it('carries both locales’ copy', () => {
    expect([tr.sys.sample.tag, en.sys.sample.tag]).toEqual(['örnek', 'sample']);
    expect(en.sys.sample.title).toBe('Sample content — real data coming soon');
  });
});
