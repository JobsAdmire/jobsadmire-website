import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { expectHeroPhoto } from '../helpers/hero-photo';
import { expectedRobots } from '../helpers/face';
import { settleMotion } from '../helpers/motion';

// Canonicals, hreflang and JSON-LD URLs come from SITE_URL — the production origin — whatever
// host the run hits (e2e/seo.spec.ts's rule).
const ORIGIN = 'https://www.jobsadmire.com';
const SLUG = 'turkey-work-permit-process-employer-guide';
const EN_ARTICLE = `/en/blog/${SLUG}`;
/** A leaked ICU token, an `undefined`, or a next-intl missing-key fallback (`sys.blog…`). */
const LEAK = /\{[A-Za-z][A-Za-z0-9]*\}|undefined|\bsys\./;

async function expectOneCleanH1(page: Page) {
  await expect(page.locator('h1')).toHaveCount(1);
  const h1 = page.getByTestId('page-h1');
  await expect(h1).toHaveAttribute('data-lcp-slot', 'h1');
  expect(((await h1.textContent()) ?? '').trim().length).toBeGreaterThan(0);
  await expect(page.locator('[data-lcp-slot]')).toHaveCount(1);
  expect(await page.locator('body').innerText()).not.toMatch(LEAK);
}

async function jsonLd(page: Page): Promise<Record<string, unknown>[]> {
  const texts = await page.locator('script[type="application/ld+json"]').allTextContents();
  return texts.map((t) => JSON.parse(t) as Record<string, unknown>);
}

test.describe('/en/blog — the index of the published articles (W248)', () => {
  test('hero with the cadence pill, the one article as the only card of the grid, featured; indexable', async ({
    page,
  }) => {
    const res = await page.goto('/en/blog');
    expect(res?.status()).toBe(200);
    await expectOneCleanH1(page);
    // W233: the hero photo is licensed stock — decorative and preloaded; the h1 keeps the slot
    await expectHeroPhoto(page.locator('img[src*="blog.jpg"]'), '/hero/blog.jpg');
    await expect(page.locator('img[data-lcp-slot]')).toHaveCount(0);
    await expect(page.getByTestId('hero-word-static')).toHaveText('employers');
    await expect(page.getByTestId('page-h1')).toHaveAccessibleName('Insights for employers');
    await expect(page.getByTestId('blog-cadence')).toHaveText('New article every week');
    await expect(page.getByTestId('blog-tools')).toBeVisible();
    // W250: one uniform grid — the one written EN article is its only card, the featured one
    // (its pill), the whole card its title link
    const grid = page.locator('#blog-grid');
    await expect(grid.locator('li[data-post-key]')).toHaveCount(1);
    const featured = grid.getByTestId('blog-featured');
    await expect(featured.getByRole('link', { name: /work permit process/i })).toHaveAttribute(
      'href',
      EN_ARTICLE,
    );
    await expect(featured).toContainText('FEATURED');
    await expect(featured).not.toContainText('Read article →');
    // W248: real published posts only — no "yakında" card anywhere, never the empty state;
    // W250: no "most read" panel until real read counts exist, no load-more for one card
    await expect(page.locator('[data-soon-tag]')).toHaveCount(0);
    await expect(page.getByTestId('blog-most-read')).toHaveCount(0);
    await expect(page.getByTestId('blog-load-more')).toHaveCount(0);
    await expect(page.getByTestId('blog-empty')).toHaveCount(0);
    // the newsletter band with its own form (owner, 2026-10-05)
    await expect(page.locator('#newsletter input[type="email"]')).toHaveCount(1);
    // Owner 2026-10-05: the index is always in the nav, in the sitemap and indexable
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'index, follow');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `${ORIGIN}/en/blog`,
    );
    await expect(page.locator('link[rel="alternate"][hreflang="tr"]')).toHaveAttribute(
      'href',
      `${ORIGIN}/blog`,
    );
    const crumbs = page.getByRole('navigation', { name: 'Breadcrumb' });
    await expect(crumbs.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/en');
    await expect(crumbs.locator('[aria-current="page"]')).toHaveText('Blog');
    const nodes = await jsonLd(page);
    expect(nodes.filter((n) => n['@type'] === 'BreadcrumbList')).toHaveLength(1);
    expect(nodes.filter((n) => n['@type'] === 'FAQPage')).toHaveLength(0);
  });

  test('the tools count the listed article and answer a miss with the no-results panel', async ({
    page,
  }) => {
    await page.goto('/en/blog');
    const status = page.getByTestId('blog-tools-status');
    await expect(status).toHaveText('1 article');
    await page.getByRole('searchbox', { name: 'Search articles' }).fill('permit');
    await expect(status).toHaveText('1 article for “permit”');
    await expect(page.getByTestId('blog-no-results')).toHaveCount(0);
    await page.getByRole('searchbox', { name: 'Search articles' }).fill('zzzz');
    await expect(page.getByTestId('blog-no-results')).toBeVisible();
  });

  test('desktop: the hero art, the topic chips and the EN/TR pair; the CTA band says "WhatsApp"', async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'the art, chips and EN/TR show from 701 px');
    await page.goto('/en/blog');
    const art = page.getByTestId('blog-hero-art');
    await expect(art).toBeVisible();
    await expect(art).toContainText('Most read');
    // one topic chip per category the listed articles carry (W248: one article, one topic)
    await page.getByTestId('blog-tools').getByText('Work Permits', { exact: true }).click();
    await expect(page.getByTestId('blog-tools-status')).toHaveText(/ · Work Permits$/);
    const pair = page.getByTestId('blog-tools').getByRole('group', { name: 'Language' });
    await expect(pair.getByRole('link', { name: 'EN' })).toHaveAttribute('aria-current', 'page');
    await expect(pair.getByRole('link', { name: 'TR' })).toHaveAttribute('href', '/blog');
    await expect(page.locator('#blog-cta').getByRole('link', { name: 'WhatsApp' })).toBeVisible();
  });

  test('mobile: the strip, the count line and the topic sheet; WhatsApp hidden in the CTA band', async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'the phone faces exist below 701 px');
    await page.goto('/en/blog');
    await expect(page.getByTestId('blog-hero-art')).toBeHidden();
    await expect(page.getByTestId('blog-phone-strip')).toContainText('1');
    await expect(page.getByTestId('blog-result-line')).toHaveText('1 article');
    await page.getByTestId('blog-topic-button').click();
    const sheet = page.getByRole('dialog');
    await sheet.getByText('Work Permits', { exact: true }).click();
    await expect(sheet).toBeHidden();
    await expect(page.getByTestId('blog-result-line')).toContainText('Work Permits');
    await expect(page.locator('#blog-cta').getByRole('link', { name: 'WhatsApp' })).toBeHidden();
  });

  test('the rotating word turns without resizing the h1, and pauses — floats too — on request (B-4)', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/en/blog');
    // Measure once the fonts have settled (display: optional since W188 — no swap; fonts.ready is a guard) so only the rotation could move the box.
    await page.evaluate(async () => {
      await document.fonts.ready;
    });
    const h1 = page.getByTestId('page-h1');
    const current = page.getByTestId('hero-word-live').locator('[data-current]');
    const before = await h1.boundingBox();
    await expect(current).not.toHaveText('employers', { timeout: 6000 });
    expect(await h1.boundingBox()).toEqual(before);
    await page.getByTestId('hero-word-toggle').click();
    await expect(page.getByTestId('hero-word-toggle')).toHaveAccessibleName('Play');
    await expect(page.locator('#blog-hero')).toHaveAttribute('data-paused', '');
    const paused = (await current.textContent()) ?? '';
    await page.waitForTimeout(3000);
    await expect(current).toHaveText(paused);
  });

  test('under reduced motion the word stays and the toggle is hidden (R20)', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/en/blog');
    await expect(page.getByTestId('hero-word-toggle')).toBeHidden();
    await page.waitForTimeout(3000);
    await expect(page.getByTestId('hero-word-live').locator('[data-current]')).toHaveText(
      'employers',
    );
  });
});

