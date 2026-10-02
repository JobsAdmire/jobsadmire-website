import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { extname, join, normalize } from 'node:path';
import type { APIResponse, BrowserContextOptions } from '@playwright/test';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import { bypassWarning, protectionBypassHeaders } from '../e2e/helpers/bypass';

/**
 * D27 pixel harness: the design package's own page (`design-package/design/<Page>.dc.html`,
 * served over a throw-away static server so `./support.js` and friends resolve) against the
 * built route at 390 / 900 / 1440, full page, reduced motion, pixelmatch diff. Four nominated
 * pages (W15): Homepage, Hire Workers, Cost Calculator, Blog Article. Every other page is
 * side-by-side review. The two-iteration cap and the logged deltas are a ledger rule
 * (docs/superpowers/plans/2026-09-20-wp2-pixel-harness.md), not code.
 *
 *   npm run pixel -- --page=home [--locale=tr|en] [--base=http://localhost:3100] [--route=/x] [--widths=390,900,1440]
 *
 * Needs network (the design runtime loads React/Babel from unpkg and Archivo from Google Fonts)
 * and a running build of this site (`--base`, default E2E_BASE_URL or http://localhost:3000).
 * Never part of the gate or CI. Output under .pixel/ (git-ignored).
 *
 * W138: like for like, never a score for a broken page. The design capture is clipped to the
 * zoomed content box (at 1440 the design's `html { zoom: 0.75 }` would otherwise give a 1920-wide
 * canvas, 43 % blank); both pages must answer 2xx or the harness exits 2 naming the URL; a blog
 * article with no body in the locale, or a page still in UNBUILT_PATHNAMES, is skipped (exit 0,
 * nothing scored).
 *
 * W137: `--base` may point at a Vercel-protected preview. The bypass header
 * (VERCEL_AUTOMATION_BYPASS_SECRET, e2e/helpers/bypass.ts) goes ONLY to the built origin's
 * requests — `context.route(<origin>/**)` on the built page's own context, and only when the
 * secret is non-blank. The design page gets a context of its own with no extra header: even an
 * empty one forces a CORS preflight that fonts.gstatic.com and jsdelivr refuse (it broke the
 * design's Archivo and its map data), and a real one would reach every third party it calls.
 *
 * W189 (amends W138): the site loads Archivo with `display: 'optional'` (W188), so a cold capture
 * can keep next/font's size-adjusted fallback for the whole page view — `document.fonts.ready`
 * means loaded, not drawn. In the BUILT page's context only, the page's own CSS responses are
 * rewritten from `font-display:optional` to `block` (`builtCssRoute`), and before the screenshot
 * CDP's `CSS.getPlatformFontsForNode` must show the h1 drawn in Archivo (`ensureFontDrawn`):
 * one reload if not, exit 2 if still not. The design page is untouched.
 */
const ROOT = join(__dirname, '..');
const DESIGN_DIR = join(ROOT, 'design-package', 'design');
const OUT_DIR = join(ROOT, '.pixel');

export const PIXEL_WIDTHS = [390, 900, 1440] as const;
export type PixelLocale = 'tr' | 'en';
export type PixelPageKey = 'home' | 'hire' | 'calc' | 'blog-article';

/** The two fields of Task 1's blog rows (W33) this harness reads; slugs are nullable per locale. */
type BlogRow = {
  slug: { tr: string | null; en: string | null };
  hasBody: { tr: boolean; en: boolean };
};
export type PixelBundle = { collections: { blog?: BlogRow[] } };

export const PIXEL_PAGES: Record<
  PixelPageKey,
  { design: string; route: Record<PixelLocale, string> | 'blog' }
> = {
  home: { design: 'JobsAdmire Homepage v4.dc.html', route: { tr: '/', en: '/en' } },
  hire: { design: 'Hire Workers.dc.html', route: { tr: '/isci-talebi', en: '/en/hire-workers' } },
  calc: {
    design: 'Hiring Cost Calculator.dc.html',
    route: { tr: '/maliyet-hesaplayici', en: '/en/hiring-cost-calculator' },
  },
  // The one written article (CONTENT-MODEL § Blog); its slug comes from the blog collection.
  // T12 ships the body before this page can be compared; --route overrides the lookup.
  'blog-article': { design: 'Blog Article.dc.html', route: 'blog' },
};

