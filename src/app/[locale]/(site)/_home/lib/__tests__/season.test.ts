import { describe, expect, it } from 'vitest';
import {
  monthNames,
  nowMarkerLeft,
  SEASON_ROWS,
  seasonHeadline,
  seasonRange,
  signByMonth,
  type SeasonTx,
} from '../season';

const tx: SeasonTx = {
  range: ({ from, to }) => `Peak ${from}–${to}`,
  also: ({ from, to }) => ` · also ${from}–${to}`,
  signBy: ({ start, signBy }) => `To start in ${start}, sign by ${signBy}`,
  noPeak: () => 'No peak season — but permits still take 45 days',
};

describe("SEASON_ROWS — the design's four rows (months are data, copy is package ids)", () => {
  it("carries the design's ranges and ids", () => {
    expect(SEASON_ROWS.map((r) => r.key)).toEqual([
      'agriculture',
      'tourism',
      'construction',
      'factory',
    ]);
    expect(SEASON_ROWS[0]).toMatchObject({
      nameId: 'home.243',
      subId: null,
      noteId: 'home.250',
      peak: [8, 11],
      second: [2, 4],
      start: 8,
    });
    expect(SEASON_ROWS[1]).toMatchObject({
      nameId: 'home.247',
      subId: 'home.244',
      noteId: 'home.251',
      peak: [3, 9],
      second: [10, 11],
      start: 3,
    });
    expect(SEASON_ROWS[2]).toMatchObject({
      nameId: 'home.248',
      subId: 'home.245',
      noteId: 'home.252',
      peak: [2, 10],
      second: null,
      start: 2,
    });
    expect(SEASON_ROWS[3]).toMatchObject({
      nameId: 'home.249',
      subId: 'home.246',
      noteId: 'home.253',
      peak: [0, 11],
      second: null,
      start: null,
    });
  });
});

describe('month names come from Intl, never a hard-coded list', () => {
  it('TR short and long', () => {
    expect(monthNames('tr', 'short')).toEqual([
      'Oca',
      'Şub',
      'Mar',
      'Nis',
      'May',
      'Haz',
      'Tem',
      'Ağu',
      'Eyl',
      'Eki',
      'Kas',
      'Ara',
    ]);
    expect(monthNames('tr', 'long')[8]).toBe('Eylül');
  });

  it('EN short is the design\'s three letters ("Sep", not en-GB\'s "Sept")', () => {
    expect(monthNames('en', 'short')).toEqual([
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ]);
    expect(monthNames('en', 'long')[0]).toBe('January');
  });
});

describe('composition', () => {
  const short = monthNames('en', 'short');
  const long = monthNames('en', 'long');

  it("sign-by is two months before the start, wrapping the year (the design's backTwo)", () => {
    expect(signByMonth(8)).toBe(6);
    expect(signByMonth(0)).toBe(10);
    expect(signByMonth(1)).toBe(11);
  });

  it('the range text: the peak, plus the secondary season when there is one', () => {
    expect(seasonRange(SEASON_ROWS[0], short, tx)).toBe('Peak Sep–Dec · also Mar–May');
    expect(seasonRange(SEASON_ROWS[2], short, tx)).toBe('Peak Mar–Nov');
  });

  it('the headline: sign-by for a dated start, the no-peak line for the year-round row', () => {
    expect(seasonHeadline(SEASON_ROWS[0], long, tx)).toBe('To start in September, sign by July');
    expect(seasonHeadline(SEASON_ROWS[1], long, tx)).toBe('To start in April, sign by February');
    expect(seasonHeadline(SEASON_ROWS[3], long, tx)).toBe(
      'No peak season — but permits still take 45 days',
    );
  });

  it('the "this month" line sits mid-column', () => {
    expect(nowMarkerLeft(0)).toBe('4.17%');
    expect(nowMarkerLeft(11)).toBe('95.83%');
  });
});
