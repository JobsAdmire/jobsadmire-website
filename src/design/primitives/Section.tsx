import type { ReactNode } from 'react';

export type SectionTone =
  'light' | 'dark' | 'pale' | 'band' | 'pale-fade' | 'alert-fade' | 'pale-middle';

/** The design's three surfaces (white, navy, the pale #f4f9fc blocks such as FAQ/process/
 *  offices) plus `band`: a white wrapper with tighter vertical padding that hosts one
 *  full-width rounded card (ClosingCtaBand, NewsletterBand). Desktop paddings are the
 *  package's 84 px / 48–72 px × 0.75 (D19). No inner container — pages wrap content in
 *  `container-site` themselves. */
const TONE: Record<SectionTone, string> = {
  light: 'bg-white text-ink py-16',
  dark: 'bg-navy text-white py-16',
  pale: 'bg-pale-1 text-ink py-16',
  band: 'bg-white text-ink py-10',
  // SHARED 14.5: the design's section gradients — #f4f9fc → white (Join), white → #fdf6f6 (the
  // Verify report section), white → #f4f9fc → white (the Verify register).
  'pale-fade': 'bg-gradient-to-b from-pale-1 to-white text-ink py-16',
  'alert-fade': 'bg-gradient-to-b from-white to-[#fdf6f6] text-ink py-16',
  'pale-middle': 'bg-gradient-to-b from-white via-pale-1 to-white text-ink py-16',
};

export function Section({
  tone,
  id,
  className,
  children,
}: {
  tone: SectionTone;
  id?: string;
  className?: string;
  children?: ReactNode;
}) {
  const cls = [TONE[tone], className].filter(Boolean).join(' ');
  return (
    <section id={id} className={cls}>
      {children}
    </section>
  );
}
