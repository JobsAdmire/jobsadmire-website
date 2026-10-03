import { screen, within } from '@testing-library/react';
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

describe('TeamSection (W6/W86)', () => {
  it('renders nothing while the public register is empty', () => {
    const { container } = renderWithIntl(<TeamSection locale="tr" bundle={TR} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders once representatives has rows; the founder card only once the row is published', () => {
    const withReps = withCollections(TR, { representatives: [{ ref: 'JA-1001' }] });
    const first = renderWithIntl(<TeamSection locale="tr" bundle={withReps} />);
    expect(screen.getByTestId('team')).toBeInTheDocument();
    expect(screen.queryByTestId('team-founder')).toBeNull();
    first.unmount();
    renderWithIntl(
      <TeamSection
        locale="tr"
        bundle={withCollections(withReps, {
          founder: [{ name: 'Ad Soyad', titleId: 'about.047', photoSrc: null, published: true }],
        })}
      />,
    );
    const founder = screen.getByTestId('team-founder');
    expect(founder).toHaveTextContent('Ad Soyad');
    expect(founder.querySelector('[data-placeholder="founder-photo"]')).not.toBeNull();
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

describe('GuidesSection (W4)', () => {
  it('renders nothing below the six-Turkish-bodies threshold', () => {
    const { container } = renderWithIntl(<GuidesSection locale="tr" bundle={TR} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('once the blog is visible, the newest written article is the featured card', () => {
    const blog = Array.from({ length: 6 }, (_, i) =>
      blogPost(`guide-${i}`, `2026-0${i + 1}-10`, { tr: true, en: false }),
    );
    renderWithIntl(<GuidesSection locale="tr" bundle={withCollections(TR, { blog })} />);
    const guides = screen.getByTestId('guides');
    expect(within(guides).getAllByRole('heading', { level: 3 })[0]).toHaveTextContent('guide-5 TR');
    expect(
      within(guides).getAllByRole('link', { name: TR.strings['home.176'] })[0],
    ).toHaveAttribute('href', '/blog');
  });
});

describe('FaqSection', () => {
  it('six independent toggles, the FAQPage node, the legal answer verbatim, the WhatsApp ask link', () => {
    const { container } = renderWithIntl(<FaqSection locale="en" bundle={EN} />, {
      locale: 'en',
    });
    const faq = screen.getByTestId('faq');
    expect(within(faq).getAllByRole('heading', { level: 3 })).toHaveLength(6);
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

describe('ContactStrip (ClosingCtaBand)', () => {
  it('three doors: #proposal, WhatsApp and call (tracked page_cta); no Telegram (W226)', () => {
    renderWithIntl(<ContactStrip locale="tr" bundle={TR} />);
    const band = screen.getByTestId('cta-band');
    expect(within(band).getByRole('heading', { level: 2 })).toHaveTextContent(
      TR.strings['home.184'],
    );
    const hrefs = within(band)
      .getAllByRole('link')
      .map((a) => a.getAttribute('href'));
    expect(hrefs[0]).toBe('#proposal');
    expect(hrefs[1]).toMatch(/^https:\/\/wa\.me\/905011240340\?text=/);
    expect(hrefs).toHaveLength(3);
    expect(hrefs).not.toContain(TR.settings.telegramUrl);
    expect(hrefs).toContain(`tel:${TR.settings.phone}`);
  });
});
