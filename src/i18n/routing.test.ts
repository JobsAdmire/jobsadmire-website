import { describe, expect, it } from 'vitest';
import { pathnames, routing } from './routing';

describe('routing', () => {
  it('has tr as the unprefixed default and en prefixed', () => {
    expect(routing.defaultLocale).toBe('tr');
    expect(routing.localePrefix).toBe('as-needed');
    expect(routing.localeDetection).toBe(false);
  });
  it('gives every localized pathname a tr and an en form', () => {
    for (const [internal, ext] of Object.entries(pathnames)) {
      if (typeof ext === 'string') continue;
      expect(ext.tr, internal).toMatch(/^\/[a-z0-9\-\[\]/]+$/);
      expect(ext.en, internal).toMatch(/^\/[a-z0-9\-\[\]/]+$/);
    }
  });
  it('never reuses a Turkish slug for two routes', () => {
    const tr = Object.values(pathnames).map((p) => (typeof p === 'string' ? p : p.tr));
    expect(new Set(tr).size).toBe(tr.length);
  });
});
