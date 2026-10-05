import { makeTf } from '@/content/pure';
// By module path (W147): never the `@/design/blocks` / `@/design/primitives` barrels.
import { SampleTag } from '@/design/blocks/SampleTag';
import { Eyebrow } from '@/design/primitives/Eyebrow';
import { Section } from '@/design/primitives/Section';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import type { QuoteTone } from '../_lib/sample';
import type { Testimonial } from '../_lib/stories';

/** A quote as the section renders it: a consented row, or one of the design's samples. */
export type QuoteItem = Testimonial & { tone?: QuoteTone };

/** The initials tile (design L731/L742): blue on the tint, or navy on #edf1f9 (the SC tile). */
const TILE: Record<QuoteTone, string> = {
  blue: 'bg-tint text-blue-safe',
  navy: 'bg-[#edf1f9] text-indigo',
};

/** "In their words" (design L722–761, success.058–068): eyebrow, h2 and three quote cards with
 *  an initials tile. Consented rows (§10 row 11) render untagged; until one exists the page hands
 *  in the design's three quotes (`SAMPLE_QUOTES`) with `sample`, and the sample tag replaces the
 *  design's own "Placeholder quotes…" footnote (success.069). Nothing on an empty list. No
 *  Review JSON-LD in v1. Owns its own `Section` (W97 analogue). */
export function Testimonials({
  bundle,
  locale,
  items,
  sample = false,
}: {
  bundle: Bundle;
  locale: Locale;
  items: QuoteItem[];
  sample?: boolean;
}) {
  if (items.length === 0) return null;
  const t = makeTf(bundle, locale);
  return (
    <Section tone="light" className="ja-reveal pt-0 pb-[4.75rem] max-md:pb-10">
      <div className="container-site" data-testid="stories-testimonials">
        <div className="mb-3 flex flex-wrap items-center gap-2.5">
          <Eyebrow>{t('success.058')}</Eyebrow>
          {sample && <SampleTag />}
        </div>
        <h2 className="m-0 mb-[1.625rem] text-h2 max-md:mb-4 max-md:text-[24px] max-md:tracking-[-0.7px]">
          {t('success.059')}
        </h2>
        <ul className="m-0 grid list-none gap-4 p-0 max-md:gap-2.5 lg:grid-cols-3">
          {items.map((q) => (
            <li key={q.id} className="min-w-0">
              <article className="flex h-full flex-col rounded-md border border-edge bg-white px-7 py-[1.625rem] shadow-[0_14px_34px_rgba(22,60,90,0.07)] max-md:rounded-[15px] max-md:px-[18px] max-md:py-[17px] max-md:shadow-[0_6px_18px_rgba(22,60,90,0.06)]">
                <blockquote className="m-0 mb-5 text-[15.5px] leading-[1.6] font-bold text-ink max-md:mb-3.5 max-md:text-[14.5px] max-md:leading-[1.55] xl:text-[11.625px]">
                  {q.quote}
                </blockquote>
                <div className="mt-auto flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className={`flex h-[2.625rem] w-[2.625rem] shrink-0 items-center justify-center rounded-xs text-[15px] font-extrabold max-md:h-[38px] max-md:w-[38px] max-md:rounded-[11px] max-md:text-[13.5px] xl:text-[11.25px] ${TILE[q.tone ?? 'blue']}`}
                  >
                    {q.initials}
                  </span>
                  <div>
                    <p className="m-0 text-[14px] font-extrabold text-ink xl:text-[11px]">
                      {q.role}
                    </p>
                    <p className="m-0 text-[13px] font-semibold text-text-tertiary xl:text-[11px]">
                      {q.org}
                    </p>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
