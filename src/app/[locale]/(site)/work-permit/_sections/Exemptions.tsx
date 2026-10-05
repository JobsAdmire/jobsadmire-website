import { useTranslations } from 'next-intl';
import { ContactCta } from '@/design/blocks/ContactCta';
import { Section } from '@/design/primitives/Section';
import { waLink } from '@/lib/contact';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { AwardIcon, GlobeIcon, LeafIcon, PackageIcon, WrenchIcon } from '../_components/icons';
import { sp } from '../_lib/fragments';
import { waPrefill } from '../_lib/prefill';
import { EXEMPTION_CARDS, EXEMPTION_FACTS, type ExemptionIcon } from '../_lib/tables';

const ICON: Record<ExemptionIcon, typeof WrenchIcon> = {
  wrench: WrenchIcon,
  globe: GlobeIcon,
  leaf: LeafIcon,
  award: AwardIcon,
  package: PackageIcon,
};
const INLINE = 'font-extrabold text-blue-safe no-underline hover:underline';

/** "Who qualifies for the work permit exemption" (#muafiyet): five Article-48 categories, the
 *  more-categories tile with its WhatsApp door, and the four facts. `wp.214`–`218` are one
 *  sentence the package splits around two in-page links (W23). */
export function Exemptions({ bundle, tf }: { bundle: Bundle; tf: (id: string) => string }) {
  const sys = useTranslations('sys');
  const [a, b, c, d, e] = ['wp.214', 'wp.215', 'wp.216', 'wp.217', 'wp.218'].map((id) => tf(id));
  return (
    <Section tone="pale" id="muafiyet" className="scroll-mt-24 lg:scroll-mt-32 xl:scroll-mt-40">
      <div className="container-site" data-testid="wp-muafiyet">
        <div className="mx-auto mb-11 max-w-[720px] text-center max-md:mb-5">
          <p className="m-0 mb-4 inline-block rounded-pill border border-[#ccd6ea] bg-[#edf1f9] px-4 py-1.5 text-eyebrow font-extrabold tracking-[1.5px] text-[#253063] uppercase">
            {tf('wp.100')}
          </p>
          <h2 className="m-0 mb-3.5 text-h2 leading-[1.05] tracking-[-0.03em] max-md:text-[25px] max-md:leading-[1.12] max-md:tracking-[-0.5px]">
            {tf('wp.212')}
          </h2>
          <p className="m-0 text-body-lg text-text-secondary">{tf('wp.213')}</p>
          <p className="m-0 mt-3 text-body-sm text-text-secondary">
            {a}
            {sp(a, b)}
            <a href="#rules" className={INLINE}>
              {b}
            </a>
            {sp(b, c)}
            {c}
            {sp(c, d)}
            <a href="#eligibility" className={INLINE}>
              {d}
            </a>
            {sp(d, e)}
            {e}
          </p>
        </div>
        <ul className="grid gap-4.5 max-md:gap-2.5 md:grid-cols-2 lg:grid-cols-3">
          {EXEMPTION_CARDS.map((card) => {
            const Icon = ICON[card.icon];
            return (
              <li key={card.titleId} className="min-w-0">
                <article className="h-full rounded-md border border-[#ccd6ea] bg-white px-6.5 py-6.5 max-md:rounded-sm max-md:px-3.5 max-md:py-3.5">
                  <div className="mb-3.5 flex items-center justify-between gap-2.5 max-md:mb-2 max-md:justify-start">
                    <span
                      aria-hidden="true"
                      className="flex h-10 w-10 flex-none items-center justify-center rounded-xs bg-[#edf1f9] text-[#253063]"
                    >
                      <Icon size={20} />
                    </span>
                    <span className="rounded-pill border border-[#ccd6ea] bg-[#edf1f9] px-2.5 py-1 text-eyebrow font-extrabold tracking-[0.6px] whitespace-nowrap text-[#253063] uppercase">
                      {tf(card.badgeId)}
                    </span>
                  </div>
                  <h3 className="m-0 mb-1.5 text-body-lg font-extrabold">{tf(card.titleId)}</h3>
                  <p className="m-0 text-body-sm text-text-secondary">{tf(card.bodyId)}</p>
                </article>
              </li>
            );
          })}
          <li className="min-w-0">
            <div className="flex h-full flex-col justify-center rounded-md bg-gradient-to-br from-[#253063] to-[#16204a] px-6.5 py-6.5 text-white max-md:rounded-sm max-md:px-4 max-md:py-4">
              <p className="m-0 mb-1.5 text-body font-extrabold">{tf('wp.232')}</p>
              <p className="m-0 mb-3.5 text-body-sm text-white/90">{tf('wp.233')}</p>
              <ContactCta
                placement="page_cta"
                variant="secondary"
                external
                className="self-start"
                href={waLink(bundle.settings.whatsappNumber, waPrefill(sys, 'exemption'))}
              >
                {tf('wp.186')}
              </ContactCta>
            </div>
          </li>
        </ul>
        <dl className="mt-4.5 grid rounded-md border border-border-2 bg-white px-7 py-6 max-md:mt-2.5 max-md:px-4 max-md:py-3.5 lg:grid-cols-4">
          {EXEMPTION_FACTS.map((f) => {
            const [strong, rest] = [tf(f.strongId), tf(f.restId)];
            return (
              <div
                key={f.labelId}
                className="border-border-3 py-3 max-lg:border-t max-lg:first:border-t-0 max-lg:first:pt-0 lg:border-r lg:px-6 lg:py-1 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0"
              >
                <dt className="mb-1.5 text-eyebrow font-extrabold tracking-[0.8px] text-[#253063] uppercase">
                  {tf(f.labelId)}
                </dt>
                <dd className="m-0 text-body-sm text-text-secondary">
                  <strong className="font-extrabold text-ink">{strong}</strong>
                  {sp(strong, rest)}
                  {rest}
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </Section>
  );
}
