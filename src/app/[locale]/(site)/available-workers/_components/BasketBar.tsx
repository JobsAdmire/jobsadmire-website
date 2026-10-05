'use client';
import { ContactLink } from '@/analytics/ContactLink';
import { WhatsAppIcon } from '@/design/chrome/icons';
import { usePool } from './PoolContext';

const ACTION =
  'flex min-h-12 items-center justify-center gap-2.25 rounded-pill text-[15px] font-extrabold text-white no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky';

/**
 * The bottom bar's basket face (design ll. 942–946, below 901 px): once a profile is in the
 * basket, the chrome's call/WhatsApp bar gives way to "n selected →" (open the request card and
 * jump to it) beside WhatsApp. It sits over the chrome's own bar (same box, one layer up), which
 * returns as soon as the basket is empty.
 */
export function BasketBar({
  selected,
  whatsapp,
  waHire,
}: {
  /** sys `pool.selected` — the word after the count */
  selected: string;
  /** `home.221`, the chrome bar's own WhatsApp label (R15) */
  whatsapp: string;
  waHire: string;
}) {
  const { basket, goToForm } = usePool();
  if (basket.length === 0) return null;
  return (
    <div
      data-testid="basket-bar"
      className="fixed inset-x-0 bottom-0 z-[55] grid grid-cols-2 gap-2.5 border-t border-white/15 bg-night/95 px-3.5 pt-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))] backdrop-blur lg:hidden"
    >
      <button
        type="button"
        onClick={goToForm}
        className={`${ACTION} bg-blue-safe active:bg-blue-deep`}
      >
        <span className="inline-flex h-5.5 min-w-5.5 items-center justify-center rounded-pill bg-white/22 px-1.5 text-[12.5px]">
          {basket.length}
        </span>
        {selected}
        <span aria-hidden="true">→</span>
      </button>
      <ContactLink
        href={waHire}
        placement="bottom_bar"
        target="_blank"
        rel="noopener noreferrer"
        className={`${ACTION} bg-success-text`}
      >
        <WhatsAppIcon size={18} />
        {whatsapp}
      </ContactLink>
    </div>
  );
}
