'use client';
import {
  startTransition,
  useActionState,
  useEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
} from 'react';
// By module path (W147/W156).
import { Button } from '@/design/primitives/Button';
import { resultState, type NewsletterState } from '@/lib/newsletter/copy';
import {
  IDLE_NEWSLETTER_STATE,
  type NewsletterActionState,
  type NewsletterForwardKind,
} from '@/lib/newsletter/types';
import {
  OutcomePanel,
  type FallbackCopy,
  type FallbackLinks,
  type StateCopy,
} from './OutcomePanel';

/** The page's `'use server'` action — the visitor's click is the only way a token leaves the site. */
export type NewsletterActionFn = (
  prev: NewsletterActionState,
  token: string,
) => Promise<NewsletterActionState>;

// R18: hydration is a browser fact — false on the server and in the hydrating render, true after.
const subscribe = () => () => {};
const onClient = () => true;
const onServer = () => false;

/** A server action that REJECTS in the browser (the browser→Vercel call failed, the function
 *  timed out) becomes the `unavailable` answer with the manual fallback — never the error
 *  boundary (the forms kernel's `guardAction` rule, D11). */
function guard(action: NewsletterActionFn): NewsletterActionFn {
  return async function guarded(prev, token) {
    try {
      return await action(prev, token);
    } catch (err) {
      console.error('[newsletter] the action rejected', err);
      return { status: 'done', result: { kind: 'unavailable', cause: 'network' } };
    }
  };
}

/**
 * Click-to-forward (W5, I12): a button whose click dispatches the server action — deliberately
 * NOT a `<form>`: a native pre-hydration submit would POST the page URL without `Next-Action`,
 * which `src/proxy.ts` treats as an RFC 8058 one-click request on the unsubscribe page. Before
 * hydration the button does nothing (`data-ready` tells the e2e when it acts). Every string
 * arrives resolved from the server (W148: `sys.newsletter` is not in `CLIENT_SYS`). After the
 * answer, focus moves to it (D20 — the button it replaces is gone).
 */
export function NewsletterAction({
  kind,
  token,
  action,
  labels,
  outcomes,
  fallbackCopy,
  links,
}: {
  kind: NewsletterForwardKind;
  token: string;
  action: NewsletterActionFn;
  labels: { button: string; pending: string };
  outcomes: Partial<Record<NewsletterState, StateCopy>>;
  fallbackCopy: FallbackCopy;
  links: FallbackLinks;
}) {
  const guarded = useMemo(() => guard(action), [action]);
  const [state, dispatch, pending] = useActionState(guarded, IDLE_NEWSLETTER_STATE);
  const ready = useSyncExternalStore(subscribe, onClient, onServer);
  const answerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (state.status === 'done') answerRef.current?.focus();
  }, [state.status]);

  if (state.status === 'done') {
    const shown = resultState(kind, state.result);
    const copy = outcomes[shown.state];
    return (
      <div
        ref={answerRef}
        tabIndex={-1}
        data-testid="newsletter-answer"
        className="mt-6 focus:outline-none"
      >
        {copy ? (
          <OutcomePanel
            state={shown.state}
            fallback={shown.fallback}
            copy={copy}
            fallbackCopy={fallbackCopy}
            links={links}
          />
        ) : null}
      </div>
    );
  }
  return (
    <div data-testid="newsletter-action" data-ready={ready ? 'true' : undefined} className="mt-6">
      {/* D20: never `disabled` while pending — `aria-disabled` keeps focus on the button. */}
      <Button
        type="button"
        variant="primary"
        size="lg"
        aria-disabled={pending || undefined}
        className="aria-disabled:cursor-progress aria-disabled:opacity-60"
        onClick={() => {
          if (!pending) startTransition(() => dispatch(token));
        }}
      >
        {pending ? labels.pending : labels.button}
      </Button>
    </div>
  );
}
