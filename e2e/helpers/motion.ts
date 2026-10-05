import type { Page } from '@playwright/test';

/**
 * Puts the design's motion (src/design/motion/motion.css) at its end state before an axe run.
 *
 * axe reads opacity: a sweep taken mid-fade (a hero entrance, a panel dropping in, the blog's
 * rotating word) reports a part-transparent text colour as a contrast failure no visitor ever
 * sees, and a section still waiting to scroll in (opacity 0) is skipped as hidden — so the sweep
 * would check less than it did before the motion existed. This reveals every `.ja-reveal` /
 * `.ja-reveal-group` and gives every animation and transition a zero duration and delay (reduced
 * motion's own trick) without emulating reduced motion, which would also hide the marquee
 * pause toggles the sweep must still see (R20).
 */
export async function settleMotion(page: Page): Promise<void> {
  await page.addStyleTag({
    content:
      '*,*::before,*::after{animation-delay:0s!important;animation-duration:0s!important;' +
      'transition-delay:0s!important;transition-duration:0s!important}',
  });
  await page.evaluate(() => {
    document
      .querySelectorAll('.ja-reveal, .ja-reveal-group')
      .forEach((el) => el.classList.add('ja-reveal-on'));
  });
}
