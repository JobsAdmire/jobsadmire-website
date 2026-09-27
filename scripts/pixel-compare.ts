import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { extname, join, normalize } from 'node:path';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

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
 * W91: the built-route requests send x-vercel-protection-bypass (VERCEL_AUTOMATION_BYPASS_SECRET)
 * so `--base` can point at a Vercel-protected preview; the design side is our own throw-away
 * local server, which ignores the header harmlessly.
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
  const route = resolvePixelRoute(page, locale, readLocalBundle(locale), arg('route'));
  const design = PIXEL_PAGES[page].design;

  // Loaded here, not at module top, so the unit tests import the pure functions without
  // pulling the Playwright runner into Vitest.
  const { chromium } = await import('@playwright/test');
  const { server, origin } = await serveDesign();
  const browser = await chromium.launch();
  mkdirSync(OUT_DIR, { recursive: true });
  const results: Result[] = [];
  try {
    for (const width of widths) {
      const context = await browser.newContext({
        viewport: { width, height: 900 },
        deviceScaleFactor: 1,
        locale: locale === 'tr' ? 'tr-TR' : 'en-US',
        reducedMotion: 'reduce',
        // W91: reaches a Vercel-protected `--base` preview; harmless against the local design
        // server or a local built server, which never check the header.
        extraHTTPHeaders: {
          'x-vercel-protection-bypass': process.env.VERCEL_AUTOMATION_BYPASS_SECRET ?? '',
        },
      });
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

      const designPage = await context.newPage();
      await designPage.goto(`${origin}/${encodeURIComponent(design)}?lang=${locale}`, {
        waitUntil: 'networkidle',
        timeout: 90_000,
      });
      await designPage.waitForSelector('h1', { state: 'attached', timeout: 30_000 });
      await designPage.evaluate(async () => {
        await document.fonts.ready;
      });
      await designPage.waitForTimeout(800);
      const designPng = PNG.sync.read(await designPage.screenshot({ fullPage: true }));

      const builtPage = await context.newPage();
      await builtPage.goto(`${base}${route}`, { waitUntil: 'networkidle', timeout: 60_000 });
      await builtPage.evaluate(async () => {
        await document.fonts.ready;
      });
      await builtPage.waitForTimeout(300);
      const builtPng = PNG.sync.read(await builtPage.screenshot({ fullPage: true }));
      await context.close();

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

if (require.main === module) void main();
