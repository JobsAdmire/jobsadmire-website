import { useTranslations } from 'next-intl';
import type { Founder } from '@/content/collections';
import { makeT, makeTf } from '@/content/pure';
import { ContactCta } from '@/design/blocks/ContactCta';
import { ImageSlot } from '@/design/blocks/ImageSlot';
import { Button } from '@/design/primitives/Button';
import { Eyebrow } from '@/design/primitives/Eyebrow';
import { Section } from '@/design/primitives/Section';
import { liquidSizes } from '@/design/zoom';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { telLink } from '@/lib/contact';
import { formatInt } from '@/lib/format/money';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { FounderRecordButton } from '../_components/FounderRecordButton';
import motion from '../_components/motion.module.css';
import { RegisterBrowser, type RegisterView } from '../_components/RegisterBrowser';
import { RECORD_DIALOG_ENABLED } from '../_lib/flags';
import type { Register, Representative } from '../_lib/register';
import { founderCaps, founderRecord, recordLabels } from './record';

type T = (id: string) => string;

/** The register's views (Verify ll. 1531–1541 without the country groups — the owner's ruling
 *  keeps people, and so countries, out): All people, then the two offices. The Karachi office
 *  reads the package's own "Karachi office" (home.132) — the verify package has no such id —
 *  and "Showing" is the package's jt.304. */
const VIEWS = (t: T): RegisterView[] => [
  { key: 'all', label: t('verify.270'), title: t('verify.271') },
  { key: 'antalya', label: t('verify.227'), title: t('verify.227') },
  { key: 'karachi', label: t('home.132'), title: t('home.132') },
];

/**
 * `#structure` — "01 · Our people" (Verify ll. 676–839) on the design's white → #f4f9fc → white
 * fade (S3.4). Owner ruling: NO invented representatives. What renders: the intro with the feed
 * badge "Internal list · CRM feed not configured" (verify.220, S3.3 — the design's `internal`
 * state, the true one); the founder strip (S3.1/M6) from the published W86 row — photo in the
 * spinning ring, the sole-signatory pill, "Authorised · no expiry", the public id and "Open
 * record" (the founder's record dialog); the register's frame (S3.2/M7, `RegisterBrowser`) whose
 * body is ONE row — the empty-register message and the office call; the partner note. The stats,
 * the sub-line verify.056 ("Anyone not on this page does not act for JobsAdmire" — above an empty
 * register it would brand every genuine employee an impostor), the people rows and the former
 * strip render only from v1.1 register rows (W6, D23).
 */
