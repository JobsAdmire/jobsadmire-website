import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  findHardTypedMetrics,
  findLeadingLiraViolations,
  findParityViolations,
  numericTokens,
} from './lint';

const tr = JSON.parse(readFileSync(join(__dirname, 'local/bundle.tr.json'), 'utf8'))
  .strings as Record<string, string>;
const en = JSON.parse(readFileSync(join(__dirname, 'local/bundle.en.json'), 'utf8'))
  .strings as Record<string, string>;
const baseline = JSON.parse(readFileSync(join(__dirname, 'lint-baseline.json'), 'utf8')) as {
  parity: string[];
  leadingLira: string[];
};
const exceptions = JSON.parse(
  readFileSync(join(__dirname, 'lint-exceptions.json'), 'utf8'),
) as Record<string, string>;

describe('numericTokens', () => {
  it('normalises separators so 38,944 and 38.944 compare equal', () => {
    expect(numericTokens('Costs ₺38,944 and 21.75%')).toEqual(['38944', '21.75']);
    expect(numericTokens('Maliyet 38.944 ₺ ve %21,75')).toEqual(['38944', '21.75']);
  });
});

describe('EN↔TR numeric parity (D17)', () => {
  it('has no violations beyond the baseline', () => {
    const now = findParityViolations(tr, en, exceptions).sort();
    const fresh = now.filter((id) => !baseline.parity.includes(id));
    expect(fresh, 'new numeric mismatches — fix the string or document an exception').toEqual([]);
  });
});

describe('TR currency form (D18)', () => {
  it('has no leading-₺ strings beyond the baseline', () => {
    const now = findLeadingLiraViolations(tr).sort();
    expect(now.filter((id) => !baseline.leadingLira.includes(id))).toEqual([]);
  });
});

describe('numbers-out-of-copy (D17)', () => {
  it('flags a string that hard-types a metric value', () => {
    expect(findHardTypedMetrics({ 'x.1': 'We placed 470+ workers' }, { placed: 470 })).toEqual([
      'x.1',
    ]);
    expect(findHardTypedMetrics({ 'x.2': 'Call {placed} now' }, { placed: 470 })).toEqual([]);
  });
});
