### Task 5: The content contract (Zod) + golden fixture + hash pin

**Files:**

- Create: `contract/website-bundle.v1.ts`, `contract/website-bundle.v1.fixture.json`, `contract/CONTRACT.md`, `contract/contract.test.ts`

**Interfaces:**

- Produces: `Bundle` type + `BundleSchema` (Zod), `CONTRACT_VERSION = '1.0'`, `CONTRACT_FILE_SHA256` constant in `contract/contract.test.ts` (recomputed on purpose when the schema changes). Operations (WP3c) vendors `website-bundle.v1.ts` + the fixture byte-identically and runs the same hash test.

- [ ] **Step 1: Write the schema**

```bash
npm install zod@^3
```

`contract/website-bundle.v1.ts`:

```ts
import { z } from 'zod';

export const CONTRACT_VERSION = '1.0' as const;

export const LocaleSchema = z.enum(['tr', 'en']);

export const NavItemSchema = z.object({
  group: z.enum([
    'slimBarLeft',
    'slimBarRight',
    'desktopNav',
    'hamburger',
    'footerEmployers',
    'footerCompany',
    'footerContact',
    'mobileBottomBar',
    'socialRail',
  ]),
  order: z.number().int().nonnegative(),
  labelId: z.string().min(1),
  href: z.string().min(1),
  external: z.boolean(),
  visibleOn: z.array(z.enum(['desktop', 'mobile'])).min(1),
});

export const SettingsSchema = z.object({
  siteUrl: z.string().url(),
  phone: z.string().regex(/^\+\d{8,15}$/),
  phoneDisplay: z.string(),
  partnershipsPhone: z
    .string()
    .regex(/^\+\d{8,15}$/)
    .nullable(),
  email: z.string().email(),
  careersEmail: z.string().email(),
  whatsappNumber: z.string().regex(/^\d{8,15}$/),
  telegramUrl: z.string().url(),
  social: z.object({
    instagram: z.string().url(),
    tiktok: z.string().url(),
    linkedin: z.string().url(),
    facebook: z.string().url(),
  }),
  licence: z.object({ permitNo: z.string(), lawRef: z.string(), taxNo: z.string() }),
  storeLinks: z.object({ android: z.string().url().nullable(), ios: z.string().url().nullable() }),
  portal: z.object({ host: z.string().url(), loginPath: z.string(), forgotPath: z.string() }),
  maps: z.object({ antalya: z.string().url(), karachi: z.string().url() }),
  analytics: z.object({
    ga4Id: z.string().nullable(),
    gtmId: z.string().nullable(),
    adsId: z.string().nullable(),
    adsConversionLabel: z.string().nullable(),
    consentMode: z.boolean(),
  }),
  turnstileSiteKey: z.string().nullable(),
});

export const PageSeoSchema = z.object({
  titleId: z.string(),
  descriptionId: z.string(),
  ogImage: z.string().url().nullable(),
  canonical: z.string().url().nullable(),
  robots: z.enum(['index', 'noindex']),
  jsonLd: z.array(
    z.enum(['organization', 'website', 'breadcrumb', 'faq', 'article', 'jobPosting']),
  ),
});

export const RedirectSchema = z.object({
  from: z.string(),
  to: z.string(),
  status: z.union([z.literal(301), z.literal(308)]),
});

export const BundleSchema = z.object({
  contractVersion: z.literal(CONTRACT_VERSION),
  locale: LocaleSchema,
  generatedAt: z.string().datetime(),
  strings: z.record(z.string(), z.string()),
  nav: z.array(NavItemSchema),
  settings: SettingsSchema,
  pages: z.record(z.string(), PageSeoSchema),
  /** collections are typed per key as pages are ported (additive within 1.x) */
  collections: z.record(z.string(), z.array(z.record(z.string(), z.unknown()))),
  redirects: z.array(RedirectSchema),
});

export type Bundle = z.infer<typeof BundleSchema>;
export type NavItem = z.infer<typeof NavItemSchema>;
export type Settings = z.infer<typeof SettingsSchema>;
```

`contract/website-bundle.v1.fixture.json`: a hand-trimmed valid bundle — copy `src/content/local/bundle.tr.json`, keep 20 strings (include the six empty-TR ids and `home.001`–`home.010`), the nav, settings, one page entry `{"home": {"titleId":"home.017","descriptionId":"home.018","ogImage":null,"canonical":null,"robots":"index","jsonLd":["organization","website","faq"]}}`, empty collections, one redirect `{"from":"/contact-us","to":"/en/contact","status":308}`.

`contract/CONTRACT.md`:

```md
# Content bundle contract

`website-bundle.v1.ts` is the single source of truth for what Operations serves and the site consumes.
It is vendored byte-identically into `jobsadmire-operations/packages/validators/src/website-bundle.v1.ts`
together with the fixture; both repos run a hash test.

Changing it: (1) edit the schema here, (2) update the fixture, (3) run `npm run test -- contract`, copy the
new SHA-256 into `CONTRACT_FILE_SHA256`, (4) bump `CONTRACT_VERSION` (`1.1` for additive, `2.0` for breaking),
(5) copy both files into Operations in the same day and update its hash constant. Additive = new optional
fields or new collection keys; anything else is breaking.
```

- [ ] **Step 2: The hash + fixture test**

`contract/contract.test.ts`:

```ts
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { BundleSchema, CONTRACT_VERSION } from './website-bundle.v1';

// Recompute deliberately when the contract changes (see CONTRACT.md). Operations pins the same value.
export const CONTRACT_FILE_SHA256 = '<fill after first run>';

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
```

Run once to obtain the SHA from the failure message, paste it into `CONTRACT_FILE_SHA256`, rerun: `npm run test -- contract` Expected: 3 passed. Add `"include": ["src/**/*.test.{ts,tsx}", "contract/**/*.test.ts", "scripts/**/*.test.ts", "redirects/**/*.test.ts"]` to `vitest.config.ts` `test.include`.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat(contract): content bundle contract v1.0 with golden fixture and hash pin"
```

---

