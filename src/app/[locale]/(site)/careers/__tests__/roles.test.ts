import { describe, expect, it } from 'vitest';
import { OPENING, opening } from '@/test/careers';
import { heroRoles, panelListsOf, roleCards, type RoleCopy } from '../_lib/roles';

const copy: RoleCopy = {
  engagement: { fullTime: 'Full-time', partTime: 'Part-time', project: 'Project-based' },
  workMode: { REMOTE: 'Remote', HYBRID: 'Hybrid', ON_SITE: 'On site' },
  posted: (date) => `Posted ${date}`,
  askIntro: 'Hello JobsAdmire, I have a question about the',
  askTail: 'role (',
};
const countries = [
  { code: 'UZ', name: 'Uzbekistan' },
  { code: 'TR', name: 'Türkiye' },
];
const ctx = {
  locale: 'en' as const,
  countries,
  copy,
  whatsappNumber: '905011240340',
  now: new Date('2026-09-20T00:00:00Z'),
};

describe('roleCards', () => {
  it('maps an opening onto plain, serialisable strings and typed hrefs — nothing else crosses to the island', () => {
    const [card] = roleCards([OPENING], ctx);
    const href = { pathname: '/careers/[slug]', params: { slug: OPENING.slug } };
    expect(card).toEqual({
      slug: OPENING.slug,
      title: 'Country Representative — Uzbekistan',
      summary:
        'Own the whole JobsAdmire pipeline in Uzbekistan — partners, candidates and quality.',
      panel: [
        {
          heading: 'The work',
          items: ['Find and manage licensed partner agencies', 'Run first interviews'],
        },
        { heading: 'The profile', items: ['A working network among agencies'] },
      ],
      location: 'Tashkent · Uzbekistan',
      workModes: 'Remote',
      place: 'overseas',
      engagement: 'fullTime',
      engagementLabel: 'Full-time',
      isNew: true,
      posted: 'Posted 15 September 2026',
      href,
      applyHref: { ...href, hash: '#apply' },
      askHref: `https://wa.me/905011240340?text=${encodeURIComponent(
        'Hello JobsAdmire, I have a question about the Country Representative — Uzbekistan role (Tashkent · Uzbekistan)',
      )}`,
    });
    expect(JSON.parse(JSON.stringify(card))).toEqual(card);
  });

  it('an Antalya freelance role posted in July is office, part-time, not new, with a Turkish date', () => {
    const [card] = roleCards(
      [
        opening({
          country: 'TR',
          city: 'Antalya',
          cities: ['Antalya'],
          category: 'FREELANCER',
          postedAt: '2026-07-01T00:00:00.000Z',
          workModes: ['HYBRID', 'REMOTE'],
        }),
      ],
      { ...ctx, locale: 'tr' },
    );
    expect(card).toMatchObject({
      place: 'office',
      engagement: 'partTime',
      engagementLabel: 'Part-time',
      isNew: false,
      location: 'Antalya · Türkiye',
      workModes: 'Hybrid · Remote',
      posted: 'Posted 1 Temmuz 2026',
    });
  });
});

describe('panelListsOf (parity S4.3)', () => {
  it('takes the first two lists under their own colon-ended lead-in, five items at most', () => {
    const text =
      'Intro line.\n\nWhat you do:\n- a\n- b\n- c\n- d\n- e\n- f\n\nProfile:\n- x\n\nPerks:\n- p';
    expect(panelListsOf(text)).toEqual([
      { heading: 'What you do', items: ['a', 'b', 'c', 'd', 'e'] },
      { heading: 'Profile', items: ['x'] },
    ]);
  });

  it('a list after an ordinary sentence carries no heading; no list, no panel lists', () => {
    expect(panelListsOf('A whole paragraph about the role.\n- one\n- two')).toEqual([
      { heading: '', items: ['one', 'two'] },
    ]);
    expect(panelListsOf('Just a paragraph.')).toEqual([]);
    expect(panelListsOf(null)).toEqual([]);
  });

  it('reads the rich-text form too (a heading before a <ul>)', () => {
    expect(panelListsOf('<h3>Duties</h3><ul><li>One</li><li>Two</li></ul>')).toEqual([
      { heading: 'Duties', items: ['One', 'Two'] },
    ]);
  });
});

describe('heroRoles', () => {
  it('is the first four overseas roles in the API order (newest first), and nothing without one', () => {
    const cards = roleCards(
      [
        opening({ slug: 'office-1', country: 'TR' }),
        ...['a', 'b', 'c', 'd', 'e'].map((s) => opening({ slug: `overseas-${s}` })),
      ],
      ctx,
    );
    expect(heroRoles(cards).map((c) => c.slug)).toEqual([
      'overseas-a',
      'overseas-b',
      'overseas-c',
      'overseas-d',
    ]);
    expect(heroRoles(cards.filter((c) => c.place === 'office'))).toEqual([]);
  });
});
