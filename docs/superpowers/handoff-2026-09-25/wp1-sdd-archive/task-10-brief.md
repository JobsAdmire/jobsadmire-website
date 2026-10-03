### Task 10: SEO builders — metadata, alternates, sitemap, robots, JSON-LD

**Files:**

- Create: `src/lib/seo/routes.ts`, `src/lib/seo/metadata.ts`, `src/lib/seo/jsonld.ts`, `src/lib/seo/JsonLd.tsx`, `src/app/sitemap.ts`, `src/app/robots.ts`, tests `src/lib/seo/{routes,metadata,jsonld}.test.ts`, `e2e/seo.spec.ts`
- Modify: `src/app/[locale]/layout.tsx` (metadataBase, Organization + WebSite JSON-LD), `src/app/[locale]/page.tsx` (generateMetadata example)

**Interfaces:**

- Produces: `absoluteUrl(locale, internalPathname, params?)`, `localeAlternates(internalPathname, params?)` → `{ languages: { tr, en, 'x-default' } }` with the self-reference included, `buildMetadata({ locale, pathname, bundle, pageKey, params? }): Metadata`, `organizationJsonLd(settings, t)`, `websiteJsonLd(settings)`, `breadcrumbJsonLd(items)`, `faqJsonLd(pairs)`, `<JsonLd data />`.

- [ ] **Step 1: Failing tests**

`src/lib/seo/routes.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { absoluteUrl, localeAlternates } from './routes';

describe('seo routes', () => {
  it('builds absolute localized URLs (TR unprefixed, EN prefixed)', () => {
    expect(absoluteUrl('tr', '/hire-workers')).toBe('https://www.jobsadmire.com/isci-talebi');
    expect(absoluteUrl('en', '/hire-workers')).toBe('https://www.jobsadmire.com/en/hire-workers');
    expect(absoluteUrl('tr', '/')).toBe('https://www.jobsadmire.com/');
  });
  it('alternates include both locales and x-default = tr', () => {
    expect(localeAlternates('/about')).toEqual({
      languages: {
        tr: 'https://www.jobsadmire.com/hakkimizda',
        en: 'https://www.jobsadmire.com/en/about',
        'x-default': 'https://www.jobsadmire.com/hakkimizda',
      },
    });
  });
});
```

`src/lib/seo/jsonld.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { faqJsonLd, organizationJsonLd } from './jsonld';
import fixture from '../../../contract/website-bundle.v1.fixture.json';
import type { Bundle } from '../../../contract/website-bundle.v1';

describe('jsonld', () => {
  it('organization carries the İŞKUR permit, tax id and social profiles', () => {
    const o = organizationJsonLd((fixture as Bundle).settings, {
      name: 'JobsAdmire',
      description: 'x',
    });
    expect(o['@type']).toEqual(['Organization', 'EmploymentAgency']);
    expect(JSON.stringify(o)).toContain('1730');
    expect(o.sameAs.length).toBe(6);
  });
  it('faq pairs become a FAQPage', () => {
    const f = faqJsonLd([{ q: 'Q?', a: 'A.' }]);
    expect(f.mainEntity[0].acceptedAnswer.text).toBe('A.');
  });
});
```

- [ ] **Step 2: Implement**

`src/lib/seo/routes.ts`:

```ts
import { getPathname } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.jobsadmire.com').replace(
  /\/$/,
  '',
);
type Href = Parameters<typeof getPathname>[0]['href'];

export function absoluteUrl(locale: Locale, href: Href): string {
  const path = getPathname({ locale, href });
  return `${SITE_URL}${path === '/' && locale === routing.defaultLocale ? '/' : path}`;
}

export function localeAlternates(href: Href) {
  const languages: Record<string, string> = {};
  for (const l of routing.locales) languages[l] = absoluteUrl(l, href);
  languages['x-default'] = absoluteUrl(routing.defaultLocale, href);
  return { languages };
}
```

(`getPathname` is synchronous for static pathnames in next-intl 4 when called with an explicit `locale`; if the installed version returns a Promise, make both helpers `async` and update the tests accordingly — note it in the commit.)

`src/lib/seo/metadata.ts`:

