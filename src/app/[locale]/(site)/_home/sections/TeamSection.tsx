import { makeTf } from '@/content/pure';
import { ImageSlot } from '@/design/blocks/ImageSlot';
import { Button } from '@/design/primitives/Button';
import { Eyebrow } from '@/design/primitives/Eyebrow';
import { Section } from '@/design/primitives/Section';
import { LiveDot } from '../components/LiveDot';
import { BuildingIcon, GlobeIcon, MonitorIcon, ShieldIcon } from '../components/icons';
import { hasRows, publishedFounder } from '../lib/phase-a';
import { H2, SECTION_HEAD } from './styles';
import type { SectionProps } from './types';

const MINI = [
  { labelId: 'home.133', bodyId: 'home.131', Icon: BuildingIcon, tint: 'bg-tint text-blue-safe' },
  {
    labelId: 'home.132',
    bodyId: 'home.134',
    Icon: MonitorIcon,
    tint: 'bg-success-surface text-success-text',
  },
  { labelId: 'home.135', bodyId: 'home.136', Icon: GlobeIcon, tint: 'bg-[#eef2ff] text-[#4855b8]' },
] as const;

/**
 * "Our team" (design lines 802–851). Every line of it is a claim about the public register
 * ("everyone below is on our payroll with a JA- ID — check anyone on the public register"), which
 * Phase A cannot back: `representatives` is empty and fixture-only (D23), so the section renders
 * nothing until it has rows (W6). The founder card additionally waits for the owner to publish the
 * `founder` row (W86, §10 row 3) — its name and photo come from that row, never from the design's
 * hard-coded name. At ≤ 460 px the three minis hide (`.ja-team-mini`, W10).
 */
export function TeamSection({ locale, bundle }: SectionProps) {
  if (!hasRows(bundle, 'representatives')) return null;
  const founder = publishedFounder(bundle);
  const tf = makeTf(bundle, locale);
  return (
    <Section tone="pale" id="team" className="border-y border-border-2">
      <div data-testid="team" className="container-site">
        <div className={SECTION_HEAD}>
          <div className="min-w-0">
            <Eyebrow>{tf('home.200')}</Eyebrow>
            <h2 className={`${H2} m-0 mt-3`}>{tf('home.127')}</h2>
          </div>
          <p className="m-0 max-w-[360px] text-body-sm font-bold text-text-secondary lg:text-right">
            {tf('home.128')}
          </p>
        </div>
        <div className="grid items-stretch gap-4 lg:grid-cols-[1.05fr_0.65fr_0.65fr_0.65fr]">
          {founder ? (
            <article
              data-testid="team-founder"
              className="relative flex items-center gap-[22px] overflow-hidden rounded-hero bg-navy px-[30px] py-7 text-white max-xs:gap-4 max-xs:px-5 max-xs:py-[22px]"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-[100px] -top-[120px] h-[320px] w-[320px] rounded-pill bg-[radial-gradient(circle,rgba(24,153,213,0.25),transparent_65%)]"
              />
              {/* W129: the slot owns its box; this wrapper sizes it (104 px, 86 px at ≤ 460 px). */}
              <div className="relative w-[104px] shrink-0 overflow-hidden rounded-base border border-white/20 bg-white/10 max-xs:w-[86px]">
                <ImageSlot
                  slot="founder-photo"
                  src={founder.photoSrc}
                  alt={founder.name}
                  width={104}
                  height={130}
                  sizes="104px"
                />
              </div>
              <div className="relative min-w-0">
                <span className="mb-2.5 inline-block rounded-pill bg-blue-safe px-[13px] py-1 text-[10.5px] font-extrabold uppercase tracking-[1px]">
                  {tf('home.129')}
                </span>
                <h3 className="m-0 text-[22px] tracking-[-0.7px] text-white xl:text-[16.5px]">
                  {founder.name}
                </h3>
                <p className="m-0 mt-[5px] text-body-sm leading-normal text-white/65">
                  {tf('home.130')}
                </p>
              </div>
            </article>
          ) : null}
          {MINI.map(({ labelId, bodyId, Icon, tint }) => (
            <article
              key={labelId}
              className="flex flex-col gap-[9px] rounded-hero border border-border-2 bg-white px-[26px] py-6 max-xs:hidden"
            >
              <span
                aria-hidden="true"
                className={`mb-1 flex h-[42px] w-[42px] items-center justify-center rounded-xs ${tint}`}
              >
                <Icon size={20} />
              </span>
              <h3 className="m-0 text-[17px] tracking-[-0.4px] xl:text-[12.75px]">{tf(labelId)}</h3>
              <p className="m-0 text-[13px] font-semibold leading-[1.55] text-text-tertiary">
                {tf(bodyId)}
              </p>
            </article>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3 max-xs:flex-col">
          <Button prefetch={false} variant="nav" href="/verify">
            <ShieldIcon size={15} />
            {tf('home.137')}
          </Button>
          <Button prefetch={false} variant="secondary" href="/about">
            {tf('home.138')}
          </Button>
          <Button prefetch={false} variant="success" href="/careers">
            <LiveDot />
            {tf('home.139')}
          </Button>
        </div>
      </div>
    </Section>
  );
}
