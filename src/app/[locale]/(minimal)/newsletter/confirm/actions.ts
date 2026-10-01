'use server';
import { forwardNewsletterToken } from '@/lib/newsletter/forward';
import type { NewsletterActionState } from '@/lib/newsletter/types';

/** The visitor's click on /abone-onay — the only place a confirm token leaves the site (W5, I12).
 *  `forwardNewsletterToken` re-checks the token's shape, so anything posted here that is not a
 *  plausible token answers `invalid` without a call to Operations. */
export async function confirmNewsletter(
  _prev: NewsletterActionState,
  token: string,
): Promise<NewsletterActionState> {
  return { status: 'done', result: await forwardNewsletterToken('confirm', token) };
}
