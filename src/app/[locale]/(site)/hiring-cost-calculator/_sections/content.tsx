import type { ReactNode } from 'react';
import { ContactLink } from '@/analytics/ContactLink';
import { FaqBlock } from '@/design/blocks/FaqBlock';
import { buttonClassName } from '@/design/primitives/Button';
import { Tabs } from '@/design/primitives/Tabs';
import { Link } from '@/i18n/navigation';
import { sgkRateLabel, updatedAtLabel } from '@/lib/calculator';
import { formatInt, formatTRY } from '@/lib/format/money';
import { PassCheckLoader, QuotaLoader, SalaryGuideLoader } from '../_components/LazyBinders';
import { LiveSgkRate } from '../_components/LiveSgkRate';
import { BarLook, ChipsLook, StepperLook, TriStateLook } from '../_components/Lookalikes';
import { PassCheckView, RESET } from '../_components/PassCheckView';
import { QuotaView } from '../_components/QuotaView';
import { SalaryGuideView } from '../_components/SalaryGuideView';
import { Sentence, type Run } from '../_components/Sentence';
import { makePassCopy, makeQuotaCopy } from '../_lib/copy';
import { DEFAULT_INPUTS } from '../_lib/estimate-inputs';
import { computePassView, MANUAL_ROWS, type ManualRow } from '../_lib/pass-check';
import { computeQuotaView } from '../_lib/quota-view';
import { buildGuideRows, GUIDE_SCALE_MIN, guideScaleMax } from '../_lib/salary-guide';
import type { CalcCtx } from './context';
import { Dot, KICKER, KICKER_DARK, KICKER_SM, KICKER_SM_PALE, Lines, Note, Tick } from './ui';

/*
 * The section bodies of the Cost Calculator, in the design's order (Hiring Cost Calculator.dc.html
 * 755–1532). Server components: every package id through the context's `makeTf` (W1), every lira
 * through `formatTRY` (D18), every rate from `rateConfig` (D17), every glued design sentence
 * through `Sentence` (trimmed fragments, `_lib/fragments.ts`). Each island is mounted through its
 * `LazyIsland` binder with a DOM-matched server fallback built from the same view model (W132).
 * The design's phone-only variants are `md:hidden`, the desktop-only parts `max-md:hidden` —
 * both in the DOM (W10/W119). The design's decorative card icons are omitted (delta 9).
 */

const b = (text: string): Run => ({ b: text });

/* ---------- jump chips (design 755–764) ---------- */

const JUMP: readonly (readonly [string, string])[] = [
  ['#salaries', 'calc.054'],
  ['#quota', 'calc.055'],
  ['#incentives', 'calc.056'],
  ['#passcheck', 'calc.057'],
  ['#penalties', 'calc.058'],
  ['#faq', 'calc.059'],
];

