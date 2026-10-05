import { Eyebrow } from '@/design/primitives/Eyebrow';
import { Section } from '@/design/primitives/Section';
import { Link } from '@/i18n/navigation';
import { AlertIcon } from '../_components/icons';
import { sp } from '../_lib/fragments';
import { PENALTY_IDS, RULES } from '../_lib/tables';

/** "What the Ministry checks before approving" (#rules): the side column (sticky from 901 px,
 *  as designed, at `--sticky-top`: below the header and, from 1101 px, the sticky jump nav —
 *  W232; its old `top-40` sat 19–55 px under the jump nav there) with the W10 intro variants
 *  and the legal-flagged penalty box, and the six numbered rules. Below 901 px the rules list
 *  comes first and the penalty box after it, as designed (`order`). */
export function Rules({ tf }: { tf: (id: string) => string }) {
  const [intro, link, tail] = [tf('wp.189'), tf('wp.190'), tf('wp.191')];
  const [mobA, mobB, mobC] = [tf('wp.192'), tf('wp.193'), tf('wp.194')];
  return (
    <Section tone="light" id="rules" className="scroll-mt-24 lg:scroll-mt-32 xl:scroll-mt-40">
      <div className="container-site" data-testid="wp-rules">
        <div className="grid items-start gap-16 max-lg:flex max-lg:flex-col max-lg:gap-0 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="min-w-0 max-lg:contents lg:sticky lg:top-(--sticky-top)">
            <div className="min-w-0">
              <Eyebrow>{tf('wp.187')}</Eyebrow>
              <h2 className="m-0 mt-3.5 mb-3.5 text-h2 leading-[1.05] tracking-[-0.03em] max-md:text-[25px] max-md:leading-[1.12] max-md:tracking-[-0.5px]">
                {tf('wp.188')}
              </h2>
              <p className="m-0 mb-6.5 text-body text-text-secondary max-md:mb-4">
                <span data-testid="wp-rules-desk" className="max-md:hidden">
                  {intro}
                  {sp(intro, link)}
                  <Link
                    prefetch={false}
                    href="/hire-workers"
                    className="font-extrabold text-blue-safe no-underline hover:underline"
                  >
                    {link}
                  </Link>
                  {sp(link, tail)}
                  {tail}
                </span>
                <span data-testid="wp-rules-mob" className="md:hidden">
                  {mobA}
                  {sp(mobA, mobB)}
                  <strong className="font-extrabold text-ink">{mobB}</strong>
                  {sp(mobB, mobC)}
                  {mobC}
                </span>
              </p>
            </div>
            <div
              data-testid="wp-penalties"
              className="max-lg:order-2 max-lg:mt-4 rounded-base border border-danger-border bg-danger-surface px-6 py-5.5 max-md:px-4 max-md:py-3.5"
            >
              <p className="m-0 mb-3 flex items-center gap-2.5 text-body font-extrabold text-danger">
                <AlertIcon size={18} className="flex-none" />
                {tf('wp.195')}
              </p>
              <ul className="flex flex-col gap-2 text-body-sm text-[#7f1d1d] max-md:gap-0">
                {PENALTY_IDS.map((id) => (
                  <li
                    key={id}
                    className="max-md:border-t max-md:border-danger-border max-md:py-1.5 max-md:first:border-t-0 max-md:first:pt-0"
                  >
                    {tf(id)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <ol
            data-testid="wp-rules-list"
            className="flex min-w-0 flex-col gap-3.5 max-lg:order-1 max-md:gap-2.5"
          >
            {RULES.map((r, i) => (
              <li
                key={r.titleId}
                className="flex items-start gap-4 rounded-base border border-border-2 bg-white px-6.5 py-5.5 max-md:gap-3 max-md:rounded-sm max-md:px-3.5 max-md:py-3.5"
              >
                {/* D20: blue-safe — white on the design's #1899d5 is 3.2:1 */}
                <span
                  aria-hidden="true"
                  className="flex h-8.5 w-8.5 flex-none items-center justify-center rounded-pill bg-blue-safe text-body-sm font-extrabold text-white"
                >
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <h3 className="m-0 mb-1 text-body-lg font-extrabold">{tf(r.titleId)}</h3>
                  <p className="m-0 text-body-sm text-text-secondary xl:max-w-[500px]">
                    {tf(r.bodyId)}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}
