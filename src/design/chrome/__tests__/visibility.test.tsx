import { describe, expect, it } from 'vitest';
import { SiteChrome } from '../SiteChrome';
import { StickyCtaBar } from '../StickyCtaBar';
import { getCollection, getOffice } from '@/content/collections';
import {
  Breadcrumbs,
  ClosingCtaBand,
  ContactCta,
  EmptyState,
  FaqBlock,
  ImageSlot,
  LogoMarquee,
  MetricStrip,
  NewsletterBand,
  OfficeCard,
  PostCard,
  ProcessSteps,
  StoreBadges,
} from '@/design/blocks';
import { BLOCK_STRINGS, testBundle } from '@/test/bundle';
import { renderWithIntl } from '@/test/render';
import trBundle from '@/content/local/bundle.tr.json';
import { BundleSchema, type Bundle } from '../../../../contract/website-bundle.v1';

// R13: a parsed bundle, never a cast — the real generated TR bundle, like the sibling
// Header/Footer/SlimBar suites, so the sweep below walks the whole real chrome tree (nav
// groups, portal pill, accent, footer accordion copy) rather than a minimal fixture.
const bundle: Bundle = BundleSchema.parse(trBundle);

const DISPLAY_UTILITIES = new Set([
  'inline-flex',
  'flex',
  'inline-block',
  'block',
  'grid',
  'inline-grid',
  'inline',
  'table',
  'contents',
  // W122 (Task 5 addition): the display utilities W119's original list missed.
  'inline-table',
  'flow-root',
  'list-item',
  'table-row',
  'table-cell',
]);

/** W119: a bare `hidden` must never appear beside a bare (unprefixed) display utility in one
 *  class list — not because `hidden` reliably loses that tie. In this build's generated CSS
 *  today, a bare `hidden` actually beats `block`/`flex`/`grid` by alphabetical accident (the
 *  element does hide) and loses to `inline-flex` (it does not); leaving the outcome to depend on
 *  any one pairing's accident of order is exactly what W119 replaces with a media-variant
 *  utility instead (`max-xl:hidden`, which sorts after the base utility on purpose), so this
 *  guard bans the bare pairing outright — the accident can never decide which way a future
 *  combination breaks. Token equality (not substring/regex matching) is exactly what "carries a
 *  variant" needs: `max-xl:hidden` and `xl:inline-flex` are different literal tokens from
 *  `hidden`/`inline-flex`, so they never trip this check. */
function hasUnguardedHidden(className: string): boolean {
  const tokens = className.split(/\s+/).filter(Boolean);
  return tokens.includes('hidden') && tokens.some((tok) => DISPLAY_UTILITIES.has(tok));
}

// SVG elements expose `.className` as an SVGAnimatedString, not a string (the chrome's inline
// icons are all `aria-hidden` SVGs) — `getAttribute('class')` is the one accessor that returns
// a plain string for both HTML and SVG elements alike.
function classNamesOf(container: HTMLElement): string[] {
  return Array.from(container.querySelectorAll('*'))
    .map((el) => el.getAttribute('class'))
    .filter((c): c is string => Boolean(c));
}

describe('hasUnguardedHidden — the checker the render sweep below uses', () => {
  it('flags a bare `hidden` beside an unprefixed display utility (the pre-fix secondary CTA class)', () => {
    expect(
      hasUnguardedHidden('inline-flex items-center hidden whitespace-nowrap xl:inline-flex'),
    ).toBe(true);
  });

  it('accepts a media-variant `max-xl:hidden` beside the same base `inline-flex` (the fix)', () => {
    expect(hasUnguardedHidden('inline-flex items-center max-xl:hidden whitespace-nowrap')).toBe(
      false,
    );
  });
});

describe('no chrome element pairs a bare `hidden` with an unprefixed display utility (W119)', () => {
  it.each(['default', 'minimal'] as const)('variant="%s"', (variant) => {
    const { container } = renderWithIntl(
      <SiteChrome locale="tr" bundle={bundle} variant={variant}>
        <div>content</div>
      </SiteChrome>,
    );
    const offenders = classNamesOf(container).filter(hasUnguardedHidden);
    expect(offenders).toEqual([]);
  });
});

