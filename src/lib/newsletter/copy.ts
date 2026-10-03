import type {
  NewsletterDoorOutcome,
  NewsletterForwardKind,
  NewsletterForwardResult,
} from './types';

/** Every state a newsletter page can show. */
export type NewsletterState =
  'noToken' | 'invalid' | 'expired' | 'unavailable' | NewsletterDoorOutcome;

/** The states each page can reach — the server page resolves copy for exactly these. */
export const NEWSLETTER_STATES: Readonly<
  Record<NewsletterForwardKind, readonly NewsletterState[]>
> = {
  confirm: ['noToken', 'invalid', 'expired', 'unavailable', 'CONFIRMED', 'ALREADY_CONFIRMED'],
  unsubscribe: [
    'noToken',
    'invalid',
    'unavailable',
    'UNSUBSCRIBED',
    'ALREADY_UNSUBSCRIBED',
    'UNKNOWN',
  ],
};

/** The `sys.newsletter.*` block (`.title` + `.body`) of one state. */
export function stateCopyKey(kind: NewsletterForwardKind, state: NewsletterState): string {
  switch (state) {
    case 'noToken':
      return 'newsletter.noToken';
    case 'unavailable':
      return 'newsletter.unavailable';
    case 'invalid':
      return `newsletter.${kind}.invalid`;
    case 'expired':
      return 'newsletter.confirm.expired';
    default:
      return `newsletter.${kind}.outcome.${state}`;
  }
}

/** The state a result shows, and whether the manual `info@jobsadmire.com` + WhatsApp fallback
 *  joins it (I12: 400/410/UNKNOWN/unreachable — and a link without its token). */
export function resultState(
  kind: NewsletterForwardKind,
  result: NewsletterForwardResult | 'noToken',
): { state: NewsletterState; fallback: boolean } {
  if (result === 'noToken') return { state: 'noToken', fallback: true };
  switch (result.kind) {
    case 'ok':
      return { state: result.outcome, fallback: result.outcome === 'UNKNOWN' };
    case 'invalid':
      return { state: 'invalid', fallback: true };
    case 'expired':
      // Only the confirm door answers 410; a stray one on unsubscribe reads as a bad link.
      return { state: kind === 'confirm' ? 'expired' : 'invalid', fallback: true };
    default:
      return { state: 'unavailable', fallback: true };
  }
}
