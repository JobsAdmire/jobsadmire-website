import { describe, expect, it } from 'vitest';
import { SiteChrome } from '../SiteChrome';
import { renderWithIntl } from '@/test/render';
import trBundle from '@/content/local/bundle.tr.json';
import { BundleSchema, type Bundle } from '../../../../contract/website-bundle.v1';

// R13: a parsed bundle, never a cast — the real generated TR bundle, like the sibling
// Header/Footer/SlimBar suites, so the sweep below walks the whole real chrome tree (nav
// groups, portal pill, accent, footer accordion copy) rather than a minimal fixture.
const bundle: Bundle = BundleSchema.parse(trBundle);

const DISPLAY_UTILITIES = new Set([
  'inline-flex',
  'flex',
  'inline-block',
  'block',
  'grid',
  'inline-grid',
  'inline',
  'table',
  'contents',
]);

/** W119: `hidden` only wins the cascade over a base display utility when that utility carries
 *  a variant prefix (`max-xl:`, `sm:`, `hover:` …) — a bare `hidden` token sorts BEFORE a bare
 *  `inline-flex` token in Tailwind's own stylesheet order, so the bare display utility wins
 *  the tie and the element never actually hides. Token equality (not substring/regex matching)
 *  is exactly what "carries a variant" needs: `max-xl:hidden` and `xl:inline-flex` are
 *  different literal tokens from `hidden`/`inline-flex`, so they never trip this check. */
function hasUnguardedHidden(className: string): boolean {
  const tokens = className.split(/\s+/).filter(Boolean);
  return tokens.includes('hidden') && tokens.some((tok) => DISPLAY_UTILITIES.has(tok));
}

// SVG elements expose `.className` as an SVGAnimatedString, not a string (the chrome's inline
// icons are all `aria-hidden` SVGs) — `getAttribute('class')` is the one accessor that returns
// a plain string for both HTML and SVG elements alike.
function classNamesOf(container: HTMLElement): string[] {
  return Array.from(container.querySelectorAll('*'))
    .map((el) => el.getAttribute('class'))
    .filter((c): c is string => Boolean(c));
}

describe('hasUnguardedHidden — the checker the render sweep below uses', () => {
  it('flags a bare `hidden` beside an unprefixed display utility (the pre-fix secondary CTA class)', () => {
    expect(
      hasUnguardedHidden('inline-flex items-center hidden whitespace-nowrap xl:inline-flex'),
    ).toBe(true);
  });

  it('accepts a media-variant `max-xl:hidden` beside the same base `inline-flex` (the fix)', () => {
    expect(hasUnguardedHidden('inline-flex items-center max-xl:hidden whitespace-nowrap')).toBe(
      false,
    );
  });
});

describe('no chrome element pairs a bare `hidden` with an unprefixed display utility (W119)', () => {
  it.each(['default', 'minimal'] as const)('variant="%s"', (variant) => {
    const { container } = renderWithIntl(
      <SiteChrome locale="tr" bundle={bundle} variant={variant}>
        <div>content</div>
      </SiteChrome>,
    );
    const offenders = classNamesOf(container).filter(hasUnguardedHidden);
    expect(offenders).toEqual([]);
  });
});
