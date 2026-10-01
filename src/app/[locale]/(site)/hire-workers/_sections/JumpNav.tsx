const CHIPS = [
  ['#industries', 'hire.067'],
  ['#compare', 'hire.068'],
  ['#process', 'hire.069'],
  ['#faq', 'hire.070'],
] as const;

const CHIP =
  'inline-block whitespace-nowrap rounded-pill border px-4 py-2 text-body-sm font-extrabold no-underline';

/** The design's `.ja-jump` (≤ 700 px only): anchor chips to the page's sections, the last one
 *  dark. W10: server-rendered at every width, hidden from 701 px by CSS (`md:hidden`). */
export function JumpNav({ tf, label }: { tf: (id: string) => string; label: string }) {
  return (
    <nav
      aria-label={label}
      data-testid="hire-jump"
      className="border-b border-border-4 bg-white md:hidden"
    >
      <ul className="m-0 flex list-none gap-2 overflow-x-auto px-5 py-3.5 [scrollbar-width:none]">
        {CHIPS.map(([href, id]) => (
          <li key={href} className="flex-none">
            <a href={href} className={`${CHIP} border-tint-border bg-pale-1 text-blue-safe`}>
              {tf(id)}
            </a>
          </li>
        ))}
        <li className="flex-none">
          <a href="#request-form" className={`${CHIP} border-ink bg-ink text-white`}>
            {tf('hire.071')}
          </a>
        </li>
      </ul>
    </nav>
  );
}
