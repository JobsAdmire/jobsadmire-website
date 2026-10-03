/** W78: the Hire Workers form's "When do you need them?" (`sys.form.labels.startWhen`)
 *  option set — a closed, stable list of values a form posts under `startWhen`, independent
 *  of the label copy in `sys.form.options.startWhen.*` (both message files, W9/W23). */
export const START_WHEN_KEYS = ['asap', 'month1', 'months1to3', 'planning'] as const;
export type StartWhenKey = (typeof START_WHEN_KEYS)[number];
