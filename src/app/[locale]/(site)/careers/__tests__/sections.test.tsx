import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import type { SourceCountry } from '@/content/collections';
import { makeTf } from '@/content/pure';
import en from '@/messages/en.json';
import { testBundle } from '@/test/bundle';
import { OPENING, opening } from '@/test/careers';
import { renderWithIntl } from '@/test/render';
import { heroRoles, roleCards, type RoleCopy } from '../_lib/roles';
import { CareersHero, WorkerNotice } from '../_sections/Hero';
import { HiringSteps } from '../_sections/HiringSteps';
import { OpenApplication } from '../_sections/OpenApplication';
import { RolesSection } from '../_sections/Roles';
import { WaysSection } from '../_sections/Ways';

/** The committed EN bundle's `jt.*` strings — read with readFileSync, the sanctioned way past
 *  the D23 import rule. */
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
const SYS = en.sys.careers;
const COUNTRIES = [
  { code: 'UZ', name: 'Uzbekistan' },
  { code: 'PK', name: 'Pakistan' },
  { code: 'IN', name: 'India' },
  { code: 'TR', name: 'Türkiye' },
];
const SOURCE: SourceCountry[] = [
  { code: 'PK', nameId: null, name: 'Pakistan', dial: '+92', lon: 69.3, lat: 30.4, flag: 'pk' },
  { code: 'UZ', nameId: null, name: 'Uzbekistan', dial: '+998', lon: 64.6, lat: 41.4, flag: 'uz' },
];
/** The fixture door's five openings (e2e/mocks/careers-door.mjs), newest first. */
const OPENINGS = [
  opening({
    slug: 'work-permit-officer-antalya',
    title: 'Work Permit & Documentation Officer',
    country: 'TR',
    city: 'Antalya',
    cities: ['Antalya'],
    category: 'FULL_TIME',
    postedAt: '2026-09-19T08:00:00.000Z',
  }),
  OPENING,
  opening({
    slug: 'sourcing-coordinator-pakistan',
    title: 'Sourcing Coordinator — Pakistan',
    country: 'PK',
    city: 'Karachi',
    cities: ['Karachi', 'Lahore'],
    category: 'FREELANCER',
    postedAt: '2026-09-10T08:00:00.000Z',
  }),
  opening({
    slug: 'content-seo-specialist-antalya',
    title: 'Content & SEO Specialist',
    country: 'TR',
    city: 'Antalya',
    cities: ['Antalya'],
    category: 'FULL_TIME',
    portfolioRequired: true,
    postedAt: '2026-08-31T08:00:00.000Z',
  }),
  opening({
    slug: 'trade-test-assessor-india',
    title: 'Trade Test & Skills Assessor',
    country: 'IN',
    city: null,
    cities: [],
    category: 'PROJECT_BASED',
    postedAt: '2026-08-11T08:00:00.000Z',
  }),
];
const COPY: RoleCopy = {
  engagement: { fullTime: t('jt.099'), partTime: t('jt.100'), project: t('jt.073') },
  workMode: SYS.workMode,
  posted: (date) => SYS.roles.posted.replace('{date}', date),
  askIntro: t('jt.311'),
  askTail: t('jt.312'),
};
const CARDS = roleCards(OPENINGS, {
  locale: 'en',
  countries: COUNTRIES,
  copy: COPY,
  whatsappNumber: '905011240340',
  now: new Date('2026-09-20T00:00:00Z'),
});
const SETTINGS = { whatsappNumber: '905011240340', careersEmail: 'careers@jobsadmire.com' };

beforeEach(() => {
  window.dataLayer = [];
});

