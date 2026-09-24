import { unstable_rethrow } from 'next/navigation';
import { echoValues } from '../echo';
import type { FormActionState } from '../types';

type FormAction = (prev: FormActionState, data: FormData) => Promise<FormActionState>;

/**
 * The shell's wrapper around the page's server action. A server action that REJECTS in the
 * browser — the browser→Vercel call failed (flaky mobile data), the function timed out, the
 * body was over the size limit (W73) — would otherwise be re-thrown by `useActionState` into
 * the error boundary, and the visitor would lose what they typed. Here it becomes the D11
 * `unavailable` panel with the typed strings echoed from the `FormData` the browser still
 * holds. A Next router error (the D13 success redirect is delivered to the client as a
 * rejection) is rethrown untouched (`unstable_rethrow`), so success still navigates.
 */
export function guardAction(action: FormAction): FormAction {
  return async function guarded(prev, data) {
    try {
      return await action(prev, data);
    } catch (err) {
      unstable_rethrow(err);
      console.error('[forms] the form action rejected', err);
      return {
        status: 'error',
        result: { kind: 'unavailable', cause: 'network' },
        values: echoValues(data),
      };
    }
  };
}
