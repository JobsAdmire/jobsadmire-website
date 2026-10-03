import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/** W225: the two pages whose server actions upload a file before posting the form raise their
 *  function cap above Vercel Hobby's 10 s default (upload ≤ 15 s + post ≤ 9 s). A static read —
 *  importing the page modules would pull their server-only graph into the unit run. */
const PAGES = [
  'src/app/[locale]/(site)/careers/[slug]/page.tsx',
  'src/app/[locale]/(site)/verify/page.tsx',
];

describe('upload routes carry a 60 s function cap (W225)', () => {
  it.each(PAGES)('%s exports maxDuration = 60', (page) => {
    const source = readFileSync(join(process.cwd(), page), 'utf8');
    expect(source).toMatch(/^export const maxDuration = 60;$/m);
  });
});
