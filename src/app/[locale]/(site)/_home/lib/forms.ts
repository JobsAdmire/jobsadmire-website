import { z } from 'zod';
import type { SectorKey } from '@/content/collections';
import type { FormSpec } from '@/forms/action';
import { START_WHEN_KEYS, type StartWhenKey } from '@/forms/options';
import type { WireFields } from '@/forms/wire';

/**
 * The hero card's sector options (design: Factory / Agriculture / Tourism / Construction / Other)
 * — stable keys from the `sectors` collection's `SECTOR_KEYS` (W77). VALUES travel on the wire;
 * the LABELS are the package's own ids, resolved by the section (W115).
 */
export const HERO_SECTOR_KEYS = [
  'factory',
  'agriculture',
  'tourism',
  'construction',
  'other',
] as const satisfies readonly SectorKey[];
export type HeroSectorKey = (typeof HERO_SECTOR_KEYS)[number];
export const HERO_SECTOR_LABEL_IDS: Record<HeroSectorKey, string> = {
  factory: 'home.036',
  agriculture: 'home.037',
  tourism: 'home.038',
  construction: 'home.039',
  other: 'home.040',
};

/** W78: the one `startWhen` vocabulary. The design's Immediately / Within 1 month / 1–3 months /
 *  Just planning map one-to-one onto it, so the hero shows the package's own labels (W115). */
export const START_WHEN_LABEL_IDS: Record<StartWhenKey, string> = {
  asap: 'home.044',
  month1: 'home.045',
  months1to3: 'home.046',
  planning: 'home.047',
};

// A select posts '' until the visitor picks; anything else must be one of the keys ('invalid').
const sectorKey = z.union([z.literal(''), z.enum(HERO_SECTOR_KEYS)]).optional();
const startWhenKey = z.union([z.literal(''), z.enum(START_WHEN_KEYS)]).optional();

// `.min(1)` first so an empty value reads `required`, not `email`/`phone` (src/forms/errors.ts).
const name = z.string().trim().min(1).max(120);
const phone = z
  .string()
  .trim()
  .min(1)
  .max(40)
  .regex(/^(?:\D*\d){8}/, { message: 'phone' });
const city = z.string().trim().max(120).optional();

/** Catalog `hire` (v1.0 + v1.1 `city`): the lengths are the door's own caps. */
export const hireSchema = z.object({
  company: z.string().trim().min(1).max(200),
  name,
  email: z.string().trim().min(1).max(254).email(),
  phone,
  sector: sectorKey,
  headcount: z
    .string()
    .trim()
    .min(1)
    .regex(/^[1-9]\d{0,9}$/, { message: 'invalid' }),
  city,
  startWhen: startWhenKey,
});
export type HireInput = z.infer<typeof hireSchema>;

/** The exact wire names (docs/INTEGRATIONS.md I4) — an unknown key would be dropped by the door
 *  with a 200. Empty optionals are omitted (buildEnvelope drops '' anyway). */
export function hireToFields(p: HireInput): WireFields {
  const fields: WireFields = {
    company: p.company,
    name: p.name,
    email: p.email,
    phone: p.phone,
    headcount: p.headcount,
  };
  if (p.sector) fields.sector = p.sector;
  if (p.city) fields.city = p.city;
  if (p.startWhen) fields.startWhen = p.startWhen;
  return fields;
}

export const hireSpec: FormSpec<typeof hireSchema> = {
  key: 'hire',
  schema: hireSchema,
  toFields: hireToFields,
  consent: 'checkbox', // W79
};

/** Catalog `callback`: `name*`, `phone*`, `topic` (free text ≤ 200 at the door — the sector key
 *  travels there, W77), `city` (v1.1). No `preferredTime`: the design's call-me-back mode has no
 *  such control, and the Contact page's callback owns that field's vocabulary. */
export const callbackSchema = z.object({ name, phone, topic: sectorKey, city });
export type CallbackInput = z.infer<typeof callbackSchema>;

export function callbackToFields(p: CallbackInput): WireFields {
  const fields: WireFields = { name: p.name, phone: p.phone };
  if (p.topic) fields.topic = p.topic;
  if (p.city) fields.city = p.city;
  return fields;
}

export const callbackSpec: FormSpec<typeof callbackSchema> = {
  key: 'callback',
  schema: callbackSchema,
  toFields: callbackToFields,
  consent: 'checkbox', // W79
};
