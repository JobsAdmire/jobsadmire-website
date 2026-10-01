/** The design's section h2 (`clamp(28px, 3.2vw, 42px)`, -1.6px, line-height 1.05): the size comes
 *  from the `text-h2` token (D19-scaled from 1101 px), the letter-spacing is scaled here. Margins
 *  and colour are the caller's — neither is set, so a composition never repeats a property (W122). */
export const H2 =
  'text-h2 leading-[1.05] tracking-[-1.6px] max-xs:tracking-[-1px] xl:tracking-[-1.2px]';

/** The design's section lead paragraph (16px/1.65, `#556377`). */
export const LEAD = 'text-body leading-[1.65] text-text-secondary';

/** The design's eyebrow-and-h2 row with a right-hand aside or CTA. */
export const SECTION_HEAD = 'mb-7 flex flex-wrap items-end justify-between gap-6';
