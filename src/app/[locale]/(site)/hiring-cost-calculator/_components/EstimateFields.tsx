'use client';
import { estimateFieldValues } from '../_lib/estimate-inputs';
import { useEstimateInputs } from './estimate-store';

/** The store's state as hidden inputs inside the quote form — the server action reparses and
 *  recomputes them (`_lib/quote.ts`). The `est_*` names are no catalog names and are not in the
 *  fallback panel's WhatsApp field list, so they never reach a prefill. */
export function EstimateFields() {
  const inputs = useEstimateInputs();
  return (
    <>
      {estimateFieldValues(inputs).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} readOnly />
      ))}
    </>
  );
}