describe('CareersHero (W1, W6, D26)', () => {
  it('with nothing open: no count pill, no role card; one tagged h1, the only LCP slot', () => {
    const { container } = renderWithIntl(
      <CareersHero t={t} locale="en" openingsCount={0} heroCards={[]} sourceCountries={SOURCE} />,
      { locale: 'en' },
    );
    expect(screen.queryByTestId('careers-hiring-count')).toBeNull();
    expect(screen.queryByTestId('careers-hero-roles')).toBeNull();
    const h1 = screen.getByTestId('page-h1');
    expect(h1.tagName).toBe('H1');
    expect(h1).toHaveTextContent(t('jt.022'));
    expect(container.querySelectorAll('[data-lcp-slot]')).toHaveLength(1);
    expect(screen.getByRole('link', { name: 'See open roles' })).toHaveAttribute('href', '#roles');
    expect(screen.getByRole('link', { name: t('jt.026') })).toHaveAttribute('href', '#apply');
    // The one source-country list (D17), never the design's jt.289–301.
    expect(screen.getByRole('list', { name: t('jt.036') })).toHaveTextContent('Pakistan');
  });

  it('with openings: the ICU count pill and the overseas roles, the third hidden up to 900 px (W10)', () => {
    renderWithIntl(
      <CareersHero
        t={t}
        locale="en"
        openingsCount={CARDS.length}
        heroCards={heroRoles(CARDS)}
        sourceCountries={SOURCE}
      />,
      { locale: 'en' },
    );
    expect(screen.getByTestId('careers-hiring-count')).toHaveTextContent(
      '5 open roles · Antalya & overseas',
    );
    expect(screen.getByRole('link', { name: 'See 5 open roles' })).toHaveAttribute(
      'href',
      '#roles',
    );
    const items = screen.getAllByTestId('careers-hero-role');
    expect(items.map((li) => li.getAttribute('data-slug'))).toEqual([
      'country-representative-uzbekistan',
      'sourcing-coordinator-pakistan',
      'trade-test-assessor-india',
    ]);
    expect(items[0]).not.toHaveClass('max-lg:hidden');
    expect(items[2]).toHaveClass('max-lg:hidden');
    expect(within(items[0]).getByRole('link')).toHaveAttribute(
      'href',
      '/en/careers/country-representative-uzbekistan',
    );
  });
});

describe('WorkerNotice', () => {
  it('links the partner page inside the sentence, underlined (axe link-in-text-block)', () => {
    renderWithIntl(<WorkerNotice t={t} />, { locale: 'en' });
    const link = screen.getByRole('link', { name: t('jt.042') });
    expect(link).toHaveAttribute('href', '/en/partner-with-us');
    expect(link).toHaveClass('underline');
    expect(screen.getByTestId('careers-notice')).toHaveTextContent(t('jt.043').trim());
  });
});

