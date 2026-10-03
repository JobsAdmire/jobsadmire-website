import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const ROUTE = join(process.cwd(), 'src/app/[locale]/(site)/contact');
const strings = (locale: 'tr' | 'en') =>
  (
    JSON.parse(
      readFileSync(join(process.cwd(), `src/content/local/bundle.${locale}.json`), 'utf8'),
    ) as { strings: Record<string, string> }
  ).strings;

/** Every non-test source file of the route. */
function sources(dir = ROUTE): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return name === '__tests__' ? [] : sources(path);
    return /\.tsx?$/.test(name) ? [path] : [];
  });
}

/** The package ids the page reads by exact id (W9/W23) — quoted literals in its own source (single-
 *  quoted in `t('…')`, double-quoted in JSX props such as FaqBlock's `eyebrowId`). The
 *  `offices` rows' ids (contact.096–106, 133, 134) and the blocks' own (home.192/221) are read
 *  through data and blocks, not listed here. */
const IDS = new Set(
  sources().flatMap((file) =>
    [...readFileSync(file, 'utf8').matchAll(/['"]((?:contact|home)\.\d{3})['"]/g)].map((m) => m[1]),
  ),
);

const range = (from: number, to: number) =>
  Array.from({ length: to - from + 1 }, (_, i) => `contact.${String(from + i).padStart(3, '0')}`);

/** Never read: the chrome's own ids (R15 — the layout renders contact.001–022 and 125–149; 015/016
 *  are the header CTA's, W17 — except contact.135, the lines' hours the page shows) and the ids
 *  the port retires on purpose: the KVKK sentence (W79), the WhatsApp-only labels and sent panels
 *  (W3/D13), the ≤ 700 px picked pill, the newsletter handler (W5), the design's office-card labels
 *  the frozen OfficeCard replaces with its own. */
const NOT_READ = [
  ...range(1, 22),
  ...range(125, 149).filter((id) => id !== 'contact.135'),
  'contact.047',
  'contact.048',
  'contact.072',
  'contact.073',
  'contact.086',
  'contact.087',
  'contact.088',
  'contact.098',
  'contact.102',
  'contact.107',
  'contact.118',
  'contact.217',
  'contact.221',
  'contact.222',
];

describe('package ids (W9/W23)', () => {
  it('reads 144 distinct ids, every one present in both LOCAL bundles', () => {
    expect(IDS.size).toBe(144);
    const tr = strings('tr');
    const en = strings('en');
    for (const id of IDS) {
      expect(tr[id], id).toBeTypeOf('string');
      expect(en[id], id).toBeTypeOf('string');
    }
  });

  it('never reads the chrome’s ids (R15) or the ones the port retires (W79/D13/W3)', () => {
    for (const id of NOT_READ) expect(IDS.has(id), id).toBe(false);
  });
});