test.describe('/blog — the TR index: no Turkish article on the LOCAL bundle (W6, W248)', () => {
  test('the empty state and the way to the English articles — no "yakında" card', async ({
    page,
  }) => {
    const res = await page.goto('/blog');
    expect(res?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', 'tr');
    await expectOneCleanH1(page);
    await expectHeroPhoto(page.locator('img[src*="blog.jpg"]'), '/hero/blog.jpg'); // W233
    await expect(page.getByTestId('hero-word-static')).toHaveText('İşverenler');
    await expect(page.getByTestId('page-h1')).toHaveAccessibleName('İşverenler için içgörüler');
    await expect(page.getByTestId('blog-cadence')).toHaveText('Her hafta yeni yazı');
    await expect(page.getByTestId('blog-featured')).toHaveCount(0);
    await expect(page.getByTestId('blog-most-read')).toHaveCount(0);
    await expect(page.locator('#blog-grid')).toHaveCount(0);
    await expect(page.locator('[data-soon-tag]')).toHaveCount(0);
    await expect(page.getByTestId('blog-empty')).toBeVisible();
    await expect(page.getByTestId('blog-empty-cta')).toHaveAttribute('href', '/en/blog');
    await expect(page.getByTestId('blog-tools-status')).toHaveText('0 yazı');
    // indexable like the EN index (owner 2026-10-05)
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'index, follow');
  });

  test('desktop: the EN/TR pair takes the reader to the English index', async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'the pair shows from 701 px');
    await page.goto('/blog');
    await expect(page.getByTestId('blog-hero-art')).toBeVisible();
    const en = page
      .getByTestId('blog-tools')
      .getByRole('group', { name: 'Dil' })
      .getByRole('link', { name: 'EN' });
    await expect(en).toHaveAttribute('href', '/en/blog');
    await expect(en).toHaveAttribute('hreflang', 'en');
    await en.click();
    await expect(page).toHaveURL(/\/en\/blog$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });
});

