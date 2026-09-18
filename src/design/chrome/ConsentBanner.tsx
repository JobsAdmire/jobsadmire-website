'use client';
import { useSyncExternalStore } from 'react';
import { useTranslations } from 'next-intl';
import { CONSENT_EVENT, readConsent, writeConsent, type ConsentState } from '@/analytics/consent';
import { Button } from '@/design/primitives';
import { Link } from '@/i18n/navigation';

/** Distinct from `unknown` on purpose (R27): the server render and the hydrating client both
 *  render nothing, so a returning visitor never sees the sheet flash before their stored
 *  choice is read. Only the post-hydration `unknown` opens it. */
type Snapshot = ConsentState | 'hydrating';

const subscribe = (onStoreChange: () => void) => {
  window.addEventListener(CONSENT_EVENT, onStoreChange);
  return () => window.removeEventListener(CONSENT_EVENT, onStoreChange);
};
const getServerSnapshot = (): Snapshot => 'hydrating';

/** The consent sheet. Storage is never touched during render and no effect sets state — the
 *  choice is read through the store and `writeConsent` re-publishes it via `CONSENT_EVENT`. */
export function ConsentBanner() {
  const sys = useTranslations('sys');
  const state = useSyncExternalStore<Snapshot>(subscribe, readConsent, getServerSnapshot);
  if (state !== 'unknown') return null;
  return (
    <div
      role="region"
      aria-label={sys('consent.title')}
      data-testid="consent-banner"
      // z-60 clears the mobile bottom bar (z-50); the extra padding below `lg` keeps the
      // sheet's own buttons clear of that bar, and of the phone's home indicator.
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-border-1 bg-white pt-4 pb-[calc(1rem+74px+env(safe-area-inset-bottom))] shadow-[0_-8px_28px_rgba(22,32,46,0.12)] lg:pb-[calc(1rem+env(safe-area-inset-bottom))]"
    >
      <div className="container-site flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
        <div>
          <p className="m-0 font-extrabold">{sys('consent.title')}</p>
          <p className="m-0 text-body-sm text-text-secondary">
            {sys('consent.body')}{' '}
            <Link href="/cookie-policy" className="font-bold text-blue-safe underline">
              {sys('consent.policy')}
            </Link>
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2.5">
          <Button variant="secondary" onClick={() => writeConsent('denied')}>
            {sys('consent.reject')}
          </Button>
          <Button variant="primary" onClick={() => writeConsent('granted')}>
            {sys('consent.accept')}
          </Button>
        </div>
      </div>
    </div>
  );
}
