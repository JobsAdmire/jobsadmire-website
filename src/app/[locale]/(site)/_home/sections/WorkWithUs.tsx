import { useTranslations } from 'next-intl';
import { makeTf } from '@/content/pure';
import { ContactCta } from '@/design/blocks/ContactCta';
import { CheckIcon } from '@/design/chrome/icons';
import { Button } from '@/design/primitives/Button';
import { Eyebrow } from '@/design/primitives/Eyebrow';
import { Section } from '@/design/primitives/Section';
import { Link } from '@/i18n/navigation';
import { waLink } from '@/lib/contact';
import { LiveDot } from '../components/LiveDot';
import { ArrowsIcon, UserPlusIcon } from '../components/icons';
import { H2, SECTION_HEAD } from './styles';
import type { SectionProps } from './types';

const AGENCY_POINTS = ['home.146', 'home.147', 'home.148'] as const;
const ROLE_ROWS = [
  ['home.154', 'home.155'],
  ['home.156', 'home.157'],
  ['home.158', 'home.159'],
] as const;
const CARD_TITLE =
  'm-0 mb-3 text-[clamp(24px,2.4vw,30px)] leading-[1.1] tracking-[-1px] xl:text-[clamp(18px,1.8vw,22.5px)]';

/**
 * "Work with us" (design lines 952–1024), hidden at ≤ 460 px (`.ja-hide-mobile`, W10). The card
 * bodies are the package's home.145/home.153 — the design markup hard-codes an older "We handle…"
 * English body; the strings say "JobsAdmire handles…" (page note, formal register). The three role
 * rows are static role descriptions linking to the careers index; live openings are the careers
 * task's (D15). "Talk to us" is a tracked WhatsApp CTA with the fixed partner prefill (W12/W95).
 */
export function WorkWithUs({ locale, bundle }: SectionProps) {
  const tf = makeTf(bundle, locale);
  const sys = useTranslations('sys');
  return (
    <Section tone="light" id="work-with-us" className="ja-reveal max-xs:hidden">
      <div data-testid="work-with-us" className="container-site">
        <div className={SECTION_HEAD}>
          <div className="min-w-0">
            <Eyebrow>{tf('home.140')}</Eyebrow>
            <h2 className={`${H2} m-0 mt-3`}>{tf('home.141')}</h2>
          </div>
          <p className="m-0 max-w-[340px] text-body-sm font-bold text-text-tertiary lg:text-right">
            {tf('home.142')}
          </p>
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          <article className="relative flex flex-col overflow-hidden rounded-[26px] bg-navy px-[38px] py-9 text-white xl:rounded-[19.5px] xl:px-[28.5px] xl:py-[27px]">
            <div
              aria-hidden="true"
              className="ja-glow pointer-events-none absolute -right-[130px] -top-[150px] h-[420px] w-[420px] rounded-pill bg-[radial-gradient(circle,rgba(24,153,213,0.24),transparent_65%)]"
            />
            <div className="relative">
              <p className="m-0 mb-[18px] flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-[13px] bg-blue/20 text-sky"
                >
                  <ArrowsIcon size={22} />
                </span>
                <span className="text-[11.5px] font-extrabold uppercase tracking-[1.3px] text-sky">
                  {tf('home.143')}
                </span>
              </p>
              <h3 className={`${CARD_TITLE} text-white`}>{tf('home.144')}</h3>
              <p className="m-0 mb-[22px] text-[15px] font-semibold leading-[1.62] text-white/70 xl:text-body">
                {tf('home.145')}
              </p>
              <ul className="ja-stagger m-0 mb-[26px] flex list-none flex-col gap-[11px] p-0">
                {AGENCY_POINTS.map((id) => (
                  <li
                    key={id}
                    className="flex items-start gap-[11px] text-body-sm font-bold leading-normal text-white/85"
                  >
                    <CheckIcon size={14} className="mt-[3px] shrink-0 text-[#5ddfb0]" />
                    {tf(id)}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative mt-auto flex flex-wrap items-center gap-[11px]">
              <Button prefetch={false} variant="primary" href="/partner-with-us">
                {tf('home.149')}
              </Button>
              <ContactCta
                placement="page_cta"
                variant="inverse"
                external
                href={waLink(bundle.settings.whatsappNumber, sys('home.whatsapp.partner'))}
              >
                <LiveDot />
                {tf('home.223')}
              </ContactCta>
            </div>
            <p className="relative m-0 mt-[22px] border-t border-dashed border-white/20 pt-3.5 text-[12.5px] font-semibold leading-[1.55] text-white/55">
              {tf('home.150')}
            </p>
          </article>
          <article className="flex flex-col rounded-[26px] border border-border-2 bg-white px-[38px] py-9 xl:rounded-[19.5px] xl:px-[28.5px] xl:py-[27px]">
            <p className="m-0 mb-[18px] flex items-center gap-3">
              <span
                aria-hidden="true"
                className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-[13px] bg-success-surface text-success-text"
              >
                <UserPlusIcon size={22} />
              </span>
              <span className="text-[11.5px] font-extrabold uppercase tracking-[1.3px] text-success-text">
                {tf('home.151')}
              </span>
            </p>
            <h3 className={`${CARD_TITLE} text-ink`}>{tf('home.152')}</h3>
            <p className="m-0 mb-[22px] text-[15px] font-semibold leading-[1.62] text-text-secondary xl:text-body">
              {tf('home.153')}
            </p>
            <ul className="ja-stagger m-0 mb-6 flex list-none flex-col gap-2.5 p-0">
              {ROLE_ROWS.map(([roleId, metaId]) => (
                <li key={roleId}>
                  <Link
                    prefetch={false}
                    href="/careers"
                    className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 rounded-sm border border-[#e2edf5] bg-pale-1 px-4 py-[13px] no-underline transition-colors hover:border-tint-border hover:bg-tint"
                  >
                    <span className="text-[14.5px] font-extrabold text-ink xl:text-[11px]">
                      {tf(roleId)}
                    </span>
                    <span className="text-[12.5px] font-bold text-text-secondary">
                      {tf(metaId)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-auto flex flex-wrap gap-[11px]">
              <Button prefetch={false} variant="nav" href="/careers">
                {tf('home.160')}
              </Button>
              <Button prefetch={false} variant="secondary" href="/verify">
                {tf('home.161')}
              </Button>
            </div>
          </article>
        </div>
      </div>
    </Section>
  );
}
