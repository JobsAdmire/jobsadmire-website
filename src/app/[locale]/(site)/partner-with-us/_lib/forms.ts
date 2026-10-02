import { z } from 'zod';
import type { WireFields } from '@/forms/wire';
import type { PartnerTrack } from './tracks';

/** The sourcing form's licence/no-fee declaration tick (partner.114): its own required
 *  checkbox beside the kernel's consent checkbox (W79). Not a catalog name — never sent. */
export const DECLARATION_FIELD = 'licenceDeclaration';

/** W3: the HR-agency track is a registered company in Türkiye (partner.083); `hire` takes an
 *  ISO-2 country, the design asks only for a city in Türkiye. */
export const HR_COUNTRY = 'TR';
export const HR_I_AM = 'hr_agency';

/** The Operations catalog caps (v1.0 + v1.1), so the door never answers 400 for a length; the
 *  inputs carry the same `maxLength`. */
export const CAPS = {
  name: 120,
  company: 200,
  email: 254,
  phone: 40,
  city: 120,
  licence: 200,
  candidatesPerYear: 20,
  trades: 500,
  message: 5000,
} as const;

// The kernel's vocabulary (src/forms/errors.ts): `.min(1)` first, so an empty value reads
// `required`, never `email`/`phone`/`invalid`; a FormErrorCode passed as `message` wins.
const PHONE = /^(?:\D*\d){8}/;
const ISO2 = /^[A-Z]{2}$/;
const required = (max: number) => z.string().trim().min(1).max(max);
const optional = (max: number) => z.string().trim().max(max).optional();
const email = z.string().trim().min(1).max(CAPS.email).email();
const phone = z.string().trim().min(1).max(CAPS.phone).regex(PHONE, { message: 'phone' });
/** The `<select>` posts an ISO-2 code (W3/W25); free text would be a door 400. */
const country = z.string().trim().toUpperCase().min(1).regex(ISO2, { message: 'invalid' });

export const hrAgencySchema = z.object({
  company: required(CAPS.company),
  name: required(CAPS.name),
  city: required(CAPS.city),
  email,
  phone,
  message: optional(CAPS.message),
});
export type HrAgencyInput = z.infer<typeof hrAgencySchema>;

export const sourcingSchema = z.object({
  company: required(CAPS.company),
  name: required(CAPS.name),
  country,
  licence: required(CAPS.licence),
  email,
  phone,
  candidatesPerYear: optional(CAPS.candidatesPerYear),
  trades: optional(CAPS.trades),
  // An unticked checkbox posts nothing → `undefined` → the literal's `required` message.
  [DECLARATION_FIELD]: z.literal('on', { message: 'required' }),
});
export type SourcingInput = z.infer<typeof sourcingSchema>;

export const instituteSchema = z.object({
  company: required(CAPS.company),
  name: required(CAPS.name),
  city: optional(CAPS.city),
  country,
  email,
  phone,
  candidatesPerYear: optional(CAPS.candidatesPerYear),
  trades: optional(CAPS.trades),
});
export type InstituteInput = z.infer<typeof instituteSchema>;

// Wire names = the catalog's, exactly (docs/INTEGRATIONS.md I4). Blank optionals map to '',
// which `buildEnvelope` drops.

/** → `hire` (W3): lands with the Turkey sales team as HR_AGENCY — the `partner` key would
 *  classify it SOURCING_PARTNER and route it to the Pakistan team. */
export function hrAgencyToFields(p: HrAgencyInput): WireFields {
  return {
    name: p.name,
    company: p.company,
    email: p.email,
    phone: p.phone,
    country: HR_COUNTRY,
    iAm: HR_I_AM,
    city: p.city,
    message: p.message ?? '',
  };
}

const partnerTrack = (track: PartnerTrack) => track;

/** → `partner` + `track: 'sourcing'` (W16; inbox tag `[website:partner:sourcing]`). */
export function sourcingToFields(p: SourcingInput): WireFields {
  return {
    name: p.name,
    company: p.company,
    email: p.email,
    phone: p.phone,
    country: p.country,
    track: partnerTrack('sourcing'),
    licence: p.licence,
    candidatesPerYear: p.candidatesPerYear ?? '',
    trades: p.trades ?? '',
  };
}

/** → `partner` + `track: 'institute'` (W16; classification stays SOURCING_PARTNER, the track
 *  rides in the inbox tag `[website:partner:institute]`). */
export function instituteToFields(p: InstituteInput): WireFields {
  return {
    name: p.name,
    company: p.company,
    email: p.email,
    phone: p.phone,
    country: p.country,
    track: partnerTrack('institute'),
    city: p.city ?? '',
    candidatesPerYear: p.candidatesPerYear ?? '',
    trades: p.trades ?? '',
  };
}
