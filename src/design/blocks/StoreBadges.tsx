import { makeTf } from '@/content/pure';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../contract/website-bundle.v1';

const BADGE = {
  dark: 'bg-ink text-white hover:bg-black',
  light: 'border border-border-1 bg-white text-ink hover:bg-pale-1',
} as const;

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

/** App-store badges from `settings.storeLinks`: Google Play (hire.240) whenever the Android
 *  link exists; App Store (hire.241) only once `ios` is a URL — it is `null` today, so the
 *  badge is not rendered rather than pointing at a generic store page (W8). Labels are the
 *  package's own, kept English on TR by the importer's override table (W7/W51). */
export function StoreBadges({
  bundle,
  locale,
  android,
  ios = null,
  tone = 'dark',
}: {
  bundle: Bundle;
  locale: Locale;
  android: string | null;
  ios?: string | null;
  tone?: keyof typeof BADGE;
}) {
  if (!android && !ios) return null;
  const t = makeTf(bundle, locale);
  const cls = `inline-flex min-h-[44px] items-center gap-2 rounded-input px-4 text-body-sm font-extrabold no-underline transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe ${BADGE[tone]}`;
  return (
    <div className="flex flex-wrap gap-2">
      {android && (
        <a href={android} target="_blank" rel="noopener noreferrer" className={cls}>
          <PlayIcon />
          {t('hire.240')}
        </a>
      )}
      {ios && (
        <a href={ios} target="_blank" rel="noopener noreferrer" className={cls}>
          <AppleIcon />
          {t('hire.241')}
        </a>
      )}
    </div>
  );
}
