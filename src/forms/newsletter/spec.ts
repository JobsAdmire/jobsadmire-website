import { z } from 'zod';
import type { FormSpec } from '@/forms/action';
import type { WireFields } from '@/forms/wire';

/**
 * The newsletter band's form (Blog, Article, About — SHARED 14.6): catalog `newsletter`
 * (docs/INTEGRATIONS.md I4: `email`* ≤ 254 · `name` ≤ 120; the door's NEWSLETTER handler runs the
 * double opt-in, I12). The lengths are the door's own caps. The owner switched the form on
 * (2026-10-05: Operations `WebsiteForm.isActive` + each page's `NEWSLETTER_ACTIVE`); until the door
 * answers, a submit lands on the D11 fallback panel (`off`), never a silent no-op. No directive:
 * `./actions.ts` wraps the spec in `'use server'`; nothing client-side imports this module.
 */
// `.min(1)` first so an empty value reads `required`, not `email` (src/forms/errors.ts).
export const newsletterSchema = z.object({
  email: z.string().trim().min(1).max(254).email(),
  name: z.string().trim().max(120).optional(),
});
export type NewsletterInput = z.infer<typeof newsletterSchema>;

/** Only catalog names reach the wire; a blank `name` is left off rather than sent empty. */
export function newsletterToFields(p: NewsletterInput): WireFields {
  const fields: WireFields = { email: p.email };
  if (p.name) fields.name = p.name;
  return fields;
}

export const newsletterSpec: FormSpec<typeof newsletterSchema> = {
  key: 'newsletter',
  schema: newsletterSchema,
  toFields: newsletterToFields,
  consent: 'checkbox', // W79 — the KVKK checkbox, like every form
};
