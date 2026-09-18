import { describe, expect, it } from 'vitest';
import { buildBundles } from './import-design-package';

describe('import-design-package', () => {
  const { tr, en, catalogue } = buildBundles();

  it('imports every id in both locales with the same key set', () => {
    const ids = Object.keys(tr.strings);
    expect(ids.filter((id) => !id.startsWith('sys.')).length).toBe(3505);
    expect(tr.strings['sys.nav.verify']).toBe('Temsilci Doğrulama');
    expect(Object.keys(en.strings).sort()).toEqual(ids.sort());
  });
  it('keeps the six deliberately-empty Turkish fragments empty', () => {
    for (const id of ['hire.141', 'calc.041', 'calc.154', 'calc.157', 'calc.367', 'jt.107']) {
      expect(tr.strings[id]).toBe('');
      expect(en.strings[id]).not.toBe('');
    }
  });
  it('records 380 legal strings in the catalogue', () => {
    expect(Object.values(catalogue).filter((c) => c.legal).length).toBe(380);
  });
  it('carries no HTML entities in values (the &amp; bug from the design)', () => {
    const bad = Object.entries(en.strings).filter(([, v]) => /&(amp|middot|nbsp);/.test(v));
    expect(bad).toEqual([]);
  });
  it('builds the desktop nav from the homepage nav ids in README order', () => {
    expect(tr.nav.filter((n) => n.group === 'desktopNav').map((n) => n.href)).toEqual([
      '/hire-workers',
      '/available-workers',
      '/work-permit',
      '/hiring-cost-calculator',
      '/about',
      '/success-stories',
      '/blog',
      '/verify',
      '/partner-with-us',
      '/careers',
      '/contact',
    ]);
  });
});
