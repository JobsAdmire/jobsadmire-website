import { describe, expect, it } from 'vitest';
import { METRIC_KEYS } from '@/content/collections';
import { NEGATIVE_KPIS, STORIES_HERO_METRICS, WORKER_STORIES_CONSENTED } from '../_lib/signoff';

// W1: the design's four hero figures (1,240+ workers placed / 68 employers since 2019 /
// 41 days to first shift / 91 % still employed at 12 months) and its four negative KPIs
// (7 % / +19 days / 4 % / 11) are not signed metrics — success.029 ("since 2019") also
// contradicts the licence date the About page carries. The hero strip and the KPI box
// therefore read empty lists and render nothing (W6). §10 row 11 additionally withholds the
// worker stories — they narrate two identifiable people — behind their own consent flag,
// separate from `published`. Signing a metric or consenting the worker stories is a data
// edit to this one file, in the same commit as the pin below.
describe('Success Stories owner sign-offs (W1, §10 row 11)', () => {
  it('lists no hero metric and no negative KPI until the owner signs them', () => {
    expect(STORIES_HERO_METRICS).toEqual([]);
    expect(NEGATIVE_KPIS).toEqual([]);
  });
  it('can only ever name real metric keys', () => {
    for (const k of STORIES_HERO_METRICS) expect(METRIC_KEYS).toContain(k);
    for (const k of NEGATIVE_KPIS) expect(METRIC_KEYS).toContain(k.key);
  });
  it('keeps the worker stories unconsented until the owner signs them off', () => {
    expect(WORKER_STORIES_CONSENTED).toBe(false);
  });
});
