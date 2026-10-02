import type { Metadata } from 'next';
import Image from 'next/image';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getBundle, makeT, makeTf } from '@/content/adapter';
import { BRAND } from '@/design/assets/brand';
// By module path, never the barrels (W134/W147/W156).
import { ContactCta } from '@/design/blocks/ContactCta';
import { StoreBadges } from '@/design/blocks/StoreBadges';
import { LanguageSwitcher } from '@/design/chrome/LanguageSwitcher';
import { Button, buttonClassName } from '@/design/primitives/Button';
import { QrCode } from '@/design/QrCode';
import { Link } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { waLink } from '@/lib/contact';
import { buildMetadata } from '@/lib/seo/metadata';
import type { Bundle } from '../../../../../contract/website-bundle.v1';

/** The partner check-list (crmlogin.049–052) and the mobile-app points (crmlogin.060–062). */
const POINT_IDS = ['crmlogin.049', 'crmlogin.050', 'crmlogin.051', 'crmlogin.052'] as const;
const APP_POINT_IDS = ['crmlogin.060', 'crmlogin.061', 'crmlogin.062'] as const;

/** The app card's two faces — translucent on the navy brand panel, navy on the white chooser
 *  column (the design's ≤900 px card). One complete class string per face (W122). */
const APP_SURFACE = {
  panel: 'flex items-center gap-4 rounded-md border border-white/15 bg-white/[0.06] p-4 text-white',
  card: 'flex items-center gap-4 rounded-md bg-navy p-4 text-white',
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const [bundle, sys] = await Promise.all([
    getBundle(locale),
    getTranslations({ locale, namespace: 'sys' }),
  ]);
  return {
    ...buildMetadata({
      locale,
      href: '/portal-login',
      bundle,
      pageKey: 'portal',
      fallbackTitle: sys('seo.portal.title'),
      fallbackDescription: sys('seo.portal.description'),
    }),
    // W8 / spec §3.1: the portal door is never indexed, whatever a later page record says —
    // robots.txt disallows it and the sitemap omits it (NOINDEX_PATHNAMES).
    robots: { index: false, follow: false },
  };
}

function CheckDot() {
  return (
    <span
      aria-hidden="true"
      className="mt-px flex h-[19px] w-[19px] flex-none items-center justify-center rounded-pill border border-sky/45 bg-blue/20 text-sky"
    >
      <svg
        width="10"
        height="10"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        focusable="false"
      >
        <path d="M20 6L9 17l-5-5" />
      </svg>
    </span>
  );
}

function LockIcon() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mt-0.5 flex-none"
    >
      <rect x="4" y="10" width="16" height="11" rx="2.4" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="ml-auto flex-none text-text-tertiary transition-transform group-open:rotate-180"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

/** The design's "Get the mobile app" card (partner portal only): the Play Store badge — Android
 *  only, W8 — and, on the wide brand panel, a local QR of the same link (W14). */