export function resolvePixelRoute(
  page: PixelPageKey,
  locale: PixelLocale,
  bundle: PixelBundle | null,
  override?: string | null,
): string {
  if (override) return override;
  const spec = PIXEL_PAGES[page];
  if (spec.route !== 'blog') return spec.route[locale];
  const row = bundle?.collections.blog?.find((b) => b.hasBody[locale] && b.slug[locale]);
  if (!row) throw new Error(`pixel: no blog body in ${locale} — pass --route=/blog/<slug>`);
  return locale === 'tr' ? `/blog/${row.slug.tr}` : `/en/blog/${row.slug.en}`;
}

/** W138: each nominated page's internal pathname (`src/i18n/routing.ts`), for the unbuilt check. */
const PIXEL_PATHNAMES: Record<PixelPageKey, string> = {
  home: '/',
  hire: '/hire-workers',
  calc: '/hiring-cost-calculator',
  'blog-article': '/blog/[slug]',
};

/** W138: the built route to compare, or why there is nothing to score yet (exit 0): a blog
 *  article with no body in this locale (Phase A), or a page whose pathname is still in
 *  `UNBUILT_PATHNAMES` (a page task deletes its key when it lands, W20). `--route` overrides
 *  both; the 2xx check (`gotoOk`) still guards whatever is captured. */
export function pixelTarget(
  page: PixelPageKey,
  locale: PixelLocale,
  bundle: PixelBundle | null,
  override: string | null,
  unbuilt: ReadonlySet<string>,
): { route: string } | { skip: string } {
  if (override) return { route: override };
  if (PIXEL_PAGES[page].route === 'blog' && !resolvesBlog(locale, bundle)) {
    return { skip: `no blog body in ${locale} (pass --route=/blog/<slug> to force one)` };
  }
  const pathname = PIXEL_PATHNAMES[page];
  if (unbuilt.has(pathname)) return { skip: `${pathname} is not built yet (UNBUILT_PATHNAMES)` };
  return { route: resolvePixelRoute(page, locale, bundle) };
}

function resolvesBlog(locale: PixelLocale, bundle: PixelBundle | null): boolean {
  try {
    resolvePixelRoute('blog-article', locale, bundle);
    return true;
  } catch {
    return false;
  }
}

/** W138: the design screenshot's clip — the viewport width by the zoomed page height.
 *  `pageHeight` is what Playwright's own full-page size reads (unzoomed CSS px), `zoom` the
 *  root element's computed zoom: at 1440 the design's `html { zoom: 0.75 }` paints its
 *  1920 × 7830 layout into 1440 × 5873, and the capture keeps exactly that box. */
export function designClip(
  viewportWidth: number,
  pageHeight: number,
  zoom: number,
): { x: number; y: number; width: number; height: number } {
  return { x: 0, y: 0, width: viewportWidth, height: Math.ceil(pageHeight * zoom) };
}

/** A harness failure with its exit code (W138: 2 when a page did not answer 2xx). */
export class PixelExit extends Error {
  readonly code: number;
  constructor(message: string, code: number) {
    super(message);
    this.name = 'PixelExit';
    this.code = code;
  }
}

/** N2/W159: `designClip` assumes `pageHeight × zoom` is the true zoomed content height, with
 *  nothing checking it — a wrong read would silently crop or pad the design capture instead of
 *  failing loud. Cross-checked here against the document's own scroll height — `htmlScrollHeight`
 *  / `bodyScrollHeight` (the larger of the two; browsers disagree on which one grows with
 *  content) × `zoom` — compared with `clipHeight`, the clip `designClip` already computed, within
 *  1 px of rounding tolerance either side. W159: never an element's client box
 *  (`getBoundingClientRect()`/`clientHeight` of the root element) — under `html { zoom: .75 }`
 *  that reads only the viewport's rendered size (900 px on the design pages), not the scrolled
 *  content height, and wrongly exited 2 on every real page taller than one screen. */
export function checkZoomedHeight({
  htmlScrollHeight,
  bodyScrollHeight,
  zoom,
  clipHeight,
}: {
  htmlScrollHeight: number;
  bodyScrollHeight: number;
  zoom: number;
  clipHeight: number;
}): void {
  const expected = Math.ceil(Math.max(htmlScrollHeight, bodyScrollHeight) * zoom);
  if (Math.abs(expected - clipHeight) > 1) {
    throw new PixelExit(
      `pixel: scrollHeight×zoom (${expected}) disagrees with the clip height (${clipHeight}) by more than 1px — the zoom/height read is unreliable for this page (N2/W159)`,
      2,
    );
  }
}