// W122 addition (Task 5): the blocks folder has no ambient sweep like SiteChrome's, so this
// builds one fixture bundle covering every collection a block reads (metrics/offices/blog)
// and renders every block — every tone/variant/branch that composes a class string — once,
// then runs the same token check over the combined DOM.
const metricsRows = [
  { key: 'placed', value: 470, text: null, suffix: '+', labelId: 'v.m1', unitId: null },
  { key: 'countries', value: 13, text: null, suffix: '', labelId: 'v.m2', unitId: null },
];
const officeRows = [
  {
    key: 'antalya',
    kind: 'hq',
    cityId: 'v.city',
    labelId: 'v.label',
    addressId: 'v.addr',
    addressLine2Id: 'v.addr2',
    hoursId: 'v.hours',
    footerLabelId: 'v.foot',
    phone: '+905011240340',
    whatsapp: '905011240340',
    email: 'info@jobsadmire.com',
    hours: { tz: 'Europe/Istanbul', days: [1, 2, 3, 4, 5], open: '09:00', close: '18:00' },
    mapUrl: 'https://maps.google.com/?q=Antalya',
  },
];
const blogRows = [
  {
    key: 'v-post',
    slug: { tr: 'v-yazi', en: 'v-post' },
    title: { tr: 'Başlık', en: 'Title' },
    excerpt: { tr: 'Özet.', en: 'Excerpt.' },
    category: 'workPermits' as const,
    categoryLabelId: 'v.cat',
    author: 'JobsAdmire Editorial',
    publishedAt: '2026-01-12',
    readMinutes: 5,
    hasBody: { tr: true, en: true },
    body: { tr: '# Gövde', en: '# Body' },
  },
];
const blocksBundle = testBundle({
  strings: {
    ...BLOCK_STRINGS,
    'v.m1': 'işe yerleştirilen çalışan',
    'v.m2': 'ülke',
    'v.city': 'Antalya, Türkiye',
    'v.label': 'Merkez ofis',
    'v.addr': 'Adnan Menderes Blv. 7/6',
    'v.addr2': 'Muratpaşa, Antalya',
    'v.hours': 'Pzt–Cum · 09:00–18:00 (TRT)',
    'v.foot': 'Antalya · Merkez ofis',
    'v.cat': 'İş izinleri',
    'v.title': 'Başlık',
    'v.body': 'Gövde metni.',
    'v.askT': 'Sorunuz mu var?',
    'v.askB': 'Ekibimize yazın.',
    'v.wa': "WhatsApp'tan sorun",
    'v.call': 'Bizi arayın',
    'v.mail': 'E-posta gönderin',
  },
  collections: { metrics: metricsRows, offices: officeRows, blog: blogRows },
});
const office = getOffice(blocksBundle, 'antalya');
const post = getCollection(blocksBundle, 'blog')[0];

