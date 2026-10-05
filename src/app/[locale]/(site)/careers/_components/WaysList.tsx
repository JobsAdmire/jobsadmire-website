'use client';
import { useId, useState } from 'react';
import { ChevronDownIcon } from '@/design/chrome/icons';

export type Way = { badge: string; title: string; body: string; bullets: string[] };

/** The three faces (design ll. 812–849, ≤ 900 px ll. 391–419): the navy card (night → ink on
 *  phones), the white card (tint on phones) and the neutral one (pale on phones); badges turn
 *  white on the two light cards below 901 px. */
const FACE = [
  {
    card: 'bg-[linear-gradient(135deg,#253063_0%,#16204a_100%)] text-white max-lg:bg-[linear-gradient(150deg,#0a1428_0%,#16202e_100%)]',
    badge: 'border-white/20 bg-white/14 text-white',
    body: 'text-[#c9d6ec] max-lg:text-white/72',
    bullet: 'text-[#e6ecf8] max-lg:text-white/85',
    dot: 'text-[#7de2a5] max-lg:text-[#4ade80]',
    chevron: 'text-white',
  },
  {
    card: 'border-[1.5px] border-edge bg-white text-ink max-lg:border max-lg:border-tint-border max-lg:bg-tint',
    badge: 'border-transparent bg-tint text-blue-safe max-lg:border-tint-border max-lg:bg-white',
    body: 'font-semibold text-text-secondary',
    bullet: 'text-text-secondary',
    dot: 'text-blue',
    chevron: 'text-blue-safe',
  },
  {
    card: 'border-[1.5px] border-edge bg-white text-ink max-lg:border max-lg:border-border-1 max-lg:bg-pale-1',
    badge:
      'border-edge-soft bg-pale-1 text-text-secondary max-lg:border-border-1 max-lg:bg-white max-lg:text-[#43536a]',
    body: 'font-semibold text-text-secondary',
    bullet: 'text-text-secondary',
    dot: 'text-blue max-lg:text-[#7fa8c4]',
    chevron: 'text-text-secondary',
  },
] as const;

/**
 * "Three ways to work with us" (design `.ja-jt-ways`): three static cards from 901 px; below,
 * the design's accordions (`.ja-way`, ll. 410–418) — the first open, each card's title a
 * button whose stretched hit area makes the whole card the toggle, a chevron turning 180°. The
 * body stays in the DOM (`max-lg:hidden` when closed), so from 901 px every card shows in full
 * whatever its phone state. The cards rise in one after the other on phones (`.ja-jt-ways`,
 * src/design/motion/motion.css).
 */
export function WaysList({ ways }: { ways: Way[] }) {
  const base = useId();
  const [open, setOpen] = useState<boolean[]>(() => ways.map((_, i) => i === 0));
  const toggle = (i: number) => setOpen((prev) => prev.map((v, j) => (j === i ? !v : v)));
  return (
    <ul className="ja-jt-ways grid gap-[18px] max-lg:gap-3 lg:grid-cols-3">
      {ways.map((w, i) => {
        const face = FACE[i % FACE.length];
        const bodyId = `${base}-way-${i}`;
        return (
          <li
            key={w.title}
            data-testid="careers-way"
            data-open={open[i] || undefined}
            className={`relative rounded-lg p-7 max-lg:rounded-[18px] max-lg:px-[18px] max-lg:py-4 ${face.card}`}
          >
            <p
              className={`mb-4 inline-flex rounded-pill border px-[13px] py-[5px] text-[11.5px] font-extrabold tracking-[1px] uppercase xl:text-[11px] max-lg:mb-3 max-lg:px-[11px] max-lg:py-1 max-lg:text-[11px] max-lg:tracking-[0.9px] ${face.badge}`}
            >
              {w.badge}
            </p>
            <h3 className="text-[21px] font-extrabold tracking-[-0.5px] xl:text-[15.75px] max-lg:pr-[34px] max-lg:text-[19px] max-lg:tracking-[-0.4px]">
              <button
                type="button"
                aria-expanded={open[i]}
                aria-controls={bodyId}
                onClick={() => toggle(i)}
                className="text-left before:absolute before:inset-0 before:rounded-[18px] before:content-[''] focus-visible:outline-none focus-visible:before:outline-2 focus-visible:before:outline-offset-2 focus-visible:before:outline-blue-safe lg:hidden"
              >
                {w.title}
                <span
                  aria-hidden="true"
                  className={`absolute top-[18px] right-3.5 flex h-7 w-7 items-center justify-center transition-transform duration-200 ${face.chevron} ${open[i] ? 'rotate-180' : ''}`}
                >
                  <ChevronDownIcon size={17} />
                </span>
              </button>
              <span className="max-lg:hidden">{w.title}</span>
            </h3>
            <div id={bodyId} className={open[i] ? 'max-lg:mt-[9px]' : 'max-lg:hidden'}>
              <p
                className={`mt-[9px] mb-[18px] text-[14.5px] leading-[1.62] xl:text-[11px] max-lg:mt-0 max-lg:mb-[13px] max-lg:text-[13.5px] max-lg:leading-[1.5] ${face.body}`}
              >
                {w.body}
              </p>
              <ul className="flex flex-col gap-2 max-lg:gap-1.5">
                {w.bullets.map((b) => (
                  <li
                    key={b}
                    className={`flex items-start gap-[9px] text-[13.5px] leading-[1.5] xl:text-[11px] max-lg:gap-[7px] max-lg:text-[12.5px] max-lg:leading-[1.42] ${face.bullet}`}
                  >
                    <span aria-hidden="true" className={`font-extrabold ${face.dot}`}>
                      •
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
