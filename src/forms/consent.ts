/** The one site-wide `consentVersion` every submission carries (the door's DTO requires it,
 *  ≤ 40 chars, even on forms whose design has no checkbox). Bump it when counsel changes the
 *  KVKK/privacy text (§10 item 6) — never per form, never per page. */
export const CONSENT_VERSION = 'kvkk-2026-09' as const;
