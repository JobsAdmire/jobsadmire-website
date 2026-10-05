import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ContactLink } from '@/analytics/ContactLink';
import { getBundle, makeTf } from '@/content/adapter';
import { getCollection } from '@/content/collections';
import { FaqBlock } from '@/design/blocks/FaqBlock';
import { Section } from '@/design/primitives/Section';
import { routing } from '@/i18n/routing';
import { listOpenings } from '@/lib/careers';
import { mailLink } from '@/lib/contact';
import { buildMetadata } from '@/lib/seo/metadata';
import { heroRoles, roleCards } from './_lib/roles';
import { CareersHero, WorkerNotice } from './_sections/Hero';
import { HiringSteps } from './_sections/HiringSteps';
import { OpenApplication } from './_sections/OpenApplication';
import { RolesSection } from './_sections/Roles';
import { WaysSection } from './_sections/Ways';

// The openings floor (docs/ARCHITECTURE.md § Freshness). A literal: Next reads segment config
// statically. No D17 dated badge here, so no 86,400 s rule (W150).
export const revalidate = 300;

/** The eight on-page pairs (design `faqList()`): the DOM and the FAQPage node from one source —
 *  never the design's seven hand-written JSON-LD answers. */
const FAQ = [
  ['jt.245', 'jt.246'],
  ['jt.247', 'jt.248'],
  ['jt.249', 'jt.250'],
  ['jt.251', 'jt.252'],
  ['jt.253', 'jt.254'],
  ['jt.255', 'jt.256'],
  ['jt.257', 'jt.258'],
  ['jt.259', 'jt.260'],
] as const;

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
  // The `careers` record has titleId/descriptionId '' — the page's own sys.seo copy (W23/W38).
  return buildMetadata({
    locale,
    href: '/careers',
    bundle,
    pageKey: 'careers',
    fallbackTitle: sys('seo.careers.title'),
    fallbackDescription: sys('seo.careers.description'),
  });
}

export default async function CareersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const [bundle, sys, openings] = await Promise.all([
    getBundle(locale),
    getTranslations('sys'),
    listOpenings(),
  ]);
  const t = makeTf(bundle, locale);
  const settings = bundle.settings;
  const cards = roleCards(openings, {
    locale,
    countries: getCollection(bundle, 'countries'),
    whatsappNumber: settings.whatsappNumber,
    now: new Date(),
    copy: {
      engagement: { fullTime: t('jt.099'), partTime: t('jt.100'), project: t('jt.073') },
      workMode: {
        REMOTE: sys('careers.workMode.REMOTE'),
        HYBRID: sys('careers.workMode.HYBRID'),
        ON_SITE: sys('careers.workMode.ON_SITE'),
      },
      posted: (date) => sys('careers.roles.posted', { date }),
      askIntro: t('jt.311'),
      askTail: t('jt.312'),
    },
  });

  return (
    <>
      <CareersHero
        t={t}
        locale={locale}
        openingsCount={cards.length}
        heroCards={heroRoles(cards)}
        sourceCountries={getCollection(bundle, 'sourceCountries')}
      />
      <WorkerNotice t={t} />
      <RolesSection t={t} cards={cards} />
      <WaysSection t={t} />
      <HiringSteps t={t} />
      <OpenApplication t={t} settings={settings} />
      <Section tone="pale" className="ja-reveal border-t border-border-3">
        <div data-testid="careers-faq" className="container-site">
          <FaqBlock
            bundle={bundle}
            locale={locale}
            id="faq"
            eyebrowId="jt.111"
            headingId="jt.112"
            openFirst
            panelClassName="ja-panel-soft"
            items={FAQ.map(([q, a]) => ({ id: q, q: t(q), a: t(a) }))}
            footer={
              // W102: the careers mailbox from settings, never the literal jt.114.
              <p className="mt-6 text-body-sm text-text-secondary">
                {t('jt.113')}{' '}
                <ContactLink
                  href={mailLink(settings.careersEmail)}
                  placement="page_cta"
                  className="font-extrabold text-blue-safe underline"
                >
                  {settings.careersEmail}
                </ContactLink>{' '}
                {t('jt.115')}
              </p>
            }
          />
        </div>
      </Section>
    </>
  );
}
