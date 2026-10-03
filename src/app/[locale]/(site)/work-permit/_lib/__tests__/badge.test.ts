import { describe, expect, it } from 'vitest';
import { RATE } from '@/lib/calculator/__tests__/fixtures';
import { heroBadge } from '../badge';
import { sysFor } from './helpers';

describe('heroBadge — the D17 dated badge (W150)', () => {
  const before = new Date('2026-09-28T09:00:00Z');

  it('reads the month from rateConfig.updatedAt, never a typed date (wp.022 is unread)', () => {
    expect(heroBadge(RATE, 'tr', sysFor('tr'), before)).toBe(
      'Güncelleme: Ocak 2026 · JobsAdmire izin ekibi tarafından incelendi',
    );
    expect(heroBadge(RATE, 'en', sysFor('en'), before)).toBe(
      'Updated January 2026 · Reviewed by the JobsAdmire permit team',
    );
  });

  it('disappears from reviewDueAt 00:00 UTC on', () => {
    expect(heroBadge(RATE, 'tr', sysFor('tr'), new Date('2026-12-19T23:59:59Z'))).not.toBeNull();
    expect(heroBadge(RATE, 'tr', sysFor('tr'), new Date('2026-12-20T00:00:00Z'))).toBeNull();
  });
});
