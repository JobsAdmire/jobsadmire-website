import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { SourceCountry } from '@/content/collections';
import { makeTf } from '@/content/pure';
import en from '@/messages/en.json';
import tr from '@/messages/tr.json';
import { testBundle } from '@/test/bundle';
import { OPENING, opening } from '@/test/careers';
import { renderWithIntl } from '@/test/render';
import { opsCareersPortal, opsCareersStatus } from '../_lib/links';
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
const SETTINGS = { careersEmail: 'careers@jobsadmire.com' };

beforeEach(() => {
  window.dataLayer = [];
});
afterEach(() => {
  vi.restoreAllMocks();
});
const OVERSEAS = CARDS.filter((c) => c.place === 'overseas').length;

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

  // Parity M6 (supersedes the CAR-01 wrap): ≤ 900 the chips are ONE horizontally scrolling row
  // bleeding into the gutters — inside the hero's overflow-hidden (no document overflow), a
  // focusable scroll region, and opaque faces so axe reads the real background; no flags.
  it('lays the country chips out as one focusable scrolling row below lg, with a pin and no flags', () => {
    const { container } = renderWithIntl(
      <CareersHero t={t} locale="en" openingsCount={0} heroCards={[]} sourceCountries={SOURCE} />,
      { locale: 'en' },
    );
    const list = screen.getByRole('list', { name: t('jt.036') });
    const tokens = (el: Element) => (el.getAttribute('class') ?? '').split(/\s+/);
    expect(list).toHaveAttribute('tabindex', '0');
    expect(tokens(list)).toEqual(
      expect.arrayContaining([
        'flex-wrap',
        'max-lg:flex-nowrap',
        'max-lg:overflow-x-auto',
        'max-lg:bg-night',
        'max-lg:flex-none',
      ]),
    );
    expect(tokens(list.parentElement!)).toEqual(
      expect.arrayContaining(['max-lg:flex-col', 'max-lg:items-stretch']),
    );
    for (const item of within(list).getAllByRole('listitem')) {
      expect(tokens(item)).toEqual(
        expect.arrayContaining(['max-lg:whitespace-nowrap', 'max-lg:bg-[#1e2739]']),
      );
      expect(item.querySelector('svg, img, use')).toBeNull();
    }
    expect(container.querySelector('#careers-countries-label svg')).not.toBeNull();
    // the hero clips its glows and the row's bleed
    expect(container.querySelector('section')).toHaveClass('relative', 'overflow-hidden');
  });

  it('the CTAs are 13 px rectangles from 901 px (pills below), the primary with its arrow', () => {
    renderWithIntl(
      <CareersHero t={t} locale="en" openingsCount={0} heroCards={[]} sourceCountries={SOURCE} />,
      { locale: 'en' },
    );
    const primary = screen.getByRole('link', { name: 'See open roles' });
    const secondary = screen.getByRole('link', { name: t('jt.026') });
    for (const cta of [primary, secondary])
      expect(cta).toHaveClass('rounded-[13px]', 'max-lg:rounded-pill', 'max-md:w-full');
    expect(primary.querySelector('svg')).not.toBeNull();
    // nothing overseas to count: a plain jump, no pre-filter
    expect(primary).not.toHaveAttribute('data-roles-place');
  });

  it('with openings: the ICU count pill and the overseas roles, the third hidden up to 900 px (W10)', () => {
    renderWithIntl(
      <CareersHero
        t={t}
        locale="en"
        openingsCount={CARDS.length}
        overseasCount={OVERSEAS}
        heroCards={heroRoles(CARDS)}
        sourceCountries={SOURCE}
      />,
      { locale: 'en' },
    );
    expect(screen.getByTestId('careers-hiring-count')).toHaveTextContent(
      '5 open roles · Antalya & overseas',
    );
    // S2.2: the primary counts the OVERSEAS roles and pre-filters the list to them
    const see = screen.getByRole('link', { name: 'See 3 open roles' });
    expect(see).toHaveAttribute('href', '#roles');
    expect(see).toHaveAttribute('data-roles-place', 'overseas');
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
    renderWithIntl(<RolesSection t={t} locale="en" cards={[]} />, { locale: 'en' });
    const empty = screen.getByTestId('careers-empty');
    expect(empty).toHaveAttribute('role', 'status');
    expect(empty).toHaveTextContent(SYS.empty.title);
    expect(within(empty).getByRole('link', { name: t('jt.026') })).toHaveAttribute(
      'href',
      '#apply',
    );
    expect(screen.queryByTestId('careers-roles-list')).toBeNull();
  });

  it('the header carries the Operations portal pill in a new tab, in the page locale (owner, parity S4.1, W245)', () => {
    for (const locale of ['en', 'tr'] as const) {
      const { unmount } = renderWithIntl(<RolesSection t={t} locale={locale} cards={[]} />, {
        locale,
      });
      const pill = screen.getByRole('link', { name: t('jt.047') });
      expect(pill).toHaveAttribute('href', `https://operations.jobsadmire.com/${locale}/careers`);
      expect(pill).toHaveAttribute('target', '_blank');
      expect(pill).toHaveAttribute('rel', 'noopener');
      unmount();
    }
  });

  it('with openings: four cards, the result line and the show-more toggle', () => {
    renderWithIntl(<RolesSection t={t} locale="en" cards={CARDS} />, { locale: 'en' });
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
    renderWithIntl(<RolesSection t={t} locale="en" cards={CARDS} />, { locale: 'en' });
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

  it('each row is an accordion: "View role" opens the panel (lists, Apply, Ask), "Close" shuts it', async () => {
    const user = userEvent.setup();
    renderWithIntl(<RolesSection t={t} locale="en" cards={CARDS} />, { locale: 'en' });
    const card = within(screen.getByTestId('careers-roles-list')).getAllByTestId('careers-role')[1];
    const view = within(card).getByRole('button', { name: `${t('jt.310')}: ${CARDS[1].title}` });
    expect(view).toHaveAttribute('aria-expanded', 'false');
    const panel = card.querySelector<HTMLElement>(
      `#${CSS.escape(view.getAttribute('aria-controls')!)}`,
    )!;
    expect(panel).not.toBeVisible();
    // the closed panel's links stay in the DOM (crawlable), hidden from the a11y tree
    expect(within(card).queryByRole('link', { name: new RegExp(`^${t('jt.052')}`) })).toBeNull();
    await user.click(view);
    expect(panel).toBeVisible();
    expect(card).toHaveAttribute('data-open', 'true');
    expect(panel).toHaveTextContent('The work');
    expect(panel).toHaveTextContent('Find and manage licensed partner agencies');
    const close = within(card).getByRole('button', { name: `${t('jt.309')}: ${CARDS[1].title}` });
    expect(close).toHaveAttribute('aria-expanded', 'true');
    await user.click(close);
    expect(panel).not.toBeVisible();
  });

  it('opening one row closes the other; a filter change closes it too', async () => {
    const user = userEvent.setup();
    renderWithIntl(<RolesSection t={t} locale="en" cards={CARDS} />, { locale: 'en' });
    const list = screen.getByTestId('careers-roles-list');
    const rows = within(list).getAllByTestId('careers-role');
    await user.click(within(rows[0]).getByRole('button', { name: new RegExp(`^${t('jt.310')}`) }));
    await user.click(within(rows[1]).getByRole('button', { name: new RegExp(`^${t('jt.310')}`) }));
    expect(rows[0]).not.toHaveAttribute('data-open');
    expect(rows[1]).toHaveAttribute('data-open', 'true');
    await user.click(within(list).getByRole('radio', { name: t('jt.262') }));
    expect(list.querySelector('[data-open]')).toBeNull();
  });

  it('the row faces: icon tile per place, coloured type pill, solid NEW badge', () => {
    renderWithIntl(<RolesSection t={t} locale="en" cards={CARDS} />, { locale: 'en' });
    const rows = within(screen.getByTestId('careers-roles-list')).getAllByTestId('careers-role');
    const office = rows[0]; // Work Permit officer, Antalya, full-time, new
    expect(within(office).getByText(t('jt.099'))).toHaveClass(
      'bg-success-soft',
      'text-success-text',
    );
    expect(within(office).getByText(t('jt.033'))).toHaveClass('bg-success-text', 'text-white');
    expect(office.querySelector('[aria-hidden="true"].bg-tint svg')).not.toBeNull();
    const partTime = rows.find((r) => r.getAttribute('data-engagement') === 'partTime')!;
    expect(within(partTime).getByText(t('jt.100'))).toHaveClass('bg-tint', 'text-blue-safe');
    expect(partTime.querySelector('[aria-hidden="true"].text-indigo svg')).not.toBeNull();
  });

  it('"Ask a question first" carries only the role (W95) and fires whatsapp_click page_cta (W12); "Apply" goes to the detail', async () => {
    const user = userEvent.setup();
    renderWithIntl(<RolesSection t={t} locale="en" cards={CARDS} />, { locale: 'en' });
    const card = within(screen.getByTestId('careers-roles-list')).getAllByTestId('careers-role')[1];
    await user.click(within(card).getByRole('button', { name: new RegExp(`^${t('jt.310')}`) }));
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

  it('the hero CTA pre-filters the list to the overseas roles (S2.2)', async () => {
    const user = userEvent.setup();
    renderWithIntl(
      <>
        <CareersHero
          t={t}
          locale="en"
          openingsCount={CARDS.length}
          overseasCount={OVERSEAS}
          heroCards={heroRoles(CARDS)}
          sourceCountries={SOURCE}
        />
        <RolesSection t={t} locale="en" cards={CARDS} />
      </>,
      { locale: 'en' },
    );
    await user.click(screen.getByRole('link', { name: 'See 3 open roles' }));
    const list = screen.getByTestId('careers-roles-list');
    expect(within(list).getByRole('radio', { name: t('jt.262') })).toBeChecked();
    expect(
      within(list)
        .getAllByTestId('careers-role')
        .map((r) => r.getAttribute('data-place')),
    ).toEqual(['overseas', 'overseas', 'overseas']);
  });
});

describe('OpenApplication (W245 — the Operations careers page, no form)', () => {
  it('keeps the pitch and the card; its doors are the locale-aware portal in a new tab and the careers e-mail', () => {
    for (const locale of ['en', 'tr'] as const) {
      const { unmount } = renderWithIntl(
        <OpenApplication t={t} locale={locale} settings={SETTINGS} />,
        { locale },
      );
      const apply = screen.getByTestId('careers-apply');
      expect(within(apply).getByRole('heading', { level: 2, name: t('jt.087') })).toBeVisible();
      expect(within(apply).getByRole('heading', { level: 3, name: t('jt.095') })).toBeVisible();
      const portal = within(apply).getByRole('link', { name: t('jt.047') });
      expect(portal).toHaveAttribute('data-testid', 'careers-apply-portal');
      expect(portal).toHaveAttribute('href', `https://operations.jobsadmire.com/${locale}/careers`);
      expect(portal).toHaveAttribute('target', '_blank');
      expect(portal).toHaveAttribute('rel', 'noopener');
      expect(within(apply).getByRole('link', { name: t('jt.104') })).toHaveAttribute(
        'href',
        `mailto:careers@jobsadmire.com?subject=${encodeURIComponent((locale === 'tr' ? tr : en).sys.careers.apply.emailSubject)}`,
      );
      // no form, no field, nothing composed for WhatsApp
      expect(apply.querySelector('form, input, textarea, select')).toBeNull();
      expect(apply.querySelector('a[href^="https://wa.me/"]')).toBeNull();
      expect(within(apply).getAllByRole('link')).toHaveLength(2);
      unmount();
    }
  });
});

describe('HiringSteps', () => {
  it('seven steps in a list of list items only, the Admira AI badge on steps 3 and 4', () => {
    const { container } = renderWithIntl(<HiringSteps t={t} locale="en" />, { locale: 'en' });
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
    // S6.1: the status button — the Operations status page in a new tab
    const status = screen.getByRole('link', { name: t('jt.085') });
    expect(status).toHaveAttribute('href', 'https://operations.jobsadmire.com/en/careers/status');
    expect(status).toHaveAttribute('target', '_blank');
    expect(status).toHaveAttribute('rel', 'noopener');
  });

  it('the compact variant (the detail page) keeps its heading and drops the section header', () => {
    renderWithIntl(<HiringSteps t={t} locale="en" variant="compact" />, { locale: 'en' });
    expect(screen.getByRole('heading', { level: 2, name: t('jt.081') })).toBeInTheDocument();
    expect(screen.queryByText(t('jt.082'))).toBeNull();
    expect(screen.queryByRole('link', { name: t('jt.085') })).toBeNull();
  });
});

describe('WaysSection (parity M9)', () => {
  it('three cards; below 901 px accordions with the first open; the body stays in the DOM', async () => {
    const user = userEvent.setup();
    renderWithIntl(<WaysSection t={t} />, { locale: 'en' });
    const ways = screen.getAllByTestId('careers-way');
    expect(ways).toHaveLength(3);
    expect(ways.map((w) => w.hasAttribute('data-open'))).toEqual([true, false, false]);
    const second = within(ways[1]).getByRole('button', { name: t('jt.067') });
    expect(second).toHaveAttribute('aria-expanded', 'false');
    expect(second).toHaveClass('lg:hidden');
    const body = document.getElementById(second.getAttribute('aria-controls')!)!;
    expect(body).toHaveClass('max-lg:hidden');
    expect(body).toHaveTextContent(t('jt.069'));
    await user.click(second);
    expect(second).toHaveAttribute('aria-expanded', 'true');
    expect(body).not.toHaveClass('max-lg:hidden');
    // one heading per card whatever the width: the desktop title is the span beside the button
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(3);
  });
});

describe('the index as a whole (W89 lifted by the owner, one h1)', () => {
  it('links to Operations only through the owner-approved portal and status pages, in a new tab; one h1; the ways note link underlined', () => {
    const { container } = renderWithIntl(
      <>
        <CareersHero
          t={t}
          locale="en"
          openingsCount={CARDS.length}
          overseasCount={OVERSEAS}
          heroCards={heroRoles(CARDS)}
          sourceCountries={SOURCE}
        />
        <WorkerNotice t={t} />
        <RolesSection t={t} locale="en" cards={CARDS} />
        <WaysSection t={t} />
        <HiringSteps t={t} locale="en" />
        <OpenApplication t={t} locale="en" settings={SETTINGS} />
      </>,
      { locale: 'en' },
    );
    const ops = [...container.querySelectorAll('a[href*="operations.jobsadmire.com"]')];
    expect([...new Set(ops.map((a) => a.getAttribute('href')))].sort()).toEqual(
      [opsCareersPortal('en'), opsCareersStatus('en')].sort(),
    );
    for (const a of ops) {
      expect(a).toHaveAttribute('target', '_blank');
      expect(a).toHaveAttribute('rel', 'noopener');
    }
    expect(container.querySelectorAll('h1')).toHaveLength(1);
    expect(screen.getByRole('link', { name: t('jt.079') })).toHaveClass('underline');
  });
});
