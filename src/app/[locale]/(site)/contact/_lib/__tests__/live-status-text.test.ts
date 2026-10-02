import { describe, expect, it } from 'vitest';
import { fillTemplate, liveStatusText } from '../live-status-text';
import { officeStatus } from '../office-status';

const antalya = { tz: 'Europe/Istanbul', days: [1, 2, 3, 4, 5], open: '09:00', close: '18:00' };
const karachi = { tz: 'Asia/Karachi', days: [1, 2, 3, 4, 5, 6], open: '10:00', close: '19:00' };
const at = (iso: string, hours = antalya) => officeStatus(new Date(iso), hours);

// The package fragments (contact.152–155, 215, 216) and the sys templates as the page passes them.
const hero = {
  variant: 'hero',
  labels: {
    openNow: 'Office open now ·',
    inCity: 'in Antalya',
    weekend: 'Weekend · WhatsApp is still watched',
    closedToday: 'Closed for today',
    opensAt: 'Opens {open}',
  },
} as const;
const whatsapp = {
  variant: 'whatsapp',
  labels: { watched: 'Watched now', off: 'Off hours' },
} as const;
const lines = {
  variant: 'lines',
  labels: { open: 'Lines open now', closed: 'Lines closed' },
} as const;
const office = {
  variant: 'office',
  labels: {
    openNow: 'Open now · {time} local · closes {close}',
    closedOpensAt: 'Closed · opens {open} · {time} local',
    closedOpensTomorrow: 'Closed · opens {open} tomorrow',
    closedOpensOn: 'Closed · opens {day} {open}',
  },
} as const;

describe('fillTemplate', () => {
  it('fills the named arguments and leaves an unknown one visible (a copy defect shows, never crashes)', () => {
    expect(fillTemplate('Opens {open} · {time}', { open: '09:00', time: '08:10' })).toBe(
      'Opens 09:00 · 08:10',
    );
    expect(fillTemplate('Opens {when}', { open: '09:00' })).toBe('Opens {when}');
  });
});

describe('liveStatusText', () => {
  it('hero: the package split around the clock (contact.152 + clock + contact.153)', () => {
    expect(liveStatusText(hero, at('2026-09-23T07:32:00Z'), antalya, 'en')).toBe(
      'Office open now · 10:32 in Antalya',
    );
  });
  it('hero: before opening, after closing and at the weekend', () => {
    expect(liveStatusText(hero, at('2026-09-23T05:10:00Z'), antalya, 'en')).toBe(
      'Opens 09:00 · 08:10 in Antalya',
    );
    expect(liveStatusText(hero, at('2026-09-23T16:05:00Z'), antalya, 'en')).toBe(
      'Closed for today · 19:05 in Antalya',
    );
    expect(liveStatusText(hero, at('2026-09-26T09:00:00Z'), antalya, 'en')).toBe(
      'Weekend · WhatsApp is still watched',
    );
  });
  it('whatsapp and lines follow the Antalya hours', () => {
    expect(liveStatusText(whatsapp, at('2026-09-23T07:32:00Z'), antalya, 'en')).toBe('Watched now');
    expect(liveStatusText(whatsapp, at('2026-09-26T09:00:00Z'), antalya, 'en')).toBe('Off hours');
    expect(liveStatusText(lines, at('2026-09-23T07:32:00Z'), antalya, 'en')).toBe('Lines open now');
    expect(liveStatusText(lines, at('2026-09-23T16:00:00Z'), antalya, 'en')).toBe('Lines closed');
  });
  it('office: open, before opening, closed until tomorrow', () => {
    expect(liveStatusText(office, at('2026-09-23T07:32:00Z'), antalya, 'en')).toBe(
      'Open now · 10:32 local · closes 18:00',
    );
    expect(liveStatusText(office, at('2026-09-23T05:10:00Z'), antalya, 'en')).toBe(
      'Closed · opens 09:00 · 08:10 local',
    );
    expect(liveStatusText(office, at('2026-09-23T16:00:00Z'), antalya, 'en')).toBe(
      'Closed · opens 09:00 tomorrow',
    );
  });
  it('office: Friday night names the next open weekday in the page locale; Karachi keeps its own hours', () => {
    expect(liveStatusText(office, at('2026-09-25T16:00:00Z'), antalya, 'en')).toBe(
      'Closed · opens Monday 09:00',
    );
    expect(liveStatusText(office, at('2026-09-25T16:00:00Z'), antalya, 'tr')).toBe(
      'Closed · opens Pazartesi 09:00',
    );
    expect(liveStatusText(office, at('2026-09-26T07:00:00Z', karachi), karachi, 'en')).toBe(
      'Open now · 12:00 local · closes 19:00',
    );
  });
});
