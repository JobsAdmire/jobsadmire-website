import { render, screen } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LiveStatus } from '../LiveStatus';

const antalya = { tz: 'Europe/Istanbul', days: [1, 2, 3, 4, 5], open: '09:00', close: '18:00' };
const officeLabels = {
  openNow: 'Open now · {time} local · closes {close}',
  closedOpensAt: 'Closed · opens {open} · {time} local',
  closedOpensTomorrow: 'Closed · opens {open} tomorrow',
  closedOpensOn: 'Closed · opens {day} {open}',
};
const FALLBACK = 'Mon–Fri · 09:00–18:00 (TRT)';

describe('LiveStatus', () => {
  // Only Date is faked: the page clock's interval stays real and is cleared on unmount.
  beforeEach(() => vi.useFakeTimers({ toFake: ['Date'] }));
  afterEach(() => vi.useRealTimers());

  it('server render: the office row’s hours, a neutral dot, no data-open — the markup hydration expects (R18)', () => {
    vi.setSystemTime(new Date('2026-09-23T07:32:00Z'));
    const html = renderToStaticMarkup(
      <LiveStatus
        variant="office"
        hours={antalya}
        locale="en"
        fallback={FALLBACK}
        labels={officeLabels}
      />,
    );
    expect(html).toContain(FALLBACK);
    expect(html).toContain('bg-muted');
    expect(html).not.toContain('data-open');
  });

  // Final pass D2 (W197 c): the pill reserves every line it can show — invisible, aria-hidden
  // copies stacked in the live text's grid cell, tabular digits — so the hydration swap from the
  // fallback to the live line (and each minute's tick) never moves the layout (CLS 0.0035
  // measured, ≈ 0.03 possible on narrow Turkish weekends). The fallback itself is in the reserve
  // (W216 (4)): zero cost while it is the narrowest line, zero shift if a bundle makes it the widest.
  it('server render reserves every possible line invisibly in the live text’s cell (D2)', () => {
    vi.setSystemTime(new Date('2026-09-23T07:32:00Z'));
    const { container } = render(
      <LiveStatus
        variant="office"
        hours={antalya}
        locale="en"
        fallback={FALLBACK}
        labels={officeLabels}
        suffix="Mon–Fri"
      />,
    );
    const pill = screen.getByTestId('live-status');
    expect(pill).toHaveClass('tabular-nums');
    const live = pill.querySelector('[data-live-text]')!;
    expect(live).toHaveTextContent('Open now · 10:32 local · closes 18:00 · Mon–Fri');
    expect(live).toHaveClass('col-start-1', 'row-start-1');
    expect(live.parentElement).toHaveClass('grid');
    const reserve = [...container.querySelectorAll('span.invisible[aria-hidden="true"]')];
    expect(reserve.map((s) => s.textContent)).toEqual(
      expect.arrayContaining([
        FALLBACK,
        'Closed · opens 09:00 tomorrow · Mon–Fri',
        'Closed · opens Monday 09:00 · Mon–Fri',
        'Open now · 00:00 local · closes 18:00 · Mon–Fri',
      ]),
    );
    for (const s of reserve) expect(s).toHaveClass('col-start-1', 'row-start-1');
    // the server markup carries the same reserve (R18: the hydration tree matches)
    const html = renderToStaticMarkup(
      <LiveStatus
        variant="office"
        hours={antalya}
        locale="en"
        fallback={FALLBACK}
        labels={officeLabels}
      />,
    );
    expect(html).toContain('Closed · opens 09:00 tomorrow');
    expect(html).toMatch(/data-live-text=""[^>]*>Mon–Fri · 09:00–18:00 \(TRT\)</);
  });

  it('client render: the computed line and data-open="true" inside the hours', () => {
    vi.setSystemTime(new Date('2026-09-23T07:32:00Z')); // Wednesday 10:32 in Istanbul
    render(
      <LiveStatus
        variant="office"
        hours={antalya}
        locale="en"
        fallback={FALLBACK}
        labels={officeLabels}
      />,
    );
    const pill = screen.getByTestId('live-status');
    expect(pill).toHaveTextContent('Open now · 10:32 local · closes 18:00');
    expect(pill).toHaveAttribute('data-open', 'true');
    expect(pill).toHaveAttribute('data-variant', 'office');
  });

  it('Friday night names Monday in the page locale', () => {
    vi.setSystemTime(new Date('2026-09-25T16:00:00Z'));
    render(
      <LiveStatus
        variant="office"
        hours={antalya}
        locale="tr"
        fallback={FALLBACK}
        labels={{ ...officeLabels, closedOpensOn: 'Kapalı · açılış {day} {open}' }}
      />,
    );
    expect(screen.getByTestId('live-status')).toHaveTextContent('Kapalı · açılış Pazartesi 09:00');
    expect(screen.getByTestId('live-status')).toHaveAttribute('data-open', 'false');
  });

  it('lines appends the page’s hours suffix; hero composes the package split', () => {
    vi.setSystemTime(new Date('2026-09-23T07:32:00Z'));
    render(
      <>
        <LiveStatus
          variant="lines"
          hours={antalya}
          locale="en"
          fallback="Mon–Fri 09:00–18:00"
          suffix="Mon–Fri 09:00–18:00"
          labels={{ open: 'Lines open now', closed: 'Lines closed' }}
        />
        <LiveStatus
          variant="hero"
          hours={antalya}
          locale="en"
          fallback={FALLBACK}
          labels={{
            openNow: 'Office open now ·',
            inCity: 'in Antalya',
            weekend: 'Weekend · WhatsApp is still watched',
            closedToday: 'Closed for today',
            opensAt: 'Opens {open}',
          }}
        />
      </>,
    );
    const [lines, hero] = screen.getAllByTestId('live-status');
    expect(lines).toHaveTextContent('Lines open now · Mon–Fri 09:00–18:00');
    expect(hero).toHaveTextContent('Office open now · 10:32 in Antalya');
  });

  it('whatsapp: the off-hours line at the weekend', () => {
    vi.setSystemTime(new Date('2026-09-26T09:00:00Z')); // Saturday
    render(
      <LiveStatus
        variant="whatsapp"
        hours={antalya}
        locale="en"
        fallback={FALLBACK}
        labels={{ watched: 'Watched now', off: 'Off hours' }}
      />,
    );
    expect(screen.getByTestId('live-status')).toHaveTextContent('Off hours');
  });
});
