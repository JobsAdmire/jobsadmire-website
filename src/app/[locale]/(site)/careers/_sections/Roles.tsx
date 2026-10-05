import { useTranslations } from 'next-intl';
import { EmptyState } from '@/design/blocks/EmptyState';
import { buttonClassName } from '@/design/primitives/Button';
import { Eyebrow } from '@/design/primitives/Eyebrow';
import { Section } from '@/design/primitives/Section';
import type { Locale } from '@/i18n/routing';
import { ExternalIcon } from '../_components/icons';
import { RolesList } from '../_components/RolesList';
import { opsCareersPortal } from '../_lib/links';
import type { RoleCard, Tf } from '../_lib/roles';

/** `#roles` (design `.ja-jt-roles`, #f4f9fc → white): the header with the "Open application
 *  portal" pill (`jt.047`) on its right — the Operations careers portal in a new tab, in the
 *  page's locale, restored by the owner (parity S4.1, W245) — then the live list or, with nothing open, the designed empty
 *  state pointing at the open application (W6). */
export function RolesSection({ t, locale, cards }: { t: Tf; locale: Locale; cards: RoleCard[] }) {
  const sys = useTranslations('sys');
  return (
    <Section
      tone="pale-fade"
      id="roles"
      className="ja-reveal scroll-mt-24 border-t border-border-3"
    >
      <div data-testid="careers-roles" className="container-site">
        <div className="mb-[26px] flex flex-wrap items-end justify-between gap-[26px] max-md:gap-5">
          <div className="max-w-[620px]">
            <Eyebrow>{t('jt.044')}</Eyebrow>
            <h2 className="mt-3 mb-2 text-h2 leading-[1.05] tracking-[-0.04em] max-md:text-[27px] max-md:leading-[1.12] max-md:tracking-[-0.9px]">
              {t('jt.045')}
            </h2>
            <p className="text-body text-text-secondary">{t('jt.046')}</p>
          </div>
          <a
            data-testid="careers-portal"
            href={opsCareersPortal(locale)}
            target="_blank"
            rel="noopener"
            className={buttonClassName('primary', 'lg', 'whitespace-nowrap max-md:w-full')}
          >
            {t('jt.047')}
            <ExternalIcon size={15} />
          </a>
        </div>
        {cards.length === 0 ? (
          <EmptyState
            testId="careers-empty"
            tone="light"
            headingLevel={3}
            title={sys('careers.empty.title')}
            body={sys('careers.empty.body')}
            cta={{ label: t('jt.026'), href: '#apply' }}
          />
        ) : (
          <RolesList
            cards={cards}
            copy={{
              where: t('jt.048'),
              engagement: t('jt.049'),
              all: sys('careers.filters.all'),
              office: t('jt.261'),
              overseas: t('jt.262'),
              fullTime: t('jt.099'),
              partTime: t('jt.100'),
              project: t('jt.073'),
              apply: t('jt.052'),
              ask: t('jt.053'),
              newBadge: t('jt.033'),
              view: t('jt.310'),
              close: t('jt.309'),
              resultAll: sys('careers.roles.resultAll', { count: cards.length }),
              resultFiltered: String(sys.raw('careers.roles.resultFiltered')),
              showMore: String(sys.raw('careers.roles.showMore')),
              showFewer: t('jt.306'),
              noMatchTitle: t('jt.054'),
              noMatchBody: t('jt.055'),
              showAll: t('jt.056'),
            }}
          />
        )}
      </div>
    </Section>
  );
}
