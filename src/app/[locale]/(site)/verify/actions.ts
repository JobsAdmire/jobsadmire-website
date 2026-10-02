'use server';
import { headers } from 'next/headers';
import {
  createFormAction,
  FormActionError,
  FormDoorError,
  visitorOf,
  type FormActionState,
} from '@/forms/action';
import { isFile, uploadFraudEvidence } from '@/forms/uploads';
import type { EvidenceUploadResult } from './_lib/evidence';
import { fraudFields, fraudSchema } from './_lib/fraud';

/** The fraud report (W3/W79). The evidence is already uploaded by the island — its keys ride in
 *  `evidenceKeys` (W101) — so `toFields` only maps names; nothing uploads here. */
const fraud = createFormAction({
  key: 'fraud',
  schema: fraudSchema,
  toFields: (parsed) => fraudFields(parsed),
  consent: 'checkbox',
});

export async function submitFraud(prev: FormActionState, data: FormData): Promise<FormActionState> {
  return fraud(prev, data);
}

/**
 * W73/W101/W116: ONE evidence file per call — a Vercel function body is capped at 4.5 MB and the
 * server-action body at 4 MB, so three 3 MiB files could never share one. The island posts a
 * FormData with a single `file` part; `uploadFraudEvidence` refuses an empty or over-3 MiB file
 * (`FormActionError`), calls the door with the write token and the visitor's own IP/UA, and maps
 * a door failure to `FormDoorError`. The answer carries the key only — never the bytes, never an
 * object URL. One attempt: a retry would upload the bytes twice.
 */
export async function uploadEvidence(data: FormData): Promise<EvidenceUploadResult> {
  const file = data.get('file');
  if (!isFile(file)) return { ok: false, reason: 'file' };
  try {
    const { key } = await uploadFraudEvidence(file, visitorOf(await headers()));
    return { ok: true, key };
  } catch (err) {
    if (err instanceof FormActionError) return { ok: false, reason: 'file' };
    if (err instanceof FormDoorError) return { ok: false, reason: 'door' };
    console.error('[verify] evidence upload failed', err);
    return { ok: false, reason: 'door' };
  }
}