type GotoOptions = { waitUntil: 'load' | 'domcontentloaded' | 'networkidle'; timeout: number };

/** The slice of Playwright's `Page` the status check uses (structural, for the tests). */
export type PageLike = {
  goto(url: string, options: GotoOptions): Promise<{ ok(): boolean; status(): number } | null>;
};

/** W138: navigate, and refuse anything but a 2xx answer — an unbuilt route or a missing design
 *  file (404), a protected preview without the secret (401): never scored, exit 2. */
export async function gotoOk(page: PageLike, url: string, options: GotoOptions): Promise<void> {
  const res = await page.goto(url, options);
  if (!res?.ok()) {
    const answer = res ? `HTTP ${res.status()}` : 'no response';
    throw new PixelExit(`pixel: ${url} answered ${answer}; nothing is scored (W138)`, 2);
  }
}

function padTo(src: PNG, width: number, height: number): PNG {
  if (src.width === width && src.height === height) return src;
  const out = new PNG({ width, height });
  out.data.fill(255);
  PNG.bitblt(src, out, 0, 0, Math.min(src.width, width), Math.min(src.height, height), 0, 0);
  return out;
}

/** Pads both captures to the larger canvas (white), then pixelmatch at threshold 0.1. */
export function comparePngs(
  design: PNG,
  built: PNG,
): { diff: PNG; width: number; height: number; diffPixels: number; match: number } {
  const width = Math.max(design.width, built.width);
  const height = Math.max(design.height, built.height);
  const a = padTo(design, width, height);
  const b = padTo(built, width, height);
  const diff = new PNG({ width, height });
  const diffPixels = pixelmatch(a.data, b.data, diff.data, width, height, { threshold: 0.1 });
  const match = Math.round((1 - diffPixels / (width * height)) * 10_000) / 100;
  return { diff, width, height, diffPixels, match };
}

/** W137: what every capture context is — viewport, scale, locale, reduced motion — and nothing
 *  else: the design page's context is exactly this, never an extra header. */
export function captureContextOptions(width: number, locale: PixelLocale): BrowserContextOptions {
  return {
    viewport: { width, height: 900 },
    deviceScaleFactor: 1,
    locale: locale === 'tr' ? 'tr-TR' : 'en-US',
    reducedMotion: 'reduce',
  };
}

/** The slice of Playwright's `Route` the built-origin handler uses (structural, for the tests). */
export type RouteLike = {
  request(): { headers(): Record<string, string> };
  continue(options: { headers: Record<string, string> }): Promise<void>;
};

/** W137: the built page's context adds `headers` to its own origin's requests only (third
 *  parties the built page calls get nothing from here); `null` when the secret is blank, so
 *  nothing is intercepted at all. */
export function builtOriginRoute(
  base: string,
  headers: Record<string, string>,
): { url: string; handler: (route: RouteLike) => Promise<void> } | null {
  if (!Object.keys(headers).length) return null;
  return {
    url: `${new URL(base).origin}/**`,
    handler: (route) => route.continue({ headers: { ...route.request().headers(), ...headers } }),
  };
}

/** W189: every `font-display: optional` in a stylesheet becomes `block` — the browser then waits
 *  for the (preloaded) web font instead of keeping the fallback for the page view. Pure; the
 *  count is logged per capture so a run that rewrote nothing is visible. */
export function forceFontDisplayBlock(css: string): { css: string; replaced: number } {
  let replaced = 0;
  const out = css.replace(/font-display\s*:\s*optional/gi, () => {
    replaced += 1;
    return 'font-display:block';
  });
  return { css: out, replaced };
}

/** W190 (optional hardening): a capture that rewrote NO `font-display:optional` rule either drew
 *  the whole view in the fallback face or never saw the web font's sheet at all — a score taken
 *  that way is not comparable. One sentence for stderr; `null` once at least one rule was rewritten. */
export function fontRewriteWarning(rewritten: number, label: string): string | null {
  if (rewritten > 0) return null;
  return `pixel: warning — ${label}: no font-display:optional rule was rewritten (W189/W190) — the built capture may have been drawn in the fallback face; check the stylesheet routing before scoring`;
}