test.describe(`${EN_ARTICLE} — the one written article`, () => {
  test('metadata: own title and excerpt, indexable (W248), og:type article, hreflang only for its own locale (B-15)', async ({
    page,
  }) => {
    const res = await page.goto(EN_ARTICLE);
    expect(res?.status()).toBe(200);
    await expectOneCleanH1(page);
    const title = ((await page.getByTestId('page-h1').textContent()) ?? '').trim();
    await expect(page).toHaveTitle(`${title} | JobsAdmire`);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'index, follow');
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'article');
    await expect(page.locator('meta[property="article:published_time"]')).toHaveAttribute(
      'content',
      /^2026-06-12/,
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      'content',
      `${ORIGIN}/og/en/blog.png`,
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `${ORIGIN}${EN_ARTICLE}`,
    );
    await expect(page.locator('link[rel="alternate"][hreflang="tr"]')).toHaveCount(0);
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute(
      'href',
      `${ORIGIN}${EN_ARTICLE}`,
    );
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute(
      'href',
      `${ORIGIN}${EN_ARTICLE}`,
    );
    await expect(page.getByTestId('article-lang-note')).toHaveCount(0);
  });

  test('one BreadcrumbList (Home / Blog / title), one BlogPosting, one FAQPage of four', async ({
    page,
  }) => {
    await page.goto(EN_ARTICLE);
    const nodes = await jsonLd(page);
    const of = (type: string) => nodes.filter((n) => n['@type'] === type);
    expect(of('BreadcrumbList')).toHaveLength(1);
    const crumbs = of('BreadcrumbList')[0] as { itemListElement: { item: string }[] };
    expect(crumbs.itemListElement.map((i) => i.item)).toEqual([
      `${ORIGIN}/en`,
      `${ORIGIN}/en/blog`,
      `${ORIGIN}${EN_ARTICLE}`,
    ]);
    expect(of('BlogPosting')).toHaveLength(1);
    const posting = of('BlogPosting')[0] as {
      image: string;
      author: { '@type': string; name: string };
      datePublished: string;
      inLanguage: string;
    };
    expect(posting.image).toBe(`${ORIGIN}/og/en/blog.png`);
    expect(posting.author).toEqual({ '@type': 'Organization', name: 'JobsAdmire Editorial' });
    expect(posting.datePublished).toBe('2026-06-12T00:00:00.000Z');
    expect(posting.inLanguage).toBe('en');
    expect(of('FAQPage')).toHaveLength(1);
    expect((of('FAQPage')[0] as { mainEntity: unknown[] }).mainEntity).toHaveLength(4);
  });

  test('the body, the quote CTA, the FAQ with data-driven numbers, the author box; no related band for the only article (W248), the newsletter band (B-8, B-10, B-11)', async ({
    page,
  }) => {
    await page.goto(EN_ARTICLE);
    const body = page.getByTestId('article-body');
    await expect(body.locator('h2')).toHaveCount(4);
    await expect(body.getByTestId('article-takeaways')).toContainText('Key takeaways');
    await expect(body.locator('ol > li')).toHaveCount(5);
    await expect(body.locator('blockquote')).toHaveCount(1);
    const permitWa =
      'https://wa.me/905011240340?text=Hello%20JobsAdmire%2C%20I%20need%20help%20with%20work%20permits.';
    const quote = body.getByTestId('article-quote');
    if ((page.viewportSize()?.width ?? 1440) <= 700) {
      // design review: the pull-quote button is hidden on phones only — still rendered, hidden
      await expect(quote.locator(`a[href="${permitWa}"]`)).toBeAttached();
      await expect(quote.locator(`a[href="${permitWa}"]`)).toBeHidden();
    } else {
      await expect(
        quote.getByRole('link', { name: 'Talk to a permit specialist →' }),
      ).toHaveAttribute('href', permitWa);
    }
    // the heading's name — its "+"/"−" tile is decorative (aria-hidden, phones only)
    await expect(page.locator('#faq')).toHaveAccessibleName('Frequently asked questions');
    // ≤ 700 px every h2 section — the FAQ included — is collapsed behind its heading (M1)
    const faqHead = page.locator('#faq button');
    if (await faqHead.isVisible()) await faqHead.click();
    const triggers = page.locator('#faq-list [data-accordion-trigger]');
    await expect(triggers).toHaveCount(4);
    await triggers.first().click();
    await expect(page.locator('#faq-list')).toContainText('about 45 days on average');
    await expect(page.locator('#faq-list')).toContainText(
      "Can I hire if I don't meet the 5:1 employee ratio?",
    );
    await expect(page.getByTestId('article-author')).toContainText('İŞKUR Licensed · No. 1730');
    // W248: related and previous/next come from the written articles only — the one article
    // has no neighbour, so the band is left out (no "yakında" card)
    await expect(page.getByTestId('article-related')).toHaveCount(0);
    await expect(page.getByTestId('article-next')).toHaveCount(0);
    await expect(page.locator('[data-soon-tag], [data-testid="article-soon"]')).toHaveCount(0);
    await expect(page.locator('#newsletter')).toHaveCount(1); // switched on 2026-10-05
    await expect(page.locator('#newsletter-form')).toBeAttached();
    await expect(page.locator(`[data-placeholder="blog-cover-${SLUG}"]`)).toHaveCount(1);
  });

  test('desktop: the sidebar island — TOC of five with live scroll-spy, share, print — and the CTA card deep link', async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'the sidebar column exists from lg');
    await page.goto(EN_ARTICLE);
    const sidebar = page.getByTestId('article-sidebar');
    const toc = sidebar.getByRole('navigation', { name: 'In this article' });
    await expect(toc.locator('a')).toHaveCount(5);
    await expect(toc.locator('a').last()).toHaveAttribute('href', '#faq');
    await expect(toc).toContainText('≈ 8 min left');
    await expect(
      sidebar.getByTestId('article-share').getByRole('link', { name: 'Share on LinkedIn' }),
    ).toHaveAttribute(
      'href',
      /linkedin\.com\/sharing\/share-offsite\/\?url=https%3A%2F%2Fwww\.jobsadmire\.com%2Fen%2Fblog%2F/,
    );
    await expect(sidebar.getByRole('button', { name: 'Copy link' })).toBeVisible();
    await expect(sidebar.getByRole('button', { name: 'Print this article' })).toHaveCount(0);
    await expect(sidebar.getByRole('link', { name: 'Request Workers →' })).toHaveAttribute(
      'href',
      '/en/hire-workers#request-form',
    );
    await expect(page.getByTestId('article-toc-mobile')).toBeHidden();
    // The fallback marks only the first entry; the loaded island follows the scroll (B-13).
    const documents = toc.getByRole('link', { name: "Documents you'll need" });
    await documents.click();
    await expect(documents).toHaveAttribute('aria-current', 'location');
  });

  test('desktop: nothing loads before the first scroll; then the reading bar and the sticky bar (W81) appear', async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'the sticky bar is lg-only');
    await page.goto(EN_ARTICLE);
    await expect(page.getByTestId('reading-progress')).toHaveCount(0); // B-13
    await page.evaluate(() => window.scrollTo(0, 1600));
    const bar = page.getByTestId('sticky-cta');
    await expect(bar).toBeVisible();
    await expect(page.getByTestId('reading-progress')).toHaveCount(1);
    await expect(bar.getByRole('link', { name: 'WhatsApp Us' })).toHaveAttribute(
      'href',
      /^https:\/\/wa\.me\/905011240340\?text=Hello%20JobsAdmire%2C%20I%20read%20/,
    );
    await expect(bar.getByRole('link', { name: 'Request Workers →' })).toHaveAttribute(
      'href',
      '/en/hire-workers#request-form',
    );
    await page.locator('#blog-cta').scrollIntoViewIfNeeded();
    await expect(bar).toBeHidden();
  });

  test('mobile: the <details> TOC lists the same five entries; the sidebar TOC and CTA card are hidden', async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'the details TOC exists below md');
    await page.goto(EN_ARTICLE);
    const toc = page.getByTestId('article-toc-mobile');
    await expect(toc).toBeVisible();
    await toc.locator('summary').click();
    await expect(toc.locator('nav a')).toHaveCount(5);
    await expect(toc).toContainText('5 sections');
    await expect(
      page.getByTestId('article-sidebar').getByRole('navigation', { name: 'In this article' }),
    ).toBeHidden();
    await expect(
      page.getByTestId('article-sidebar').getByRole('link', { name: 'Request Workers →' }),
    ).toBeHidden();
    await expect(page.getByTestId('article-share')).toBeAttached();
  });

  test('mobile: back-to-top appears after scrolling and takes the reader to the top', async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'the button is phone-only');
    await page.goto(EN_ARTICLE);
    await page.evaluate(() => window.scrollTo(0, 2500));
    const button = page.getByRole('button', { name: 'Back to top' });
    await expect(button).toBeVisible();
    await button.click();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(10);
  });
});

