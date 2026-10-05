import { useTranslations } from 'next-intl';
import { makeTf } from '@/content/pure';
// By module path (W147): never the `@/design/blocks` / `@/design/primitives` barrels.
import { SampleTag } from '@/design/blocks/SampleTag';
import { Eyebrow } from '@/design/primitives/Eyebrow';
import { Section } from '@/design/primitives/Section';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';

/** "The other side" (design L763–789, success.070–078): the pale box with the copy column and
 *  two worker cards. Parity pass (owner 2026-10-05): the section always shows; the two stories
 *  are the design's sample, so they carry the sample tag (`sample`) and need no consent of their
 *  own. The page passes `sample={!(published && WORKER_STORIES_CONSENTED)}` — the real-data path
 *  (published approvals AND the owner's §10 row 11 consent to name the two workers,
 *  `_lib/signoff.ts`) is the only one that drops the tag. Card 1's title has no package id
 *  (design line 776) → `sys.stories.workers.card1Title` (W9). Owns its own `Section` (W97
 *  analogue). */
export function WorkerStories({
  bundle,
  locale,
  sample,
}: {
  bundle: Bundle;
  locale: Locale;
  sample: boolean;
}) {
  const sys = useTranslations('sys');
  const t = makeTf(bundle, locale);
  const cards = [
    { title: sys('stories.workers.card1Title'), bodyId: 'success.074', footId: 'success.075' },
    { title: t('success.076'), bodyId: 'success.077', footId: 'success.078' },
  ];
  return (
    <Section tone="light" className="ja-reveal pt-0 pb-[4.75rem] max-md:pb-10">
      <div className="container-site" data-testid="stories-workers">
        <div className="rounded-hero border border-edge bg-gradient-to-b from-pale-1 to-[#e8f3f9] px-5 py-11 max-md:rounded-md max-md:px-[18px] max-md:py-[22px] lg:px-12">
          <div className="grid items-center gap-8 max-md:gap-5 lg:grid-cols-[0.85fr_1.15fr] lg:gap-11">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2.5">
                <Eyebrow>{t('success.070')}</Eyebrow>
                {sample && <SampleTag />}
              </div>
              <h2 className="m-0 mb-3.5 text-h2 max-md:text-[23px] max-md:tracking-[-0.6px]">
                {t('success.071')}
              </h2>
              <p className="m-0 mb-[1.125rem] text-body leading-[1.62] font-semibold text-text-secondary max-md:text-[14.5px] max-md:leading-[1.55]">
                {t('success.072')}
              </p>
              <Link
                href="/available-workers"
                prefetch={false}
                className="inline-flex items-center text-[14.5px] font-extrabold text-blue-safe no-underline hover:underline xl:text-[11px]"
              >
                {t('success.073')}
              </Link>
            </div>
            <ul className="m-0 grid list-none grid-cols-2 gap-3.5 p-0 max-md:grid-cols-1 max-md:gap-2.5">
              {cards.map((c) => (
                <li key={c.bodyId} className="min-w-0">
                  <article className="h-full rounded-base border border-edge bg-white px-6 py-[1.375rem] max-md:rounded-sm max-md:px-4 max-md:py-[15px]">
                    <h3 className="m-0 mb-[0.5625rem] text-[13px] font-extrabold text-blue-safe xl:text-[11px]">
                      {c.title}
                    </h3>
                    <p className="m-0 mb-3 text-[14px] leading-[1.6] font-semibold text-text-secondary max-md:mb-[9px] max-md:text-[13.5px] max-md:leading-[1.5] xl:text-[11px]">
                      {t(c.bodyId)}
                    </p>
                    <p className="m-0 text-[12.5px] font-extrabold text-success-text xl:text-[11px]">
                      {t(c.footId)}
                    </p>
                  </article>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
}
