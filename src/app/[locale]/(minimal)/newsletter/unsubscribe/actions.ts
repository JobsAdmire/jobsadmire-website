'use server';
import { forwardNewsletterToken } from '@/lib/newsletter/forward';
import type { NewsletterActionState } from '@/lib/newsletter/types';

/** The visitor's click on /abonelikten-cik (the browser path; a mail client's RFC 8058 POST
 *  reaches `/api/newsletter/unsubscribe` through the proxy instead). */
export async function unsubscribeNewsletter(
  _prev: NewsletterActionState,
  token: string,
): Promise<NewsletterActionState> {
  return { status: 'done', result: await forwardNewsletterToken('unsubscribe', token) };
}
