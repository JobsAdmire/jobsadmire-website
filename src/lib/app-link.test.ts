import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { APP_LINK_PATH, IOS_USER_AGENT, appLinkRedirects } from './app-link';

// Read as data, the way next.config.ts consumes it (bundles reach pages only through the adapter, D23).
const storeLinks = (
  JSON.parse(readFileSync(join(process.cwd(), 'src/content/local/bundle.tr.json'), 'utf8')) as {
    settings: { storeLinks: unknown };
  }
).settings.storeLinks;

const IOS = 'https://apps.apple.com/pk/app/jobsadmire-partners/id6803849247';
const ANDROID = 'https://play.google.com/store/apps/details?id=com.jobsadmire.portal';

describe('appLinkRedirects (W227)', () => {
  it('sends Apple devices to the App Store first, everything else to Google Play', () => {
    const r = appLinkRedirects({ android: ANDROID, ios: IOS });
    expect(r).toEqual([
      {
        source: APP_LINK_PATH,
        has: [{ type: 'header', key: 'user-agent', value: IOS_USER_AGENT }],
        destination: IOS,
        permanent: false,
      },
      { source: APP_LINK_PATH, destination: ANDROID, permanent: false },
    ]);
  });

  it('the user-agent pattern matches iPhone/iPad/iPod and not Android or a desktop', () => {
    const rx = new RegExp(`^${IOS_USER_AGENT}$`);
    expect(
      rx.test(
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148',
      ),
    ).toBe(true);
    expect(rx.test('Mozilla/5.0 (iPad; CPU OS 16_6 like Mac OS X) AppleWebKit/605.1.15')).toBe(
      true,
    );
    expect(
      rx.test('Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 Chrome/124.0 Mobile'),
    ).toBe(false);
    expect(rx.test('Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124.0')).toBe(false);
  });

  it('falls back to the one store that exists, and to nothing without links', () => {
    expect(appLinkRedirects({ android: ANDROID, ios: null })).toEqual([
      { source: APP_LINK_PATH, destination: ANDROID, permanent: false },
    ]);
    expect(appLinkRedirects({ android: null, ios: IOS }).map((r) => r.destination)).toEqual([
      IOS,
      IOS,
    ]);
    expect(appLinkRedirects({ android: null, ios: null })).toEqual([]);
  });

  it('the LOCAL bundle carries both store links (W227)', () => {
    expect(storeLinks).toEqual({ android: ANDROID, ios: IOS });
  });
});
