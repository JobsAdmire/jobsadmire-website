'use client';
import { clearConsent } from '@/analytics/consent';

/** R36: the consent copy promises the visitor can change their mind, so the footer carries the
 *  door back. A leaf client component — the Footer is a server component and hands it only the
 *  label, so no bundle and no translator crosses the boundary. Clearing re-publishes the
 *  `unknown` state, which is what re-opens the sheet. */
export function CookiePreferencesButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => clearConsent()}
      className="inline-flex min-h-[44px] items-center px-1 font-bold text-white/50 underline hover:text-sky focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky"
    >
      {label}
    </button>
  );
}
