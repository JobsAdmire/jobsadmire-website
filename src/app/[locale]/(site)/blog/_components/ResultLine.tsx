'use client';
import { ALL, resultLine, type ResultLineForms } from '../_lib/filter';
import { useIndexState } from './IndexState';

/**
 * The phone count line under the hero (Blog.dc.html 590–597, `.ja-blog-count` ≤ 700): "22
 * yazı", "3 yazı “izin”" or "2 yazı · Mevzuat", with "Temizle" (blog.089) while a filter is on.
 * Not a live region — `BlogTools`' status line announces the same count at every width.
 */
export function ResultLine({
  forms,
  topics,
  clearLabel,
}: {
  forms: ResultLineForms;
  /** value → label, to name the active topic */
  topics: { value: string; label: string }[];
  clearLabel: string; // blog.089
}) {
  const s = useIndexState();
  const topic =
    s.category === ALL ? null : (topics.find((o) => o.value === s.category)?.label ?? null);
  return (
    <div
      data-testid="blog-result-line"
      className="flex items-center justify-between gap-3 pt-3.5 md:hidden"
    >
      <span className="font-extrabold text-[#43536a] max-md:text-[13px]">
        {resultLine({
          shown: s.countFor(s.category),
          total: s.total,
          query: s.query,
          topic,
          forms,
        })}
      </span>
      {s.filtered ? (
        <button
          type="button"
          onClick={s.reset}
          className="flex-none cursor-pointer rounded-pill border-[1.5px] border-edge bg-white px-3.5 font-extrabold text-blue-safe focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe max-md:min-h-[34px] max-md:text-[12.5px]"
        >
          {clearLabel}
        </button>
      ) : null}
    </div>
  );
}