test('the header renders DEFAULT_CTAS; the hire-form anchor lives on Hire Workers (W121/W158)', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'the header CTA row is desktop-only');
  await page.goto(EN_ARTICLE);
  await expect(
    page
      .locator('header')
      .getByRole('link', { name: /Request/ })
      .first(),
  ).toHaveAttribute('href', '/en/hire-workers#request-form');
  const hire = await (await page.request.get('/en/hire-workers')).text();
  expect(hire).toContain('id="request-form"');
});

test.describe('B-1: a slug without a body in the locale answers 404', () => {
  for (const path of [
    '/blog/yabanci-isciler-calisma-izni-rehberi', // the TR slug of the written EN article
    '/en/blog/hiring-from-pakistan-turkish-employers', // a dropped index-only entry (W248)
    '/en/blog/does-not-exist',
    '/blog/does-not-exist',
  ]) {
    test(path, async ({ page }) => {
      const res = await page.goto(path);
      expect(res?.status()).toBe(404);
      // W151: the chrome-wrapped (site) not-found hydrates — one h1, and it is not an article.
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.getByTestId('page-h1')).toHaveCount(0);
    });
  }
});

test('robots.txt never disallows the blog; the sitemap lists both indexes and the article (W248, the SEO flip)', async ({
  request,
  baseURL,
}) => {
  const robots = await (await request.get('/robots.txt')).text();
  if (expectedRobots(baseURL ?? 'http://localhost:3000') === 'production') {
    expect(robots).not.toMatch(/^Disallow: (\/en)?\/blog/m);
  } else {
    // W91/W104: a preview face is `Disallow: /` — e2e/seo.spec.ts asserts that body strictly.
    expect(robots).toMatch(/^Disallow: \/$/m);
  }
  const xml = await (await request.get('/sitemap.xml')).text();
  expect(xml).toContain(`<loc>${ORIGIN}/blog</loc>`);
  expect(xml).toContain(`<loc>${ORIGIN}/en/blog</loc>`);
  expect(xml).toContain(`<loc>${ORIGIN}${EN_ARTICLE}</loc>`);
  // hreflang only for the language it is written in (+ x-default), never a TR 404
  const entry = xml.slice(xml.indexOf(`<loc>${ORIGIN}${EN_ARTICLE}</loc>`)).split('</url>')[0];
  expect(entry).toContain('hreflang="en"');
  expect(entry).not.toContain('hreflang="tr"');
  expect(entry).toMatch(/<lastmod>2026-06-12/);
  expect(xml).not.toContain('/blog/preview');
});

