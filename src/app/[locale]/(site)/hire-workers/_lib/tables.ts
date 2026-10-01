import type { SectorKey } from '@/content/collections';

/**
 * The page's markup-only structures as id tables (docs/CONTENT-MODEL.md § Collections: the
 * grouping of role chips, the comparison pairs, the process steps and the FAQ pairs exist in
 * the design only as markup, so Phase A carries them as page-local constants over package
 * ids — never as copy). Every id here is a real `hire.*` id (asserted by tables.test.ts).
 */
export type IndustryRow = {
  key: Exclude<SectorKey, 'other'>;
  /** the chips the design shows in the row at rest */
  visibleRoleIds: readonly string[];
  /** the chips inside the design's expanded panel under hire.136 */
  moreRoleIds: readonly string[];
  ctaId: string;
};

export const INDUSTRIES: readonly IndustryRow[] = [
  {
    key: 'factory',
    visibleRoleIds: ['hire.089', 'hire.090', 'hire.091', 'hire.092'],
    moreRoleIds: ['hire.093', 'hire.094', 'hire.095', 'hire.096'],
    ctaId: 'hire.130',
  },
  {
    key: 'construction',
    visibleRoleIds: ['hire.097', 'hire.098', 'hire.099', 'hire.100'],
    moreRoleIds: ['hire.101', 'hire.102', 'hire.103', 'hire.104'],
    ctaId: 'hire.131',
  },
  {
    // The design repeats rRecept (hire.108) in the row and the panel; it is listed once.
    key: 'tourism',
    visibleRoleIds: ['hire.105', 'hire.106', 'hire.107', 'hire.108'],
    moreRoleIds: ['hire.109', 'hire.110', 'hire.111'],
    ctaId: 'hire.132',
  },
  {
    key: 'agriculture',
    visibleRoleIds: ['hire.112', 'hire.113', 'hire.114'],
    moreRoleIds: ['hire.115', 'hire.116', 'hire.117'],
    ctaId: 'hire.133',
  },
  {
    key: 'textile',
    visibleRoleIds: ['hire.118', 'hire.119', 'hire.120'],
    moreRoleIds: ['hire.121', 'hire.122', 'hire.123'],
    ctaId: 'hire.134',
  },
  {
    key: 'logistics',
    visibleRoleIds: ['hire.124', 'hire.125', 'hire.126'],
    moreRoleIds: ['hire.127', 'hire.128', 'hire.129'],
    ctaId: 'hire.135',
  },
];

export type CompareRow = { titleId: string; bodyId: string };
export const COMPARE_ROWS: { own: readonly CompareRow[]; with: readonly CompareRow[] } = {
  own: [
    { titleId: 'hire.150', bodyId: 'hire.151' },
    { titleId: 'hire.152', bodyId: 'hire.153' },
    { titleId: 'hire.154', bodyId: 'hire.155' },
    { titleId: 'hire.156', bodyId: 'hire.157' },
    { titleId: 'hire.158', bodyId: 'hire.159' },
  ],
  with: [
    { titleId: 'hire.160', bodyId: 'hire.161' },
    { titleId: 'hire.162', bodyId: 'hire.163' },
    { titleId: 'hire.164', bodyId: 'hire.165' },
    { titleId: 'hire.166', bodyId: 'hire.167' },
    { titleId: 'hire.168', bodyId: 'hire.169' },
  ],
};

export type ProcessStepIds = { n: number; whenId: string; titleId: string; bodyId: string };
export const PROCESS_STEPS: readonly ProcessStepIds[] = [1, 2, 3, 4, 5, 6].map((n) => {
  const base = 271 + (n - 1) * 3;
  return { n, whenId: `hire.${base}`, titleId: `hire.${base + 1}`, bodyId: `hire.${base + 2}` };
});

export type FaqPairIds = { id: string; qId: string; aId: string };
export const FAQ_PAIRS: readonly FaqPairIds[] = [1, 2, 3, 4, 5, 6, 7].map((n) => ({
  id: `q${n}`,
  qId: `hire.${289 + (n - 1) * 2}`,
  aId: `hire.${290 + (n - 1) * 2}`,
}));
