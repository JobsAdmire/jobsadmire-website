'use client';
import { useEffect, useRef } from 'react';
import type { Locale } from '@/i18n/routing';
import { CAPTCHA_FIELD } from '../types';

export const TURNSTILE_SCRIPT =
  'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
/** Fired on `document` once the script has loaded, so every widget on the page mounts. */
const READY_EVENT = 'ja:turnstile-ready';

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id?: string) => void;
  remove: (id: string) => void;
};
declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

/** Appends the script once per document. */
function loadScript(): void {
  if (window.turnstile || document.querySelector(`script[src="${TURNSTILE_SCRIPT}"]`)) return;
  const s = document.createElement('script');
  s.src = TURNSTILE_SCRIPT;
  // The content attribute, not the IDL setter: jsdom's `async` setter only clears its
  // force-async flag and never writes the attribute; browsers treat the two as one.
  s.setAttribute('async', '');
  s.defer = true;
  s.addEventListener('load', () => document.dispatchEvent(new Event(READY_EVENT)));
  document.head.appendChild(s);
}

/**
 * Cloudflare Turnstile (I17). The SECRET is held by Operations; this component knows only
 * the public site key. The widget renders explicitly in `interaction-only` appearance so a
 * passing visitor sees nothing, and the token lands in a hidden `cf-turnstile-response` input
 * the action reads. On error/expiry the widget is reset so the next submit carries a fresh
 * token.
 *
 * W13 amended: the script is third-party JavaScript Lighthouse counts, so it is appended on
 * the visitor's FIRST interaction with the enclosing form (focusin/pointerdown) — never on
 * page load, never through `next/script lazyOnload` (that fires at `load`, inside the audit).
 * A visitor who submits before it has loaded gets the `captcha` panel and resubmits with a
 * token; the door answers 403 for a missing token only while Ops holds a secret.
 */
export function Turnstile({ siteKey, locale }: { siteKey: string; locale: Locale }) {
  const host = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const widget = useRef<string | null>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const setToken = (t: string) => {
      if (input.current) input.current.value = t;
    };
    const mount = () => {
      const api = window.turnstile;
      if (!api || widget.current) return;
      widget.current = api.render(el, {
        sitekey: siteKey,
        appearance: 'interaction-only',
        language: locale,
        'response-field': false, // we own the hidden input below
        callback: setToken,
        'expired-callback': () => {
          setToken('');
          if (widget.current) api.reset(widget.current);
        },
        'error-callback': () => {
          setToken('');
          if (widget.current) api.reset(widget.current);
          return true; // handled — no console spam from the widget
        },
      });
    };
    const form = el.closest('form');
    const wake = () => {
      form?.removeEventListener('focusin', wake);
      form?.removeEventListener('pointerdown', wake);
      loadScript();
      mount();
    };
    document.addEventListener(READY_EVENT, mount);
    if (window.turnstile) mount();
    else {
      form?.addEventListener('focusin', wake);
      form?.addEventListener('pointerdown', wake);
    }
    return () => {
      document.removeEventListener(READY_EVENT, mount);
      form?.removeEventListener('focusin', wake);
      form?.removeEventListener('pointerdown', wake);
      if (widget.current && window.turnstile) window.turnstile.remove(widget.current);
      widget.current = null;
    };
  }, [siteKey, locale]);

  return (
    <>
      <div ref={host} data-testid="turnstile" />
      <input ref={input} type="hidden" name={CAPTCHA_FIELD} defaultValue="" />
    </>
  );
}
