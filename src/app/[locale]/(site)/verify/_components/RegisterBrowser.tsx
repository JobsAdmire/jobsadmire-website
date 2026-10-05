'use client';
import { useId, useState, type ReactNode } from 'react';
import { ChevronIcon, SearchIcon } from './icons';

/** One entry of the side list: what the list shows and the panel head's title for it. */
export type RegisterView = { key: string; label: string; title: string };

/** Every label arrives resolved (W9/W148): this island calls no `useTranslations`. */
export type RegisterLabels = {
  browse: string; // verify.064
  note: string; // verify.065
  showing: string; // jt.304 — the ≤ 700 picker's caption
  tapToChange: string; // sys.verify.register.tapToChange
  payroll: string; // verify.066
  sub: string; // verify.232
  checkId: string; // verify.067
  columns: [string, string, string, string]; // verify.068–071
};

const ITEM =
  'flex min-h-[44px] w-full cursor-pointer items-center gap-2.5 rounded-[11px] px-3 py-2.5 text-left text-[13.5px] font-extrabold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe max-md:px-[11px] max-md:text-[13px] xl:text-[11px]';
const ITEM_ON = `${ITEM} bg-indigo text-white`;
const ITEM_OFF = `${ITEM} text-[#43536a] hover:bg-pale-1 max-md:bg-pale-1`;

/**
 * The register's frame (S3.2, Verify ll. 722–818) WITHOUT people (owner ruling): the 280 px side
 * card — "Browse the register", All people / Antalya office / Karachi office (no country
 * divider, no counts), the dashed payroll note — and the panel with its indigo head (the view's
 * title, verify.232, the green "On our payroll — not agents" pill) and the Person / City /
 * Representative ID / Status bar. The panel body is the server-rendered `children` (the empty
 * register row in Phase A). The design opens on the Antalya office (`peopleFilter || "o:Antalya"`,
 * l. 1336). ≤ 700 (M7, ll. 309–313, 409–420): the list folds behind a "SHOWING ▾" picker (a
 * real disclosure button, opening a two-column grid that closes on a pick), the heading carries
 * the "tap to change" pill, the note and the column bar hide, the panel head turns to the
 * gradient and gains the "Check an ID" link up to `#check`. The views are toggle buttons
 * (`aria-pressed`) over the panel they retitle.
 */
