import { Eyebrow } from '@/design/primitives/Eyebrow';
import { Section } from '@/design/primitives/Section';
import { Link } from '@/i18n/navigation';
import { FileIcon } from '../_components/icons';
import { WaysList } from '../_components/WaysList';
import type { Tf } from '../_lib/roles';

const WAYS = [
  { badge: 'jt.060', title: 'jt.061', body: 'jt.062', bullets: ['jt.063', 'jt.064', 'jt.065'] },
  { badge: 'jt.066', title: 'jt.067', body: 'jt.068', bullets: ['jt.069', 'jt.070', 'jt.071'] },
  { badge: 'jt.072', title: 'jt.073', body: 'jt.074', bullets: ['jt.075', 'jt.076', 'jt.077'] },
] as const;

/** "Three ways to work with us" (design `.ja-jt-types`): static cards from 901 px, the design's
 *  accordions below (parity M9 — `WaysList`), then the written-agreement note with its document
 *  tile (S5.4; white, tint-edged and shadowed ≤ 900 px, M10). `jt.078` is legal-flagged
 *  (verbatim); `jt.079` is the package's own link fragment, underlined inside the sentence. */
export function WaysSection({ t }: { t: Tf }) {
  return (
    <Section tone="light" className="ja-reveal border-t border-border-3">
      <div data-testid="careers-ways" className="container-site">
        <div className="mb-8 max-w-[680px]">
          <Eyebrow>{t('jt.057')}</Eyebrow>
          <h2 className="mt-3 mb-3 text-h2 leading-[1.05] tracking-[-0.04em] max-md:text-[27px] max-md:leading-[1.12] max-md:tracking-[-0.9px]">
            {t('jt.058')}
          </h2>
          <p className="text-body text-text-secondary">{t('jt.059')}</p>
        </div>
        <WaysList
          ways={WAYS.map((w) => ({
            badge: t(w.badge),
            title: t(w.title),
            body: t(w.body),
            bullets: w.bullets.map((b) => t(b)),
          }))}
        />
        <div className="mt-[18px] flex items-start gap-[13px] rounded-base border border-edge-soft bg-pale-1 px-[22px] py-[18px] max-lg:mt-4 max-lg:border-[1.5px] max-lg:border-tint-border max-lg:bg-white max-lg:px-[18px] max-lg:py-4 max-lg:shadow-[0_10px_26px_rgba(22,60,90,0.08)]">
          <span
            aria-hidden="true"
            className="flex h-[30px] w-[30px] flex-none items-center justify-center rounded-[9px] border border-edge bg-white text-blue max-lg:h-[34px] max-lg:w-[34px] max-lg:rounded-[11px] max-lg:border-tint-border max-lg:bg-tint"
          >
            <FileIcon size={15} className="max-lg:h-[17px] max-lg:w-[17px]" />
          </span>
          <p className="text-[14px] leading-[1.6] font-semibold text-text-secondary xl:text-[11px] max-lg:text-[13.5px] max-lg:text-ink">
            {t('jt.078')}{' '}
            <Link
              href="/partner-with-us"
              prefetch={false}
              className="font-extrabold text-blue-safe underline"
            >
              {t('jt.079')}
            </Link>
          </p>
        </div>
      </div>
    </Section>
  );
}
