import { screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { IDLE_FORM_STATE } from '@/forms/types';
import en from '@/messages/en.json';
import tr from '@/messages/tr.json';
import { collisionsInTree } from '@/test/class-collisions';
import { renderWithIntl } from '@/test/render';
import { localBundle } from '../../_lib/__tests__/bundles';
import {
  FORMER_REP,
  FOUNDER_REP,
  OFFICE_REP,
  PUBLISHED_FOUNDER,
} from '../../_lib/__tests__/fixtures';
import { readRegister } from '../../_lib/register';
import { Faq } from '../Faq';
import { Hero } from '../Hero';
import { Report } from '../Report';
import { Structure } from '../Structure';

// LookupCard declares the v1.1 record dialog through next/dynamic; never loaded here.
vi.mock('next/dynamic', () => ({ default: () => () => null }));

const SYS = { tr: tr.sys, en: en.sys } as const;
const LOCALES = ['tr', 'en'] as const;
const homeHref = (locale: 'tr' | 'en') => (locale === 'tr' ? '/' : '/en');

describe('Hero', () => {
  for (const locale of LOCALES) {
    it(`${locale}: one h1 holding the only LCP slot, this page’s crumbs (W109), the name-less lead (W86), three ticks, #check, three steps`, () => {
      const bundle = localBundle(locale);
      const s = bundle.strings;
      const { container } = renderWithIntl(
        <Hero
          bundle={bundle}
          locale={locale}
          register={readRegister(bundle)}
          founder={null}
          updatedLabel={null}
        />,
        { locale },
      );
      const h1 = screen.getByTestId('page-h1');
      expect(h1.tagName).toBe('H1');
      expect(h1).toHaveTextContent(`${s['verify.023']} ${s['verify.024']}`);
      expect(h1).toHaveAttribute('data-lcp-slot', 'h1');
      expect(container.querySelectorAll('[data-lcp-slot]')).toHaveLength(1);
      const crumbs = screen.getByRole('navigation', { name: SYS[locale].nav.breadcrumbs });
      expect(within(crumbs).getByRole('link', { name: s['verify.021'] })).toHaveAttribute(
        'href',
        homeHref(locale),
      );
      expect(within(crumbs).getByText(s['verify.006'])).toHaveAttribute('aria-current', 'page');
      const lead = screen.getByTestId('verify-lead');
      expect(lead).toHaveTextContent(SYS[locale].verify.hero.lead);
      expect(lead).not.toHaveTextContent(s['verify.025']);
      for (const id of ['verify.027', 'verify.028', 'verify.029'])
        expect(screen.getByText(s[id])).toBeInTheDocument();
      expect(screen.getByRole('link', { name: s['verify.030'] })).toHaveAttribute(
        'href',
        '#structure',
      );
      expect(container.querySelectorAll('#check')).toHaveLength(1);
      expect(screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual([
        s['verify.037'],
        s['verify.041'],
        s['verify.044'],
      ]);
      expect(container.querySelector('[data-placeholder]')).toBeNull();
      expect(collisionsInTree(container)).toEqual([]);
    });
  }

  it('§10 row 3: a published founder row switches the lead to verify.025 (desktop) / verify.026 (mobile)', () => {
    const bundle = localBundle('en');
    renderWithIntl(
      <Hero
        bundle={bundle}
        locale="en"
        register={readRegister(bundle)}
        founder={PUBLISHED_FOUNDER}
        updatedLabel={null}
      />,
      { locale: 'en' },
    );
    const lead = screen.getByTestId('verify-lead');
    expect(lead).toHaveTextContent(bundle.strings['verify.025']);
    expect(lead).toHaveTextContent(bundle.strings['verify.026']);
    expect(lead).not.toHaveTextContent(en.sys.verify.hero.lead);
  });
});

describe('Structure', () => {
  it('Phase A: the designed empty state — no stats, founder, register, former strip or verify.056 (W6/W86)', () => {
    const bundle = localBundle('en');
    const s = bundle.strings;
    const { container } = renderWithIntl(
      <Structure
        bundle={bundle}
        locale="en"
        register={readRegister(bundle)}
        founder={null}
        updatedLabel={null}
      />,
      { locale: 'en' },
    );
    expect(container.querySelector('section#structure')).not.toBeNull();
    const empty = screen.getByTestId('verify-empty');
    expect(empty).toHaveAttribute('role', 'status');
    expect(empty).toHaveTextContent(en.sys.verify.empty.title);
    expect(within(empty).getByRole('link', { name: s['verify.051'] })).toHaveAttribute(
      'href',
      'tel:+905011240340',
    );
    for (const id of ['verify-stats', 'verify-founder', 'verify-register', 'verify-former'])
      expect(screen.queryByTestId(id)).toBeNull();
    expect(container).not.toHaveTextContent(s['verify.056']);
    expect(container.querySelector('[data-placeholder]')).toBeNull();
    expect(screen.getByRole('link', { name: s['verify.076'] })).toHaveAttribute(
      'href',
      '/en/partner-with-us',
    );
    expect(collisionsInTree(container)).toEqual([]);
  });

  it('v1.1 rows + a published founder: stats, the founder id and record link, the list, the former strip, verify.056', () => {
    const bundle = localBundle('en', { representatives: [FOUNDER_REP, OFFICE_REP, FORMER_REP] });
    const s = bundle.strings;
    const { container } = renderWithIntl(
      <Structure
        bundle={bundle}
        locale="en"
        register={readRegister(bundle)}
        founder={PUBLISHED_FOUNDER}
        updatedLabel="Register last updated: 29 July 2026"
      />,
      { locale: 'en' },
    );
    expect(screen.queryByTestId('verify-empty')).toBeNull();
    expect(screen.getByTestId('verify-stats')).toHaveTextContent(
      'Register last updated: 29 July 2026',
    );
    const founder = screen.getByTestId('verify-founder');
    expect(founder).toHaveTextContent('Founder Example');
    expect(founder).toHaveTextContent(s['about.047']);
    expect(founder).toHaveTextContent('JA-REP-001');
    expect(within(founder).getByRole('link', { name: s['verify.062'] })).toHaveAttribute(
      'href',
      '/en/verify?id=JA-REP-001',
    );
    expect(founder.querySelector('[data-placeholder="founder-photo"]')).not.toBeNull();
    // the header row + the two active people
    expect(within(screen.getByTestId('verify-register')).getAllByRole('row')).toHaveLength(3);
    expect(screen.getByTestId('verify-former')).toHaveTextContent('Former Example · JA-REP-018');
    expect(container).toHaveTextContent(s['verify.056']);
    expect(collisionsInTree(container)).toEqual([]);
  });
});

describe('Report', () => {
  it('tr: #report, five flags, the fraud form on the catalog names with the package labels (W115), the unnamed evidence input, the two doors', () => {
    const bundle = localBundle('tr');
    const s = bundle.strings;
    const { container } = renderWithIntl(
      <Report
        bundle={bundle}
        locale="tr"
        submitFraud={vi.fn(async () => IDLE_FORM_STATE)}
        uploadEvidence={vi.fn(async () => ({ ok: false, reason: 'door' }) as const)}
      />,
      { locale: 'tr' },
    );
    expect(container.querySelectorAll('#report')).toHaveLength(1);
    expect(container.querySelector('section#report')).not.toBeNull();
    const flagsCard = screen.getByRole('heading', { name: s['verify.080'] }).parentElement;
    expect(flagsCard?.querySelectorAll('li')).toHaveLength(5);

    const form = screen.getByTestId('fraud-form');
    expect(form).toHaveAttribute('data-form-key', 'fraud');
    const named = Array.from(
      form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input[name], textarea[name]'),
    )
      .map((el) => el.name)
      .filter((n) => n !== 'honeypot' && n !== 'consent');
    expect(named).toEqual([
      'suspectName',
      'suspectContact',
      'description',
      'reporterName',
      'reporterEmail',
      'reporterPhone',
    ]);
    const labelOf = (name: string) =>
      form.querySelector<HTMLInputElement>(`[name="${name}"]`)?.labels?.[0]?.textContent ?? '';
    expect(labelOf('suspectName')).toContain(s['verify.094']);
    expect(labelOf('suspectContact')).toContain(s['verify.095']);
    expect(labelOf('description')).toContain(s['verify.096']);
    expect(labelOf('reporterName')).toContain(tr.sys.form.labels.reporterName);
    expect(labelOf('reporterEmail')).toContain(tr.sys.form.labels.reporterEmail);
    const description = form.querySelector('textarea[name="description"]');
    expect(description).toHaveAttribute('minlength', '20');
    expect(description).toHaveAttribute('maxlength', '5000');
    const evidence = screen.getByLabelText(tr.sys.form.labels.evidence);
    expect(evidence).toHaveAttribute('type', 'file');
    expect(evidence).not.toHaveAttribute('name');
    expect(form.querySelector('#f-fraud-consent')).not.toBeNull();
    expect(screen.getByRole('button', { name: tr.sys.verify.report.submit })).toHaveAttribute(
      'type',
      'submit',
    );
    expect(screen.getByRole('link', { name: s['verify.097'] })).toHaveAttribute(
      'href',
      `https://wa.me/905011240340?text=${encodeURIComponent(s['verify.229'])}`,
    );
    expect(screen.getByRole('link', { name: s['verify.051'] })).toHaveAttribute(
      'href',
      'tel:+905011240340',
    );
    expect(collisionsInTree(container)).toEqual([]);
  });
});

describe('Faq', () => {
  const faqNode = (container: HTMLElement) =>
    Array.from(container.querySelectorAll('script[type="application/ld+json"]'))
      .map(
        (el) =>
          JSON.parse(el.textContent ?? '{}') as {
            '@type'?: string;
            mainEntity?: { name: string; acceptedAnswer: { text: string } }[];
          },
      )
      .filter((n) => n['@type'] === 'FAQPage');

  it('four pairs in the DOM and one FAQPage node (V-4); the "who signs" answer is name-less while the founder is unpublished (§10 row 3)', () => {
    const bundle = localBundle('en');
    const s = bundle.strings;
    const { container } = renderWithIntl(
      <Faq bundle={bundle} locale="en" founder={null} register={readRegister(bundle)} />,
      { locale: 'en' },
    );
    expect(container.querySelectorAll('#faq')).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(s['verify.100']);
    for (const id of ['verify.101', 'verify.103', 'verify.105', 'verify.107'])
      expect(screen.getByRole('button', { name: s[id] })).toBeInTheDocument();
    const faq = faqNode(container);
    expect(faq).toHaveLength(1);
    expect(faq[0].mainEntity?.map((q) => q.name)).toEqual([
      s['verify.101'],
      s['verify.103'],
      s['verify.105'],
      s['verify.107'],
    ]);
    expect(faq[0].mainEntity?.[1].acceptedAnswer.text).toBe(en.sys.verify.faq.whoSigns);
    expect(container).not.toHaveTextContent(s['verify.104']);
    // QA W220 V-01: verify.106 promises "the page shows the person's official record"; over the
    // Phase A empty register the lookup answers "not published yet", so q3 — DOM and the FAQPage
    // node alike (V-4) — reads the Phase A answer until `representatives` has published rows.
    expect(faq[0].mainEntity?.[2].acceptedAnswer.text).toBe(en.sys.verify.faq.howToCheck);
    expect(container).not.toHaveTextContent(s['verify.106']);
    expect(collisionsInTree(container)).toEqual([]);
  });

  it('a published founder row answers with verify.104', () => {
    const bundle = localBundle('en');
    const { container } = renderWithIntl(
      <Faq
        bundle={bundle}
        locale="en"
        founder={PUBLISHED_FOUNDER}
        register={readRegister(bundle)}
      />,
      { locale: 'en' },
    );
    expect(faqNode(container)[0].mainEntity?.[1].acceptedAnswer.text).toBe(
      bundle.strings['verify.104'],
    );
  });

  it('published register rows bring the package answer verify.106 back (V-01)', () => {
    const bundle = localBundle('en', { representatives: [FOUNDER_REP, OFFICE_REP] });
    const { container } = renderWithIntl(
      <Faq
        bundle={bundle}
        locale="en"
        founder={PUBLISHED_FOUNDER}
        register={readRegister(bundle)}
      />,
      { locale: 'en' },
    );
    expect(faqNode(container)[0].mainEntity?.[2].acceptedAnswer.text).toBe(
      bundle.strings['verify.106'],
    );
    expect(container).not.toHaveTextContent(en.sys.verify.faq.howToCheck);
  });
});

describe('Hero steps (QA W220 V-01)', () => {
  for (const locale of LOCALES) {
    it(`${locale}: over the empty register, steps 2–3 read the Phase A bodies, never the record promise`, () => {
      const bundle = localBundle(locale);
      const s = bundle.strings;
      renderWithIntl(
        <Hero
          bundle={bundle}
          locale={locale}
          register={readRegister(bundle)}
          founder={null}
          updatedLabel={null}
        />,
        { locale },
      );
      const steps = screen
        .getAllByRole('heading', { level: 3 })
        .map((h) => h.parentElement!.parentElement!);
      expect(steps).toHaveLength(3);
      // step 1 (the badge rule) is the package's own composition at every register state
      expect(steps[0]).toHaveTextContent(
        `${s['verify.038']} ${s['verify.039']} ${s['verify.040']}`,
      );
      expect(steps[1]).toHaveTextContent(SYS[locale].verify.steps.qr);
      expect(steps[1]).not.toHaveTextContent(s['verify.042']);
      expect(steps[2]).toHaveTextContent(SYS[locale].verify.steps.match);
      expect(steps[2]).not.toHaveTextContent(s['verify.047']);
    });
  }

  it('published rows restore the package steps — lead, bold, tail (W23)', () => {
    const bundle = localBundle('en', { representatives: [FOUNDER_REP, OFFICE_REP] });
    const s = bundle.strings;
    renderWithIntl(
      <Hero
        bundle={bundle}
        locale="en"
        register={readRegister(bundle)}
        founder={PUBLISHED_FOUNDER}
        updatedLabel="Register last updated: 29 July 2026"
      />,
      { locale: 'en' },
    );
    const steps = screen
      .getAllByRole('heading', { level: 3 })
      .map((h) => h.parentElement!.parentElement!);
    expect(steps[1]).toHaveTextContent(`${s['verify.042']} ${s['verify.043']}${s['verify.234']}`);
    expect(steps[2]).toHaveTextContent(`${s['verify.045']} ${s['verify.046']} ${s['verify.047']}`);
    expect(steps[1]).not.toHaveTextContent(en.sys.verify.steps.qr);
  });

  it('tr: the composed step 2 reads as one sentence after the verify.042/043 override (W220 V-02)', () => {
    const bundle = localBundle('tr', { representatives: [FOUNDER_REP, OFFICE_REP] });
    renderWithIntl(
      <Hero
        bundle={bundle}
        locale="tr"
        register={readRegister(bundle)}
        founder={PUBLISHED_FOUNDER}
        updatedLabel="Kayıt defteri son güncelleme: 29 Temmuz 2026"
      />,
      { locale: 'tr' },
    );
    const step2 = screen.getAllByRole('heading', { level: 3 })[1].parentElement!.parentElement!;
    expect(step2.querySelector('p')?.textContent).toMatch(
      /^İkisi de bir kayıt açmalıdır: bu sayfada\. QR kodu/,
    );
  });
});
