/**
 * The evidence island's client-side mirror of the server-only caps in `@/forms/uploads`
 * (`MAX_EVIDENCE_BYTES` = `MAX_UPLOAD_BYTES` = 3 MiB, W73/W116; `MAX_EVIDENCE_FILES` = 3). A
 * client module cannot import that file (`server-only`), so the values are repeated here and
 * pinned equal by `evidence.test.ts`. The browser refuses what the server would refuse anyway,
 * before a byte is sent; `uploadFraudEvidence` checks again — the browser is never trusted.
 */
export const EVIDENCE_MAX_BYTES = 3 * 1024 * 1024;
export const EVIDENCE_MAX_MB = 3;
export const EVIDENCE_MAX_FILES = 3;
/** What the door's sniffer accepts; HEIC is refused there, so it is not offered here. */
export const EVIDENCE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'] as const;
export const EVIDENCE_ACCEPT = EVIDENCE_TYPES.join(',');

export type EvidenceCheck = 'ok' | 'empty' | 'tooBig' | 'badType';

/** The pre-upload check. A blank `type` (some browsers leave it empty) goes to the server, whose
 *  door sniffs the bytes — only a declared non-evidence type is refused here. */
export function checkEvidence(file: { size: number; type: string }): EvidenceCheck {
  if (file.size === 0) return 'empty';
  if (file.size > EVIDENCE_MAX_BYTES) return 'tooBig';
  if (file.type !== '' && !(EVIDENCE_TYPES as readonly string[]).includes(file.type))
    return 'badType';
  return 'ok';
}

/** What the page's `'use server'` `uploadEvidence` answers for one file: the storage key, or why
 *  not — `file` (refused: type, size or unreadable; the visitor can pick another) or `door`
 *  (unconfigured, paused or unreachable; the report can still go without it). */
export type EvidenceUploadResult =
  { ok: true; key: string } | { ok: false; reason: 'file' | 'door' };
export type UploadEvidenceAction = (data: FormData) => Promise<EvidenceUploadResult>;
