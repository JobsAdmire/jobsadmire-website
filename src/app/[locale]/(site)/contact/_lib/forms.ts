// The Contact page's three door-backed forms (W3): Zod schemas and the `toFields` mappers onto the
// door's catalog names (Ops `website-form-catalog.ts` v1.0 + the confirmed v1.1 `city`/`topic`;
// docs/INTEGRATIONS.md I4). Input names ARE the catalog names (W114) — `subject`, `city` — so the
// D11 fallback prefill (FallbackPanel's WHATSAPP_FIELDS) carries the visitor's main request; the
// partner licence is its own `licence` input folded into `message`. No directive: ../actions.ts
// wraps these in `'use server'`; client code imports ./options.ts, never this module.
import { z } from 'zod';
import type { WireFields } from '@/forms/wire';
import {
  CALLBACK_DAYS,
  CALLBACK_SLOT_KEYS,
  CONTACT_TOPICS,
  IAM_BY_TOPIC,
  REPLY_CHANNELS,
  VISIT_OFFICE,
  VISIT_SLOTS,
} from './options';

// `.min(1)` before `.email()`: an empty value reads `required`, not `email` (src/forms/errors.ts).
const email = z.string().min(1).max(254).email();
// The door keeps the number as typed and counts digits (catalog type `phone`: ≥ 8) — the same rule
// here, so a short number is a field error, never a 400 `invalid` panel. `.min(1)` first: an empty
// phone reads `required`; the refinement's `phone` code follows only a typed value.
const phone = z
  .string()
  .min(1)
  .max(40)
  .refine((v) => v.replace(/\D/g, '').length >= 8, { message: 'phone' });

export const contactSchema = z.object({
  topic: z.enum(CONTACT_TOPICS),
  company: z.string().min(1).max(200),
  name: z.string().min(1).max(120),
  email,
  phone,
  /** The topic's required line: roles and headcount · worker and role · what you supply. */
  subject: z.string().min(1).max(200),
  /** Catalog v1.1 `city` (≤ 120): the city in Türkiye (hire) · the workplace city (permit). */
  city: z.string().max(120).optional(),
  /** The partner topic's licence number — folded into `message`. */
  licence: z.string().max(200).optional(),
  reply: z.enum(REPLY_CHANNELS).optional(),
  message: z.string().max(4000).optional(),
});
export type ContactInput = z.infer<typeof contactSchema>;

/** The door requires `message` (≤ 5000): the subject first (so it is never empty), then the
 *  partner licence and the reply channel as `key: value` lines — language-neutral, the Ops inbox is
 *  not visitor copy (W77) — then the free notes after a blank line. At the schema maxima:
 *  200 + 1 + 209 + 1 + 15 + 2 + 4000 < 5000. */
export function composeContactMessage(p: ContactInput): string {
  const lines = [p.subject];
  if (p.topic === 'partner' && p.licence) lines.push(`licence: ${p.licence}`);
  if (p.reply) lines.push(`reply: ${p.reply}`);
  if (p.message) lines.push('', p.message);
  return lines.join('\n');
}

export function toContactFields(p: ContactInput): WireFields {
  const fields: WireFields = {
    name: p.name,
    email: p.email,
    phone: p.phone,
    company: p.company,
    topic: p.topic,
    iAm: IAM_BY_TOPIC[p.topic],
    subject: p.subject,
    message: composeContactMessage(p),
  };
  // Catalog v1.1 `city` — hire and permit only; a stray `city` on a partner post is ignored.
  if (p.topic !== 'partner' && p.city) fields.city = p.city;
  return fields;
}

export const callbackSchema = z.object({
  name: z.string().min(1).max(120),
  phone,
  day: z.enum(CALLBACK_DAYS).optional(),
  slot: z.enum(CALLBACK_SLOT_KEYS).optional(),
});
export type CallbackInput = z.infer<typeof callbackSchema>;

/** `preferredTime` (≤ 120) carries the chosen keys — `"tomorrow 14-16"`, `"today any"`, the day
 *  alone or nothing — never the localized chip labels (W77). */
export function toCallbackFields(p: CallbackInput): WireFields {
  const fields: WireFields = { name: p.name, phone: p.phone };
  const when = [p.day, p.slot].filter(Boolean).join(' ');
  if (when) fields.preferredTime = when;
  return fields;
}

export const visitSchema = z.object({
  name: z.string().min(1).max(120),
  email,
  phone,
  /** An ISO date from the day chips, or what the visitor typed before the chips hydrated. */
  preferredDate: z.string().max(40).optional(),
  preferredTime: z.enum(VISIT_SLOTS).optional(),
});
export type VisitInput = z.infer<typeof visitSchema>;

export function toVisitFields(p: VisitInput): WireFields {
  const fields: WireFields = { name: p.name, email: p.email, phone: p.phone, office: VISIT_OFFICE };
  if (p.preferredDate) fields.preferredDate = p.preferredDate;
  if (p.preferredTime) fields.preferredTime = p.preferredTime;
  return fields;
}
