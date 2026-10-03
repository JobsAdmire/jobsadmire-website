import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { CTA_BY_PATHNAME, DEFAULT_CTAS, ctasFor, resolveCtas } from '../ctas';
import { pathnames } from '@/i18n/routing';

const t = (id: string) => `<${id}>`;
const table = resolveCtas(t, 'tr');

// The catalogue via readFileSync (lint.test.ts's pattern) — not a module import (R56/D23).
const strings = (locale: 'tr' | 'en') =>
  (
    JSON.parse(
      readFileSync(
        join(__dirname, '..', '..', '..', 'content', 'local', `bundle.${locale}.json`),
        'utf8',
      ),
    ) as { strings: Record<string, string> }
  ).strings;

describe('header CTA table (W17)', () => {
  it('falls back to the defaults for null and for keys without an entry', () => {
    expect(ctasFor(table, null)).toBe(table.defaults);
    expect(ctasFor(table, '/hire-workers')).toBe(table.defaults);
    expect(ctasFor(table, '/blog/[slug]')).toBe(table.defaults);
    expect(ctasFor(table, '/careers/[slug]')).toBe(table.defaults);
    expect(ctasFor(table, '/not-a-key')).toBe(table.defaults);
    expect(table.defaults).toEqual({
      primary: {
        label: '<home.014>',
        tail: '<home.015>',
        href: { pathname: '/hire-workers', hash: '#request-form' },
        variant: 'primary',
        tailFirst: false,
      },
      secondary: {
        label: '<home.008>',
        href: '/partner-with-us',
        variant: 'primary',
        tailFirst: false,
      },
    });
  });

  it('resolves a page entry, inheriting the default secondary when the entry leaves it out', () => {
    expect(ctasFor(table, '/contact')).toEqual({
      primary: {
        label: '<contact.015>',
        tail: '<contact.016>',
        href: { pathname: '/contact', hash: '#message' },
        variant: 'primary',
        tailFirst: false,
      },
      secondary: {
        label: '<home.002>',
        href: '/hire-workers',
        variant: 'primary',
        tailFirst: false,
      },
    });
    expect(ctasFor(table, '/').primary.href).toEqual({ pathname: '/', hash: '#proposal' });
    expect(ctasFor(table, '/work-permit').secondary).toEqual(table.defaults.secondary);
    expect(ctasFor(table, '/verify').primary.variant).toBe('danger');
    expect(ctasFor(table, '/hiring-cost-calculator').primary).toEqual({
      label: '<calc.324>',
      href: { pathname: '/hiring-cost-calculator', hash: '#calculator' },
      variant: 'primary',
      tailFirst: false,
    });
  });

  // QA W220 V-03 / W222 (4): "Bildir" + "sahtekârı", "Başvurun" + "izin için" and "Başvurun" + "iş
  // ortaklığı için" are the EN order ("Report" + "an Impostor", "Apply" + "for a permit", "Apply" +
  // "to partner"); Turkish puts the object or the postpositional phrase before the verb, so those
  // three CTAs render their tail first in TR only — the design's short form (the label alone at
  // 901–1100) and the EN labels are untouched.
  const TAIL_FIRST = ['/verify', '/work-permit', '/partner-with-us'] as const;
  it('renders the TR tails that precede their verb before the label — verify, work-permit, partner (tailFirst)', () => {
    for (const key of TAIL_FIRST) {
      expect(ctasFor(resolveCtas(t, 'tr'), key).primary.tailFirst, key).toBe(true);
      expect(ctasFor(resolveCtas(t, 'en'), key).primary.tailFirst, key).toBe(false);
    }
    for (const locale of ['tr', 'en'] as const) {
      const resolved = resolveCtas(t, locale);
      expect(resolved.defaults.primary.tailFirst).toBe(false);
      for (const [key, page] of Object.entries(resolved.byPathname)) {
        if ((TAIL_FIRST as readonly string[]).includes(key)) continue;
        expect(page.primary.tailFirst, key).toBe(false);
        expect(page.secondary?.tailFirst ?? false, key).toBe(false);
      }
    }
  });

  // QA W221 W-08: "Bkz." + "Adaylar" split the pill mid-phrase on phones and read as a footnote
  // ("See" + "Candidates" in EN); the CTA is one label (availworkers.016, overridden to "Adayları
  // gör" / "See candidates") with no tail to hide or reorder.
  it('the available-workers CTA is one label with no tail (W-08)', () => {
    expect(ctasFor(table, '/available-workers').primary).toEqual({
      label: '<availworkers.016>',
      href: { pathname: '/available-workers', hash: '#pool' },
      variant: 'primary',
      tailFirst: false,
    });
  });

  it('only keys of `pathnames`, and every label id exists in both catalogues', () => {
    const ids = new Set<string>();
    const collect = (c: { labelId: string; tailId?: string } | null | undefined) => {
      if (!c) return;
      ids.add(c.labelId);
      if (c.tailId) ids.add(c.tailId);
    };
    collect(DEFAULT_CTAS.primary);
    collect(DEFAULT_CTAS.secondary);
    for (const [key, page] of Object.entries(CTA_BY_PATHNAME)) {
      expect(Object.hasOwn(pathnames, key), key).toBe(true);
      collect(page.primary);
      collect(page.secondary);
    }
    for (const locale of ['tr', 'en'] as const) {
      const s = strings(locale);
      for (const id of ids) expect(s[id], `${id} (${locale})`).toBeTruthy();
    }
  });

  it('no key is a dynamic route (W121: the prerendered TR HTML and the browser disagree on the internal key for `/careers/[slug]`, `/blog/[slug]` …, so a dynamic key must fall back to the defaults, not get its own entry)', () => {
    for (const key of Object.keys(CTA_BY_PATHNAME)) {
      expect(key.includes('['), key).toBe(false);
    }
  });
});
