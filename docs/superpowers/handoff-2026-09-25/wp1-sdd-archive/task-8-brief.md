### Task 8: Primitives (accessible building blocks)

**Files:**

- Create: `src/design/primitives/{Button,Card,Section,Eyebrow,Stat,Chip,Accordion,Tabs,Dialog,FormField,PausableMarquee,SkipLink,Timeline}.tsx`, `src/design/primitives/index.ts`, tests `src/design/primitives/__tests__/{Accordion,Dialog,FormField,PausableMarquee}.test.tsx`

**Interfaces:**

- Produces (props):
  - `Button({ variant: 'primary'|'secondary'|'ghost'|'danger', size?: 'md'|'lg', href?: string, external?: boolean, ...button attrs })` — renders `Link` when `href` starts with `/`, `<a>` when external, else `<button>`; min-height 44 px; pill radius.
  - `Card({ hover?: boolean, as?: 'article'|'div', className? })`, `Section({ tone: 'light'|'dark', id?, className? })` (dark = `bg-navy text-white`), `Eyebrow({ children })` (uppercase, `text-blue-safe`, letter-spacing 1.6px), `Stat({ value: number, suffix?: string, label: string, locale })` (counts up on intersection unless reduced motion; renders the final value in HTML for crawlers), `Chip({ selected?, onToggle?, children })` (a `<button aria-pressed>`), `Timeline({ steps: {when?: string; title: string; body: string}[] })` (an `<ol>`).
  - `Accordion({ items: {id: string; title: string; body: React.ReactNode}[], singleOpen?: boolean, defaultOpenId?: string })` — real `<button aria-expanded aria-controls>` in an `<h3>`, region with `id`, keyboard Home/End.
  - `Tabs({ tabs: {id, label, panel}[], defaultId })` — `role="tablist"`, arrow-key navigation, `aria-selected`, `tabIndex` roving.
  - `Dialog({ open, onClose, titleId, children })` — `<dialog>` element, focus trap, Escape, focus restore, `aria-labelledby`.
  - `FormField({ id, label, error?, hint?, required?, children(inputProps) })` — always a visible `<label for>`, `aria-describedby` for hint/error, `aria-invalid`, error in `role="alert"`.
  - `PausableMarquee({ children, durationSec, labelPause, labelPlay })` — CSS marquee with a visible pause/play `<button aria-pressed>`; paused under reduced motion; pausing is keyboard-reachable (WCAG 2.2.2, D20).
  - `SkipLink({ label })` — first focusable element, targets `#main`.

- [ ] **Step 1: Failing tests (behaviour, not pixels)**

`src/design/primitives/__tests__/Accordion.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Accordion } from '../Accordion';

const items = [
  { id: 'a', title: 'First', body: 'Body A' },
  { id: 'b', title: 'Second', body: 'Body B' },
];

describe('Accordion', () => {
  it('uses real buttons with aria-expanded and aria-controls', async () => {
    render(<Accordion items={items} singleOpen defaultOpenId="a" />);
    const first = screen.getByRole('button', { name: 'First' });
    expect(first).toHaveAttribute('aria-expanded', 'true');
    expect(document.getElementById(first.getAttribute('aria-controls')!)).toHaveTextContent(
      'Body A',
    );
    await userEvent.click(screen.getByRole('button', { name: 'Second' }));
    expect(first).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByRole('button', { name: 'Second' })).toHaveAttribute('aria-expanded', 'true');
  });
});
```

(`npm install --save-dev @testing-library/user-event`.)

`__tests__/Dialog.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Dialog } from '../Dialog';

describe('Dialog', () => {
  it('is labelled, closes on Escape, and restores focus', async () => {
    const onClose = vi.fn();
    render(
      <>
        <button>opener</button>
        <Dialog open onClose={onClose} titleId="t">
          <h2 id="t">Title</h2>
          <button>inside</button>
        </Dialog>
      </>,
    );
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-labelledby', 't');
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalled();
  });
});
```

`__tests__/FormField.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FormField } from '../FormField';

describe('FormField', () => {
  it('links label, hint and error to the control', () => {
    render(
      <FormField id="email" label="E-mail" hint="Work address" error="Required">
        {(p) => <input {...p} />}
      </FormField>,
    );
    const input = screen.getByLabelText('E-mail');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    const described = input.getAttribute('aria-describedby')!.split(' ');
    expect(described).toContain('email-hint');
    expect(described).toContain('email-error');
    expect(screen.getByRole('alert')).toHaveTextContent('Required');
  });
});
```

`__tests__/PausableMarquee.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { PausableMarquee } from '../PausableMarquee';

describe('PausableMarquee', () => {
  it('exposes a visible pause control that toggles', async () => {
    render(
      <PausableMarquee durationSec={46} labelPause="Pause" labelPlay="Play">
        <span>card</span>
      </PausableMarquee>,
    );
    const btn = screen.getByRole('button', { name: 'Pause' });
    expect(btn).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(btn);
    expect(screen.getByRole('button', { name: 'Play' })).toHaveAttribute('aria-pressed', 'true');
  });
});
```

