import { describe, expect, it } from 'vitest';
import { FLAG_CODES } from '../src/design/assets/flag-codes';
import { buildFlagSprite } from './build-flags';

describe('build-flags', () => {
  const sprite = buildFlagSprite();

  it('emits one <symbol id="flag-<CODE>"> per flag code (13 source countries + TR)', () => {
    expect(FLAG_CODES).toHaveLength(14);
    for (const code of FLAG_CODES) {
      expect(sprite).toContain(`<symbol id="flag-${code}" viewBox="0 0 640 480">`);
    }
    expect((sprite.match(/<symbol id="flag-/g) ?? []).length).toBe(14);
    expect(sprite).not.toContain('id="flag-pk"'); // W40: upper-case ids only
  });

  it('strips every source root <svg> and never repeats an id', () => {
    expect(sprite.startsWith('<svg xmlns="http://www.w3.org/2000/svg"')).toBe(true);
    expect(sprite).not.toContain('id="flag-icons-'); // flag-icons' own root id must not survive
    const ids = [...sprite.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('is deterministic', () => {
    expect(buildFlagSprite()).toBe(sprite);
  });
});
