/** D20: the first focusable element on every page; jumps to `#main`. */
export function SkipLink({ label }: { label: string }) {
  return (
    <a
      href="#main"
      className="sr-only rounded-pill bg-navy px-5 font-extrabold text-white focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:inline-flex focus:min-h-[44px] focus:items-center"
    >
      {label}
    </a>
  );
}
