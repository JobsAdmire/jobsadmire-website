import { getTranslations } from 'next-intl/server';
// By module path (W156).
import { Button } from '@/design/primitives/Button';
import { Section } from '@/design/primitives/Section';
import { mailLink, waLink } from '@/lib/contact';
import { isPlausibleToken } from '@/lib/newsletter/classify';
import { NEWSLETTER_STATES, stateCopyKey, type NewsletterState } from '@/lib/newsletter/copy';
import type { NewsletterForwardKind } from '@/lib/newsletter/types';
import { NewsletterAction, type NewsletterActionFn } from './NewsletterAction';
import { OutcomePanel, type StateCopy } from './OutcomePanel';

/**
 * One layout for both newsletter one-shots (W5, I12). The server resolves every string the page
 * can show and hands them to the island as props — `sys.newsletter` stays out of `CLIENT_SYS` and
 * out of every other page's RSC payload (W148). Nothing is forwarded here: the token leaves the
 * site only when the visitor presses the button.
 */
export async function NewsletterPage({
  kind,
  token,
  action,
  email,
  whatsappNumber,
}: {
  kind: NewsletterForwardKind;
  token: string | string[] | undefined;
  action: NewsletterActionFn;
  email: string;
  whatsappNumber: string;
}) {
  const sys = await getTranslations('sys');
  // `?token=a&token=b` is a malformed link — the first value decides (the thank-you page's rule).
  const first = Array.isArray(token) ? token[0] : token;
  const usable = isPlausibleToken(first) ? first : null;
  const outcomes: Partial<Record<NewsletterState, StateCopy>> = {};
  for (const state of NEWSLETTER_STATES[kind]) {
    const key = stateCopyKey(kind, state);
    outcomes[state] = { title: sys(`${key}.title`), body: sys(`${key}.body`) };
  }
  const noToken: StateCopy = {
    title: sys('newsletter.noToken.title'),
    body: sys('newsletter.noToken.body'),
  };
  const fallbackCopy = {
    lead: sys('newsletter.fallback.lead'),
    email: sys('newsletter.fallback.email'),
    whatsapp: sys('newsletter.fallback.whatsapp'),
  };
  // W76/W95: static hrefs only — the token (a per-subscriber secret) never reaches an href, a
  // prefill, a subject line or a log.
  const links = {
    emailHref: mailLink(email, sys('newsletter.fallback.subject')),
    whatsappHref: waLink(whatsappNumber, sys('whatsapp.prefill')),
  };
  return (
    <Section tone="light">
      {/* `.container-site` is unlayered CSS; the measure sits on an inner wrapper. */}
      <div className="container-site">
        <div className="max-w-[720px]">
          <h1 data-testid="page-h1" data-lcp-slot="h1" className="text-h2">
            {sys(`newsletter.${kind}.title`)}
          </h1>
          <p className="mt-3 text-body-lg text-text-secondary">{sys(`newsletter.${kind}.body`)}</p>
          {usable ? (
            <NewsletterAction
              kind={kind}
              token={usable}
              action={action}
              labels={{
                button: sys(`newsletter.${kind}.button`),
                pending: sys(`newsletter.${kind}.pending`),
              }}
              outcomes={outcomes}
              fallbackCopy={fallbackCopy}
              links={links}
            />
          ) : (
            <div className="mt-6">
              <OutcomePanel
                state="noToken"
                fallback
                copy={noToken}
                fallbackCopy={fallbackCopy}
                links={links}
              />
            </div>
          )}
          <div className="mt-8">
            <Button variant="ghost" href="/" prefetch={false}>
              {sys('newsletter.backHome')}
            </Button>
          </div>
        </div>
      </div>
    </Section>
  );
}
