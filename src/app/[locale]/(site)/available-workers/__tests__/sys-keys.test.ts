import { describe, expect, it } from 'vitest';
import { START_WHEN_KEYS } from '@/forms/options';
import en from '@/messages/en.json';
import tr from '@/messages/tr.json';

/** The page's whole `sys.workers.*` set (W6/W9/W23) — a key added to the page is added here and
 *  to BOTH message files (`src/messages/messages.test.ts` proves the two files agree; this proves
 *  the page and the files agree). The `startWhen` labels are the shared
 *  `sys.form.options.startWhen.*` (W78): consumed, not owned. */
const WORKERS_SYS_KEYS = [
  'pool.heading',
  'pool.intro',
  'empty.title',
  'empty.body',
  'empty.cta',
  'sticky.message',
  'form.titles.direct_employer',
  'timeline.days1to3',
  'timeline.arrival',
  'ask.emailSubject',
] as const;

/** sys keys the page reads but does not own. */
const CONSUMED_SYS_KEYS = [
  'form.labels.iAm',
  'form.labels.headcount',
  'form.labels.startWhen',
  'form.labels.message',
  'nav.breadcrumbs',
  'thankYou.forms.workers',
  ...START_WHEN_KEYS.map((k) => `form.options.startWhen.${k}`),
];

const flatten = (o: unknown, prefix = ''): string[] =>
  typeof o === 'object' && o !== null
    ? Object.entries(o).flatMap(([k, v]) => flatten(v, prefix ? `${prefix}.${k}` : k))
    : [prefix];

const get = (o: unknown, path: string): unknown =>
  path
    .split('.')
    .reduce<unknown>(
      (acc, k) =>
        acc && typeof acc === 'object' ? (acc as Record<string, unknown>)[k] : undefined,
      o,
    );

describe('sys.workers.* and sys.seo.workers.* (W6/W9/W23)', () => {
  for (const [name, messages] of [
    ['tr', tr],
    ['en', en],
  ] as const) {
    it(`${name}: carries exactly the page's keys, none empty`, () => {
      const sys = messages.sys as Record<string, unknown>;
      expect(flatten(sys.workers).sort()).toEqual([...WORKERS_SYS_KEYS].sort());
      for (const key of WORKERS_SYS_KEYS) {
        const v = get(sys.workers, key);
        expect(typeof v, key).toBe('string');
        expect((v as string).trim().length, key).toBeGreaterThan(0);
      }
      const seo = get(sys, 'seo.workers') as { title: string; description: string };
      expect(seo.title.length).toBeGreaterThan(10);
      // A snippet-length description (docs/SEO.md): the design's own helmet text was ~300 chars.
      expect(seo.description.length).toBeGreaterThan(50);
      expect(seo.description.length).toBeLessThanOrEqual(160);
    });

    it(`${name}: every sys key the page reads but does not own exists`, () => {
      for (const key of CONSUMED_SYS_KEYS)
        expect(typeof get(messages.sys, key), key).toBe('string');
    });
  }

  it('the two ICU messages name their single argument — the metric the page fills (D17)', () => {
    for (const messages of [tr, en]) {
      const sys = messages.sys as Record<string, unknown>;
      expect(get(sys, 'workers.sticky.message')).toContain('{hours}');
      expect(get(sys, 'workers.timeline.arrival')).toContain('{weeks}');
    }
  });
});
