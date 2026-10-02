import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FaqBlock } from '../FaqBlock';
import { buttonClassName } from '@/design/primitives';
import { testBundle } from '@/test/bundle';
import { renderWithIntl } from '@/test/render';

// No analytics mock: the ask card's ContactCta renders T0c's real ContactLink, whose hook
// reads the locale from the provider `renderWithIntl` supplies.
const bundle = testBundle({
  strings: {
    'x.eyebrow': 'SSS',
    'x.title': 'İşverenlerin sorduğu sorular',
    'x.body': 'İzinler, maliyetler, süreler.',
    'x.askT': 'Sorunuz listede yok mu?',
    'x.askB': 'Ekibimize yazın.',
    'x.wa': "WhatsApp'tan sorun",
    'x.call': 'Bizi arayın',
    'x.mail': 'E-posta gönderin',
  },
});
const items = [
  { id: 'q1', q: 'Ne kadar sürer?', a: 'Ortalama 45 gün.' },
  { id: 'q2', q: 'Maliyet?', a: 'Role göre değişir.' },
];

describe('FaqBlock', () => {
  // Final pass A7 (W189 A6): the design's FAQ h2 is the section h2 face — letter-spacing -1.6 px
  // (× 0.75 from 1101), line-height 1.05 — and its `.ja-faq-side h2` ≤ 700 rule sets 24 px /
  // -0.5 px / 1.14 with a 10 px margin; that class rule beats the design's global ≤ 600 px h2 rule
  // by specificity, so no `max-[601px]` twin here.
  it('the side-column h2 carries the design face and its ≤ 700 px sizes (A7)', () => {
    renderWithIntl(
      <FaqBlock bundle={bundle} locale="tr" items={items} headingId="x.title" headingLevel={3} />,
    );
    const h2 = screen.getByRole('heading', { level: 2, name: 'İşverenlerin sorduğu sorular' });
    expect(h2.className.split(/\s+/)).toEqual(
      expect.arrayContaining([
        'text-h2',
        'leading-[1.05]',
        'tracking-[-1.6px]',
        'xl:tracking-[-1.2px]',
        'max-md:text-[24px]',
        'max-md:leading-[1.14]',
        'max-md:tracking-[-0.5px]',
        'max-md:mb-2.5',
      ]),
    );
    expect(h2.className).not.toMatch(/max-\[601px\]:|max-sm:/);
  });

  it('renders the side column, one accordion trigger per pair and a FAQPage node', () => {
    const { container } = renderWithIntl(
      <FaqBlock
        bundle={bundle}
        locale="tr"
        items={items}
        eyebrowId="x.eyebrow"
        headingId="x.title"
        bodyId="x.body"
        askCard={{
          titleId: 'x.askT',
          bodyId: 'x.askB',
          whatsappNumber: '905011240340',
          whatsappText: 'Merhaba',
          whatsappLabelId: 'x.wa',
          phone: '+905011240340',
          callLabelId: 'x.call',
        }}
      />,
    );
    expect(
      screen.getByRole('heading', { level: 2, name: 'İşverenlerin sorduğu sorular' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Ne kadar sürer?' })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /Ne kadar sürer\?|Maliyet\?/ })).toHaveLength(2);
    expect(screen.getByRole('link', { name: "WhatsApp'tan sorun" })).toHaveAttribute(
      'href',
      'https://wa.me/905011240340?text=Merhaba',
    );
    expect(screen.getByRole('link', { name: 'Bizi arayın' })).toHaveAttribute(
      'href',
      'tel:+905011240340',
    );
    const data = JSON.parse(
      container.querySelector('script[type="application/ld+json"]')!.textContent!,
    );
    expect(data['@type']).toBe('FAQPage');
    expect(data.mainEntity).toHaveLength(2);
    expect(data.mainEntity[1].acceptedAnswer.text).toBe('Role göre değişir.');
  });

  it('opens the first pair on request and allows multi-open (the Homepage variant)', () => {
    renderWithIntl(
      <FaqBlock bundle={bundle} locale="tr" items={items} singleOpen={false} openFirst />,
    );
    expect(screen.getByRole('button', { name: 'Ne kadar sürer?' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    expect(screen.queryByRole('heading', { level: 2 })).toBeNull();
  });

  it('adds an e-mail row to the ask card when given (W83)', async () => {
    renderWithIntl(
      <FaqBlock
        bundle={bundle}
        locale="tr"
        items={items}
        askCard={{
          titleId: 'x.askT',
          bodyId: 'x.askB',
          whatsappNumber: '905011240340',
          whatsappText: 'Merhaba',
          whatsappLabelId: 'x.wa',
          email: 'info@jobsadmire.com',
          emailLabelId: 'x.mail',
          subject: 'Soru',
        }}
      />,
    );
    expect(screen.getByRole('link', { name: 'E-posta gönderin' })).toHaveAttribute(
      'href',
      'mailto:info@jobsadmire.com?subject=Soru',
    );
  });

  it('ask-card rows wear their variant face exactly, with no caller colour classes (W122/W127)', () => {
    renderWithIntl(
      <FaqBlock
        bundle={bundle}
        locale="tr"
        items={items}
        askCard={{
          titleId: 'x.askT',
          bodyId: 'x.askB',
          whatsappNumber: '905011240340',
          whatsappText: 'Merhaba',
          whatsappLabelId: 'x.wa',
          phone: '+905011240340',
          callLabelId: 'x.call',
          email: 'info@jobsadmire.com',
          emailLabelId: 'x.mail',
        }}
      />,
    );
    const whatsapp = screen.getByRole('link', { name: "WhatsApp'tan sorun" });
    const call = screen.getByRole('link', { name: 'Bizi arayın' });
    const mail = screen.getByRole('link', { name: 'E-posta gönderin' });
    const tokens = (el: HTMLElement) => el.className.split(/\s+/);
    // WhatsApp: the `success` variant and nothing appended (Tailwind orders rules by name, not
    // by position in the class string, so an appended colour class is a coin toss — W122).
    expect(whatsapp).toHaveClass(
      'border-success-border',
      'text-success-text',
      'hover:bg-success-surface',
    );
    expect(whatsapp.className).toBe(buttonClassName('success'));
    // Call and e-mail: plain `secondary` — ink text, the W127 D20 delta; no blue-text override.
    expect(call.className).toBe(buttonClassName('secondary'));
    expect(mail.className).toBe(buttonClassName('secondary'));
    for (const el of [whatsapp, call, mail]) expect(tokens(el)).not.toContain('text-blue-safe');
    for (const el of [call, mail]) {
      expect(tokens(el)).not.toContain('border-success-border');
      expect(tokens(el)).not.toContain('hover:bg-success-surface');
    }
  });
});
