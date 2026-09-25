import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { JsonLd } from '@/lib/seo/JsonLdScript';
import { breadcrumbJsonLd } from '@/lib/seo/jsonld';
import { absoluteUrl, type Href } from '@/lib/seo/routes';

/** Every crumb — the current page included — carries its typed href: the trail renders the
 *  last one as text (`aria-current="page"`), but the BreadcrumbList node needs its URL. */
export type Crumb = { name: string; href: Href };

const TONE = {
  light: { link: 'text-blue-safe', muted: 'text-text-tertiary' },
  dark: { link: 'text-sky', muted: 'text-white/55' },
} as const;

/** The design's `Home / Blog / {category}` trail on dark heroes and light pages, plus the
 *  BreadcrumbList node every non-homepage page carries (docs/SEO.md). */
export function Breadcrumbs({
  locale,
  items,
  tone = 'light',
  className,
}: {
  locale: Locale;
  items: Crumb[];
  tone?: 'light' | 'dark';
  className?: string;
}) {
  const sys = useTranslations('sys');
  const c = TONE[tone];
  return (
    <>
      <nav aria-label={sys('nav.breadcrumbs')} className={className}>
        <ol className="m-0 flex list-none flex-wrap items-center gap-2 p-0 text-body-sm font-bold">
          {items.map((it, i) => {
            const last = i === items.length - 1;
            return (
              <li key={`${i}-${it.name}`} className="flex items-center gap-2">
                {i > 0 && (
                  <span aria-hidden="true" className={c.muted}>
                    /
                  </span>
                )}
                {last ? (
                  <span aria-current="page" className={c.muted}>
                    {it.name}
                  </span>
                ) : (
                  <Link href={it.href} className={`${c.link} no-underline hover:underline`}>
                    {it.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd
        data={breadcrumbJsonLd(
          items.map((it) => ({ name: it.name, url: absoluteUrl(locale, it.href) })),
        )}
      />
    </>
  );
}
