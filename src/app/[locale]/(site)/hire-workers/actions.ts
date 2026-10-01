'use server';
import { getBundle } from '@/content/adapter';
import { getCollection } from '@/content/collections';
import { createFormAction, type FormActionState } from '@/forms/action';
import { fullSchema, fullToFields, quickSchema, quickToFields } from './_lib/hire-spec';

/** Hero quick-quote → `hire` (W3: + contact `name`; W16: `city`). W79: a consent checkbox like
 *  every door form — the kernel's `notice` mode is not used in Phase A. */
const runQuick = createFormAction({
  key: 'hire',
  schema: quickSchema,
  consent: 'checkbox',
  toFields: (p) => quickToFields(p),
});

/** Request form → `hire`. The dial → country lookup reads the request locale's `countries`
 *  collection (the rows differ per locale only in `name`). */
const runFull = createFormAction({
  key: 'hire',
  schema: fullSchema,
  consent: 'checkbox',
  toFields: async (p, _data, { locale }) =>
    fullToFields(p, getCollection(await getBundle(locale), 'countries')),
});

export async function submitHireQuick(
  prev: FormActionState,
  data: FormData,
): Promise<FormActionState> {
  return runQuick(prev, data);
}

export async function submitHireFull(
  prev: FormActionState,
  data: FormData,
): Promise<FormActionState> {
  return runFull(prev, data);
}
