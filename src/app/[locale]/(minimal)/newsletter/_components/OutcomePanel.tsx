import { ContactLink } from '@/analytics/ContactLink';
import { buttonClassName } from '@/design/primitives/Button';
import type { NewsletterState } from '@/lib/newsletter/copy';

export type StateCopy = { title: string; body: string };
export type FallbackCopy = { lead: string; email: string; whatsapp: string };
/** Both hrefs are static — the settings' address and number with a sys subject and prefill;
 *  never the token, never anything a visitor typed (W76/W95). */
export type FallbackLinks = { emailHref: string; whatsappHref: string };

const PANEL = {
  fallback: 'rounded-base border border-warning-border bg-warning-surface p-5 text-ink',
  outcome: 'rounded-base border border-success-border bg-success-surface p-5 text-ink',
} as const;

/**
 * One answer of the newsletter door (I12) in the page's own words. `newsletter-fallback` whenever
 * the manual door joins it (400/410/`UNKNOWN`/unreachable/unconfigured, and the token-less
 * link), else `newsletter-outcome`; `data-outcome` names the state so tests never read copy. No
 * hooks and no directive: the server page renders it for the token-less link, the client island
 * for an answer — its `ContactLink`s are the client pieces (`email_click`/`whatsapp_click`,
 * `placement: 'page_cta'`).
 */
export function OutcomePanel({
  state,
  fallback,
  copy,
  fallbackCopy,
  links,
}: {
  state: NewsletterState;
  fallback: boolean;
  copy: StateCopy;
  fallbackCopy: FallbackCopy;
  links: FallbackLinks;
}) {
  return (
    <div
      role="status"
      data-testid={fallback ? 'newsletter-fallback' : 'newsletter-outcome'}
      data-outcome={state}
      className={fallback ? PANEL.fallback : PANEL.outcome}
    >
      <h2 className="text-card-title">{copy.title}</h2>
      <p className="mt-2 text-body text-text-secondary">{copy.body}</p>
      {fallback ? (
        <div className="mt-4">
          <p className="text-body-sm font-extrabold">{fallbackCopy.lead}</p>
          <div className="mt-2 flex flex-wrap gap-3">
            <ContactLink
              href={links.emailHref}
              placement="page_cta"
              className={buttonClassName('secondary')}
            >
              {fallbackCopy.email}
            </ContactLink>
            <ContactLink
              href={links.whatsappHref}
              placement="page_cta"
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClassName('success')}
            >
              {fallbackCopy.whatsapp}
            </ContactLink>
          </div>
        </div>
      ) : null}
    </div>
  );
}
