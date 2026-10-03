/** Newsletter confirm/unsubscribe (docs/INTEGRATIONS.md I12) — types shared by the forwarder,
 *  the server actions, the one-click route and the page's island. */
export type NewsletterForwardKind = 'confirm' | 'unsubscribe';

/** The door's 200 outcomes per route (`website-newsletter.service.ts`). */
export const CONFIRM_OUTCOMES = ['CONFIRMED', 'ALREADY_CONFIRMED'] as const;
export const UNSUBSCRIBE_OUTCOMES = ['UNSUBSCRIBED', 'ALREADY_UNSUBSCRIBED', 'UNKNOWN'] as const;
export type NewsletterDoorOutcome =
  (typeof CONFIRM_OUTCOMES)[number] | (typeof UNSUBSCRIBE_OUTCOMES)[number];

/** One forwarded token, classified. */
export type NewsletterForwardResult =
  | { kind: 'ok'; outcome: NewsletterDoorOutcome }
  | { kind: 'invalid' } // 400 NEWSLETTER_TOKEN_INVALID — or a token that never left the site
  | { kind: 'expired' } // 410 — confirm only (48 h on the Ops side)
  | { kind: 'off' } // bare 404 — the website module flag is off
  | { kind: 'unauthorized' } // 401 — the write token was refused
  | { kind: 'unconfigured' } // no OPS_API_URL / usable write token here — no call made (W92)
  | { kind: 'unavailable'; cause: 'network' | 'timeout' | 'server' };

/** What the island's `useActionState` holds. */
export type NewsletterActionState =
  { status: 'idle' } | { status: 'done'; result: NewsletterForwardResult };

export const IDLE_NEWSLETTER_STATE: NewsletterActionState = { status: 'idle' };
