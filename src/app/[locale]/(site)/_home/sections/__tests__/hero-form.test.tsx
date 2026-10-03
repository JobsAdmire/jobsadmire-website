import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { FormActionState } from '@/forms/types';
import { renderWithIntl } from '@/test/render';
import { homeBundle } from '../../__tests__/fixtures';
import { HeroForm } from '../HeroForm';

const actions = {
  hire: vi.fn(async (prev: FormActionState) => prev),
  callback: vi.fn(async (prev: FormActionState) => prev),
};

describe('HeroForm — the section that resolves the lead card', () => {
  it.each(['tr', 'en'] as const)(
    '%s: package labels, key-valued options, the package submit, the fixed WhatsApp prefill',
    (locale) => {
      const bundle = homeBundle(locale);
      const s = bundle.strings;
      renderWithIntl(<HeroForm locale={locale} bundle={bundle} actions={actions} />, { locale });
      const form = screen.getByTestId('hire-form');
      expect(screen.getByRole('textbox', { name: s['home.032'] })).toHaveAttribute(
        'name',
        'company',
      );
      expect(screen.getByRole('textbox', { name: s['home.033'] })).toHaveAttribute('name', 'name');
      const sector = [...form.querySelectorAll('select[name="sector"] option')]
        .slice(1)
        .map((o) => [o.getAttribute('value'), o.textContent]);
      expect(sector).toEqual([
        ['factory', s['home.036']],
        ['agriculture', s['home.037']],
        ['tourism', s['home.038']],
        ['construction', s['home.039']],
        ['other', s['home.040']],
      ]);
      const startWhen = [...form.querySelectorAll('select[name="startWhen"] option')]
        .slice(1)
        .map((o) => [o.getAttribute('value'), o.textContent]);
      expect(startWhen).toEqual([
        ['asap', s['home.044']],
        ['month1', s['home.045']],
        ['months1to3', s['home.046']],
        ['planning', s['home.047']],
      ]);
      expect(screen.getByRole('button', { name: s['home.048'] })).toHaveAttribute('type', 'submit');
      const wa = screen.getByRole('link', { name: s['home.049'] });
      expect(wa.getAttribute('href')).toMatch(
        new RegExp(`^https://wa\\.me/${bundle.settings.whatsappNumber}\\?text=`),
      );
      expect(
        screen.getByText(s['home.027'].replace('{homepageReplyHours}', '24')),
      ).toBeInTheDocument();
    },
  );
});
