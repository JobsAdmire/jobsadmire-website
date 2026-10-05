import { useTranslations } from 'next-intl';
import { ContactLink } from '@/analytics/ContactLink';
import { getCollection } from '@/content/collections';
import { makeTf } from '@/content/pure';
import { CheckIcon } from '@/design/chrome/icons';
import { Button } from '@/design/primitives/Button';
import { Eyebrow } from '@/design/primitives/Eyebrow';
import { Section } from '@/design/primitives/Section';
import { isReviewDue, presets } from '@/lib/calculator';
import { CalculatorTeaserIsland } from '../components/CalculatorTeaserIsland';
import { LiveDot } from '../components/LiveDot';
import { TEASER_WA_CLASS, TeaserCard, type TeaserCardCopy } from '../components/TeaserCard';
import { TeaserChips } from '../components/TeaserChips';
import { TeaserLayout } from '../components/TeaserLayout';
import { teaserViews, type TeaserLabels } from '../lib/teaser';
import { DEFAULT_HEADCOUNT, HEADCOUNT_PRESETS, stateKey } from '../lib/teaser-keys';
import { H2, LEAD } from './styles';
import type { SectionProps } from './types';

/**
 * "Real cost, 2026 rates" (design lines 529–613). Every figure is the shared engine's over the
 * bundle's `rateConfig` and the three `preset: true` role rows (W2), support off (W58);
 * `home.074`/`082` stay verbatim and the support row's value says the support is shown
 * separately (`sys.home.calc.supportSeparate`, W142(b)). The dated eyebrow/badge (home.068/079)
 * render while the config is in review and switch at `reviewDueAt` (D17) — the page revalidates
 * daily for it (W150). The server renders the default state as the LazyIsland fallback.
 */
export function CalculatorStrip({ locale, bundle }: SectionProps) {
  const sys = useTranslations('sys');
  const rateConfig = getCollection(bundle, 'rateConfig')[0];
  const roles = presets(getCollection(bundle, 'calculatorRoles'));
  // D17: no rates, no numbers — and Task 9 P8: no preset rows, no chips. The homepage keeps
  // rendering either way (`getRateConfig` would throw in every environment).
  if (!rateConfig || roles.length === 0) return null;
  const tf = makeTf(bundle, locale);
  const number = bundle.settings.whatsappNumber;
  const reviewDue = isReviewDue(rateConfig);
  const roleOptions = roles.map((row) => ({ row, label: tf(row.labelId) }));
  const labels: TeaserLabels = {
    grossMin: tf('home.080'),
    grossFloor: (multiplier) => sys('home.calc.grossFloor', { multiplier }),
    headcount: (n) => sys('home.calc.headcount', { n }),
    estimate: (args) => sys('home.whatsapp.estimate', args),
  };
  const views = teaserViews({ roles: roleOptions, rateConfig, locale, labels });
  const initialRole = roles[0].key;
  const chipRoles = roleOptions.map(({ row, label }) => ({ key: row.key, label }));
  const headcounts = HEADCOUNT_PRESETS.map((value) => ({ value, label: labels.headcount(value) }));
  const legends = { roles: tf('home.072'), headcount: tf('home.073') };
  const copy: TeaserCardCopy = {
    per: tf('home.078'),
    rates: reviewDue ? null : tf('home.079'),
    sgk: tf('home.081'),
    support: tf('home.082'),
    supportValue: sys('home.calc.supportSeparate'),
    total: tf('home.083'),
    salaryPct: tf('home.084'),
    sgkPct: tf('home.085'),
    monthlyPayroll: sys('home.calc.monthlyPayroll'),
    oneOff: tf('home.086'),
    whatsapp: tf('home.087'),
    more: tf('home.088'),
    less: tf('home.089'),
    disc: tf('home.090'),
  };
  const leftTop = (
    <>
      <Eyebrow>{reviewDue ? sys('home.calc.eyebrowUndated') : tf('home.068')}</Eyebrow>
      <h2 className={`${H2} mb-4 mt-3.5`}>{tf('home.069')}</h2>
      <p className={`${LEAD} mb-6 max-w-[520px]`}>
        {tf('home.070')}
        <span className="max-xs:hidden"> {tf('home.071')}</span>
      </p>
    </>
  );
  const leftBottom = (
    <>
      {/* No `.ja-stagger` here (the design's `.ja-calc-notes` ticks in): this list renders inside
          the LazyIsland, whose swap from the server fallback remounts it — the ticks would play
          twice. */}
      <ul className="m-0 mb-[26px] flex list-none flex-col gap-[9px] p-0 max-xs:hidden">
        {(['home.074', 'home.075'] as const).map((id) => (
          <li
            key={id}
            className="flex items-start gap-[11px] text-body-sm font-bold leading-normal text-[#43536a]"
          >
            <CheckIcon size={14} className="mt-[3px] shrink-0 text-success-text" />
            {tf(id)}
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-3 max-xs:hidden">
        <Button prefetch={false} variant="nav" href="/hiring-cost-calculator">
          {tf('home.076')}
        </Button>
        <Button prefetch={false} variant="secondary" href="/work-permit">
          {tf('home.077')}
        </Button>
      </div>
    </>
  );
  // The phone-only pair inside the card (`.ja-calc-cta-mobile`).
  const ctas = (
    <>
      <Button prefetch={false} variant="nav" href="/hiring-cost-calculator">
        {tf('home.076')}
      </Button>
      <Button prefetch={false} variant="secondary" href="/work-permit">
        {tf('home.077')}
      </Button>
    </>
  );
  const fallback = (
    <TeaserLayout
      leftTop={leftTop}
      leftBottom={leftBottom}
      chips={
        <>
          <TeaserChips
            name="teaser-role"
            legend={legends.roles}
            options={chipRoles.map((r) => ({ value: r.key, label: r.label }))}
            value={initialRole}
            spanLast
          />
          <TeaserChips
            name="teaser-headcount"
            legend={legends.headcount}
            emphasis="ink"
            options={headcounts.map((h) => ({ value: String(h.value), label: h.label }))}
            value={String(DEFAULT_HEADCOUNT)}
          />
        </>
      }
      card={
        <TeaserCard
          view={views[stateKey(initialRole, DEFAULT_HEADCOUNT)]}
          copy={copy}
          expanded={false}
          ctas={ctas}
          whatsapp={
            // The same bare anchor the island's WhatsAppComposeLink renders (W95).
            <ContactLink
              href={`https://wa.me/${number}`}
              placement="page_cta"
              target="_blank"
              rel="noopener noreferrer"
              className={TEASER_WA_CLASS}
            >
              <LiveDot />
              {copy.whatsapp}
            </ContactLink>
          }
        />
      }
    />
  );
  return (
    <Section tone="pale" id="cost" className="ja-reveal border-y border-border-2">
      <div className="container-site">
        <CalculatorTeaserIsland
          fallback={fallback}
          locale={locale}
          views={views}
          roles={chipRoles}
          headcounts={headcounts}
          initialRole={initialRole}
          initialHeadcount={DEFAULT_HEADCOUNT}
          whatsappNumber={number}
          legends={legends}
          copy={copy}
          leftTop={leftTop}
          leftBottom={leftBottom}
          ctas={ctas}
        />
      </div>
    </Section>
  );
}
