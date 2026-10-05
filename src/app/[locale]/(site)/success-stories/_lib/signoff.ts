import type { MetricKey } from '@/content/collections';

/**
 * W1: the design's four hero figures (1,240+ workers placed / 68 employers since 2019 /
 * 41 days to first shift / 91 % still employed at 12 months) are not signed metrics — and
 * success.029 ("since 2019") contradicts the licence date the About page carries. The list is
 * therefore EMPTY, and the hero shows the design's four stat cards with their sample figures
 * under the sample tag (`HeroStats`, `_lib/sample.ts` — parity pass, owner 2026-10-05). When the
 * owner signs a page metric it is emitted under a `METRIC_KEYS` entry and listed here, and the
 * hero renders it through `MetricStrip` instead; `__tests__/signoff.test.ts` pins the state.
 */
export const STORIES_HERO_METRICS: MetricKey[] = [];

/** The "Numbers we do not hide" box (success.046–057): four negative KPIs with a body line each.
 *  Unsigned (W1) → empty → `NumbersBox` shows the design's sample figures under the sample tag.
 *  Shape kept so signing one is a data edit (the signed rows then replace the sample). */
export type NegativeKpi = { key: MetricKey; labelId: string; bodyId: string };
export const NEGATIVE_KPIS: NegativeKpi[] = [];

/** §10 row 11: the two worker stories (success.070–078) narrate two identifiable people — a
 *  name-shaped card title and "she reported it" — a different privacy question from a bare
 *  approval count. Parity pass (owner 2026-10-05): the section shows as the design's sample with
 *  the sample tag; only `published && WORKER_STORIES_CONSENTED` (never `published` alone) drops
 *  the tag and presents them as real. Flip to `true` only once the owner signs the consent off. */
export const WORKER_STORIES_CONSENTED = false;