export function Structure({
  bundle,
  locale,
  register,
  founder,
  updatedLabel,
}: {
  bundle: Bundle;
  locale: Locale;
  register: Register;
  founder: Founder | null;
  updatedLabel: string | null;
}) {
  const t = makeT(bundle);
  const tf = makeTf(bundle, locale);
  const sys = useTranslations('sys');
  const hasRows = register.active.length > 0;
  return (
    <Section
      tone="pale-middle"
      id="structure"
      className="scroll-mt-24 pt-[74px] pb-[50px] max-md:pt-[42px] max-md:pb-[34px]"
    >
      <div className="container-site" data-testid="verify-structure">
        {/* QA W221 V-06: the design's ≤ 700 `.ja-structure .ja-sec-head` is left-aligned (l. 293) */}
        <div className="ja-reveal mx-auto mb-10 max-w-[660px] text-center max-md:mx-0 max-md:mb-5 max-md:text-left xl:max-w-[495px]">
          <Eyebrow>{t('verify.053')}</Eyebrow>
          <h2 className="mt-3 mb-3.5 text-h2 leading-[1.05] tracking-[-0.04em] max-md:text-[25px] max-md:leading-[1.13] max-md:tracking-[-0.6px]">
            {t('verify.054')}
            <br className="max-md:hidden" /> {t('verify.055')}
          </h2>
          {hasRows ? (
            <p className="mt-0 mb-3.5 text-body-lg text-text-secondary">{tf('verify.056')}</p>
          ) : null}
          <p
            data-testid="verify-feed-badge"
            className="m-0 inline-flex items-center rounded-pill border border-edge bg-pale-1 px-3.5 py-1.5 text-[12.5px] font-extrabold text-text-tertiary max-md:mt-1 xl:text-[11px]"
          >
            {t('verify.220')}
          </p>
        </div>

        {hasRows ? (
          <StatsStrip register={register} locale={locale} t={t} updatedLabel={updatedLabel} />
        ) : null}
        {founder ? (
          <FounderStrip
            founder={founder}
            record={founderRecord(founder, register.founder, t, bundle.settings.phoneDisplay)}
            linkable={RECORD_DIALOG_ENABLED && register.founder !== null}
            t={t}
            sys={(k) => sys(k)}
            whatsappNumber={bundle.settings.whatsappNumber}
          />
        ) : null}
        <RegisterBrowser
          views={VIEWS(t)}
          defaultKey="antalya"
          labels={{
            browse: t('verify.064'),
            note: t('verify.065'),
            showing: t('jt.304'),
            tapToChange: sys('verify.register.tapToChange'),
            payroll: t('verify.066'),
            sub: t('verify.232'),
            checkId: t('verify.067'),
            columns: [t('verify.068'), t('verify.069'), t('verify.070'), t('verify.071')],
          }}
        >
          {hasRows ? (
            <RegisterList rows={register.active} t={t} />
          ) : (
            <div
              data-testid="verify-empty"
              className="flex flex-wrap items-center gap-4 px-6 py-6 max-md:px-[15px] max-md:py-4"
            >
              <div className="min-w-0 flex-[1_1_320px]">
                <h4 className="m-0 text-[15px] font-extrabold text-ink xl:text-[11.25px]">
                  {sys('verify.empty.title')}
                </h4>
                <p className="mt-1.5 mb-0 text-body-sm text-text-secondary">
                  {sys('verify.empty.body')}
                </p>
              </div>
              <ContactCta
                placement="page_cta"
                variant="outline-blue"
                shape="rect"
                radius={11}
                href={telLink(bundle.settings.phone)}
                className="max-md:w-full"
              >
                {t('verify.051')}
              </ContactCta>
            </div>
          )}
        </RegisterBrowser>
        {register.former.length > 0 ? <FormerStrip former={register.former} t={t} /> : null}

        <div className="ja-reveal mt-[22px] flex flex-wrap items-center justify-between gap-5 rounded-[18px] border border-edge bg-[linear-gradient(180deg,#f4f9fc_0%,#e8f3f9_100%)] px-[26px] py-5 max-md:gap-3.5 max-md:rounded-base max-md:p-4">
          <p className="m-0 max-w-[760px] text-[14.5px] leading-[1.6] font-bold text-text-secondary max-md:text-[13.5px] max-md:leading-[1.55] xl:max-w-[570px] xl:text-[11px]">
            <strong className="font-extrabold text-ink">{t('verify.074')}</strong>{' '}
            {tf('verify.075')}
          </p>
          {/* W195/W199: a cross-route page link never viewport-prefetches (hover still does). */}
          <Button
            variant="secondary"
            shape="rect"
            radius={11}
            href="/partner-with-us"
            prefetch={false}
            className="max-md:min-h-[48px] max-md:w-full"
          >
            {t('verify.076')}
          </Button>
        </div>
      </div>
    </Section>
  );
}

/** W1/D17: the three figures are register-derived (never typed); rendered only with rows. */
function StatsStrip({
  register,
  locale,
  t,
  updatedLabel,
}: {
  register: Register;
  locale: Locale;
  t: T;
  updatedLabel: string | null;
}) {
  const figures: [number, string][] = [
    [register.active.length, t('verify.057')],
    [register.active.filter((r) => r.level === 'office').length, t('verify.058')],
    [new Set(register.active.map((r) => r.country)).size, t('verify.059')],
  ];
  return (
    <div
      data-testid="verify-stats"
      className="ja-reveal mb-5 flex flex-wrap items-center gap-9 rounded-base border border-border-1 bg-white px-6 py-4 shadow-card"
    >
      {figures.map(([value, label]) => (
        <p key={label} className="m-0 flex items-baseline gap-2.5">
          <span className="text-card-title font-extrabold text-ink">
            {formatInt(value, locale)}
          </span>
          <span className="text-eyebrow font-bold tracking-[0.7px] text-text-tertiary uppercase">
            {label}
          </span>
        </p>
      ))}
      {updatedLabel ? (
        <p className="m-0 ml-auto text-body-sm font-bold text-text-tertiary">{updatedLabel}</p>
      ) : null}
    </div>
  );
}

