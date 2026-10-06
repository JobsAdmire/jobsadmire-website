import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { feedToRows, redirectTarget, withBlogRows } from '@/content/blog-feed';
import { atvFixtureFeed } from '@/test/blog-fixtures';
import { BundleSchema } from '../../../../../../../contract/website-bundle.v1';

/** The `/blog/[slug]` route under `BLOG_SOURCE=OPS` (W248): the feed's rows over the committed
 *  bundle, its redirects, and Next's navigation signals as throwable markers. The feed is the
 *  fixture door's (W249): the owner's ATV post, then the contract fixture's three. */
const FEED = feedToRows(atvFixtureFeed(), vi.fn());
const bundleOf = (locale: 'tr' | 'en') =>
  withBlogRows(
    BundleSchema.parse(
      JSON.parse(
        readFileSync(join(process.cwd(), 'src/content/local', `bundle.${locale}.json`), 'utf8'),
      ),
    ),
    FEED.rows,
  );

class Redirected extends Error {
  constructor(readonly to: string) {
    super(`308 ${to}`);
  }
}
class NotFound extends Error {}

vi.mock('next/navigation', async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  permanentRedirect: (to: string) => {
    throw new Redirected(to);
  },
  notFound: () => {
    throw new NotFound();
  },
}));
vi.mock('@/content/blog', () => ({
  getBlogBundle: async (locale: 'tr' | 'en') => bundleOf(locale),
  getBlogFeed: async () => ({ source: 'OPS', ...FEED }),
  redirectTarget,
}));
vi.mock('next-intl/server', () => ({
  setRequestLocale: () => {},
  getTranslations: async () => (key: string, values?: Record<string, string>) =>
    key === 'blog.article.metaTitle' ? `${values?.title} | JobsAdmire` : key,
}));
vi.mock('next/dynamic', () => ({ default: () => () => null }));

const { generateMetadata, generateStaticParams } = await import('../page');
const meta = (locale: string, slug: string) =>
  generateMetadata({ params: Promise.resolve({ locale, slug }) });

beforeEach(() => vi.spyOn(console, 'error').mockImplementation(() => {}));

describe('/blog/[slug] from the Operations feed (W248)', () => {
  it('prerenders every written article of both locales', async () => {
    expect(await generateStaticParams()).toEqual([
      { locale: 'tr', slug: 'atv-vizyon-jobsadmire-haris-jiva-roportaji' },
      { locale: 'tr', slug: 'pakistandan-isci-istihdami-rehberi' },
      { locale: 'tr', slug: 'sgk-bildirimi-yabanci-isciler' },
      { locale: 'en', slug: 'jobsadmire-on-atv-vizyon-founder-haris-jiva-interview' },
      { locale: 'en', slug: 'hiring-from-pakistan-employer-guide' },
      { locale: 'en', slug: 'turkey-work-permit-process-employer-guide' },
    ]);
  });

  it('an old slug in the feed redirects 308 to the new one, per locale', async () => {
    await expect(meta('en', 'hiring-from-pakistan-guide')).rejects.toEqual(
      new Redirected('/en/blog/hiring-from-pakistan-employer-guide'),
    );
    await expect(meta('tr', 'pakistandan-isci-istihdami')).rejects.toEqual(
      new Redirected('/blog/pakistandan-isci-istihdami-rehberi'),
    );
  });

  it('an unknown or unpublished slug, or a slug of the other language, is a 404', async () => {
    for (const [locale, slug] of [
      ['en', 'does-not-exist'],
      ['en', 'sgk-bildirimi-yabanci-isciler'], // TR-only post
      ['tr', 'hiring-from-pakistan-guide'], // an EN redirect does not apply in TR
    ])
      await expect(meta(locale, slug)).rejects.toBeInstanceOf(NotFound);
  });

  it('metadata: the SEO overrides, indexable, the cover as the share image, the last edit', async () => {
    const m = await meta('en', 'hiring-from-pakistan-employer-guide');
    expect(m.title).toBe('Hiring from Pakistan in 2026: employer guide');
    expect(m.description).toBe('Permit file, quota ratio, costs: hiring from Pakistan.');
    expect(m.robots).toEqual({ index: true, follow: true });
    expect(m.alternates?.languages).toEqual({
      tr: 'https://www.jobsadmire.com/blog/pakistandan-isci-istihdami-rehberi',
      en: 'https://www.jobsadmire.com/en/blog/hiring-from-pakistan-employer-guide',
      'x-default': 'https://www.jobsadmire.com/blog/pakistandan-isci-istihdami-rehberi',
    });
    const og = m.openGraph as Record<string, unknown> & { images: { url: string }[] };
    expect(og.images[0].url).toBe(
      'https://operations.jobsadmire.com/api/website/v1/media/cmgmedia000000000000000001/1200.webp',
    );
    expect(og.modifiedTime).toBe('2026-10-06T07:30:00.000Z');
    expect(og.authors).toEqual(['Ayşe Demir']);
  });

  it('W249: a post without a cover shares its video’s poster, absolute', async () => {
    const m = await meta('tr', 'atv-vizyon-jobsadmire-haris-jiva-roportaji');
    expect(m.title).toBe("ATV Vizyon'da JobsAdmire: Haris Jiva Röportajı");
    const og = m.openGraph as Record<string, unknown> & { images: { url: string }[] };
    expect(og.images[0].url).toBe(
      'https://www.jobsadmire.com/media/blog/atv-vizyon-haris-jiva.jpg',
    );
    // W250: written in English too — hreflang names both
    expect(m.alternates?.languages).toEqual({
      tr: 'https://www.jobsadmire.com/blog/atv-vizyon-jobsadmire-haris-jiva-roportaji',
      en: 'https://www.jobsadmire.com/en/blog/jobsadmire-on-atv-vizyon-founder-haris-jiva-interview',
      'x-default': 'https://www.jobsadmire.com/blog/atv-vizyon-jobsadmire-haris-jiva-roportaji',
    });
    const e = await meta('en', 'jobsadmire-on-atv-vizyon-founder-haris-jiva-interview');
    expect(e.title).toBe('JobsAdmire on ATV Vizyon: Haris Jiva Interview');
    expect((e.openGraph as { images: { url: string }[] }).images[0].url).toBe(
      'https://www.jobsadmire.com/media/blog/atv-vizyon-haris-jiva.jpg',
    );
  });

  it('metadata without overrides: "{title} | JobsAdmire", the excerpt, the index image, the editorial author', async () => {
    const m = await meta('tr', 'pakistandan-isci-istihdami-rehberi');
    expect(m.title).toBe("Pakistan'dan işçi istihdamı 2026 rehberi"); // the TR SEO title
    expect(m.description).toMatch(/^Pakistan'dan işçi getirmek/); // no TR SEO description
    const e = await meta('en', 'turkey-work-permit-process-employer-guide');
    expect(e.title).toBe(
      'The Türkiye work permit process: a step-by-step guide for employers | JobsAdmire',
    );
    const og = e.openGraph as Record<string, unknown> & { images: { url: string }[] };
    expect(og.images[0].url).toBe('https://www.jobsadmire.com/og/en/blog.png');
    expect(og.authors).toEqual(['JobsAdmire Editorial']);
  });
});
