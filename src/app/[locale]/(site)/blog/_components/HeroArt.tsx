import type { BlogPost } from '@/content/collections';
import { makeT } from '@/content/pure';
import type { Locale } from '@/i18n/routing';
import { formatReadMinutes } from '@/lib/format/date/formatReadMinutes';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';

/**
 * The design's hero art (desktop only — hidden ≤700 px by class, W10): ONE float card built
 * from the featured row (category label, title, author · read time — the design's blog.027/028
 * hard-type "— 2026" and "8 min read", D17/B-3) and the EN·TR pill as authored (blog.032). The
 * "Most read" card (blog.030/031) has no data source in Phase A (B-2). Decorative: the same
 * article is the featured card below, so it is `aria-hidden`; static — no float animation.
 * Renders nothing without a featured article (the TR index in Phase A).
 */
export function HeroArt({
  bundle,
  locale,
  featured,
}: {
  bundle: Bundle;
  locale: Locale;
  featured: BlogPost | null;
}) {
  const title = featured?.title[locale];
  if (!featured || !title) return null;
  const t = makeT(bundle);
  return (
    <div
      aria-hidden="true"
      data-testid="blog-hero-art"
      className="relative min-h-[240px] max-md:hidden"
    >
      <div className="absolute top-4 left-[4%] w-[250px] rounded-base border border-white/10 bg-white px-4.5 py-4 shadow-hero-form">
        <span className="inline-block rounded-pill bg-tint px-2.5 py-0.5 text-[11px] font-extrabold text-blue-safe">
          {t(featured.categoryLabelId)}
        </span>
        <p className="text-body-sm mt-2.5 mb-2 leading-snug font-extrabold text-ink">{title}</p>
        <p className="m-0 flex items-center gap-2 text-[11.5px] font-semibold text-text-tertiary">
          <span className="inline-block h-[22px] w-[22px] shrink-0 rounded-pill bg-gradient-to-br from-blue to-success" />
          {featured.author} · {formatReadMinutes(featured.readMinutes, locale)}
        </p>
      </div>
      <p className="absolute bottom-1.5 left-[12%] m-0 inline-flex items-center gap-2 rounded-pill border border-white/25 bg-white/10 px-4 py-2 text-[12.5px] font-extrabold text-white">
        <span className="text-sky">EN</span>
        <span className="text-white/40">·</span>
        <span className="text-sky">TR</span>
        <span className="font-semibold text-white/70">{t('blog.032')}</span>
      </p>
    </div>
  );
}