export function JumpChips({ ctx }: { ctx: CalcCtx }) {
  const { t, sys } = ctx;
  return (
    <nav
      aria-label={sys('calc.jump.label')}
      data-testid="calc-jump"
      className="container-site pt-4 md:hidden"
    >
      <ul className="m-0 flex list-none gap-[7px] xl:gap-[5.25px] overflow-x-auto p-0 pb-0.5">
        {JUMP.map(([href, id]) => (
          <li key={href} className="flex-none">
            <a
              href={href}
              className="inline-flex min-h-10 items-center whitespace-nowrap rounded-pill border border-border-1 bg-pale-1 px-3.5 text-[13px] xl:text-[11px] font-extrabold text-ink no-underline"
            >
              {t(id)}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/* ---------- #basis (765–808) ---------- */

const BASIS_GRID =
  'grid gap-[18px] xl:gap-[13.5px] lg:grid-cols-4 max-md:gap-0 max-md:overflow-hidden max-md:rounded-sm max-md:border max-md:border-border-1 max-md:bg-white';
const BASIS_CARD =
  'rounded-md border border-border-2 bg-white px-[22px] xl:px-[16.5px] py-6 max-md:rounded-none max-md:border-0 max-md:border-t max-md:border-border-3 max-md:px-3.5 max-md:py-[13px] max-md:first:border-t-0';

export function Basis({ ctx }: { ctx: CalcCtx }) {
  const { t, locale, rateConfig } = ctx;
  const permits = t('calc.084');
  const cards: { title: string; body: ReactNode }[] = [
    { title: t('calc.078'), body: t('calc.079') },
    { title: t('calc.080'), body: t('calc.081') },
    {
      title: t('calc.082'),
      body: (
        <Sentence
          runs={[
            t('calc.083'),
            {
              // `/work-permit` is T4's page: no prefetch while it may still 404 (W20)
              node: (
                <Link
                  href="/work-permit"
                  prefetch={false}
                  className="font-bold text-blue-safe no-underline hover:underline"
                >
                  {permits}
                </Link>
              ),
              text: permits,
            },
          ]}
        />
      ),
    },
    { title: t('calc.085'), body: t('calc.086') },
  ];
  return (
    <>
      <div className={BASIS_GRID}>
        {cards.map((c) => (
          <div key={c.title} className={BASIS_CARD}>
            <h3 className="m-0 mb-1.5 text-body font-extrabold text-ink">{c.title}</h3>
            <p className="m-0 text-body-sm leading-[1.6] text-text-secondary">{c.body}</p>
          </div>
        ))}
      </div>
      <Note tone="amber" className="mt-[22px] xl:mt-[16.5px]">
        <Sentence runs={[b(t('calc.087')), t('calc.088')]} />
      </Note>
      {/* D17: the "last updated" date is rateConfig.updatedAt, never typed (design line 2617) */}
      <p
        data-testid="calc-updated"
        className="m-0 mt-[18px] xl:mt-[13.5px] flex flex-wrap items-center justify-center gap-2.5 text-body-sm text-text-tertiary max-md:justify-start"
      >
        <span className="inline-flex items-center rounded-pill border border-tint-border bg-white px-[15px] xl:px-[11.25px] py-1.5 font-bold text-text-secondary">
          <Sentence runs={[t('calc.089'), b(updatedAtLabel(rateConfig, locale))]} />
        </span>
        <span>{t('calc.090')}</span>
      </p>
    </>
  );
}

/* ---------- #salaries (810–871): the legend, the guide island, the footnote ---------- */

export function Salaries({ ctx }: { ctx: CalcCtx }) {
  const { t, locale, rateConfig, roles, roleLabels, industryLabels, labels } = ctx;
  const guide = labels.guide;
  const scaleMin = formatTRY(GUIDE_SCALE_MIN, locale);
  const scaleMax = roles.length > 0 ? formatTRY(guideScaleMax(roles), locale) : '';
  // the island builds the same list (SalaryGuideIsland) — the fallback's chips match it
  const filterOptions = [
    { value: 'all', label: guide.allInd },
    ...[...new Set(roles.map((r) => r.industry))].map((i) => ({
      value: i,
      label: industryLabels[i] ?? i,
    })),
  ];
  return (
    <>
      <ul className="m-0 mb-[22px] xl:mb-[16.5px] flex list-none flex-wrap items-center gap-[18px] xl:gap-[13.5px] p-0 text-[12.5px] font-bold text-text-secondary xl:text-[11px]">
        <li className="inline-flex items-center gap-[7px] xl:gap-[5.25px]">
          <span
            aria-hidden="true"
            className="h-[7px] w-[22px] rounded-pill bg-[linear-gradient(90deg,#1899d5_0%,#5cc0ef_100%)]"
          />
          {t('calc.093')}
        </li>
        <li className="inline-flex items-center gap-[7px] xl:gap-[5.25px]">
          <span aria-hidden="true" className="h-[13px] w-0.5 bg-ink" />
          <Sentence runs={[t('calc.094'), formatTRY(rateConfig.legalMinGross, locale)]} />
        </li>
        <li className="inline-flex items-center gap-[7px] xl:gap-[5.25px]">
          <span
            aria-hidden="true"
            className="h-[9px] w-[9px] rounded-[3px] border border-success-border bg-success-surface"
          />
          {t('calc.095')}
        </li>
      </ul>
      {roles.length > 0 ? (
        <SalaryGuideLoader
          locale={locale}
          roles={roles}
          rateConfig={rateConfig}
          labels={guide}
          roleLabels={roleLabels}
          industryLabels={industryLabels}
          scaleMin={scaleMin}
          scaleMax={scaleMax}
          fallback={
            <SalaryGuideView
              rows={buildGuideRows({
                roles,
                rateConfig,
                tier: DEFAULT_INPUTS.sgkTier,
                locale,
                roleLabels,
                industryLabels,
                labels: { skilled: guide.skilled, standard: guide.standard },
              })}
              activeKey={DEFAULT_INPUTS.roleKey}
              labels={guide}
              scaleMin={scaleMin}
              scaleMax={scaleMax}
              filter={<ChipsLook options={filterOptions} value="all" />}
              live={false}
            />
          }
        />
      ) : null}
      <p className="m-0 mt-5 rounded-sm border border-border-2 bg-white px-[22px] xl:px-[16.5px] py-4 text-body-sm leading-[1.6] text-text-tertiary max-md:mt-2.5 max-md:px-3.5 max-md:py-[13px]">
        <Sentence runs={[b(t('calc.098')), t('calc.099')]} />
      </p>
    </>
  );
}

/* ---------- #compare (873–1022) ---------- */

const CELL =
  'px-7 py-[17px] xl:py-[12.75px] text-[14.5px] leading-[1.6] text-text-secondary xl:text-[11px]';
const LT_BOX = 'rounded-sm border border-border-2 bg-pale-2 px-5 py-[18px] xl:py-[13.5px]';
const LT_BODY = 'm-0 text-body-sm leading-[1.6] text-text-secondary';
const LADDER = {
  blue: 'rounded-[8px] bg-tint px-[9px] xl:px-[6.75px] py-1.5 text-[12.5px] xl:text-[11px] font-extrabold text-blue-safe',
  green:
    'rounded-[8px] bg-success-surface px-[9px] xl:px-[6.75px] py-1.5 text-[12.5px] xl:text-[11px] font-extrabold text-success-text',
} as const;
const SPREAD_VALUE = {
  once: 'm-0 text-[26px] font-extrabold tracking-[-0.6px] xl:tracking-[-0.45px] text-white xl:text-[19.5px]',
  year: 'm-0 text-[26px] font-extrabold tracking-[-0.6px] xl:tracking-[-0.45px] text-sky xl:text-[19.5px]',
  three:
    'm-0 text-[26px] font-extrabold tracking-[-0.6px] xl:tracking-[-0.45px] text-[#6fe0a3] xl:text-[19.5px]',
} as const;

export function Compare({ ctx }: { ctx: CalcCtx }) {
  const { t, locale, rateConfig } = ctx;
  const rows: [string, Run[], Run[]][] = [
    ['calc.195', [t('calc.196'), b(t('calc.197'))], [t('calc.198'), b(t('calc.199'))]],
    ['calc.200', [t('calc.201')], [b(t('calc.202')), t('calc.203')]],
    ['calc.204', [t('calc.205')], [b(t('calc.206')), t('calc.207')]],
    ['calc.208', [t('calc.209')], [b(t('calc.210')), t('calc.211')]],
    ['calc.212', [t('calc.213')], [b(t('calc.214')), t('calc.215')]],
    ['calc.216', [t('calc.217')], [t('calc.218'), b(t('calc.219')), t('calc.220')]],
    ['calc.221', [t('calc.222')], [t('calc.223'), b(t('calc.224'))]],
  ];
  const benefits: [string, string][] = [
    ['calc.250', 'calc.251'],
    ['calc.252', 'calc.253'],
    ['calc.254', 'calc.255'],
    ['calc.256', 'calc.257'],
    ['calc.258', 'calc.259'],
  ];
  // D17 / delta 6: the long-term spread is the DEFAULT one-off per worker (permit + flight from
  // rateConfig) — not the live flight toggle, which the design reads.
  const oneOff = rateConfig.permitFeeTRY + rateConfig.flightTRY;
  const perMonth = t('calc.465');
  return (
    <>
      <div data-testid="calc-compare-mobile" className="md:hidden">
        <div className="mb-2.5 rounded-sm bg-navy p-[15px] xl:p-[11.25px]">
          <p className={KICKER_DARK}>{t('calc.242')}</p>
          <p className="m-0 text-[15.5px] xl:text-[11.625px] font-bold leading-[1.45] text-white">
            <Sentence
              runs={[t('calc.243'), b(t('calc.244')), t('calc.245')]}
              strong="font-extrabold text-sky"
            />
          </p>
        </div>
        <div className="mb-2.5 rounded-sm border border-border-1 bg-white px-3.5 py-[13px] xl:py-[9.75px]">
          <p className={KICKER_SM}>{t('calc.246')}</p>
          <p className="m-0 flex flex-wrap items-baseline gap-[9px] xl:gap-[6.75px]">
            <span className="text-[19px] xl:text-[14.25px] font-extrabold tracking-[-0.4px] xl:tracking-[-0.3px] text-ink">
              {t('calc.411')}
            </span>
            <span className="text-[12.5px] xl:text-[11px] font-bold text-text-tertiary">
              {t('calc.247')}
            </span>
          </p>
          <p className="m-0 mt-1.5 text-[13px] xl:text-[11px] leading-[1.5] text-text-tertiary">
            {t('calc.248')}
          </p>
        </div>
        <div className="rounded-sm border border-border-1 bg-white px-3.5 pt-[13px] xl:pt-[9.75px] pb-1">
          <p className={KICKER_SM}>{t('calc.249')}</p>
          <ul className="m-0 list-none p-0">
            {benefits.map(([strong, rest]) => (
              <li
                key={strong}
                className="grid grid-cols-[22px_1fr] items-start gap-x-2.5 border-t border-border-3 py-[11px] xl:py-[8.25px]"
              >
                <Tick />
                <span className="min-w-0 text-[13.5px] xl:text-[11px] leading-[1.5] text-text-secondary">
                  <Sentence runs={[b(t(strong)), t(rest)]} />
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* delta 9: a real table — the row label in the middle column, the "VS" badge in the header */}
      <div className="mx-auto max-w-[1080px] overflow-hidden rounded-xl border border-border-1 bg-white shadow-[0_18px_48px_rgba(22,60,90,0.10)] max-md:hidden xl:max-w-[810px]">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr>
              <th
                scope="col"
                className="border-b border-border-3 bg-pale-1 px-7 py-[22px] xl:py-[16.5px] align-top"
              >
                <span className="mb-[5px] xl:mb-[3.75px] block text-eyebrow font-extrabold uppercase tracking-[1.2px] xl:tracking-[0.9px] text-text-secondary">
                  {t('calc.191')}
                </span>
                <span className="block text-[20px] font-extrabold leading-[1.2] text-ink xl:text-[15px]">
                  {t('calc.192')}
                </span>
              </th>
              <td className="w-[150px] border-b border-border-3 bg-ink text-center align-middle xl:w-[112px]">
                <span
                  aria-hidden="true"
                  className="inline-grid h-12 w-12 place-items-center rounded-pill bg-white text-[14px] font-extrabold tracking-[0.5px] text-ink before:content-['VS'] xl:h-9 xl:w-9 xl:text-[11px]"
                />
              </td>
              {/* D20: the design's #1899D5 → #1073a8 gradient starts at blue-safe for white text */}
              <th
                scope="col"
                className="border-b border-border-3 bg-[linear-gradient(135deg,#1073a8_0%,#0b5d88_100%)] px-7 py-[22px] xl:py-[16.5px] text-right align-top"
              >
                <span className="mb-[5px] xl:mb-[3.75px] block text-eyebrow font-extrabold uppercase tracking-[1.2px] xl:tracking-[0.9px] text-white">
                  {t('calc.193')}
                </span>
                <span className="block text-[20px] font-extrabold leading-[1.2] text-white xl:text-[15px]">
                  {t('calc.194')}
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([labelId, optionA, optionB], i) => (
              <tr
                key={labelId}
                className={i < rows.length - 1 ? 'border-b border-border-3' : undefined}
              >
                <td className={CELL}>
                  <Sentence runs={optionA} />
                </td>
                <th
                  scope="row"
                  className="border-x border-border-3 bg-pale-2 px-2.5 text-center text-[11.5px] font-extrabold uppercase tracking-[0.8px] xl:tracking-[0.6px] text-text-tertiary xl:text-[11px]"
                >
                  {t(labelId)}
                </th>
                <td className={`${CELL} text-right`}>
                  <Sentence runs={optionB} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div
        data-testid="calc-longterm"
        className="mx-auto mt-[26px] xl:mt-[19.5px] max-w-[1080px] rounded-xl border border-border-1 bg-white px-[34px] py-8 shadow-[0_18px_48px_rgba(22,60,90,0.10)] max-md:mt-3 max-md:rounded-sm max-md:p-[15px] max-md:shadow-none xl:max-w-[810px] xl:px-[25.5px] xl:py-6"
      >
        <h3 className="m-0 mb-2 text-[22px] font-extrabold tracking-[-0.4px] xl:tracking-[-0.3px] text-ink max-md:text-[18px] xl:text-[16.5px]">
          {t('calc.225')}
        </h3>
        <p className="m-0 mb-6 max-w-[780px] text-[15px] leading-[1.65] text-text-tertiary max-md:mb-3.5 max-md:text-[13.5px] max-md:leading-[1.55] xl:text-[11.25px]">
          {t('calc.226')}
        </p>
        <div className="mb-[22px] xl:mb-[16.5px] grid gap-4 lg:grid-cols-3">
          <div className={LT_BOX}>
            <p className={KICKER_SM}>{t('calc.227')}</p>
            <p className="m-0 mb-2.5 flex flex-wrap items-center gap-1.5">
              <span className={LADDER.blue}>{t('calc.228')}</span>
              <span aria-hidden="true" className="font-extrabold text-text-tertiary">
                →
              </span>
              <span className={LADDER.blue}>{t('calc.229')}</span>
              <span aria-hidden="true" className="font-extrabold text-text-tertiary">
                →
              </span>
              <span className={LADDER.green}>{t('calc.230')}</span>
            </p>
            <p className={LT_BODY}>{t('calc.231')}</p>
          </div>
          <div className={LT_BOX}>
            <p className={KICKER_SM}>{t('calc.232')}</p>
            <p className={LT_BODY}>{t('calc.233')}</p>
          </div>
          <div className={LT_BOX}>
            <p className={KICKER_SM}>{t('calc.234')}</p>
            <p className={LT_BODY}>{t('calc.235')}</p>
          </div>
        </div>
        <div
          data-testid="calc-spread"
          className="rounded-base bg-[linear-gradient(135deg,#16202e_0%,#253063_100%)] px-[26px] xl:px-[19.5px] py-6 text-white max-md:px-[15px] max-md:py-4"
        >
          <p className="m-0 mb-3.5 text-[11.5px] xl:text-[11px] font-extrabold uppercase tracking-[1px] xl:tracking-[0.75px] text-white/80">
            {t('calc.236')}
          </p>
          <div className="grid items-end gap-[18px] xl:gap-[13.5px] lg:grid-cols-3">
            <div>
              <p className={SPREAD_VALUE.once}>{formatTRY(oneOff, locale)}</p>
              <p className="m-0 mt-[3px] xl:mt-[2.25px] text-[13px] xl:text-[11px] text-white/75">
                {t('calc.237')}
              </p>
            </div>
            <div>
              <p className={SPREAD_VALUE.year}>{`${formatTRY(oneOff / 12, locale)} ${perMonth}`}</p>
              <p className="m-0 mt-[3px] xl:mt-[2.25px] text-[13px] xl:text-[11px] text-white/75">
                {t('calc.238')}
              </p>
            </div>
            <div>
              <p
                className={SPREAD_VALUE.three}
              >{`${formatTRY(oneOff / 36, locale)} ${perMonth}`}</p>
              <p className="m-0 mt-[3px] xl:mt-[2.25px] text-[13px] xl:text-[11px] text-white/75">
                {t('calc.239')}
              </p>
            </div>
          </div>
          <p className="m-0 mt-[18px] xl:mt-[13.5px] border-t border-white/15 pt-4 text-body-sm leading-[1.6] text-white/80">
            {t('calc.240')}
          </p>
        </div>
      </div>
      <p className="mx-auto mt-[26px] xl:mt-[19.5px] mb-0 max-w-[680px] text-center text-body-sm leading-[1.6] text-text-tertiary max-md:hidden">
        {t('calc.241')}
      </p>
    </>
  );
}

/* ---------- #quota (1024–1177): Gate 1 island, the rule and Gate 2 cards, the exemptions ---------- */

/** value / label / phone value / phone label (Gate 2's three company criteria, 370–375). */
const CRITERIA: readonly (readonly [string, string, string, string])[] = [
  ['calc.370', 'calc.167', 'calc.373', 'calc.185'],
  ['calc.371', 'calc.168', 'calc.374', 'calc.186'],
  ['calc.372', 'calc.169', 'calc.375', 'calc.187'],
];

type ExRow = readonly [titleId: string, bodyId: string, badge: string];

/** The exemptions panel (1150–1175): three tabs (`Tabs`, the page's one eager primitive island),
 *  each row with its badge — two from the package (calc.549/550), seven from
 *  `sys.calc.exemptions.*` (the design keeps them in its script only). */
function Exemptions({ ctx }: { ctx: CalcCtx }) {
  const { t, sys } = ctx;
  const badge = {
    tenStaff: sys('calc.exemptions.tenStaff'),
    twentyStaff: sys('calc.exemptions.twentyStaff'),
    upTo5: sys('calc.exemptions.upTo5'),
    full: sys('calc.exemptions.full'),
    timing: sys('calc.exemptions.timing'),
    upTo3: sys('calc.exemptions.upTo3'),
    exceptional: sys('calc.exemptions.exceptional'),
  };
  const groups: { id: string; tabId: string; introId: string; rows: ExRow[] }[] = [
    {
      id: 'sector',
      tabId: 'calc.430',
      introId: 'calc.510',
      rows: [
        ['calc.513', 'calc.514', t('calc.549')],
        ['calc.515', 'calc.516', badge.tenStaff],
        ['calc.517', 'calc.518', badge.tenStaff],
        ['calc.519', 'calc.520', badge.twentyStaff],
        ['calc.521', 'calc.522', t('calc.550')],
      ],
    },
    {
      id: 'company',
      tabId: 'calc.431',
      introId: 'calc.511',
      rows: [
        ['calc.523', 'calc.524', badge.upTo5],
        ['calc.525', 'calc.526', badge.full],
        ['calc.527', 'calc.528', badge.full],
        ['calc.529', 'calc.530', badge.timing],
      ],
    },
    {
      id: 'person',
      tabId: 'calc.432',
      introId: 'calc.512',
      rows: [
        ['calc.531', 'calc.532', badge.upTo3],
        ['calc.533', 'calc.534', badge.exceptional],
        ['calc.535', 'calc.536', badge.exceptional],
        ['calc.537', 'calc.538', badge.exceptional],
        ['calc.539', 'calc.540', badge.exceptional],
      ],
    },
  ];
  const panel = (introId: string, rows: ExRow[]) => (
    <>
      <p className="m-0 mb-4 text-body-sm leading-[1.6] text-text-tertiary max-md:mb-3 max-md:text-[13px]">
        {t(introId)}
      </p>
      <ul className="m-0 grid list-none gap-x-[30px] xl:gap-x-[22.5px] gap-y-3 p-0 lg:grid-cols-2">
        {rows.map(([titleId, bodyId, text]) => (
          <li
            key={titleId}
            className="flex items-start gap-[13px] xl:gap-[9.75px] border-b border-border-3 pb-3"
          >
            <Tick />
            <div className="min-w-0">
              <p className="m-0 mb-[3px] xl:mb-[2.25px] flex flex-wrap items-center gap-2">
                <span className="text-[15px] font-extrabold text-ink max-md:text-[14.5px] xl:text-[11.25px]">
                  {t(titleId)}
                </span>
                <span className="whitespace-nowrap rounded-pill border border-border-2 bg-pale-1 px-[9px] xl:px-[6.75px] py-0.5 text-[11px] xl:text-[11px] font-extrabold text-blue-safe">
                  {text}
                </span>
              </p>
              <p className="m-0 text-[14px] leading-[1.6] text-text-secondary max-md:text-[13px] max-md:leading-[1.5] xl:text-[11px]">
                {t(bodyId)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
  return (
    <div
      data-testid="calc-exemptions"
      className="mt-7 overflow-hidden rounded-lg border border-tint-border bg-white max-md:mt-2.5 max-md:rounded-sm"
    >
      <p className="m-0 border-b border-border-3 bg-pale-2 px-[26px] xl:px-[19.5px] py-4 text-eyebrow font-extrabold uppercase tracking-[1px] xl:tracking-[0.75px] text-text-tertiary max-md:px-3.5 max-md:py-3">
        {t('calc.172')}
      </p>
      <div className="px-[26px] xl:px-[19.5px] py-[22px] xl:py-[16.5px] max-md:px-3.5 max-md:py-[15px]">
        <Tabs
          defaultId="sector"
          tabs={groups.map((g) => ({
            id: g.id,
            label: t(g.tabId),
            panel: panel(g.introId, g.rows),
          }))}
        />
        <p className="m-0 mt-1.5 text-body-sm leading-[1.6] text-text-tertiary">
          <Sentence runs={[b(t('calc.173')), t('calc.174')]} />
        </p>
      </div>
    </div>
  );
}

export function Quota({ ctx }: { ctx: CalcCtx }) {
  const { t, sys, locale, rateConfig, labels } = ctx;
  const quota = labels.quota;
  const ratio = rateConfig.quotaRatio;
  // The island's first render: 25 staff, 1 planned (the design defaults), every number over
  // rateConfig.quotaRatio — calc.558's wording at the model figures (W142).
  const view = computeQuotaView({
    staff: DEFAULT_INPUTS.turkishStaff,
    headcount: DEFAULT_INPUTS.headcount,
    ratio,
    locale,
    labels: quota,
    copy: makeQuotaCopy(sys),
  });
  const stepper = <StepperLook value={formatInt(DEFAULT_INPUTS.turkishStaff, locale)} />;
  const fallback = (variant: 'mobile' | 'desktop') => (
    <QuotaView variant={variant} view={view} labels={quota} stepper={stepper} live={false} />
  );
  return (
    <>
      {/* design .ja-q-mob: step 1 + answer (the island), why, step 2 */}
      <div className="md:hidden">
        <QuotaLoader
          variant="mobile"
          locale={locale}
          quotaRatio={ratio}
          labels={quota}
          fallback={fallback('mobile')}
        />
        <div className="mb-2.5 rounded-sm border border-border-1 bg-pale-1 px-3.5 py-[13px] xl:py-[9.75px]">
          <p className={KICKER_SM_PALE}>{t('calc.178')}</p>
          <p className="m-0 text-[13.5px] xl:text-[11px] leading-[1.55] text-text-secondary">
            <Sentence runs={[b(t('calc.179')), t('calc.180')]} />
          </p>
        </div>
        <div className="rounded-sm border border-border-1 bg-white px-3.5 py-[13px] xl:py-[9.75px]">
          <p className={KICKER_SM}>{t('calc.181')}</p>
          <p className="m-0 mb-2.5 text-[13.5px] xl:text-[11px] leading-[1.55] text-text-secondary">
            <Sentence runs={[t('calc.182'), b(t('calc.183')), t('calc.184')]} />
          </p>
          <ul className="m-0 grid list-none grid-cols-3 gap-[7px] xl:gap-[5.25px] p-0">
            {CRITERIA.map(([, , value, label]) => (
              <li
                key={value}
                className="rounded-[11px] border border-border-3 bg-pale-3 px-[9px] xl:px-[6.75px] py-2.5"
              >
                <span className="block text-[14px] xl:text-[11px] font-extrabold tracking-[-0.3px] xl:tracking-[-0.225px] text-ink">
                  {t(value)}
                </span>
                <span className="mt-0.5 block text-[11.5px] xl:text-[11px] leading-[1.35] text-text-tertiary">
                  {t(label)}
                </span>
              </li>
            ))}
          </ul>
          <p className="m-0 mt-2.5 text-[12.5px] xl:text-[11px] leading-[1.5] text-text-tertiary">
            {t('calc.188')}
          </p>
        </div>
      </div>
      <div className="grid items-start gap-7 max-md:hidden lg:grid-cols-[1.05fr_0.95fr]">
        <QuotaLoader
          variant="desktop"
          locale={locale}
          quotaRatio={ratio}
          labels={quota}
          fallback={fallback('desktop')}
        />
        <div className="flex flex-col gap-5">
          <div className="rounded-lg border border-tint-border bg-white px-[26px] xl:px-[19.5px] py-6">
            <p className={KICKER}>{t('calc.150')}</p>
            <p className="m-0 mb-[18px] xl:mb-[13.5px] text-[15px] leading-[1.65] text-text-secondary xl:text-[11.25px]">
              <Sentence runs={[t('calc.151'), b(t('calc.152')), t('calc.153')]} />
            </p>
            <ul className="m-0 flex list-none flex-col gap-[11px] xl:gap-[8.25px] p-0">
              {(
                [
                  ['calc.154', 'calc.155', 'calc.156'],
                  ['calc.157', 'calc.158', 'calc.159'],
                  ['calc.160', 'calc.161', 'calc.162'],
                ] as const
              ).map(([lead, strong, tail]) => (
                <li key={strong} className="flex items-start gap-[11px] xl:gap-[8.25px]">
                  <Dot tone="blue" />
                  <span className="text-[14px] leading-[1.6] text-text-secondary xl:text-[11px]">
                    {/* calc.154/157 are deliberately empty in Turkish — Sentence drops them */}
                    <Sentence runs={[t(lead), b(t(strong)), t(tail)]} />
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-tint-border bg-pale-2 px-[26px] xl:px-[19.5px] py-6">
            <p className={KICKER}>{t('calc.163')}</p>
            <p className="m-0 mb-4 text-[15px] leading-[1.65] text-text-secondary xl:text-[11.25px]">
              <Sentence runs={[t('calc.164'), b(t('calc.165')), t('calc.166')]} />
            </p>
            <ul className="m-0 grid list-none grid-cols-3 gap-2.5 p-0">
              {CRITERIA.map(([value, label]) => (
                <li
                  key={value}
                  className="rounded-xs border border-border-2 bg-white px-3.5 py-[13px] xl:py-[9.75px]"
                >
                  <span className="block text-[16.5px] font-extrabold tracking-[-0.3px] xl:tracking-[-0.225px] text-ink xl:text-[12.4px]">
                    {t(value)}
                  </span>
                  <span className="mt-[3px] xl:mt-[2.25px] block text-[12px] leading-[1.45] text-text-tertiary xl:text-[11px]">
                    {t(label)}
                  </span>
                </li>
              ))}
            </ul>
            <p className="m-0 mt-3 text-[12.5px] leading-[1.55] text-text-tertiary xl:text-[11px]">
              <Sentence
                runs={[
                  t('calc.170'),
                  {
                    node: (
                      <a
                        href="#passcheck"
                        className="font-extrabold text-blue-safe no-underline hover:underline"
                      >
                        {t('calc.171')}
                      </a>
                    ),
                    text: t('calc.171'),
                  },
                ]}
              />
            </p>
          </div>
        </div>
      </div>
      <Exemptions ctx={ctx} />
    </>
  );
}

/* ---------- #passcheck (1179–1242) ---------- */

export function PassCheck({ ctx }: { ctx: CalcCtx }) {
  const { sys, locale, rateConfig, roles, roleLabels, labels, settings } = ctx;
  if (roles.length === 0) return null;
  const pass = labels.pass;
  // The island's first render: nothing answered, the quota row from the defaults (calc.559/561).
  const view = computePassView({
    answers: {},
    inputs: DEFAULT_INPUTS,
    roles,
    rateConfig,
    locale,
    roleLabels,
    labels: pass,
    copy: makePassCopy(sys),
  });
  const controls = Object.fromEntries(
    MANUAL_ROWS.map((row) => [
      row,
      <TriStateLook key={row} labels={[pass.pcYes, pass.pcNo, pass.pcMaybe]} />,
    ]),
  ) as Record<ManualRow, ReactNode>;
  return (
    <PassCheckLoader
      locale={locale}
      rateConfig={rateConfig}
      roles={roles}
      roleLabels={roleLabels}
      labels={pass}
      whatsappNumber={settings.whatsappNumber}
      fallback={
        <PassCheckView
          view={view}
          labels={pass}
          live={false}
          controls={controls}
          reset={
            <button type="button" className={`${RESET} invisible`}>
              {pass.pcReset}
            </button>
          }
          bar={
            <BarLook label={pass.vRes} valueText={view.count} pct={view.progressPct} tone="blue" />
          }
          send={
            // Before the island arrives: the bare chat, tracked (W95 — nothing to compose yet)
            <ContactLink
              href={`https://wa.me/${settings.whatsappNumber}`}
              placement="page_cta"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="pass-send"
              className={buttonClassName('success', 'lg', 'w-full')}
            >
              {pass.pcSend}
            </ContactLink>
          }
        />
      }
    />
  );
}

/* ---------- #incentives (1244–1338) ---------- */

const INC = {
  blue: {
    card: 'flex flex-col rounded-md border-[1.5px] border-tint-border bg-white px-6 py-[26px] xl:py-[19.5px]',
    badge:
      'mb-3.5 self-end rounded-pill border border-tint-border bg-tint px-2.5 py-[3px] xl:py-[2.25px] text-[10.5px] font-extrabold uppercase tracking-[0.6px] xl:tracking-[0.45px] text-blue-safe xl:text-[11px]',
    sub: 'm-0 mb-2 text-[13px] xl:text-[11px] font-extrabold text-blue-safe',
  },
  green: {
    card: 'flex flex-col rounded-md border-[1.5px] border-success-border bg-white px-6 py-[26px] xl:py-[19.5px]',
    badge:
      'mb-3.5 self-end rounded-pill border border-success-border bg-success-surface px-2.5 py-[3px] xl:py-[2.25px] text-[10.5px] font-extrabold uppercase tracking-[0.6px] xl:tracking-[0.45px] text-success-text xl:text-[11px]',
    sub: 'm-0 mb-2 text-[13px] xl:text-[11px] font-extrabold text-success-text',
  },
  plain: {
    card: 'flex flex-col rounded-md border border-border-2 bg-white px-6 py-[26px] xl:py-[19.5px]',
    badge:
      'mb-3.5 self-end rounded-pill border border-border-2 bg-pale-1 px-2.5 py-[3px] xl:py-[2.25px] text-[10.5px] font-extrabold uppercase tracking-[0.6px] xl:tracking-[0.45px] text-text-secondary xl:text-[11px]',
    sub: 'm-0 mb-2 text-[13px] xl:text-[11px] font-extrabold text-[#253063]',
  },
} as const;

function IncentiveCard({
  tone,
  badge,
  title,
  sub,
  body,
  foot,
}: {
  tone: keyof typeof INC;
  badge: string;
  title: string;
  sub: string;
  body: string;
  foot: ReactNode;
}) {
  const c = INC[tone];
  return (
    <div className={c.card}>
      <span className={c.badge}>{badge}</span>
      <h3 className="m-0 mb-1 text-[17px] font-extrabold text-ink xl:text-[12.75px]">{title}</h3>
      <p className={c.sub}>{sub}</p>
      <p className="m-0 mb-3.5 text-[14px] leading-[1.6] text-text-secondary xl:text-[11px]">
        {body}
      </p>
      <div className="mt-auto border-t border-border-3 pt-3.5 text-[13.5px] xl:text-[11px] leading-[1.55] text-text-tertiary">
        {foot}
      </div>
    </div>
  );
}

export function Incentives({ ctx }: { ctx: CalcCtx }) {
  const { t, locale, rateConfig } = ctx;
  // D17: the three percentages come from rateConfig.sgkRates (calc.415–417 are not rendered);
  // the design's typed "₺12.700" is 10 × supportMonthly through formatTRY (D18).
  const rates = {
    manufacturing: sgkRateLabel(rateConfig, 'manufacturing', locale),
    other: sgkRateLabel(rateConfig, 'other', locale),
    none: sgkRateLabel(rateConfig, 'none', locale),
  };
  const tenWorkers = formatTRY(10 * rateConfig.supportMonthly, locale);
  return (
    <>
      <div data-testid="calc-incentives-mobile" className="md:hidden">
        <div className="mb-2.5 rounded-sm bg-navy p-[15px] xl:p-[11.25px]">
          <p className={KICKER_DARK}>{t('calc.357')}</p>
          <ul className="m-0 flex list-none flex-col gap-[9px] xl:gap-[6.75px] p-0">
            <li className="flex items-start gap-2.5">
              <Tick dark />
              <span className="min-w-0 text-[13.5px] xl:text-[11px] leading-[1.5] text-white/85">
                {/* the rate the calculator holds, live (LiveSgkRate reads the shared store) */}
                <Sentence
                  runs={[
                    b(t('calc.358')),
                    t('calc.359'),
                    { node: <LiveSgkRate rates={rates} />, text: rates.other },
                    t('calc.360'),
                  ]}
                  strong="font-extrabold text-white"
                />
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <Tick dark />
              <span className="min-w-0 text-[13.5px] xl:text-[11px] leading-[1.5] text-white/85">
                <Sentence
                  runs={[b(t('calc.361')), t('calc.362')]}
                  strong="font-extrabold text-white"
                />
              </span>
            </li>
          </ul>
        </div>
        <div className="mb-2.5 rounded-sm border border-border-1 bg-white px-3.5 py-[13px] xl:py-[9.75px]">
          <p className={KICKER_SM}>{t('calc.363')}</p>
          <p className="m-0 text-[13.5px] xl:text-[11px] leading-[1.55] text-text-secondary">
            <Sentence runs={[b(t('calc.364')), t('calc.365')]} />
          </p>
        </div>
        <div className="rounded-sm border border-warning-border bg-warning-surface px-3.5 py-[13px] xl:py-[9.75px]">
          <p className="m-0 mb-[7px] xl:mb-[5.25px] text-[11px] xl:text-[11px] font-extrabold uppercase tracking-[1.1px] xl:tracking-[0.825px] text-warning-text">
            {t('calc.366')}
          </p>
          <p className="m-0 text-[13.5px] xl:text-[11px] leading-[1.55] text-[#7a5210]">
            {/* calc.367 is deliberately empty in Turkish */}
            <Sentence runs={[t('calc.367'), b(t('calc.368')), t('calc.369')]} />
          </p>
        </div>
      </div>
      <div className="max-md:hidden">
        <div className="mb-5 grid gap-5 lg:grid-cols-3">
          <IncentiveCard
            tone="blue"
            badge={t('calc.388')}
            title={t('calc.330')}
            sub={t('calc.331')}
            body={t('calc.341')}
            foot={
              <dl data-testid="calc-sgk-rates" className="m-0 flex flex-col gap-1.5">
                {(
                  [
                    ['calc.385', rates.none, false],
                    ['calc.386', rates.other, false],
                    ['calc.387', rates.manufacturing, true],
                  ] as const
                ).map(([id, value, lowest]) => (
                  <div key={id} className="flex justify-between gap-2.5">
                    <dt>{t(id)}</dt>
                    <dd
                      className={
                        lowest
                          ? 'm-0 font-extrabold text-success-text'
                          : 'm-0 font-extrabold text-ink'
                      }
                    >
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            }
          />
          <IncentiveCard
            tone="green"
            badge={t('calc.388')}
            title={t('calc.332')}
            sub={t('calc.337')}
            body={t('calc.338')}
            foot={
              <Sentence
                runs={[t('calc.339'), b(tenWorkers), t('calc.340')]}
                strong="font-extrabold text-success-text"
              />
            }
          />
          <IncentiveCard
            tone="plain"
            badge={t('calc.389')}
            title={t('calc.333')}
            sub={t('calc.334')}
            body={t('calc.335')}
            foot={t('calc.336')}
          />
        </div>
        <div className="mb-5 rounded-md border border-border-2 bg-white px-7 py-[26px] xl:py-[19.5px]">
          <h3 className="m-0 mb-4 text-[18px] font-extrabold text-ink xl:text-[13.5px]">
            {/* TR: "Devletin öde" + "mediği" + "şeyler" — the suffix stays glued (fragments.ts) */}
            <Sentence
              runs={[t('calc.342'), { em: t('calc.343') }, t('calc.344')]}
              em="not-italic underline decoration-warning-border decoration-[3px] underline-offset-[3px]"
            />
          </h3>
          <div className="grid gap-x-[34px] xl:gap-x-[25.5px] gap-y-[22px] xl:gap-y-[16.5px] lg:grid-cols-2">
            {(
              [
                ['calc.345', 'calc.346'],
                ['calc.347', 'calc.348'],
                ['calc.349', 'calc.350'],
                ['calc.351', 'calc.352'],
              ] as const
            ).map(([title, body]) => (
              <div key={title}>
                <p className="m-0 mb-[5px] xl:mb-[3.75px] text-[15px] font-extrabold text-ink xl:text-[11.25px]">
                  {t(title)}
                </p>
                <p className="m-0 text-[14px] leading-[1.6] text-text-secondary xl:text-[11px]">
                  {t(body)}
                </p>
              </div>
            ))}
          </div>
          <p className="m-0 mt-[18px] xl:mt-[13.5px] border-t border-border-3 pt-4 text-[14px] leading-[1.6] text-text-secondary xl:text-[11px]">
            <Sentence runs={[b(t('calc.353')), t('calc.354')]} />
          </p>
        </div>
        <Note tone="amber">
          <Sentence runs={[b(t('calc.355')), t('calc.356')]} />
        </Note>
      </div>
    </>
  );
}

/* ---------- #penalties (1340–1397) ---------- */

const FINE_ROW = 'flex items-baseline justify-between gap-3 py-[11px] xl:py-[8.25px]';
const FINE_CARD =
  'rounded-md border-[1.5px] border-warning-border bg-warning-surface px-7 py-[26px] xl:py-[19.5px]';
const CONSEQUENCES =
  'mx-auto mt-5 grid max-w-[1080px] list-none gap-4 p-0 lg:grid-cols-3 max-md:mt-0 max-md:gap-0 max-md:overflow-hidden max-md:rounded-sm max-md:border max-md:border-border-1 max-md:bg-white xl:max-w-[810px]';
const CONSEQUENCE =
  'rounded-sm border border-border-2 bg-white px-[22px] xl:px-[16.5px] py-5 max-md:rounded-none max-md:border-0 max-md:border-t max-md:border-border-3 max-md:px-3.5 max-md:py-3 max-md:first:border-t-0';

export function Penalties({ ctx }: { ctx: CalcCtx }) {
  const { t } = ctx;
  const fine = (kicker: string, amount: string, body: Run[]) => (
    <div className={FINE_CARD}>
      <p className="m-0 mb-2.5 text-eyebrow font-extrabold uppercase tracking-[1px] xl:tracking-[0.75px] text-warning-text">
        {t(kicker)}
      </p>
      <p className="m-0 mb-2 text-[34px] font-extrabold leading-none tracking-[-1px] xl:tracking-[-0.75px] text-ink xl:text-[25.5px]">
        {t(amount)}
      </p>
      <p className="m-0 text-[14.5px] leading-[1.6] text-[#7a5210] xl:text-[11px]">
        <Sentence runs={body} />
      </p>
    </div>
  );
  return (
    <>
      <div className="md:hidden">
        <div className="mb-2.5 rounded-sm border-[1.5px] border-warning-border bg-warning-surface px-3.5 pt-1.5 pb-2">
          <dl className="m-0">
            <div className={FINE_ROW}>
              <dt className="min-w-0 text-[13px] xl:text-[11px] font-bold leading-[1.4] text-[#7a5210]">
                <Lines text={t('calc.124')} />
              </dt>
              <dd className="m-0 flex-none text-[22px] xl:text-[16.5px] font-extrabold tracking-[-0.6px] xl:tracking-[-0.45px] text-ink">
                {t('calc.407')}
              </dd>
            </div>
            <div className={`${FINE_ROW} border-t border-warning-border`}>
              <dt className="min-w-0 text-[13px] xl:text-[11px] font-bold leading-[1.4] text-[#7a5210]">
                <Lines text={t('calc.125')} />
              </dt>
              <dd className="m-0 flex-none text-[22px] xl:text-[16.5px] font-extrabold tracking-[-0.6px] xl:tracking-[-0.45px] text-ink">
                {t('calc.409')}
              </dd>
            </div>
          </dl>
          <p className="m-0 border-t border-warning-border pt-[9px] xl:pt-[6.75px] pb-[3px] xl:pb-[2.25px] text-[12.5px] xl:text-[11px] leading-[1.5] text-[#7a5210]">
            <Sentence runs={[t('calc.126'), b(t('calc.127')), t('calc.128')]} />
          </p>
        </div>
        <div className="mb-2.5 rounded-sm bg-navy p-[15px] xl:p-[11.25px]">
          <p className="m-0 text-[15.5px] xl:text-[11.625px] font-bold leading-[1.45] text-white">
            <Sentence
              runs={[t('calc.129'), b(t('calc.130')), t('calc.131')]}
              strong="font-extrabold text-sky"
            />
          </p>
          <p className="m-0 mt-2.5 border-t border-white/15 pt-2.5 text-[13px] xl:text-[11px] leading-[1.5] text-white/80">
            <Sentence runs={[t('calc.132'), b(t('calc.133'))]} strong="font-extrabold text-white" />
          </p>
        </div>
      </div>
      <div className="mx-auto grid max-w-[1080px] gap-5 max-md:hidden lg:grid-cols-2 xl:max-w-[810px]">
        {/* calc.408 (the doubled fine) is the package's own string — the design typed it (line 1369) */}
        {fine('calc.111', 'calc.407', [t('calc.112'), b(t('calc.408')), t('calc.113')])}
        {fine('calc.114', 'calc.409', [t('calc.115'), b(t('calc.116')), t('calc.117')])}
      </div>
      <ul data-testid="calc-consequences" className={CONSEQUENCES}>
        {(
          [
            ['calc.118', 'calc.119'],
            ['calc.120', 'calc.121'],
            ['calc.122', 'calc.123'],
          ] as const
        ).map(([title, body]) => (
          <li key={title} className={CONSEQUENCE}>
            <h3 className="m-0 mb-[5px] xl:mb-[3.75px] text-[15px] font-extrabold text-ink max-md:mb-[3px] max-md:text-[14px] xl:text-[11.25px]">
              {t(title)}
            </h3>
            <p className="m-0 text-body-sm leading-[1.6] text-text-secondary max-md:text-[12.5px] max-md:leading-[1.5]">
              {t(body)}
            </p>
          </li>
        ))}
      </ul>
      <Note
        tone="green"
        className="mx-auto mt-[22px] xl:mt-[16.5px] max-w-[1080px] max-md:hidden xl:max-w-[810px]"
      >
        <Sentence runs={[t('calc.134'), b(t('calc.135')), t('calc.136'), b(t('calc.137'))]} />
      </Note>
    </>
  );
}

/* ---------- #students (1399–1490) ---------- */

const STUDENT = {
  amber: {
    card: 'mb-2 rounded-sm border border-border-1 bg-white px-3.5 py-[13px] xl:py-[9.75px]',
    cell: 'rounded-[11px] border border-warning-border bg-warning-surface px-2.5 py-[9px] xl:py-[6.75px]',
    value: 'block text-[14.5px] xl:text-[11px] font-extrabold text-ink',
    note: 'mt-0.5 block text-[11.5px] xl:text-[11px] leading-[1.35] text-[#7a5210]',
  },
  green: {
    card: 'mb-2.5 rounded-sm border-[1.5px] border-success-border bg-white px-3.5 py-[13px] xl:py-[9.75px]',
    cell: 'rounded-[11px] border border-success-border bg-success-surface px-2.5 py-[9px] xl:py-[6.75px]',
    value: 'block text-[14.5px] xl:text-[11px] font-extrabold text-success-text',
    note: 'mt-0.5 block text-[11.5px] xl:text-[11px] leading-[1.35] text-[#14532d]',
  },
} as const;
const TIER = {
  amber: 'rounded-md border border-border-2 bg-white px-7 py-[26px] xl:py-[19.5px]',
  green: 'rounded-md border-[1.5px] border-success-border bg-white px-7 py-[26px] xl:py-[19.5px]',
} as const;
const RULE_ROW = 'px-3.5 py-[11px] xl:py-[8.25px] text-[13px] xl:text-[11px] leading-[1.5]';

function StudentPhoneCard({
  tone,
  title,
  sub,
  cells,
  note,
}: {
  tone: keyof typeof STUDENT;
  title: string;
  sub: string;
  cells: readonly (readonly [string, string])[];
  note: string;
}) {
  const s = STUDENT[tone];
  return (
    <div className={s.card}>
      <p className="m-0 mb-2.5">
        <span className="block text-[14.5px] xl:text-[11px] font-extrabold leading-[1.2] text-ink">
          {title}
        </span>
        <span className="block text-[11.5px] xl:text-[11px] font-bold text-text-tertiary">
          {sub}
        </span>
      </p>
      <div className="grid grid-cols-2 gap-[7px] xl:gap-[5.25px]">
        {cells.map(([value, label]) => (
          <p key={value} className={`m-0 ${s.cell}`}>
            <span className={s.value}>{value}</span>
            <span className={s.note}>{label}</span>
          </p>
        ))}
      </div>
      <p className="m-0 mt-[9px] xl:mt-[6.75px] text-[12.5px] xl:text-[11px] leading-[1.5] text-text-tertiary">
        {note}
      </p>
    </div>
  );
}

function TierCard({
  tone,
  title,
  sub,
  items,
}: {
  tone: keyof typeof TIER;
  title: string;
  sub: string;
  items: Run[][];
}) {
  return (
    <div className={TIER[tone]}>
      <h3 className="m-0 text-[17.5px] font-extrabold text-ink xl:text-[13.1px]">{title}</h3>
      <p className="m-0 mb-3.5 text-[13px] xl:text-[11px] font-bold text-text-tertiary">{sub}</p>
      <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
        {items.map((runs, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <Dot tone={tone} />
            <span className="text-[14.5px] leading-[1.55] text-text-secondary xl:text-[11px]">
              <Sentence runs={runs} />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Students({ ctx }: { ctx: CalcCtx }) {
  const { t } = ctx;
  const rules: [string, string][] = [
    ['calc.303', 'calc.304'],
    ['calc.305', 'calc.306'],
    ['calc.307', 'calc.308'],
  ];
  return (
    <>
      <div className="md:hidden">
        <div className="mb-2.5 rounded-sm bg-navy p-[15px] xl:p-[11.25px]">
          <p className={KICKER_DARK}>{t('calc.285')}</p>
          <p className="m-0 text-[15px] xl:text-[11.25px] font-bold leading-[1.45] text-white">
            <Sentence
              runs={[t('calc.286'), b(t('calc.287')), t('calc.288')]}
              strong="font-extrabold text-sky"
            />
          </p>
        </div>
        {/* the design types the phone subtitle of the second card (line 1440); calc.297 is its id */}
        <StudentPhoneCard
          tone="amber"
          title={t('calc.289')}
          sub={t('calc.290')}
          cells={[
            [t('calc.291'), t('calc.292')],
            [t('calc.293'), t('calc.294')],
          ]}
          note={t('calc.295')}
        />
        <StudentPhoneCard
          tone="green"
          title={t('calc.296')}
          sub={t('calc.297')}
          cells={[
            [t('calc.298'), t('calc.299')],
            [t('calc.300'), t('calc.301')],
          ]}
          note={t('calc.302')}
        />
        <ul
          data-testid="calc-students-rules"
          className="m-0 list-none overflow-hidden rounded-sm border border-border-1 bg-white p-0"
        >
          {rules.map(([strong, rest], i) => (
            <li
              key={strong}
              className={
                i === 0
                  ? `${RULE_ROW} text-text-secondary`
                  : `${RULE_ROW} border-t border-border-3 text-text-secondary`
              }
            >
              <Sentence runs={[b(t(strong)), t(rest)]} />
            </li>
          ))}
          <li
            className={`${RULE_ROW} border-t border-warning-border bg-warning-surface text-[#7a5210]`}
          >
            <Sentence runs={[b(t('calc.309')), t('calc.310')]} />
          </li>
        </ul>
      </div>
      <div className="max-md:hidden">
        <div className="mb-5 grid gap-5 lg:grid-cols-2">
          {/* the design types both subtitles (lines 1447, 1461); calc.263/271 are their ids */}
          <TierCard
            tone="amber"
            title={t('calc.262')}
            sub={t('calc.263')}
            items={[
              [t('calc.264'), b(t('calc.265')), t('calc.266')],
              [b(t('calc.267')), t('calc.268')],
              [t('calc.269')],
            ]}
          />
          <TierCard
            tone="green"
            title={t('calc.270')}
            sub={t('calc.271')}
            items={[
              [b(t('calc.272')), t('calc.273')],
              [b(t('calc.274')), t('calc.275')],
              [t('calc.276')],
            ]}
          />
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-sm border border-border-2 bg-white px-5 py-[18px] xl:py-[13.5px]">
            <h3 className="m-0 mb-1 text-[14.5px] font-extrabold text-ink xl:text-[11px]">
              {t('calc.277')}
            </h3>
            <p className="m-0 text-body-sm leading-[1.6] text-text-secondary">{t('calc.278')}</p>
          </div>
          <div className="rounded-sm border border-border-2 bg-white px-5 py-[18px] xl:py-[13.5px]">
            <h3 className="m-0 mb-1 text-[14.5px] font-extrabold text-ink xl:text-[11px]">
              {t('calc.279')}
            </h3>
            <p className="m-0 text-body-sm leading-[1.6] text-text-secondary">{t('calc.280')}</p>
          </div>
          <div className="rounded-sm border border-warning-border bg-warning-surface px-5 py-[18px] xl:py-[13.5px]">
            <h3 className="m-0 mb-1 text-[14.5px] font-extrabold text-ink xl:text-[11px]">
              {t('calc.281')}
            </h3>
            <p className="m-0 text-body-sm leading-[1.6] text-[#7a5210]">{t('calc.282')}</p>
          </div>
        </div>
        <p className="m-0 mt-5 rounded-sm border border-tint-border bg-white px-[22px] xl:px-[16.5px] py-4 text-body-sm leading-[1.6] text-text-secondary">
          <Sentence runs={[b(t('calc.283')), t('calc.284')]} />
        </p>
      </div>
    </>
  );
}

/* ---------- #faq (1492–1532) ---------- */

/** `FaqBlock` (one FAQPage node, AEO only) with the design's ask card: WhatsApp (generic,
 *  visitor-voice prefill — never an estimate, W95) and the e-mail row (W83, subject = this
 *  page's name). The block's id is `calc-faq`: the section itself is `#faq`. */
export function Faq({ ctx }: { ctx: CalcCtx }) {
  const { t, sys, bundle, locale, settings } = ctx;
  const items = Array.from({ length: 15 }, (_, i) => ({
    id: `calc-faq-${i + 1}`,
    q: t(`calc.${480 + 2 * i}`),
    a: t(`calc.${481 + 2 * i}`),
  }));
  return (
    <FaqBlock
      bundle={bundle}
      locale={locale}
      id="calc-faq"
      items={items}
      eyebrowId="calc.405"
      headingId="calc.383"
      bodyId="calc.384"
      openFirst
      askCard={{
        titleId: 'calc.380',
        bodyId: 'calc.381',
        whatsappNumber: settings.whatsappNumber,
        whatsappText: sys('calc.whatsapp.generic'),
        whatsappLabelId: 'calc.052',
        email: settings.email,
        emailLabelId: 'calc.406',
        subject: t('calc.002'),
      }}
    />
  );
}
