export type TimelineStep = { when?: string; title: string; body: string };

export function Timeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <ol className="m-0 list-none space-y-6 border-l border-border-1 pl-6">
      {steps.map((s, i) => (
        <li key={`${i}-${s.title}`}>
          {s.when ? (
            <p className="text-eyebrow font-extrabold uppercase tracking-[1.6px] text-blue-safe">
              {s.when}
            </p>
          ) : null}
          <h3 className="text-card-title">{s.title}</h3>
          <p className="text-body-sm text-text-secondary">{s.body}</p>
        </li>
      ))}
    </ol>
  );
}
