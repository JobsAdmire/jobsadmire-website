import { useTranslations } from 'next-intl';
import { makeTf } from '@/content/pure';
import { EmptyState } from '@/design/blocks/EmptyState';
import { Eyebrow } from '@/design/primitives/Eyebrow';
import { Section } from '@/design/primitives/Section';
import type { SectionProps } from './types';

/**
 * The "Live candidates" slot (design lines 487–527). D2 keeps per-profile cards off at launch and
 * the section's copy makes cadence/count claims nobody has signed ("updates weekly", "14+ live
 * profiles", home.063–067 — W6), so Phase A renders the designed empty state with the request
 * door under the neutral nav label home.003 ("Candidates"). When a `pool` feed exists (Phase B,
 * the Available Workers task owns its shape) this is where it mounts; the empty state stays the
 * fallback.
 */
export function PoolSection({ locale, bundle }: SectionProps) {
  const tf = makeTf(bundle, locale);
  const sys = useTranslations('sys');
  return (
    <Section tone="light" id="candidates">
      <div data-testid="pool" className="container-site">
        <Eyebrow>{tf('home.003')}</Eyebrow>
        <EmptyState
          testId="pool-empty"
          tone="pale"
          headingLevel={2}
          className="mt-4"
          title={sys('home.pool.empty.title')}
          body={sys('home.pool.empty.body')}
          cta={{ label: sys('home.pool.empty.cta'), href: '/available-workers' }}
        />
      </div>
    </Section>
  );
}
