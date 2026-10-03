import { describe, expect, it } from 'vitest';
import { MAX_EVIDENCE_BYTES, MAX_EVIDENCE_FILES } from '@/forms/uploads';
import {
  checkEvidence,
  EVIDENCE_ACCEPT,
  EVIDENCE_MAX_BYTES,
  EVIDENCE_MAX_FILES,
  EVIDENCE_MAX_MB,
} from '../evidence';
import { EVIDENCE_KEYS_MAX } from '../fraud';

describe('the client mirror of the server-only caps (W73/W116)', () => {
  it('equals @/forms/uploads — 3 MiB per file, three files, three keys', () => {
    expect(EVIDENCE_MAX_BYTES).toBe(MAX_EVIDENCE_BYTES);
    expect(EVIDENCE_MAX_MB * 1024 * 1024).toBe(MAX_EVIDENCE_BYTES);
    expect(EVIDENCE_MAX_FILES).toBe(MAX_EVIDENCE_FILES);
    expect(EVIDENCE_KEYS_MAX).toBe(MAX_EVIDENCE_FILES);
  });

  it('offers exactly the types the door sniffs', () => {
    expect(EVIDENCE_ACCEPT).toBe('image/jpeg,image/png,image/webp,application/pdf');
  });
});

describe('checkEvidence', () => {
  it('refuses empty, over-cap and declared non-evidence files; lets an undeclared type through', () => {
    expect(checkEvidence({ size: 0, type: 'image/png' })).toBe('empty');
    expect(checkEvidence({ size: EVIDENCE_MAX_BYTES + 1, type: 'image/png' })).toBe('tooBig');
    expect(checkEvidence({ size: 10, type: 'text/plain' })).toBe('badType');
    expect(checkEvidence({ size: 10, type: 'image/heic' })).toBe('badType');
    expect(checkEvidence({ size: 10, type: '' })).toBe('ok'); // the door sniffs the bytes
    expect(checkEvidence({ size: EVIDENCE_MAX_BYTES, type: 'application/pdf' })).toBe('ok');
  });
});
