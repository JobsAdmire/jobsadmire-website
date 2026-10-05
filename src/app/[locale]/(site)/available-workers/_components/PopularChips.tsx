'use client';
import { usePool } from './PoolContext';

/**
 * "Popular in the pool right now" (design ll. 494–501, `popularChips` ll. 1369–1380): the sample
 * pool's four busiest industries with their counts. A chip filters the pool by its industry and
 * jumps to it. On phones the chips are one horizontal scroll row (ll. 274–278).
 */
export function PopularChips({
  label,
  chips,
}: {
  /** `availworkers.031` */
  label: string;
  /** resolved "Industry · n" labels with the industry's package id as the filter key */
  chips: { key: string; label: string }[];
}) {
  const { pickIndustry } = usePool();
  return (
    <div data-testid="workers-popular" className="mt-5.5 max-md:mt-4.5">
      <p className="m-0 mb-2.25 text-[11.5px] font-extrabold tracking-[1.2px] text-white/60 uppercase max-md:mb-2 max-md:text-[11px] xl:text-[11px] xl:tracking-[0.9px]">
        {label}
      </p>
      <div className="flex flex-wrap gap-2 [scrollbar-width:none] max-md:-mx-5 max-md:flex-nowrap max-md:gap-1.75 max-md:overflow-x-auto max-md:px-5 max-md:pb-1 [&::-webkit-scrollbar]:hidden">
        {chips.map((chip) => (
          <button
            key={chip.key}
            type="button"
            onClick={() => pickIndustry(chip.key)}
            className="min-h-9 rounded-pill border-[1.5px] border-white/20 bg-white/8 px-3.75 py-1.75 text-[13.5px] font-bold whitespace-nowrap text-white/85 transition-colors hover:border-blue hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky max-md:flex-none max-md:px-3.25 max-md:text-[12.5px] xl:text-[11px]"
          >
            {chip.label}
          </button>
        ))}
      </div>
    </div>
  );
}
