'use client';
import { useEffect, useId, useState } from 'react';
import { ContactLink } from '@/analytics/ContactLink';
import { ArrowRightIcon, ChevronDownIcon, WhatsAppIcon } from '@/design/chrome/icons';
import { buttonClassName } from '@/design/primitives/Button';
import { Link } from '@/i18n/navigation';
import type { Engagement, Place } from '@/lib/careers-pure';
import type { RoleCard, RolePanelList } from '../_lib/roles';
import { ChoiceChips } from './ChoiceChips';
import { BuildingIcon, GlobeIcon, PersonIcon, PinIcon, TickIcon } from './icons';

/** The design shows four roles, then "Show N more roles". */
export const INITIAL_SHOWN = 4;

export type RolesListCopy = {
  where: string; // jt.048
  engagement: string; // jt.049
  all: string; // sys.careers.filters.all
  office: string; // jt.261
  overseas: string; // jt.262
  fullTime: string; // jt.099
  partTime: string; // jt.100
  project: string; // jt.073
  apply: string; // jt.052
  ask: string; // jt.053
  newBadge: string; // jt.033
  view: string; // jt.310
  close: string; // jt.309
  /** sys.careers.roles.resultAll, resolved on the server (the total never changes here) */
  resultAll: string;
  /** sys.careers.roles.resultFiltered — a plain `{shown}` / `{total}` template */
  resultFiltered: string;
  /** sys.careers.roles.showMore — a plain `{count}` template */
  showMore: string;
  showFewer: string; // jt.306
  noMatchTitle: string; // jt.054
  noMatchBody: string; // jt.055
  showAll: string; // jt.056
};

type PlaceFilter = 'all' | Place;
type EngagementFilter = 'all' | Engagement;

/** `{name}` → value. The island fills its two plain templates itself and never calls
 *  `useTranslations`, so `sys.careers.*` stays out of every page's client payload (W148). */
const fillTemplate = (template: string, values: Record<string, number>) =>
  template.replace(/\{(\w+)\}/g, (token, key: string) =>
    key in values ? String(values[key]) : token,
  );

/** The type pill per engagement (design `typePill`, l. 1272): green full-time, blue part-time,
 *  indigo project — each text colour ≥ 4.5:1 on its own fill. */
const TYPE_PILL: Record<Engagement, string> = {
  fullTime: 'border-success-soft-border bg-success-soft text-success-text',
  partTime: 'border-tint-border bg-tint text-blue-safe',
  project: 'border-[#ccd5ea] bg-[#edf1f9] text-indigo',
};

/** The filter bar (design `.ja-jt-filters`, ll. 680–697): ONE row — "Where" and its chips on the
 *  left, "Engagement" right-aligned. ≤ 700 px no card; "Where" becomes a segmented track (its
 *  label hidden) and "Engagement" a 2 × 2 grid under its label (ll. 352–362); 701–900 px a
 *  smaller card with both groups wrapping (ll. 452–462). */
const WHERE_LOOK = {
  group: 'flex flex-wrap items-center gap-3 max-md:flex-nowrap max-md:gap-2.5',
  label: 'max-md:sr-only',
  row: 'max-md:min-w-0 max-md:flex-1 max-md:flex-nowrap max-md:gap-[3px] max-md:rounded-pill max-md:border max-md:border-border-1 max-md:bg-[#eef5fa] max-md:p-[3px]',
  item: 'max-md:min-w-0 max-md:flex-1',
  chip: 'whitespace-nowrap max-md:min-h-10 max-md:w-full max-md:px-2 md:max-lg:min-h-[38px] md:max-lg:px-4',
};
const ENGAGEMENT_LOOK = {
  group: 'flex flex-wrap items-center gap-3 max-md:flex-col max-md:items-stretch max-md:gap-[7px]',
  label: 'max-md:tracking-[1.1px]',
  row: 'max-md:grid max-md:w-full max-md:grid-cols-2 max-md:gap-[7px]',
  item: 'max-md:flex max-md:min-w-0',
  chip: 'whitespace-nowrap max-md:min-h-10 max-md:w-full max-md:px-2 md:max-lg:min-h-[38px] md:max-lg:px-4',
};

