import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { JsonLd } from '@/lib/seo/JsonLdScript';
import { breadcrumbJsonLd } from '@/lib/seo/jsonld';
import { absoluteUrl, type Href } from '@/lib/seo/routes';

/** The article hero's trail (DC 502–508): `Home / Blog / {category}` — the third crumb is the
 *  CATEGORY as plain text (not the article's long title, which wrapped to two lines on phones),
 *  while the BreadcrumbList node keeps the article title as its last item. Page-local twin of the
 *  shared `Breadcrumbs` (whose JSON-LD names are its visible names). */
export function ArticleCrumbs({
  locale,
  home,
  blog,
  category,
  title,
  href,
}: {
  locale: Locale;
  home: string;
  blog: string;
  category: string;
  /** the article's own name and typed href — JSON-LD only */
  title: string;
  href: Href;
}) {
  const sys = useTranslations('sys');
  const link = 'inline-block py-1.5 text-sky no-underline hover:underline md:py-0';
  return (
    <>
      <nav aria-label={sys('nav.breadcrumbs')} className="max-md:mb-1.5">
        <ol className="m-0 flex list-none flex-wrap items-center gap-2 p-0 text-body-sm font-bold">
          <li className="flex items-center gap-2">
            <Link href="/" prefetch={false} className={link}>
              {home}
            </Link>
          </li>
          <li className="flex items-center gap-2">
            <span aria-hidden="true" className="text-white/35">
              /
            </span>
            <Link href="/blog" prefetch={false} className={link}>
              {blog}
            </Link>
          </li>
          <li className="flex items-center gap-2">
            <span aria-hidden="true" className="text-white/35">
              /
            </span>
            <span aria-current="page" className="text-white/55">
              {category}
            </span>
          </li>
        </ol>
      </nav>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: home, url: absoluteUrl(locale, '/') },
          { name: blog, url: absoluteUrl(locale, '/blog') },
          { name: title, url: absoluteUrl(locale, href) },
        ])}
      />
    </>
  );
}
