'use client';
import { useTranslations } from 'next-intl';
import { Button, Section } from '@/design/primitives';

/** The locale segment's error boundary: the chrome survives, the page is replaced. Errors
 *  thrown by the layout itself escape to `app/global-error.tsx`. The error object is
 *  deliberately not rendered — a visitor gets no stack, and Sentry gets the digest (WP6). */
export default function LocaleError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const sys = useTranslations('sys');
  return (
    <Section tone="light">
      <div className="container-site max-w-[720px]">
        <h1 className="text-h2">{sys('errorTitle')}</h1>
        <div className="mt-8">
          <Button variant="primary" size="lg" onClick={() => reset()}>
            {sys('errorRetry')}
          </Button>
        </div>
      </div>
    </Section>
  );
}
