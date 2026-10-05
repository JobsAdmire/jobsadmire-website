import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { POINT_ID, QUESTIONS, VERDICT_TITLE_ID } from '../eligibility';
import * as tables from '../tables';

const stringsOf = (locale: 'tr' | 'en') =>
  (
    JSON.parse(
      readFileSync(join(process.cwd(), 'src', 'content', 'local', `bundle.${locale}.json`), 'utf8'),
    ) as { strings: Record<string, string> }
  ).strings;
const TR = stringsOf('tr');
const EN = stringsOf('en');

/** Every `wp.nnn` id a value holds, however deep. */
function idsIn(value: unknown): string[] {
  if (typeof value === 'string') return /^wp\.\d{3}$/.test(value) ? [value] : [];
  if (Array.isArray(value)) return value.flatMap(idsIn);
  if (value && typeof value === 'object') return Object.values(value).flatMap(idsIn);
  return [];
}
const range = (from: number, to: number) =>
  Array.from({ length: to - from + 1 }, (_, i) => `wp.${String(from + i).padStart(3, '0')}`);

describe('the page-id tables (docs/CONTENT-MODEL.md § Collections, W23)', () => {
  const ids = [...new Set([...idsIn(tables), ...idsIn({ QUESTIONS, POINT_ID, VERDICT_TITLE_ID })])];

  it('reference only wp.* ids that exist in both bundles', () => {
    expect(ids.length).toBeGreaterThan(200);
    expect(ids.filter((id) => !(id in TR) || !(id in EN))).toEqual([]);
  });

  it('never reference the ids this page deliberately leaves unread', () => {
    const unread = [
      'wp.022', // dated badge → sys.wp.hero.updated (D17)
      'wp.066', // W2 — the wizard makes no timing claim
      'wp.261', // tab labels — the timeline cards stack (D20)
      'wp.262',
      'wp.300', // typed "6 docs" — the count is computed
      'wp.325', // the "60 / days" numeral
      ...range(353, 358), // static blog cards (W4)
      'wp.398', // orphan newsletter string (W5)
    ];
    expect(ids.filter((id) => unread.includes(id))).toEqual([]);
  });

  it('keep the design counts and orders', () => {
    expect(tables.HERO_BENEFITS.flat()).toEqual(range(28, 33));
    expect(
      tables.HERO_CHIPS.flatMap((c) => ('strongId' in c ? [c.strongId, c.restId] : [c.restId])),
    ).toEqual([...range(46, 51), 'wp.052']);
    // W244: the fine chip's lead is the rateConfig figure, never a typed id
    expect(tables.HERO_CHIPS[3]).toEqual({
      icon: 'alert',
      figure: 'illegalEmploymentFine',
      restId: 'wp.052',
    });
    expect(tables.JUMP_LINKS.map((j) => j.hash)).toEqual([
      '#eligibility',
      '#routes',
      '#rules',
      '#muafiyet',
      '#timeline',
      '#costs',
      '#documents',
      '#faq',
    ]);
    expect(tables.JUMP_LINKS.map((j) => j.labelId)).toEqual(range(57, 64));
    expect(tables.ROUTER_CARDS.map((c) => c.href)).toEqual([
      '/hire-workers',
      null,
      '/partner-with-us',
      '/hiring-cost-calculator',
    ]);
    expect(tables.ROUTER_CARDS.flatMap((c) => [c.titleId, c.bodyId, c.ctaId])).toEqual(
      range(85, 96),
    );
    expect(tables.COMPARE_ROWS.map((r) => r.labelId)).toEqual([
      'wp.110',
      'wp.115',
      'wp.120',
      'wp.125',
      'wp.132',
    ]);
    expect(tables.FIXED_TERM_BULLETS).toHaveLength(3);
    expect(tables.OTHER_PERMIT_TYPES.flat()).toEqual(range(176, 183));
    expect(tables.PENALTY_IDS).toEqual(range(196, 199));
    expect(tables.RULES.flatMap((r) => [r.titleId, r.bodyId])).toEqual(range(200, 211));
    expect(tables.EXEMPTION_CARDS.map((c) => c.titleId)).toEqual([
      'wp.220',
      'wp.222',
      'wp.225',
      'wp.228',
      'wp.230',
    ]);
    expect(tables.EXEMPTION_FACTS.flatMap((f) => [f.labelId, f.strongId, f.restId])).toEqual(
      range(234, 245),
    );
    expect(tables.PROCESS_STEPS.map((s) => s.badgeId ?? null)).toEqual([
      null,
      null,
      null,
      'wp.255',
    ]);
    expect(tables.TIMELINE_CARDS.map((c) => [c.key, c.rows.length, c.noteId])).toEqual([
      ['abroad', 4, null],
      ['here', 3, 'wp.280'],
    ]);
    expect(tables.COST_CARDS.map((c) => c.ours)).toEqual([false, false, true]);
    expect(tables.DOC_LISTS.map((l) => [l.key, l.items.length])).toEqual([
      ['employer', 6],
      ['worker', 6],
    ]);
  });

  it('the FAQ is nine pairs in design order; wp.340 has no answer id (its answer is sys copy)', () => {
    expect(tables.FAQ_PAIRS.map((p) => p.qId)).toEqual([
      'wp.334',
      'wp.336',
      'wp.338',
      'wp.340',
      'wp.341',
      'wp.343',
      'wp.345',
      'wp.347',
      'wp.349',
    ]);
    expect(tables.FAQ_PAIRS.map((p) => p.aId)).toEqual([
      'wp.335',
      'wp.337',
      'wp.339',
      null,
      'wp.342',
      'wp.344',
      'wp.346',
      'wp.348',
      'wp.350',
    ]);
    expect(new Set(tables.FAQ_PAIRS.map((p) => p.id)).size).toBe(9);
  });
});
