import { ContactLink } from '@/analytics/ContactLink';
import { ContactCta } from '@/design/blocks/ContactCta';
import { mailLink } from '@/lib/contact';
import { GoToFormButton } from './GoToFormButton';

/**
 * The closing band (design `#pool-cta` `.ja-close`, ll. 914–926): SHARED 9.1's light centred
 * full-bleed band — #f4f9fc → #e8f3f9 under a #d3e6f2 edge, the solid green WhatsApp CTA and the
 * white outline hiring link (r11), the licence line with its tracked mailto inside. Page-local
 * because `ClosingCtaBand tone="light"` takes its `note` as plain text (the e-mail must stay a
 * `ContactLink`) and has no phone-only replacement CTA: on phones both links give way to one dark
 * "Request these candidates →" that opens the request card (M8). The sticky bar hides near
 * `#pool-cta`.
 */
export function ClosingBand({
  title,
  body,
  whatsapp,
  hiring,
  phoneCta,
  licence,
  email,
  waHire,
}: {
  /** `availworkers.105`, `106` */
  title: string;
  body: string;
  /** `108` → the page's one WhatsApp prefill */
  whatsapp: string;
  /** `109` → the Hire Workers request form */
  hiring: string;
  /** `107` — the phone CTA */
  phoneCta: string;
  /** `110` — the licence line before the e-mail */
  licence: string;
  email: string;
  waHire: string;
}) {
  return (
    <section
      id="pool-cta"
      data-testid="workers-closing"
      className="border-t border-edge bg-gradient-to-b from-pale-1 to-[#e8f3f9] py-18 max-md:py-10.5"
    >
      <div className="container-site">
        <div className="mx-auto max-w-[900px] text-center">
          <h2 className="text-h2 m-0 mb-3.5 leading-[1.05] tracking-[-1.6px] max-md:mb-2.25 max-md:text-[25px] max-md:leading-[1.12] max-md:tracking-[-0.5px] xl:tracking-[-1.2px] xl:text-balance">
            {title}
          </h2>
          <p className="mx-auto mt-0 mb-7 max-w-[600px] text-[17px] leading-[1.65] font-semibold text-text-secondary max-md:mb-4.5 max-md:text-[14.5px] max-md:leading-[1.55] xl:text-[12.75px]">
            {body}
          </p>
          <div className="flex flex-wrap justify-center gap-3.5">
            <GoToFormButton label={phoneCta} />
            <ContactCta
              placement="page_cta"
              variant="success-solid"
              size="lg"
              shape="rect"
              radius={11}
              external
              href={waHire}
              className="max-md:hidden"
            >
              {whatsapp}
            </ContactCta>
            <ContactCta
              placement="page_cta"
              variant="outline-blue"
              size="lg"
              shape="rect"
              radius={11}
              prefetch={false}
              href={{ pathname: '/hire-workers', hash: '#request-form' }}
              className="max-md:hidden"
            >
              {hiring}
            </ContactCta>
          </div>
          <p className="m-0 mt-6.5 text-[13.5px] text-text-tertiary max-md:mt-4.5 max-md:text-[12px] max-md:leading-[1.6] xl:text-[11px]">
            {licence}{' '}
            <ContactLink
              href={mailLink(email)}
              placement="page_cta"
              className="font-bold text-blue-safe underline"
            >
              {email}
            </ContactLink>
          </p>
        </div>
      </div>
    </section>
  );
}
