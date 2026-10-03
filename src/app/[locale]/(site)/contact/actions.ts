'use server';
// The Contact page's three server actions (W3): the kernel's `createFormAction` (server-only)
// wrapped in this `'use server'` module — one exported async function per form, the only exports
// a `'use server'` module may carry. The specs are pure and tested in ./_lib/forms.ts; the kernel
// checks the consent tick (W79), validates, posts, and redirects to /tesekkurler?form=<key> (D13).
import { createFormAction, type FormActionState } from '@/forms/action';
import {
  callbackSchema,
  contactSchema,
  toCallbackFields,
  toContactFields,
  toVisitFields,
  visitSchema,
} from './_lib/forms';

const runContact = createFormAction({
  key: 'contact',
  schema: contactSchema,
  toFields: toContactFields,
  consent: 'checkbox',
});
const runCallback = createFormAction({
  key: 'callback',
  schema: callbackSchema,
  toFields: toCallbackFields,
  consent: 'checkbox',
});
const runVisit = createFormAction({
  key: 'visit',
  schema: visitSchema,
  toFields: toVisitFields,
  consent: 'checkbox',
});

export async function submitContact(
  prev: FormActionState,
  data: FormData,
): Promise<FormActionState> {
  return runContact(prev, data);
}

export async function submitCallback(
  prev: FormActionState,
  data: FormData,
): Promise<FormActionState> {
  return runCallback(prev, data);
}

export async function submitVisit(prev: FormActionState, data: FormData): Promise<FormActionState> {
  return runVisit(prev, data);
}
