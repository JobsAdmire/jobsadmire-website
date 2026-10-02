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

  // QA W220 V-03: "Bildir" + "sahtekârı" is the EN order ("Report" + "an Impostor"); Turkish puts
  // the object before the verb, so the verify CTA renders its tail first in TR only — the design's
  // short form "Bildir" at 901–1100 and the EN label are untouched.
  it('renders the verify tail before the label in Turkish only (tailFirst)', () => {
    expect(ctasFor(resolveCtas(t, 'tr'), '/verify').primary.tailFirst).toBe(true);
    expect(ctasFor(resolveCtas(t, 'en'), '/verify').primary.tailFirst).toBe(false);
    for (const locale of ['tr', 'en'] as const) {
      const resolved = resolveCtas(t, locale);
      expect(resolved.defaults.primary.tailFirst).toBe(false);
      for (const [key, page] of Object.entries(resolved.byPathname)) {
        if (key === '/verify') continue;
        expect(page.primary.tailFirst, key).toBe(false);
        expect(page.secondary?.tailFirst ?? false, key).toBe(false);
      }
    }
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
