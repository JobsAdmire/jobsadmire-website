/**
 * W135 — the ONE site-face helper: which face a gate run's target answers with.
 *
 * `src/app/robots.ts` renders `Disallow: /` whenever `VERCEL_ENV` is set and not `'production'`
 * (every Vercel Preview deployment), and `/robots.txt` is prerendered at BUILD time. The shell
 * driving the gate cannot read the target's `VERCEL_ENV`, so the face is inferred from here:
 *
 *   - preview: the host is a `*.vercel.app` deployment URL or `staging.jobsadmire.com` (the
 *     Preview alias, docs/ARCHITECTURE.md § Environments), whatever this shell says; or
 *     `NEXT_PUBLIC_SITE_FACE` is set to anything other than `production`;
 *   - production: everything else. An UNSET (or blank) `NEXT_PUBLIC_SITE_FACE` is production,
 *     because a local build with `VERCEL_ENV` unset serves the production rules.
 *
 * The production deployment's own `*.vercel.app` alias would read as preview too; nobody gates
 * that URL (production runs target the custom domain), so the host rule stays simple.
 *
 * Rehearsing the preview face locally: `VERCEL_ENV=preview npm run build` (robots.txt is
 * prerendered, so setting it on `npm start` changes nothing), start that build, and run the gate
 * with `NEXT_PUBLIC_SITE_FACE=preview`.
 *
 * Consumers: `e2e/seo.spec.ts` (`expectedRobots`); tested in `scripts/face.test.ts`.
 */
export type SiteFace = 'preview' | 'production';

/** The Preview alias (README § Environments); `*.vercel.app` is matched by suffix. */
const PREVIEW_HOSTS: ReadonlySet<string> = new Set(['staging.jobsadmire.com']);

export function siteFace(baseUrl: string, env: NodeJS.ProcessEnv = process.env): SiteFace {
  const host = new URL(baseUrl).hostname;
  if (/\.vercel\.app$/i.test(host) || PREVIEW_HOSTS.has(host)) return 'preview';
  const face = env.NEXT_PUBLIC_SITE_FACE?.trim();
  return face && face !== 'production' ? 'preview' : 'production';
}

/** W91/W104: the robots.txt face `e2e/seo.spec.ts` asserts — the site face itself. */
export function expectedRobots(baseUrl: string, env: NodeJS.ProcessEnv = process.env): SiteFace {
  return siteFace(baseUrl, env);
}

export type LighthouseConfig =
  'lighthouserc.preview.json' | 'lighthouserc.local.json' | 'lighthouserc.json';

/**
 * R50/W135/W137: the Lighthouse CI config a run against `baseUrl` must pass to `lhci collect`
 * AND `lhci assert` — `skipAudits` is a collect-time setting, `assert` only reads stored runs.
 * The face comes first: a preview face (`Disallow: /`) fails the is-crawlable audit, so it
 * always gets `lighthouserc.preview.json`, even on localhost, where LCP then stays an error — a
 * local preview-face rehearsal reports the R50 Lantern artefact, which is expected (a local run
 * is never sign-off). Otherwise localhost gets `lighthouserc.local.json` (LCP a warning, R50)
 * and anything else, i.e. production after WP7a, gets `lighthouserc.json`.
 */
export function lighthouseConfigFor(
  baseUrl: string,
  env: NodeJS.ProcessEnv = process.env,
): LighthouseConfig {
  if (siteFace(baseUrl, env) === 'preview') return 'lighthouserc.preview.json';
  const host = new URL(baseUrl).hostname;
  return host === 'localhost' || host === '127.0.0.1'
    ? 'lighthouserc.local.json'
    : 'lighthouserc.json';
}
