import type { ReactNode } from 'react';
import { makeTf } from '@/content/pure';
import { MailIcon } from '@/design/chrome/icons';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../contract/website-bundle.v1';

/** The Blog/Article newsletter band. Phase A: `active={false}` on every page (W5 — the
 *  `newsletter` form is inactive at the door and would 404), so it renders nothing. Phase B:
 *  the page passes `active` from its settings and mounts its own `<FormShell formKey=
 *  "newsletter">` (one e-mail `Field`) as `children` — the page owns the server action. */
export function NewsletterBand({
  bundle,
  locale,
  active,
  id = 'newsletter',
  children,
}: {
  bundle: Bundle;
  locale: Locale;
  active: boolean;
  id?: string;
  children?: ReactNode;
}) {
  if (!active) return null;
  const t = makeTf(bundle, locale);
  return (
    <div
      id={id}
      className="relative grid items-center gap-8 overflow-hidden rounded-xl border border-border-1 bg-white px-8 py-9 shadow-[0_16px_40px_rgba(22,60,90,0.07)] lg:grid-cols-[1fr_auto] lg:px-12"
    >
      <div className="flex items-center gap-5">
        <span
          aria-hidden="true"
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-blue to-blue-safe text-white shadow-[0_12px_26px_rgba(24,153,213,0.3)]"
        >
          <MailIcon size={26} />
        </span>
        <div>
          <h2 className="text-h2 m-0 mb-1">{t('blog.036')}</h2>
          <p className="text-body-sm m-0 text-text-secondary">
            {t('blog.037')} <strong className="text-ink">{t('blog.038')}</strong>
          </p>
        </div>
      </div>
      <div className="min-w-0 lg:min-w-[340px]">{children}</div>
    </div>
  );
}