/** The slice of Playwright's `APIResponse` the CSS rewrite reads (structural, for the tests). */
export type FetchedLike = { text(): Promise<string> };
/** The slice of Playwright's `Route` the CSS rewrite uses (structural, for the tests). */
export type CssRouteLike<R extends FetchedLike> = {
  request(): { headers(): Record<string, string> };
  fetch(options?: { headers?: Record<string, string> }): Promise<R>;
  fulfill(options: { response: R; body: string }): Promise<void>;
};

/** W189: the built context's stylesheet handler — the built origin's `.css` responses only (the
 *  design page has a context of its own and is never routed). It fetches the sheet itself, with
 *  the W137 bypass header when one is set (Playwright runs the LAST registered matching route
 *  first, so this handler, registered after `builtOriginRoute`'s, must carry the header too),
 *  and fulfils it with `font-display:block`. */
export function builtCssRoute(
  base: string,
  headers: Record<string, string>,
  onRewrite?: (replaced: number) => void,
): {
  url: (url: URL) => boolean;
  handler: <R extends FetchedLike>(route: CssRouteLike<R>) => Promise<void>;
} {
  const origin = new URL(base).origin;
  return {
    url: (url) => url.origin === origin && url.pathname.endsWith('.css'),
    handler: async (route) => {
      const response = Object.keys(headers).length
        ? await route.fetch({ headers: { ...route.request().headers(), ...headers } })
        : await route.fetch();
      const { css, replaced } = forceFontDisplayBlock(await response.text());
      onRewrite?.(replaced);
      await route.fulfill({ response, body: css });
    },
  };
}

/** The slice of a CDP `CSS.PlatformFontUsage` the decision reads. */
export type PlatformFont = { familyName: string; glyphCount: number };

/** W189: a node is drawn in `family` when that platform font carries every glyph of it. Under the
 *  fallback the platform reports the LOCAL face next/font's `<family> Fallback` resolves to
 *  (Arial, Helvetica), never the family itself; a mixed draw (a subset still missing) is not the
 *  web font either. */
export function drawnInFamily(fonts: readonly PlatformFont[], family = 'Archivo'): boolean {
  const name = family.toLowerCase();
  const isFamily = (f: PlatformFont) =>
    f.familyName.toLowerCase().includes(name) && !/fallback/i.test(f.familyName);
  const inFamily = fonts.filter(isFamily).reduce((n, f) => n + f.glyphCount, 0);
  const other = fonts.filter((f) => !isFamily(f)).reduce((n, f) => n + f.glyphCount, 0);
  return inFamily > 0 && other === 0;
}

/** W189: read the h1's platform fonts; reload once when it is not drawn in Archivo; refuse to
 *  score (exit 2, naming the URL and what was drawn) when it still is not. */
export async function ensureFontDrawn(
  readFonts: () => Promise<PlatformFont[]>,
  reload: () => Promise<void>,
  url: string,
): Promise<'first' | 'reloaded'> {
  if (drawnInFamily(await readFonts())) return 'first';
  await reload();
  const fonts = await readFonts();
  if (drawnInFamily(fonts)) return 'reloaded';
  const drawn = fonts.map((f) => `${f.familyName} ×${f.glyphCount}`).join(', ') || 'no text';
  throw new PixelExit(
    `pixel: ${url} — the h1 is not drawn in Archivo after one reload (${drawn}); nothing is scored (W189)`,
    2,
  );
}

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
};

/** Static server for design-package/design/ — the .dc.html files need HTTP, not file:// (README). */
function serveDesign(): Promise<{ server: Server; origin: string }> {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      if (req.method !== 'GET') {
        res.writeHead(405).end();
        return;
      }
      const path = decodeURIComponent(new URL(req.url ?? '/', 'http://x').pathname);
      const file = normalize(join(DESIGN_DIR, path));
      if (!file.startsWith(DESIGN_DIR) || !existsSync(file)) {
        res.writeHead(404).end();
        return;
      }
      res.writeHead(200, { 'content-type': MIME[extname(file)] ?? 'application/octet-stream' });
      res.end(readFileSync(file));
    });
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address() as AddressInfo;
      resolve({ server, origin: `http://127.0.0.1:${port}` });
    });
  });
}

function arg(name: string): string | null {
  const hit = process.argv.slice(2).find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : null;
}

