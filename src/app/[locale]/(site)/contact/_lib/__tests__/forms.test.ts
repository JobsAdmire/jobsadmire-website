import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { PARAM_ENUMS } from '@/analytics/track';
import {
  callbackSchema,
  composeContactMessage,
  contactSchema,
  toCallbackFields,
  toContactFields,
  toVisitFields,
  visitSchema,
} from '../forms';
import {
  CALLBACK_DAYS,
  CALLBACK_SLOT_KEYS,
  CALLBACK_SLOTS,
  CONTACT_TOPICS,
  EXTRA_FIELD,
  IAM_BY_TOPIC,
  LANGUAGE_CODES,
  PICKER_TOPICS,
  REPLY_CHANNELS,
  VISIT_OFFICE,
  VISIT_SLOTS,
} from '../options';

const OPTIONS = join(process.cwd(), 'src/app/[locale]/(site)/contact/_lib/options.ts');

/** The Operations catalog (v1.0 + the confirmed v1.1 `city`/`topic`) — anything else inside
 *  `fields` would be dropped silently with a 200. */
const CONTACT_CATALOG = [
  'name',
  'email',
  'phone',
  'company',
  'country',
  'iAm',
  'subject',
  'message',
  'city',
  'topic',
];
const CATALOG_TOPICS = ['hire', 'partner', 'permit', 'job', 'other'];

const base = {
  topic: 'hire',
  company: 'Akdeniz Otel A.Ş.',
  name: 'Ayşe Yılmaz',
  email: 'ayse@akdenizotel.com',
  phone: '+90 532 000 00 00',
  subject: '10 welders, 4 CNC operators',
};

describe('options — the stable keys (W3/W77), zod-free for the islands (W13)', () => {
  it('every option value is a key, never a label', () => {
    expect(CONTACT_TOPICS).toEqual(['hire', 'permit', 'partner']);
    expect(PICKER_TOPICS).toEqual(['hire', 'permit', 'partner', 'job']);
    expect(IAM_BY_TOPIC).toEqual({
      hire: 'direct_employer',
      permit: 'direct_employer',
      partner: 'sourcing_partner',
    });
    expect(EXTRA_FIELD).toEqual({ hire: 'city', permit: 'city', partner: 'licence' });
    expect(REPLY_CHANNELS).toEqual(['whatsapp', 'email', 'call']);
    expect(CALLBACK_DAYS).toEqual(['today', 'tomorrow', 'this_week']);
    expect(CALLBACK_SLOT_KEYS).toEqual([...CALLBACK_SLOTS.map((s) => s.key), 'any']);
    expect(CALLBACK_SLOTS.map((s) => `${s.from}–${s.to}`)).toEqual([
      '09:00–11:00',
      '11:00–13:00',
      '14:00–16:00',
      '16:00–18:00',
    ]);
    expect(VISIT_SLOTS).toEqual(['09:30', '11:00', '13:30', '15:00', '16:30']);
    expect(VISIT_OFFICE).toBe('antalya');
    expect(LANGUAGE_CODES).toEqual(['tr', 'en', 'fr', 'hi', 'ru']);
  });

  it('every picker topic is a catalog v1.1 topic and a PARAM_ENUMS.topic value (W16/W67)', () => {
    for (const topic of PICKER_TOPICS) {
      expect(CATALOG_TOPICS).toContain(topic);
      expect(PARAM_ENUMS.topic as readonly string[]).toContain(topic);
    }
  });

  it('options.ts imports nothing — the islands read it, so zod never reaches the client bundle', () => {
    expect(readFileSync(OPTIONS, 'utf8')).not.toMatch(/^\s*import\s/m);
  });
});

