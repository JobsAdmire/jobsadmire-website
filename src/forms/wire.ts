import type { Locale } from '@/i18n/routing';
import { CONSENT_VERSION } from './consent';

/** The `fields` object of the door envelope. Unknown keys inside it are silently DROPPED by
 *  the Operations catalog (never an error), so a mis-spelled key loses data with a 200 — page
 *  `toFields` mappers copy the catalog names exactly (docs/INTEGRATIONS.md I4). */
export type WireFields = Record<string, string | string[]>;

/** `POST /api/website/v1/forms/:formKey` body. Top-level keys are whitelisted with
 *  `forbidNonWhitelisted` on the Ops side — anything beyond these six is a 400, so this type
 *  is closed on purpose. */
export type WireEnvelope = {
  locale: Locale;
  consentVersion: string;
  captchaToken?: string;
  honeypot?: string;
  sourcePath?: string;
  fields: WireFields;
};

/** The door DTO's length caps (website-form-submit.dto.ts). */
const MAX = { captchaToken: 2048, honeypot: 500, sourcePath: 300 } as const;

const optional = (v: string | null | undefined, max: number): string | undefined => {
  if (typeof v !== 'string' || v === '') return undefined;
  return v.length > max ? v.slice(0, max) : v;
};

export function buildEnvelope(input: {
  locale: Locale;
  fields: WireFields;
  captchaToken?: string | null;
  honeypot?: string | null;
  sourcePath?: string | null;
}): WireEnvelope {
  const fields: WireFields = {};
  for (const [key, value] of Object.entries(input.fields)) {
    if (typeof value === 'string') {
      if (value !== '') fields[key] = value;
    } else if (Array.isArray(value)) {
      const kept = value.filter((s): s is string => typeof s === 'string' && s !== '');
      if (kept.length) fields[key] = kept;
    }
    // undefined / anything else: not a wire value, not sent
  }
  const envelope: WireEnvelope = { locale: input.locale, consentVersion: CONSENT_VERSION, fields };
  const captchaToken = optional(input.captchaToken, MAX.captchaToken);
  if (captchaToken) envelope.captchaToken = captchaToken;
  // A filled honeypot is the bot signal; an empty one is simply absent.
  const honeypot = optional(input.honeypot, MAX.honeypot);
  if (honeypot) envelope.honeypot = honeypot;
  const sourcePath = optional(input.sourcePath, MAX.sourcePath);
  if (sourcePath) envelope.sourcePath = sourcePath;
  return envelope;
}
