import { Section } from '@/design/primitives/Section';
import { Tabs } from '@/design/primitives/Tabs';
import { TIMELINE_CARDS, type TimelineCard } from '../_lib/tables';

const TONE: Record<TimelineCard['key'], { card: string; pill: string }> = {
  abroad: { card: 'border border-border-2', pill: 'border-tint-border bg-tint text-blue-safe' },
  here: {
    card: 'border-[1.5px] border-success-border',
    pill: 'border-success-border bg-success-surface text-success-text',
  },
};

/** "How long will your case take?" (#timeline): the abroad and in-Türkiye cards side by side
 *  from 901 px and stacked below — D20: the design's ≤ 700 px tab switcher (`wp.261`/`262`) hid
 *  one card, so it is not ported. The durations are the metrics (`wp.264`/`wp.274`, W1). */
export function Timeline({ tf }: { tf: (id: string) => string }) {
  return (
    <Section tone="pale" id="timeline" className="scroll-mt-24 lg:scroll-mt-32 xl:scroll-mt-40">
      <div className="container-site" data-testid="wp-timeline">
        <h2 className="m-0 mb-3.5 text-center text-h2 leading-[1.05] tracking-[-0.03em] max-md:text-left max-[601px]:text-[25px] max-[601px]:tracking-[-0.4px]">
          {tf('wp.259')}
        </h2>
        <p className="mx-auto mb-11 max-w-[560px] text-center text-body-lg text-text-secondary max-md:mb-5 max-md:text-left">
          {tf('wp.260')}
        </p>
        {/* ≤ 700 px: the design's two-tab switcher (.ja-tl-tabs, wp.261 / wp.262) shows one card
            at a time — an ARIA tablist; both cards side by side from 701 px. */}
        <div data-testid="wp-timeline-tabs" className="mx-auto max-w-[1080px] md:hidden">
          <Tabs
            variant="segmented"
            defaultId="abroad"
            listClassName="-mb-3"
            tabs={[
              {
                id: 'abroad',
                label: tf('wp.261'),
                panel: (
                  <TimelineCardView
                    card={TIMELINE_CARDS[0]}
                    tf={tf}
                    testId="wp-timeline-m-abroad"
                  />
                ),
              },
              {
                id: 'here',
                label: tf('wp.262'),
                panel: (
                  <TimelineCardView card={TIMELINE_CARDS[1]} tf={tf} testId="wp-timeline-m-here" />
                ),
              },
            ]}
          />
        </div>
        <div className="mx-auto grid max-w-[1080px] gap-6 max-md:hidden lg:grid-cols-2">
          {TIMELINE_CARDS.map((card) => (
            <TimelineCardView
              key={card.key}
              card={card}
              tf={tf}
              testId={`wp-timeline-${card.key}`}
            />
          ))}
        </div>
      </div>
    </Section>
  );
}

function TimelineCardView({
  card,
  tf,
  testId,
}: {
  card: TimelineCard;
  tf: (id: string) => string;
  testId: string;
}) {
  const tone = TONE[card.key];
  const lastRow = card.rows.length - 1;
  return (
    <article
      data-testid={testId}
      className={`min-w-0 rounded-lg bg-white px-8 py-7.5 max-md:rounded-base max-md:px-4 max-md:py-4 ${tone.card}`}
    >
      <div className="mb-5 flex items-center justify-between gap-3 max-md:mb-3">
        <h3 className="m-0 text-card-title">{tf(card.titleId)}</h3>
        <span
          className={`rounded-pill border px-3.5 py-1 text-body-sm font-extrabold whitespace-nowrap ${tone.pill}`}
        >
          {tf(card.durationId)}
        </span>
      </div>
      <dl className="border-b border-border-4">
        {card.rows.map(([whenId, whatId], i) => (
          <div
            key={`${whenId}-${whatId}`}
            className="flex gap-3.5 border-t border-border-4 py-3 max-md:gap-3 max-md:py-2.5"
          >
            <dt
              className={`min-w-[86px] flex-none text-body-sm font-extrabold max-md:min-w-[66px] ${card.key === 'here' || i === lastRow ? 'text-success-text' : 'text-blue-safe'}`}
            >
              {tf(whenId)}
            </dt>
            <dd className="m-0 min-w-0 text-body-sm text-text-secondary">{tf(whatId)}</dd>
          </div>
        ))}
      </dl>
      {card.noteId ? (
        <p className="m-0 mt-4 text-body-sm text-text-tertiary">{tf(card.noteId)}</p>
      ) : null}
    </article>
  );
}
