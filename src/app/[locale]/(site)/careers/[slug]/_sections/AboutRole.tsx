import { useTranslations } from 'next-intl';
import { Section } from '@/design/primitives/Section';
import { Link } from '@/i18n/navigation';
import { descriptionBlocks, type PublicOpening } from '@/lib/careers-pure';
import type { OpeningView } from '../_lib/view';

/** The opening's one description as headings, paragraphs and lists (text only, never HTML —
 *  Operations' rich-text form is converted by `descriptionBlocks`, W230) and the "At a glance"
 *  facts — rows with no value are left out. */
export function AboutRole({
  opening,
  view,
  engagementLabel,
}: {
  opening: PublicOpening;
  view: OpeningView;
  /** `jt.049` */
  engagementLabel: string;
}) {
  const sys = useTranslations('sys');
  const blocks = descriptionBlocks(opening.description);
  const facts: [string, string][] = [
    [sys('careers.detail.facts.location'), view.location],
    [sys('careers.detail.facts.workMode'), view.workModes],
    [engagementLabel, view.engagement],
    [sys('careers.detail.facts.languages'), view.languages],
    [sys('careers.detail.facts.salary'), view.pay ?? ''],
    [sys('careers.detail.facts.posted'), view.posted],
  ];
  return (
    <Section tone="light">
      <div className="container-site grid items-start gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="min-w-0">
          <h2 className="mb-4 text-h2 leading-[1.05] tracking-[-0.04em] max-[601px]:text-[25px] max-[601px]:tracking-[-0.4px]">
            {sys('careers.detail.about')}
          </h2>
          {blocks.length > 0 && (
            <div
              data-testid="careers-description"
              className="flex flex-col gap-4 text-body text-text-secondary"
            >
              {blocks.map((block, i) =>
                block.type === 'h' ? (
                  <h3 key={i} className="mt-2 text-card-title text-ink">
                    {block.text}
                  </h3>
                ) : block.type === 'p' ? (
                  // a rich-text `<br>` arrives as a line break inside the paragraph (W230)
                  <p key={i} className="whitespace-pre-line">
                    {block.text}
                  </p>
                ) : block.type === 'ol' ? (
                  <ol key={i} className="flex list-decimal flex-col gap-2 pl-5">
                    {block.items.map((item, j) => (
                      <li key={j}>{item}</li>
                    ))}
                  </ol>
                ) : (
                  <ul key={i} className="flex list-disc flex-col gap-2 pl-5">
                    {block.items.map((item, j) => (
                      <li key={j}>{item}</li>
                    ))}
                  </ul>
                ),
              )}
            </div>
          )}
          <p className="mt-8">
            <Link
              href="/careers"
              prefetch={false}
              className="font-extrabold text-blue-safe underline"
            >
              <span aria-hidden="true">← </span>
              {sys('careers.detail.back')}
            </Link>
          </p>
        </div>
        <div
          data-testid="careers-facts"
          className="rounded-lg border border-border-2 bg-pale-1 p-6"
        >
          <h2 className="mb-3 text-card-title">{sys('careers.detail.facts.title')}</h2>
          <dl>
            {facts
              .filter(([, value]) => value.length > 0)
              .map(([label, value]) => (
                <div
                  key={label}
                  className="flex flex-col gap-0.5 border-b border-border-3 py-2 last:border-b-0"
                >
                  <dt className="text-eyebrow font-extrabold uppercase tracking-[0.08em] text-text-secondary">
                    {label}
                  </dt>
                  <dd className="text-body-sm font-bold text-ink">{value}</dd>
                </div>
              ))}
          </dl>
        </div>
      </div>
    </Section>
  );
}