/** One list of the open panel: a small caps lead-in, then 18 px tick tiles (ll. 745–770). */
function PanelList({ list, tone }: { list: RolePanelList; tone: 'blue' | 'green' }) {
  return (
    <div>
      {list.heading ? (
        <p
          className={`mb-[11px] text-[11.5px] font-extrabold tracking-[1.2px] uppercase xl:text-[11px] ${
            tone === 'blue' ? 'text-blue-safe' : 'text-success-text'
          }`}
        >
          {list.heading}
        </p>
      ) : null}
      <ul className="flex flex-col gap-[9px]">
        {list.items.map((item, i) => (
          <li key={`${i}-${item}`} className="flex items-start gap-2.5">
            <span
              aria-hidden="true"
              className={`mt-0.5 flex h-[18px] w-[18px] flex-none items-center justify-center rounded-[6px] ${
                tone === 'blue' ? 'bg-tint text-blue-safe' : 'bg-success-soft text-success-text'
              }`}
            >
              <TickIcon size={11} />
            </span>
            <span className="text-[14px] leading-[1.55] text-text-secondary xl:text-[11px]">
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * The live roles list (design `#roles`): the one-row filter bar, the result line, four
 * accordion rows then show-more / show-fewer, the no-match state. Server-rendered and hydrated —
 * never `ssr: false`: it is the page's main content and SEO-bearing (W13 amended). Each row is
 * the design's `.ja-role` (ll. 706–776): an icon tile, the title (+ solid NEW), a one-line
 * summary, the location / work-mode meta, the engagement pill and the "View role / Close"
 * toggle, whose stretched hit area makes the whole row the button. The open panel (always in
 * the DOM, `hidden` when closed, so the detail links stay crawlable) carries the description's
 * own lists, "Apply" (the detail page's form) and "Ask a question first" — a wa.me link that
 * carries only the role's title and location (W95). Every string and href arrives resolved from
 * the server. The hero's "See N open positions" pre-filters the list through its
 * `data-roles-place` attribute (parity S2.2) — the anchor still scrolls without JS.
 */
export function RolesList({ cards, copy }: { cards: RoleCard[]; copy: RolesListCopy }) {
  const base = useId();
  const listId = `${base}-list`;
  const [place, setPlace] = useState<PlaceFilter>('all');
  const [engagement, setEngagement] = useState<EngagementFilter>('all');
  const [expanded, setExpanded] = useState(false);
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target instanceof Element ? e.target : null;
      const value = target?.closest('a[data-roles-place]')?.getAttribute('data-roles-place');
      if (value !== 'overseas' && value !== 'office') return;
      setPlace(value);
      setEngagement('all');
      setOpenSlug(null);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  const matching = cards.filter(
    (c) =>
      (place === 'all' || c.place === place) &&
      (engagement === 'all' || c.engagement === engagement),
  );
  const filtered = place !== 'all' || engagement !== 'all';
  const shown = expanded ? matching : matching.slice(0, INITIAL_SHOWN);
  const more = matching.length - Math.min(matching.length, INITIAL_SHOWN);
  const result = filtered
    ? fillTemplate(copy.resultFiltered, { shown: shown.length, total: matching.length })
    : copy.resultAll;
  const pickPlace = (value: string) => {
    setPlace(value as PlaceFilter);
    setOpenSlug(null);
  };
  const pickEngagement = (value: string) => {
    setEngagement(value as EngagementFilter);
    setOpenSlug(null);
  };
  const clear = () => {
    setPlace('all');
    setEngagement('all');
  };

  return (
    <div data-testid="careers-roles-list">
      <div className="mb-5 rounded-[18px] border border-edge-soft bg-white px-[22px] py-[18px] shadow-[0_8px_22px_rgba(22,60,90,0.05)] max-md:mb-3.5 max-md:rounded-none max-md:border-0 max-md:bg-transparent max-md:p-0 max-md:shadow-none md:max-lg:mb-4 md:max-lg:rounded-base md:max-lg:px-[18px] md:max-lg:py-3.5">
        <div className="flex flex-wrap items-center justify-between gap-[18px] max-md:flex-col max-md:flex-nowrap max-md:items-stretch max-md:gap-2.5 md:max-lg:gap-x-[22px] md:max-lg:gap-y-2.5">
          <ChoiceChips
            name="careers-place"
            label={copy.where}
            value={place}
            onChange={pickPlace}
            look={WHERE_LOOK}
            options={[
              { value: 'all', label: copy.all },
              { value: 'office', label: copy.office },
              { value: 'overseas', label: copy.overseas },
            ]}
          />
          <ChoiceChips
            name="careers-engagement"
            label={copy.engagement}
            value={engagement}
            onChange={pickEngagement}
            look={ENGAGEMENT_LOOK}
            options={[
              { value: 'all', label: copy.all },
              { value: 'fullTime', label: copy.fullTime },
              { value: 'partTime', label: copy.partTime },
              { value: 'project', label: copy.project },
            ]}
          />
        </div>
      </div>

      <p
        role="status"
        aria-live="polite"
        className="mb-3.5 text-[13.5px] font-extrabold text-text-secondary max-lg:mb-[11px] max-lg:text-[12.5px] xl:text-[11px]"
      >
        {result}
      </p>

      {matching.length === 0 ? (
        <div
          data-testid="careers-no-match"
          className="rounded-[18px] border-[1.5px] border-dashed border-edge bg-white p-[34px] text-center max-md:p-6"
        >
          <p className="mb-[7px] text-[16.5px] font-extrabold text-ink xl:text-[12.4px]">
            {copy.noMatchTitle}
          </p>
          <p className="mx-auto mb-4 max-w-[560px] text-[14.5px] leading-[1.6] text-text-secondary xl:text-[11px]">
            {copy.noMatchBody}
          </p>
          <button
            type="button"
            onClick={clear}
            className={buttonClassName('primary', 'md', undefined, { shape: 'rect', radius: 11 })}
          >
            {copy.showAll}
          </button>
        </div>
      ) : (
        <ul id={listId} className="flex flex-col gap-3">
          {shown.map((c) => {
            const open = openSlug === c.slug;
            const panelId = `${base}-${c.slug}-panel`;
            const [first, second] = c.panel;
            const toggle = open ? copy.close : copy.view;
            return (
              <li key={c.slug}>
                <article
                  data-testid="careers-role"
                  data-slug={c.slug}
                  data-place={c.place}
                  data-engagement={c.engagement}
                  data-open={open || undefined}
                  className={`relative overflow-hidden rounded-[18px] border-[1.5px] bg-white transition-[border-color,box-shadow] duration-200 hover:border-tint-border hover:shadow-[0_14px_30px_rgba(22,60,90,0.08)] ${
                    open
                      ? 'border-tint-border shadow-[0_16px_36px_rgba(22,60,90,0.1)]'
                      : 'border-edge-soft'
                  }`}
                >
                  {/* the 4 px spine: navy overseas, blue office; 0.55 closed, full when open */}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-y-0 left-0 w-1 transition-opacity ${
                      c.place === 'overseas'
                        ? 'bg-[linear-gradient(180deg,#253063,#16204a)]'
                        : 'bg-[linear-gradient(180deg,#1899d5,#1073a8)]'
                    } ${open ? 'opacity-100' : 'opacity-55'}`}
                  />
                  <div className="relative flex items-center gap-[18px] py-[22px] pr-[26px] pl-[30px] max-lg:items-start max-lg:gap-3 max-lg:py-4 max-lg:pr-3.5 max-lg:pl-[22px] md:max-lg:py-5 md:max-lg:pr-6 md:max-lg:pl-7">
                    <span
                      aria-hidden="true"
                      className={`flex h-[50px] w-[50px] flex-none items-center justify-center rounded-[15px] max-lg:hidden ${
                        c.place === 'overseas'
                          ? 'bg-[#edf1f9] text-indigo'
                          : 'bg-tint text-blue-safe'
                      }`}
                    >
                      {c.place === 'overseas' ? (
                        <GlobeIcon size={22} />
                      ) : (
                        <BuildingIcon size={22} />
                      )}
                    </span>
                    <div className="flex min-w-0 flex-1 flex-col gap-[5px]">
                      <h3 className="flex flex-wrap items-center gap-[9px] max-lg:gap-[7px]">
                        <span className="text-[18px] font-extrabold tracking-[-0.35px] text-ink xl:text-[13.5px]">
                          {c.title}
                        </span>
                        {c.isNew && (
                          <span className="rounded-pill bg-success-text px-[9px] py-[3px] text-[11px] leading-none font-extrabold tracking-[1.1px] text-white uppercase">
                            {copy.newBadge}
                          </span>
                        )}
                      </h3>
                      {c.summary && (
                        <p className="line-clamp-2 text-[13.5px] leading-[1.5] font-semibold text-text-tertiary lg:line-clamp-1 lg:text-[14px] lg:leading-[1.55] xl:text-[11px]">
                          {c.summary}
                        </p>
                      )}
                      <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1.5 max-lg:mt-0.5 max-lg:gap-x-3.5 max-lg:gap-y-1">
                        <span className="inline-flex items-center gap-1.5 text-[12.5px] font-bold text-text-secondary lg:text-[13px] xl:text-[11px]">
                          <PinIcon size={12} className="text-blue" />
                          {c.location}
                        </span>
                        {c.workModes && (
                          <span className="inline-flex items-center gap-1.5 text-[12.5px] font-bold text-text-secondary lg:text-[13px] xl:text-[11px]">
                            <PersonIcon size={12} className="text-blue" />
                            {c.workModes}
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="flex flex-none items-center gap-3 max-lg:flex-col max-lg:items-end max-lg:justify-between max-lg:gap-2 max-lg:self-stretch max-md:w-[78px]">
                      <span
                        className={`inline-flex items-center rounded-pill border px-[11px] py-1 text-[12px] font-extrabold xl:text-[11px] max-lg:px-[9px] max-lg:text-center max-lg:text-[11px] max-lg:leading-[1.25] max-lg:tracking-[0.4px] ${TYPE_PILL[c.engagement]}`}
                      >
                        {c.engagementLabel}
                      </span>
                      {/* the stretched ::before makes the whole row this button (design: the row
                          is one <button>); ≤ 900 px only the caret shows, the label stays its
                          accessible name */}
                      <button
                        type="button"
                        aria-expanded={open}
                        aria-controls={panelId}
                        aria-label={`${toggle}: ${c.title}`}
                        onClick={() => setOpenSlug(open ? null : c.slug)}
                        className={`inline-flex items-center gap-[7px] rounded-pill px-4 py-2 text-[13px] font-extrabold whitespace-nowrap transition-colors before:absolute before:inset-0 before:content-[''] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe xl:text-[11px] max-lg:h-7 max-lg:w-7 max-lg:justify-center max-lg:border-0 max-lg:bg-transparent max-lg:p-0 max-lg:text-text-secondary ${
                          open
                            ? 'bg-ink text-white'
                            : 'border-[1.5px] border-edge bg-pale-1 text-[#43536a]'
                        }`}
                      >
                        <span className="max-lg:sr-only">{toggle}</span>
                        <span
                          aria-hidden="true"
                          className={`flex transition-transform duration-250 ease-out ${open ? 'rotate-180' : ''}`}
                        >
                          <ChevronDownIcon size={14} />
                        </span>
                      </button>
                    </div>
                  </div>

                  <div
                    id={panelId}
                    hidden={!open}
                    className="ja-panel px-[26px] pb-6 pl-[30px] max-lg:px-[18px] max-lg:pb-5 max-lg:pl-[22px]"
                  >
                    <div className="grid gap-[26px] rounded-[15px] border border-[#e9f1f7] bg-[#f8fbfd] px-6 py-[22px] max-lg:gap-5 max-md:px-4 max-md:py-4 lg:grid-cols-2">
                      {first ? (
                        <PanelList list={first} tone="blue" />
                      ) : (
                        <p className="text-[14px] leading-[1.6] text-text-secondary xl:text-[11px]">
                          {c.summary}
                        </p>
                      )}
                      <div className="flex flex-col gap-[18px]">
                        {second ? <PanelList list={second} tone="green" /> : null}
                        <div className="flex flex-wrap gap-2.5">
                          <Link
                            href={c.applyHref}
                            prefetch={false}
                            aria-label={`${copy.apply}: ${c.title}`}
                            className={buttonClassName('primary', 'md', undefined, {
                              shape: 'rect',
                              radius: 11,
                            })}
                          >
                            {copy.apply}
                            <ArrowRightIcon size={14} />
                          </Link>
                          <ContactLink
                            href={c.askHref}
                            placement="page_cta"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${copy.ask}: ${c.title}`}
                            className={buttonClassName('outline-green', 'md', undefined, {
                              shape: 'rect',
                              radius: 11,
                            })}
                          >
                            <WhatsAppIcon size={15} />
                            {copy.ask}
                          </ContactLink>
                        </div>
                        <p className="text-[12.5px] font-semibold text-text-tertiary xl:text-[11px]">
                          {c.posted}
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      )}

      {matching.length > INITIAL_SHOWN && (
        <div className="mt-[22px] flex justify-center">
          <button
            type="button"
            aria-expanded={expanded}
            aria-controls={listId}
            onClick={() => {
              setExpanded((v) => !v);
              setOpenSlug(null);
            }}
            className="ja-hover-card inline-flex min-h-[44px] items-center gap-2.5 rounded-xs border-[1.5px] border-edge bg-white px-[26px] py-3 text-[14.5px] font-extrabold text-indigo hover:bg-pale-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe xl:text-[11px]"
          >
            <span>{expanded ? copy.showFewer : fillTemplate(copy.showMore, { count: more })}</span>
            <span
              aria-hidden="true"
              className={`flex text-blue transition-transform duration-250 ease-out ${expanded ? 'rotate-180' : ''}`}
            >
              <ChevronDownIcon size={15} />
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
