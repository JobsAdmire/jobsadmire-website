import { z } from 'zod';
import type { FormSpec } from '@/forms/action';
import { START_WHEN_KEYS } from '@/forms/options';
import type { WireFields } from '@/forms/wire';
import { composeWorkersMessage } from './message';
import { FIELD_MAX, ROLE_KEYS } from './options';

/** The door needs 8 digits in a phone; the kernel's `phone` code names the problem. */
const PHONE = /(\D*\d){8,}/;

/** Field names are the catalog's (what each `Field name=…` posts). `.min(1)` comes first so an
 *  empty value reads `required`, not `email`/`phone` (`fieldErrorsFromIssues` takes the first
 *  issue per field). The kernel trims every string before this runs. */
export const workersSchema = z.object({
  iAm: z.enum(ROLE_KEYS),
  company: z.string().min(1).max(FIELD_MAX.company),
  name: z.string().min(1).max(FIELD_MAX.name),
  email: z.string().min(1).max(FIELD_MAX.email).email(),
  phone: z.string().min(1).max(FIELD_MAX.phone).regex(PHONE, { message: 'phone' }),
  city: z.string().min(1).max(FIELD_MAX.city),
  /** W77: the design's roles-and-volume input ("Which roles and how many workers?") is typed
   *  free text, so it travels as typed; `trade` is the only role slot `workers` has. */
  trade: z.string().min(1).max(FIELD_MAX.trade),
  // ≤ 10 characters at the door; the input bounds it to 1–9,999 (`Field min/max`), so does this.
  headcount: z
    .string()
    .regex(/^[1-9]\d{0,3}$/)
    .or(z.literal(''))
    .optional(),
  /** W78: the shared key set; a `<select>` left on its placeholder posts ''. */
  startWhen: z.enum(START_WHEN_KEYS).or(z.literal('')).optional(),
  message: z.string().max(FIELD_MAX.message).optional(),
  /** Basket references (the v1.1 cards task's hidden input); never posted in Phase A. */
  profileRefs: z.string().max(500).optional(),
});
export type WorkersInput = z.infer<typeof workersSchema>;

/** The form asks for a "City in Türkiye" (`availworkers.047`), so the catalog's optional
 *  `country` is sent and the inbox never has to guess (W105 records it for T14). */
export const WORKERS_COUNTRY = 'TR';

/** EXACT Operations `workers` catalog names (v1.0 + the v1.1 `city`); a blank optional is
 *  omitted, never sent as ''. */
export function toWorkersFields(p: WorkersInput): WireFields {
  const fields: WireFields = {
    iAm: p.iAm,
    name: p.name,
    company: p.company,
    email: p.email,
    phone: p.phone,
    country: WORKERS_COUNTRY,
    city: p.city,
    trade: p.trade,
  };
  if (p.headcount) fields.headcount = p.headcount;
  if (p.startWhen) fields.startWhen = p.startWhen;
  const message = composeWorkersMessage(p.message, p.profileRefs);
  if (message) fields.message = message;
  return fields;
}

export const WORKERS_SPEC: FormSpec<typeof workersSchema> = {
  key: 'workers',
  schema: workersSchema,
  toFields: (p) => toWorkersFields(p),
  consent: 'checkbox',
};
