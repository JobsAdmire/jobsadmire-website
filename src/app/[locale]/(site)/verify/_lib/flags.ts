/**
 * D9 v1.1: the LOOKUP's record view (`LookupCard` → `RecordDialog`) opens once
 * `WebsiteRepresentative` rows ship with consent and the website's `no-store` record handler
 * exists (V-1: `src/app/api/verify/record/route.ts`, called by the lookup island — the browser
 * never calls Operations, D6). The founder strip's "Open record" is not behind it: the founder's
 * record is the published W86 row (owner ruling, parity pass 2026-10-05). Typed `boolean`, not
 * the literal `false`, so the guarded branches type-check.
 */
export const RECORD_DIALOG_ENABLED: boolean = false;