/** "Open record": a 10 px rectangle on white (Verify l. 717); ≤ 700 full width, 46 px, white on
 *  the navy card with ink text (ll. 303, 400). */
const OPEN_RECORD =
  'ja-hover-lift inline-flex min-h-[44px] cursor-pointer items-center justify-center rounded-[10px] border-[1.5px] border-edge bg-white px-6 text-[13px] font-extrabold text-indigo transition-colors hover:border-blue hover:bg-pale-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe max-md:min-h-[46px] max-md:w-full max-md:border-white max-md:text-[14px] max-md:text-ink xl:text-[11px]';

/**
 * S3.1 / M6 (Verify ll. 696–720, 300–304, 394–401): from the published W86 founder row only
 * (never the hero's hard-coded claims). Desktop: a white card — the 84 px photo in the design's
 * spinning conic ring (`jaSpin`, still under reduced motion), the name with the navy "Sole
 * signatory" pill, the title, the green "Authorised · no expiry" pill with the public id, and
 * "Open record" over the red note on the right. ≤ 700: the same card on the navy gradient.
 */
function FounderStrip({
  founder,
  record,
  linkable,
  t,
  sys,
  whatsappNumber,
}: {
  founder: Founder;
  record: Representative;
  linkable: boolean;
  t: T;
  sys: T;
  whatsappNumber: string;
}) {
  return (
    <article
      data-testid="verify-founder"
      className="ja-reveal mb-[22px] flex flex-wrap items-center gap-6 rounded-lg border-[1.5px] border-[#c9d3ec] bg-white px-[26px] py-5 shadow-[0_20px_48px_rgba(22,40,90,0.1)] max-md:mb-3.5 max-md:gap-3.5 max-md:rounded-base max-md:border-white/[0.18] max-md:bg-[linear-gradient(160deg,#0e1a37_0%,#253063_100%)] max-md:p-4 max-md:shadow-[0_16px_36px_rgba(3,10,26,0.32)]"
    >
      <span className="relative m-1.5 block size-[84px] shrink-0">
        <span
          aria-hidden="true"
          className={`absolute -inset-1.5 rounded-pill bg-[conic-gradient(from_0deg,#1899d5,#253063,#7fd0f5,#1899d5)] ${motion.spin}`}
        />
        <span aria-hidden="true" className="absolute -inset-[2.5px] rounded-pill bg-white" />
        {/* W129: the slot owns its box; the wrapper sizes and rounds it. */}
        <span className="relative block size-[84px] overflow-hidden rounded-pill bg-tint">
          <ImageSlot
            slot="founder-photo"
            src={founder.photoSrc}
            alt={founder.name}
            width={84}
            height={84}
            sizes={liquidSizes(84)}
          />
        </span>
      </span>
      <div className="min-w-[240px] max-md:min-w-0 max-md:flex-[1_1_auto]">
        <div className="flex flex-wrap items-center gap-[11px]">
          <h3 className="m-0 text-[20px] tracking-[-0.5px] text-ink max-md:text-[18.5px] max-md:text-white xl:text-[15px]">
            {founder.name}
          </h3>
          <span className="rounded-pill bg-indigo px-[13px] py-1 text-[10.5px] font-extrabold tracking-[1.1px] whitespace-nowrap text-white uppercase max-md:border max-md:border-white/30 max-md:bg-white/[0.16] xl:text-[11px]">
            {t('verify.060')}
          </span>
        </div>
        <p className="mt-1 mb-0 text-[14px] font-bold text-text-secondary max-md:text-white/[0.72] xl:text-[11px]">
          {t(founder.titleId)}
        </p>
        <p className="mt-[9px] mb-0 flex flex-wrap items-center gap-2.5">
          <span className="inline-flex items-center gap-[7px] rounded-pill border border-success-soft-border bg-success-surface px-3 py-1 text-[11.5px] font-extrabold whitespace-nowrap text-success-text max-md:border-[rgba(93,223,176,0.4)] max-md:bg-[rgba(22,163,74,0.18)] max-md:text-[12px] max-md:text-[#5ddfb0] xl:text-[11px]">
            <span aria-hidden="true" className="ja-live size-2 shrink-0 rounded-pill bg-success" />
            {t('verify.061')}
          </span>
          <span className="text-[12px] font-extrabold text-text-tertiary max-md:text-white/60 xl:text-[11px]">
            {record.id}
          </span>
        </p>
      </div>
      <div className="ml-auto flex max-w-[340px] flex-col items-end gap-2.5 max-md:ml-0 max-md:w-full max-md:max-w-none max-md:items-stretch">
        <FounderRecordButton
          label={t('verify.062')}
          className={OPEN_RECORD}
          record={record}
          labels={recordLabels(t, sys)}
          caps={founderCaps(t)}
          linkable={linkable}
          whatsappNumber={whatsappNumber}
          photo={
            <ImageSlot
              slot={`rep-${record.id}`}
              src={record.photo ?? founder.photoSrc}
              alt=""
              width={88}
              height={112}
              sizes={liquidSizes(88)}
            />
          }
        />
        <p className="m-0 text-right text-[12.5px] leading-[1.5] font-bold text-[#7f1d1d] max-md:text-left max-md:text-[12px] max-md:text-[#fca5a5] xl:text-[11px]">
          {t('verify.063')}
        </p>
      </div>
    </article>
  );
}

