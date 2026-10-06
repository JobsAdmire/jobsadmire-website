import { cleanup, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithIntl } from '@/test/render';
import { blogPost, homeBundle, withCollections } from '../../__tests__/fixtures';
import { ContactStrip } from '../ContactStrip';
import { FaqSection } from '../FaqSection';
import { GuidesSection } from '../GuidesSection';
import { NetworkSection } from '../NetworkSection';
import { PortalSection } from '../PortalSection';
import { TeamSection } from '../TeamSection';
import { WorkWithUs } from '../WorkWithUs';

const TR = homeBundle('tr');
const EN = homeBundle('en');

describe('NetworkSection (W1/W10/W14)', () => {
  it('draws the build-time map and lists the 13 source countries twice (desktop chips, phone card)', () => {
    renderWithIntl(<NetworkSection locale="tr" bundle={TR} />);
    const network = screen.getByTestId('network');
    expect(
      within(network).getByRole('img', { name: "Kaynak ülkelerden Türkiye'ye" }),
    ).toBeInTheDocument();
    expect(network.querySelectorAll('[data-country]')).toHaveLength(14); // 13 + the TR marker
    expect(network.querySelectorAll('li[data-chip="desktop"]')).toHaveLength(13);
    expect(network.querySelectorAll('li[data-chip="phone"]')).toHaveLength(13);
    expect(within(network).getByText('13')).toBeInTheDocument(); // the `countries` metric
    // the design's chip order (`iso`, v4 l. 1571): Sri Lanka third
    const chips = [...network.querySelectorAll('li[data-chip="desktop"]')].map((li) =>
      li.textContent?.trim(),
    );
    expect(chips.slice(0, 4)).toEqual(['Pakistan', 'Hindistan', 'Sri Lanka', 'Nepal']);
  });

  it('"Report fraud" is the Verify page’s form; the partner CTA is a plain link; no Telegram (W226)', () => {
    renderWithIntl(<NetworkSection locale="tr" bundle={TR} />);
    expect(screen.getByRole('link', { name: TR.strings['home.126'] })).toHaveAttribute(
      'href',
      '/temsilci-dogrulama#report',
    );
    expect(screen.queryByRole('link', { name: TR.strings['home.202'] })).toBeNull();
    expect(screen.getByRole('link', { name: TR.strings['home.125'] })).toHaveAttribute(
      'href',
      '/ortak-olun',
    );
  });
});

describe('TeamSection (W86: the founder is published)', () => {
  it('renders the founder card (name and photo from the row), three minis hidden ≤ 460 px, three CTAs', () => {
    renderWithIntl(<TeamSection locale="tr" bundle={TR} />);
    const team = screen.getByTestId('team');
    expect(within(team).getByRole('heading', { level: 2 })).toHaveTextContent(
      TR.strings['home.127'],
    );
    const founder = screen.getByTestId('team-founder');
    expect(founder).toHaveTextContent('Haris Jiva');
    expect(founder).toHaveTextContent(TR.strings['home.129']);
    expect(within(founder).getByRole('img', { name: 'Haris Jiva' }).getAttribute('src')).toContain(
      encodeURIComponent('/team/haris-jiva.jpg'),
    );
    expect(founder.querySelector('.ja-glow')).not.toBeNull();
    const minis = team.querySelectorAll('[data-team-mini]');
    expect(minis).toHaveLength(3);
    for (const mini of minis) expect(mini).toHaveClass('max-xs:hidden');
    expect(team.querySelector('[data-sample-tag]')).toBeNull(); // nothing here is sample data
    const hrefs = within(team)
      .getAllByRole('link')
      .map((a) => a.getAttribute('href'));
    expect(hrefs).toEqual(['/temsilci-dogrulama', '/hakkimizda', '/kariyer']);
  });

  it('without a published founder row the minis carry the section', () => {
    const unpublished = withCollections(TR, {
      founder: [{ name: 'Ad Soyad', titleId: 'about.047', photoSrc: null, published: false }],
    });
    renderWithIntl(<TeamSection locale="tr" bundle={unpublished} />);
    expect(screen.getByTestId('team')).toBeInTheDocument();
    expect(screen.queryByTestId('team-founder')).toBeNull();
  });
});

describe('PortalSection (W8/W55/W227)', () => {
  it('both store badges, the iOS & Android platform line, named screen placeholders, hidden ≤ 460 px', () => {
    renderWithIntl(<PortalSection locale="en" bundle={EN} />, { locale: 'en' });
    const portal = screen.getByTestId('portal');
    expect(within(portal).getByRole('link', { name: /Google Play/ })).toHaveAttribute(
      'href',
      EN.settings.storeLinks.android ?? '',
    );
    expect(within(portal).getByRole('link', { name: /App Store/ })).toHaveAttribute(
      'href',
      EN.settings.storeLinks.ios ?? '',
    );
    expect(portal).toHaveTextContent('iOS & Android');
    expect(portal.querySelector('[data-placeholder="portal-shortlist"]')).not.toBeNull();
    expect(portal.querySelector('[data-placeholder="portal-mobile-app"]')).not.toBeNull();
    expect(portal.closest('section')).toHaveClass('max-xs:hidden');
  });
});

