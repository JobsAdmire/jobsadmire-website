import { useTranslations } from 'next-intl';
import { ContactLink } from '@/analytics/ContactLink';
import { Section } from '@/design/primitives/Section';
import { Link } from '@/i18n/navigation';
import { waLink } from '@/lib/contact';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { BuildingIcon, CalculatorIcon, UserCheckIcon, UsersIcon } from '../_components/icons';
import { waPrefill } from '../_lib/prefill';
import { ROUTER_CARDS, type RouterKey } from '../_lib/tables';

const CARD =
  'block h-full rounded-base border border-border-2 bg-white p-5 no-underline transition-shadow hover:shadow-card-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe max-md:rounded-sm max-md:p-3.5';
// D20: the design's calculator orange (#d97706) is 3.2:1 on white — `warning-text` instead.
const LOOK: Record<RouterKey, { Icon: typeof BuildingIcon; badge: string; cta: string }> = {
  hire: { Icon: BuildingIcon, badge: 'bg-tint text-blue-safe', cta: 'text-blue-safe' },
  permitOnly: {
    Icon: UserCheckIcon,
    badge: 'bg-success-surface text-success-text',
    cta: 'text-success-text',
  },
  partner: { Icon: UsersIcon, badge: 'bg-[#edf1f9] text-[#253063]', cta: 'text-[#253063]' },
  calculator: {
    Icon: CalculatorIcon,
    badge: 'bg-warning-surface text-warning-text',
    cta: 'text-warning-text',
  },
};

/** "Which one are you?" — three internal routes and the permit-only WhatsApp door (the design's
 *  prefilled chat, `page_cta`). Two columns up to 900 px, four from 901 px (delta 15). */
export function AudienceRouter({ bundle, tf }: { bundle: Bundle; tf: (id: string) => string }) {
  const sys = useTranslations('sys');
  const permitOnly = waLink(bundle.settings.whatsappNumber, waPrefill(sys, 'permitOnly'));
  return (
    <Section tone="light" className="border-b border-border-3 pt-14 pb-14 max-md:pt-8 max-md:pb-8">
      <div className="container-site" data-testid="wp-router">
        <h2 className="m-0 mb-2 text-center text-h2 tracking-[-0.02em] max-md:text-left">
          {tf('wp.083')}
        </h2>
        <p className="m-0 mb-7 text-center text-body text-text-tertiary max-md:mb-4 max-md:text-left">
          {tf('wp.084')}
        </p>
        <ul className="grid grid-cols-2 gap-4 max-md:gap-2.5 lg:grid-cols-4">
          {ROUTER_CARDS.map((c) => {
            const look = LOOK[c.key];
            const body = (
              <>
                <span
                  aria-hidden="true"
                  className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xs max-md:mb-2 ${look.badge}`}
                >
                  <look.Icon size={18} />
                </span>
                <span className="mb-1 block text-body font-extrabold text-ink">
                  {tf(c.titleId)}
                </span>
                <span className="block text-body-sm text-text-tertiary max-md:hidden">
                  {tf(c.bodyId)}
                </span>
                <span className={`mt-2.5 block text-body-sm font-extrabold ${look.cta}`}>
                  {tf(c.ctaId)}
                </span>
              </>
            );
            return (
              <li key={c.key}>
                {c.href === null ? (
                  <ContactLink
                    href={permitOnly}
                    placement="page_cta"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={CARD}
                  >
                    {body}
                  </ContactLink>
                ) : (
                  <Link
                    href={c.href}
                    // W99: /partner-with-us is T5's page — a viewport prefetch of an unbuilt
                    // route 404s into the console (best-practices 1.00). T5 may drop this.
                    prefetch={c.href === '/partner-with-us' ? false : undefined}
                    className={CARD}
                  >
                    {body}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </Section>
  );
}
