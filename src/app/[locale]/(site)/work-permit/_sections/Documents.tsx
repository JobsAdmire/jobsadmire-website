import { useTranslations } from 'next-intl';
import { Section } from '@/design/primitives/Section';
import { BuildingIcon, CheckIcon, UsersIcon } from '../_components/icons';
import { DOC_LISTS, type DocList } from '../_lib/tables';

const LOOK: Record<DocList['key'], { Icon: typeof BuildingIcon; badge: string; count: string }> = {
  employer: {
    Icon: BuildingIcon,
    badge: 'bg-tint text-blue-safe',
    count: 'border-tint-border bg-tint text-blue-safe',
  },
  worker: {
    Icon: UsersIcon,
    badge: 'bg-success-surface text-success-text',
    count: 'border-success-border bg-success-surface text-success-text',
  },
};

/** "Documents you'll need" (#documents): the employer and worker checklists; each count badge is
 *  computed from its list (`sys.wp.documents.count`, ICU) — never `wp.300`'s typed "6 docs"
 *  (D17). The renewal banner continues this pale band. */
export function Documents({ tf }: { tf: (id: string) => string }) {
  const sys = useTranslations('sys');
  return (
    <Section tone="pale" id="documents" className="scroll-mt-24 lg:scroll-mt-32 xl:scroll-mt-40">
      <div className="container-site" data-testid="wp-documents">
        <h2 className="m-0 mb-3.5 text-center text-h2 leading-[1.05] tracking-[-0.03em] max-md:text-left">
          {tf('wp.297')}
        </h2>
        <p className="mx-auto mb-11 max-w-[560px] text-center text-body-lg text-text-secondary max-md:mb-5 max-md:text-left">
          {tf('wp.298')}
        </p>
        <div className="mx-auto grid max-w-[1080px] gap-6 max-md:gap-2.5 lg:grid-cols-2">
          {DOC_LISTS.map((list) => {
            const look = LOOK[list.key];
            return (
              <article
                key={list.key}
                data-testid={`wp-docs-${list.key}`}
                className="min-w-0 rounded-lg border border-border-2 bg-white px-8 py-7.5 max-md:rounded-base max-md:px-4 max-md:py-3.5"
              >
                <div className="mb-4.5 flex items-center gap-3 max-md:mb-3 max-md:border-b max-md:border-border-3 max-md:pb-3">
                  <span
                    aria-hidden="true"
                    className={`flex h-10.5 w-10.5 flex-none items-center justify-center rounded-xs ${look.badge}`}
                  >
                    <look.Icon size={20} />
                  </span>
                  <h3 className="m-0 text-card-title">{tf(list.titleId)}</h3>
                  <span
                    className={`ml-auto rounded-pill border px-2.5 py-1 text-eyebrow font-extrabold whitespace-nowrap ${look.count}`}
                  >
                    {sys('wp.documents.count', { n: list.items.length })}
                  </span>
                </div>
                <ul className="flex flex-col gap-2.5 text-body-sm text-text-secondary">
                  {list.items.map((item) => (
                    <li key={item.id} className="flex items-start gap-2.5">
                      <CheckIcon size={15} className="mt-0.5 flex-none text-success" />
                      <span>
                        {tf(item.id)}
                        {item.noteId ? (
                          <>
                            {' '}
                            <span className="text-text-tertiary">{tf(item.noteId)}</span>
                          </>
                        ) : null}
                      </span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
        <p className="mx-auto mt-6 mb-0 max-w-[560px] text-center text-body-sm text-text-secondary max-md:mt-3.5 max-md:text-left">
          {tf('wp.318')}
        </p>
      </div>
    </Section>
  );
}
