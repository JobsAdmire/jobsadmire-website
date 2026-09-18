import { describe, expect, it } from 'vitest';
import { alternatePath } from '../alternate-path';

describe('alternatePath (R58)', () => {
  it('leaves a static internal pathname alone', () => {
    expect(alternatePath('/')).toBe('/');
    expect(alternatePath('/about')).toBe('/about');
    expect(alternatePath('/newsletter/confirm')).toBe('/newsletter/confirm');
  });
  it('falls back to the parent index for a dynamic route', () => {
    expect(alternatePath('/blog/[slug]')).toBe('/blog');
    expect(alternatePath('/careers/[slug]')).toBe('/careers');
  });
  it('never emits a template or a guessed slug', () => {
    for (const internal of ['/blog/[slug]', '/careers/[slug]', '/a/[b]/[c]', '/[slug]']) {
      expect(alternatePath(internal)).not.toContain('[');
    }
    expect(alternatePath('/a/[b]/[c]')).toBe('/a');
    expect(alternatePath('/[slug]')).toBe('/');
  });
});
