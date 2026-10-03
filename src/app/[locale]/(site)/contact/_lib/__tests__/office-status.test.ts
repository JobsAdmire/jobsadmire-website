import { describe, expect, it } from 'vitest';
import {
  formatVisitDay,
  localParts,
  nextOpenDates,
  officeStatus,
  weekdayName,
} from '../office-status';

// The `offices` rows as imported (JS getDay(): 0 = Sun … 6 = Sat, W43).
const antalya = { tz: 'Europe/Istanbul', days: [1, 2, 3, 4, 5], open: '09:00', close: '18:00' };
const karachi = { tz: 'Asia/Karachi', days: [1, 2, 3, 4, 5, 6], open: '10:00', close: '19:00' };

describe('localParts', () => {
  it('reads the clock in the office zone, never the runtime zone', () => {
    // 07:32Z = 10:32 in Istanbul (UTC+3, no DST), a Wednesday; the same instant is 12:32 in Karachi.
    expect(localParts(new Date('2026-09-23T07:32:00Z'), antalya.tz)).toEqual({
      day: 3,
      minutes: 632,
      clock: '10:32',
    });
    expect(localParts(new Date('2026-09-23T07:32:00Z'), karachi.tz).clock).toBe('12:32');
  });
  it('midnight reads 00:00', () => {
    expect(localParts(new Date('2026-09-22T21:00:00Z'), antalya.tz)).toEqual({
      day: 3,
      minutes: 0,
      clock: '00:00',
    });
  });
});

describe('officeStatus', () => {
  it('open inside the hours of an open day, the opening minute included', () => {
    expect(officeStatus(new Date('2026-09-23T07:32:00Z'), antalya)).toEqual({
      open: true,
      clock: '10:32',
    });
    expect(officeStatus(new Date('2026-09-23T06:00:00Z'), antalya)).toEqual({
      open: true,
      clock: '09:00',
    });
  });
  it('before opening on an open day → beforeOpen, opens today', () => {
    expect(officeStatus(new Date('2026-09-23T05:10:00Z'), antalya)).toEqual({
      open: false,
      clock: '08:10',
      reason: 'beforeOpen',
      nextOpenDay: 3,
      opensTomorrow: false,
    });
  });
  it('the closing minute is closed; after closing on a weekday → opens tomorrow', () => {
    expect(officeStatus(new Date('2026-09-23T15:00:00Z'), antalya)).toMatchObject({
      open: false,
      reason: 'afterClose',
      nextOpenDay: 4,
      opensTomorrow: true,
    });
    expect(officeStatus(new Date('2026-09-23T16:00:00Z'), antalya)).toEqual({
      open: false,
      clock: '19:00',
      reason: 'afterClose',
      nextOpenDay: 4,
      opensTomorrow: true,
    });
  });
  it('Friday evening → opens Monday, not tomorrow', () => {
    expect(officeStatus(new Date('2026-09-25T16:00:00Z'), antalya)).toMatchObject({
      open: false,
      reason: 'afterClose',
      nextOpenDay: 1,
      opensTomorrow: false,
    });
  });
  it('Saturday is a closed day in Antalya and an open one in Karachi (Mon–Sat)', () => {
    expect(officeStatus(new Date('2026-09-26T09:00:00Z'), antalya)).toMatchObject({
      open: false,
      reason: 'closedDay',
      nextOpenDay: 1,
      opensTomorrow: false,
    });
    expect(officeStatus(new Date('2026-09-26T07:00:00Z'), karachi)).toEqual({
      open: true,
      clock: '12:00',
    });
  });
  it('Sunday → closedDay, opens Monday (tomorrow)', () => {
    expect(officeStatus(new Date('2026-09-27T12:00:00Z'), karachi)).toMatchObject({
      open: false,
      reason: 'closedDay',
      nextOpenDay: 1,
      opensTomorrow: true,
    });
  });
  it('an office row with no open day is closed, never a throw (a data defect must not take the page down)', () => {
    expect(officeStatus(new Date('2026-09-23T07:32:00Z'), { ...antalya, days: [] })).toMatchObject({
      open: false,
      reason: 'closedDay',
    });
  });
});

describe('weekdayName', () => {
  it('localized long names from a JS getDay() index', () => {
    expect(weekdayName(1, 'en')).toBe('Monday');
    expect(weekdayName(1, 'tr')).toBe('Pazartesi');
    expect(weekdayName(0, 'tr')).toBe('Pazar');
  });
});

describe('nextOpenDates / formatVisitDay', () => {
  it('the next five Antalya open days from a Friday night, as ISO dates in the office zone', () => {
    // 20:00Z Friday 25 Sep = 23:00 in Istanbul: today is over, Saturday and Sunday are closed.
    expect(nextOpenDates(new Date('2026-09-25T20:00:00Z'), antalya, 5)).toEqual([
      '2026-09-28',
      '2026-09-29',
      '2026-09-30',
      '2026-10-01',
      '2026-10-02',
    ]);
  });
  it('never includes today (the design starts at tomorrow), even when UTC is still on the previous date', () => {
    expect(nextOpenDates(new Date('2026-09-23T07:32:00Z'), antalya, 3)).toEqual([
      '2026-09-24',
      '2026-09-25',
      '2026-09-28',
    ]);
    // 22:30Z Thursday = 01:30 Friday in Istanbul → Friday is "today", so Monday comes first.
    expect(nextOpenDates(new Date('2026-09-24T22:30:00Z'), antalya, 2)).toEqual([
      '2026-09-28',
      '2026-09-29',
    ]);
  });
  it('formats a calendar date day-first per locale, unshifted by the runtime zone', () => {
    expect(formatVisitDay('2026-09-28', 'en')).toMatch(/^Mon 28 Sept?$/);
    expect(formatVisitDay('2026-09-28', 'tr')).toBe('28 Eyl Pzt');
  });
});
