import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ConversionPing } from '@/analytics/ConversionPing';
import { asFormKey } from '@/analytics/forms';
import { getBundle } from '@/content/adapter';
import { Button, Section } from '@/design/primitives';
import { routing } from '@/i18n/routing';
import { waLink } from '@/lib/contact';
import { buildMetadata } from '@/lib/seo/metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const bundle = await getBundle(locale);
  const sys = await getTranslations({ locale, namespace: 'sys' });
  return {
    ...buildMetadata({
      locale,
      href: '/thank-you',
      bundle,
      pageKey: 'thankYou',
      fallbackTitle: sys('thankYou.title'),
      fallbackDescription: sys('thankYou.body'),
    }),
    // Never indexed, whatever a later page record says: this exists only as the conversion
    // target every form lands on (D13) — robots.ts and the sitemap agree.
    robots: { index: false, follow: false },
  };
}

export default async function ThankYou({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  // Next hands every query param through as `string | string[]`; `?form=a&form=b` is a
  // malformed link, not two conversions — the first value decides, the rest are ignored.
  searchParams: Promise<{ form?: string | string[] }>;
}) {
  const [{ locale }, { form }] = await Promise.all([params, searchParams]);
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const [bundle, sys] = await Promise.all([getBundle(locale), getTranslations('sys')]);
  // The five keys D13 allows in `?form=`. Anything else — a stale link, a hand-typed URL —
  // gets the generic page and fires no conversion: an unrecognised key is not a lead.
  const formKey = asFormKey(Array.isArray(form) ? form[0] : form);
  return (
    <Section tone="light">
      <div className="container-site max-w-[720px]">
        <h1 className="text-h2">{sys('thankYou.title')}</h1>
        <p className="text-body-lg text-text-secondary">{sys('thankYou.body')}</p>
        {formKey && (
          <p className="text-body text-text-secondary">{sys(`thankYou.forms.${formKey}`)}</p>
        )}
        <div className="mt-8 flex flex-wrap gap-3">
          <Button variant="primary" size="lg" href="/">
            {sys('thankYou.home')}
          </Button>
          <Button
            variant="secondary"
            size="lg"
            external
            href={waLink(bundle.settings.whatsappNumber, sys('whatsapp.prefill'))}
          >
            {sys('thankYou.whatsapp')}
          </Button>
        </div>
      </div>
      {/* Fires the conversion once, on arrival, for a known form key only (D13). */}
      {formKey && <ConversionPing key={formKey} formKey={formKey} locale={locale} />}
    </Section>
  );
}
