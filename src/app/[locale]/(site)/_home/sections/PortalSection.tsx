import { useTranslations } from 'next-intl';
import { makeTf } from '@/content/pure';
import { ImageSlot } from '@/design/blocks/ImageSlot';
import { StoreBadges } from '@/design/blocks/StoreBadges';
import { ClockIcon } from '@/design/chrome/icons';
import { Button } from '@/design/primitives/Button';
import { Eyebrow } from '@/design/primitives/Eyebrow';
import { Section } from '@/design/primitives/Section';
import { LiveDot } from '../components/LiveDot';
import { FileCheckIcon, MobileIcon, SparkIcon } from '../components/icons';
import { H2, LEAD } from './styles';
import type { SectionProps } from './types';

const TILES = [
  { titleId: 'home.207', bodyId: 'home.165', Icon: SparkIcon, tint: 'bg-tint text-blue-safe' },
  {
    titleId: 'home.209',
    bodyId: 'home.166',
    Icon: FileCheckIcon,
    tint: 'bg-success-surface text-success-text',
  },
  { titleId: 'home.167', bodyId: 'home.168', Icon: ClockIcon, tint: 'bg-[#eef2ff] text-[#4855b8]' },
  {
    titleId: 'home.213',
    bodyId: 'home.169',
    Icon: MobileIcon,
    tint: 'bg-[#fef3e2] text-warning-text',
  },
] as const;

/**
 * "Portal + app" (design lines 853–950), hidden at ≤ 460 px as the design hides `.ja-portal-sec`
 * (W10 — the section's phone-only lines never show, so home.170–172 are not rendered). The two
 * screens are the named placeholders `portal-shortlist` / `portal-mobile-app` until product shots
 * ship (W55); the mock's status and shortlist labels (home.215/216) are decorative, inside an
 * `aria-hidden` illustration. `StoreBadges` shows both stores since the App Store link arrived
 * (W227) and the platform line reads "iOS & Android" as the design does
 * (`sys.home.portal.platforms`); the host is `settings.portal.host`. From 1101 the mock's stage is
 * capped at 460 px and centred: in the 1240 px box the laptop grew inside the fixed 400 px stage
 * and the status card sat on its base (W230).
 */
export function PortalSection({ locale, bundle }: SectionProps) {
  const tf = makeTf(bundle, locale);
  const sys = useTranslations('sys');
  const s = bundle.settings;
  const host = new URL(s.portal.host).host;
  return (
    <Section tone="light" id="portal" className="max-xs:hidden">
      <div
        data-testid="portal"
        className="container-site grid items-center gap-[34px] lg:grid-cols-[0.95fr_1.05fr] lg:gap-14 xl:gap-[42px]"
      >
        <div className="min-w-0">
          <Eyebrow>{tf('home.162')}</Eyebrow>
          <h2 className={`${H2} mb-4 mt-3.5`}>{tf('home.163')}</h2>
          <p className={`${LEAD} m-0 mb-[22px]`}>{tf('home.164')}</p>
          <ul className="m-0 mb-[26px] grid list-none gap-3 p-0 sm:grid-cols-2">
            {TILES.map(({ titleId, bodyId, Icon, tint }) => (
              <li
                key={titleId}
                className="flex items-start gap-[13px] rounded-base border border-border-2 bg-white px-[18px] py-4"
              >
                <span
                  aria-hidden="true"
                  className={`flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[11px] ${tint}`}
                >
                  <Icon size={18} />
                </span>
                <span className="min-w-0">
                  <span className="block text-body-sm font-extrabold text-ink">{tf(titleId)}</span>
                  <span className="mt-0.5 block text-[12.5px] font-semibold leading-normal text-text-tertiary">
                    {tf(bodyId)}
                  </span>
                </span>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap items-center gap-2.5">
            <Button prefetch={false} variant="nav" href="/hire-workers">
              {tf('home.173')}
            </Button>
            <StoreBadges
              bundle={bundle}
              locale={locale}
              android={s.storeLinks.android}
              ios={s.storeLinks.ios}
              tone="dark"
            />
          </div>
        </div>
        <div className="relative min-w-0 overflow-hidden rounded-[26px] bg-[linear-gradient(160deg,#16294f_0%,#0e1a37_60%,#0a1428_100%)] px-[30px] pb-[30px] pt-9 xl:rounded-[19.5px]">
          <div aria-hidden="true" className="relative h-[400px] xl:mx-auto xl:max-w-[460px]">
            <div className="absolute left-0 top-0 w-[82%]">
              <div className="rounded-b-md rounded-t-[14px] bg-[#0f2438] px-[9px] pb-3 pt-[9px] shadow-[0_26px_56px_rgba(3,10,26,0.55)]">
                <div className="overflow-hidden rounded-lg bg-white">
                  <div className="flex items-center gap-[7px] border-b border-border-4 bg-[#f6f9fb] px-3 py-[9px]">
                    <span className="inline-block h-[9px] w-[9px] rounded-pill bg-[#e2e8ee]" />
                    <span className="inline-block h-[9px] w-[9px] rounded-pill bg-[#e2e8ee]" />
                    <span className="inline-block h-[9px] w-[9px] rounded-pill bg-[#e2e8ee]" />
                    <span className="ml-2 flex-1 rounded-md border border-border-4 bg-white px-2.5 py-[3px] text-[11px] text-text-tertiary">
                      {host}
                    </span>
                  </div>
                  <ImageSlot
                    slot="portal-shortlist"
                    src={null}
                    alt=""
                    width={640}
                    height={320}
                    sizes="(min-width: 901px) 40vw, 80vw"
                  />
                </div>
              </div>
              <div className="-mx-[6%] h-[15px] rounded-b-[14px] rounded-t-sm bg-[linear-gradient(180deg,#dbe4ec,#b9c7d2)]" />
            </div>
            <div className="absolute bottom-0 right-1.5 z-[2] w-[150px] rounded-[24px] border border-white/10 bg-[#0f2438] p-[7px] shadow-[0_30px_60px_rgba(3,10,26,0.6)]">
              <div className="overflow-hidden rounded-[18px]">
                <ImageSlot
                  slot="portal-mobile-app"
                  src={null}
                  alt=""
                  width={136}
                  height={278}
                  sizes="136px"
                />
              </div>
            </div>
            <div className="absolute -left-1.5 bottom-16 z-[3] max-w-[210px] rounded-sm bg-white px-4 py-3 shadow-[0_18px_44px_rgba(3,10,26,0.5)]">
              <p className="m-0 mb-1 flex items-center gap-[9px] text-[12.5px] font-extrabold text-ink">
                <LiveDot />
                {tf('home.215')}
              </p>
              <div className="h-1.5 overflow-hidden rounded-pill bg-border-3">
                <span className="block h-full w-4/5 rounded-pill bg-[linear-gradient(90deg,#1899d5,#12813c)]" />
              </div>
            </div>
            <div className="absolute -top-3.5 right-[22px] z-[3] rounded-xs bg-blue-safe px-[15px] py-[9px] text-[12px] font-extrabold text-white shadow-[0_14px_34px_rgba(24,153,213,0.45)]">
              {tf('home.216')}
            </div>
          </div>
          <p className="relative m-0 mt-[22px] flex flex-wrap items-center justify-center gap-x-[18px] gap-y-1 text-[12px] font-bold text-white/60">
            <span>{host}</span>
            <span aria-hidden="true">·</span>
            <span>{sys('home.portal.platforms')}</span>
            <span aria-hidden="true">·</span>
            <span>{tf('home.174')}</span>
          </p>
        </div>
      </div>
    </Section>
  );
}
