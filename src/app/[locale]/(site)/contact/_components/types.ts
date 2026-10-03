import type { FormActionState } from '@/forms/types';
import type { Locale } from '@/i18n/routing';

/** A page `'use server'` action as `FormShell` takes it (the three in ../actions.ts). */
export type FormAction = (prev: FormActionState, data: FormData) => Promise<FormActionState>;

/** What each of the page's three form shells takes besides its copy (../_lib/door.ts builds it). */
export type FormDoor = {
  locale: Locale;
  turnstileSiteKey: string | null;
  whatsappNumber: string;
  contact: { phone: string; phoneDisplay?: string; email: string };
};
