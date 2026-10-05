import { useTranslations } from 'next-intl';

const TONE = {
  /** the design's amber "sample data" pill (Success Stories / Verify `pill("#fffbeb", "#fde68a",
   *  "#b45309")`) on light surfaces */
  light: 'border-amber-border bg-amber-surface text-warning-text',
  /** the same pill on navy/night bands and photo overlays: amber on a translucent dark face */
  dark: 'border-amber-border/40 bg-night/70 text-amber-border',
} as const;

/**
 * The small "örnek / sample" chip every data-gated section wears while it shows the design's
 * sample content as page-local constants (owner 2026-10-05: sections render the design's sample
 * with this tag instead of staying empty — never `design-package/data/*.sample.json` nor the
 * `pool` / `stories` / `representatives` collections, D23). Copy is `sys.sample.tag` ("örnek" /
 * "sample"); `sys.sample.title` ("Örnek içerik — gerçek veriler yakında") is the hover title and
 * the visually hidden explanation, so assistive tech hears why the content is a sample.
 *
 * Place it where the design places its "sample data" badge, else beside the section heading.
 * A server or client component alike (`useTranslations` works in both).
 */
export function SampleTag({
  tone = 'light',
  className,
}: {
  tone?: keyof typeof TONE;
  className?: string;
}) {
  const sys = useTranslations('sys');
  const title = sys('sample.title');
  return (
    <span
      data-sample-tag=""
      title={title}
      className={[
        'inline-flex shrink-0 items-center gap-1 rounded-pill border px-2.5 py-[3px] align-middle text-[10.5px] leading-none font-extrabold tracking-[0.5px] uppercase xl:text-[11px]',
        TONE[tone],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-pill bg-current" />
      {sys('sample.tag')}
      <span className="sr-only"> — {title}</span>
    </span>
  );
}
