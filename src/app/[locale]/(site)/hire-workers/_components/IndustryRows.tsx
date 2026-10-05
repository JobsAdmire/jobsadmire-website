'use client';
import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import type { SectorKey } from '@/content/collections';
import { ArrowRightIcon } from '@/design/chrome/icons';
import { buttonClassName } from '@/design/primitives/Button';
import { SectorPrefillLink } from './SectorPrefillLink';

/** One resolved industry row (the page resolves every string on the server). */
export type IndustryRowView = {
  key: Exclude<SectorKey, 'other'>;
  /** "01" … "06" */
  n: string;
  title: string;
  subtitle: string | null;
  /** the design's first row: a green dot before a blue subtitle ("En çok talep edilen · …") */
  accent: boolean;
  /** the chips shown in the row at rest */
  chips: readonly string[];
  /** the chips inside the opened panel, under `moreLabel` */
  more: readonly string[];
  /** the panel CTA ("Fabrika işçisi talep edin →") — also the round arrow's accessible name */
  cta: string;
};

/** A role chip (12.5 px / 700, 5 × 13 px, pill) — rem spacing, so it scales from 1101 px (D19). */
const CHIP =
  'rounded-pill border px-3.25 py-1.25 text-[12.5px] leading-[1.4] font-bold whitespace-nowrap xl:text-[11px]';

/** Design `.ja-row` (Hire Workers ll. 713–905, CSS ll. 32–44, 79–112): a 70 px number tile, the
 *  h3 + subtitle, the role chips aligned right and a 44 px round →, the whole row the toggle.
 *  The row's button is the h3's own text, stretched over the row by its `::after`, so a click
 *  anywhere opens the sector exactly like the design's `onClick` row while keyboard and screen
 *  reader users meet one real `button` (aria-expanded / aria-controls, the WAI-ARIA accordion
 *  pattern the foundation `Accordion` follows). The arrow and the panel sit above that overlay.
 *  Hover (ll. 32–42): the tint face and a 10 px indent, the 3 px blue bar growing on the left,
 *  the number tile turning blue with its bounce (`.ja-row:hover .ja-num`, motion.css), the chips
 *  white and the arrow filling blue and turning −45°. ≤ 700 px: number + title on one row, the
 *  chips one horizontally scrolling line below, no arrow, no indent. */
const ROW =
  "ja-row group relative grid grid-cols-[4.375rem_minmax(15rem,1fr)_minmax(0,1.15fr)_2.75rem] items-center gap-7 border-b border-border-4 px-4.5 py-6.5 transition-[background-color,padding] duration-200 last:border-b-0 active:bg-pale-1 motion-reduce:transition-none md:hover:bg-pale-1 md:hover:pl-7 max-md:grid-cols-[2.625rem_minmax(0,1fr)] max-md:items-start max-md:gap-x-3.25 max-md:gap-y-2 max-md:px-3.5 max-md:py-4 before:pointer-events-none before:absolute before:top-4.5 before:bottom-4.5 before:left-0 before:w-0.75 before:scale-y-0 before:rounded-[3px] before:bg-blue before:transition-transform before:duration-250 before:content-[''] motion-reduce:before:transition-none md:hover:before:scale-y-100";

const NUM =
  'ja-num flex h-12 w-12 items-center justify-center rounded-sm border border-edge-soft bg-pale-1 text-[16px] font-extrabold tracking-[0.5px] text-text-tertiary transition-colors duration-250 md:group-hover:border-blue-safe md:group-hover:bg-blue-safe md:group-hover:text-white max-md:h-10.5 max-md:w-10.5 max-md:rounded-[13px] max-md:text-[15px] xl:text-[12px]';

const ARROW =
  'ja-arrow relative z-[1] flex h-11 w-11 items-center justify-center justify-self-end rounded-pill border-[1.5px] border-edge bg-white text-blue-safe transition-[background-color,border-color,color,rotate] duration-250 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe group-hover:border-blue group-hover:bg-blue group-hover:text-white motion-safe:group-hover:-rotate-45 max-md:hidden';

/** The row's chip line. ≤ 700 px it scrolls sideways; a region that scrolls must be reachable by
 *  keyboard (axe `scrollable-region-focusable`), so it joins the tab order — named after its
 *  sector — only while its chips actually overflow it, never on the wide rows that don't. */
function ChipLine({ label, children }: { label: string; children: ReactNode }) {
  const ref = useRef<HTMLUListElement>(null);
  const [scrolls, setScrolls] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => setScrolls(el.scrollWidth > el.clientWidth + 1);
    check();
    const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(check) : null;
    observer?.observe(el);
    return () => observer?.disconnect();
  }, []);
  return (
    <ul
      ref={ref}
      tabIndex={scrolls ? 0 : undefined}
      aria-label={scrolls ? label : undefined}
      className="m-0 flex list-none flex-wrap items-center justify-end gap-2 p-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe max-md:relative max-md:z-[1] max-md:col-span-2 max-md:w-full max-md:min-w-0 max-md:flex-nowrap max-md:justify-start max-md:gap-1.75 max-md:overflow-x-auto max-md:pb-0.5 max-md:[scrollbar-width:none] max-md:[&::-webkit-scrollbar]:hidden"
    >
      {children}
    </ul>
  );
}

