import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getBundle, makeT } from '@/content/adapter';
import { routing } from '@/i18n/routing';
import { LEGAL_HOME_CRUMB_ID } from '@/lib/legal/documents';
import { buildMetadata } from '@/lib/seo/metadata';
import { LegalDocument } from '../_legal/LegalDocument';
import type { LegalParams } from '../_legal/load';

const HREF = '/staff-app-privacy' as const;
const SECTIONS = ['collects', 'notCollected', 'sharing', 'retention', 'account', 'scope'] as const;

export async function generateMetadata({ params }: { params: LegalParams }): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const [bundle, sys] = await Promise.all([
    getBundle(locale),
    getTranslations({ locale, namespace: 'sys' }),
  ]);
  return buildMetadata({
    locale,
    href: HREF,
    bundle,
    pageKey: 'staffAppPrivacy',
    fallbackTitle: sys('seo.staffAppPrivacy.title'),
    fallbackDescription: sys('seo.staffAppPrivacy.description'),
  });
}

/** /staff-app-privacy · /en/staff-app-privacy — the privacy policy of the JA Operations staff
 *  phone app, linked from the App Store and Google Play listings. No page record in the bundle:
 *  its copy is `sys.legal.staffAppPrivacy.*` and its metadata the `sys.seo` fallback. */
export default async function StaffAppPrivacyPage({ params }: { params: LegalParams }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const [bundle, sys] = await Promise.all([getBundle(locale), getTranslations('sys')]);
  return (
    <LegalDocument
      locale={locale}
      href={HREF}
      homeLabel={makeT(bundle)(LEGAL_HOME_CRUMB_ID)}
      title={sys('legal.staffAppPrivacy.title')}
      intro={sys('legal.staffAppPrivacy.intro')}
      updatedAt={sys('legal.staffAppPrivacy.updatedAt')}
      updatedLabel={sys('legal.updatedLabel')}
      contentsLabel={sys('legal.contents')}
      sections={SECTIONS.map((id) => ({
        id,
        title: sys(`legal.staffAppPrivacy.sections.${id}.title`),
        body: sys(`legal.staffAppPrivacy.sections.${id}.body`),
      }))}
    />
  );
}
