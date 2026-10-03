/**
 * D9 v1.1: the record dialog opens once `WebsiteRepresentative` rows ship with consent and the
 * website's `no-store` record handler exists (V-1: `src/app/api/verify/record/route.ts`, called
 * by the lookup island — the browser never calls Operations, D6). Typed `boolean`, not the
 * literal `false`, so the guarded branches type-check.
 */
export const RECORD_DIALOG_ENABLED: boolean = false;
