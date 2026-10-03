import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ConversionPing } from '@/analytics/ConversionPing';
import { asFormKey } from '@/analytics/forms';
import { getBundle } from '@/content/adapter';
// By module path, not the barrel (W147): a server component's barrel import makes every
// 'use client' primitive the barrel re-exports a client reference of the route.
import { Button } from '@/design/primitives/Button';
import { Section } from '@/design/primitives/Section';
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
    // QA W221 SYS-04 / SYS-N1: the page's own sys.seo pair (W23) — "Teşekkürler | JobsAdmire" in
    // the tab and on the OG card, not the bare h1 word; the h1 keeps thankYou.title.
    ...buildMetadata({
      locale,
      href: '/thank-you',
      bundle,
      pageKey: 'thankYou',
      fallbackTitle: sys('seo.thankYou.title'),
      fallbackDescription: sys('seo.thankYou.description'),
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
  // The ten keys D13 allows in `?form=` (R55 — one per PRD §2 handler type). Anything else —
  // a stale link, a hand-typed URL — gets the generic page and fires no conversion: an
  // unrecognised key is not a lead.
  const formKey = asFormKey(Array.isArray(form) ? form[0] : form);
  return (
    <Section tone="light">
      {/* Final pass D3 (W178, T13): `.container-site` is unlayered, so a `max-w-*` utility on the
          same element never applied — the 720 px reading column is an inner, centred wrapper. */}
      <div className="container-site">
        <div className="mx-auto max-w-[720px]">
          <h1 className="text-h2" data-testid="page-h1" data-lcp-slot="h1">
            {sys('thankYou.title')}
          </h1>
          {/* QA W221 SYS-02: the reset zeroes paragraph margins — explicit spacing under the h1 */}
          <p className="mt-3 text-body-lg text-text-secondary">{sys('thankYou.body')}</p>
          {formKey && (
            <p className="mt-2 text-body text-text-secondary">{sys(`thankYou.forms.${formKey}`)}</p>
          )}
          <div className="mt-8 flex flex-wrap gap-3">
            <Button prefetch={false} variant="primary" size="lg" href="/">
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
      </div>
      {/* Fires the conversion once, on arrival, for a known form key only (D13). */}
      {formKey && <ConversionPing key={formKey} formKey={formKey} locale={locale} />}
    </Section>
  );
}
