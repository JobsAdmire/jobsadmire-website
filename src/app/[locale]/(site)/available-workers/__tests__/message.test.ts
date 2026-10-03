import { describe, expect, it } from 'vitest';
import {
  composeWorkersMessage,
  MESSAGE_MAX,
  parseProfileRefs,
  PROFILE_REFS_PREFIX,
} from '../_lib/message';

describe('composeWorkersMessage — basket refs folded into `message` (no catalog field)', () => {
  it('returns the trimmed message alone when there are no refs (Phase A: no basket)', () => {
    expect(composeWorkersMessage('  Two welders for Antalya.  ')).toBe('Two welders for Antalya.');
    expect(composeWorkersMessage('x', '')).toBe('x');
    expect(composeWorkersMessage('x', undefined)).toBe('x');
  });

  it('returns an empty string when there is neither a message nor a ref (the field is then omitted)', () => {
    expect(composeWorkersMessage(undefined)).toBe('');
    expect(composeWorkersMessage('   ', 'not-a-ref')).toBe('');
  });

  it('parses refs case-insensitively, de-duplicates, keeps order, drops junk', () => {
    expect(parseProfileRefs('ja-1042, JA-1050 ja-1042; JA-9; DROP TABLE; JA-1050')).toEqual([
      'JA-1042',
      'JA-1050',
    ]);
    expect(parseProfileRefs(undefined)).toEqual([]);
  });

  it('prepends the refs line and a blank line; the refs alone when the message is empty', () => {
    expect(composeWorkersMessage('Two welders.', 'ja-1042, JA-1050')).toBe(
      `${PROFILE_REFS_PREFIX}JA-1042, JA-1050\n\nTwo welders.`,
    );
    expect(composeWorkersMessage('', 'JA-1042')).toBe(`${PROFILE_REFS_PREFIX}JA-1042`);
  });

  it('never exceeds the door cap (message ≤ 5,000)', () => {
    expect(MESSAGE_MAX).toBe(5000);
    const out = composeWorkersMessage('a'.repeat(6000), 'JA-1042');
    expect(out.length).toBe(MESSAGE_MAX);
    expect(out.startsWith(`${PROFILE_REFS_PREFIX}JA-1042`)).toBe(true);
  });
});