describe('contact — schema', () => {
  it('accepts the designed minimum (topic, company, name, e-mail, phone, subject)', () => {
    expect(contactSchema.safeParse(base).success).toBe(true);
  });
  it('an empty e-mail reads "required" before "not an e-mail" (.min(1) precedes .email())', () => {
    const r = contactSchema.safeParse({ ...base, email: '' });
    expect(r.success).toBe(false);
    if (!r.success) expect(r.error.issues[0]).toMatchObject({ path: ['email'], code: 'too_small' });
  });
  it('a phone with fewer than 8 digits carries the `phone` code (the door counts digits the same way)', () => {
    const r = contactSchema.safeParse({ ...base, phone: '+90 53' });
    expect(r.success).toBe(false);
    if (!r.success) expect(r.error.issues[0]).toMatchObject({ path: ['phone'], message: 'phone' });
  });
  it('an empty phone reads "required" first, not "phone"', () => {
    const r = contactSchema.safeParse({ ...base, phone: '' });
    expect(r.success).toBe(false);
    if (!r.success) expect(r.error.issues[0]).toMatchObject({ path: ['phone'], code: 'too_small' });
  });
  it('never files the job-seeker topic: it is a picker key, not a schema value (W3)', () => {
    expect(contactSchema.safeParse({ ...base, topic: 'job' }).success).toBe(false);
  });
  it('caps each input at its catalog length', () => {
    expect(contactSchema.safeParse({ ...base, company: 'c'.repeat(201) }).success).toBe(false);
    expect(contactSchema.safeParse({ ...base, name: 'n'.repeat(121) }).success).toBe(false);
    expect(contactSchema.safeParse({ ...base, subject: 's'.repeat(201) }).success).toBe(false);
    expect(contactSchema.safeParse({ ...base, city: 'c'.repeat(121) }).success).toBe(false);
    expect(contactSchema.safeParse({ ...base, licence: 'l'.repeat(201) }).success).toBe(false);
    expect(contactSchema.safeParse({ ...base, message: 'm'.repeat(4001) }).success).toBe(false);
  });
});

describe('contact — toContactFields (catalog names exactly, W114)', () => {
  it('hire: topic + iAm + subject + message (+ reply line and notes) + v1.1 city', () => {
    const p = contactSchema.parse({
      ...base,
      city: 'Antalya',
      reply: 'whatsapp',
      message: 'Start in March.',
    });
    expect(toContactFields(p)).toEqual({
      name: 'Ayşe Yılmaz',
      email: 'ayse@akdenizotel.com',
      phone: '+90 532 000 00 00',
      company: 'Akdeniz Otel A.Ş.',
      topic: 'hire',
      iAm: 'direct_employer',
      subject: '10 welders, 4 CNC operators',
      message: '10 welders, 4 CNC operators\nreply: whatsapp\n\nStart in March.',
      city: 'Antalya',
    });
  });
  it('permit: the employer of record is a direct employer; the workplace city rides as city', () => {
    const f = toContactFields(
      contactSchema.parse({
        ...base,
        topic: 'permit',
        subject: '1 Uzbek chef, already in Türkiye',
        city: 'İstanbul',
      }),
    );
    expect(f).toMatchObject({
      topic: 'permit',
      iAm: 'direct_employer',
      city: 'İstanbul',
      message: '1 Uzbek chef, already in Türkiye',
    });
  });
  it('partner: sourcing_partner; the licence is a message line, never a field of its own', () => {
    const f = toContactFields(
      contactSchema.parse({
        ...base,
        topic: 'partner',
        company: 'Skyline Manpower, Nepal',
        subject: 'welders and masons, 200 on file',
        licence: 'NP-1234',
      }),
    );
    expect(f).toMatchObject({
      topic: 'partner',
      iAm: 'sourcing_partner',
      message: 'welders and masons, 200 on file\nlicence: NP-1234',
    });
    expect(f).not.toHaveProperty('licence');
    expect(f).not.toHaveProperty('city');
  });
  it('a stray city on a partner post and a stray licence on a hire post are both ignored', () => {
    expect(
      toContactFields(contactSchema.parse({ ...base, topic: 'partner', city: 'Antalya' })),
    ).not.toHaveProperty('city');
    expect(toContactFields(contactSchema.parse({ ...base, licence: 'X-1' })).message).toBe(
      base.subject,
    );
  });
  it('an empty optional never becomes a field, and every key sent is a catalog name', () => {
    const f = toContactFields(contactSchema.parse({ ...base, city: '', licence: '', message: '' }));
    expect(f).not.toHaveProperty('city');
    expect(f.message).toBe(base.subject);
    for (const key of Object.keys(f)) expect(CONTACT_CATALOG).toContain(key);
  });
  it('composeContactMessage stays under the catalog cap of 5000 at the schema maxima', () => {
    const p = contactSchema.parse({
      ...base,
      topic: 'partner',
      subject: 's'.repeat(200),
      licence: 'l'.repeat(200),
      reply: 'call',
      message: 'm'.repeat(4000),
    });
    expect(composeContactMessage(p).length).toBeLessThanOrEqual(5000);
  });
});

