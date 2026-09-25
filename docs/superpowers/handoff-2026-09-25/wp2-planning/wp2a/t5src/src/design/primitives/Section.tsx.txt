import type { ReactNode } from 'react';

export type SectionTone = 'light' | 'dark' | 'pale' | 'band';

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
