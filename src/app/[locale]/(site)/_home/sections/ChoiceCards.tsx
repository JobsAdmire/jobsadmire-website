import { makeTf } from '@/content/pure';
import { Link } from '@/i18n/navigation';
import { ArrowRightIcon, ArrowsIcon, ShieldIcon, UserPlusIcon } from '../components/icons';
import type { SectionProps } from './types';

// W155 pattern: a colourless base; each card adds its own surface, border and text colours.
const CARD =
  'flex items-center gap-3.5 rounded-lg p-5 no-underline transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe';
const ICON = 'flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-sm';
const TITLE = 'block font-display text-[18px] font-extrabold tracking-[-0.5px]';
const SUB = 'mt-[3px] block text-[13px] font-semibold leading-[1.45]';

/** The design's phone-only door cards (`.ja-choice`, ≤ 460 px): rendered always, shown only below
 *  `xs` (W10). "Check someone's ID" goes to the Verify page. */
export function ChoiceCards({ locale, bundle }: SectionProps) {
  const tf = makeTf(bundle, locale);
  return (
    <div data-testid="choice-cards" className="grid gap-3 bg-white px-5 pb-1 pt-[26px] xs:hidden">
      <a href="#proposal" className={`${CARD} bg-navy text-white active:bg-[#16294f]`}>
        <span aria-hidden="true" className={`${ICON} bg-blue/20 text-sky`}>
          <UserPlusIcon size={22} />
        </span>
        <span className="min-w-0 flex-1">
          <span className={TITLE}>{tf('home.056')}</span>
          <span className={`${SUB} text-white/60`}>{tf('home.057')}</span>
        </span>
        <ArrowRightIcon className="shrink-0 text-sky" />
      </a>
      <Link
        href="/partner-with-us"
        className={`${CARD} border-[1.5px] border-border-1 bg-pale-1 text-ink active:bg-tint`}
      >
        <span aria-hidden="true" className={`${ICON} bg-tint text-blue-safe`}>
          <ArrowsIcon size={22} />
        </span>
        <span className="min-w-0 flex-1">
          <span className={TITLE}>{tf('home.058')}</span>
          <span className={`${SUB} text-text-secondary`}>{tf('home.059')}</span>
        </span>
        <ArrowRightIcon className="shrink-0 text-blue-safe" />
      </Link>
      <Link
        href="/verify"
        className={`${CARD} border-[1.5px] border-[#bfe8cf] bg-[#eafaf1] text-ink active:bg-[#dcf5e7]`}
      >
        <span aria-hidden="true" className={`${ICON} bg-success-surface text-success-text`}>
          <ShieldIcon size={22} />
        </span>
        <span className="min-w-0 flex-1">
          <span className={TITLE}>{tf('home.060')}</span>
          <span className={`${SUB} text-[#4b6a58]`}>{tf('home.061')}</span>
        </span>
        <ArrowRightIcon className="shrink-0 text-success-text" />
      </Link>
    </div>
  );
}
