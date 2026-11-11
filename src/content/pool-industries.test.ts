import { describe, expect, it } from 'vitest';
import { INDUSTRY_TR, industryNameTr } from './pool-industries';

/** The portal's industries, exactly as production lists them (2026-11-11). */
const PORTAL_INDUSTRIES = [
  'Manufacturing',
  'Hospitality',
  'Construction',
  'Agriculture',
  'Textile',
  'Automotive',
  'Food Processing',
  'Logistics',
  'Mining',
  'Healthcare Support',
  'Cleaning Services',
  'Security',
  'Retail',
  'Warehousing & Packaging',
  'Education',
  'IT & Software',
  'Office & Administration',
  'Finance & Insurance',
  'Media & Arts',
  'Sports & Recreation',
  'Public Service & Military',
  'Beauty & Personal Care',
  'Metal & Machinery',
  'Chemicals & Plastics',
  'Wood & Furniture',
  'Telecommunications & Electronics',
  'Energy & Utilities',
  'Maritime & Fishing',
];

describe('the Turkish names of the portal industries', () => {
  it('names every industry the portal has, and only those', () => {
    expect(Object.keys(INDUSTRY_TR).sort()).toEqual([...PORTAL_INDUSTRIES].sort());
    for (const en of PORTAL_INDUSTRIES) expect(industryNameTr(en), en).toBeTruthy();
    expect(industryNameTr('Construction')).toBe('İnşaat');
    expect(industryNameTr('Hospitality')).toBe('Turizm ve Otelcilik');
    expect(industryNameTr('Metal & Machinery')).toBe('Metal ve Makine');
  });

  it('every name is plain Turkish: distinct, trimmed, no "&", never the English words', () => {
    const names = Object.values(INDUSTRY_TR);
    expect(new Set(names).size).toBe(names.length);
    for (const [en, tr] of Object.entries(INDUSTRY_TR)) {
      expect(tr, en).toBe(tr.trim());
      expect(tr, en).not.toContain('&');
      expect(tr, en).not.toBe(en);
    }
  });

  it('matches the English name trimmed and case-insensitively', () => {
    expect(industryNameTr('  it & SOFTWARE ')).toBe('Bilişim ve Yazılım');
    expect(industryNameTr('food   processing')).toBe('Gıda Üretimi');
    expect(industryNameTr('CONSTRUCTION')).toBe('İnşaat');
  });

  it('an unknown name, an id, or nothing → null (the English name then stands in)', () => {
    expect(industryNameTr('Space Exploration')).toBeNull();
    expect(industryNameTr('cfixtureindustry00000001')).toBeNull();
    expect(industryNameTr('Construction & Building')).toBeNull();
    expect(industryNameTr('')).toBeNull();
    expect(industryNameTr(null)).toBeNull();
    expect(industryNameTr(undefined)).toBeNull();
  });
});
