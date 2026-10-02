import { useTranslations } from 'next-intl';
import type { Founder } from '@/content/collections';
import { makeT, makeTf } from '@/content/pure';
import { EmptyState } from '@/design/blocks/EmptyState';
import { ImageSlot } from '@/design/blocks/ImageSlot';
import { Button, buttonClassName } from '@/design/primitives/Button';
import { Eyebrow } from '@/design/primitives/Eyebrow';
import { Section } from '@/design/primitives/Section';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { telLink } from '@/lib/contact';
import { formatInt } from '@/lib/format/money';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import type { Register, Representative } from '../_lib/register';

type T = (id: string) => string;

/**
 * `#structure` — "01 · Our people". Phase A (W6, §10 row 11, D23): no `representatives` rows exist,
 * so the section is the designed empty state with the office's phone; the stats, the register
 * list, the former strip and the sub-line verify.056 ("Anyone not on this page does not act for
 * JobsAdmire") render only from rows — above an empty register that sentence would brand every
 * genuine employee an impostor. The founder strip reads the W86 row and renders nothing while it
 * is unpublished (§10 row 3); its public id and record link need the v1.1 register row as well.
 * The design's sidebar filter, country groups (flagcdn flags) and head-of-desk cards are v1.1
 * register UI on top of the minimal list below.
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
    <Section tone="pale" id="structure" className="scroll-mt-24">
      <div className="container-site" data-testid="verify-structure">
        <div className="mx-auto mb-10 max-w-[660px] text-center">
          <Eyebrow>{t('verify.053')}</Eyebrow>
          <h2 className="mt-3 mb-0 text-h2 leading-[1.05] tracking-[-0.04em]">
            {t('verify.054')}
            <br />
            {t('verify.055')}
          </h2>
          {hasRows ? (
            <p className="mt-3 mb-0 text-body-lg text-text-secondary">{tf('verify.056')}</p>
          ) : null}
        </div>

        {hasRows ? (
          <StatsStrip register={register} locale={locale} t={t} updatedLabel={updatedLabel} />
        ) : null}
        {founder ? <FounderStrip founder={founder} record={register.founder} t={t} /> : null}
        {hasRows ? (
          <RegisterList rows={register.active} t={t} />
        ) : (
          <EmptyState
            testId="verify-empty"
            tone="light"
            headingLevel={3}
            title={sys('verify.empty.title')}
            body={sys('verify.empty.body')}
            cta={{ label: t('verify.051'), href: telLink(bundle.settings.phone) }}
          />
        )}
        {register.former.length > 0 ? <FormerStrip former={register.former} t={t} /> : null}

        <div className="mt-6 flex flex-wrap items-center justify-between gap-5 rounded-md border border-border-1 bg-gradient-to-b from-pale-1 to-tint p-6">
          <p className="m-0 max-w-[760px] text-body-sm font-bold text-text-secondary">
            <strong className="font-extrabold text-ink">{t('verify.074')}</strong>{' '}
            {tf('verify.075')}
          </p>
          {/* W195/W199: a cross-route page link never viewport-prefetches (hover still does). */}
          <Button variant="secondary" href="/partner-with-us" prefetch={false}>
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
      className="mb-5 flex flex-wrap items-center gap-9 rounded-base border border-border-1 bg-white px-6 py-4 shadow-card"
    >
      {figures.map(([value, label]) => (
        <p key={label} className="m-0 flex items-baseline gap-2.5">
          <span className="text-card-title font-extrabold text-ink">
            {formatInt(value, locale)}
          </span>
          <span className="text-eyebrow font-bold uppercase tracking-[0.7px] text-text-tertiary">
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

/** §10 row 3 / W86: from the published founder row only (never the hero's hard-coded claims). */
function FounderStrip({
  founder,
  record,
  t,
}: {
  founder: Founder;
  record: Representative | null;
  t: T;
}) {
  return (
    <article
      data-testid="verify-founder"
      className="mb-6 flex flex-wrap items-center gap-6 rounded-lg border border-border-1 bg-white p-6 shadow-card-hover"
    >
      {/* W129: the slot owns its box; the wrapper sizes and rounds it. */}
      <div className="w-[84px] shrink-0 overflow-hidden rounded-pill ring-4 ring-tint">
        <ImageSlot
          slot="founder-photo"
          src={founder.photoSrc}
          alt={founder.name}
          width={84}
          height={84}
          sizes="84px"
        />
      </div>
      <div className="min-w-[240px] flex-1">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="m-0 text-card-title">{founder.name}</h3>
          <span className="rounded-pill bg-navy px-3 py-1 text-eyebrow font-extrabold uppercase tracking-[1.1px] text-white">
            {t('verify.060')}
          </span>
        </div>
        <p className="mt-1 mb-0 text-body-sm font-bold text-text-secondary">{t(founder.titleId)}</p>
        {record ? (
          <p className="mt-2 mb-0 flex flex-wrap items-center gap-2.5">
            {record.validUntil === null ? (
              <span className="inline-flex items-center gap-2 rounded-pill border border-success-border bg-success-surface px-3 py-1 text-body-sm font-extrabold text-success-text">
                <span aria-hidden="true" className="size-2 rounded-pill bg-success" />
                {t('verify.061')}
              </span>
            ) : null}
            <span className="text-body-sm font-extrabold text-text-tertiary">{record.id}</span>
          </p>
        ) : null}
      </div>
      <div className="flex max-w-[340px] flex-col items-end gap-2.5">
        {record ? (
          // V-1: a record's deep link is ?id= on this route.
          <Link
            href={{ pathname: '/verify', query: { id: record.id } }}
            prefetch={false}
            className={buttonClassName('secondary')}
          >
            {t('verify.062')}
          </Link>
        ) : null}
        <p className="m-0 text-right text-body-sm font-bold text-danger">{t('verify.063')}</p>
      </div>
    </article>
  );
}

/** The v1.1 register, minimal: one accessible row per active person with the design's four
 *  columns; the id links the record deep link (V-1). */
function RegisterList({ rows, t }: { rows: Representative[]; t: T }) {
  return (
    <div
      data-testid="verify-register"
      className="overflow-x-auto rounded-md border border-border-1 bg-white shadow-card"
    >
      <table className="w-full border-collapse text-left">
        <thead className="bg-pale-2 text-eyebrow font-extrabold uppercase tracking-[1.1px] text-text-tertiary">
          <tr>
            <th scope="col" className="px-6 py-2.5">
              {t('verify.068')}
            </th>
            <th scope="col" className="px-6 py-2.5">
              {t('verify.069')}
            </th>
            <th scope="col" className="px-6 py-2.5">
              {t('verify.070')}
            </th>
            <th scope="col" className="px-6 py-2.5">
              {t('verify.071')}
            </th>
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
      className="mt-4 flex flex-wrap items-center gap-3 rounded-sm border border-danger-border bg-danger-surface px-4 py-3"
    >
      <p className="m-0 text-eyebrow font-extrabold uppercase tracking-[1.2px] text-danger">
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
