import type { ReactNode } from 'react';
import { Section, type SectionTone } from '@/design/primitives/Section';
import { SectionToggle } from '../_components/SectionToggle';
import { SectionHead, type SectionHeadProps } from './ui';

// Section's tones set `py-16`; these set padding only at OTHER variants (W122): the design's 8 px
// ≤ 700 px, its 62/80 px from 701 px and × 0.75 from 1101 px (D19).
const PAD = {
  basis: 'scroll-mt-5 max-md:py-2 md:py-[62px] xl:py-[46.5px]',
  section: 'scroll-mt-5 max-md:py-2 md:py-20 xl:py-[60px]',
} as const;
// `.container-site` is unlayered CSS, so a utility cannot narrow it: a narrow body nests.
const NARROW = 'mx-auto max-w-[1080px] xl:max-w-[1040px]';

/**
 * One designed content section (`.ja-cs`): the section id is the anchor the jump chips, the
 * card's "Check your quota →" and the header CTA sweep target (W152/W158); the test id sits on a
 * page-owned wrapper, never on `Section` (W113); the heading pair is outside the phone toggle
 * (W10). The FAQ passes no `head` — `FaqBlock` owns its h2.
 */
export function CalcSection({
  id,
  tone,
  testId,
  toggle,
  head,
  pad = 'section',
  width = 'wide',
  children,
}: {
  id: string;
  tone: SectionTone;
  testId: string;
  toggle: { title: string; subtitle: string };
  head?: SectionHeadProps;
  pad?: keyof typeof PAD;
  width?: 'wide' | 'narrow';
  children: ReactNode;
}) {
  const body = (
    <>
      {head ? <SectionHead {...head} /> : null}
      <SectionToggle title={toggle.title} subtitle={toggle.subtitle}>
        {children}
      </SectionToggle>
    </>
  );
  return (
    <Section id={id} tone={tone} className={PAD[pad]}>
      <div data-testid={testId} className="container-site">
        {width === 'narrow' ? <div className={NARROW}>{body}</div> : body}
      </div>
    </Section>
  );
}
