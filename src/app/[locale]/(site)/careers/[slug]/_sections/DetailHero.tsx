import { Breadcrumbs } from '@/design/blocks/Breadcrumbs';
import { ContactCta } from '@/design/blocks/ContactCta';
import { buttonClassName } from '@/design/primitives/Button';
import { Section } from '@/design/primitives/Section';
import type { Locale } from '@/i18n/routing';
import { detailHref, type PublicOpening } from '@/lib/careers-pure';
import type { Tf } from '../../_lib/roles';
import type { OpeningView } from '../_lib/view';

const HERO_BG = 'bg-[linear-gradient(158deg,#253063_0%,#1c2652_50%,#131c40_100%)]';

/** The detail hero: the trail (Home → Join Our Team → the role — this page's own ids, W109), the
 *  engagement and "New", the title as the h1 (the named LCP element, D26), place / work mode /
 *  posted, the pay line when the opening shows it, "Apply for this role" (#apply) and "Ask a
 *  question first" on WhatsApp (page data only in the prefill, W95). */
export function DetailHero({
  t,
  locale,
  opening,
  view,
}: {
  t: Tf;
  locale: Locale;
  opening: PublicOpening;
  view: OpeningView;
}) {
  return (
    <Section tone="dark" className={`pt-8 ${HERO_BG}`}>
      <div className="container-site">
        <Breadcrumbs
          locale={locale}
          tone="dark"
          items={[
            { name: t('jt.021'), href: '/' },
            { name: t('jt.005'), href: '/careers' },
            { name: opening.title, href: detailHref(opening.slug) },
          ]}
        />
        <div className="mt-6 max-w-[820px]">
          <p className="flex flex-wrap items-center gap-2 text-eyebrow font-extrabold uppercase tracking-[0.1em] text-sky">
            <span>{view.engagement}</span>
            {view.isNew && (
              <span className="rounded-pill bg-success-surface px-2 py-0.5 text-success-text">
                {t('jt.033')}
              </span>
            )}
          </p>
          <h1
            data-testid="page-h1"
            data-lcp-slot="h1"
            className="mt-3 text-h1 leading-[1.05] tracking-[-0.03em] text-white break-words"
          >
            {opening.title}
          </h1>
          <p className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-body font-bold text-[#c1cbe6]">
            <span>{view.location}</span>
            {view.workModes && <span>{view.workModes}</span>}
            <span>{view.postedLine}</span>
          </p>
          {view.pay && (
            <p data-testid="careers-pay" className="mt-2 text-body-lg font-extrabold text-white">
              {view.pay}
            </p>
          )}
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a href="#apply" className={buttonClassName('primary', 'lg')}>
              {t('jt.052')}
            </a>
            <ContactCta
              placement="page_cta"
              href={view.askHref}
              external
              variant="inverse"
              size="lg"
            >
              {t('jt.053')}
            </ContactCta>
          </div>
        </div>
      </div>
    </Section>
  );
}
