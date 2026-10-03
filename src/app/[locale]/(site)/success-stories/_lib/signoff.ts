import type { MetricKey } from '@/content/collections';

/**
 * W1: the design's four hero figures (1,240+ workers placed / 68 employers since 2019 /
 * 41 days to first shift / 91 % still employed at 12 months) are not signed metrics — and
 * success.029 ("since 2019") contradicts the licence date the About page carries. The hero
 * strip therefore reads an EMPTY list and `MetricStrip` renders nothing (W6). When the owner
 * signs a page metric it is emitted under a `METRIC_KEYS` entry and listed here;
 * `__tests__/signoff.test.ts` pins the current state.
 */
export const STORIES_HERO_METRICS: MetricKey[] = [];

/** The "Numbers we do not hide" box (success.046–057): four negative KPIs with a body line each.
 *  Unsigned (W1) → empty → `NumbersBox` returns null. Shape kept so signing one is a data edit. */
export type NegativeKpi = { key: MetricKey; labelId: string; bodyId: string };
export const NEGATIVE_KPIS: NegativeKpi[] = [];

/** §10 row 11: the two worker stories (success.070–078) narrate two identifiable people — a
 *  name-shaped card title and "she reported it" — a different privacy question from a bare
 *  approval count. `WorkerStories` therefore gates on `published && WORKER_STORIES_CONSENTED`,
 *  never on `published` alone: an approval appearing on the wall does not by itself authorise
 *  naming the two workers. Flip to `true` only once the owner signs the consent off. */
export const WORKER_STORIES_CONSENTED = false;
