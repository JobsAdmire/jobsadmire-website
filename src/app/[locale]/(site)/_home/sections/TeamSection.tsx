import { makeTf } from '@/content/pure';
import { ImageSlot } from '@/design/blocks/ImageSlot';
import { ShieldCheckIcon } from '@/design/chrome/icons';
import { Button } from '@/design/primitives/Button';
import { Eyebrow } from '@/design/primitives/Eyebrow';
import { Section } from '@/design/primitives/Section';
import { liquidSizes } from '@/design/zoom';
import { LiveDot } from '../components/LiveDot';
import { BuildingIcon, GlobeIcon, MonitorIcon } from '../components/icons';
import { publishedFounder } from '../lib/phase-a';
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

/** The CTA row's shared look: the design's 14 × 26 px pills at 14.5 px; full-width 54 px rows at
 *  ≤ 460 px (`.ja-team-cta > a`). */
const CTA = 'max-xs:min-h-[54px] max-xs:w-full';

/**
 * "Our team" (design ll. 802–851). The founder is published (W86, owner 2026-10-05: Haris Jiva,
 * `/team/haris-jiva.jpg`), so the section renders: the navy founder card (name and photo from the
 * `founder` row, never the design's hard-coded name; its `.ja-glow` blob drifts), the three
 * offices/representatives minis (package copy, no sample data — so no `SampleTag`) and the verify /
 * about / careers CTAs. Should the row be unpublished again, the founder card drops out and the
 * minis carry the section. At ≤ 460 px the minis hide, the founder card sits in the design's white
 * framed card (`.ja-grid-team`) and the CTAs stack full width (W10).
 */
export function TeamSection({ locale, bundle }: SectionProps) {
  const founder = publishedFounder(bundle);
  const tf = makeTf(bundle, locale);
  return (
    <Section tone="pale" id="team" className="ja-reveal border-y border-border-2">
      <div data-testid="team" className="container-site">
        <div className={SECTION_HEAD}>
          <div className="min-w-0">
            <Eyebrow>{tf('home.200')}</Eyebrow>
            <h2 className={`${H2} m-0 mt-3`}>{tf('home.127')}</h2>
          </div>
          <p className="m-0 max-w-[360px] text-body-sm font-bold text-text-tertiary max-lg:max-w-none lg:text-right xl:max-w-[270px]">
            {tf('home.128')}
          </p>
        </div>
        <div className="grid items-stretch gap-4 max-xs:gap-0 max-xs:overflow-hidden max-xs:rounded-lg max-xs:border max-xs:border-border-2 max-xs:bg-white max-xs:shadow-[0_16px_38px_rgba(22,60,90,0.09)] lg:grid-cols-[1.05fr_0.65fr_0.65fr_0.65fr]">
          {founder ? (
            <article
              data-testid="team-founder"
              className="ja-hover-card relative flex items-center gap-[22px] overflow-hidden rounded-hero bg-navy px-[30px] py-7 text-white max-xs:gap-4 max-xs:rounded-none max-xs:px-5 max-xs:py-[22px] xl:gap-[16.5px] xl:rounded-[18px] xl:px-[22.5px]"
            >
              <div
                aria-hidden="true"
                className="ja-glow pointer-events-none absolute -right-[100px] -top-[120px] h-[320px] w-[320px] rounded-pill bg-[radial-gradient(circle,rgba(24,153,213,0.25),transparent_65%)]"
              />
              {/* W129: the slot owns its box; this wrapper sizes it (104 × 130, 86 × 108 at ≤ 460). */}
              <div className="relative w-[104px] shrink-0 overflow-hidden rounded-base border border-white/20 bg-white/10 max-xs:w-[86px] xl:w-[78px] xl:rounded-xs">
                <ImageSlot
                  slot="founder-photo"
                  src={founder.photoSrc}
                  alt={founder.name}
                  width={104}
                  height={130}
                  sizes={liquidSizes(78, '104px')}
                />
              </div>
              <div className="relative min-w-0">
                <span className="mb-2.5 inline-block rounded-pill bg-blue-safe px-[13px] py-1 text-[10.5px] font-extrabold uppercase tracking-[1px] xl:px-[10px] xl:text-[11px]">
                  {tf('home.129')}
                </span>
                <h3 className="m-0 font-display text-[22px] font-extrabold tracking-[-0.7px] text-white xl:text-[16.5px] xl:tracking-[-0.5px]">
                  {founder.name}
                </h3>
                <p className="m-0 mt-[5px] text-body-sm font-semibold leading-normal text-white/65">
                  {tf('home.130')}
                </p>
              </div>
            </article>
          ) : null}
          {MINI.map(({ labelId, bodyId, Icon, tint }) => (
            <article
              key={labelId}
              data-team-mini=""
              className="ja-hover-card flex flex-col gap-[9px] rounded-hero border border-border-2 bg-white px-[26px] py-6 max-xs:hidden xl:gap-[7px] xl:rounded-[18px] xl:px-[19.5px]"
            >
              <span
                aria-hidden="true"
                className={`mb-1 flex h-[42px] w-[42px] items-center justify-center rounded-xs ${tint} xl:h-[31.5px] xl:w-[31.5px] xl:rounded-[9px]`}
              >
                <Icon size={20} />
              </span>
              <h3 className="m-0 font-display text-[17px] font-extrabold tracking-[-0.4px] xl:text-[12.75px] xl:tracking-[-0.3px]">
                {tf(labelId)}
              </h3>
              <p className="m-0 text-[13px] font-semibold leading-[1.55] text-text-tertiary xl:text-[11px]">
                {tf(bodyId)}
              </p>
            </article>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3 max-xs:flex-col max-xs:gap-2.5">
          <Button
            prefetch={false}
            variant="nav"
            href="/verify"
            className={CTA}
            icon={<ShieldCheckIcon size={15} />}
          >
            {tf('home.137')}
          </Button>
          <Button prefetch={false} variant="secondary" href="/about" className={CTA}>
            {tf('home.138')}
          </Button>
          <Button
            prefetch={false}
            variant="success"
            href="/careers"
            className={CTA}
            icon={<LiveDot />}
          >
            {tf('home.139')}
          </Button>
        </div>
      </div>
    </Section>
  );
}
