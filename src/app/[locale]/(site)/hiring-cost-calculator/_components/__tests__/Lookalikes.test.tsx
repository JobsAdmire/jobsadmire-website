import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Stepper } from '@/design/islands/Stepper';
import { RadioChips } from '@/design/primitives/RadioChips';
import { HEADCOUNT_OPTIONS } from '../card-ui';
import { ChipsLook, StepperLook } from '../Lookalikes';

/**
 * Final pass B4 (W190 A1c): the server skeleton's look-alikes must wear exactly the `stretch`
 * classes the live primitives wear, or the LazyIsland swap would move the headcount row at
 * ≤ 700 px. The island and the skeleton pass `stretch` to the headcount row only (the design's
 * `.ja-cc-head` / `.ja-cc-hchips` rules), never to the contract/cover/tier chips.
 */
const stretchTokens = (root: Element) =>
  [...root.querySelectorAll('*')]
    .flatMap((el) => (el.getAttribute('class') ?? '').split(/\s+/))
    .filter((c) => c.startsWith('max-md:'))
    .sort();

const DIR = join(process.cwd(), 'src/app/[locale]/(site)/hiring-cost-calculator/_components');

describe('calculator look-alikes mirror the primitives (B4)', () => {
  it('StepperLook stretch carries the same ≤ 700 px classes as Stepper stretch', () => {
    const live = render(
      <Stepper
        id="h"
        label="Headcount"
        value={5}
        onChange={() => {}}
        min={1}
        max={500}
        decrementLabel="Fewer"
        incrementLabel="More"
        stretch
      />,
    );
    const look = render(<StepperLook value="5" stretch />);
    const liveTokens = stretchTokens(live.container);
    expect(liveTokens.length).toBeGreaterThan(0);
    expect(stretchTokens(look.container)).toEqual(liveTokens);
    expect(stretchTokens(render(<StepperLook value="5" />).container)).toEqual([]);
  });

  it('ChipsLook stretch carries the same ≤ 700 px classes as RadioChips stretch', () => {
    const live = render(
      <RadioChips
        name="p"
        legend="Presets"
        options={HEADCOUNT_OPTIONS}
        value="5"
        onChange={() => {}}
        stretch
      />,
    );
    const look = render(<ChipsLook options={HEADCOUNT_OPTIONS} value="5" stretch />);
    const liveTokens = stretchTokens(live.container);
    expect(liveTokens.length).toBeGreaterThan(0);
    expect(stretchTokens(look.container)).toEqual(liveTokens);
    expect(
      stretchTokens(render(<ChipsLook options={HEADCOUNT_OPTIONS} value="5" />).container),
    ).toEqual([]);
  });

  /** The JSX element that contains `marker` — from its `<Tag` to its `/>` (props hold `>` in
   *  `=>` and `[&>label]`, so no `[^>]*`). */
  const element = (source: string, tag: string, marker: string) => {
    const at = source.indexOf(marker);
    expect(at, marker).toBeGreaterThan(-1);
    const start = source.lastIndexOf(`<${tag}`, at);
    const end = source.indexOf('/>', at);
    return source.slice(start, end);
  };

  it('the island and the skeleton pass stretch to the headcount row only', () => {
    const island = readFileSync(join(DIR, 'CalculatorIsland.tsx'), 'utf8');
    const skeleton = readFileSync(join(DIR, 'CalculatorSkeleton.tsx'), 'utf8');
    expect(element(island, 'Stepper', 'id="calc-headcount"')).toMatch(/\bstretch\b/);
    expect(element(island, 'RadioChips', 'name="calc-headcount-preset"')).toMatch(/\bstretch\b/);
    expect((island.match(/\bstretch\b/g) ?? []).length).toBe(2);
    expect(element(skeleton, 'StepperLook', '<StepperLook')).toMatch(/\bstretch\b/);
    expect(element(skeleton, 'ChipsLook', 'options={HEADCOUNT_OPTIONS}')).toMatch(/\bstretch\b/);
    expect((skeleton.match(/\bstretch\b/g) ?? []).length).toBe(2);
  });
});
