'use client';
import { useState } from 'react';
// By module path (W147/W156): the primitives barrel would ship every client primitive here.
import { RadioChips } from '@/design/primitives/RadioChips';
import { Field, type FieldOption } from '@/forms/client/Field';
import { useFieldValue } from '@/forms/client/FormErrorsContext';
import { FIELD_MAX, isRoleKey, ROLE_KEYS, type RoleKey } from '../_lib/options';

export type RoleCopy = {
  /** the role chip — `availworkers.141` / `147` */
  tab: string;
  /** the form head — `sys.workers.form.titles.direct_employer` (107 once cards are visible) / `148` */
  title: string;
  /** `142` / `149` */
  subtitle: string;
  /** the company field's package text per role — `143` / `150`, passed as the label (W115) */
  companyLabel: string;
  /** the roles-and-volume field's package text per role — `144` / `151`: the `trade` label */
  tradeLabel: string;
  /** the design's message prompt per role — `145` / `152` */
  messagePlaceholder: string;
};

/** Every string arrives resolved (W9): the island reads no bundle and no `sys.workers` key, so
 *  `CLIENT_SYS` needs no new namespace (W148); `Field` reads its own `sys.form.*` fallbacks. */
export type RequestFormFieldsProps = {
  /** `sys.form.labels.iAm` — the radio group's (visually hidden) legend */
  legend: string;
  roles: Record<RoleKey, RoleCopy>;
  /** the package's texts for the role-independent fields — `044`–`047` (W115) */
  labels: { name: string; email: string; phone: string; city: string };
  /** `START_WHEN_KEYS` with their `sys.form.options.startWhen.*` labels (W78) */
  startWhenOptions: FieldOption[];
};

/**
 * The design's two role tabs (Employer | HR agency) swapping one form's head, labels and prompt.
 * A `RadioChips` group named `iAm` — the catalog field and its exact values (W77) — so the choice
 * is posted by the form itself, survives a failed submit (`useFieldValue` seeds the state) and
 * needs no hidden input. Rendered inside `FormShell` above the fold: a plain client import, not
 * `next/dynamic` (W13 amended).
 */
export function RequestFormFields({
  legend,
  roles,
  labels,
  startWhenOptions,
}: RequestFormFieldsProps) {
  const echoed = useFieldValue('iAm');
  const [role, setRole] = useState<RoleKey>(() => (isRoleKey(echoed) ? echoed : 'direct_employer'));
  const copy = roles[role];
  return (
    <>
      {/* D20: `blue-safe` → `navy` with full-white copy — white on the design's #1899D5 is 3.2:1
          and the subtitle is body-small. Negative margins undo the shell's `p-6` so the band
          bleeds to the card's edges. */}
      <div
        data-testid="workers-form-head"
        className="-mx-6 -mt-6 bg-gradient-to-br from-blue-safe to-navy px-6 py-4 text-white"
      >
        <h2 className="text-card-title m-0 mb-1">{copy.title}</h2>
        <p className="text-body-sm m-0">{copy.subtitle}</p>
      </div>
      <RadioChips
        name="iAm"
        legend={legend}
        legendHidden
        value={role}
        onChange={(value) => {
          if (isRoleKey(value)) setRole(value);
        }}
        options={ROLE_KEYS.map((key) => ({ value: key, label: roles[key].tab }))}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {/* placeholder="" — the package label already names the field; the sys placeholder
            ("Company name") would only repeat it */}
        <Field
          name="company"
          label={copy.companyLabel}
          placeholder=""
          required
          autoComplete="organization"
          maxLength={FIELD_MAX.company}
        />
        <Field
          name="name"
          label={labels.name}
          required
          autoComplete="name"
          maxLength={FIELD_MAX.name}
        />
        <Field
          name="email"
          label={labels.email}
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          maxLength={FIELD_MAX.email}
        />
        <Field
          name="phone"
          label={labels.phone}
          type="tel"
          required
          autoComplete="tel"
          inputMode="tel"
          maxLength={FIELD_MAX.phone}
        />
        <Field
          name="city"
          label={labels.city}
          required
          autoComplete="address-level2"
          maxLength={FIELD_MAX.city}
        />
        <Field name="trade" label={copy.tradeLabel} required maxLength={FIELD_MAX.trade} />
        <Field name="headcount" type="number" inputMode="numeric" min={1} max={9999} />
        <Field name="startWhen" as="select" options={startWhenOptions} />
      </div>
      <Field
        name="message"
        as="textarea"
        rows={3}
        placeholder={copy.messagePlaceholder}
        maxLength={FIELD_MAX.message}
      />
    </>
  );
}
