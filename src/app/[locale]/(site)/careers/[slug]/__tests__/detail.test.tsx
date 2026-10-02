import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { makeTf } from '@/content/pure';
import type { FormActionState } from '@/forms/types';
import en from '@/messages/en.json';
import { testBundle } from '@/test/bundle';
import { OPENING, opening } from '@/test/careers';
import { renderWithIntl } from '@/test/render';
import type { PublicOpening } from '@/lib/careers-pure';
import { openingView, type OpeningViewCopy } from '../_lib/view';
import { AboutRole } from '../_sections/AboutRole';
import { ApplySection } from '../_sections/ApplySection';
import { DetailHero } from '../_sections/DetailHero';

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
const COPY: OpeningViewCopy = {
  engagement: { fullTime: t('jt.099'), partTime: t('jt.100'), project: t('jt.073') },
  workMode: SYS.workMode,
  posted: (date) => SYS.roles.posted.replace('{date}', date),
  salary: {
    range: (min, max) => SYS.salary.range.replace('{min}', min).replace('{max}', max),
    from: (amount) => SYS.salary.from.replace('{amount}', amount),
    upTo: (amount) => SYS.salary.upTo.replace('{amount}', amount),
    per: (period) => SYS.salary.per[period],
  },
  askIntro: t('jt.311'),
  askTail: t('jt.312'),
};
const view = (o: PublicOpening = OPENING) =>
  openingView(o, {
    locale: 'en',
    countries: [
      { code: 'UZ', name: 'Uzbekistan' },
      { code: 'PK', name: 'Pakistan' },
      { code: 'TR', name: 'Türkiye' },
    ],
    copy: COPY,
    whatsappNumber: '905011240340',
    now: new Date('2026-09-20T00:00:00Z'),
  });
const SETTINGS = {
  whatsappNumber: '905011240340',
  careersEmail: 'careers@jobsadmire.com',
  phone: '+905011240340',
  phoneDisplay: '+90 501 124 03 40',
  turnstileSiteKey: null,
};
const action = vi.fn(async (): Promise<FormActionState> => ({ status: 'idle' }));
const renderApply = (o: PublicOpening = OPENING) =>
  renderWithIntl(
    <ApplySection
      t={t}
      locale="en"
      opening={o}
      view={view(o)}
      settings={SETTINGS}
      action={action}
    />,
    { locale: 'en' },
  );

describe('ApplySection', () => {
  it('an ordinary opening: the careers form — hidden slug, locked country, CV, the v1.1 portfolio link, no salary field', () => {
    const { container } = renderApply();
    const form = screen.getByTestId('careers-apply-form');
    expect(form).toHaveAttribute('data-form-key', 'careers');
    expect(form.querySelector<HTMLInputElement>('input[name="openingSlug"]')?.value).toBe(
      OPENING.slug,
    );
    const country = form.querySelector<HTMLSelectElement>('select[name="country"]')!;
    // W205 ⚠️3: the locked residency select carries its one option alone — no empty placeholder
    expect([...country.options].map((o) => o.value)).toEqual(['UZ']);
    expect(country.value).toBe('UZ');
    expect(
      screen.getByText(SYS.form.residency.replace('{country}', 'Uzbekistan')),
    ).toBeInTheDocument();
    expect(form.querySelector('input[name="expectedSalary"]')).toBeNull();
    expect(form.querySelector('input[name="cv"]')).toHaveAttribute(
      'accept',
      'application/pdf,.pdf',
    );
    expect(form.querySelector('input[name="portfolioUrl"]')).not.toBeNull();
    expect(form.querySelector('input[name="linkedinUrl"]')).not.toBeNull();
    expect(within(form).getByRole('checkbox')).toHaveAttribute('name', 'consent');
    expect(within(form).getByRole('button', { name: t('jt.103') })).toHaveAttribute(
      'type',
      'submit',
    );
    expect(screen.queryByTestId('careers-email-apply')).toBeNull();
    expect(container.querySelector('a[href*="operations.jobsadmire.com"]')).toBeNull();
  });

  it('a Pakistan opening asks for the expected salary, quoted in the opening currency', () => {
    renderApply(
      opening({ slug: 'sourcing-coordinator-pakistan', country: 'PK', payCurrency: 'PKR' }),
    );
    const salary = screen
      .getByTestId('careers-apply-form')
      .querySelector('input[name="expectedSalary"]');
    expect(salary).toHaveAttribute('aria-required', 'true');
    expect(salary).toHaveAttribute('inputmode', 'numeric');
    expect(
      screen.getByText(SYS.form.expectedSalaryHint.replace('{currency}', 'PKR')),
    ).toBeInTheDocument();
  });

  it('a portfolio opening applies by e-mail — no form (W56)', () => {
    renderApply(
      opening({
        slug: 'content-seo-specialist-antalya',
        title: 'Content & SEO Specialist',
        country: 'TR',
        portfolioRequired: true,
      }),
    );
    expect(screen.queryByTestId('careers-apply-form')).toBeNull();
    const panel = screen.getByTestId('careers-email-apply');
    const subject = SYS.emailPanel.subject.replace('{title}', 'Content & SEO Specialist');
    expect(within(panel).getByRole('link', { name: SYS.emailPanel.email })).toHaveAttribute(
      'href',
      `mailto:careers@jobsadmire.com?subject=${encodeURIComponent(subject)}`,
    );
    expect(
      within(panel)
        .getByRole('link', { name: t('jt.117') })
        .getAttribute('href'),
    ).toMatch(/^https:\/\/wa\.me\/905011240340\?text=/);
    expect(panel).toHaveTextContent('careers@jobsadmire.com');
  });
});

describe('DetailHero and AboutRole', () => {
  it('the hero: the title as the tagged h1 and only LCP slot, a three-item trail, the pay line, the two CTAs', () => {
    const { container } = renderWithIntl(
      <DetailHero t={t} locale="en" opening={OPENING} view={view()} />,
      { locale: 'en' },
    );
    expect(screen.getByTestId('page-h1')).toHaveTextContent('Country Representative — Uzbekistan');
    expect(screen.getByTestId('page-h1')).toHaveClass('break-words'); // W205: long Operations titles wrap
    expect(container.querySelectorAll('[data-lcp-slot]')).toHaveLength(1);
    const trail = screen.getByRole('navigation', { name: en.sys.nav.breadcrumbs });
    expect(within(trail).getAllByRole('listitem')).toHaveLength(3);
    expect(screen.getByTestId('careers-pay')).toHaveTextContent('$800 – $1,200 · per month');
    expect(screen.getByRole('link', { name: t('jt.053') }).getAttribute('href')).toBe(
      view().askHref,
    );
    expect(screen.getByRole('link', { name: t('jt.052') })).toHaveAttribute('href', '#apply');
  });

  it('about the role: the description as text blocks, the facts, the way back', () => {
    renderWithIntl(<AboutRole opening={OPENING} view={view()} engagementLabel={t('jt.049')} />, {
      locale: 'en',
    });
    expect(within(screen.getByTestId('careers-description')).getAllByRole('listitem')).toHaveLength(
      3,
    );
    const facts = screen.getByTestId('careers-facts');
    expect(facts).toHaveTextContent('Tashkent · Uzbekistan');
    expect(facts).toHaveTextContent('Uzbek, Russian, English');
    expect(facts).toHaveTextContent('$800 – $1,200 · per month');
    expect(screen.getByRole('link', { name: SYS.detail.back })).toHaveAttribute(
      'href',
      '/en/careers',
    );
  });
});
