import { useTranslations } from 'next-intl';
import type { Founder } from '@/content/collections';
import { makeT, makeTf } from '@/content/pure';
import { Breadcrumbs } from '@/design/blocks/Breadcrumbs';
import { CheckIcon } from '@/design/chrome/icons';
import { Button } from '@/design/primitives/Button';
import type { Locale } from '@/i18n/routing';
import { formatInt } from '@/lib/format/money';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { LookupCard } from '../_components/LookupCard';
import type { RecordLabels } from '../_components/RecordDialog';
import { StepsDisclosure } from '../_components/StepsDisclosure';
import { RECORD_DIALOG_ENABLED } from '../_lib/flags';
import { LOOKUP_MIN_CHARS } from '../_lib/lookup';
import type { Register } from '../_lib/register';

const TICKS = ['verify.027', 'verify.028', 'verify.029'] as const;

/** The three "Verify in one minute" cards: the title and the body as the package's own fragments
 *  (plain lead, bold, plain tail — W23: composed only where the package splits the sentence).
 *  `glue` is '' where the tail brings its own punctuation (verify.234 starts with ". "). Step 2's
 *  badge is blue-safe, not the design's #1899d5 (white on it is 3.2:1 — D20). `phaseA` (QA W220
 *  V-01): steps 2 and 3 promise that the ID "must open a record on this page" and that a green
 *  Authorised status must match — a lookup the Phase A register cannot show (`LookupCard` answers
 *  `register_unavailable`); while `register.active` is empty each body is the whole `sys` string
 *  named here (never a package lead with a sys tail, W23), and the package composition returns
 *  with the published rows. */
const STEPS = [
  {
    n: 1,
    titleId: 'verify.037',
    lead: 'verify.038',
    bold: 'verify.039',
    tail: 'verify.040',
    glue: ' ',
    badge: 'bg-[#253063]',
    strong: 'text-white',
    phaseA: null,
  },
  {
    n: 2,
    titleId: 'verify.041',
    lead: 'verify.042',
    bold: 'verify.043',
    tail: 'verify.234',
    glue: '',
    badge: 'bg-blue-safe',
    strong: 'text-white',
    phaseA: 'verify.steps.qr',
  },
  {
    n: 3,
    titleId: 'verify.044',
    lead: 'verify.045',
    bold: 'verify.046',
    tail: 'verify.047',
    glue: ' ',
    badge: 'bg-success-text',
    strong: 'text-[#5ddfb0]',
    phaseA: 'verify.steps.match',
  },
] as const;

/** The dark hero: crumbs, badge, h1 (the LCP element — no photograph), lead, ticks, the
 *  structure CTA, the lookup card (`#check`) and the three steps. */
