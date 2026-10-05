'use client';
import { ArrowRightIcon } from '@/design/chrome/icons';
import { usePool } from './PoolContext';

/** The closing band's phone CTA (design `.ja-close-mob`, l. 920, ≤ 700 px): one full-width dark
 *  button that opens the request card and brings it into view, in place of the two links. */
export function GoToFormButton({ label }: { label: string }) {
  const { goToForm } = usePool();
  return (
    <button
      type="button"
      onClick={goToForm}
      className="flex min-h-[54px] w-full items-center justify-center gap-2.5 rounded-[14px] bg-gradient-to-br from-ink to-night text-[16px] font-extrabold text-white shadow-[0_10px_24px_rgba(10,20,40,0.28)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe active:scale-[0.98] md:hidden"
    >
      {label}
      <ArrowRightIcon size={17} className="text-sky" />
    </button>
  );
}
