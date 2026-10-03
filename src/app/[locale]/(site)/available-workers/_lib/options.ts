/** The `iAm` values the Operations `workers` catalog accepts (`direct_employer | hr_agency`) —
 *  the role chips post exactly these (W77: wire values are keys). `startWhen` keys are the shared
 *  W78 set in `@/forms/options`, never a page-local list. Client-safe — no zod, no message files:
 *  the `RequestFormFields` island imports this module. */
export const ROLE_KEYS = ['direct_employer', 'hr_agency'] as const;
export type RoleKey = (typeof ROLE_KEYS)[number];

export const isRoleKey = (v: string | undefined): v is RoleKey =>
  (ROLE_KEYS as readonly string[]).includes(v ?? '');

/** The door's caps on the `workers` catalog entry (v1.0 + the v1.1 `city`, WP2a Task 8 as
 *  built) — one source for the schema and the inputs' `maxLength`. */
export const FIELD_MAX = {
  name: 120,
  company: 200,
  email: 254,
  phone: 40,
  city: 120,
  trade: 200,
  message: 5000,
} as const;
