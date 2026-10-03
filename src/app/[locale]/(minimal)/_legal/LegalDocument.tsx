import type { ReactNode } from 'react';
// By module path, never the barrels (W134/W147/W156).
import { Breadcrumbs } from '@/design/blocks/Breadcrumbs';
import { Section } from '@/design/primitives/Section';
import type { Locale } from '@/i18n/routing';
import { formatDate } from '@/lib/format/date/formatDate';
import { parseLegalBody, type LegalRun } from '@/lib/legal/body';
import type { Href } from '@/lib/seo/routes';

export type LegalSection = { id: string; title: string; body: string };

/** A page-level note above the body: the Turkish Terms' English-only notice or a counsel
 *  placeholder (D26/W55 — always a named `data-placeholder`, never the LCP slot). */
export type LegalNotice = {
  testId: 'legal-notice' | 'legal-pending';
  placeholder: string;
  title?: string;
  body: string;
  action?: ReactNode;
};

export type LegalDocumentProps = {
  locale: Locale;
  href: Href;
  homeLabel: string;
  title: string;
  intro: string;
  /** ISO `YYYY-MM-DD` from `sys.legal.<doc>.updatedAt` (D17). */
  updatedAt: string;
  updatedLabel: string;
  contentsLabel: string;
  /** Already formatted by next-intl (ICU arguments filled). */
  sections: LegalSection[];
  /** The language of the intro, contents and sections when it is not the page's own — the
   *  Turkish Terms route renders the English text (WCAG 3.1.2). */
  bodyLang?: Locale;
  notice?: LegalNotice | null;
  children?: ReactNode;
};

function Runs({ runs }: { runs: LegalRun[] }) {
  return (
    <>
      {runs.map((run, i) =>
        run.strong ? (
          <strong key={i} className="font-extrabold text-ink">
            {run.text}
          </strong>
        ) : (
          <span key={i}>{run.text}</span>
        ),
      )}
    </>
  );
}

/** A Markdown-lite body (`src/lib/legal/body.ts`): paragraphs and bullet lists, nothing else. */
export function LegalBody({ body }: { body: string }) {
  return (
    <>
      {parseLegalBody(body).map((block, i) =>
        block.type === 'ul' ? (
          <ul key={i} className="my-3 list-disc space-y-1 pl-6 text-body text-text-secondary">
            {block.items.map((runs, j) => (
              <li key={j}>
                <Runs runs={runs} />
              </li>
            ))}
          </ul>
        ) : (
          <p key={i} className="my-3 text-body text-text-secondary">
            <Runs runs={block.runs} />
          </p>
        ),
      )}
    </>
  );
}

/**
 * One layout for the four legal routes (D14): breadcrumbs (the page's one BreadcrumbList,
 * W109: the current crumb is the page's own title) → h1 (the named LCP slot) → dated line →
 * optional notice → intro → contents → numbered sections → `children`. `sections` may be empty
 * (the KVKK placeholder renders no contents list). No `<main>` — the `(minimal)` layout owns it.
 */
export function LegalDocument({
  locale,
  href,
  homeLabel,
  title,
  intro,
  updatedAt,
  updatedLabel,
  contentsLabel,
  sections,
  bodyLang,
  notice,
  children,
}: LegalDocumentProps) {
  return (
    <Section tone="light">
      {/* `.container-site` is unlayered CSS, so a `max-w-*` utility on the same element would
          lose to its `--container-max` (W178/W180) — the reading measure sits on an inner
          wrapper. */}
      <div className="container-site">
        {/* W229: the 760 px reading column centres in the wider box from 1101 px. */}
        <div className="max-w-[760px] xl:mx-auto">
          <Breadcrumbs
            locale={locale}
            items={[
              { name: homeLabel, href: '/' },
              { name: title, href },
            ]}
          />
          <h1 data-testid="page-h1" data-lcp-slot="h1" className="mt-6 text-h2">
            {title}
          </h1>
          <p data-testid="legal-updated" className="mt-2 text-body-sm font-bold text-text-tertiary">
            {updatedLabel}: <time dateTime={updatedAt}>{formatDate(updatedAt, locale)}</time>
          </p>
          {notice ? (
            <div
              role="note"
              data-testid={notice.testId}
              data-placeholder={notice.placeholder}
              className="mt-6 rounded-base border border-warning-border bg-warning-surface p-4"
            >
              {notice.title ? (
                <p className="text-body font-extrabold text-warning-text">{notice.title}</p>
              ) : null}
              <p className="mt-1 text-body-sm font-semibold text-ink">{notice.body}</p>
              {notice.action ? <div className="mt-3">{notice.action}</div> : null}
            </div>
          ) : null}
          <p
            data-testid="legal-intro"
            lang={bodyLang}
            className="mt-5 text-body-lg text-text-secondary"
          >
            {intro}
          </p>
          {sections.length > 0 ? (
            <nav
              aria-label={contentsLabel}
              data-testid="legal-toc"
              className="mt-8 rounded-base border border-border-2 bg-pale-1 p-4"
            >
              <p className="text-body-sm font-extrabold uppercase tracking-[1px] text-text-secondary">
                {contentsLabel}
              </p>
              <ol
                lang={bodyLang}
                className="mt-2 list-decimal space-y-1 pl-5 text-body-sm font-bold"
              >
                {sections.map((s) => (
                  <li key={s.id}>
                    {/* WCAG 2.5.8 (axe target-size, wcag22aa): the rows sit closer than 24 px
                        apart at the desktop type scale, so each link is a 24 px target. */}
                    <a
                      href={`#${s.id}`}
                      className="inline-flex min-h-[24px] items-center text-blue-safe no-underline hover:underline"
                    >
                      {s.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          ) : null}
          <div data-testid="legal-body" lang={bodyLang}>
            {sections.map((s, i) => (
              <section key={s.id} id={s.id} data-legal-section className="mt-10 scroll-mt-24">
                <h2 className="text-card-title text-ink">
                  {i + 1}. {s.title}
                </h2>
                <LegalBody body={s.body} />
              </section>
            ))}
            {children}
          </div>
        </div>
      </div>
    </Section>
  );
}