test.describe('/blog/preview — the draft preview (W248)', () => {
  test('without a preview link: the friendly invalid-link page, never indexed, with the way out', async ({
    page,
  }) => {
    const res = await page.goto('/blog/preview');
    expect(res?.status()).toBe(200);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      'content',
      'noindex, nofollow',
    );
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.getByTestId('blog-preview-message')).toHaveAttribute(
      'data-status',
      'invalid',
    );
    await expect(page.getByTestId('page-h1')).toHaveText(
      'Önizleme bağlantısı geçersiz ya da süresi dolmuş',
    );
    await expect(page.getByTestId('blog-preview-bar')).toContainText('Önizleme — yayında değil');
    expect(await page.locator('body').innerText()).not.toMatch(LEAK);
  });

  test('the entry door: draft mode on, token in an httpOnly cookie, the EN preview; exit turns it off', async ({
    page,
    context,
  }) => {
    await page.goto('/api/blog-preview?locale=en&token=e2e-not-a-real-token.0000');
    await expect(page).toHaveURL(/\/en\/blog\/preview$/);
    const cookies = await context.cookies();
    const token = cookies.find((c) => c.name === 'ja_blog_preview');
    expect(token?.httpOnly).toBe(true);
    expect(cookies.some((c) => c.name === '__prerender_bypass')).toBe(true);
    // no door, or a door that does not know the token: never a draft, always a message
    await expect(page.getByTestId('blog-preview-message')).toHaveAttribute(
      'data-status',
      /^(invalid|unavailable)$/,
    );
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      'content',
      'noindex, nofollow',
    );
    await page.getByTestId('blog-preview-exit').click();
    await expect(page).toHaveURL(/\/en\/blog$/);
    const after = await context.cookies();
    expect(after.some((c) => c.name === 'ja_blog_preview')).toBe(false);
    expect(after.some((c) => c.name === '__prerender_bypass')).toBe(false);
  });

  test.describe('against the fixture door (E2E_BLOG_MOCK=1)', () => {
    test.skip(
      process.env.E2E_BLOG_MOCK !== '1',
      'needs a server started with OPS_API_URL on e2e/mocks/careers-door.mjs',
    );

    test('a valid token renders the draft as the article will look, under the preview bar', async ({
      page,
    }) => {
      await page.goto('/api/blog-preview?locale=en&token=e2e-preview-token.0000000000000000');
      await expect(page).toHaveURL(/\/en\/blog\/preview$/);
      await expect(page.getByTestId('blog-preview-bar')).toContainText('Preview — not published');
      await expect(page.getByTestId('page-h1')).toHaveText(
        'Hiring from Pakistan: a guide for employers',
      );
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
        'content',
        'noindex, nofollow',
      );
      const body = page.getByTestId('article-body');
      // attached, not visible: ≤ 700 px every h2 section starts collapsed (M1)
      await expect(body.locator('h3', { hasText: 'Documents' })).toBeAttached();
      await expect(body.locator('a', { hasText: 'official rules' })).toHaveAttribute(
        'rel',
        'noopener',
      );
      await expect(page.getByTestId('article-author')).toContainText('Written by Ayşe Demir');
      expect((await jsonLd(page)).filter((n) => n['@type'] === 'BlogPosting')).toHaveLength(0);
    });

    test('an expired token: the invalid-link message', async ({ page }) => {
      await page.goto('/api/blog-preview?locale=tr&token=expired-token.000000000000');
      await expect(page.getByTestId('blog-preview-message')).toHaveAttribute(
        'data-status',
        'invalid',
      );
    });
  });
});

// W249 — the owner's first real post: the ATV interview, a video of the site's own registry in
// its body and no cover of its own. Run against a server BUILT and started with BLOG_SOURCE=OPS
// and OPS_API_URL on e2e/mocks/careers-door.mjs (`npm run e2e:blog-ops`, which greps these
// blocks: everything else in this file assumes the LOCAL bundle).
/** W250: the visible cards of the index grid, in order, with their rects (zoomed px past 1440 —
 *  compared with each other only). */
async function gridCards(page: Page) {
  return page.locator('#blog-grid > li:not([hidden]) > article').evaluateAll((els) =>
    els.map((el) => {
      const r = el.getBoundingClientRect();
      const cover = el
        .querySelector('[data-placeholder], [data-cover-photo]')!
        .getBoundingClientRect();
      return { x: r.x, y: r.y, w: r.width, h: r.height, coverW: cover.width, coverH: cover.height };
    }),
  );
}

