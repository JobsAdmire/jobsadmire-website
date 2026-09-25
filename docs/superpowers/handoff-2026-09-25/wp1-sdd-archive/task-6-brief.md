### Task 6: Content adapter (`LOCAL` | `OPS`) with the production fixture guard

**Files:**

- Create: `src/content/adapter.ts`, `src/content/adapter.test.ts`, `src/content/config.ts`
- Modify: `.env.example` (create)

**Interfaces:**

- Consumes: `BundleSchema`, `Bundle` (Task 5), local bundle JSON (Task 4).
- Produces: `getBundle(locale: Locale): Promise<Bundle>` (cached per request via React `cache`), `makeT(bundle: Bundle): (id: string) => string`, `contentSource(): 'LOCAL' | 'OPS'`, error class `BundleUnavailableError`.

- [ ] **Step 1: Failing tests**

`src/content/adapter.test.ts`:

```ts
import { afterEach, describe, expect, it, vi } from 'vitest';
import { makeT, contentSource, assertServableInProduction } from './adapter';
import type { Bundle } from '../../contract/website-bundle.v1';
import fixture from '../../contract/website-bundle.v1.fixture.json';

const bundle = fixture as Bundle;

describe('makeT', () => {
  it('returns the value for a known id', () => {
    expect(makeT(bundle)('home.001')).toBe(bundle.strings['home.001']);
  });
  it('returns an empty string for a deliberately empty value (no English fallback)', () => {
    expect(makeT({ ...bundle, strings: { ...bundle.strings, 'calc.041': '' } })('calc.041')).toBe(
      '',
    );
  });
  it('throws in development for an unknown id', () => {
    vi.stubEnv('NODE_ENV', 'development');
    expect(() => makeT(bundle)('nope.001')).toThrow(/unknown string id/);
  });
});

describe('contentSource', () => {
  afterEach(() => vi.unstubAllEnvs());
  it('defaults to LOCAL', () => {
    vi.stubEnv('CONTENT_SOURCE', '');
    expect(contentSource()).toBe('LOCAL');
  });
  it('is OPS only when OPS_API_URL and the read token exist', () => {
    vi.stubEnv('CONTENT_SOURCE', 'OPS');
    vi.stubEnv('OPS_API_URL', 'https://operations.jobsadmire.com');
    vi.stubEnv('OPS_WEBSITE_READ_TOKEN', 'x'.repeat(40));
    expect(contentSource()).toBe('OPS');
  });
});

describe('assertServableInProduction (D23)', () => {
  it('refuses pool/stories/representatives collections from LOCAL in production', () => {
    const b: Bundle = { ...bundle, collections: { pool: [{ publicRef: 'x' }] } };
    expect(() => assertServableInProduction(b, 'LOCAL', 'production')).toThrow(
      /never served from LOCAL/,
    );
    expect(() => assertServableInProduction(b, 'OPS', 'production')).not.toThrow();
    expect(() => assertServableInProduction(b, 'LOCAL', 'development')).not.toThrow();
  });
});
```

Run: `npm run test -- src/content/adapter.test.ts` Expected: FAIL.

- [ ] **Step 2: Implement**

`src/content/config.ts`:

```ts
export type ContentSource = 'LOCAL' | 'OPS';
export const FIXTURE_ONLY_COLLECTIONS = ['pool', 'stories', 'representatives'] as const;

export function contentSource(): ContentSource {
  const wanted = process.env.CONTENT_SOURCE === 'OPS';
  const configured =
    Boolean(process.env.OPS_API_URL) && (process.env.OPS_WEBSITE_READ_TOKEN?.length ?? 0) >= 32;
  return wanted && configured ? 'OPS' : 'LOCAL';
}
```

`src/content/adapter.ts`:

```ts
import 'server-only';
import { cache } from 'react';
import type { Locale } from '@/i18n/routing';
import { BundleSchema, type Bundle } from '../../contract/website-bundle.v1';
import { contentSource, FIXTURE_ONLY_COLLECTIONS, type ContentSource } from './config';

export { contentSource };

export class BundleUnavailableError extends Error {}

export function assertServableInProduction(
  bundle: Bundle,
  source: ContentSource,
  env = process.env.NODE_ENV,
) {
  if (env !== 'production' || source === 'OPS') return;
  const offending = FIXTURE_ONLY_COLLECTIONS.filter(
    (k) => (bundle.collections[k]?.length ?? 0) > 0,
  );
  if (offending.length)
    throw new Error(
      `collections ${offending.join(', ')} are never served from LOCAL in production (D23)`,
    );
}

async function loadLocal(locale: Locale): Promise<Bundle> {
  const raw = (await import(`./local/bundle.${locale}.json`)).default as unknown;
  return BundleSchema.parse(raw);
}

async function loadOps(locale: Locale): Promise<Bundle> {
  const res = await fetch(`${process.env.OPS_API_URL}/api/website/v1/bundle?locale=${locale}`, {
    headers: { Authorization: `Bearer ${process.env.OPS_WEBSITE_READ_TOKEN}` },
    next: { revalidate: 900, tags: [`site:${locale}`] }, // time floor + tag (D8)
  });
  if (!res.ok) throw new BundleUnavailableError(`bundle ${locale}: HTTP ${res.status}`);
  const parsed = BundleSchema.safeParse(await res.json());
  if (!parsed.success)
    throw new BundleUnavailableError(
      `bundle ${locale}: contract violation ${parsed.error.issues[0]?.path.join('.')}`,
    );
  return parsed.data;
}

/** One bundle per locale per request (React cache); ISR keeps last-good HTML when OPS fails. */
export const getBundle = cache(async (locale: Locale): Promise<Bundle> => {
  const source = contentSource();
  const bundle = source === 'OPS' ? await loadOps(locale) : await loadLocal(locale);
  assertServableInProduction(bundle, source);
  return bundle;
});

/** Content strings by package id. Empty values are legitimate (six TR fragments) and returned as ''. */
export function makeT(bundle: Bundle) {
  return (id: string): string => {
    const v = bundle.strings[id];
    if (v === undefined) {
      if (process.env.NODE_ENV !== 'production') throw new Error(`unknown string id: ${id}`);
      return '';
    }
    return v;
  };
}
```

`.env.example`:

```
# Content source: LOCAL (design-package bundles, Phase A) or OPS (Operations CMS, Phase B)
CONTENT_SOURCE=LOCAL
OPS_API_URL=https://operations.jobsadmire.com
OPS_WEBSITE_READ_TOKEN=
OPS_WEBSITE_WRITE_TOKEN=
REVALIDATE_SECRET=
NEXT_PUBLIC_SITE_URL=https://www.jobsadmire.com
```

`npm install --save-dev server-only` is not needed (ships with Next). Run: `npm run test -- src/content` Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat(content): LOCAL/OPS bundle adapter with contract validation and the production fixture guard"
```

---

