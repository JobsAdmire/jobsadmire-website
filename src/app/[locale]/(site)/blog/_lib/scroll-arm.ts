/**
 * B-13: the latch `ScrollEnhancementsLoader` waits for — the visitor's first scroll, or a page
 * that is already scrolled when it hydrates (a `#hash` link). Before that nothing the
 * enhancements draw is visible (the reading bar sits at 0 %, the back-to-top button and the
 * sticky bar appear only after scrolling), so their chunk is fetched later and never counts in
 * the first-load audit (Lighthouse does not scroll). Once armed it stays armed for the session.
 * Nothing is armed on the server or during hydration. A plain module: client modules only.
 */
let armed = false;

export const scrollArm = {
  subscribe(onChange: () => void): () => void {
    if (armed) return () => {};
    const arm = () => {
      armed = true;
      onChange();
    };
    window.addEventListener('scroll', arm, { passive: true, once: true });
    return () => window.removeEventListener('scroll', arm);
  },
  isArmed: (): boolean => armed || window.scrollY > 0,
  isArmedOnServer: (): boolean => false,
  /** Tests only. */
  reset(): void {
    armed = false;
  },
};
