import { ContactCta } from '@/design/blocks/ContactCta';
import type { Cta } from '@/design/blocks/ClosingCtaBand';

/**
 * About's closing green band (design `.ja-green-cta`, About l. 907–918) — a page-local face of
 * `ClosingCtaBand tone="green"` (SHARED 9.4) for what that tone does not draw yet: the design's
 * 100° gradient surface, its 28 px title (`text-band`) and its phone face. The surface keeps the
 * gradient in the contrast-safe green family (#12813c → #0f6d33; the design's #10b981 → #059669
 * is 2.5:1 under white — W128b/D20), so the copy and the secondary's text stay full white. The
 * primary is the white face with green text (`white-green`, the design's #059669 on white); the
 * WhatsApp secondary is the darkened translucent face `inverse-dark` (≈ 5.6:1, the design's
 * white/15 fill lightens the green to 3.9:1). Rectangles of 12 px (SHARED 5.1). Phones (≤ 700,
 * l. 383–391): a white radial glow top-right, the body hidden, one full-width r14 white button
 * with a shadow, WhatsApp hidden. Both CTAs render through `ContactCta` (placement `page_cta`):
 * the WhatsApp door fires `whatsapp_click`, the request-form object href is a typed `Link`.
 */
export function GreenBand({
  title,
  body,
  primary,
  secondary,
}: {
  title: string;
  body: string;
  primary: Cta;
  secondary?: Cta;
}) {
  return (
    <div className="relative flex flex-wrap items-center justify-between gap-8 overflow-hidden rounded-lg bg-[linear-gradient(100deg,var(--color-success-text),var(--color-success-deep))] px-11 py-9.5 text-white max-md:gap-4.5 max-md:rounded-xl max-md:px-5.5 max-md:pt-7 max-md:pb-6.5 max-md:shadow-[0_16px_38px_rgba(5,150,105,0.24)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-[110px] -right-20 hidden h-[260px] w-[260px] rounded-pill bg-[radial-gradient(circle,rgba(255,255,255,0.2),transparent_70%)] max-md:block"
      />
      <div className="relative min-w-0">
        <h2 className="m-0 mb-1.5 text-band tracking-[-0.5px] text-white max-md:mb-0 max-md:text-[26px] max-md:leading-[1.1] max-md:tracking-[-0.8px]">
          {title}
        </h2>
        <p className="m-0 text-body text-white max-md:hidden">{body}</p>
      </div>
      <div className="relative flex flex-wrap gap-3.5 max-md:w-full max-md:flex-col max-md:gap-2.5">
        <ContactCta
          placement="page_cta"
          variant={primary.variant ?? 'white-green'}
          size="lg"
          href={primary.href}
          external={primary.external}
          prefetch={false}
          shape="rect"
          radius={12}
          className="max-md:w-full max-md:rounded-[14px] max-md:shadow-[0_10px_26px_rgba(3,40,26,0.28)]"
        >
          {primary.label}
        </ContactCta>
        {secondary ? (
          <ContactCta
            placement="page_cta"
            variant={secondary.variant ?? 'inverse-dark'}
            size="lg"
            href={secondary.href}
            external={secondary.external}
            prefetch={false}
            shape="rect"
            radius={12}
            className="max-md:hidden"
          >
            {secondary.label}
          </ContactCta>
        ) : null}
      </div>
    </div>
  );
}