/** The v1.1 register, minimal: one accessible row per active person with the design's four
 *  columns, inside the panel (its visual column bar is the frame's; the table keeps its own
 *  header row for assistive tech); the id links the record deep link (V-1). */
function RegisterList({ rows, t }: { rows: Representative[]; t: T }) {
  return (
    <div data-testid="verify-register" className="overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <thead className="sr-only">
          <tr>
            <th scope="col">{t('verify.068')}</th>
            <th scope="col">{t('verify.069')}</th>
            <th scope="col">{t('verify.070')}</th>
            <th scope="col">{t('verify.071')}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t border-border-3">
              <td className="px-6 py-3">
                <span className="block font-extrabold text-ink">{r.name}</span>
                <span className="block text-body-sm text-text-tertiary">
                  {r.desk ? `${r.desk} · ${r.role}` : r.role}
                </span>
              </td>
              <td className="px-6 py-3 text-body-sm font-bold text-text-secondary">{r.city}</td>
              <td className="px-6 py-3">
                <Link
                  href={{ pathname: '/verify', query: { id: r.id } }}
                  prefetch={false}
                  className="inline-flex min-h-[44px] items-center font-extrabold text-blue-safe underline"
                >
                  {r.id}
                </Link>
              </td>
              <td className="px-6 py-3 text-body-sm font-extrabold text-success-text">
                {t('verify.046')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Former and suspended people stay visible on purpose (the package README's rule) — only when
 *  there are any, and never as a link. */
function FormerStrip({ former, t }: { former: Representative[]; t: T }) {
  return (
    <div
      data-testid="verify-former"
      className="mt-[18px] flex flex-wrap items-center gap-3 rounded-sm border border-danger-border bg-danger-surface px-[18px] py-3.5"
    >
      <p className="m-0 text-eyebrow font-extrabold tracking-[1.2px] text-danger uppercase">
        {t('verify.073')}
      </p>
      <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
        {former.map((r) => (
          <li
            key={r.id}
            className="inline-flex items-center gap-2 rounded-pill border border-danger-border bg-white px-3.5 py-1.5 text-body-sm"
          >
            <span aria-hidden="true" className="size-[7px] rounded-pill bg-danger" />
            <span className="font-extrabold text-ink">
              {r.name} · {r.id}
            </span>
            <span className="font-semibold text-danger">
              {r.status === 'suspended' ? t('verify.259') : r.role}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
