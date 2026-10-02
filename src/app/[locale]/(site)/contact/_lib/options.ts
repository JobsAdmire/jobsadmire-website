// The Contact page's stable option keys (W3/W77): what the three forms post and what the islands
// render. No imports on purpose — the client islands read this module, so it must never pull zod
// (or anything else) into the route's client graph; the schemas live in ./forms.ts, which only
// the server action and the tests import (forms.test.ts pins the "no import" rule).

/** The three topics that file a `contact` inquiry — each one a catalog v1.1 `topic` value
 *  (`hire | partner | permit | job | other`, exact lower-case) and a `PARAM_ENUMS.topic` value. */
export const CONTACT_TOPICS = ['hire', 'permit', 'partner'] as const;
export type ContactTopic = (typeof CONTACT_TOPICS)[number];

/** The picker adds the job-seeker card (contact.064/065): an explainer and a WhatsApp link, never
 *  a submission — the design refuses to file candidates and W3 keeps that. */
export const PICKER_TOPICS = ['hire', 'permit', 'partner', 'job'] as const;
export type PickerTopic = (typeof PICKER_TOPICS)[number];

/** The catalog `iAm` per topic: a permit-only client already employs the worker, so it is the
 *  employer of record (`direct_employer`); an agency or agent is a `sourcing_partner`. */
export const IAM_BY_TOPIC = {
  hire: 'direct_employer',
  permit: 'direct_employer',
  partner: 'sourcing_partner',
} as const satisfies Record<ContactTopic, 'direct_employer' | 'sourcing_partner'>;

/** The fourth, optional input per topic: the catalog v1.1 `city` for hire and permit; the partner
 *  topic's licence number instead, folded into `message` (W114 — the catalog has no licence). */
export const EXTRA_FIELD = {
  hire: 'city',
  permit: 'city',
  partner: 'licence',
} as const satisfies Record<ContactTopic, 'city' | 'licence'>;

/** "Reply me on" — rides as a `reply: <key>` line inside `message` (no catalog field). */
export const REPLY_CHANNELS = ['whatsapp', 'email', 'call'] as const;
export type ReplyChannel = (typeof REPLY_CHANNELS)[number];

export const CALLBACK_DAYS = ['today', 'tomorrow', 'this_week'] as const;
export type CallbackDay = (typeof CALLBACK_DAYS)[number];

/** The design's four call-back ranges as data: `key` is what `preferredTime` carries, the chip label
 *  is `from–to` (clock times read the same in both locales — no copy); `any` is labelled by
 *  contact.209. */
export const CALLBACK_SLOTS = [
  { key: '09-11', from: '09:00', to: '11:00' },
  { key: '11-13', from: '11:00', to: '13:00' },
  { key: '14-16', from: '14:00', to: '16:00' },
  { key: '16-18', from: '16:00', to: '18:00' },
] as const;
export const CALLBACK_SLOT_KEYS = ['09-11', '11-13', '14-16', '16-18', 'any'] as const;
export type CallbackSlot = (typeof CALLBACK_SLOT_KEYS)[number];

export const VISIT_SLOTS = ['09:30', '11:00', '13:30', '15:00', '16:30'] as const;
export type VisitSlot = (typeof VISIT_SLOTS)[number];

/** `visit.office` — the one office that takes visitors (the Antalya head office). */
export const VISIT_OFFICE = 'antalya' as const;

/** The hero's language chips and the ContactPage node's `availableLanguage` (BCP 47). */
export const LANGUAGE_CODES = ['tr', 'en', 'fr', 'hi', 'ru'] as const;
export type LanguageCode = (typeof LANGUAGE_CODES)[number];
