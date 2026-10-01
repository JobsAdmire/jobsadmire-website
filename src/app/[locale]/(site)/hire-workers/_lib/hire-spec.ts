import { z } from 'zod';
import { SECTOR_KEYS } from '@/content/collections';
import { START_WHEN_KEYS } from '@/forms/options';
import { FormActionError } from '@/forms/types';
import type { WireFields } from '@/forms/wire';
import { dialForCode, type CountryRow } from './countries';
import { composePhone, normalisePhone } from './phone';

/** `.min(1)` before every format rule so an empty value reads `required` (kernel convention,
 *  src/forms/errors.ts). Caps mirror the Operations catalog (`hire`, v1.0 + v1.1's `city`). */
const required = (max: number) => z.string().trim().min(1).max(max);
const email = z.string().trim().min(1).max(254).email();
const phoneOf = (max: number) =>
  z
    .string()
    .trim()
    .min(1)
    .max(max)
    .regex(/(\D*\d){8,}/, { message: 'phone' });
const headcount = z
  .string()
  .trim()
  .min(1)
  .max(10)
  .regex(/^[1-9]\d{0,9}$/, { message: 'invalid' });

/** Hero quick-quote: the design's six fields + the door-required contact `name` (W3). */
export const quickSchema = z.object({
  company: required(200),
  name: required(120),
  city: required(120),
  roleNeeded: required(200),
  headcount,
  phone: phoneOf(40),
  email,
});
export type QuickInput = z.infer<typeof quickSchema>;

export function quickToFields(p: QuickInput): WireFields {
  return {
    name: p.name,
    company: p.company,
    email: p.email,
    phone: normalisePhone(p.phone),
    city: p.city,
    roleNeeded: p.roleNeeded,
    headcount: p.headcount,
  };
}

/** Request form: dial (ISO-2) + national number (≤ 32 chars, so dial + digits stay under the
 *  door's 40), the sector KEY (W77 — an untouched select posts '' → `required`, a label →
 *  `invalid`), the shared startWhen KEY (W78), optional city (catalog v1.1, W16) and message.
 *  A localized label never travels on the wire. */
export const fullSchema = z.object({
  company: required(200),
  name: required(120),
  email,
  dial: z
    .string()
    .trim()
    .min(1)
    .regex(/^[A-Za-z]{2}$/, { message: 'invalid' }),
  phone: phoneOf(32),
  sector: z.enum(SECTOR_KEYS),
  roleNeeded: required(200),
  headcount,
  city: z.string().trim().max(120).optional(),
  startWhen: z.union([z.literal(''), z.enum(START_WHEN_KEYS)]).optional(),
  message: z.string().trim().max(5000).optional(),
});
export type FullInput = z.infer<typeof fullSchema>;

export function fullToFields(
  p: FullInput,
  countries: readonly Pick<CountryRow, 'code' | 'dial'>[],
): WireFields {
  const dial = dialForCode(countries, p.dial);
  // With `field` set the action answers a field error on the dial select; the empty
  // visitorMessage is never shown (src/forms/types.ts).
  if (!dial) throw new FormActionError('', { name: 'dial', code: 'invalid' });
  const fields: WireFields = {
    name: p.name,
    company: p.company,
    email: p.email,
    phone: composePhone(dial, p.phone),
    sector: p.sector,
    roleNeeded: p.roleNeeded,
    headcount: p.headcount,
  };
  if (p.city) fields.city = p.city;
  if (p.startWhen) fields.startWhen = p.startWhen;
  if (p.message) fields.message = p.message;
  return fields;
}