describe('no shared block pairs a bare `hidden` with an unprefixed display utility (W122 addition, Task 5)', () => {
  it('every block, every tone/variant branch', () => {
    // StickyCtaBar renders nothing until scrolled past `showAfterPx` (700). A fresh client render
    // reads `window.scrollY` straight away, so set it first (its own test's mock), then reset.
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 800 });
    const { container } = renderWithIntl(
      <>
        <StickyCtaBar
          message="Talep"
          live
          ctas={[
            { label: 'Talep et', href: '/hire-workers' },
            { label: 'Ara', href: 'tel:+905011240340', variant: 'secondary' },
          ]}
        />
        <ContactCta placement="page_cta" href="https://wa.me/905011240340" external>
          WhatsApp
        </ContactCta>
        <ContactCta
          placement="page_cta"
          href={{ pathname: '/hire-workers', hash: '#request-form' }}
        >
          Object href
        </ContactCta>
        <FaqBlock
          bundle={blocksBundle}
          locale="tr"
          items={[{ id: 'q1', q: 'Soru?', a: 'Cevap.' }]}
          eyebrowId="v.title"
          headingId="v.title"
          bodyId="v.body"
          askCard={{
            titleId: 'v.askT',
            bodyId: 'v.askB',
            whatsappNumber: '905011240340',
            whatsappText: 'Merhaba',
            whatsappLabelId: 'v.wa',
            phone: '+905011240340',
            callLabelId: 'v.call',
            email: 'info@jobsadmire.com',
            emailLabelId: 'v.mail',
          }}
        />
        <Breadcrumbs locale="tr" items={[{ name: 'Ana sayfa', href: '/' }]} tone="light" />
        <Breadcrumbs locale="tr" items={[{ name: 'Ana sayfa', href: '/' }]} tone="dark" />
        <ClosingCtaBand
          bundle={blocksBundle}
          locale="tr"
          titleId="v.title"
          bodyId="v.body"
          primary={{ label: 'Talep', href: '/hire-workers' }}
          secondary={{ label: 'WhatsApp', href: 'https://wa.me/905011240340', external: true }}
          extra={[{ label: 'Ara', href: 'tel:+905011240340' }]}
          ticks={['Tik 1', 'Tik 2']}
          tone="navy"
        />
        <ClosingCtaBand
          bundle={blocksBundle}
          locale="tr"
          titleId="v.title"
          bodyId="v.body"
          primary={{ label: 'Talep', href: '/hire-workers' }}
          secondary={{ label: 'WhatsApp', href: 'https://wa.me/905011240340', external: true }}
          ticks={['Tik 1']}
          tone="green"
        />
        <ClosingCtaBand
          bundle={blocksBundle}
          locale="tr"
          titleId="v.title"
          bodyId="v.body"
          primary={{ label: 'Talep', href: '/hire-workers' }}
          extra={[{ label: 'Ara', href: 'tel:+905011240340' }]}
          ticks={['Tik 1']}
          tone="gradient"
        />
        <ProcessSteps
          bundle={blocksBundle}
          locale="tr"
          steps={[{ n: 1, titleId: 'v.title', bodyId: 'v.body', when: 'Şimdi' }]}
          variant="cards"
        />
        <ProcessSteps
          bundle={blocksBundle}
          locale="tr"
          steps={[{ n: 1, titleId: 'v.title', bodyId: 'v.body' }]}
          variant="plain"
        />
        <MetricStrip
          bundle={blocksBundle}
          locale="tr"
          metrics={['placed', 'countries']}
          tone="light"
        />
        <MetricStrip
          bundle={blocksBundle}
          locale="tr"
          metrics={['placed', 'countries']}
          tone="dark"
        />
        <OfficeCard bundle={blocksBundle} locale="tr" office={office} />
        <ImageSlot slot="v-empty" alt="Alt text" width={4} height={3} />
        <ImageSlot slot="v-lcp" lcp alt="" width={4} height={3} />
        <ImageSlot slot="v-photo" src="/brand/ja-mark.png" alt="Foto" width={4} height={3} />
        <EmptyState
          title="Boş"
          body="Gövde."
          cta={{ label: 'Ara', href: 'tel:+905011240340' }}
          tone="light"
        />
        <EmptyState
          title="Boş"
          body="Gövde."
          tone="pale"
          cta={{ label: 'Yaz', href: 'https://wa.me/905011240340', external: true }}
        />
        <EmptyState
          title="Boş"
          tone="dark"
          cta={{ label: 'Aç', href: { pathname: '/hire-workers', hash: '#request-form' } }}
        />
        <PostCard bundle={blocksBundle} locale="tr" post={post} variant="card" />
        <PostCard bundle={blocksBundle} locale="tr" post={post} variant="row" />
        <PostCard
          bundle={blocksBundle}
          locale="tr"
          post={post}
          variant="featured"
          headingLevel={2}
        />
        <NewsletterBand bundle={blocksBundle} locale="tr" active id="v-newsletter">
          <span>form</span>
        </NewsletterBand>
        <StoreBadges
          bundle={blocksBundle}
          locale="tr"
          android="https://play.google.com/x"
          ios="https://apps.apple.com/x"
        />
        <LogoMarquee
          logos={[{ src: '/brand/ja-mark.png', alt: 'JobsAdmire', width: 88, height: 88 }]}
        />
      </>,
    );
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 });
    // M5: the branches this sweep must actually reach, so a green run is never a vacuous one —
    // the scrolled StickyCtaBar, the gradient band, the pale EmptyState, ImageSlot's photo and
    // the green band's inverse-dark face.
    const classes = classNamesOf(container).map((c) => c.split(/\s+/));
    expect(container.querySelector('[data-testid="sticky-cta"]')).not.toBeNull();
    expect(classes.some((c) => c.includes('from-ink'))).toBe(true);
    expect(container.querySelector('[role="status"].bg-pale-1')).not.toBeNull();
    expect(container.querySelector('img[alt="Foto"]')).not.toBeNull();
    expect(classes.some((c) => c.includes('bg-black/15'))).toBe(true);
    const offenders = classNamesOf(container).filter(hasUnguardedHidden);
    expect(offenders).toEqual([]);
  });
});
