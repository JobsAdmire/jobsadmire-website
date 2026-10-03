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

/** The plain timeline (About's journey, the calculator's route tabs). Numbered dots, `when`
 *  pills and cards belong to `ProcessSteps` in `src/design/blocks`. */
export function Timeline({
  steps,
  variant = 'vertical',
}: {
  steps: TimelineStep[];
  variant?: 'vertical' | 'horizontal' | 'rail-to-row';
}) {
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