```ts
import type { Metadata } from 'next';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../contract/website-bundle.v1';
import { makeT } from '@/content/adapter';
import { absoluteUrl, localeAlternates, SITE_URL } from './routes';

type Href = Parameters<typeof absoluteUrl>[1];

export function buildMetadata(args: {
  locale: Locale;
  href: Href;
  bundle: Bundle;
  pageKey: string;
  fallbackTitle: string;
  fallbackDescription: string;
}): Metadata {
  const { locale, href, bundle, pageKey } = args;
  const t = makeT(bundle);
  const seo = bundle.pages[pageKey];
  const title = seo ? t(seo.titleId) : args.fallbackTitle;
  const description = seo ? t(seo.descriptionId) : args.fallbackDescription;
  const canonical = seo?.canonical ?? absoluteUrl(locale, href);
  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: { canonical, ...localeAlternates(href) },
    robots:
      seo?.robots === 'noindex' ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'JobsAdmire',
      locale: locale === 'tr' ? 'tr_TR' : 'en_US',
      type: 'website',
      images: seo?.ogImage ? [seo.ogImage] : ['/opengraph-image.png'],
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}
```

`src/lib/seo/jsonld.ts`:

```ts
import type { Settings } from '../../../contract/website-bundle.v1';

export function organizationJsonLd(s: Settings, o: { name: string; description: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'EmploymentAgency'],
    name: o.name,
    description: o.description,
    url: s.siteUrl,
    logo: `${s.siteUrl}/brand/ja-mark.png`,
    telephone: s.phone,
    email: s.email,
    identifier: [
      {
        '@type': 'PropertyValue',
        propertyID: 'İŞKUR Private Employment Agency Permit',
        value: s.licence.permitNo,
      },
      { '@type': 'PropertyValue', propertyID: 'Tax No', value: s.licence.taxNo },
    ],
    sameAs: [
      s.social.instagram,
      s.social.tiktok,
      s.social.linkedin,
      s.social.facebook,
      s.telegramUrl,
      `https://wa.me/${s.whatsappNumber}`,
    ],
    address: [
      {
        '@type': 'PostalAddress',
        streetAddress: 'Adnan Menderes Blv. No 7/6',
        addressLocality: 'Muratpaşa, Antalya',
        addressCountry: 'TR',
      },
      {
        '@type': 'PostalAddress',
        streetAddress: 'Shahrah-e-Faisal',
        addressLocality: 'Karachi',
        addressCountry: 'PK',
      },
    ],
  };
}

export const websiteJsonLd = (s: Settings) => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  url: s.siteUrl,
  name: 'JobsAdmire',
  inLanguage: ['tr', 'en'],
});

export const breadcrumbJsonLd = (items: { name: string; url: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: it.name,
    item: it.url,
  })),
});

/** AEO only — FAQ rich results are no longer shown for commercial sites (docs/SEO.md). */
export const faqJsonLd = (pairs: { q: string; a: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: pairs.map((p) => ({
    '@type': 'Question',
    name: p.q,
    acceptedAnswer: { '@type': 'Answer', text: p.a },
  })),
});
```

`src/lib/seo/JsonLd.tsx`:

```tsx
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
```

`src/app/sitemap.ts` — one entry per static internal pathname (excluding `[slug]` routes, `/thank-you`, `/portal-login`, `/newsletter/*`) per locale with `alternates.languages` from `localeAlternates` (self-reference included); tag `sitemap` when fetching the bundle for blog entries (WP2 adds). `export const revalidate = 900`.

`src/app/robots.ts`:

```ts
import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo/routes';
export default function robots(): MetadataRoute.Robots {
  const preview = process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production';
  return preview
    ? { rules: { userAgent: '*', disallow: '/' } }
    : {
        rules: {
          userAgent: '*',
          allow: '/',
          disallow: [
            '/api/',
            '/portal-girisi',
            '/en/portal-login',
            '/tesekkurler',
            '/en/thank-you',
          ],
        },
        sitemap: `${SITE_URL}/sitemap.xml`,
      };
}
```

`e2e/seo.spec.ts`: `/` has one `h1`, `link[rel=canonical]`, `link[hreflang=tr]`, `link[hreflang=en]`, `link[hreflang=x-default]`; `/en/hire-workers` canonical equals its own URL; `/sitemap.xml` returns 200 and contains `/isci-talebi` and `/en/hire-workers`; `/robots.txt` 200; the home HTML contains `"@type":["Organization","EmploymentAgency"]`.

Run: `npm run test -- src/lib/seo` then build + `npx playwright test e2e/seo.spec.ts --project=desktop` Expected: green.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat(seo): metadata/alternates builders, sitemap, robots, Organization/WebSite/Breadcrumb/FAQ JSON-LD"
```

---

