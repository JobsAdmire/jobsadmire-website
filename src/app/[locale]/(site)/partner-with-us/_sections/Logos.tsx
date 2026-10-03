import { LogoMarquee, type Logo } from '@/design/blocks/LogoMarquee';
import { Section } from '@/design/primitives/Section';

/** The partner logo marquee: nothing — not even its band — until consented logos exist (W6,
 *  §10 #11); the design's "25+ partner companies" caption is an unsigned figure (W1). */
export function Logos({ logos }: { logos: readonly Logo[] }) {
  if (logos.length === 0) return null;
  return (
    <Section tone="band" className="border-b border-border-3">
      <div className="container-site" data-testid="partner-logos">
        <LogoMarquee logos={[...logos]} />
      </div>
    </Section>
  );
}