function readLocalBundle(locale: PixelLocale): PixelBundle | null {
  // The sanctioned readFileSync bypass for scripts/ (D23 governs src/**, not tooling).
  const file = join(ROOT, 'src', 'content', 'local', `bundle.${locale}.json`);
  return existsSync(file) ? (JSON.parse(readFileSync(file, 'utf8')) as PixelBundle) : null;
}

/** W189: the platform fonts CDP reports for the h1 and its descendants (a heading whose text
 *  sits inside spans reports nothing on the h1 node itself), merged by family. */
async function h1PlatformFonts(page: import('@playwright/test').Page): Promise<PlatformFont[]> {
  const cdp = await page.context().newCDPSession(page);
  try {
    await cdp.send('DOM.enable');
    await cdp.send('CSS.enable');
    const { root } = await cdp.send('DOM.getDocument', { depth: -1 });
    const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: root.nodeId, selector: 'h1' });
    if (!nodeId) return [];
    const { nodeIds } = await cdp.send('DOM.querySelectorAll', {
      nodeId: root.nodeId,
      selector: 'h1 *',
    });
    const merged = new Map<string, number>();
    for (const id of [nodeId, ...nodeIds]) {
      const { fonts } = await cdp.send('CSS.getPlatformFontsForNode', { nodeId: id });
      for (const f of fonts)
        merged.set(f.familyName, (merged.get(f.familyName) ?? 0) + f.glyphCount);
    }
    return [...merged].map(([familyName, glyphCount]) => ({ familyName, glyphCount }));
  } finally {
    await cdp.detach();
  }
}

type Result = {
  width: number;
  designHeight: number;
  builtHeight: number;
  diffPixels: number;
  match: number;
};

