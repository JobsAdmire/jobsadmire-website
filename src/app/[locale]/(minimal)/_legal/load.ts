import 'server-only';
import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getBundle, makeT } from '@/content/adapter';
import { routing } from '@/i18n/routing';
import {
  LEGAL_HOME_CRUMB_ID,
  LEGAL_HREF,
  LEGAL_SECTIONS,
  legalValues,
  type LegalDoc,
} from '@/lib/legal/documents';
import { buildMetadata } from '@/lib/seo/metadata';
import type { LegalDocumentProps } from './LegalDocument';

export type LegalParams = Promise<{ locale: string }>;

/** `generateMetadata` for one legal page: robots (`index`) and the breadcrumb JSON-LD flag come
 *  from the page record; the title and description from `sys.seo.<doc>.*` (W38) — server-only
 *  copy (W90/W148). */
export async function legalMetadata(params: LegalParams, doc: LegalDoc): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const [bundle, sys] = await Promise.all([
    getBundle(locale),
    getTranslations({ locale, namespace: 'sys' }),
  ]);
  return buildMetadata({
    locale,
    href: LEGAL_HREF[doc],
    bundle,
    pageKey: doc,
    fallbackTitle: sys(`seo.${doc}.title`),
    fallbackDescription: sys(`seo.${doc}.description`),
  });
}

/**
 * Everything one legal page renders, resolved on the server: every string from
 * `sys.legal.<doc>.*` (server-only — never a client island, W90/W148), every identifier the copy
 * cites passed as an ICU argument from settings (D17), the Home crumb from the package string
 * every page's own crumb carries (`LEGAL_HOME_CRUMB_ID` through `makeT`, W109/W176) — never
 * `sys.nav.home`.
 */
export async function loadLegal(params: LegalParams, doc: LegalDoc) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const [bundle, sys] = await Promise.all([getBundle(locale), getTranslations('sys')]);
  const values = legalValues(bundle.settings);
  const common = {
    locale,
    href: LEGAL_HREF[doc],
    homeLabel: makeT(bundle)(LEGAL_HOME_CRUMB_ID),
    title: sys(`legal.${doc}.title`),
    intro: sys(`legal.${doc}.intro`, values),
    updatedAt: sys(`legal.${doc}.updatedAt`),
    updatedLabel: sys('legal.updatedLabel'),
    contentsLabel: sys('legal.contents'),
    sections: LEGAL_SECTIONS[doc].map((id) => ({
      id,
      title: sys(`legal.${doc}.sections.${id}.title`),
      body: sys(`legal.${doc}.sections.${id}.body`, values),
    })),
  } satisfies Omit<LegalDocumentProps, 'bodyLang' | 'notice' | 'children'>;
  return { locale, sys, common };
}
