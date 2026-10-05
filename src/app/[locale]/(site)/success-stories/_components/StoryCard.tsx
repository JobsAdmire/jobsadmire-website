import type { WallCard } from '../_lib/wall';

/** The labels every card shares, resolved on the server (the island calls no
 *  `useTranslations`, W148). */
export type CardCopy = {
  /** `success.040` — the green "Onaylandı" */
  approved: string;
  /** `success.041` — "çalışma izni", beside the headcount */
  unit: string;
  /** `success.147` / `success.146` — the phone card's "Kanıtı görüntüle ↓" / "Kanıtı gizle ↑" */
  proofShow: string;
  proofHide: string;
};

/** The phone toggle: a real button in the card's top line whose `::after` covers the whole card,
 *  so a tap anywhere on it opens the proof (the design's whole-card `onClick`) while keyboard and
 *  assistive tech meet one named, stateful control. */
const TOGGLE =
  "ml-auto inline-flex shrink-0 cursor-pointer items-center gap-1 border-0 bg-transparent p-0 text-[10.5px] font-extrabold tracking-[0.3px] whitespace-nowrap text-blue-safe after:absolute after:inset-0 after:content-[''] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe xl:text-[11px]";

/** A 3–4 px grey dot between meta items (the design's `#cbd5e1` separators). The spaces around
 *  it are for the text alternative only — a flex row drops whitespace-only text from layout — so
 *  "Ağustos 2025 Kemer, Antalya" never reads as one run-together word. */
function Dot({ size }: { size: 'sm' | 'md' }) {
  return (
    <>
      {' '}
      <span
        aria-hidden="true"
        className={`shrink-0 rounded-pill bg-[#cbd5e1] ${size === 'md' ? 'h-1 w-1' : 'h-[3px] w-[3px]'}`}
      />{' '}
    </>
  );
}

