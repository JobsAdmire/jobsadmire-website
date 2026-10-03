'use client';
import { useId, type ReactNode } from 'react';
import { CloseIcon } from '@/design/chrome/icons';
import { Dialog } from '@/design/primitives/Dialog';

export type BottomSheetProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  closeLabel: string;
  children: ReactNode;
  className?: string;
};

/** The design's mobile role picker / topic picker: a Dialog docked to the bottom edge.
 *  Focus trap, Escape, scroll lock and focus restoration all come from Dialog (D20). */
export function BottomSheet({
  open,
  onClose,
  title,
  closeLabel,
  children,
  className,
}: BottomSheetProps) {
  const titleId = useId();
  return (
    <Dialog open={open} onClose={onClose} titleId={titleId} variant="sheet">
      <div
        className={['mb-4 flex items-center justify-between gap-4', className]
          .filter(Boolean)
          .join(' ')}
      >
        <h2 id={titleId} className="m-0 text-card-title font-extrabold">
          {title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label={closeLabel}
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-pill hover:bg-pale-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe"
        >
          <CloseIcon />
        </button>
      </div>
      {children}
    </Dialog>
  );
}
