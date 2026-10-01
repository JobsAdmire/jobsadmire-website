'use server';
import { createFormAction } from '@/forms/action';
import type { FormActionState } from '@/forms/types';
import { callbackSpec, hireSpec } from './lib/forms';

// createFormAction is a factory in a `server-only` module; a 'use server' module may export only
// async functions, so the two runners stay module-private (docs/ARCHITECTURE.md § Forms flow).
const runHire = createFormAction(hireSpec);
const runCallback = createFormAction(callbackSpec);

/** The hero card's proposal form → `hire` (success: /tesekkurler?form=hire, D13). */
export async function submitHire(prev: FormActionState, data: FormData): Promise<FormActionState> {
  return runHire(prev, data);
}

/** The phone-only call-me-back form → `callback` (success: /tesekkurler?form=callback). */
export async function submitCallback(
  prev: FormActionState,
  data: FormData,
): Promise<FormActionState> {
  return runCallback(prev, data);
}
