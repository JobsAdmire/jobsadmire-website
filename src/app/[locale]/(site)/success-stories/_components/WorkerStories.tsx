import { useTranslations } from 'next-intl';
import { makeTf } from '@/content/pure';
import { Card } from '@/design/primitives/Card';
import { Eyebrow } from '@/design/primitives/Eyebrow';
import { Section } from '@/design/primitives/Section';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';

/** "The other side" (success.070–078): two worker stories framing the published approvals.
 *  The design gates it on a `showWorkerStories` prop defaulting to true; here `visible` is the
 *  page's `published && WORKER_STORIES_CONSENTED` (`_lib/signoff.ts`) — an approval on the wall
 *  is not by itself consent to name the two workers (§10 row 11), so this component takes the
 *  already-combined boolean rather than importing the flags itself. Card 1's title has no
 *  package id (design line 776) → `sys.stories.workers.card1Title` (W9). Owns its own `Section`
 *  (W97 analogue). */
export function WorkerStories({
  bundle,
  locale,
  visible,
}: {
  bundle: Bundle;
  locale: Locale;
  visible: boolean;
}) {
  const sys = useTranslations('sys');
  if (!visible) return null;
  const t = makeTf(bundle, locale);
  const cards = [
    { title: sys('stories.workers.card1Title'), bodyId: 'success.074', footId: 'success.075' },
    { title: t('success.076'), bodyId: 'success.077', footId: 'success.078' },
  ];
  return (
    <Section tone="light" className="pt-0">
      <div className="container-site" data-testid="stories-workers">
        <div className="rounded-hero border border-border-1 bg-gradient-to-b from-pale-1 to-tint px-6 py-8 lg:px-9 lg:py-10">
          <div className="grid items-center gap-8 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <Eyebrow>{t('success.070')}</Eyebrow>
              <h2 className="m-0 mb-3 text-h2 max-md:text-[23px] max-md:tracking-[-0.6px]">
                {t('success.071')}
              </h2>
              <p className="m-0 mb-4 text-body text-text-secondary">{t('success.072')}</p>
              <Link
                href="/available-workers"
                prefetch={false}
                className="text-body-sm font-extrabold text-blue-safe no-underline hover:underline"
              >
                {t('success.073')}
              </Link>
            </div>
            <ul className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2">
              {cards.map((c) => (
                <li key={c.bodyId} className="min-w-0">
                  <Card as="article" className="flex h-full flex-col gap-2">
                    <h3 className="m-0 text-body-sm font-extrabold text-blue-safe">{c.title}</h3>
                    <p className="m-0 text-body-sm text-text-secondary">{t(c.bodyId)}</p>
                    <p className="m-0 mt-auto text-body-sm font-extrabold text-success-text">
                      {t(c.footId)}
                    </p>
                  </Card>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
}
