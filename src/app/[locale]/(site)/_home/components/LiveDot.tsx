/** The design's green "live" dot (`.ja-live`, the homepage's smaller ring: `.ja-live-soft`,
 *  src/design/motion/motion.css). Decorative; reduced motion stops the pulse. No directive:
 *  server and client trees both use it. */
export function LiveDot({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={[
        'ja-live ja-live-soft inline-block h-2 w-2 shrink-0 rounded-pill bg-success',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    />
  );
}
