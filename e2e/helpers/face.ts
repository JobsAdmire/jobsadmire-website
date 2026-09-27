/**
 * W91/W104 — which robots.txt face a gate run's target answers with.
 *
 * `src/app/robots.ts` renders `Disallow: /` whenever `process.env.VERCEL_ENV` is set and not
 * `'production'` — every Vercel Preview deployment, automatically (docs/DEPLOYMENT.md §
 * Environment variables). The Playwright process driving the gate runs in a separate shell (and
 * usually a separate machine) from a deployed preview, so it cannot read that server's
 * `VERCEL_ENV` directly. Two ways to infer the face from here instead:
 *
 *   - the target is a `*.vercel.app` host: Vercel always deploys those as non-production, so the
 *     face is `'preview'` whatever this shell's own environment says;
 *   - otherwise, `NEXT_PUBLIC_SITE_FACE` — read with the same "unset means production" default
 *     `robots.ts` itself applies to `VERCEL_ENV` — so a bare `next start`/`next dev` with no env
 *     overrides (the default local run, and the one `e2e/seo.spec.ts` was originally written
 *     against) keeps matching its own real, unset-`VERCEL_ENV` behaviour. Set
 *     `NEXT_PUBLIC_SITE_FACE` to anything other than `'production'` to rehearse the preview face
 *     against a local server started the same way (e.g. `VERCEL_ENV=preview npm start`).
 */
export type SiteFace = 'preview' | 'production';

export function expectedRobots(baseUrl: string, env: NodeJS.ProcessEnv = process.env): SiteFace {
  if (/\.vercel\.app$/i.test(new URL(baseUrl).hostname)) return 'preview';
  const face = env.NEXT_PUBLIC_SITE_FACE?.trim() || 'production';
  return face === 'production' ? 'production' : 'preview';
}
