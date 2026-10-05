import { fireEvent, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { getCollection } from '@/content/collections';
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
      // S1.6: an r12 rectangle; M4: hidden ≤ 700 (Verify l. 371 overrides l. 274)
      expect(screen.getByRole('link', { name: s['verify.030'] })).toHaveClass(
        'rounded-[12px]',
        'max-md:hidden',
      );
      // S1.3: the id-shape placeholder; the answer is not part of the hero (S2.1)
      expect(screen.getByLabelText(s['verify.032'])).toHaveAttribute('placeholder', 'JA-REP-014');
      expect(screen.queryByTestId('verify-lookup-result')).toBeNull();
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
  it('Phase A, no founder row: the register frame without people — the feed badge, the views, the payroll head, the column bar and the one empty row; no stats, founder, list, former strip or verify.056 (W6/D23)', () => {
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
    // S3.3: the design's `internal` feed state — the true one
    expect(screen.getByTestId('verify-feed-badge')).toHaveTextContent(s['verify.220']);
    // S3.2: the frame — three views, Antalya selected (the design's default), the panel head
    const frame = screen.getByTestId('verify-register-frame');
    const views = within(frame)
      .getAllByRole('button')
      .filter((b) => b.hasAttribute('aria-pressed'));
    expect(views.map((b) => b.textContent)).toEqual([
      s['verify.270'],
      s['verify.227'],
      s['home.132'],
    ]);
    expect(views.map((b) => b.getAttribute('aria-pressed'))).toEqual(['false', 'true', 'false']);
    const panel = screen.getByTestId('verify-register-panel');
    expect(within(panel).getByRole('heading', { level: 3 })).toHaveTextContent(s['verify.227']);
    expect(panel).toHaveTextContent(s['verify.232']);
    expect(panel).toHaveTextContent(s['verify.066']);
    for (const id of ['verify.068', 'verify.069', 'verify.070', 'verify.071'])
      expect(panel).toHaveTextContent(s[id]);
    expect(within(panel).getByRole('link', { name: s['verify.067'] })).toHaveAttribute(
      'href',
      '#check',
    );
    // the one row: the empty-register copy and the office call — never a person
    const empty = within(panel).getByTestId('verify-empty');
    expect(empty).toHaveTextContent(en.sys.verify.empty.title);
    expect(within(empty).getByRole('link', { name: s['verify.051'] })).toHaveAttribute(
      'href',
      'tel:+905011240340',
    );
    expect(frame).toHaveTextContent(s['verify.064']);
    expect(frame).toHaveTextContent(s['verify.065']);
    for (const id of ['verify-stats', 'verify-founder', 'verify-register', 'verify-former'])
      expect(screen.queryByTestId(id)).toBeNull();
    expect(container).not.toHaveTextContent(s['verify.056']);
    // QA W221 V-06: the design's ≤ 700 `.ja-structure .ja-sec-head` is left-aligned (l. 293)
    const head = screen.getByRole('heading', { level: 2 }).parentElement!;
    expect(head).toHaveClass('text-center', 'max-md:text-left', 'max-md:mx-0', 'mx-auto');
    expect(container.querySelector('[data-placeholder]')).toBeNull();
    expect(screen.getByRole('link', { name: s['verify.076'] })).toHaveAttribute(
      'href',
      '/en/partner-with-us',
    );
    expect(collisionsInTree(container)).toEqual([]);
  });

  for (const locale of LOCALES) {
    it(`${locale}: the committed founder row (owner, 2026-10-05) renders the founder strip — photo, name, sole-signatory pill, "Authorised · no expiry", JA-REP-001 and "Open record"`, () => {
      const bundle = localBundle(locale);
      const s = bundle.strings;
      const founder = getCollection(bundle, 'founder').find((f) => f.published) ?? null;
      expect(founder?.name).toBe('Haris Jiva');
      const { container } = renderWithIntl(
        <Structure
          bundle={bundle}
          locale={locale}
          register={readRegister(bundle)}
          founder={founder}
          updatedLabel={null}
        />,
        { locale },
      );
      const strip = screen.getByTestId('verify-founder');
      expect(within(strip).getByRole('heading', { level: 3 })).toHaveTextContent('Haris Jiva');
      expect(within(strip).getByRole('img', { name: 'Haris Jiva' })).toBeInTheDocument();
      for (const id of ['verify.060', 'verify.061', 'verify.063', 'about.047'])
        expect(strip).toHaveTextContent(s[id]);
      expect(strip).toHaveTextContent('JA-REP-001');
      expect(within(strip).getByRole('button', { name: s['verify.062'] })).toHaveAttribute(
        'aria-haspopup',
        'dialog',
      );
      expect(strip.querySelector('[data-placeholder]')).toBeNull();
      // still no people: the panel's one row is the empty register
      expect(screen.getByTestId('verify-empty')).toBeInTheDocument();
      expect(collisionsInTree(container)).toEqual([]);
    });
  }

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
    expect(within(founder).getByRole('button', { name: s['verify.062'] })).toHaveAttribute(
      'aria-haspopup',
      'dialog',
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
        register={readRegister(bundle)}
        submitFraud={vi.fn(async () => IDLE_FORM_STATE)}
        uploadEvidence={vi.fn(async () => ({ ok: false, reason: 'door' }) as const)}
      />,
      { locale: 'tr' },
    );
    expect(container.querySelectorAll('#report')).toHaveLength(1);
    expect(container.querySelector('section#report')).not.toBeNull();
    // QA W221 V-07: the design numbers the sections — "01 · Our people" is verify.053's own text,
    // the report's "02" is its own span beside the eyebrow (Verify ll. 844–847)
    expect(screen.getByText(s['verify.077']).parentElement).toHaveTextContent(
      `02${s['verify.077']}`,
    );
    const flagsCard = screen.getByRole('heading', { name: s['verify.080'] }).parentElement!;
    const flags = flagsCard.querySelectorAll('li');
    expect(flags).toHaveLength(5);
    // S4.2: the flags card stretches to the report box's height
    expect(flagsCard.parentElement).toHaveClass('items-stretch');
    // M8: ≤ 700 flags 4–5 fold behind a real disclosure (verify.231 promises two)
    const more = within(flagsCard).getByRole('button', { name: s['verify.231'] });
    expect(more).toHaveAttribute('aria-expanded', 'false');
    expect(more).toHaveClass('md:hidden');
    expect(Array.from(flags).map((li) => li.classList.contains('max-md:hidden'))).toEqual([
      false,
      false,
      false,
      true,
      true,
    ]);
    fireEvent.click(more);
    expect(more).toHaveAttribute('aria-expanded', 'true');
    expect(more).toHaveTextContent(s['verify.230']);
    expect(Array.from(flags).some((li) => li.classList.contains('max-md:hidden'))).toBe(false);

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
    ]);
    // S4.1: the box's three items are the first three fields, numbered 1–3, placeholder-only
    for (const [n, name, id] of [
      [1, 'suspectName', 'verify.094'],
      [2, 'suspectContact', 'verify.095'],
      [3, 'description', 'verify.096'],
    ] as const) {
      const field = form.querySelector<HTMLElement>(`[name="${name}"]`)!;
      expect(field).toHaveAttribute('placeholder', s[id]);
      expect(field.closest('.flex-1')?.previousElementSibling).toHaveTextContent(String(n));
    }
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
    const submit = screen.getByRole('button', { name: tr.sys.verify.report.submit });
    expect(submit).toHaveAttribute('type', 'submit');
    expect(submit).toHaveClass('rounded-[12px]', 'bg-white');
    const wa = screen.getByRole('link', { name: s['verify.097'] });
    expect(wa).toHaveAttribute(
      'href',
      `https://wa.me/905011240340?text=${encodeURIComponent(s['verify.229'])}`,
    );
    // S4.3: the WhatsApp glyph; S1.6: r12 rectangles
    expect(wa.querySelector('svg')).not.toBeNull();
    expect(wa).toHaveClass('rounded-[12px]');
    expect(screen.getByRole('link', { name: s['verify.051'] })).toHaveAttribute(
      'href',
      'tel:+905011240340',
    );
    expect(collisionsInTree(container)).toEqual([]);
  });

  // W222 (2): red flag 2's body (verify.084, "The QR must open a record on this page — nothing
  // else counts") promises the same record lookup as V-01's FAQ q3 and steps 2–3; over the Phase A
  // empty register it reads `sys.verify.flags.qr` (the QR must open THIS PAGE; confirm the ID with
  // the office) and the package body returns with the rows.
  for (const locale of LOCALES) {
    it(`${locale}: red flag 2 reads the Phase A body over the empty register, the package body with rows`, () => {
      const bundle = localBundle(locale);
      const s = bundle.strings;
      const mount = (b: typeof bundle) =>
        renderWithIntl(
          <Report
            bundle={b}
            locale={locale}
            register={readRegister(b)}
            submitFraud={vi.fn(async () => IDLE_FORM_STATE)}
            uploadEvidence={vi.fn(async () => ({ ok: false, reason: 'door' }) as const)}
          />,
          { locale },
        );
      const { unmount } = mount(bundle);
      const flags = () =>
        screen
          .getByRole('heading', { name: s['verify.080'] })
          .parentElement!.querySelectorAll('li');
      expect(flags()[1]).toHaveTextContent(s['verify.083']!);
      expect(flags()[1]).toHaveTextContent(SYS[locale].verify.flags.qr);
      expect(flags()[1]).not.toHaveTextContent(s['verify.084']!);
      unmount();
      mount(localBundle(locale, { representatives: [FOUNDER_REP, OFFICE_REP] }));
      expect(flags()[1]).toHaveTextContent(s['verify.084']!);
      expect(flags()[1]).not.toHaveTextContent(SYS[locale].verify.flags.qr);
    });
  }
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
    // S5.1 / M10: phones only, as cards with the ⌄
    expect(container.querySelector('section')).toHaveClass('md:hidden');
    expect(container.querySelector('[data-variant="cards"]')).not.toBeNull();
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
