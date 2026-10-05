import { makeTf } from '@/content/pure';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../contract/website-bundle.v1';

/** The badge faces. `dark` is the design's ink two-line badge (#16202e, r11, black on hover —
 *  Homepage v4 ll. 897–910, Hire/Partner/About portal panels); `footer` the translucent two-line
 *  badge of the footer's app column (white/8 face, white/22 edge, r9 — ll. 1200–1213); `light`
 *  the white outline badge on dark-free cards. */
const BADGE = {
  dark: 'rounded-[11px] bg-ink text-white hover:bg-black',
  footer: 'rounded-[9px] border border-white/20 bg-white/[0.08] text-white hover:bg-white/15',
  light: 'rounded-[11px] border border-border-1 bg-white text-ink hover:bg-pale-1',
} as const;

/** The small first line's colour per face (#b9c4cf on ink / night: ≥ 8:1). */
const KICKER = {
  dark: 'text-[#b9c4cf]',
  footer: 'text-[#b9c4cf]',
  light: 'text-text-tertiary',
} as const;

export type StoreBadgeTone = keyof typeof BADGE;

function PlayIcon() {
  // The design's inline Play glyph — local, never the hot-linked store image (W14).
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M4 3.5v17c0 .4.45.65.8.42l.2-.12L15.5 12 5 3.2l-.2-.12A.5.5 0 0 0 4 3.5z"
        fill="#2196F3"
      />
      <path d="M18.9 9.9L15.5 12 5 3.2l13.9 6.7z" fill="#4CAF50" />
      <path d="M18.9 14.1L15.5 12 5 20.8l13.9-6.7z" fill="#F44336" />
      <path d="M18.9 9.9l2.3 1.3c.7.4.7 1.2 0 1.6l-2.3 1.3L15.5 12l3.4-2.1z" fill="#FFC107" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="16" height="19" viewBox="0 0 384 512" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"
      />
    </svg>
  );
}

/** App-store badges from `settings.storeLinks`: Google Play whenever the Android link exists;
 *  App Store whenever `ios` is a URL (set since W227; a `null` link renders no badge rather
 *  than a generic store page, W8). The design's two-line face (SHARED 11.1): a small kicker
 *  ("GET IT ON" contact.143 / "DOWNLOAD ON THE" contact.144) over the store's name — the
 *  store-badge micro-copy stays English on TR by the importer's override table (W7/W51), and
 *  the accessible name is the full sentence (hire.240 / hire.241). `appleFirst` puts the App
 *  Store badge first (Partner With Us, partner.162/163 — SHARED 11.2); `stretch` makes the two
 *  badges equal halves of one row on phones (min-h 48, SHARED 11.2). */
export function StoreBadges({
  bundle,
  locale,
  android,
  ios = null,
  tone = 'dark',
  appleFirst = false,
  stretch = false,
  className,
}: {
  bundle: Bundle;
  locale: Locale;
  android: string | null;
  ios?: string | null;
  tone?: StoreBadgeTone;
  appleFirst?: boolean;
  stretch?: boolean;
  className?: string;
}) {
  if (!android && !ios) return null;
  const t = makeTf(bundle, locale);
  const cls = [
    'ja-hover-lift inline-flex min-h-[44px] items-center gap-[9px] py-2 pr-[15px] pl-3 no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe',
    BADGE[tone],
    stretch ? 'max-md:min-h-12 max-md:flex-1 max-md:justify-center' : null,
  ]
    .filter(Boolean)
    .join(' ');
  const two = (kicker: string, name: string) => (
    <span aria-hidden="true" className="flex flex-col text-left leading-[1.15]">
      {/* The design's 8.5–9.5 px kicker sits under the 11 px desktop type floor (W190): it is
          raised to the floor at the desktop step, and the name keeps its 13 px there so the
          kicker still reads smaller than the store name. */}
      <span
        className={`text-[9px] font-semibold tracking-[0.3px] uppercase xl:text-[11px] ${KICKER[tone]}`}
      >
        {kicker}
      </span>
      <span className="text-[13px] font-bold">{name}</span>
    </span>
  );
  const play = android ? (
    <a
      key="play"
      href={android}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t('hire.240')}
      className={cls}
    >
      <PlayIcon />
      {two(t('contact.143'), 'Google Play')}
    </a>
  ) : null;
  const apple = ios ? (
    <a
      key="apple"
      href={ios}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t('hire.241')}
      className={cls}
    >
      <AppleIcon />
      {two(t('contact.144'), 'App Store')}
    </a>
  ) : null;
  return (
    <div
      className={['flex flex-wrap gap-2.5', stretch ? 'max-md:flex-nowrap' : null, className]
        .filter(Boolean)
        .join(' ')}
    >
      {appleFirst ? [apple, play] : [play, apple]}
    </div>
  );
}
