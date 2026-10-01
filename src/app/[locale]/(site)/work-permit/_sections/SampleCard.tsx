import { useTranslations } from 'next-intl';
import { Eyebrow } from '@/design/primitives/Eyebrow';
import { CheckIcon } from '../_components/icons';
import { sp } from '../_lib/fragments';

const FIELD = 'text-[8px] font-extrabold tracking-[0.5px] text-text-secondary uppercase';
const VALUE = 'text-[12px] font-extrabold break-words text-ink';
const BARS = [2, 1, 3, 1, 2, 1, 2, 3, 1, 2, 1, 2, 3, 1, 2] as const;

/** The design's mock ÇALIŞMA İZNİ card (README: a deliberate reproduction with fictional data —
 *  counsel sign-off item, WP-C). One `role="img"` picture named by `sys.wp.sample.label` (its
 *  fields are not a data table, D20); the "ÖRNEK · SAMPLE" watermark is a CSS pseudo-element
 *  painted from `wp.143`'s data attribute — decorative text at 9 % opacity would be an axe
 *  `color-contrast` failure; the caption `wp.160` always shows. ≤ 700 px the fields fold into
 *  two columns beside the photo, as designed. */
export function SampleCard({ tf }: { tf: (id: string) => string }) {
  const sys = useTranslations('sys');
  const field = (labelId: string, value: string) => (
    <div className="min-w-0">
      <div className={FIELD}>{tf(labelId)}</div>
      <div className={VALUE}>{value}</div>
    </div>
  );
  const [employer, company] = [tf('wp.157'), tf('wp.158')];
  return (
    <div
      data-testid="wp-sample"
      className="mx-auto mt-14 grid max-w-[1080px] items-center gap-12 max-md:mt-7 max-md:gap-5 lg:grid-cols-[0.9fr_1.1fr]"
    >
      <div className="min-w-0">
        <Eyebrow>{tf('wp.139')}</Eyebrow>
        <h3 className="m-0 mt-3.5 mb-3 text-[26px] leading-[1.2] tracking-[-0.02em] max-md:text-[20px] xl:text-[19.5px]">
          {tf('wp.140')}
        </h3>
        <p className="m-0 mb-4.5 text-body text-text-secondary">{tf('wp.141')}</p>
        <p className="m-0 flex items-start gap-2.5 text-body-sm text-text-secondary">
          <CheckIcon size={16} className="mt-0.5 flex-none text-success" />
          <span>{tf('wp.142')}</span>
        </p>
      </div>
      <figure className="m-0 min-w-0">
        <div className="rounded-lg border border-tint-border bg-white p-6.5 shadow-[0_24px_60px_rgba(22,60,90,0.14)] max-md:rounded-base max-md:p-3">
          <div
            role="img"
            aria-label={sys('wp.sample.label')}
            className="relative flex flex-col overflow-hidden rounded-sm border border-[#b9cfe3] bg-gradient-to-br from-[#eef4fa] via-[#dce9f5] to-[#cfe0f0] px-5.5 py-4.5 max-md:px-3.5 max-md:py-3"
          >
            <span
              aria-hidden="true"
              data-watermark={tf('wp.143')}
              className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-[24deg] text-[44px] font-extrabold tracking-[6px] whitespace-nowrap text-[rgba(22,60,90,0.09)] before:content-[attr(data-watermark)] max-md:text-[25px] max-md:tracking-[3px]"
            />
            <div className="relative flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2.5">
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 30 30"
                  aria-hidden="true"
                  focusable="false"
                  className="flex-none"
                >
                  <circle cx="15" cy="15" r="14" fill="#E30A17" />
                  <circle cx="13" cy="15" r="6.5" fill="#ffffff" />
                  <circle cx="14.7" cy="15" r="5.3" fill="#E30A17" />
                  <path d="M23.2 15l-4.4 1.4 2.7-3.7v4.6l-2.7-3.7z" fill="#ffffff" />
                </svg>
                <div className="min-w-0 leading-tight">
                  <div className="text-[10px] font-extrabold tracking-[0.6px] text-ink">
                    {tf('wp.144')}
                  </div>
                  <div className="text-[8.5px] font-bold tracking-[0.4px] text-text-secondary">
                    {tf('wp.145')}
                  </div>
                </div>
              </div>
              <div className="flex-none rounded-[6px] border-[1.5px] border-blue-safe px-2.5 py-1 text-[12px] font-extrabold tracking-[1.5px] whitespace-nowrap text-blue-safe">
                {tf('wp.146')}
              </div>
            </div>
            <div className="relative mt-3 grid grid-cols-[62px_1fr] gap-2.5 md:grid-cols-[76px_1fr_1fr] md:gap-3">
              <div className="row-span-2 aspect-[0.8] self-start overflow-hidden rounded-[8px] border border-[#b9cfe3] bg-[#dfe9f2] md:row-span-1">
                <svg
                  viewBox="0 0 80 100"
                  aria-hidden="true"
                  focusable="false"
                  preserveAspectRatio="xMidYMax slice"
                  className="block h-full w-full"
                >
                  <rect width="80" height="100" fill="#dfe9f2" />
                  <path d="M12 100c0-16 12-25 28-25s28 9 28 25z" fill="#3c4a5d" />
                  <path d="M33 72h14v10c0 4-3.5 6-7 6s-7-2-7-6z" fill="#c99e7c" />
                  <ellipse cx="40" cy="46" rx="17" ry="21" fill="#d9af8b" />
                  <path
                    d="M23 42c-1-14 8-22 17-22s18 8 17 22c-2-9-7-12-17-12s-15 3-17 12z"
                    fill="#2e2620"
                  />
                  <ellipse cx="33" cy="47" rx="2" ry="2.4" fill="#2e2620" />
                  <ellipse cx="47" cy="47" rx="2" ry="2.4" fill="#2e2620" />
                  <path
                    d="M29 42.5c2-1.6 6-1.6 8 0"
                    stroke="#2e2620"
                    strokeWidth="1.6"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <path
                    d="M43 42.5c2-1.6 6-1.6 8 0"
                    stroke="#2e2620"
                    strokeWidth="1.6"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <path
                    d="M40 48v7l-2.5 1.5"
                    stroke="#c08c66"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <path
                    d="M34.5 61c3 2.2 8 2.2 11 0"
                    stroke="#a06a48"
                    strokeWidth="1.6"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <path
                    d="M28 56c1 6 5 12 12 12s11-6 12-12c-1 8-5 16-12 16s-11-8-12-16z"
                    fill="#2e2620"
                    opacity="0.85"
                  />
                  <path d="M30 84h20v16H30z" fill="#ffffff" />
                  <path d="M36 84l4 5 4-5 3 3-7 8-7-8z" fill="#1f4d7a" />
                </svg>
              </div>
              <div className="flex min-w-0 flex-col gap-2">
                {field('wp.147', tf('wp.148'))}
                {field('wp.149', tf('wp.150'))}
                {field('wp.151', tf('wp.152'))}
              </div>
              <div className="flex min-w-0 flex-col gap-2">
                {field('wp.153', sys('wp.sample.foreignerId'))}
                {field('wp.154', tf('wp.155'))}
                {field('wp.156', sys('wp.sample.validity'))}
              </div>
            </div>
            <div className="relative mt-2.5 flex items-end justify-between gap-3">
              <div className="min-w-0 text-[9.5px] font-bold text-text-secondary">
                {employer}
                {sp(employer, company)}
                <span className="font-extrabold text-ink">{company}</span>
              </div>
              <div className="flex flex-none flex-col items-end gap-0.5">
                <div aria-hidden="true" className="flex gap-[1.5px]">
                  {BARS.map((w, i) => (
                    <span key={i} className="h-3.5 bg-ink" style={{ width: w }} />
                  ))}
                </div>
                <span className="text-[7px] font-bold tracking-[1px] text-text-secondary">
                  {tf('wp.159')}
                </span>
              </div>
            </div>
          </div>
        </div>
        <figcaption className="mt-3 text-center text-body-sm text-text-tertiary">
          {tf('wp.160')}
        </figcaption>
      </figure>
    </div>
  );
}
