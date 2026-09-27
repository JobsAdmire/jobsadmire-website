import type { FlagCode } from '@/design/assets/flag-codes';

/** A flag from the local sprite (`public/brand/flags.svg`, built by `npm run assets:flags`).
 *  Decorative unless `label` is given — next to a country name the name is the label; alone
 *  (a flag chip with only a count) pass the localized country name. 4:3 like the design's
 *  20×14 flagcdn tiles, which this replaces (W14: no runtime fetch to flagcdn). Codes are
 *  upper-case ISO2 (W40); bridge Task 1's `code: string` with `isFlagCode`. */
export function Flag({
  code,
  size = 20,
  label,
  className,
}: {
  code: FlagCode;
  size?: number;
  label?: string;
  className?: string;
}) {
  const height = Math.round(size * 0.75);
  return (
    <svg
      width={size}
      height={height}
      viewBox="0 0 640 480"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
      className={[
        'inline-block flex-none overflow-hidden rounded-[2px] shadow-[0_0_0_1px_rgba(22,60,90,0.15)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <use href={`/brand/flags.svg#flag-${code}`} />
    </svg>
  );
}