/** The cards grouped into rows by their top edge. */
function rowsOf(cards: { y: number }[]): number[] {
  const rows: number[] = [];
  let last = Number.NaN;
  for (const c of cards) {
    if (Number.isNaN(last) || Math.abs(c.y - last) > 2) rows.push(1);
    else rows[rows.length - 1] += 1;
    last = c.y;
  }
  return rows;
}

/** The phone layout (≤ 700 px): the design's row cards one under the other — the 104 px cover at
 *  the left, the text beside it — and no horizontal overflow. */
async function expectPhoneRows(page: Page, count: number) {
  const cards = await gridCards(page);
  expect(cards).toHaveLength(count);
  expect(rowsOf(cards)).toEqual(Array.from({ length: count }, () => 1));
  for (const c of cards) {
    expect(Math.round(c.coverW)).toBe(104);
    expect(c.coverH).toBeGreaterThanOrEqual(103.5);
    expect(c.w).toBeGreaterThan(330);
  }
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
}

test.describe('the ATV interview article, from the fixture door (E2E_BLOG_OPS=1)', () => {
  test.skip(
    process.env.E2E_BLOG_OPS !== '1',
    'needs a server built and started with BLOG_SOURCE=OPS on e2e/mocks/careers-door.mjs',
  );
  const ATV = '/blog/atv-vizyon-jobsadmire-haris-jiva-roportaji';
  const ATV_EN = '/en/blog/jobsadmire-on-atv-vizyon-founder-haris-jiva-interview';
  const ATV_KEY = 'cmgblog0000000000000000004'; // e2e/mocks/blog-atv-post.json
  const TITLE = 'ATV Vizyon: JobsAdmire kurucusu Haris Jiva ile röportaj';
  const TITLE_EN = 'ATV Vizyon: interview with JobsAdmire founder Haris Jiva';
  const FILES = '/media/blog/atv-vizyon-haris-jiva';

  /** The default track loads and shows; the other one stays off (W250: it follows the page). */
  async function expectCaptions(page: Page, on: 'tr' | 'en') {
    const video = page.getByTestId('article-video').locator('video');
    const tracks = video.locator('track');
    await expect(tracks).toHaveCount(2);
    await expect(tracks.nth(0)).toHaveAttribute('srclang', 'tr');
    await expect(tracks.nth(0)).toHaveAttribute('src', `${FILES}.tr.vtt`);
    await expect(tracks.nth(1)).toHaveAttribute('srclang', 'en');
    await expect(tracks.nth(1)).toHaveAttribute('src', `${FILES}.en.vtt`);
    await expect(tracks.nth(1)).toHaveAttribute('label', 'English');
    await expect(video.locator('track[default]')).toHaveAttribute('srclang', on);
    await expect
      .poll(() =>
        video.evaluate((v: HTMLVideoElement) =>
          [...v.textTracks].map((t) => `${t.kind}/${t.language}/${t.mode}`).join(' '),
        ),
      )
      .toBe(
        on === 'tr'
          ? 'captions/tr/showing captions/en/disabled'
          : 'captions/tr/disabled captions/en/showing',
      );
  }

  /** W250: no cover above the article — the poster is the player's, a few lines below. */
  async function expectNoTopCover(page: Page) {
    await expect(page.getByTestId('article-cover')).toHaveCount(0);
    await expect(page.locator(`[data-cover-photo="blog-cover-${ATV_KEY}"]`)).toHaveCount(0);
    await expect(page.locator(`[data-placeholder="blog-cover-${ATV_KEY}"]`)).toHaveCount(0);
    // the first picture of the page is the player's poster, in the body
    const images = await page
      .locator('main img, main video[poster]')
      .evaluateAll((els) =>
        els.map((el) => (el.tagName === 'VIDEO' ? 'video' : (el.getAttribute('src') ?? ''))),
      );
    expect(images.filter((src) => src.includes('atv-vizyon-haris-jiva'))).toEqual([]);
    expect(images.indexOf('video')).toBeGreaterThanOrEqual(0);
  }

  test('the interview under the intro: poster, MP4, both caption tracks (Turkish on); no duplicate cover at the top', async ({
    page,
  }) => {
    const res = await page.goto(ATV);
    expect(res?.status()).toBe(200);
    await expectOneCleanH1(page);
    const figure = page.getByTestId('article-body').getByTestId('article-video');
    await expect(figure).toBeVisible(); // before the first h2: never folded away on phones
    const video = figure.locator('video');
    await expect(video).toHaveAttribute('poster', `${FILES}.jpg`);
    await expect(video).toHaveAttribute('preload', 'none');
    await expect(video).toHaveAttribute('controls', '');
    await expect(video).not.toHaveAttribute('autoplay');
    await expect(video).toHaveAccessibleName(TITLE);
    await expect(video.locator('source')).toHaveAttribute('src', `${FILES}.mp4`);
    await expect(video.locator('source')).toHaveAttribute('type', 'video/mp4');
    await expect(figure.locator('figcaption')).toHaveText(TITLE);
    await expectCaptions(page, 'tr');
    // the fixed 16:9 box, the poster painted before anything plays
    const box = (await video.boundingBox())!;
    expect(Math.abs(box.width / box.height - 16 / 9)).toBeLessThan(0.02);
    await expectNoTopCover(page);
    // the poster stays the share image
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      'content',
      `${ORIGIN}${FILES}.jpg`,
    );
  });

  test('the English version (W250): its own page, English captions on, no cover at the top', async ({
    page,
  }) => {
    const res = await page.goto(ATV_EN);
    expect(res?.status()).toBe(200);
    await expectOneCleanH1(page);
    await expect(page.getByTestId('page-h1')).toHaveText(
      'JobsAdmire on ATV Vizyon: Founder Haris Jiva on Bringing Skilled Workers to Türkiye',
    );
    await expect(page).toHaveTitle('JobsAdmire on ATV Vizyon: Haris Jiva Interview');
    const video = page.getByTestId('article-video').locator('video');
    await expect(video).toHaveAccessibleName(TITLE_EN);
    await expect(video).toHaveAttribute('poster', `${FILES}.jpg`);
    await expectCaptions(page, 'en');
    await expectNoTopCover(page);
    await expect(page.locator('link[rel="alternate"][hreflang="tr"]')).toHaveAttribute(
      'href',
      `${ORIGIN}${ATV}`,
    );
    // its own FAQ (three), one VideoObject in English pages too
    const nodes = await jsonLd(page);
    expect(nodes.filter((n) => n['@type'] === 'VideoObject')).toHaveLength(1);
    await expect(page.locator('#faq-list [data-accordion-trigger]')).toHaveCount(3);
  });

  test('one VideoObject beside the BlogPosting; the BlogPosting image is the poster', async ({
    page,
  }) => {
    await page.goto(ATV);
    const nodes = await jsonLd(page);
    const of = (type: string) => nodes.filter((n) => n['@type'] === type);
    expect(of('BlogPosting')).toHaveLength(1);
    expect((of('BlogPosting')[0] as { image: string }).image).toBe(`${ORIGIN}${FILES}.jpg`);
    expect(of('VideoObject')).toHaveLength(1);
    expect(of('VideoObject')[0]).toMatchObject({
      name: TITLE,
      description: expect.stringMatching(/^ATV Vizyon, JobsAdmire'ın Antalya'daki ofisine/),
      thumbnailUrl: `${ORIGIN}${FILES}.jpg`,
      contentUrl: `${ORIGIN}${FILES}.mp4`,
      uploadDate: '2026-10-06T00:00:00.000Z',
      duration: 'PT3M25S',
      inLanguage: 'tr',
    });
  });

  test('no horizontal overflow at 390 px; the player fills the column', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    for (const path of [ATV, ATV_EN]) {
      await page.goto(path);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
      const box = (await page.getByTestId('article-video').locator('video').boundingBox())!;
      expect(box.width).toBeGreaterThan(300);
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(390);
    }
  });

  test('axe: both articles are clean', async ({ page }) => {
    for (const path of [ATV, ATV_EN]) {
      await page.goto(path);
      await settleMotion(page);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
        .analyze();
      expect(
        results.violations,
        JSON.stringify(results.violations.map((v) => ({ id: v.id, nodes: v.nodes.length }))),
      ).toEqual([]);
    }
  });

  test('TR index (W250): the one Turkish article is the grid’s one featured card, the poster as its cover', async ({
    page,
  }, testInfo) => {
    await page.goto('/blog');
    const grid = page.locator('#blog-grid');
    await expect(grid.locator('li[data-post-key]')).toHaveCount(1);
    const featured = grid.getByTestId('blog-featured');
    await expect(featured.getByRole('link', { name: /ATV Vizyon'da JobsAdmire/ })).toHaveAttribute(
      'href',
      ATV,
    );
    await expect(featured).toContainText('ÖNE ÇIKAN');
    await expect(featured.locator('img')).toHaveAttribute(
      'src',
      /media%2Fblog%2Fatv-vizyon-haris-jiva\.jpg/,
    );
    await expect(page.getByTestId('blog-most-read')).toHaveCount(0);
    await expect(page.getByTestId('blog-load-more')).toHaveCount(0);
    await expect(page.getByTestId('blog-tools-status')).toHaveText('1 yazı');
    if (testInfo.project.name === 'desktop') {
      // 1440: one column of four — a card, never the old full-width banner; the cover 16:10
      const [card] = await gridCards(page);
      const box = (await grid.boundingBox())!;
      expect(card.w).toBeGreaterThan(280);
      expect(card.w).toBeLessThan(box.width / 3);
      expect(card.coverW / card.coverH).toBeCloseTo(1.6, 1);
      expect(card.h / card.w).toBeGreaterThan(0.9); // square-ish, never a wide strip
    } else {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.reload();
      await expectPhoneRows(page, 1);
    }
  });

  test('EN index (W250): the English interview and the work-permit guide — two cards in one row at 1440', async ({
    page,
  }, testInfo) => {
    await page.goto('/en/blog');
    const grid = page.locator('#blog-grid');
    const items = grid.locator('li[data-post-key]');
    await expect(items).toHaveCount(2);
    await expect(items.nth(0).getByTestId('blog-featured')).toContainText('FEATURED');
    await expect(items.nth(0).getByRole('link')).toHaveAttribute('href', ATV_EN);
    await expect(items.nth(1).getByRole('link')).toHaveAttribute(
      'href',
      '/en/blog/turkey-work-permit-process-employer-guide',
    );
    await expect(grid.locator('[data-featured]')).toHaveCount(1);
    await expect(page.getByTestId('blog-most-read')).toHaveCount(0);
    if (testInfo.project.name === 'desktop') {
      const cards = await gridCards(page);
      expect(rowsOf(cards)).toEqual([2]);
      expect(Math.abs(cards[0].w - cards[1].w)).toBeLessThan(1);
      expect(cards[0].h).toBeCloseTo(cards[1].h, 0); // a row of equal cards
      for (const c of cards) expect(c.coverW / c.coverH).toBeCloseTo(1.6, 1);
    } else {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.reload();
      await expectPhoneRows(page, 2);
    }
  });

  test('axe: the TR index with its one card is clean', async ({ page }) => {
    await page.goto('/blog');
    await settleMotion(page);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
      .analyze();
    expect(
      results.violations,
      JSON.stringify(results.violations.map((v) => ({ id: v.id, nodes: v.nodes.length }))),
    ).toEqual([]);
  });
});

