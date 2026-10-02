import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = process.cwd();
const PAGE_DIR = join(ROOT, 'src/app/[locale]/(site)/available-workers');

/** The page's own modules (tests excluded). */
function sources(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return name === '__tests__' ? [] : sources(path);
    return /\.tsx?$/.test(name) ? [path] : [];
  });
}

/** Read, never imported: ESLint's D23 rule forbids importing `content/local/*` under `src/**`. */
const readJson = (path: string) =>
  JSON.parse(readFileSync(join(ROOT, path), 'utf8')) as Record<string, unknown>;
const catalogue = readJson('src/content/local/catalogue.json');
const bundles = ['tr', 'en'].map(
  (locale) => readJson(`src/content/local/bundle.${locale}.json`).strings as Record<string, string>,
);

describe('package ids (W9 — an unknown id throws in dev and renders "" in production)', () => {
  const ids = new Set(
    sources(PAGE_DIR).flatMap(
      (file) => readFileSync(file, 'utf8').match(/\b(?:availworkers|hire|wp|home)\.\d{3}\b/g) ?? [],
    ),
  );

  it('the page source names the ids it renders — hero, form, closing band, the FAQ twins', () => {
    for (const id of [
      'availworkers.021',
      'availworkers.024',
      'availworkers.110',
      'availworkers.146',
      'availworkers.224',
      'wp.350',
      'hire.302',
    ])
      expect(ids.has(id), id).toBe(true);
  });

  it('every id the page source names exists in the catalogue and in both generated bundles', () => {
    for (const id of ids) {
      expect(catalogue[id], id).toBeDefined();
      for (const strings of bundles) expect(typeof strings[id], id).toBe('string');
    }
  });
});
