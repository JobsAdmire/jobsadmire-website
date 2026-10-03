import { fireEvent, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { waLink } from '@/lib/contact';
import { collisionsInTree } from '@/test/class-collisions';
import { renderWithIntl } from '@/test/render';
import type { WizardProps } from '../../_lib/eligibility';
import { EligibilityWizard } from '../EligibilityWizard';

const WA = 'https://wa.me/905011240340';
const props: WizardProps = {
  locale: 'tr',
  whatsappNumber: '905011240340',
  questions: [
    {
      key: 'company',
      question: 'Şirket?',
      options: [
        { key: 'yes', label: 'Evet' },
        { key: 'no', label: 'Hayır / henüz değil' },
      ],
    },
    {
      key: 'staff',
      question: 'Personel?',
      options: [
        { key: 'atLeast', label: '5 veya daha fazla' },
        { key: 'below', label: '5 kişiden az' },
      ],
    },
    {
      key: 'location',
      question: 'İşçi nerede?',
      options: [
        { key: 'abroad', label: 'Yurt dışında' },
        { key: 'resident', label: 'İkametli' },
        { key: 'noPermit', label: 'İkametsiz' },
      ],
    },
    {
      key: 'debts',
      question: 'Borç?',
      options: [
        { key: 'no', label: 'Hayır' },
        { key: 'yes', label: 'Evet / emin değilim' },
      ],
    },
  ],
  copy: {
    heading: 'Yabancı işçi çalıştırabilir misiniz?',
    subtitle: 'Ücretsiz 60 saniyelik kontrol',
    back: '← Geri',
    whatsapp: "WhatsApp'tan net cevap alın",
    needWorkers: 'İşçiye de mi ihtiyacınız var?',
    seeHiring: 'Bizimle işe alım nasıl işliyor →',
    restart: '↺ Yeniden başla',
    footer: 'hiçbir bilgi saklanmaz',
    progressLabel: 'Uygunluk kontrolünün ilerleyişi',
    progress: ['1 / 4', '2 / 4', '3 / 4', '4 / 4'],
    titles: { eligible: 'Uygun', conditional: 'Planlamayla', ineligible: 'Düzeltilebilir' },
    points: {
      company: 'P-company',
      ratio: 'P-ratio',
      locationAbroad: 'P-abroad',
      locationResident: 'P-resident',
      locationNoPermit: 'P-nopermit',
      debts: 'P-debts',
      thresholds: 'P-thresholds',
    },
    prefillIntro: 'Merhaba JobsAdmire, kontrolü yaptım. Cevaplarım:',
    prefillResult: {
      eligible: 'Sonuç: Uygun',
      conditional: 'Sonuç: Planlamayla',
      ineligible: 'Sonuç: Düzeltilebilir',
    },
  },
};

type Entry = Record<string, unknown>;
const pushed = () => (window as unknown as { dataLayer: Entry[] }).dataLayer;

beforeEach(() => {
  (window as unknown as { dataLayer: Entry[] }).dataLayer = [];
});
afterEach(() => {
  vi.restoreAllMocks();
});

async function answer(...labels: string[]) {
  for (const name of labels) await userEvent.click(screen.getByRole('button', { name }));
}

describe('EligibilityWizard — the #eligibility card', () => {
  it('renders question 1 of 4 with an empty progress bar and no Back, and marks itself ready', () => {
    const { container } = renderWithIntl(<EligibilityWizard {...props} />);
    const card = screen.getByTestId('wp-eligibility');
    expect(card).toHaveAttribute('id', 'eligibility');
    expect(card).toHaveAttribute('data-island', 'ready');
    expect(screen.getByRole('heading', { level: 2, name: props.copy.heading })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Şirket?' })).toBeInTheDocument();
    expect(screen.getByTestId('wp-eligibility-step')).toHaveTextContent('1 / 4');
    const bar = screen.getByRole('progressbar', { name: props.copy.progressLabel });
    expect(bar).toHaveAttribute('aria-valuenow', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '4');
    expect(screen.queryByRole('button', { name: props.copy.back })).toBeNull();
    expect(collisionsInTree(container)).toEqual([]);
  });

  it('advances, goes back with the earlier answer marked, and moves focus to each new question (D20)', async () => {
    renderWithIntl(<EligibilityWizard {...props} />);
    await answer('Evet');
    expect(screen.getByText('Personel?')).toHaveFocus();
    expect(screen.getByTestId('wp-eligibility-step')).toHaveTextContent('2 / 4');
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '1');
    await userEvent.click(screen.getByRole('button', { name: props.copy.back }));
    expect(screen.getByText('Şirket?')).toHaveFocus();
    // the earlier answer carries the decorative SVG check (never a text glyph, D20) and is
    // announced through aria-current (T4 review M3)
    expect(screen.getByRole('button', { name: 'Evet' }).querySelector('svg')).not.toBeNull();
    expect(screen.getByRole('button', { name: 'Evet' })).toHaveAttribute('aria-current', 'true');
    expect(
      screen.getByRole('button', { name: 'Hayır / henüz değil' }).querySelector('svg'),
    ).toBeNull();
  });

  it('fires eligibility_check_complete once with the verdict bucket only — never an answer (W26/W67)', async () => {
    renderWithIntl(<EligibilityWizard {...props} />);
    await answer('Hayır / henüz değil', '5 veya daha fazla', 'Yurt dışında', 'Evet / emin değilim');
    // `page` is next/navigation's usePathname (R35) — null outside the App Router → '/'
    expect(pushed()).toEqual([
      { event: 'eligibility_check_complete', page: '/', locale: 'tr', result: 'ineligible' },
    ]);
    expect(screen.getByRole('heading', { level: 3, name: 'Düzeltilebilir' })).toHaveFocus();
    const result = screen.getByTestId('wp-eligibility-result');
    expect(
      within(result)
        .getAllByRole('listitem')
        .map((li) => li.textContent),
    ).toEqual(['P-company', 'P-abroad', 'P-debts']);
    expect(screen.queryByTestId('wp-eligibility-step')).toBeNull();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '4');
  });

  it('keeps the WhatsApp href bare and opens the prefilled chat on click, noopener (W76/W95)', async () => {
    renderWithIntl(<EligibilityWizard {...props} />);
    await answer('Evet', '5 kişiden az', 'İkametli', 'Hayır');
    const link = screen.getByRole('link', { name: props.copy.whatsapp });
    expect(link).toHaveAttribute('href', WA);
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(document.body.innerHTML).not.toContain('text=');
    const open = vi.spyOn(window, 'open').mockReturnValue(null);
    fireEvent.click(link);
    const text = [
      'Merhaba JobsAdmire, kontrolü yaptım. Cevaplarım:',
      '• Şirket? Evet',
      '• Personel? 5 kişiden az',
      '• İşçi nerede? İkametli',
      '• Borç? Hayır',
      'Sonuç: Planlamayla',
    ].join('\n');
    expect(open).toHaveBeenCalledWith(waLink('905011240340', text), '_blank', 'noopener');
    expect(pushed().at(-1)).toEqual({
      event: 'whatsapp_click',
      page: '/',
      locale: 'tr',
      placement: 'page_cta',
    });
  });

  it('counts a middle click, which reaches the bare chat', async () => {
    renderWithIntl(<EligibilityWizard {...props} />);
    await answer('Evet', '5 veya daha fazla', 'Yurt dışında', 'Hayır');
    const open = vi.spyOn(window, 'open').mockReturnValue(null);
    fireEvent(
      screen.getByRole('link', { name: props.copy.whatsapp }),
      new MouseEvent('auxclick', { bubbles: true, button: 1 }),
    );
    expect(open).not.toHaveBeenCalled();
    expect(pushed().at(-1)).toMatchObject({ event: 'whatsapp_click', placement: 'page_cta' });
  });

  it('Start again clears every answer and returns to question 1 with focus on it', async () => {
    renderWithIntl(<EligibilityWizard {...props} />);
    await answer('Evet', '5 veya daha fazla', 'Yurt dışında', 'Hayır');
    expect(screen.getByRole('heading', { level: 3, name: 'Uygun' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: props.copy.restart }));
    expect(screen.getByText('Şirket?')).toHaveFocus();
    expect(screen.getByRole('button', { name: 'Evet' })).not.toHaveAttribute('aria-current');
    expect(screen.getByTestId('wp-eligibility-step')).toHaveTextContent('1 / 4');
    expect(screen.getByRole('button', { name: 'Evet' }).querySelector('svg')).toBeNull();
  });

  it('links the hire cross-sell to the localized Hire Workers page', async () => {
    renderWithIntl(<EligibilityWizard {...props} />);
    await answer('Evet', '5 veya daha fazla', 'Yurt dışında', 'Hayır');
    expect(screen.getByRole('link', { name: props.copy.seeHiring })).toHaveAttribute(
      'href',
      '/isci-talebi',
    );
  });
});
