import { describe, expect, it } from 'vitest';
import {
  composeWorkersMessage,
  MAX_PROFILE_REFS,
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
    expect(composeWorkersMessage('   ', ' , ;; ')).toBe('');
  });

  it('parses opaque refs as sent: de-duplicates, keeps order and case, drops what is not ref-shaped', () => {
    expect(
      parseProfileRefs('JA-1042, C7K2M9QX JA-1042; <b>x</b>; -lead; JA-1050, ' + 'x'.repeat(33)),
    ).toEqual(['JA-1042', 'C7K2M9QX', 'JA-1050']);
    expect(parseProfileRefs('ja-1042')).toEqual(['ja-1042']); // opaque: case is kept
    expect(parseProfileRefs(undefined)).toEqual([]);
  });

  it(`keeps at most ${MAX_PROFILE_REFS} refs`, () => {
    const many = Array.from({ length: 80 }, (_, i) => `JA-${1000 + i}`).join(', ');
    expect(parseProfileRefs(many)).toHaveLength(MAX_PROFILE_REFS);
  });

  it('prepends the refs line and a blank line; the refs alone when the message is empty', () => {
    expect(composeWorkersMessage('Two welders.', 'JA-1042, C7K2M9QX')).toBe(
      `${PROFILE_REFS_PREFIX}JA-1042, C7K2M9QX\n\nTwo welders.`,
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
