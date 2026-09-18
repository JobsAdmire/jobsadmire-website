import { render, type RenderOptions } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import type { ComponentProps, ReactElement, ReactNode } from 'react';
import type { Locale } from '@/i18n/routing';
import en from '@/messages/en.json';
import tr from '@/messages/tr.json';

type Messages = ComponentProps<typeof NextIntlClientProvider>['messages'];

const MESSAGES: Record<Locale, Messages> = { tr, en };

/** Renders under the real `sys.*` messages, which is what chrome and the primitives read. */
export function renderWithIntl(
  ui: ReactElement,
  {
    locale = 'tr',
    messages,
    ...options
  }: Omit<RenderOptions, 'wrapper'> & { locale?: Locale; messages?: Messages } = {},
) {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <NextIntlClientProvider locale={locale} messages={messages ?? MESSAGES[locale]}>
      {children}
    </NextIntlClientProvider>
  );
  return render(ui, { wrapper: Wrapper, ...options });
}
