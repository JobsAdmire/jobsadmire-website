'use server';
import { createFormAction, type FormActionState } from '@/forms/action';
import { WORKERS_SPEC } from './_lib/spec';

const run = createFormAction(WORKERS_SPEC);

/** The Available Workers request → Operations `POST /api/website/v1/forms/workers` (INQUIRY).
 *  Success redirects to `/tesekkurler?form=workers` (D13); every failure is the kernel's
 *  fallback panel (D11). A `'use server'` module may export only async functions, which is why
 *  the factory call sits outside (`src/forms/action.ts` is `server-only`, not `'use server'`). */
export async function submitWorkers(
  prev: FormActionState,
  data: FormData,
): Promise<FormActionState> {
  return run(prev, data);
}
