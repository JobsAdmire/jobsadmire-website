import { makeTf } from '@/content/pure';
import { Card } from '@/design/primitives/Card';
import { Eyebrow } from '@/design/primitives/Eyebrow';
import { Section } from '@/design/primitives/Section';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import type { Testimonial } from '../_lib/stories';

/** "In their words" (success.058–068). Only consented rows render (§10 row 11 — the design's
 *  three quotes are self-declared placeholders, success.069, never shown); no rows → null.
 *  No Review JSON-LD in v1. Owns its own `Section` (W97 analogue). */
export function Testimonials({
  bundle,
  locale,
  items,
}: {
  bundle: Bundle;
  locale: Locale;
  items: Testimonial[];
}) {
  if (items.length === 0) return null;
  const t = makeTf(bundle, locale);
  return (
    <Section tone="light" className="pt-0">
      <div className="container-site" data-testid="stories-testimonials">
        <Eyebrow>{t('success.058')}</Eyebrow>
        <h2 className="m-0 mb-6 text-h2">{t('success.059')}</h2>
        <ul className="m-0 grid list-none gap-4 p-0 md:grid-cols-3">
          {items.map((q) => (
            <li key={q.id} className="min-w-0">
              <Card as="article" className="flex h-full flex-col gap-5">
                <blockquote className="m-0 text-body font-bold text-ink">{q.quote}</blockquote>
                <div className="mt-auto flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xs bg-tint text-body-sm font-extrabold text-blue-safe"
                  >
                    {q.initials}
                  </span>
                  <div>
                    <p className="m-0 text-body-sm font-extrabold text-ink">{q.role}</p>
                    <p className="m-0 text-body-sm text-text-tertiary">{q.org}</p>
                  </div>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
