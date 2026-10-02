import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { makeTf } from '@/content/pure';
import { testBundle } from '@/test/bundle';
import { OPENING } from '@/test/careers';
import { renderWithIntl } from '@/test/render';
import { roleCards, type RoleCopy } from '../_lib/roles';
import { OpenApplication } from '../_sections/OpenApplication';
import { RolesSection } from '../_sections/Roles';
import { openingView } from '../[slug]/_lib/view';
import { AboutRole } from '../[slug]/_sections/AboutRole';

const ROUTE = join(process.cwd(), 'src/app/[locale]/(site)/careers');
function sources(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return name === '__tests__' ? [] : sources(path);
    return name.endsWith('.tsx') ? [path] : [];
  });
}

const JT = Object.fromEntries(
  Object.entries(
    (
      JSON.parse(readFileSync(join(process.cwd(), 'src/content/local/bundle.en.json'), 'utf8')) as {
        strings: Record<string, string>;
      }
    ).strings,
  ).filter(([id]) => id.startsWith('jt.')),
);
const t = makeTf(testBundle({ strings: JT }), 'en');
const copy: RoleCopy = {
  engagement: { fullTime: 'Full-time', partTime: 'Part-time', project: 'Project-based' },
  workMode: { REMOTE: 'Remote', HYBRID: 'Hybrid', ON_SITE: 'On site' },
  posted: (date) => `Posted ${date}`,
  askIntro: 'Hello',
  askTail: 'role (',
};
const ctx = {
  locale: 'en' as const,
  countries: [{ code: 'UZ', name: 'Uzbekistan' }],
  copy,
  whatsappNumber: '905011240340',
  now: new Date('2026-09-20T00:00:00Z'),
};

describe('careers faces — the 11 px floor and contrast on the pale surface', () => {
  it('W190: no literal font size below 11 px in either careers route', () => {
    const small: string[] = [];
    for (const file of sources(ROUTE))
      for (const m of readFileSync(file, 'utf8').matchAll(/text-\[(\d+(?:\.\d+)?)px\]/g))
        if (Number(m[1]) < 11) small.push(`${file.slice(ROUTE.length)} ${m[0]}`);
    expect(small).toEqual([]);
  });

  // text-tertiary (#64748b) on pale-1 (#f4f9fc) is 4.49:1 — under axe's 4.5:1 for body text;
  // text-secondary (#556377) is 5.76:1 there.
  it('the open-application card lead sits on pale-1 in text-secondary', () => {
    renderWithIntl(
      <OpenApplication
        t={t}
        settings={{ whatsappNumber: '905011240340', careersEmail: 'careers@jobsadmire.com' }}
      />,
      { locale: 'en' },
    );
    const lead = screen.getByText(t('jt.096'));
    expect(lead).toHaveClass('text-text-secondary');
    expect(lead).not.toHaveClass('text-text-tertiary');
  });

  it('the roles result line sits on the pale section in text-secondary', () => {
    renderWithIntl(<RolesSection t={t} cards={roleCards([OPENING], ctx)} />, { locale: 'en' });
    const status = within(screen.getByTestId('careers-roles-list')).getByRole('status');
    expect(status).toHaveClass('text-text-secondary');
    expect(status).not.toHaveClass('text-text-tertiary');
  });

  it('the at-a-glance labels sit on pale-1 in text-secondary', () => {
    const { container } = renderWithIntl(
      <AboutRole
        opening={OPENING}
        view={openingView(OPENING, {
          ...ctx,
          copy: {
            ...copy,
            salary: {
              range: (min, max) => `${min} – ${max}`,
              from: (a) => a,
              upTo: (a) => a,
              per: (p) => p,
            },
          },
        })}
        engagementLabel="Engagement"
      />,
      { locale: 'en' },
    );
    const labels = [...container.querySelectorAll('dt')];
    expect(labels.length).toBeGreaterThan(0);
    for (const dt of labels) {
      expect(dt).toHaveClass('text-text-secondary');
      expect(dt).not.toHaveClass('text-text-tertiary');
    }
  });
});
