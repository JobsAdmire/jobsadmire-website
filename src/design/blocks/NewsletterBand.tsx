import type { ReactNode } from 'react';
import { makeTf } from '@/content/pure';
import { MailIcon } from '@/design/chrome/icons';
// By module path (W147): FormShell/Field are client modules; the action is the shared
// `'use server'` wrapper around the `newsletter` spec (src/forms/newsletter/).
import { Field } from '@/forms/client/Field';
import { FormShell } from '@/forms/client/FormShell';
import { submitNewsletter } from '@/forms/newsletter/actions';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../contract/website-bundle.v1';

/** The band's own form when a page passes no children: `<FormShell formKey="newsletter"
 *  layout="inline">` around one e-mail `Field` — placeholder "İş e-postanız" (blog.041, also its
 *  visually hidden label), submit "Abone olun →" (blog.039), the KVKK checkbox below (W79),
 *  success → /tesekkurler?form=newsletter (D13), the D11 fallback panel otherwise. */
function NewsletterForm({ bundle, locale, id }: { bundle: Bundle; locale: Locale; id: string }) {
  const t = makeTf(bundle, locale);
  const { settings } = bundle;
  return (
    <FormShell
      action={submitNewsletter}
      formKey="newsletter"
      locale={locale}
      turnstileSiteKey={settings.turnstileSiteKey}
      whatsappNumber={settings.whatsappNumber}
      contact={{
        phone: settings.phone,
        phoneDisplay: settings.phoneDisplay,
        email: settings.email,
      }}
      submitLabel={t('blog.039')}
      layout="inline"
      idScope={id}
      id={`${id}-form`}
      testId={`${id}-form`}
    >
      <Field
        name="email"
        type="email"
        label={t('blog.041')}
        required
        autoComplete="email"
        inputMode="email"
        maxLength={254}
      />
    </FormShell>
  );
}

/** The Blog/Article newsletter band in the design's face (SHARED 14.6 — Blog ll. 671–692,
 *  Article DC 775–795): a white r22 card with the #d3e6f2 edge and a top-left glow, the 64 px
 *  gradient mail tile, the title (blog.036, ≈ 21 px at 1440 — `text-band`), the sub (blog.037)
 *  with its "no spam" line (blog.038, green and on its own line on phones), and the form slot on
 *  the right; on phones a pale gradient card with everything stacked. Phase A rendered nothing
 *  (`active={false}`, W5); the owner switched the `newsletter` form on (2026-10-05), so a page
 *  flips its `NEWSLETTER_ACTIVE` and mounts `<NewsletterBand … active proofId="blog.040" />`: with
 *  no `children` the band renders its own inline form (`NewsletterForm` above, the shared
 *  `submitNewsletter` action); `children` replaces it for a page that needs a different form.
 *  `proofId` (blog.040, "200+ employers…") prints the design's proof line under the form. */
export function NewsletterBand({
  bundle,
  locale,
  active,
  id = 'newsletter',
  proofId,
  children,
}: {
  bundle: Bundle;
  locale: Locale;
  active: boolean;
  id?: string;
  proofId?: string;
  children?: ReactNode;
}) {
  if (!active) return null;
  const t = makeTf(bundle, locale);
  return (
    <div
      id={id}
      className="relative grid items-center gap-10 overflow-hidden rounded-xl border border-edge bg-white px-[52px] py-11 shadow-[0_16px_40px_rgba(22,60,90,0.07)] max-lg:gap-6 max-lg:px-8 max-md:gap-4 max-md:rounded-lg max-md:border-[#cfe3f0] max-md:bg-gradient-to-b max-md:from-[#f7fbfd] max-md:to-[#eaf4fa] max-md:px-[18px] max-md:pt-[22px] max-md:pb-5 max-md:shadow-[0_14px_34px_rgba(22,60,90,0.08)] lg:grid-cols-[1fr_auto] xl:px-[39px] xl:py-[33px]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-[100px] -left-[70px] h-[300px] w-[300px] rounded-pill bg-[radial-gradient(circle,rgba(24,153,213,0.10),transparent_65%)]"
      />
      <div className="relative flex items-center gap-6 max-md:items-start max-md:gap-[13px]">
        <span
          aria-hidden="true"
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-blue to-blue-safe text-white shadow-[0_12px_26px_rgba(24,153,213,0.3)] max-md:h-11 max-md:w-11 max-md:rounded-sm xl:h-12 xl:w-12"
        >
          <MailIcon size={26} />
        </span>
        <div>
          <h2 className="m-0 mb-1.5 text-band tracking-[-1.2px] max-md:mb-[5px] max-md:text-[20px] max-md:leading-[1.18] max-md:tracking-[-0.7px]">
            {t('blog.036')}
          </h2>
          <p className="m-0 text-[15px] leading-[1.6] text-text-secondary max-md:text-[13.5px] max-md:leading-[1.5] xl:text-[11.25px]">
            {t('blog.037')}{' '}
            <strong className="font-bold text-ink max-md:mt-1 max-md:block max-md:text-[12.5px] max-md:text-success-text">
              {t('blog.038')}
            </strong>
          </p>
        </div>
      </div>
      <div className="relative flex min-w-0 flex-col gap-2 lg:min-w-[340px] xl:min-w-[255px]">
        {children ?? <NewsletterForm bundle={bundle} locale={locale} id={id} />}
        {proofId && (
          <p className="m-0 pl-1 text-[12.5px] font-semibold text-text-tertiary max-md:pl-0 max-md:text-center max-md:text-[12px] xl:text-[11px]">
            {t(proofId)}
          </p>
        )}
      </div>
    </div>
  );
}
