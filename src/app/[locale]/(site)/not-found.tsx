import { getTranslations } from 'next-intl/server';
// By module path, not the barrel (W147): a server component's barrel import makes every
// 'use client' primitive the barrel re-exports a client reference of the route.
import { Section } from '@/design/primitives/Section';
import { Link } from '@/i18n/navigation';

const HOME_LINK =
  'inline-flex min-h-[52px] items-center justify-center rounded-pill bg-blue px-7 text-body font-extrabold text-white no-underline transition-colors hover:bg-blue-safe focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe';

/** R6: rendered inside the locale chrome, so a 404 is still a way back into the site rather
 *  than a dead end. Reached from `[...rest]/page.tsx` (any unmatched URL) and from every
 *  `notFound()` a page calls. */
export default async function LocaleNotFound() {
  const sys = await getTranslations('sys');
  return (
    <Section tone="light">
      {/* Final pass D3 (W178) / QA W221 SYS-03: `.container-site` is unlayered, so a `max-w-*` on
          the same element never applied — the 720 px reading column is an inner, centred wrapper
          (the thank-you page's), and the body line carries its own `mt-3` over the reset. */}
      <div className="container-site">
        <div className="mx-auto max-w-[720px]">
          <h1 className="text-h2">{sys('notFoundTitle')}</h1>
          <p className="mt-3 text-body-lg text-text-secondary">{sys('notFoundBody')}</p>
          <Link prefetch={false} href="/" className={`mt-8 ${HOME_LINK}`}>
            {sys('nav.home')}
          </Link>
        </div>
      </div>
    </Section>
  );
}
