/** @vitest-environment node */
import { expect, it } from 'vitest';
import { UNBUILT_PATHNAMES } from '@/lib/seo/routes';

// W20: each page task deletes its own entry; Gate A requires the set to be empty so the sitemap
// (which skips these) advertises every route. Runs ONLY under vitest.launch.config.mts — it is
// expected to fail until the last page lands, so it must never join `npm run verify`.
it('every pathnames route is built — UNBUILT_PATHNAMES is empty (W20)', () => {
  expect([...UNBUILT_PATHNAMES]).toEqual([]);
});
