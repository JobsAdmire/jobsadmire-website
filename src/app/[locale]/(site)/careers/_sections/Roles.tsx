import { useTranslations } from 'next-intl';
import { EmptyState } from '@/design/blocks/EmptyState';
import { Eyebrow } from '@/design/primitives/Eyebrow';
import { Section } from '@/design/primitives/Section';
import { RolesList } from '../_components/RolesList';
import type { RoleCard, Tf } from '../_lib/roles';

/** `#roles` (design `.ja-jt-roles`): the header, then the live list — or, with nothing open,
 *  the designed empty state pointing at the open application (W6). The design's "Open
 *  application portal" (`jt.047`) links to Operations and is not rendered (W89). */
export function RolesSection({ t, cards }: { t: Tf; cards: RoleCard[] }) {
  const sys = useTranslations('sys');
  return (
    <Section tone="pale" id="roles" className="scroll-mt-24 border-t border-border-3">
      <div data-testid="careers-roles" className="container-site">
        <div className="mb-6 max-w-[620px]">
          <Eyebrow>{t('jt.044')}</Eyebrow>
          <h2 className="mt-3 mb-2 text-h2 leading-[1.05] tracking-[-0.04em]">{t('jt.045')}</h2>
          <p className="text-body text-text-secondary">{t('jt.046')}</p>
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