describe('WorkWithUs', () => {
  it('talks on WhatsApp with the visitor-voice partner prefill; the roles link to careers', () => {
    renderWithIntl(<WorkWithUs locale="tr" bundle={TR} />);
    const talk = screen.getByRole('link', { name: TR.strings['home.223'] });
    expect(decodeURIComponent(talk.getAttribute('href') ?? '')).toContain(
      'tedarik ortağı olmak istiyorum',
    );
    const careers = screen
      .getAllByRole('link')
      .filter((a) => a.getAttribute('href') === '/kariyer');
    expect(careers).toHaveLength(4); // three role rows + "See open roles"
    expect(screen.getByTestId('work-with-us').closest('section')).toHaveClass('max-xs:hidden');
  });
});

describe('GuidesSection (W248: real published posts only — no "yakında" cards)', () => {
  it('TR on the LOCAL bundle: no Turkish article yet, so the section is left out', () => {
    const { container } = renderWithIntl(<GuidesSection locale="tr" bundle={TR} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('EN: the one written article is the featured link, alone across the row (no list)', () => {
    renderWithIntl(<GuidesSection locale="en" bundle={EN} />, { locale: 'en' });
    const featured = screen.getByTestId('guide-featured');
    expect(featured.tagName).toBe('A');
    expect(featured.getAttribute('href')).toContain('turkey-work-permit-process-employer-guide');
    expect(featured).toHaveTextContent(EN.strings['home.178']);
    expect(featured.querySelector('[data-placeholder^="blog-cover-"]')).not.toBeNull();
    expect(screen.queryByTestId('guides-list')).toBeNull();
    expect(featured.parentElement?.className).not.toContain('lg:grid-cols-');
    expect(document.querySelector('[data-testid="guide-soon"]')).toBeNull();
  });

  it('the featured post leads, then newest first, every row a link; a cover photo fills the slot; nothing without rows', () => {
    const blog = Array.from({ length: 6 }, (_, i) =>
      blogPost(`guide-${i}`, `2026-0${i + 1}-10`, { tr: true, en: false }),
    );
    blog[1] = {
      ...blog[1],
      featured: true,
      cover: {
        url: 'https://operations.jobsadmire.com/api/website/v1/media/m1/1600.webp',
        width: 1600,
        height: 900,
      },
      coverAlt: { tr: 'Kapak', en: null },
    };
    renderWithIntl(<GuidesSection locale="tr" bundle={withCollections(TR, { blog })} />);
    const featured = screen.getByTestId('guide-featured');
    expect(featured.tagName).toBe('A');
    expect(featured).toHaveTextContent('guide-1 TR');
    expect(within(featured).getByRole('img', { name: 'Kapak' })).toBeInTheDocument();
    const rows = screen.getByTestId('guides-list').querySelectorAll('[data-guide-row]');
    expect([...rows].map((r) => r.getAttribute('data-guide-row'))).toEqual([
      'guide-5',
      'guide-4',
      'guide-3',
      'guide-2',
    ]);
    for (const r of rows) expect(r.tagName).toBe('A');
    expect(featured.parentElement?.className).toContain('lg:grid-cols-[1.15fr_0.85fr]');
    cleanup();
    const { container } = renderWithIntl(
      <GuidesSection locale="tr" bundle={withCollections(TR, { blog: [] })} />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});

describe('FaqSection', () => {
  it('six independent toggles, the FAQPage node, the legal answer verbatim, the WhatsApp ask link', () => {
    const { container } = renderWithIntl(<FaqSection locale="en" bundle={EN} />, {
      locale: 'en',
    });
    const faq = screen.getByTestId('faq');
    expect(within(faq).getAllByRole('heading', { level: 3 })).toHaveLength(6);
    expect(faq.querySelector('[data-variant="cards"]')).not.toBeNull();
    const jsonLd = [...container.querySelectorAll('script[type="application/ld+json"]')].map(
      (s) => s.textContent ?? '',
    );
    expect(jsonLd.some((text) => text.includes('"@type":"FAQPage"'))).toBe(true);
    expect(faq).toHaveTextContent(EN.strings['home.299']); // W142(a): verbatim
    expect(
      within(faq).getByRole('link', { name: EN.strings['home.183'] }).getAttribute('href'),
    ).toMatch(/^https:\/\/wa\.me\/905011240340\?text=/);
  });
});

describe('ContactStrip (page-local band)', () => {
  it('three doors under the copy: #proposal, WhatsApp (live dot) and call (tracked page_cta); no Telegram (W226)', () => {
    renderWithIntl(<ContactStrip locale="tr" bundle={TR} />);
    const band = screen.getByTestId('cta-band');
    expect(within(band).getByRole('heading', { level: 2 })).toHaveTextContent(
      TR.strings['home.184'],
    );
    const links = within(band).getAllByRole('link');
    const hrefs = links.map((a) => a.getAttribute('href'));
    expect(hrefs[0]).toBe('#proposal');
    expect(hrefs[1]).toMatch(/^https:\/\/wa\.me\/905011240340\?text=/);
    expect(hrefs).toHaveLength(3);
    expect(hrefs).not.toContain(TR.settings.telegramUrl);
    expect(hrefs[2]).toBe(`tel:${TR.settings.phone}`);
    expect(links[1].querySelector('.ja-live')).not.toBeNull();
    // ≤ 460 px: "Request workers" and WhatsApp as full-width rows, the call button hidden
    expect(links[0]).toHaveClass('max-xs:w-full');
    expect(links[1]).toHaveClass('max-xs:w-full');
    expect(links[2]).toHaveClass('max-xs:hidden');
  });
});
