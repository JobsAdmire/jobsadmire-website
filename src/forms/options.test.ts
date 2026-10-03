import { describe, expect, it } from 'vitest';
import en from '@/messages/en.json';
import tr from '@/messages/tr.json';
import { START_WHEN_KEYS } from './options';

describe('START_WHEN_KEYS ↔ sys.form.options.startWhen.* parity (W78)', () => {
  it('every key has a non-empty label in both locale files', () => {
    for (const file of [tr, en]) {
      const options = file.sys.form.options as Record<string, Record<string, string>>;
      for (const key of START_WHEN_KEYS) {
        expect(typeof options.startWhen[key], key).toBe('string');
        expect(options.startWhen[key].trim().length, key).toBeGreaterThan(0);
      }
    }
  });

  it('carries exactly the keys START_WHEN_KEYS names — no more, no fewer', () => {
    for (const file of [tr, en]) {
      const options = file.sys.form.options as Record<string, Record<string, string>>;
      expect(Object.keys(options.startWhen).sort()).toEqual([...START_WHEN_KEYS].sort());
    }
  });
});
