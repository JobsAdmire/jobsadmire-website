import { describe, expect, it } from 'vitest';
import { collisionsIn, formatCollision, propertyGroup, splitToken } from './class-collisions';

// W122/W155 — the checker's precision cases. They live beside the checker in src/test/, which
// globals.css keeps out of Tailwind's content scan, so the fixture classes below (some used
// nowhere in the app) never become CSS rules. The static scan's own cases and the three brief
// fixtures are in src/design/__tests__/class-collisions.test.ts.
describe('collisionsIn — precision (W122/W155)', () => {
  it('tells text colour from text size and alignment', () => {
    expect(collisionsIn('text-white text-body-sm text-center')).toEqual([]);
    expect(collisionsIn('text-ink text-nav text-left')).toEqual([]);
    expect(collisionsIn('text-blue-safe text-[14px]')).toEqual([]);
    expect(collisionsIn('text-body-sm text-nav').map(formatCollision)).toEqual([
      'font-size — text-body-sm vs text-nav',
    ]);
    expect(collisionsIn('text-success-text text-white').map(formatCollision)).toEqual([
      'color — text-success-text vs text-white',
    ]);
  });

  it('tells a background colour from a background image/size/position, a border colour from a width', () => {
    expect(collisionsIn('bg-ink bg-cover bg-center bg-no-repeat')).toEqual([]);
    expect(collisionsIn('bg-white/10 bg-gradient-to-br')).toEqual([]);
    expect(collisionsIn('border border-t-[3px] border-blue border-dashed')).toEqual([]);
    expect(collisionsIn('border-white/20 border-success/40').map(formatCollision)).toEqual([
      'border-color — border-white/20 vs border-success/40',
    ]);
  });

  it('keeps variant chains apart and lets a longhand follow its shorthand', () => {
    expect(collisionsIn('hidden lg:flex')).toEqual([]);
    expect(collisionsIn('max-xl:hidden inline-flex')).toEqual([]);
    expect(collisionsIn('bg-ink hover:bg-blue-safe')).toEqual([]);
    expect(collisionsIn('m-0 mb-4 gap-3 gap-x-5 border border-t')).toEqual([]);
    expect(collisionsIn('sr-only focus:not-sr-only focus:absolute')).toEqual([]);
    expect(collisionsIn('[&>svg]:h-4 [&>svg]:h-5').map(formatCollision)).toEqual([
      '[&>svg]: height — [&>svg]:h-4 vs [&>svg]:h-5',
    ]);
  });
});

describe('splitToken / propertyGroup', () => {
  it('splits at the last top-level colon, never inside an arbitrary value or variant', () => {
    expect(splitToken('max-xl:hidden')).toEqual({ variants: 'max-xl', utility: 'hidden' });
    expect(splitToken('lg:hover:bg-ink')).toEqual({ variants: 'lg:hover', utility: 'bg-ink' });
    expect(splitToken('[&>svg]:h-4')).toEqual({ variants: '[&>svg]', utility: 'h-4' });
    expect(splitToken('bg-[url(https://x.test/a.png)]')).toEqual({
      variants: '',
      utility: 'bg-[url(https://x.test/a.png)]',
    });
  });

  it('maps only what it is certain of', () => {
    expect(propertyGroup('text-white/70')).toBe('color');
    expect(propertyGroup('text-body-sm')).toBe('font-size');
    expect(propertyGroup('text-center')).toBe('text-align');
    expect(propertyGroup('border-t-[3px]')).toBe('border-top-width');
    expect(propertyGroup('border-tint-border')).toBe('border-color');
    expect(propertyGroup('rounded-sm')).toBe('border-radius');
    expect(propertyGroup('-mt-2')).toBe('margin-top');
    expect(propertyGroup('container-site')).toBeNull();
    expect(propertyGroup('sr-only')).toBeNull();
    expect(propertyGroup('-translate-x-1/2')).toBeNull();
    expect(propertyGroup('border-collapse')).toBeNull();
  });
});
