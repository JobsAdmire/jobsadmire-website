import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { hasLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { ImageResponse } from 'next/og';
import { getBundle } from '@/content/adapter';
import { routing } from '@/i18n/routing';
import { ogSubline, ogTitle } from '@/lib/seo/og';
import { OG_PAGE_KEYS } from '@/lib/seo/routes';

/** One PNG per page × locale, cached a day (docs/SEO.md § OG images). A content change reaches
 *  the image on the next revalidation; nothing here is per-request. Node runtime (the default
 *  for route handlers): the font is read from disk, never fetched. */
export const revalidate = 86400;

const WIDTH = 1200;
const HEIGHT = 630;

// Design tokens as literals (tokens.color.navy / ink / sky): this route must not pull the
// design barrel into a Node route.
const NAVY = '#0e1a37';
const INK = '#16202e';
const SKY = '#7fd0f5';

let archivoBold: Promise<Buffer> | undefined;
/** Font bytes are read once per instance. `join(process.cwd(), '<literal>')` is the pattern
 *  Next's file tracer recognises, and `next.config.ts` lists the folder in
 *  `outputFileTracingIncludes` for this route as well, so the file ships with the function. */
function loadArchivoBold(): Promise<Buffer> {
  archivoBold ??= readFile(join(process.cwd(), 'src/design/fonts/Archivo-Bold.ttf'));
  return archivoBold;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string; pageKey: string }> },
) {
  const { locale, pageKey: file } = await params;
  // The `.png` suffix keeps the URL out of proxy.ts's matcher (`.*\..*`) so next-intl never
  // rewrites it under a locale — docs/ARCHITECTURE.md § Routing.
  if (!hasLocale(routing.locales, locale) || !file.endsWith('.png'))
    return new Response(null, { status: 404 });
  const pageKey = file.slice(0, -'.png'.length);
  if (!OG_PAGE_KEYS.has(pageKey)) return new Response(null, { status: 404 });

  const [bundle, sys, font] = await Promise.all([
    getBundle(locale),
    getTranslations({ locale, namespace: 'sys' }),
    loadArchivoBold(),
  ]);
  const copy = { t: (key: string) => sys(key), has: (key: string) => sys.has(key) };
  const title = ogTitle(bundle, pageKey, copy);
  const subline = ogSubline(bundle, pageKey, copy);

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '64px 72px',
        background: `linear-gradient(135deg, ${NAVY} 0%, ${INK} 100%)`,
        color: '#ffffff',
        fontFamily: 'Archivo',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 18 }}>
        <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: -1 }}>JobsAdmire</div>
        <div style={{ fontSize: 24, color: SKY }}>jobsadmire.com</div>
      </div>
      <div
        style={{
          display: 'flex',
          fontSize: title.length > 56 ? 52 : 66,
          fontWeight: 700,
          lineHeight: 1.08,
          letterSpacing: -1.5,
          maxWidth: 1040,
        }}
      >
        {title}
      </div>
      <div style={{ display: 'flex', fontSize: 26, lineHeight: 1.35, color: SKY, maxWidth: 1000 }}>
        {subline}
      </div>
    </div>,
    {
      width: WIDTH,
      height: HEIGHT,
      fonts: [{ name: 'Archivo', data: font, weight: 700, style: 'normal' }],
      // ImageResponse's own default is a year, immutable; the CDN/browser lifetime follows the
      // ISR window instead so a title change reaches crawlers within a day.
      headers: { 'Cache-Control': `public, max-age=${revalidate}` },
    },
  );
}