function AppCard({
  bundle,
  locale,
  t,
  android,
  qr,
  surface,
}: {
  bundle: Bundle;
  locale: Locale;
  t: (id: string) => string;
  android: string;
  qr: boolean;
  surface: keyof typeof APP_SURFACE;
}) {
  return (
    <div className={APP_SURFACE[surface]}>
      {qr ? (
        <QrCode
          text={android}
          label={t('crmlogin.030')}
          size={82}
          className="flex-none overflow-hidden rounded-xs"
        />
      ) : null}
      <div className="min-w-0">
        <p className="inline-flex items-center gap-2 text-[10.5px] font-extrabold uppercase tracking-[1.2px] text-sky">
          <span aria-hidden="true" className="block h-[7px] w-[7px] rounded-pill bg-success" />
          {t('crmlogin.011')}
        </p>
        <p className="mt-2 text-body-sm leading-snug font-extrabold">{t('crmlogin.059')}</p>
        <ul className="mt-2 flex list-none flex-col gap-1 p-0">
          {APP_POINT_IDS.map((id) => (
            <li key={id} className="flex items-start gap-2 text-body-sm text-white/70">
              <span
                aria-hidden="true"
                className="mt-[7px] block h-[5px] w-[5px] flex-none rounded-pill bg-sky"
              />
              <span>{t(id)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3">
          {/* W8/D22: Android only — no App Store badge and no crmlogin.063 ("iOS 15+"). */}
          <StoreBadges bundle={bundle} locale={locale} android={android} ios={null} tone="light" />
        </div>
      </div>
    </div>
  );
}

export default async function PortalLoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const [bundle, sys] = await Promise.all([getBundle(locale), getTranslations('sys')]);
  const t = makeT(bundle);
  // D17: crmlogin.055 carries {placed}, crmlogin.057 {replySlaHours} — filled from `metrics`.
  const tf = makeTf(bundle, locale);
  const { settings } = bundle;
  // W8/I15: the page only links out — the portal host's own login and forgot-password pages.
  const loginHref = `${settings.portal.host}${settings.portal.loginPath}`;
  const forgotHref = `${settings.portal.host}${settings.portal.forgotPath}`;
  const android = settings.storeLinks.android;
  // W76/W95: a static prefill — nothing a visitor typed ever sits in a DOM href.
  const whatsappHref = waLink(settings.whatsappNumber, sys('whatsapp.prefill'));

  return (
    <div
      data-testid="portal-shell"
      className="grid bg-white lg:min-h-screen lg:grid-cols-[1.02fr_1fr]"
    >
      {/* The brand panel (design .ja-cl-brand; its #0a1428 is the navy token). */}
      <div className="relative overflow-hidden bg-navy px-5 py-5 text-white md:px-8 md:py-7 lg:px-9 lg:py-9 xl:px-[42px] xl:py-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-36 -right-32 h-[440px] w-[440px] rounded-pill bg-[radial-gradient(circle,rgba(24,153,213,0.32)_0%,rgba(24,153,213,0)_70%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-40 -left-28 h-[400px] w-[400px] rounded-pill bg-[radial-gradient(circle,rgba(24,153,213,0.14)_0%,rgba(24,153,213,0)_70%)]"
        />

        <div className="relative flex items-center gap-3">
          <span className="flex h-[34px] w-[34px] flex-none items-center justify-center rounded-[9px] bg-white">
            {/* Decorative: the wordmark beside it names the brand (the asset's 336 × 285 ratio). */}
            <Image src={BRAND.mark.src} alt="" width={28} height={24} />
          </span>
          <span className="font-display text-[16px] font-extrabold tracking-[-0.3px]">
            JobsAdmire
          </span>
          <span className="rounded-pill border border-white/15 bg-white/10 px-2.5 py-[3px] text-[10.5px] font-extrabold uppercase tracking-[1px] text-white/70">
            {t('crmlogin.045')}
          </span>
        </div>

        <div className="relative mt-8 xl:mt-10">
          <p className="text-eyebrow font-extrabold uppercase tracking-[1.6px] text-sky">
            {t('crmlogin.046')}
          </p>
          {/* The page's one h1 and its named LCP element (text, no resource). D20: visible on
              phones too, where the design hides the whole headline block. */}
          <h1 data-testid="page-h1" data-lcp-slot="h1" className="mt-3 text-h2 leading-[1.08]">
            {t('crmlogin.047')}
          </h1>
          <p className="mt-3 max-w-[430px] text-body leading-relaxed text-white/70">
            {t('crmlogin.048')}
          </p>
          {/* W10: hidden ≤900 px as in the design — CSS, never conditional rendering; W119: the
              media-variant `max-lg:hidden` beside the base `flex`. */}
          <ul
            data-testid="portal-points"
            className="mt-7 flex list-none flex-col gap-3 p-0 max-lg:hidden"
          >
            {POINT_IDS.map((id) => (
              <li key={id} className="flex items-start gap-3">
                <CheckDot />
                <span className="text-body-sm leading-normal text-white/80">{t(id)}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* crmlogin.016 ("~10 min") is not rendered — no signed reply SLA behind it (D17). */}
        <div
          data-testid="portal-trust"
          className="relative mt-8 flex items-center gap-3 max-lg:hidden"
        >
          <span className="min-w-0 text-body-sm font-bold text-white/60">{t('crmlogin.014')}</span>
          <ContactCta
            placement="page_cta"
            href={whatsappHref}
            external
            variant="inverse"
            className="ml-auto"
          >
            {t('crmlogin.012')}
          </ContactCta>
        </div>

        {android ? (
          <div data-testid="portal-app-desktop" className="relative mt-5 max-lg:hidden">
            <AppCard bundle={bundle} locale={locale} t={t} android={android} qr surface="panel" />
          </div>
        ) : null}

        {/* The licence chip (crmlogin.020, legal — verbatim) and the agency line; hidden ≤700 px
            as in the design. */}
        <div data-testid="portal-licence" className="relative mt-6 max-md:hidden">
          <p className="inline-flex items-center gap-2 rounded-pill border border-white/15 bg-white/[0.07] px-3 py-1.5 text-body-sm font-extrabold tracking-[0.4px] text-white/80">
            {t('crmlogin.020')}
          </p>
          <p className="mt-3 text-body-sm text-white/55">{t('crmlogin.021')}</p>
        </div>
      </div>

      {/* The chooser column (design .ja-cl-form). */}
      <div className="flex flex-col bg-white px-5 py-6 md:px-8 md:py-8 lg:px-9 lg:py-9 xl:px-[42px] xl:py-8">
        <div className="mb-6 flex items-center justify-between gap-3 xl:mb-8">
          <Link
            href="/"
            prefetch={false}
            className="inline-flex min-h-[44px] items-center gap-2 text-body-sm font-bold text-text-tertiary no-underline hover:text-ink"
          >
            <span aria-hidden="true">←</span>
            {t('crmlogin.001')}
          </Link>
          <LanguageSwitcher locale={locale} label={t('home.016')} />
        </div>

        <div className="mx-auto w-full max-w-[436px]">
          <h2 className="text-h2 leading-[1.12] text-ink">{t('crmlogin.002')}</h2>
          {/* crmlogin.003 describes the multi-portal choice D22 removed — sys copy instead. */}
          <p className="mt-2 text-body text-text-tertiary">{sys('portal.intro')}</p>

          {/* The one tile (W8): Partner Portal → login and forgot-password, same tab (R22 — a
              plain anchor in the button face; `Button external` would open a new tab). No
              Operations tile, no ChatAdmire/desk tile, no credential form (D22). */}
          <div
            data-testid="portal-tile"
            className="mt-6 rounded-base border-[1.5px] border-tint-border bg-pale-1 p-4"
          >
            <p className="flex items-center gap-2 text-body font-extrabold text-ink">
              <span aria-hidden="true" className="block h-2 w-2 flex-none rounded-pill bg-blue" />
              {t('crmlogin.043')}
            </p>
            <p className="mt-1 text-body-sm text-text-secondary">{t('crmlogin.044')}</p>
            <a
              href={loginHref}
              data-testid="portal-login-link"
              className={buttonClassName('primary', 'lg', 'mt-4 w-full')}
            >
              {sys('portal.signIn')}
            </a>
            <a
              href={forgotHref}
              data-testid="portal-forgot-link"
              className="mt-2 inline-flex min-h-[44px] items-center text-body-sm font-extrabold text-blue-safe no-underline hover:underline"
            >
              {t('crmlogin.005')}
            </a>
            <p className="mt-2 text-body-sm text-text-secondary">{t('crmlogin.054')}</p>
            <p className="mt-2 text-body-sm text-text-secondary">{tf('crmlogin.055')}</p>
          </div>

          {android ? (
            <details data-testid="portal-app-mobile" className="group mt-4 lg:hidden">
              <summary className="flex min-h-[50px] cursor-pointer list-none items-center gap-3 rounded-sm border-[1.5px] border-border-1 bg-pale-1 px-4 text-body-sm font-extrabold text-ink [&::-webkit-details-marker]:hidden">
                <span className="min-w-0">{t('crmlogin.013')}</span>
                <ChevronIcon />
              </summary>
              <div className="mt-2">
                <AppCard
                  bundle={bundle}
                  locale={locale}
                  t={t}
                  android={android}
                  qr={false}
                  surface="card"
                />
              </div>
            </details>
          ) : null}

          <div
            data-testid="portal-help"
            className="mt-5 rounded-base border border-border-1 bg-pale-1 p-4"
          >
            <h3 className="text-body-sm font-extrabold text-ink">{t('crmlogin.056')}</h3>
            <p className="mt-1 text-body-sm text-text-secondary">{tf('crmlogin.057')}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <ContactCta placement="page_cta" href={whatsappHref} external variant="secondary">
                {t('crmlogin.058')}
              </ContactCta>
              <Button prefetch={false} variant="ghost" href="/contact">
                {t('crmlogin.019')}
              </Button>
            </div>
          </div>

          {/* The anti-phishing note and the licence foot — legal-flagged package copy, verbatim
              (WP-C review). */}
          <p className="mt-4 flex items-start gap-2 text-body-sm font-bold text-text-secondary">
            <LockIcon />
            <span>{t('crmlogin.023')}</span>
          </p>
          <p className="mt-3 text-center text-body-sm font-bold text-text-secondary">
            {t('crmlogin.022')}
          </p>
        </div>
      </div>
    </div>
  );
}
