/** @vitest-environment node */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { FORM_KEYS } from '../src/analytics/forms';
import { START_WHEN_KEYS } from '../src/forms/options';
import { SECTOR_KEYS } from '../src/content/collections';
import { HERO_SECTOR_KEYS } from '../src/app/[locale]/(site)/_home/lib/forms';
import {
  CALLBACK_DAYS,
  CALLBACK_SLOT_KEYS,
  VISIT_SLOTS,
} from '../src/app/[locale]/(site)/contact/_lib/options';
import { ROLE_KEYS } from '../src/app/[locale]/(site)/available-workers/_lib/options';
import {
  FORM_INSTANCES,
  NON_DOOR_INSTANCES,
  requiredFieldNames,
  type FormInstance,
} from '../e2e/fixtures/form-instances';

// Lives under scripts/ for the same reason as scripts/face.test.ts: Vitest never collects e2e/**
// (vitest.config.mts `include`), and Playwright would collect an e2e/*.test.ts.

/** Every page source under src/app/[locale] joined — the built pages the inventory is pinned to. */
function pageSources(dir: string): string {
  let out = '';
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out += pageSources(full);
    else if (/\.tsx?$/.test(entry) && !/\.test\.tsx?$/.test(entry))
      out += readFileSync(full, 'utf8');
  }
  return out;
}

