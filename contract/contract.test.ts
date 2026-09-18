import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { BundleSchema, CONTRACT_VERSION } from './website-bundle.v1';

// Recompute deliberately when the contract changes (see CONTRACT.md). Operations pins the same value.
export const CONTRACT_FILE_SHA256 =
  'b407d92f39ab560e4c256ec2e7d1cd5d36f6166281b9d1dfdd178ede01319dcf';

describe('content contract', () => {
  it('schema file matches the pinned hash', () => {
    const sha = createHash('sha256')
      .update(readFileSync(join(__dirname, 'website-bundle.v1.ts')))
      .digest('hex');
    expect(sha).toBe(CONTRACT_FILE_SHA256);
  });
  it('the golden fixture validates', () => {
    const fixture = JSON.parse(
      readFileSync(join(__dirname, 'website-bundle.v1.fixture.json'), 'utf8'),
    );
    expect(fixture.contractVersion).toBe(CONTRACT_VERSION);
    expect(() => BundleSchema.parse(fixture)).not.toThrow();
  });
  it('both generated local bundles validate', () => {
    for (const l of ['tr', 'en']) {
      const b = JSON.parse(
        readFileSync(join(__dirname, '..', 'src', 'content', 'local', `bundle.${l}.json`), 'utf8'),
      );
      expect(() => BundleSchema.parse(b), l).not.toThrow();
    }
  });
});