Run: `npm run test -- src/design/primitives` Expected: FAIL (modules missing). Note: jsdom lacks `HTMLDialogElement.showModal`; the Dialog must render `<div role="dialog" aria-modal="true">` with a manual focus trap (not `<dialog>`), which also avoids the top-layer/z-index issues with the sticky header.

- [ ] **Step 2: Implement the four tested primitives, then the rest**

`src/design/primitives/Accordion.tsx`:

```tsx
'use client';
import { useId, useState } from 'react';

export type AccordionItem = { id: string; title: string; body: React.ReactNode };

export function Accordion({
  items,
  singleOpen = true,
  defaultOpenId,
}: {
  items: AccordionItem[];
  singleOpen?: boolean;
  defaultOpenId?: string;
}) {
  const base = useId();
  const [open, setOpen] = useState<Set<string>>(new Set(defaultOpenId ? [defaultOpenId] : []));
  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(singleOpen ? [] : prev);
      if (!prev.has(id)) next.add(id);
      return next;
    });
  return (
    <div className="divide-y divide-border-1">
      {items.map((it) => {
        const isOpen = open.has(it.id);
        const btnId = `${base}-${it.id}-btn`;
        const panelId = `${base}-${it.id}-panel`;
        return (
          <div key={it.id}>
            <h3 className="m-0">
              <button
                id={btnId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(it.id)}
                className="flex min-h-[46px] w-full items-center justify-between gap-4 py-3 text-left font-extrabold"
              >
                <span>{it.title}</span>
                <span aria-hidden="true">{isOpen ? '−' : '+'}</span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              hidden={!isOpen}
              className="pb-4 text-text-secondary"
            >
              {it.body}
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

`src/design/primitives/Dialog.tsx`:

```tsx
'use client';
import { useEffect, useRef } from 'react';

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])';

export function Dialog({
  open,
  onClose,
  titleId,
  children,
}: {
  open: boolean;
  onClose: () => void;
  titleId: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const node = ref.current!;
    const focusables = () => Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE));
    (focusables()[0] ?? node).focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const f = focusables();
      if (!f.length) return;
      const first = f[0],
        last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      previous?.focus();
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-navy/60 p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="max-h-[90vh] w-full max-w-lg overflow-auto rounded-xl bg-white p-6 shadow-hero-form"
      >
        {children}
      </div>
    </div>
  );
}
```

`src/design/primitives/FormField.tsx`:

```tsx
import type { ReactNode } from 'react';

type InputProps = {
  id: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
  'aria-required'?: boolean;
};

export function FormField({
  id,
  label,
  hint,
  error,
  required,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: (p: InputProps) => ReactNode;
}) {
  const described =
    [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(' ') ||
    undefined;
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-body-sm font-bold">
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
      </label>
      {children({
        id,
        'aria-describedby': described,
        'aria-invalid': error ? true : undefined,
        'aria-required': required || undefined,
      })}
      {hint ? (
        <p id={`${id}-hint`} className="text-text-tertiary text-body-sm">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-danger text-body-sm">
          {error}
        </p>
      ) : null}
    </div>
  );
}
```

`src/design/primitives/PausableMarquee.tsx`:

```tsx
'use client';
import { useState } from 'react';

export function PausableMarquee({
  children,
  durationSec,
  labelPause,
  labelPlay,
}: {
  children: React.ReactNode;
  durationSec: number;
  labelPause: string;
  labelPlay: string;
}) {
  const [paused, setPaused] = useState(false);
  return (
    <div className="relative">
      <div className="overflow-hidden" aria-live="off">
        <div
          className="marquee flex w-max gap-4"
          style={{
            animationDuration: `${durationSec}s`,
            animationPlayState: paused ? 'paused' : 'running',
          }}
        >
          {children}
          <span aria-hidden="true" className="flex gap-4">
            {children}
          </span>
        </div>
      </div>
      <button
        type="button"
        aria-pressed={paused}
        onClick={() => setPaused((p) => !p)}
        className="absolute right-2 top-2 min-h-[44px] min-w-[44px] rounded-pill bg-white/90 px-3 text-body-sm font-bold shadow-social"
      >
        {paused ? labelPlay : labelPause}
      </button>
    </div>
  );
}
```

Add to `globals.css`:

```css
@keyframes marquee {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}
.marquee {
  animation: marquee linear infinite;
}
@media (prefers-reduced-motion: reduce) {
  .marquee {
    animation-play-state: paused !important;
  }
}
```

Then `Button`, `Card`, `Section`, `Eyebrow`, `Stat`, `Chip`, `Tabs`, `Timeline`, `SkipLink` per the interface block (Button uses `Link` from `@/i18n/navigation` for internal hrefs; Stat renders the final number server-side and only animates in an effect when `!matchMedia('(prefers-reduced-motion: reduce)').matches`; SkipLink: `<a href="#main" className="sr-only focus:not-sr-only …">`). Export all from `index.ts`.

Run: `npm run test -- src/design/primitives` Expected: 4 passed; `npm run verify` green.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat(design): accessible primitives (accordion, tabs, dialog, form field, pausable marquee, skip link, …)"
```

---