export function IndustryRows({
  rows,
  moreLabel,
  arrival,
}: {
  rows: readonly IndustryRowView[];
  /** hire.136 */
  moreLabel: string;
  /** hire.137 */
  arrival: string;
}) {
  const base = useId();
  // The design's `openInd: -1`: every row closed at rest, one open at a time.
  const [open, setOpen] = useState<string | null>(null);
  return (
    <ul className="m-0 list-none p-0">
      {rows.map((row) => {
        const isOpen = open === row.key;
        const btnId = `${base}-${row.key}-btn`;
        const panelId = `${base}-${row.key}-panel`;
        // the CTA copy carries its own "→"; the round arrow's name is the words alone
        const ctaName = row.cta.replace(/\s*[→›]\s*$/, '');
        return (
          <li key={row.key} data-open={isOpen || undefined} className={ROW}>
            <span aria-hidden="true" className={NUM}>
              {row.n}
            </span>
            <div className="min-w-0">
              <h3 className="m-0 mb-1 text-[23px] leading-[1.2] font-extrabold tracking-[-0.4px] text-ink max-md:mb-0.5 max-md:text-[17.5px] xl:text-[17.25px]">
                <button
                  id={btnId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? null : row.key)}
                  className="cursor-pointer text-left after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-blue-safe"
                >
                  {row.title}
                </button>
              </h3>
              {row.subtitle ? (
                row.accent ? (
                  <p className="m-0 inline-flex items-center gap-1.5 text-[13px] leading-[1.45] font-bold text-blue-safe xl:text-[11px]">
                    <span
                      aria-hidden="true"
                      className="inline-block h-1.75 w-1.75 flex-none rounded-pill bg-success"
                    />
                    {row.subtitle}
                  </p>
                ) : (
                  <p className="m-0 text-[13.5px] leading-[1.45] font-medium text-text-tertiary max-md:text-[13px] xl:text-[11px]">
                    {row.subtitle}
                  </p>
                )
              ) : null}
            </div>
            <ChipLine label={row.title}>
              {row.chips.map((chip) => (
                <li
                  key={chip}
                  className={`${CHIP} flex-none border-edge-soft bg-pale-1 text-text-secondary transition-colors duration-200 md:group-hover:border-tint-border md:group-hover:bg-white`}
                >
                  {chip}
                </li>
              ))}
            </ChipLine>
            <SectorPrefillLink sector={row.key} aria-label={ctaName} className={ARROW}>
              <ArrowRightIcon size={18} />
            </SectorPrefillLink>
            {/* The panel wrapper carries `hidden` and no display utility (W119); the blue panel
                drops in (`ja-panel`) and its chips pop one by one (`.ja-pop`) each time it opens.
                D20: the design's #1899D5 → #1073a8 is 3.2:1 under white at its light end — the
                contrast-safe #1073a8 → #0d5f8a (the `gradient` face) keeps every word ≥ 4.5:1,
                and the chips' glass is 5 % (15 % in the design drops white text to 3.9:1). */}
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              hidden={!isOpen}
              className="ja-panel relative z-[1] col-span-full mt-1.5 min-w-0 max-md:mt-0"
            >
              <div className="flex flex-wrap items-end justify-between gap-6 rounded-sm bg-gradient-to-br from-blue-safe to-blue-deep px-6 py-5 text-white shadow-[0_16px_36px_rgba(24,153,213,0.35)] max-md:px-4 max-md:py-4.5 xl:shadow-[0_12px_27px_rgba(24,153,213,0.35)]">
                <div className="min-w-0 max-md:w-full">
                  <p className="m-0 mb-2.25 text-[12px] font-extrabold tracking-[1px] text-white uppercase xl:text-[11px] xl:tracking-[0.75px]">
                    {moreLabel}
                  </p>
                  <ul className="m-0 flex list-none flex-wrap gap-1.75 p-0">
                    {row.more.map((chip) => (
                      <li
                        key={chip}
                        className={`ja-pop ${CHIP} border-white/35 bg-white/5 text-white`}
                      >
                        {chip}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col items-end gap-2.25 max-md:w-full max-md:items-stretch">
                  <p className="m-0 text-[12.5px] font-bold text-[#dff3a6] xl:text-[11px]">
                    {arrival}
                  </p>
                  <SectorPrefillLink
                    sector={row.key}
                    className={buttonClassName('white', 'md', 'max-md:w-full', {
                      shape: 'rect',
                      radius: 10,
                    })}
                  >
                    {row.cta}
                  </SectorPrefillLink>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
