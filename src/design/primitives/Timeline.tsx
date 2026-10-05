/** W84: `body` is optional — a step with only a title (no supporting line) renders no `<p>`. */
export type TimelineStep = { when?: string; title: string; body?: string };

const LIST = {
  vertical: 'm-0 list-none space-y-6 border-l border-border-1 pl-6',
  // Stacked below md, one column per step from md up; each step carries its own top rule.
  horizontal: 'm-0 grid list-none gap-6 p-0 md:grid-flow-col md:auto-cols-fr',
  // W229: the vertical rail below 1101 px, one top-ruled column per step from 1101 px — About's
  // journey while no founder row is published (the wider box left the rail beside ~940 px of band).
  'rail-to-row':
    'm-0 list-none space-y-6 border-l border-border-1 pl-6 xl:grid xl:grid-flow-col xl:auto-cols-fr xl:gap-6 xl:space-y-0 xl:border-l-0 xl:pl-0',
} as const;

const ITEM = {
  vertical: '',
  horizontal: 'border-t-2 border-tint-border pt-4',
  'rail-to-row': 'xl:border-t-2 xl:border-tint-border xl:pt-4',
} as const;

/** SHARED 8.7 (About v1 ll. 683–713): the design's journey rail — a 3 px blue → green gradient
 *  line with a 16 px ringed dot per step (blue, blue, #0fa864, green by position), the date in
 *  13.5 px mixed case above the title, the last date ("Bugün" / "Today") green. */
const RAIL_DOT = ['bg-blue', 'bg-blue', 'bg-[#0fa864]', 'bg-success'] as const;

function RailTimeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <ol
      data-variant="rail"
      className="relative m-0 list-none space-y-7 p-0 pl-9 before:absolute before:top-2 before:bottom-2 before:left-[7px] before:w-[3px] before:rounded-pill before:bg-gradient-to-b before:from-[#1e9ee8] before:to-success before:content-['']"
    >
      {steps.map((s, i) => {
        const last = i === steps.length - 1;
        const dot = last ? 'bg-success' : RAIL_DOT[Math.min(i, RAIL_DOT.length - 2)];
        return (
          <li key={`${i}-${s.title}`} className="relative">
            <span
              aria-hidden="true"
              className={`absolute top-1 -left-9 h-4 w-4 rounded-pill shadow-[0_0_0_4px_#fff,0_0_0_5.5px_var(--color-border-1)] ${dot}`}
            />
            {s.when ? (
              <p
                className={`m-0 mb-1 text-[13.5px] font-extrabold xl:text-[11px] ${last ? 'text-success-text' : 'text-blue-safe'}`}
              >
                {s.when}
              </p>
            ) : null}
            <h3 className="text-card-title m-0">{s.title}</h3>
            {s.body ? <p className="text-body-sm m-0 mt-1 text-text-secondary">{s.body}</p> : null}
          </li>
        );
      })}
    </ol>
  );
}

/** The plain timeline (About's journey, the calculator's route tabs). Numbered dots, `when`
 *  pills and cards belong to `ProcessSteps` in `src/design/blocks`. `rail` is About's design
 *  journey (SHARED 8.7). */
export function Timeline({
  steps,
  variant = 'vertical',
}: {
  steps: TimelineStep[];
  variant?: 'vertical' | 'horizontal' | 'rail-to-row' | 'rail';
}) {
  if (variant === 'rail') return <RailTimeline steps={steps} />;
  return (
    <ol data-variant={variant} className={LIST[variant]}>
      {steps.map((s, i) => (
        <li key={`${i}-${s.title}`} className={ITEM[variant]}>
          {s.when ? (
            <p className="text-eyebrow font-extrabold uppercase tracking-[1.6px] text-blue-safe">
              {s.when}
            </p>
          ) : null}
          <h3 className="text-card-title">{s.title}</h3>
          {s.body ? <p className="text-body-sm text-text-secondary">{s.body}</p> : null}
        </li>
      ))}
    </ol>
  );
}
