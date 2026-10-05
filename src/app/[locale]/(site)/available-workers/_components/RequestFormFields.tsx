'use client';
import { useRef, useState } from 'react';
// By module path (W147/W156): the primitives barrel would ship every client primitive here.
import { Tabs } from '@/design/primitives/Tabs';
import { Field } from '@/forms/client/Field';
import { useFieldValue } from '@/forms/client/FormErrorsContext';
import { FIELD_MAX, isRoleKey, ROLE_KEYS, type RoleKey } from '../_lib/options';
import { usePool } from './PoolContext';

export type RoleCopy = {
  /** the role tab — `availworkers.141` / `147` */
  tab: string;
  /** the company field's package text per role — `143` / `150`, its (visually hidden) label and
   *  placeholder (W115) */
  companyLabel: string;
  /** the roles-and-volume field's package text per role — `144` / `151`: the `trade` label */
  tradeLabel: string;
};

/** The basket box's copy: `232` / `233` after the count, `036` on the clear button. */
export type BasketCopy = { one: string; many: string; clear: string };

/** Every string arrives resolved (W9): the island reads no bundle and no `sys.workers` key, so
 *  `CLIENT_SYS` needs no new namespace (W148); `Field` reads its own `sys.form.*` fallbacks. */
export type RequestFormFieldsProps = {
  roles: Record<RoleKey, RoleCopy>;
  /** the package's texts for the role-independent fields — `044`–`047` (W115) */
  labels: { name: string; email: string; phone: string; city: string };
  basket: BasketCopy;
};

const TEXT_FIELDS = ['company', 'name', 'email', 'phone', 'city', 'trade'] as const;

/**
 * The request card's form body (design ll. 522–571): the two underline role tabs (Employer | HR
 * agency) over the placeholder-only fields in the design's three pairs — company | contact person,
 * e-mail | phone, city | "which roles" (1fr | 1.6fr) — with the basket box above them once a profile
 * is added. Only what the Operations `workers` catalog requires is asked (W77/W105); the optional
 * headcount / start / message fields the design does not draw are gone (the spec still accepts
 * them). The role posts as the hidden catalog field `iAm` (W77: wire values are keys) and the
 * basket as `profileRefs`, which the action folds into `message` (`composeWorkersMessage`). Only
 * the active tab's panel holds the fields; switching carries what was typed across. Rendered
 * inside `FormShell` above the fold: a plain client import, not `next/dynamic` (W13 amended).
 */
export function RequestFormFields({ roles, labels, basket: basketCopy }: RequestFormFieldsProps) {
  const pool = usePool();
  const echoed = useFieldValue('iAm');
  // the visitor's pick, else the role a failed submit echoes back, else the employer
  const role: RoleKey = pool.role ?? (isRoleKey(echoed) ? echoed : 'direct_employer');
  const wrap = useRef<HTMLDivElement>(null);
  const [carry, setCarry] = useState<Partial<Record<(typeof TEXT_FIELDS)[number], string>>>({});
  const copy = roles[role];

  // The tab's panel is rebuilt for the new role: what the visitor typed rides across (read
  // before the panel goes, in the click handler — never during render).
  const switchRole = (id: string) => {
    if (!isRoleKey(id) || id === role) return;
    const typed: typeof carry = {};
    for (const name of TEXT_FIELDS) {
      const el = wrap.current?.querySelector<HTMLInputElement>(`input[name="${name}"]`);
      if (el) typed[name] = el.value;
    }
    setCarry(typed);
    pool.setRole(id);
  };

  const n = pool.basket.length;
  const body = (
    <div className="flex flex-col gap-2.5">
      {n > 0 && (
        <div
          data-testid="workers-basket"
          className="mb-1 rounded-xs border border-edge bg-pale-1 px-3.5 py-3"
        >
          <div className="mb-2.25 flex items-center justify-between gap-2.5">
            <span className="text-[12.5px] font-extrabold tracking-[0.5px] text-blue-safe uppercase xl:text-[11px]">
              {n} {n === 1 ? basketCopy.one : basketCopy.many}
            </span>
            <button
              type="button"
              onClick={pool.clearBasket}
              className="min-h-6 text-[12.5px] font-extrabold text-text-tertiary hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe xl:text-[11px]"
            >
              {basketCopy.clear}
            </button>
          </div>
          <div className="flex flex-wrap gap-1.75">
            {pool.basket.map((ref) => (
              <button
                key={ref}
                type="button"
                onClick={() => pool.removeRef(ref)}
                className="ja-basket-chip inline-flex items-center gap-1.75 rounded-pill border-[1.5px] border-tint-border bg-white px-2.75 py-1.25 text-[12.5px] font-extrabold text-blue-safe hover:border-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe xl:text-[11px]"
              >
                {ref}
                <span aria-hidden="true" className="text-text-tertiary">
                  ✕
                </span>
                <span className="sr-only"> — {basketCopy.clear}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="grid gap-2.5 lg:grid-cols-2">
        <Field
          name="company"
          label={copy.companyLabel}
          required
          autoComplete="organization"
          maxLength={FIELD_MAX.company}
          defaultValue={carry.company}
        />
        <Field
          name="name"
          label={labels.name}
          required
          autoComplete="name"
          maxLength={FIELD_MAX.name}
          defaultValue={carry.name}
        />
      </div>
      <div className="grid gap-2.5 lg:grid-cols-2">
        <Field
          name="email"
          label={labels.email}
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          maxLength={FIELD_MAX.email}
          defaultValue={carry.email}
        />
        <Field
          name="phone"
          label={labels.phone}
          type="tel"
          required
          autoComplete="tel"
          inputMode="tel"
          maxLength={FIELD_MAX.phone}
          defaultValue={carry.phone}
        />
      </div>
      <div className="grid gap-2.5 lg:grid-cols-[1fr_1.6fr]">
        <Field
          name="city"
          label={labels.city}
          required
          autoComplete="address-level2"
          maxLength={FIELD_MAX.city}
          defaultValue={carry.city}
        />
        <Field
          name="trade"
          label={copy.tradeLabel}
          required
          maxLength={FIELD_MAX.trade}
          defaultValue={carry.trade}
        />
      </div>
    </div>
  );

  return (
    <div ref={wrap}>
      <input type="hidden" name="iAm" value={role} />
      <input type="hidden" name="profileRefs" value={pool.basket.join(', ')} />
      {/* SHARED 14.1 `underline`: full-bleed under the head band (the shell's side padding
          undone), square top corners; the panel replays `ja-panel` on every switch — the
          design's `.ja-form-body` re-entry (l. 1424). */}
      <Tabs
        variant="underline"
        defaultId={role}
        onChange={switchRole}
        listClassName="-mx-6 rounded-t-none! max-md:-mx-4"
        panelClassName="ja-panel pt-4.5! max-md:pt-4!"
        tabs={ROLE_KEYS.map((key) => ({
          id: key,
          label: roles[key].tab,
          panel: key === role ? body : null,
        }))}
      />
    </div>
  );
}
