import { useTranslations } from 'next-intl';
// By module path (W147): never the `@/design/blocks` barrel from page code.
import { ImageSlot } from '@/design/blocks/ImageSlot';
import type { RedactBar } from '../_lib/sample';

/**
 * One approval card's document frame (design `.ja-ss-frame` / `.ja-ss-sframe`, L600–621 and
 * L521–565): the redacted permit as an `ImageSlot` (the labelled placeholder until a scan exists —
 * never nothing), the redaction bars, the rotated "jobsadmire.com · verified copy" watermark at
 * 16 % and the two overlay badges (dark sector pill top-left, green "✓ ONAYLANDI" top-right).
 *
 * A server component the page renders once per card and variant and hands the client wall as a
 * node (`WallCard.frame` / `.slideFrame`): `ImageSlot` and the watermark read `sys.blocks` /
 * `sys.stories`, which stay out of `CLIENT_SYS` (W148). It fills the box the island gives it
 * (that box owns the height, which follows the card's open state); the slot itself is stretched
 * to it by the wrapper's `*:h-full` (the slot owns its classes, W129).
 *
 * `grid`: the wall card — on a phone the closed compact card hides the badges and the open one
 * shows them (`group/card` + `data-open` on the card, `StoryCard`). `slide`: the phone slider —
 * badges always on. The watermark lines are CSS generated content (`attr(data-wm)`): decorative,
 * so neither assistive tech nor the contrast audit reads them as page text.
 */
export function ApprovalFrame({
  slot,
  variant,
  sectorLabel,
  approvedLabel,
  monthLabel,
  redact,
}: {
  slot: string;
  variant: 'grid' | 'slide';
  sectorLabel: string;
  approvedLabel: string;
  monthLabel: string;
  redact: readonly RedactBar[];
}) {
  const sys = useTranslations('sys');
  const copy = sys('stories.wall.watermarkCopy');
  const verified = `jobsadmire.com · ${copy} · jobsadmire.com · ${copy} · jobsadmire.com`;
  const permit = `${sys('stories.wall.watermarkPermit', { month: monthLabel })} · jobsadmire.com`;
  const lines = [verified, `${permit} · ${permit} · ${permit}`, verified];
  const badge =
    variant === 'grid'
      ? 'inline-flex max-md:hidden max-md:group-data-[open=true]/card:inline-flex'
      : 'inline-flex';
  return (
    <>
      <div className="absolute inset-0 *:h-full">
        <ImageSlot slot={slot} alt="" width={400} height={250} />
      </div>
      {redact.map((b) => (
        <span
          key={`${b.x}-${b.y}`}
          aria-hidden="true"
          className="pointer-events-none absolute rounded-[3px] bg-ink"
          style={{ left: `${b.x}%`, top: `${b.y}%`, width: `${b.w}%`, height: `${b.h}%` }}
        />
      ))}
      <div
        aria-hidden="true"
        data-testid="approval-watermark"
        className="pointer-events-none absolute -inset-[20%] flex rotate-[-22deg] flex-col justify-center gap-[1.875rem] opacity-[0.16]"
      >
        {lines.map((line, i) => (
          <span
            key={i}
            data-wm={line}
            className="block text-[12.5px] font-extrabold whitespace-nowrap text-ink uppercase tracking-[2px] before:content-[attr(data-wm)] xl:text-[11px] xl:tracking-[1.5px]"
          />
        ))}
      </div>
      <span
        className={`${badge} absolute top-3 left-3 items-center rounded-pill bg-ink/[0.82] px-3 py-[0.3125rem] text-[11px] font-extrabold tracking-[0.6px] text-white uppercase`}
      >
        {sectorLabel}
      </span>{' '}
      <span
        className={`${badge} absolute top-3 right-3 items-center gap-1.5 rounded-pill bg-success-surface px-[0.6875rem] py-[0.3125rem] text-[11px] font-extrabold tracking-[0.5px] text-success-text uppercase`}
      >
        <svg
          aria-hidden="true"
          focusable="false"
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="shrink-0"
        >
          <path d="M20 6L9 17l-5-5" />
        </svg>
        {approvedLabel}
      </span>
    </>
  );
}
