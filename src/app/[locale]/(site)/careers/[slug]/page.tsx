import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getBundle, makeTf } from '@/content/adapter';
import { getCollection } from '@/content/collections';
import { Section } from '@/design/primitives/Section';
import { routing } from '@/i18n/routing';
import { getOpening, listOpenings } from '@/lib/careers';
import {
  baseSalaryOf,
  countryNameOf,
  detailHref,
  employmentTypeOf,
  locationOf,
  summaryOf,
} from '@/lib/careers-pure';
import { JsonLd } from '@/lib/seo/JsonLdScript';
import { jobPostingJsonLd } from '@/lib/seo/jsonld';
import { buildMetadata } from '@/lib/seo/metadata';
import { absoluteUrl, pageOgImageUrl } from '@/lib/seo/routes';
import { HiringSteps } from '../_sections/HiringSteps';
import { submitCareersApplication } from './actions';
import { openingView } from './_lib/view';
import { AboutRole } from './_sections/AboutRole';
import { ApplySection } from './_sections/ApplySection';
import { DetailHero } from './_sections/DetailHero';

// The openings floor (docs/ARCHITECTURE.md § Freshness) — a literal, read statically by Next.
export const revalidate = 300;

/** Every current opening, prerendered in both locales (the Operations slug is the same in both);
 *  a later one renders on demand (`dynamicParams`), an unknown one 404s. Without a door: `[]`. */
export async function generateStaticParams() {
  return (await listOpenings()).map((o) => ({ slug: o.slug }));
}

type Params = Promise<{ locale: string; slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const opening = await getOpening(slug);
  if (!opening) notFound();
  const [bundle, sys] = await Promise.all([
    getBundle(locale),
    getTranslations({ locale, namespace: 'sys' }),
  ]);
  const location = locationOf(
    opening,
    countryNameOf(opening.country, getCollection(bundle, 'countries'), locale),
  );
  const href = detailHref(opening.slug);
  return buildMetadata({
    locale,
    href,
    bundle,
    // W124: the `careersDetail` template record carries no per-page SEO field — these win.
    pageKey: 'careersDetail',
    fallbackTitle: sys('careers.detail.metaTitle', { title: opening.title }),
    fallbackDescription:
      summaryOf(opening.description, 155) ||
      sys('careers.detail.metaDescription', { title: opening.title, location }),
    // W17/D16: the Operations slug is the same in both locales — both alternates named.
    alternates: { tr: href, en: href },
    // W169: the OG route draws `sys.seo.<pageKey>.title` without values, so a template page cannot
    // carry a per-opening OG title: every opening shares the index's image (T12's pattern) and
    // its title template is `sys.careers.detail.metaTitle`, never a `sys.seo.*` key.
    openGraph: { images: [pageOgImageUrl(locale, 'careers')] },
  });
}

export default async function CareerDetailPage({ params }: { params: Params }) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const opening = await getOpening(slug);
  if (!opening) notFound();
  const [bundle, sys] = await Promise.all([getBundle(locale), getTranslations('sys')]);
  const t = makeTf(bundle, locale);
  const settings = bundle.settings;
  const view = openingView(opening, {
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
      salary: {
        range: (min, max) => sys('careers.salary.range', { min, max }),
        from: (amount) => sys('careers.salary.from', { amount }),
        upTo: (amount) => sys('careers.salary.upTo', { amount }),
        per: (period) => sys(`careers.salary.per.${period}`),
      },
      askIntro: t('jt.311'),
      askTail: t('jt.312'),
    },
  });
  const href = detailHref(opening.slug);

  return (
    <>
      {/* D15: JobPosting on the detail page only, from the live opening — datePosted is the API's
          postedAt; no validThrough, the API has none (D17). */}
      <JsonLd
        data={jobPostingJsonLd({
          title: opening.title,
          description: opening.description ?? opening.title,
          url: absoluteUrl(locale, href),
          datePosted: opening.postedAt,
          employmentType: employmentTypeOf(opening),
          hiringOrganization: settings,
          jobLocation: {
            city: opening.cities[0] ?? opening.city ?? view.countryName,
            country: opening.country,
          },
          baseSalary: baseSalaryOf(opening),
          identifier: opening.slug,
        })}
      />
      <DetailHero t={t} locale={locale} opening={opening} view={view} />
      <AboutRole opening={opening} view={view} engagementLabel={t('jt.049')} />
      <ApplySection
        t={t}
        locale={locale}
        opening={opening}
        view={view}
        settings={settings}
        action={submitCareersApplication}
      />
      <Section tone="light">
        <div className="container-site">
          <div className="max-w-[860px]">
            <HiringSteps t={t} variant="compact" />
          </div>
        </div>
      </Section>
    </>
  );
}
