'use client';
import { useCallback, useSyncExternalStore } from 'react';
import type { Locale } from '@/i18n/routing';

/**
 * W17 — the other-locale target of the two language links, read from the page's own
 * `<link rel="alternate" hreflang>` tags that `buildMetadata` renders. Static pages get the
 * same path the R58 fallback would produce; per-locale-slug detail pages (blog, careers) get
 * the real translated slug the server already knew — without any prop plumbing through the
 * group layouts, which pages cannot reach.
 *
 * Browser facts follow R18: never read during the server or hydrating render (the server
 * snapshot is `null`), then React re-renders with the live value. A MutationObserver on
 * `<head>` is the subscription, so a client-side navigation that swaps the metadata tags is
 * picked up without state. Pure readers are exported for tests.
 */
export function readAlternateHref(locale: Locale, doc: Document = document): string | null {
  const tag = doc.querySelector<HTMLLinkElement>(`link[rel="alternate"][hreflang="${locale}"]`);
  return tag?.getAttribute('href') ?? null;
}

/** Path + query only — the host is dropped: the tag carries the production origin
 *  (SITE_URL), and a link that left a preview deployment for production would be a defect. */
export function alternateHrefToPath(href: string | null): string | null {
  if (!href) return null;
  try {
    const url = new URL(href, 'https://placeholder.invalid');
    return `${url.pathname}${url.search}`;
  } catch {
    return null;
  }
}

function subscribe(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange);
  observer.observe(document.head, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['href', 'hreflang'],
  });
  return () => observer.disconnect();
}

const onServer = () => null;

export function useAlternatePath(locale: Locale): string | null {
  const getSnapshot = useCallback(() => alternateHrefToPath(readAlternateHref(locale)), [locale]);
  return useSyncExternalStore(subscribe, getSnapshot, onServer);
}
