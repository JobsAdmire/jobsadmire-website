'use client';
import { useEffect, useImperativeHandle, useRef, type Ref, type RefObject } from 'react';
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

/** What the shell may do to a mounted widget. */
export type TurnstileHandle = { reset: () => void };

/**
 * The shell's side of the reset (W74: a token is single-use and a retry never re-sends one):
 * returns the ref to hand to `<Turnstile ref>` and resets the widget once per change of
 * `state` — i.e. after every action result, success or error — never on mount.
 */
export function useTurnstileReset(state: unknown): RefObject<TurnstileHandle | null> {
  const handle = useRef<TurnstileHandle>(null);
  const seen = useRef(state);
  useEffect(() => {
    if (seen.current === state) return;
    seen.current = state;
    handle.current?.reset();
  }, [state]);
  return handle;
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
 *
 * The hidden input is UNCONTROLLED and has no `defaultValue`: React re-applies a
 * `defaultValue` on every re-render, and for a hidden input that overwrites the value — the
 * first answer the shell rendered would wipe the token. Only the widget callbacks write it.
 * A token is single-use, so the shell calls `reset()` (through `ref`, see `useTurnstileReset`)
 * after every action result; the fresh token lands through the same callback.
 */
export function Turnstile({
  siteKey,
  locale,
  ref,
}: {
  siteKey: string;
  locale: Locale;
  ref?: Ref<TurnstileHandle>;
}) {
  const host = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const widget = useRef<string | null>(null);

  useImperativeHandle(
    ref,
    () => ({
      // The old token stays in the input until the widget's callback replaces it: a token the
      // door never saw (a field error answered before the post) is still valid meanwhile.
      reset: () => {
        if (widget.current && window.turnstile) window.turnstile.reset(widget.current);
      },
    }),
    [],
  );

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
      <input ref={input} type="hidden" name={CAPTCHA_FIELD} />
    </>
  );
}
