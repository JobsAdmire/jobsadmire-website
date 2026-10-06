import { useTranslations } from 'next-intl';
import type { Locale } from '@/i18n/routing';

/** The draft preview's banner (W248): "Önizleme — yayında değil" / "Preview — not published"
 *  above the article, in the amber notice face, with the way out — `/api/blog-preview/exit`
 *  switches draft mode off and lands on the blog index. A plain `<a>`: it is a route handler,
 *  never a page to prefetch. */
export function PreviewBar({ locale }: { locale: Locale }) {
  const sys = useTranslations('sys');
  return (
    <div
      data-testid="blog-preview-bar"
      className="border-b border-amber-border bg-amber-surface text-warning-text"
    >
      <div className="container-site flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-3">
        <p className="text-body-sm m-0 font-extrabold">{sys('blog.preview.bar')}</p>
        <a
          href={`/api/blog-preview/exit?locale=${locale}`}
          data-testid="blog-preview-exit"
          className="text-body-sm rounded-pill border border-amber-border bg-white px-3.5 py-1.5 font-extrabold text-warning-text no-underline hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe"
        >
          {sys('blog.preview.exit')}
        </a>
      </div>
    </div>
  );
}