describe('callback', () => {
  it('requires the W3 name and a phone; preferredTime is "<day> <slot>" from keys', () => {
    expect(callbackSchema.safeParse({ phone: '+90 532 000 00 00' }).success).toBe(false);
    const p = callbackSchema.parse({
      name: 'Mehmet Kaya',
      phone: '+90 532 000 00 00',
      day: 'tomorrow',
      slot: '14-16',
    });
    expect(toCallbackFields(p)).toEqual({
      name: 'Mehmet Kaya',
      phone: '+90 532 000 00 00',
      preferredTime: 'tomorrow 14-16',
    });
  });
  it('the day alone, or no preferredTime at all when nothing is picked', () => {
    expect(
      toCallbackFields(callbackSchema.parse({ name: 'M', phone: '05320000000', day: 'today' }))
        .preferredTime,
    ).toBe('today');
    expect(
      toCallbackFields(callbackSchema.parse({ name: 'M', phone: '05320000000' })),
    ).not.toHaveProperty('preferredTime');
  });
  it('refuses a slot label in place of a key (W77)', () => {
    expect(
      callbackSchema.safeParse({ name: 'M', phone: '05320000000', slot: '09:00–11:00' }).success,
    ).toBe(false);
  });
});

describe('visit', () => {
  it('requires name / e-mail / phone (W3) and pins office = antalya', () => {
    expect(visitSchema.safeParse({ name: 'A', phone: '+90 532 000 00 00' }).success).toBe(false);
    const p = visitSchema.parse({
      name: 'A',
      email: 'a@b.co',
      phone: '+90 532 000 00 00',
      preferredDate: '2026-10-01',
      preferredTime: '11:00',
    });
    expect(toVisitFields(p)).toEqual({
      name: 'A',
      email: 'a@b.co',
      phone: '+90 532 000 00 00',
      office: 'antalya',
      preferredDate: '2026-10-01',
      preferredTime: '11:00',
    });
  });
  it('refuses a time outside the five slots and accepts a typed date of up to 40 characters', () => {
    expect(
      visitSchema.safeParse({
        name: 'A',
        email: 'a@b.co',
        phone: '05320000000',
        preferredTime: '12:00',
      }).success,
    ).toBe(false);
    expect(
      visitSchema.safeParse({
        name: 'A',
        email: 'a@b.co',
        phone: '05320000000',
        preferredDate: 'Wed 30 Sep',
      }).success,
    ).toBe(true);
    expect(
      visitSchema.safeParse({
        name: 'A',
        email: 'a@b.co',
        phone: '05320000000',
        preferredDate: 'x'.repeat(41),
      }).success,
    ).toBe(false);
  });
  it('sends no field beyond the catalog', () => {
    const f = toVisitFields(
      visitSchema.parse({ name: 'A', email: 'a@b.co', phone: '05320000000' }),
    );
    for (const key of Object.keys(f))
      expect([
        'name',
        'company',
        'email',
        'phone',
        'office',
        'preferredDate',
        'preferredTime',
        'message',
      ]).toContain(key);
  });
});
