import { JUMP_LINKS } from '../_lib/tables';

const LINK =
  'inline-flex min-h-[44px] items-center rounded-pill px-3.5 text-body-sm font-bold whitespace-nowrap text-text-secondary no-underline hover:bg-tint hover:text-blue-safe focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe max-md:border max-md:border-border-2 max-md:bg-pale-1';

/** "On this page" — same-page anchors only (they fire nothing, W12). Sticky under the 79 px
 *  header from 1101 px only (delta 15: below 901 px the header is 71 px and between 901 and
 *  1100 px its desktop row may wrap, W11 — no fixed offset is safe there); static below. At
 *  ≤ 700 px the design also hides the visible label (the nav keeps it as its accessible name). */
export function JumpNav({ tf }: { tf: (id: string) => string }) {
  const label = tf('wp.056');
  return (
    <nav
      aria-label={label}
      data-testid="wp-jump"
      className="z-30 border-b border-border-4 bg-white/95 backdrop-blur xl:sticky xl:top-[79px]"
    >
      <div className="container-site">
        {/* QA W221 WP-01: the design hides the row's scrollbar only ≤ 700 (`.ja-jump` phone rule);
            from 701 the scrollbar is the one affordance that tells a mouse user the eight chips
            scroll wherever they overflow (701–1100 in Turkish). */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-2.5 max-md:[scrollbar-width:none]">
          <span
            aria-hidden="true"
            className="mr-2 text-eyebrow font-extrabold tracking-[0.8px] whitespace-nowrap text-text-tertiary uppercase max-md:hidden"
          >
            {label}
          </span>
          <ul className="flex gap-1.5">
            {JUMP_LINKS.map((j) => (
              <li key={j.hash} className="flex-none">
                <a href={j.hash} className={LINK}>
                  {tf(j.labelId)}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
