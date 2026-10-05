import { describe, expect, it } from 'vitest';
import { SiteChrome } from '../SiteChrome';
import { renderWithIntl } from '@/test/render';
import trBundle from '@/content/local/bundle.tr.json';
import { BundleSchema } from '../../../../contract/website-bundle.v1';

// R13: a parsed bundle, never a cast — the real generated TR bundle, like the sibling
// Header/Footer/SlimBar/visibility suites.
const bundle = BundleSchema.parse(trBundle);

describe('SiteChrome <main> (M3)', () => {
  it('is a real focus target for the skip link, with no visible ring of its own', () => {
    const { container } = renderWithIntl(
      <SiteChrome locale="tr" bundle={bundle}>
        <p>content</p>
      </SiteChrome>,
    );
    const main = container.querySelector<HTMLElement>('main#main')!;
    expect(main).toHaveAttribute('tabindex', '-1');
    expect(main.className).toContain('focus:outline-none');
    expect(main.className).toContain('scroll-mt-(--header-h)'); // W232: the skip link clears the header
    // Programmatic focus (what the skip link does) must actually land here — Chrome moves
    // sequential focus to the target but leaves `document.activeElement` on `body` unless the
    // element itself is focusable (M3).
    main.focus();
    expect(document.activeElement).toBe(main);
  });
});
