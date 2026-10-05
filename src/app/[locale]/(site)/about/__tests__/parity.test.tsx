import { act, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { getOffice } from '@/content/collections';
import { testBundle } from '@/test/bundle';
import { renderWithIntl as render } from '@/test/render';
import { AboutOfficeCard } from '../_components/AboutOfficeCard';
import { CorridorLanes, laneNames } from '../_components/CorridorLanes';
import { GreenBand } from '../_components/GreenBand';

const NAMES = [
  'Pakistan',
  'Nepal',
  'Hindistan',
  'Özbekistan',
  'Kırgızistan',
  'Türkmenistan',
  'Filipinler',
  'Endonezya',
  'Rusya',
  'Mali',
  'Kamerun',
  'Senegal',
  'Bangladeş',
];

describe('CorridorLanes (design l. 556–594 + the 2.5 s laneOffset timer, l. 1077)', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('picks the lanes with the design formula: stride floor(n / 4), lane i = (off + stride·i) % n', () => {
    expect(laneNames(NAMES, 0)).toEqual(['Pakistan', 'Özbekistan', 'Filipinler', 'Mali']);
    expect(laneNames(NAMES, 1)).toEqual(['Nepal', 'Kırgızistan', 'Endonezya', 'Kamerun']);
    expect(laneNames(NAMES, 13)).toEqual(laneNames(NAMES, 0));
    expect(laneNames(['A', 'B'], 0)).toEqual(['A', 'B']);
    expect(laneNames([], 3)).toEqual([]);
  });

  it('hides the moving picture from assistive tech and lists every country statically instead', () => {
    const { container } = render(<CorridorLanes names={NAMES} />);
    expect(screen.getByTestId('about-lanes')).toHaveAttribute('aria-hidden', 'true');
    const list = container.querySelector('ul.sr-only');
    expect(list?.querySelectorAll('li')).toHaveLength(NAMES.length);
  });

  it('rotates every 2.5 s, and never under prefers-reduced-motion (WCAG 2.2.2, D20)', () => {
    vi.useFakeTimers();
    const lanes = () =>
      within(screen.getByTestId('about-lanes'))
        .getAllByRole('listitem', { hidden: true })
        .map((li) => li.textContent);
    const first = render(<CorridorLanes names={NAMES} />);
    expect(lanes()).toEqual(laneNames(NAMES, 0));
    act(() => vi.advanceTimersByTime(2500));
    expect(lanes()).toEqual(laneNames(NAMES, 1));
    first.unmount();

    vi.stubGlobal(
      'matchMedia',
      (query: string) =>
        ({
          matches: query.includes('reduce'),
          addEventListener: () => {},
          removeEventListener: () => {},
        }) as unknown as MediaQueryList,
    );
    render(<CorridorLanes names={NAMES} />);
    act(() => vi.advanceTimersByTime(10_000));
    expect(lanes()).toEqual(laneNames(NAMES, 0));
  });
});

const offices = [
  {
    key: 'karachi',
    kind: 'sourcing',
    cityId: 'o.city',
    labelId: 'o.label',
    addressId: 'o.addr',
    addressLine2Id: 'o.addr2',
    hoursId: 'o.hours',
    footerLabelId: 'o.foot',
    phone: '+905011240340',
    whatsapp: '905011240340',
    email: 'info@jobsadmire.com',
    hours: { tz: 'Asia/Karachi', days: [1, 2, 3, 4, 5, 6], open: '10:00', close: '19:00' },
    mapUrl: 'https://maps.google.com/?q=Karachi',
  },
];
const STRINGS: Record<string, string> = {
  'o.city': 'Karaçi',
  'o.addr': 'Shahrah-e-Faisal',
  'o.addr2': 'Karaçi, Pakistan',
  'about.101': 'TEMİN · PAKİSTAN',
  'about.105': 'Aday temini',
  'about.098': 'WhatsApp: +90 501 124 03 40 →',
  'home.192': 'Yol tarifi alın',
};
const t = (id: string) => STRINGS[id] ?? `?${id}`;

describe('AboutOfficeCard (SHARED 14.8, design l. 873–893)', () => {
  const office = getOffice(testBundle({ collections: { offices } }), 'karachi');

  it('carries the pill badge, the city heading, the one-line address and the chips', () => {
    render(
      <AboutOfficeCard
        office={office}
        t={t}
        badgeId="about.101"
        chipIds={['about.105']}
        photoAlt="Karaçi ofisi"
      />,
    );
    const card = screen.getByRole('article');
    expect(within(card).getByRole('heading', { level: 3, name: 'Karaçi' })).toBeInTheDocument();
    expect(card).toHaveTextContent('Shahrah-e-Faisal, Karaçi, Pakistan');
    expect(within(card).getAllByText('TEMİN · PAKİSTAN')).toHaveLength(2); // pill + phone caption
    expect(within(card).getByText('Aday temini')).toBeInTheDocument();
    expect(card.querySelector('[data-placeholder="karachi-office"]')).not.toBeNull();
  });

  it('has the design density: WhatsApp and e-mail lines, no phone row, and the directions link', () => {
    render(<AboutOfficeCard office={office} t={t} badgeId="about.101" chipIds={[]} photoAlt="x" />);
    const card = screen.getByRole('article');
    const wa = within(card).getByRole('link', { name: 'WhatsApp: +90 501 124 03 40 →' });
    expect(wa.getAttribute('href')).toMatch(/^https:\/\/wa\.me\/905011240340/);
    expect(wa).toHaveAttribute('target', '_blank');
    expect(card.querySelector('a[href="mailto:info@jobsadmire.com"]')).not.toBeNull();
    expect(card.querySelector('a[href^="tel:"]')).toBeNull();
    const dir = within(card).getByRole('link', { name: /Yol tarifi alın/ });
    expect(dir).toHaveAttribute('href', 'https://maps.google.com/?q=Karachi');
  });
});

describe('GreenBand (design l. 907–918)', () => {
  it('renders the title, the body, the white primary and the WhatsApp secondary as rectangles', () => {
    render(
      <GreenBand
        title="İş gücünüzü birlikte kuralım"
        body="İşverenler için ücretsiz danışmanlık"
        primary={{ label: 'İşçi talep edin →', href: '/contact' }}
        secondary={{ label: 'WhatsApp', href: 'https://wa.me/905011240340', external: true }}
      />,
    );
    expect(
      screen.getByRole('heading', { level: 2, name: 'İş gücünüzü birlikte kuralım' }),
    ).toBeInTheDocument();
    const primary = screen.getByRole('link', { name: 'İşçi talep edin →' });
    expect(primary.className).toMatch(/bg-white/);
    expect(primary.className).toMatch(/rounded-\[12px\]/);
    const wa = screen.getByRole('link', { name: 'WhatsApp' });
    expect(wa.className).toMatch(/max-md:hidden/);
  });
});
