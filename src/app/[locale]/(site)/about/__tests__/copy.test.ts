import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { METRIC_KEYS } from '@/content/collections';
import en from '@/messages/en.json';
import tr from '@/messages/tr.json';

type Tree = { [k: string]: string | Tree };

function flatten(tree: Tree, prefix = ''): string[] {
  return Object.entries(tree).flatMap(([k, v]) =>
    typeof v === 'string' ? [`${prefix}${k}`] : flatten(v, `${prefix}${k}.`),
  );
}

function lookup(tree: Tree, key: string): string | Tree | undefined {
  return key
    .split('.')
    .reduce<string | Tree | undefined>(
      (node, part) => (typeof node === 'object' ? node[part] : undefined),
      tree,
    );
}

/** Every `.ts`/`.tsx` source in the page folder (page, helpers, _components), tests excluded. */
function sources(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) return name === '__tests__' ? [] : sources(p);
    return /\.tsx?$/.test(name) ? [readFileSync(p, 'utf8')] : [];
  });
}

const PAGE_DIR = join(__dirname, '..');
// The sanctioned readFileSync bypass (W40): src/** may not import src/content/local/* (D23).
const LOCAL_DIR = join(__dirname, '../../../../../content/local');
const readJson = (name: string) => JSON.parse(readFileSync(join(LOCAL_DIR, name), 'utf8'));

const SYS_REF = /\bsys\(\s*(['"`])((?:about|seo\.about)\.[A-Za-z0-9_.]+)\1/g;
const PACKAGE_ID = /(['"`])((?:about|home|hire|contact)\.\d{3})\1/g;
const TOKEN = /\{([A-Za-z][A-Za-z0-9]*)\}/g;

/** Ids the page must never read: the design's unsigned-stat labels (W1, MetricStrip renders
 *  each metric's own label), the "+ countries" suffix (W1: exact 13), the rotation list (the
 *  sourceCountries collection replaces it), the founder-name placeholder (W86 — the name comes
 *  from a published row only), and the hidden employer-updates subscription (W5). */
const NEVER_READ = [
  'about.026',
  'about.027',
  'about.028',
  'about.059',
  'about.060',
  'about.061',
  'about.062',
  'about.063',
  'about.139',
  'about.141',
  'about.142',
  'about.144',
  'about.145',
];

describe('About copy (W9/W23)', () => {
  const enAbout = en.sys.about as Tree;
  const trAbout = tr.sys.about as Tree;
  const enSeo = en.sys.seo.about as Tree;
  const trSeo = tr.sys.seo.about as Tree;

  it('sys.about.* and sys.seo.about.* carry the identical key set in both locales', () => {
    expect(flatten(trAbout).sort()).toEqual(flatten(enAbout).sort());
    expect(flatten(trSeo).sort()).toEqual(flatten(enSeo).sort());
  });

  it('has no empty value in either locale', () => {
    for (const tree of [enAbout, trAbout, enSeo, trSeo])
      for (const key of flatten(tree)) expect(lookup(tree, key), key).not.toBe('');
  });

  it('every sys(…) reference in the page folder resolves in both message files', () => {
    const referenced = new Set<string>();
    for (const src of sources(PAGE_DIR))
      for (const m of src.matchAll(SYS_REF)) referenced.add(m[2]);
    expect(referenced.size).toBeGreaterThan(0);
    for (const key of referenced) {
      expect(typeof lookup(en.sys as Tree, key), `en sys.${key}`).toBe('string');
      expect(typeof lookup(tr.sys as Tree, key), `tr sys.${key}`).toBe('string');
    }
  });

  it('every package id the page folder names exists, and its {tokens} are metric keys (W1)', () => {
    const catalogue = readJson('catalogue.json') as Record<string, unknown>;
    const bundles = ['bundle.tr.json', 'bundle.en.json'].map(
      (f) => readJson(f).strings as Record<string, string>,
    );
    const ids = new Set<string>();
    for (const src of sources(PAGE_DIR)) for (const m of src.matchAll(PACKAGE_ID)) ids.add(m[2]);
    expect(ids.size).toBeGreaterThan(0);
    for (const id of ids) {
      expect(id in catalogue, `${id} not in catalogue.json`).toBe(true);
      for (const strings of bundles) {
        expect(typeof strings[id], id).toBe('string');
        for (const token of strings[id].matchAll(TOKEN))
          expect(METRIC_KEYS as readonly string[], `${id} {${token[1]}}`).toContain(token[1]);
      }
    }
  });

  it('never reads the unsigned stat labels, the founder placeholder or the hidden subscription', () => {
    const all = sources(PAGE_DIR).join('\n');
    for (const id of NEVER_READ) expect(all.includes(`'${id}'`), id).toBe(false);
  });
});