export function Hero({
  bundle,
  locale,
  register,
  founder,
  updatedLabel,
}: {
  bundle: Bundle;
  locale: Locale;
  register: Register;
  /** W86: the published founder row, or null — the lead switches on it (§10 row 3). */
  founder: Founder | null;
  updatedLabel: string | null;
}) {
  const t = makeT(bundle);
  const tf = makeTf(bundle, locale);
  const sys = useTranslations('sys');
  const { settings } = bundle;
  // W6/D17: the live pill exists only with register rows (a count + verify.224); null in Phase A.
  const livePill =
    register.active.length > 0
      ? `${formatInt(register.active.length, locale)} ${t('verify.224')}`
      : null;
  // D9 v1.1: resolved only while the dialog is enabled; null in Phase A.
  const recordLabels: RecordLabels | null = RECORD_DIALOG_ENABLED
    ? {
        badgeQrHint: t('verify.110'),
        authorisedUntil: t('verify.111'),
        noExpiry: t('verify.241'),
        contact: t('verify.112'),
        languages: t('verify.113'),
        reportsTo: t('verify.114'),
        withJobsAdmire: t('verify.115'),
        desk: t('verify.116'),
        soleSignatory: t('verify.060'),
        copyLink: t('verify.226'),
        copied: t('verify.267'),
        wrong: t('verify.239'),
        close: sys('verify.record.close'),
        status: {
          active: t('verify.046'),
          suspended: t('verify.259'),
          former: sys('verify.record.former'),
        },
        whatsappIntro: t('verify.228'),
      }
    : null;

  return (
    <section className="relative overflow-hidden bg-navy pb-14 text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_-10%,rgba(24,153,213,0.2),transparent_60%)]"
      />
      <div className="container-site relative pt-7" data-testid="verify-hero">
        {/* W109: this package's own labels — verify.021 "Home", verify.006 the page's nav label. */}
        <Breadcrumbs
          locale={locale}
          tone="dark"
          items={[
            { name: t('verify.021'), href: '/' },
            { name: t('verify.006'), href: '/verify' },
          ]}
        />
        <div className="mt-8 grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div className="min-w-0">
            <p className="mt-0 mb-5 inline-flex items-center gap-2 rounded-pill border border-white/20 bg-white/[0.07] px-4 py-2 text-body-sm font-bold text-white">
              <span aria-hidden="true" className="size-2 shrink-0 rounded-pill bg-success" />
              {/* W10: the desktop/mobile variants are CSS-gated, never conditionally rendered. */}
              <span className="max-md:hidden">{t('verify.001')}</span>
              <span className="md:hidden">{t('verify.022')}</span>
            </p>
            <h1
              data-testid="page-h1"
              data-lcp-slot="h1"
              className="m-0 text-h1 leading-[1.02] tracking-[-0.04em] text-white max-[601px]:text-[32px] max-[601px]:tracking-[-0.6px]"
            >
              {t('verify.023')} <span className="text-sky">{t('verify.024')}</span>
            </h1>
            <p
              data-testid="verify-lead"
              className="mt-5 mb-0 max-w-[540px] text-body-lg text-white/75"
            >
              {founder ? (
                <>
                  <span className="max-md:hidden">{tf('verify.025')}</span>
                  <span className="md:hidden">{tf('verify.026')}</span>
                </>
              ) : (
                sys('verify.hero.lead')
              )}
            </p>
            <ul className="mt-6 mb-0 flex list-none flex-col gap-2.5 p-0">
              {TICKS.map((id) => (
                <li
                  key={id}
                  className="flex items-start gap-3 text-body-sm font-bold text-white/80"
                >
                  <CheckIcon className="mt-[3px] shrink-0 text-[#5ddfb0]" />
                  <span>{t(id)}</span>
                </li>
              ))}
            </ul>
            <Button variant="inverse" size="lg" href="#structure" className="mt-6">
              {t('verify.030')}
            </Button>
          </div>
          <LookupCard
            labels={{
              heading: t('verify.031'),
              inputLabel: t('verify.032'),
              hint: sys('verify.lookup.hint', { min: LOOKUP_MIN_CHARS }),
              clear: t('verify.033'),
              callOffice: t('verify.034'),
              note: tf('verify.035'),
              resultTitle: sys('verify.lookup.resultTitle'),
              resultBody: sys.raw('verify.lookup.resultBody') as string,
              resultCall: t('verify.051'),
              resultWhatsapp: sys('verify.lookup.whatsapp'),
              whatsappIntro: t('verify.228'),
            }}
            phone={settings.phone}
            whatsappNumber={settings.whatsappNumber}
            livePill={livePill}
            updatedLabel={updatedLabel}
            recordLabels={recordLabels}
          />
        </div>
        <StepsDisclosure heading={t('verify.036')}>
          {STEPS.map((step) => (
            <div
              key={step.n}
              className="flex flex-col gap-2.5 rounded-base border border-white/15 bg-white/[0.055] px-6 py-5"
            >
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className={`flex size-[30px] shrink-0 items-center justify-center rounded-input text-body-sm font-extrabold text-white ${step.badge}`}
                >
                  {step.n}
                </span>
                <h3 className="m-0 text-card-title text-white">{t(step.titleId)}</h3>
              </div>
              <p className="m-0 text-body-sm text-white/70">
                {step.phaseA && register.active.length === 0 ? (
                  sys(step.phaseA)
                ) : (
                  <>
                    {tf(step.lead)} <strong className={step.strong}>{t(step.bold)}</strong>
                    {step.glue}
                    {tf(step.tail)}
                  </>
                )}
              </p>
            </div>
          ))}
        </StepsDisclosure>
      </div>
    </section>
  );
}