export function RegisterBrowser({
  labels,
  views,
  defaultKey,
  children,
}: {
  labels: RegisterLabels;
  views: RegisterView[];
  defaultKey: string;
  children: ReactNode;
}) {
  const [selected, setSelected] = useState(defaultKey);
  const [open, setOpen] = useState(false);
  const listId = useId();
  const panelId = useId();
  const current = views.find((v) => v.key === selected) ?? views[0];
  return (
    <div
      data-testid="verify-register-frame"
      className="grid items-start gap-5 max-md:gap-3 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[210px_minmax(0,1fr)]"
    >
      <div className="rounded-[18px] border border-edge bg-white p-3.5 shadow-[0_12px_30px_rgba(22,60,90,0.06)] max-md:rounded-sm max-md:border-border-1 max-md:px-2.5 max-md:pt-[11px] max-md:pb-[9px] max-md:shadow-[0_8px_20px_rgba(22,60,90,0.05)] lg:sticky lg:top-(--sticky-top)">
        <p className="m-0 px-3 pt-1.5 pb-3 text-[11.5px] font-extrabold tracking-[1.2px] text-text-tertiary uppercase max-md:flex max-md:items-center max-md:justify-between max-md:px-[3px] max-md:pt-px max-md:pb-[9px] max-md:text-[11px] max-md:tracking-[1.1px] xl:text-[11px]">
          {labels.browse}
          <span
            aria-hidden="true"
            className="rounded-pill border border-tint-border bg-tint px-2.5 py-[3px] text-[10px] font-extrabold tracking-[0.9px] text-blue-safe uppercase md:hidden xl:text-[11px]"
          >
            {labels.tapToChange}
          </span>
        </p>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={listId}
          onClick={() => setOpen((v) => !v)}
          className="flex min-h-[54px] w-full cursor-pointer items-center gap-[9px] rounded-xs border-2 border-tint-border bg-white px-3 py-2.5 text-left shadow-[0_6px_16px_rgba(22,60,90,0.09)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe md:hidden"
        >
          <span className="shrink-0 text-[11px] font-extrabold tracking-[1px] text-text-tertiary uppercase">
            {labels.showing}
          </span>
          <span className="min-w-0 truncate text-[13.5px] font-extrabold text-ink">
            {current.label}
          </span>
          <span
            aria-hidden="true"
            className="ml-auto flex size-[38px] shrink-0 items-center justify-center rounded-xs border border-[rgba(127,208,245,0.28)] bg-[linear-gradient(160deg,#253063_0%,#0e1a37_100%)] text-sky"
          >
            <ChevronIcon
              size={15}
              className={`transition-transform duration-200 motion-reduce:transition-none ${open ? 'rotate-180' : 'rotate-0'}`}
            />
          </span>
        </button>
        <ul
          id={listId}
          className={`m-0 list-none gap-1.5 p-0 max-md:grid-cols-2 md:flex md:flex-col md:gap-[3px] ${open ? 'mt-2 grid md:mt-0' : 'hidden'}`}
        >
          {views.map((v) => (
            <li key={v.key} className="min-w-0">
              <button
                type="button"
                aria-pressed={v.key === selected}
                aria-controls={panelId}
                onClick={() => {
                  setSelected(v.key);
                  setOpen(false);
                }}
                className={v.key === selected ? ITEM_ON : ITEM_OFF}
              >
                <span className="min-w-0">{v.label}</span>
              </button>
            </li>
          ))}
        </ul>
        <p className="mx-0 mt-3 mb-0 border-t border-dashed border-border-1 px-3 pt-3 pb-1 text-[12px] leading-[1.55] font-semibold text-text-tertiary max-md:hidden xl:text-[11px]">
          {labels.note}
        </p>
      </div>

      <div
        id={panelId}
        data-testid="verify-register-panel"
        className="overflow-hidden rounded-[18px] border border-edge bg-white shadow-[0_14px_34px_rgba(22,60,90,0.07)]"
      >
        <div className="flex flex-wrap items-center gap-3 bg-indigo px-6 py-[15px] max-md:gap-2 max-md:bg-[linear-gradient(135deg,#253063_0%,#16202e_100%)] max-md:px-[15px] max-md:py-3">
          <h3 className="m-0 text-[16px] font-extrabold tracking-[-0.3px] text-white max-md:text-[15px] xl:text-[12px]">
            {current.title}
          </h3>
          <span className="text-[12.5px] font-bold text-[#a8bce0] xl:text-[11px]">
            {labels.sub}
          </span>
          <span className="ml-auto inline-flex items-center gap-[7px] rounded-pill border border-[rgba(93,223,176,0.35)] bg-[rgba(93,223,176,0.13)] px-[13px] py-[5px] text-[11.5px] font-extrabold whitespace-nowrap text-[#5ddfb0] max-md:order-2 max-md:ml-0 max-md:px-[11px] max-md:py-1 max-md:text-[10.5px] xl:text-[11px]">
            <span aria-hidden="true" className="ja-live size-2 shrink-0 rounded-pill bg-success" />
            {labels.payroll}
          </span>
          <a
            href="#check"
            className="ml-auto inline-flex min-h-[36px] items-center gap-[7px] rounded-pill border border-white/30 bg-white/[0.12] px-3.5 text-[12px] font-extrabold whitespace-nowrap text-white no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:hidden"
          >
            <SearchIcon size={13} className="shrink-0" />
            {labels.checkId}
          </a>
        </div>
        <div
          aria-hidden="true"
          className="grid grid-cols-[1.8fr_0.85fr_0.8fr_0.6fr] gap-4 border-b border-[#e4eef5] bg-field-fill px-6 py-2.5 text-[11px] font-extrabold tracking-[1.1px] text-text-tertiary uppercase max-md:hidden xl:text-[11px]"
        >
          {labels.columns.map((c) => (
            <span key={c}>{c}</span>
          ))}
        </div>
        {children}
      </div>
    </div>
  );
}
