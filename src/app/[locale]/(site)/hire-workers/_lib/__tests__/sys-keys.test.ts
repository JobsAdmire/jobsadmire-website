import { describe, expect, it } from 'vitest';
import { START_WHEN_KEYS } from '@/forms/options';
import en from '@/messages/en.json';
import tr from '@/messages/tr.json';

/** The page's id-less copy (W9/W23) — the frozen key set both message files carry. */
const SYS_HIRE_KEYS = ['whatsapp', 'jump.label', 'sc.titleTail', 'sc.mapTitle', 'form.dial'];

type Tree = Record<string, unknown>;
const flatten = (o: Tree, prefix = ''): string[] =>
  Object.entries(o).flatMap(([k, v]) =>
    v && typeof v === 'object' ? flatten(v as Tree, `${prefix}${k}.`) : [`${prefix}${k}`],
  );
const sysOf = (file: unknown) => (file as { sys: Tree }).sys;

describe('sys.hire.*', () => {
  it('exists with the same five keys in both locales', () => {
    const trKeys = flatten(sysOf(tr).hire as Tree).sort();
    const enKeys = flatten(sysOf(en).hire as Tree).sort();
    expect(trKeys).toEqual([...SYS_HIRE_KEYS].sort());
    expect(enKeys).toEqual(trKeys);
  });

  it('keeps the source-countries tail Turkish-only (EN is the empty string on purpose)', () => {
    const tail = (file: unknown) =>
      ((sysOf(file).hire as Tree).sc as Record<string, string>).titleTail;
    expect(tail(tr)).toBe(' belgeli işçiler');
    expect(tail(en)).toBe('');
  });

  it('can label every shared startWhen key (W78) in both locales', () => {
    for (const file of [tr, en]) {
      const labels = ((sysOf(file).form as Tree).options as Tree).startWhen as Record<
        string,
        string
      >;
      for (const key of START_WHEN_KEYS) expect(labels[key]?.trim().length).toBeGreaterThan(0);
    }
  });
});
