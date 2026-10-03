'use server';
import { createFormAction, type FormActionState } from '@/forms/action';
import {
  hrAgencySchema,
  hrAgencyToFields,
  instituteSchema,
  instituteToFields,
  sourcingSchema,
  sourcingToFields,
} from './_lib/forms';

/** HR-agency track → `hire` + `iAm: 'hr_agency'` (W3): the Turkey sales team's inquiry. W79: a
 *  consent checkbox like every door form. Success → `/thank-you?form=hire` (D13). */
const runHrAgency = createFormAction({
  key: 'hire',
  schema: hrAgencySchema,
  consent: 'checkbox',
  toFields: (p) => hrAgencyToFields(p),
});

/** Sourcing-partner track → `partner` + `track: 'sourcing'` (W16); the declaration tick is the
 *  schema's, the consent tick the kernel's. */
const runSourcing = createFormAction({
  key: 'partner',
  schema: sourcingSchema,
  consent: 'checkbox',
  toFields: (p) => sourcingToFields(p),
});

/** Institute track → `partner` + `track: 'institute'` (W16). */
const runInstitute = createFormAction({
  key: 'partner',
  schema: instituteSchema,
  consent: 'checkbox',
  toFields: (p) => instituteToFields(p),
});

export async function submitHrAgency(
  prev: FormActionState,
  data: FormData,
): Promise<FormActionState> {
  return runHrAgency(prev, data);
}

export async function submitSourcingPartner(
  prev: FormActionState,
  data: FormData,
): Promise<FormActionState> {
  return runSourcing(prev, data);
}

export async function submitInstitute(
  prev: FormActionState,
  data: FormData,
): Promise<FormActionState> {
  return runInstitute(prev, data);
}
