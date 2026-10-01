import type { ReactNode } from 'react';

/** W19: no chrome — the portal entry page (T13) only. `<main id="main">` is still owned by the
 *  layout, not the page (R31: one skip-link target per document, never one per page that has
 *  to remember to add it); it holds the portal entry page (T13, `portal-login/`). */
export default function BareLayout({ children }: { children: ReactNode }) {
  return <main id="main">{children}</main>;
}
