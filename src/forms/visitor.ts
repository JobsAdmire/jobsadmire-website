import type { PostFormVisitor } from './types';

/** The door's cap on `X-Website-Visitor-Ua` (website-form-submit.dto.ts). */
export const MAX_UA = 500;

/** An `AbortSignal.timeout` firing (or an abort) — as opposed to a connection-level failure. */
export const isTimeout = (err: unknown): boolean =>
  err instanceof Error && (err.name === 'TimeoutError' || err.name === 'AbortError');

/** The visitor's own address and user agent for the door (`X-Website-Visitor-Ip` /
 *  `X-Website-Visitor-Ua`), omitting what we do not have. Shared by the form post and the
 *  evidence upload; never logged. */
export function visitorHeaders(visitor: PostFormVisitor): Record<string, string> {
  const headers: Record<string, string> = {};
  if (visitor.ip) headers['X-Website-Visitor-Ip'] = visitor.ip;
  if (visitor.ua) headers['X-Website-Visitor-Ua'] = visitor.ua.slice(0, MAX_UA);
  return headers;
}