async function main() {
  const page = arg('page') as PixelPageKey | null;
  if (!page || !(page in PIXEL_PAGES)) {
    console.error(`pixel: --page=${Object.keys(PIXEL_PAGES).join('|')} is required`);
    process.exit(2);
  }
  const locale = (arg('locale') ?? 'tr') as PixelLocale;
  if (locale !== 'tr' && locale !== 'en') {
    console.error('pixel: --locale must be tr or en');
    process.exit(2);
  }
  const base = (arg('base') ?? process.env.E2E_BASE_URL ?? 'http://localhost:3000').replace(
    /\/$/,
    '',
  );
  const widths = (arg('widths')?.split(',').map(Number) ?? [...PIXEL_WIDTHS]).filter(Boolean);
  // Loaded here, not at module top: the unit tests inject their own unbuilt set.
  const { UNBUILT_PATHNAMES } = await import('../src/lib/seo/routes');
  const target = pixelTarget(
    page,
    locale,
    readLocalBundle(locale),
    arg('route'),
    UNBUILT_PATHNAMES,
  );
  if ('skip' in target) {
    console.log(`pixel: ${page} ${locale} skipped: ${target.skip}; nothing is scored (W138)`);
    return;
  }
  const { route } = target;
  const design = PIXEL_PAGES[page].design;

  const warning = bypassWarning(base);
  if (warning) console.warn(`pixel: warning — ${warning}`);
  const bypass = protectionBypassHeaders();
  const builtRoute = builtOriginRoute(base, bypass);

  // Loaded here, not at module top, so the unit tests import the pure functions without
  // pulling the Playwright runner into Vitest.
  const { chromium } = await import('@playwright/test');
  const { server, origin } = await serveDesign();
  const browser = await chromium.launch();
  mkdirSync(OUT_DIR, { recursive: true });
  const results: Result[] = [];
  try {
    for (const width of widths) {
      const newCaptureContext = async () => {
        const context = await browser.newContext(captureContextOptions(width, locale));
        // Design side: language + hint via the package's own localStorage keys; built side: the
        // LanguageHint's HINT_KEY ('ja-lang-hint'), same value — one init script serves both.
        await context.addInitScript((lang: string) => {
          try {
            localStorage.setItem('ja-lang', lang);
            localStorage.setItem('ja-lang-hint', 'off');
          } catch {
            /* storage blocked — the hint is then a tolerated delta */
          }
        }, locale.toUpperCase());
        return context;
      };

      // W137: two contexts. The design page's never carries the bypass header.
      const designContext = await newCaptureContext();
      const designPage = await designContext.newPage();
      await gotoOk(designPage, `${origin}/${encodeURIComponent(design)}?lang=${locale}`, {
        waitUntil: 'networkidle',
        timeout: 90_000,
      });
      await designPage.waitForSelector('h1', { state: 'attached', timeout: 30_000 });
      await designPage.evaluate(async () => {
        await document.fonts.ready;
      });
      await designPage.waitForTimeout(800);
      // W138: the same metrics Playwright's full-page size reads, and the zoom the design applies.
      const { pageHeight, zoom, htmlScrollHeight, bodyScrollHeight } = await designPage.evaluate(
        () => {
          const html = document.documentElement;
          const body = document.body ?? html;
          return {
            pageHeight: Math.max(
              body.scrollHeight,
              html.scrollHeight,
              body.offsetHeight,
              html.offsetHeight,
              body.clientHeight,
              html.clientHeight,
            ),
            zoom: parseFloat(getComputedStyle(html).zoom) || 1,
            // W159: the document's own scroll height — never an element's client box, which
            // under zoom reads only the viewport (see checkZoomedHeight below).
            htmlScrollHeight: html.scrollHeight,
            bodyScrollHeight: body.scrollHeight,
          };
        },
      );
      const clip = designClip(width, pageHeight, zoom);
      checkZoomedHeight({ htmlScrollHeight, bodyScrollHeight, zoom, clipHeight: clip.height });
      const designPng = PNG.sync.read(await designPage.screenshot({ fullPage: true, clip }));
      await designContext.close();

      // The built page's context: the header on its own origin's requests only (W137).
      const builtContext = await newCaptureContext();
      if (builtRoute) await builtContext.route(builtRoute.url, builtRoute.handler);
      // W189: registered after the bypass route, so it runs first on the built origin's CSS.
      let rewritten = 0;
      const css = builtCssRoute(base, bypass, (n) => (rewritten += n));
      await builtContext.route(css.url, (r) => css.handler<APIResponse>(r));
      const builtPage = await builtContext.newPage();
      const builtUrl = `${base}${route}`;
      await gotoOk(builtPage, builtUrl, { waitUntil: 'networkidle', timeout: 60_000 });
      const fontsReady = () =>
        builtPage.evaluate(async () => {
          await document.fonts.ready;
        });
      await fontsReady();
      const drawn = await ensureFontDrawn(
        () => h1PlatformFonts(builtPage),
        async () => {
          await builtPage.reload({ waitUntil: 'networkidle', timeout: 60_000 });
          await fontsReady();
        },
        builtUrl,
      );
      console.log(
        `pixel: ${page} ${locale} @${width} — font-display optional→block in ${rewritten} rule(s); h1 drawn in Archivo (${drawn} load) (W189)`,
      );
      const fontWarning = fontRewriteWarning(rewritten, `${page} ${locale} @${width}`);
      if (fontWarning) console.warn(fontWarning);
      await builtPage.waitForTimeout(300);
      const builtPng = PNG.sync.read(await builtPage.screenshot({ fullPage: true }));
      await builtContext.close();

      const cmp = comparePngs(designPng, builtPng);
      const stem = join(OUT_DIR, `${page}-${locale}-${width}`);
      writeFileSync(`${stem}.png`, PNG.sync.write(cmp.diff));
      writeFileSync(`${stem}-design.png`, PNG.sync.write(designPng));
      writeFileSync(`${stem}-built.png`, PNG.sync.write(builtPng));
      results.push({
        width,
        designHeight: designPng.height,
        builtHeight: builtPng.height,
        diffPixels: cmp.diffPixels,
        match: cmp.match,
      });
      console.log(
        `pixel: ${page} ${locale} @${width} → ${cmp.match.toFixed(2)} % match (design ${designPng.height}px, built ${builtPng.height}px) → ${stem}.png`,
      );
    }
  } finally {
    await browser.close();
    server.close();
  }

  const reportFile = join(OUT_DIR, 'report.json');
  const report: Record<string, unknown> = existsSync(reportFile)
    ? (JSON.parse(readFileSync(reportFile, 'utf8')) as Record<string, unknown>)
    : {};
  report[`${page}-${locale}`] = {
    base,
    route,
    design,
    generatedAt: new Date().toISOString(),
    results,
  };
  writeFileSync(reportFile, JSON.stringify(report, null, 1));
  console.log(`pixel: report → ${reportFile}`);
}

if (require.main === module) {
  main().catch((e: unknown) => {
    console.error(e instanceof Error ? e.message : e);
    process.exit(e instanceof PixelExit ? e.code : 1);
  });
}
