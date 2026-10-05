import { expect, test, type Page } from '@playwright/test';
import { expectHeroPhoto } from '../helpers/hero-photo';
import { expectedRobots } from '../helpers/face';

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

test.describe('/en/blog — the index from every bundle row (owner 2026-10-05)', () => {
  test('hero with the cadence pill, featured + most read, the grid; noindex', async ({ page }) => {
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
    // the featured card (row 1, written in EN): the whole card is its title link
    const featured = page.getByTestId('blog-featured');
    await expect(featured.getByRole('link', { name: /work permit process/i })).toHaveAttribute(
      'href',
      EN_ARTICLE,
    );
    await expect(featured).toContainText('Read article →');
    // most read: the design's three rows, the written one a link, a sample tag on the panel
    const most = page.getByTestId('blog-most-read');
    await expect(most.getByRole('listitem')).toHaveCount(3);
    await expect(most.getByRole('link')).toHaveCount(1);
    await expect(most.locator('[data-sample-tag]')).toHaveCount(1);
    // the grid: rows 2–22, six shown, none a link yet (no body) — each says "coming soon"
    const rows = page.locator('#blog-grid li[data-post-key]');
    await expect(rows).toHaveCount(21);
    await expect(page.locator('#blog-grid li[data-post-key]:visible')).toHaveCount(6);
    await expect(page.locator('#blog-grid a')).toHaveCount(0);
    await expect(rows.first().locator('[data-soon-tag]')).toHaveText(/coming soon/i);
    await page.getByTestId('blog-load-more').click();
    await expect(page.locator('#blog-grid li[data-post-key]:visible')).toHaveCount(12);
    await expect(page.getByTestId('blog-empty')).toHaveCount(0);
    // the newsletter band with its own form (owner, 2026-10-05)
    await expect(page.locator('#newsletter input[type="email"]')).toHaveCount(1);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
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

  test('the tools filter the grid client-side and announce the count', async ({ page }) => {
    await page.goto('/en/blog');
    const status = page.getByTestId('blog-tools-status');
    await expect(status).toHaveText('22 articles');
    await page.getByRole('searchbox', { name: 'Search articles' }).fill('quota');
    await expect(page.locator('#blog-grid li[data-post-key]:visible')).toHaveCount(1);
    await expect(status).toHaveText('1 article for “quota”');
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
    await page.getByTestId('blog-tools').getByText('Compliance', { exact: true }).click();
    await expect(page.getByTestId('blog-tools-status')).toHaveText(/ · Compliance$/);
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
    await expect(page.getByTestId('blog-phone-strip')).toContainText('22');
    await expect(page.getByTestId('blog-result-line')).toHaveText('22 articles');
    await page.getByTestId('blog-topic-button').click();
    const sheet = page.getByRole('dialog');
    await sheet.getByText('Market News', { exact: true }).click();
    await expect(sheet).toBeHidden();
    await expect(page.getByTestId('blog-result-line')).toContainText('Market News');
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

test.describe('/blog — the TR index: the four Turkish rows, none written yet', () => {
  test('featured + most read + three grid cards, every one "yakında" and not a link', async ({
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
    const featured = page.getByTestId('blog-featured');
    await expect(featured.getByRole('heading', { level: 2 })).toContainText('çalışma izni');
    await expect(featured.getByRole('link')).toHaveCount(0);
    await expect(featured.locator('[data-soon-tag]')).toHaveText(/yakında/i);
    await expect(page.getByTestId('blog-most-read').getByRole('listitem')).toHaveCount(3);
    await expect(page.locator('#blog-grid li[data-post-key]')).toHaveCount(3);
    await expect(page.getByTestId('blog-load-more')).toHaveCount(0);
    await expect(page.getByTestId('blog-empty')).toHaveCount(0);
    await expect(page.getByTestId('blog-tools-status')).toHaveText('4 yazı');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
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
  test('metadata: own title and excerpt, noindex, og:type article, hreflang only for its own locale (B-15)', async ({
    page,
  }) => {
    const res = await page.goto(EN_ARTICLE);
    expect(res?.status()).toBe(200);
    await expectOneCleanH1(page);
    const title = ((await page.getByTestId('page-h1').textContent()) ?? '').trim();
    await expect(page).toHaveTitle(`${title} | JobsAdmire`);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
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

  test('the body, the quote CTA, the FAQ with data-driven numbers, the author box; related cards (bodiless = not links, tagged), the newsletter band (B-8, B-10, B-11)', async ({
    page,
  }) => {
    await page.goto(EN_ARTICLE);
    const body = page.getByTestId('article-body');
    await expect(body.locator('h2')).toHaveCount(4);
    await expect(body.getByTestId('article-takeaways')).toContainText('Key takeaways');
    await expect(body.locator('ol > li')).toHaveCount(5);
    await expect(body.locator('blockquote')).toHaveCount(1);
    await expect(
      body
        .getByTestId('article-quote')
        .getByRole('link', { name: 'Talk to a permit specialist →' }),
    ).toHaveAttribute(
      'href',
      'https://wa.me/905011240340?text=Hello%20JobsAdmire%2C%20I%20need%20help%20with%20work%20permits.',
    );
    await expect(page.locator('#faq')).toHaveText('Frequently asked questions');
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
    // Owner ruling 2026-10-05: related/next come from the bundle rows; none has a body yet, so
    // none is a link and each wears the `sys.blog.soon` tag
    const related = page.getByTestId('article-related-card');
    await expect(related).toHaveCount(3);
    await expect(related.locator('a')).toHaveCount(0);
    await expect(page.getByTestId('article-soon')).toHaveCount(4); // 3 cards + the Next card
    await expect(page.getByTestId('article-next')).toContainText('Next article');
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
    '/en/blog/hiring-from-pakistan-turkish-employers', // an index-only EN entry
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

test('robots.txt disallows both blog indexes on the production face; the sitemap lists no blog URL (W4/W20/W37, W135)', async ({
  request,
  baseURL,
}) => {
  const robots = await (await request.get('/robots.txt')).text();
  if (expectedRobots(baseURL ?? 'http://localhost:3000') === 'production') {
    expect(robots).toMatch(/^Disallow: \/blog$/m);
    expect(robots).toMatch(/^Disallow: \/en\/blog$/m);
  } else {
    // W91/W104: a preview face is `Disallow: /` — e2e/seo.spec.ts asserts that body strictly.
    expect(robots).toMatch(/^Disallow: \/$/m);
  }
  const xml = await (await request.get('/sitemap.xml')).text();
  expect(xml).not.toMatch(/<loc>[^<]*\/blog(\/|<)/);
});
