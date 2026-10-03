/** The design's green "live" dot (`.ja-live`). Decorative; the global reduced-motion rule
 *  (`src/app/globals.css`) stops the pulse. No directive: server and client trees both use it. */
export function LiveDot({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={[
        'inline-block h-2 w-2 shrink-0 rounded-pill bg-success motion-safe:animate-pulse',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    />
  );
}
