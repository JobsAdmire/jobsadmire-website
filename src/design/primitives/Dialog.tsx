'use client';
import { useEffect, useRef, type ReactNode } from 'react';

// M15: a disabled select/textarea is not reachable by Tab and must not enter the trap's cycle
// or be handed initial focus — the same exemption `input`/`button` already had.
const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

export function Dialog({
  open,
  onClose,
  titleId,
  children,
  variant = 'center',
}: {
  open: boolean;
  onClose: () => void;
  titleId: string;
  children: ReactNode;
  /** `sheet` docks the panel to the bottom edge (BottomSheet); `center` is the modal. */
  variant?: 'center' | 'sheet';
}) {
  const ref = useRef<HTMLDivElement>(null);
  // The trap is keyed on `open` alone: an inline `onClose={() => setOpen(false)}` changes
  // identity on every parent render, and re-running the trap would restore focus to the
  // opener and re-focus the first control mid-interaction. The latest handler lives in a ref.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const node = ref.current!;
    const focusables = () => Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE));
    (focusables()[0] ?? node).focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // A control inside that already handled this Escape (SearchInput clearing its text in
        // a BottomSheet) keeps it: the dialog closes on the next one.
        if (e.defaultPrevented) return;
        e.preventDefault();
        onCloseRef.current();
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
  }, [open]);
  if (!open) return null;
  return (
    // jsdom has no showModal and <dialog>'s top layer fights the sticky header (D20):
    // a real focus-trapped div with role="dialog" is the sanctioned shape here.
    <div
      className={[
        'fixed inset-0 z-[100] flex justify-center bg-navy/60',
        variant === 'sheet' ? 'items-end p-0' : 'items-center p-4',
      ].join(' ')}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={
          variant === 'sheet'
            ? 'max-h-[85vh] w-full max-w-lg overflow-auto rounded-t-hero bg-white p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] shadow-hero-form'
            : 'max-h-[90vh] w-full max-w-lg overflow-auto rounded-xl bg-white p-6 shadow-hero-form'
        }
      >
        {children}
      </div>
    </div>
  );
}
