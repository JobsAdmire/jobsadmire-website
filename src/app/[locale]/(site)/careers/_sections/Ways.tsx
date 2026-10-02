import { Eyebrow } from '@/design/primitives/Eyebrow';
import { Section } from '@/design/primitives/Section';
import { Link } from '@/i18n/navigation';
import type { Tf } from '../_lib/roles';

const WAYS = [
  {
    badge: 'jt.060',
    title: 'jt.061',
    body: 'jt.062',
    bullets: ['jt.063', 'jt.064', 'jt.065'],
    dark: true,
  },
  {
    badge: 'jt.066',
    title: 'jt.067',
    body: 'jt.068',
    bullets: ['jt.069', 'jt.070', 'jt.071'],
    dark: false,
  },
  {
    badge: 'jt.072',
    title: 'jt.073',
    body: 'jt.074',
    bullets: ['jt.075', 'jt.076', 'jt.077'],
    dark: false,
  },
] as const;

const CARD = {
  dark: 'rounded-lg bg-[linear-gradient(135deg,#253063_0%,#16204a_100%)] p-7 text-white',
  light: 'rounded-lg border-[1.5px] border-tint-border bg-white p-7 text-ink',
} as const;
const BADGE = {
  dark: 'mb-4 inline-flex rounded-pill border border-white/20 bg-white/15 px-3 py-1 text-[11.5px] font-extrabold uppercase tracking-[0.08em] text-white',
  light:
    'mb-4 inline-flex rounded-pill bg-tint px-3 py-1 text-[11.5px] font-extrabold uppercase tracking-[0.08em] text-blue-safe',
} as const;

/** "Three ways to work with us" (design `.ja-jt-types`): static cards on every width — the
 *  design's ≤ 900 px accordions are not ported (W10). `jt.078` is legal-flagged (verbatim);
 *  `jt.079` is the package's own link fragment, underlined inside the sentence. */
export function WaysSection({ t }: { t: Tf }) {
  return (
    <Section tone="light" className="border-t border-border-3">
      <div data-testid="careers-ways" className="container-site">
        <div className="mb-8 max-w-[680px]">
          <Eyebrow>{t('jt.057')}</Eyebrow>
          <h2 className="mt-3 mb-3 text-h2 leading-[1.05] tracking-[-0.04em]">{t('jt.058')}</h2>
          <p className="text-body text-text-secondary">{t('jt.059')}</p>
        </div>
        <ul className="grid gap-4 md:grid-cols-3">
          {WAYS.map((w) => {
            const tone = w.dark ? 'dark' : 'light';
            return (
              <li key={w.title} className={CARD[tone]}>
                <p className={BADGE[tone]}>{t(w.badge)}</p>
                <h3 className="text-card-title tracking-[-0.02em]">{t(w.title)}</h3>
                <p
                  className={
                    w.dark
                      ? 'mt-2 mb-4 text-body-sm text-[#c9d6ec]'
                      : 'mt-2 mb-4 text-body-sm text-text-secondary'
                  }
                >
                  {t(w.body)}
                </p>
                <ul className="flex flex-col gap-2 text-body-sm">
                  {w.bullets.map((b) => (
                    <li key={b} className="flex gap-2">
                      <span
                        aria-hidden="true"
                        className={
                          w.dark ? 'font-extrabold text-[#7de2a5]' : 'font-extrabold text-blue-safe'
                        }
                      >
                        •
                      </span>
                      {t(b)}
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
        <p className="mt-4 rounded-base border border-border-2 bg-pale-1 px-5 py-4 text-body-sm text-text-secondary">
          {t('jt.078')}{' '}
          <Link
            href="/partner-with-us"
            prefetch={false}
            className="font-extrabold text-blue-safe underline"
          >
            {t('jt.079')}
          </Link>
        </p>
      </div>
    </Section>
  );
}
