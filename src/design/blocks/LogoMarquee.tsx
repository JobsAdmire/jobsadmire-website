import type { ReactNode } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
// By module path, not the barrel (W147): a server component's barrel import makes every
// 'use client' primitive the barrel re-exports a client reference of the page.
import { PausableMarquee } from '@/design/primitives/PausableMarquee';

export type Logo = { src: string; alt: string; width: number; height: number };

/** The client-logo scroller (Hire Workers, Partner). Logos are local files under
 *  `public/brand/logos/` (W14); `alt` is the company name. Until consented logos exist
 *  (§10 row 11 is v1.1; W6) a page may pass `slots` — the design's labelled placeholder slots
 *  ("Müşteri logosu N" hire `logoSlots` ll. 1923–1926, "Partner logo N" partner D1390–1393):
 *  dashed 220 × 88 frames, greyscale at .62 that colour in under the pointer (`ja-hover-logo`) —
 *  shown with the page's `SampleTag`. `stat` is the design's figure column left of the track
 *  ("22+" / "25+ …", with its right divider). Nothing renders with neither logos nor slots. */
export function LogoMarquee({
  logos,
  slots = [],
  stat,
  durationSec = 38,
  className,
}: {
  logos: Logo[];
  slots?: string[];
  stat?: ReactNode;
  durationSec?: number;
  className?: string;
}) {
  const sys = useTranslations('sys');
  if (logos.length === 0 && slots.length === 0) return null;
  const track = (
    <div className="min-w-0 flex-1 [mask-image:linear-gradient(90deg,transparent_0,#000_6%,#000_94%,transparent_100%)]">
      <PausableMarquee
        durationSec={durationSec}
        labelPause={sys('marquee.pause')}
        labelPlay={sys('marquee.play')}
      >
        {logos.length > 0
          ? logos.map((logo, i) => (
              <span
                key={`${i}-${logo.src}`}
                className="flex h-[66px] w-[165px] items-center justify-center"
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={logo.width}
                  height={logo.height}
                  className="max-h-full w-auto object-contain"
                />
              </span>
            ))
          : slots.map((label, i) => (
              <span
                key={`${i}-${label}`}
                data-placeholder={`logo-${i + 1}`}
                className="ja-hover-logo mr-4 flex h-[88px] w-[220px] items-center justify-center rounded-sm border-[1.5px] border-dashed border-tint-border bg-pale-1 px-3 text-center text-[12.5px] font-bold text-text-tertiary max-md:h-[72px] max-md:w-[180px] xl:h-[66px] xl:w-[165px] xl:text-[11px]"
              >
                {label}
              </span>
            ))}
      </PausableMarquee>
    </div>
  );
  return (
    <div
      className={
        [
          stat ? 'flex items-center gap-8 max-md:flex-col max-md:items-stretch max-md:gap-4' : null,
          className,
        ]
          .filter(Boolean)
          .join(' ') || undefined
      }
    >
      {stat && (
        <div className="shrink-0 border-r border-edge pr-8 max-md:border-r-0 max-md:pr-0 max-md:text-center">
          {stat}
        </div>
      )}
      {track}
    </div>
  );
}
