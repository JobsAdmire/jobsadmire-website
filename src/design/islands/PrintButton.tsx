'use client';
import { Button, type ButtonVariant } from '@/design/primitives/Button';

export type PrintButtonProps = {
  label: string;
  variant?: ButtonVariant;
  className?: string;
};

const ISOLATING = 'print-isolating';

/** Prints only the page's `.print-isolate` region (the design's `#calculator` print rule,
 *  made opt-in per page — see the `@media print` block in globals.css). The body class is
 *  added before `window.print()` and removed on `afterprint`, so a cancelled dialog never
 *  leaves the page in its print state. The button itself never prints (`print-hidden`). */
export function PrintButton({ label, variant = 'secondary', className }: PrintButtonProps) {
  const onClick = () => {
    const body = document.body;
    const done = () => {
      body.classList.remove(ISOLATING);
      window.removeEventListener('afterprint', done);
    };
    window.addEventListener('afterprint', done);
    body.classList.add(ISOLATING);
    window.print();
  };
  return (
    <Button
      variant={variant}
      onClick={onClick}
      className={['print-hidden', className].filter(Boolean).join(' ')}
    >
      {label}
    </Button>
  );
}