function Tick({ size }: { size: number }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

/**
 * The wall card (design `.ja-ss-card`, L598–667): the 250 px document frame over the body —
 * headcount and unit on one baseline, the roles, a dashed rule, then month • place • countries.
 * At ≤ 700 px it turns into the compact list card: an 88 px frame thumbnail beside the body,
 * the "SEKTÖR • ✓ ONAYLANDI · Kanıtı görüntüle ↓" line and the "Dosyada onay · N işçiyi
 * kapsıyor" document line, the roles clamped to two lines; a tap opens it to a full-width 260 px
 * frame with its badges (`data-open` drives the frame's badges through `group/card`).
 */
export function StoryCard({
  card,
  copy,
  open,
  onToggle,
}: {
  card: WallCard;
  copy: CardCopy;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <article
      data-open={open}
      className={[
        'group/card ja-hover-card relative flex h-full flex-col overflow-hidden rounded-md border border-edge bg-white shadow-[0_12px_30px_rgba(22,60,90,0.07)] max-md:grid max-md:cursor-pointer max-md:rounded-sm max-md:shadow-[0_4px_14px_rgba(22,60,90,0.06)]',
        open ? 'max-md:grid-cols-1' : 'max-md:grid-cols-[88px_1fr]',
      ].join(' ')}
    >
      <div
        className={[
          'relative overflow-hidden border-0 border-[#e9f1f7] bg-pale-1 md:h-[15.625rem] md:border-b',
          open ? 'max-md:min-h-[260px] max-md:border-b' : 'max-md:min-h-[116px] max-md:border-r',
        ].join(' ')}
      >
        {card.frame}
      </div>
      <div className="px-5 pt-[1.125rem] pb-5 max-md:px-[13px] max-md:pt-[11px] max-md:pb-3">
        <div className="mb-[5px] hidden items-center gap-1.5 max-md:flex">
          <span className="text-[10.5px] font-extrabold tracking-[0.7px] text-blue-safe uppercase xl:text-[11px]">
            {card.sectorLabel}
          </span>
          <Dot size="sm" />
          <span className="inline-flex items-center gap-1 text-[10.5px] font-extrabold tracking-[0.5px] text-success-text uppercase xl:text-[11px]">
            <Tick size={9} />
            {copy.approved}
          </span>{' '}
          <button type="button" aria-expanded={open} onClick={onToggle} className={TOGGLE}>
            {open ? copy.proofHide : copy.proofShow}
          </button>
        </div>
        <p className="m-0 mb-1.5 hidden text-[10.5px] leading-[1.35] font-bold text-text-tertiary max-md:block xl:text-[11px]">
          {card.docLabel}
        </p>
        <p className="m-0 mb-2 flex items-baseline gap-2 max-md:mb-1">
          <span className="text-[26px] leading-none font-extrabold tracking-[-0.8px] text-ink max-md:text-[21px] max-md:tracking-[-0.6px] xl:text-[19.5px] xl:tracking-[-0.6px]">
            {card.headcount}
          </span>{' '}
          <span className="text-[14px] font-bold text-text-tertiary max-md:text-[12.5px] xl:text-[11px]">
            {copy.unit}
          </span>
        </p>
        <p className="m-0 text-[14px] leading-[1.5] font-bold text-text-secondary max-md:line-clamp-2 max-md:text-[12.5px] max-md:leading-[1.4] xl:text-[11px]">
          {card.roles}
        </p>
        <p className="m-0 mt-3 flex flex-wrap items-center gap-[0.5625rem] border-t border-dashed border-border-1 pt-3 text-[12.5px] font-bold text-text-tertiary max-md:mt-[7px] max-md:gap-1.5 max-md:pt-[7px] max-md:text-[11.5px] xl:text-[11px]">
          <span>{card.monthLabel}</span>
          <Dot size="md" />
          <span>{card.place}</span>
          {card.countries.length > 0 && (
            <>
              <Dot size="md" />
              <span>{card.countries.join(' · ')}</span>
            </>
          )}
        </p>
      </div>
    </article>
  );
}

/**
 * The phone slider's card (design `.ja-ss-slide`, L520–578): a 172 px frame (260 px open) over
 * the sector line with its proof toggle, the document line, the headcount, the roles and
 * month • place. Only rendered inside the slider, which is hidden from 701 px.
 */
export function StorySlide({
  card,
  copy,
  open,
  onToggle,
}: {
  card: WallCard;
  copy: CardCopy;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <article
      data-open={open}
      className="relative h-full cursor-pointer overflow-hidden rounded-base border border-edge bg-white shadow-[0_8px_20px_rgba(22,60,90,0.08)]"
    >
      <div
        className={[
          'relative overflow-hidden border-b border-[#e9f1f7] bg-pale-1',
          open ? 'h-[260px]' : 'h-[172px]',
        ].join(' ')}
      >
        {card.slideFrame}
      </div>
      <div className="px-3.5 pt-3 pb-[13px]">
        <div className="mb-[5px] flex items-center gap-1.5">
          <span className="text-[10.5px] font-extrabold tracking-[0.7px] text-blue-safe uppercase xl:text-[11px]">
            {card.sectorLabel}
          </span>{' '}
          <button type="button" aria-expanded={open} onClick={onToggle} className={TOGGLE}>
            {open ? copy.proofHide : copy.proofShow}
          </button>
        </div>
        <p className="m-0 mb-1.5 text-[10.5px] leading-[1.35] font-bold text-text-tertiary xl:text-[11px]">
          {card.docLabel}
        </p>
        <p className="m-0 mb-1 flex items-baseline gap-[7px]">
          <span className="text-[22px] leading-none font-extrabold tracking-[-0.7px] text-ink">
            {card.headcount}
          </span>{' '}
          <span className="text-[12.5px] font-bold text-text-tertiary">{copy.unit}</span>
        </p>
        <p className="m-0 text-[12.5px] leading-[1.4] font-bold text-text-secondary">
          {card.roles}
        </p>
        <p className="m-0 mt-2 flex flex-wrap items-center gap-1.5 border-t border-dashed border-border-1 pt-2 text-[11.5px] font-bold text-text-tertiary">
          <span>{card.monthLabel}</span>
          <Dot size="sm" />
          <span>{card.place}</span>
        </p>
      </div>
    </article>
  );
}
