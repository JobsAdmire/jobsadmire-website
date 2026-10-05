import { useTranslations } from 'next-intl';
import { makeT } from '@/content/pure';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { LookupResult } from '../_components/LookupResult';

/** "01 · Verify result" (S2.1, Verify ll. 651–674): the lookup's answer card between the hero and
 *  the structure section — rendered by the island once a query is long enough, nothing before.
 *  The labels are resolved here (W9/W148); the body template stays raw so the island can bold the
 *  echoed query as React text, never HTML. */
export function Result({ bundle }: { bundle: Bundle }) {
  const t = makeT(bundle);
  const sys = useTranslations('sys');
  return (
    <LookupResult
      labels={{
        title: sys('verify.lookup.resultTitle'),
        body: sys.raw('verify.lookup.resultBody') as string,
        call: t('verify.051'),
        whatsapp: sys('verify.lookup.whatsapp'),
        whatsappIntro: t('verify.228'),
      }}
      phone={bundle.settings.phone}
      whatsappNumber={bundle.settings.whatsappNumber}
    />
  );
}
