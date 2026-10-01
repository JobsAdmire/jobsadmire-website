import type { ReactNode } from 'react';

/** The strip's two columns (design `.ja-grid2`: 1fr / 0.85fr from 901 px). `leftTop`/`leftBottom`
 *  are server-rendered copy passed through as nodes; `chips` and `card` come from whichever
 *  renderer owns the state (the server fallback or the island). `ready` marks the mounted
 *  island for the page e2e. */
export function TeaserLayout({
  leftTop,
  chips,
  leftBottom,
  card,
  ready = false,
}: {
  leftTop: ReactNode;
  chips: ReactNode;
  leftBottom: ReactNode;
  card: ReactNode;
  ready?: boolean;
}) {
  return (
    <div
      data-testid="calc-teaser"
      data-island={ready ? 'ready' : undefined}
      className="grid items-center gap-[34px] lg:grid-cols-[1fr_0.85fr] lg:gap-14 xl:gap-[42px]"
    >
      <div className="min-w-0">
        {leftTop}
        <div className="mb-6 flex flex-col gap-[22px]">{chips}</div>
        {leftBottom}
      </div>
      <div className="min-w-0">{card}</div>
    </div>
  );
}