describe('FORM_INSTANCES — the 17-instance inventory pinned against the pages it was read from', () => {
  it('has exactly 17 rows, ids 1..17 in order', () => {
    expect(FORM_INSTANCES).toHaveLength(17);
    expect(FORM_INSTANCES.map((r) => r.id)).toEqual(Array.from({ length: 17 }, (_, i) => i + 1));
  });

  it('every doorKey is a real FormKey, and every key except newsletter is used at least once', () => {
    for (const row of FORM_INSTANCES) expect(FORM_KEYS as readonly string[]).toContain(row.doorKey);
    const used = new Set(FORM_INSTANCES.map((r) => r.doorKey));
    for (const key of FORM_KEYS) {
      if (key === 'newsletter')
        expect(used.has(key)).toBe(false); // D14: inactive, no instance
      else expect(used.has(key)).toBe(true);
    }
  });

  it('hire runs on both locales (D13/R55 — the two-locale autoresponder proof)', () => {
    const hireLocales = new Set(
      FORM_INSTANCES.filter((r) => r.doorKey === 'hire').map((r) => r.locale),
    );
    expect(hireLocales.has('tr')).toBe(true);
    expect(hireLocales.has('en')).toBe(true);
  });

  it('every row names a real FormShell testId and, where the page gives one, its idScope', () => {
    for (const row of FORM_INSTANCES) {
      expect(row.testId.length).toBeGreaterThan(0);
      expect(row.path.tr.startsWith('/')).toBe(true);
      expect(row.path.en.startsWith('/en')).toBe(true);
    }
  });

  it('every testId and idScope exists in the BUILT pages (src/app/[locale]) — W199: the code wins over any table', () => {
    const src = pageSources(join(__dirname, '..', 'src', 'app', '[locale]'));
    // A shell names its testId either as a literal (`testId="hire-form"`) or, where one component
    // renders several shells, as a template with a static prefix (PartnerForms: `partner-form-${track}`);
    // its idScope likewise as a literal or as a value of a per-track record (`FORM_ID_SCOPE`).
    const templatePrefixes = [...src.matchAll(/testId(?:=\{|:\s*)`([^`$]+)\$\{/g)].map((m) => m[1]);
    const hasTestId = (id: string) =>
      src.includes(`testId="${id}"`) ||
      templatePrefixes.some((p) => id.startsWith(p) && id.length > p.length);
    const hasIdScope = (scope: string) =>
      src.includes(`idScope="${scope}"`) ||
      src.includes(`'${scope}'`) ||
      src.includes(`"${scope}"`);
    for (const row of FORM_INSTANCES) {
      expect({ id: row.id, testId: row.testId, found: hasTestId(row.testId) }).toEqual({
        id: row.id,
        testId: row.testId,
        found: true,
      });
      if (row.idScope)
        expect({ id: row.id, idScope: row.idScope, found: hasIdScope(row.idScope) }).toEqual({
          id: row.id,
          idScope: row.idScope,
          found: true,
        });
    }
  });

  it('every field name the inventory fills, and every token in an `open` selector, exists in the BUILT pages (W199)', () => {
    const src = pageSources(join(__dirname, '..', 'src', 'app', '[locale]'));
    // A control's `name` is a literal (`name="roleNeeded"`) or a named constant whose value is a
    // string literal in the page's own `_lib` (`DECLARATION_FIELD = 'licenceDeclaration'`).
    const hasName = (n: string) =>
      src.includes(`name="${n}"`) || new RegExp(`(?<![=!])= '${n}'`).test(src);
    for (const row of FORM_INSTANCES)
      for (const f of row.fields)
        expect({ id: row.id, name: f.name, found: hasName(f.name) }).toEqual({
          id: row.id,
          name: f.name,
          found: true,
        });
    // `open` selectors name a testid, an input name or a label-for id (`track-<key>` is a template).
    for (const row of FORM_INSTANCES) {
      if (!row.open) continue;
      for (const [, id] of row.open.matchAll(/data-testid="([^"]+)"/g))
        expect({
          id: row.id,
          token: id,
          found: src.includes(`data-testid="${id}"`) || src.includes(`testId="${id}"`),
        }).toEqual({ id: row.id, token: id, found: true });
      for (const [, n] of row.open.matchAll(/\[name="([^"]+)"\]/g))
        expect({ id: row.id, token: n, found: src.includes(`name="${n}"`) }).toEqual({
          id: row.id,
          token: n,
          found: true,
        });
      for (const [, forId] of row.open.matchAll(/\[for="([^"]+)"\]/g)) {
        const prefix = forId.slice(0, forId.indexOf('-') + 1);
        expect({
          id: row.id,
          token: forId,
          found: src.includes(`id="${forId}"`) || src.includes(`\`${prefix}\${`),
        }).toEqual({ id: row.id, token: forId, found: true });
      }
    }
  });

  it('every `startWhen` field the inventory fills is one of the shared W78 keys, never an invented one', () => {
    for (const row of FORM_INSTANCES) {
      const sw = row.fields.find((f) => f.name === 'startWhen');
      if (sw) expect(START_WHEN_KEYS as readonly string[]).toContain(sw.value);
    }
  });

  it('every select/radio value the inventory sends is a key of the option module its page validates against (W214 (3))', () => {
    const keysFor = (row: FormInstance, name: string): readonly string[] | null => {
      switch (name) {
        case 'sector':
          return row.testId === 'hire-form-full' ? SECTOR_KEYS : HERO_SECTOR_KEYS; // hire-spec.ts z.enum(SECTOR_KEYS) vs _home/lib/forms.ts sectorKey
        case 'topic':
          return HERO_SECTOR_KEYS; // callbackSchema: topic: sectorKey
        case 'day':
          return CALLBACK_DAYS;
        case 'slot':
          return CALLBACK_SLOT_KEYS;
        case 'preferredTime':
          return VISIT_SLOTS;
        case 'iAm':
          return ROLE_KEYS;
        case 'startWhen':
          return START_WHEN_KEYS;
        default:
          return null; // ISO country/dial codes come from country tables, not an option module
      }
    };
    for (const row of FORM_INSTANCES)
      for (const f of row.fields) {
        const keys = f.kind === 'select' || f.kind === 'radio' ? keysFor(row, f.name) : null;
        if (keys)
          expect({ id: row.id, name: f.name, value: f.value, ok: keys.includes(f.value) }).toEqual({
            id: row.id,
            name: f.name,
            value: f.value,
            ok: true,
          });
      }
  });

  it('careers rows (16, 17) resolve their opening dynamically — no hardcoded slug baked into the fixture', () => {
    const careers = FORM_INSTANCES.filter((r) => r.doorKey === 'careers');
    expect(careers).toHaveLength(2);
    for (const row of careers) {
      expect(row.dynamicOpening).toBeDefined();
      expect(row.path.tr).toBe('/kariyer'); // resolved at run time; the fixture holds the INDEX path only
    }
    expect(careers.map((r) => r.dynamicOpening?.country).sort()).toEqual(['PK', 'TR']);
  });

  it('rows 3/4 (Hire Workers) and 13 (Available Workers) send the fixed values the pages hardcode, not a typed one', () => {
    const quick = FORM_INSTANCES.find((r) => r.id === 3)!;
    expect(quick.testId).toBe('hire-form-quick');
    expect(quick.consentMode).toBe('checkbox'); // corrected: the page sets consent="checkbox", not "notice"
    const workers = FORM_INSTANCES.find((r) => r.id === 13)!;
    expect(workers.fixedFields).toMatchObject({ country: 'TR' });
    expect(requiredFieldNames(workers)).toEqual(expect.arrayContaining(['city', 'trade']));
  });

  it('row 7 (sourcing partner) requires licence and sends no city/message; row 8 (institute) sends no licence/message', () => {
    const sourcing = FORM_INSTANCES.find((r) => r.id === 7)!;
    expect(requiredFieldNames(sourcing)).toEqual(expect.arrayContaining(['licence']));
    expect(sourcing.fields.some((f) => f.name === 'city')).toBe(false);
    expect(sourcing.fields.some((f) => f.name === 'message')).toBe(false);
    const institute = FORM_INSTANCES.find((r) => r.id === 8)!;
    expect(institute.fields.some((f) => f.name === 'licence')).toBe(false);
  });

  it('rows 14/15 (fraud) require both reporterName and reporterEmail (W105 — stricter than the door)', () => {
    for (const id of [14, 15]) {
      const row = FORM_INSTANCES.find((r) => r.id === id)!;
      expect(requiredFieldNames(row)).toEqual(
        expect.arrayContaining(['reporterName', 'reporterEmail']),
      );
    }
  });

  it('row 13’s anchor is #pool-form (the hero card), never #pool (the empty-state section)', () => {
    const workers = FORM_INSTANCES.find((r) => r.id === 13)!;
    expect(workers.anchor).toBe('#pool-form');
  });

  it('row 2 (the hero "call me back" mode) runs at a phone viewport — the mode button is xs:hidden in the built page', () => {
    const callback = FORM_INSTANCES.find((r) => r.id === 2)!;
    expect(callback.viewport).toBeDefined();
    expect(callback.viewport!.width).toBeLessThanOrEqual(460);
  });

  it('NON_DOOR_INSTANCES names every rendered-but-not-submitted path, so the ledger cross-check has somewhere to record them', () => {
    const labels = NON_DOOR_INSTANCES.map((r) => r.label);
    expect(labels).toEqual(
      expect.arrayContaining([
        expect.stringContaining('portfolio'),
        expect.stringContaining('speculative'),
        expect.stringContaining('lookup'),
        expect.stringContaining('newsletter'),
      ]),
    );
  });
});
