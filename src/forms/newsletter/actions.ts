'use server';
import { createFormAction } from '@/forms/action';
import type { FormActionState } from '@/forms/types';
import { newsletterSpec } from './spec';

// createFormAction is a factory in a `server-only` module; a 'use server' module may export only
// async functions, so the runner stays module-private (docs/ARCHITECTURE.md § Forms flow).
const runNewsletter = createFormAction(newsletterSpec);

/** The newsletter band's form → `newsletter` (success: /tesekkurler?form=newsletter, D13). */
export async function submitNewsletter(
  prev: FormActionState,
  data: FormData,
): Promise<FormActionState> {
  return runNewsletter(prev, data);
}