// W250 — the index grid with more posts than a row: the door's grid feed (OPS_API_URL=
// http://127.0.0.1:8481/grid — the ATV post, the contract fixture's three and seven grid posts: ten
// written articles per language). Run against a server BUILT and started on it
// (`npm run e2e:blog-grid`).
test.describe('the index grid with ten articles, from the fixture door (E2E_BLOG_GRID=1)', () => {
  test.skip(
    process.env.E2E_BLOG_GRID !== '1',
    'needs a server built and started with BLOG_SOURCE=OPS on the door’s /grid feed',
  );

  const atWidth = async (page: Page, width: number, height = 900) => {
    await page.setViewportSize({ width, height });
    await page.goto('/en/blog');
    await expect(page.locator('#blog-grid > li[data-post-key]')).toHaveCount(10);
  };

  for (const [width, height, perRow] of [
    [1440, 900, 4],
    [1920, 1080, 4],
    [1000, 900, 3],
    [800, 900, 2],
  ] as const) {
    test(`${width} px: ${perRow} in a row, eight to a page`, async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== 'desktop', 'desktop widths');
      await atWidth(page, width, height);
      const cards = await gridCards(page);
      expect(cards).toHaveLength(8);
      const rows = rowsOf(cards);
      expect(rows.every((n) => n === perRow || n === 8 % perRow)).toBe(true);
      expect(rows[0]).toBe(perRow);
      // equal columns, each a 16:10 cover over its text — never a full-width card
      const w = cards[0].w;
      for (const c of cards) {
        expect(Math.abs(c.w - w)).toBeLessThan(1);
        expect(c.coverW / c.coverH).toBeCloseTo(1.6, 1);
      }
      const box = (await page.locator('#blog-grid').boundingBox())!;
      expect(w).toBeLessThan(box.width / (perRow - 0.5));
      // only the first card wears the pill
      await expect(page.locator('#blog-grid [data-featured]')).toHaveCount(1);
      await expect(
        page.locator('#blog-grid > li').first().getByTestId('blog-featured'),
      ).toHaveCount(1);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }

  test('"Load more" shows the last two; the tools count all ten', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'one width is enough');
    await atWidth(page, 1440);
    await expect(page.getByTestId('blog-tools-status')).toHaveText('10 articles');
    await page.getByTestId('blog-load-more').click();
    await expect(page.locator('#blog-grid > li:not([hidden])')).toHaveCount(10);
    await expect(page.getByTestId('blog-load-more')).toHaveCount(0);
    expect(rowsOf(await gridCards(page))).toEqual([4, 4, 2]);
  });

  test('390 px: the phone row cards, one per row', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'the phone project');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/en/blog');
    await expectPhoneRows(page, 8);
  });

  test('`showCover: false` (W250): the card keeps its photo, the article opens without it', async ({
    page,
  }) => {
    const KEY = 'cmgblog00000000000000grid1';
    await page.goto('/en/blog');
    await expect(page.locator(`[data-cover-photo="blog-cover-${KEY}"] img`)).toHaveAttribute(
      'src',
      /cmgmedia0000000000000grid1/,
    );
    await page.goto('/en/blog/work-permit-renewal-calendar');
    await expect(page.getByTestId('article-cover')).toHaveCount(0);
    await expect(page.locator(`[data-cover-photo="blog-cover-${KEY}"]`)).toHaveCount(0);
    // the share image is still its own cover
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      'content',
      /cmgmedia0000000000000grid1\/1200\.webp$/,
    );
    // a photo of its own with the switch on (the Pakistan guide) still opens the article
    await page.goto('/en/blog/hiring-from-pakistan-employer-guide');
    await expect(page.getByTestId('article-cover').locator('[data-cover-photo] img')).toHaveCount(
      1,
    );
    // a post sent without the field reads it as on — no photo, so the category placeholder
    await page.goto('/en/blog/hiring-cooks-for-hotel-kitchens');
    await expect(page.getByTestId('article-cover').locator('[data-placeholder]')).toHaveCount(1);
  });

  test('axe: the grid of ten is clean', async ({ page }) => {
    await page.goto('/en/blog');
    await settleMotion(page);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
      .analyze();
    expect(
      results.violations,
      JSON.stringify(results.violations.map((v) => ({ id: v.id, nodes: v.nodes.length }))),
    ).toEqual([]);
  });
});