describe('RolesSection (W6, W13 amended)', () => {
  it('without openings: the designed empty state, pointing at the open application', () => {
    renderWithIntl(<RolesSection t={t} cards={[]} />, { locale: 'en' });
    const empty = screen.getByTestId('careers-empty');
    expect(empty).toHaveAttribute('role', 'status');
    expect(empty).toHaveTextContent(SYS.empty.title);
    expect(within(empty).getByRole('link', { name: t('jt.026') })).toHaveAttribute(
      'href',
      '#apply',
    );
    expect(screen.queryByTestId('careers-roles-list')).toBeNull();
  });

  it('with openings: four cards, the result line and the show-more toggle', () => {
    renderWithIntl(<RolesSection t={t} cards={CARDS} />, { locale: 'en' });
    const list = screen.getByTestId('careers-roles-list');
    expect(within(list).getAllByTestId('careers-role')).toHaveLength(4);
    expect(within(list).getByText('Showing all 5 open roles')).toBeInTheDocument();
    expect(within(list).getByRole('button', { name: 'Show more roles (1)' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });

  it('filters by place and engagement, shows the no-match state, clears, expands and collapses', async () => {
    const user = userEvent.setup();
    renderWithIntl(<RolesSection t={t} cards={CARDS} />, { locale: 'en' });
    const list = screen.getByTestId('careers-roles-list');
    const shown = () =>
      within(list)
        .queryAllByTestId('careers-role')
        .map((role) => role.getAttribute('data-slug'));
    await user.click(within(list).getByRole('radio', { name: t('jt.262') }));
    expect(shown()).toEqual([
      'country-representative-uzbekistan',
      'sourcing-coordinator-pakistan',
      'trade-test-assessor-india',
    ]);
    expect(within(list).getByText('Showing 3 of 3 matching roles')).toBeInTheDocument();
    await user.click(within(list).getByRole('radio', { name: t('jt.073') }));
    expect(shown()).toEqual(['trade-test-assessor-india']);
    await user.click(within(list).getByRole('radio', { name: t('jt.261') }));
    expect(within(list).getByTestId('careers-no-match')).toHaveTextContent(t('jt.054'));
    await user.click(within(list).getByRole('button', { name: t('jt.056') }));
    expect(shown()).toHaveLength(4);
    await user.click(within(list).getByRole('button', { name: 'Show more roles (1)' }));
    expect(shown()).toHaveLength(5);
    await user.click(within(list).getByRole('button', { name: t('jt.306') }));
    expect(shown()).toHaveLength(4);
  });

  it('"Ask a question first" carries only the role (W95) and fires whatsapp_click page_cta (W12); "Apply" goes to the detail', async () => {
    const user = userEvent.setup();
    renderWithIntl(<RolesSection t={t} cards={CARDS} />, { locale: 'en' });
    const card = within(screen.getByTestId('careers-roles-list')).getAllByTestId('careers-role')[1];
    const ask = within(card).getByRole('link', { name: new RegExp(`^${t('jt.053')}`) });
    expect(ask.getAttribute('href')).toBe(CARDS[1].askHref);
    expect(ask).toHaveAttribute('target', '_blank');
    await user.click(ask);
    expect(window.dataLayer).toContainEqual(
      expect.objectContaining({ event: 'whatsapp_click', placement: 'page_cta' }),
    );
    expect(within(card).getByRole('link', { name: new RegExp(`^${t('jt.052')}`) })).toHaveAttribute(
      'href',
      '/en/careers/country-representative-uzbekistan#apply',
    );
  });
});

describe('OpenApplication (W3)', () => {
  it('is WhatsApp + e-mail only — no form', () => {
    const { container } = renderWithIntl(<OpenApplication t={t} settings={SETTINGS} />, {
      locale: 'en',
    });
    expect(container.querySelector('form')).toBeNull();
    expect(screen.getByRole('link', { name: SYS.apply.whatsapp }).getAttribute('href')).toBe(
      `https://wa.me/905011240340?text=${encodeURIComponent(t('jt.286'))}`,
    );
    expect(screen.getByRole('link', { name: t('jt.104') })).toHaveAttribute(
      'href',
      `mailto:careers@jobsadmire.com?subject=${encodeURIComponent(SYS.apply.emailSubject)}`,
    );
  });
});

describe('HiringSteps', () => {
  it('seven steps in a list of list items only, the Admira AI badge on steps 3 and 4', () => {
    const { container } = renderWithIntl(<HiringSteps t={t} />, { locale: 'en' });
    const ol = container.querySelector('ol')!;
    expect([...ol.children].map((c) => c.tagName)).toEqual(Array(7).fill('LI'));
    expect([...ol.children].map((li) => li.textContent?.includes(t('jt.083')))).toEqual([
      false,
      false,
      true,
      true,
      false,
      false,
      false,
    ]);
    expect(screen.getByTestId('careers-process')).toHaveTextContent(t('jt.084'));
  });

  it('the compact variant (the detail page) keeps its heading and drops the section header', () => {
    renderWithIntl(<HiringSteps t={t} variant="compact" />, { locale: 'en' });
    expect(screen.getByRole('heading', { level: 2, name: t('jt.081') })).toBeInTheDocument();
    expect(screen.queryByText(t('jt.082'))).toBeNull();
  });
});

describe('the index as a whole (W8/W89, one h1)', () => {
  it('links nowhere on Operations, keeps one h1, and underlines the ways note link', () => {
    const { container } = renderWithIntl(
      <>
        <CareersHero
          t={t}
          locale="en"
          openingsCount={CARDS.length}
          heroCards={heroRoles(CARDS)}
          sourceCountries={SOURCE}
        />
        <WorkerNotice t={t} />
        <RolesSection t={t} cards={CARDS} />
        <WaysSection t={t} />
        <HiringSteps t={t} />
        <OpenApplication t={t} settings={SETTINGS} />
      </>,
      { locale: 'en' },
    );
    expect(container.querySelector('a[href*="operations.jobsadmire.com"]')).toBeNull();
    expect(container.querySelectorAll('h1')).toHaveLength(1);
    expect(screen.getByRole('link', { name: t('jt.079') })).toHaveClass('underline');
  });
});
