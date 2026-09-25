import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { PausableMarquee } from '@/design/primitives';

export type Logo = { src: string; alt: string; width: number; height: number };

/** The client-logo scroller (Hire Workers, Partner). Renders nothing until consented logos
 *  exist (§10 row 11 is v1.1; W6) — an empty marquee of placeholder slots would be counted
 *  against the page by the launch profile. Logos are local files under `public/brand/logos/`
 *  (W14); `alt` is the company name. */
export function LogoMarquee({
  logos,
  durationSec = 38,
  className,
}: {
  logos: Logo[];
  durationSec?: number;
  className?: string;
}) {
  const sys = useTranslations('sys');
  if (logos.length === 0) return null;
  return (
    <div
      className={[
        '[mask-image:linear-gradient(90deg,transparent_0,#000_6%,#000_94%,transparent_100%)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <PausableMarquee
        durationSec={durationSec}
        labelPause={sys('marquee.pause')}
        labelPlay={sys('marquee.play')}
      >
        {logos.map((logo, i) => (
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
        ))}
      </PausableMarquee>
    </div>
  );
}
