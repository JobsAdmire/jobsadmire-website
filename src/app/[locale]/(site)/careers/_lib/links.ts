import type { Locale } from '@/i18n/routing';

/** The Operations careers pages the design links to (Join Our Team ll. 675, 883, 976), restored
 *  by the owner on 2026-10-05 and made locale-aware on 2026-10-06 (W245): Operations serves its
 *  careers portal under `/tr/` and `/en/`, so a Turkish page opens the Turkish portal. Plain
 *  outbound links, opened in a new tab — the site still never CALLS Operations from the browser
 *  (D6). */
const OPS_CAREERS = 'https://operations.jobsadmire.com';

/** The openings page — the roles pill and the open application's primary CTA. */
export const opsCareersPortal = (locale: Locale) => `${OPS_CAREERS}/${locale}/careers`;
/** The application-status page — the hiring steps' status button. */
export const opsCareersStatus = (locale: Locale) => `${OPS_CAREERS}/${locale}/careers/status`;
