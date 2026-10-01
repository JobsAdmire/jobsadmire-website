import { ContactLink } from '@/analytics/ContactLink';
import { Button } from '@/design/primitives/Button';
import { Section } from '@/design/primitives/Section';
import { mailLink } from '@/lib/contact';
import { RecapLoader } from '../_components/LazyBinders';
import { QuoteButton } from '../_components/QuoteButton';
import { RecapCard } from '../_components/RecapCard';
import type { CalcCtx } from './context';

/**
 * `#calc-cta` (design 1534–1553) — the sticky bar hides near it (W18). The design's green
 * WhatsApp "Get a written quote" becomes the W3 quote form's opener (`primary`, delta 1/8); the
 * phone recap shows the estimate the form sends (`RecapCard`, loaded 200 px before view, delta
 * 10); "See available candidates" links to T8's page (no prefetch while it may still 404, W20);
 * the legal line's e-mail is a tracked contact link (`page_cta`, W12). Not `ClosingCtaBand`: the
 * design's band is a full-width pale gradient, not a rounded card (W127/W128 — no green band).
 */
export function ClosingBand({ ctx }: { ctx: CalcCtx }) {
  const {
    t,
    locale,
    rateConfig,
    roles,
    roleLabels,
    industryLabels,
    labels,
    defaultView,
    settings,
  } = ctx;
  return (
    <Section
      id="calc-cta"
      tone="pale"
      className="border-t border-tint-border bg-[linear-gradient(180deg,#f4f9fc_0%,#e8f3f9_100%)] max-md:pt-[26px] max-md:pb-[30px] md:py-[72px] xl:py-[54px]"
    >
      <div data-testid="calc-closing" className="container-site">
        <div className="mx-auto max-w-[900px] text-center max-md:text-left xl:max-w-[675px]">
          <h2 className="m-0 mb-3.5 text-h2 leading-[1.05] tracking-[-0.04em] text-ink max-md:mb-2 max-md:text-[24px] max-md:tracking-[-0.6px]">
            {t('calc.100')}
          </h2>
          <p className="mx-auto mt-0 mb-7 max-w-[600px] text-body-lg text-text-secondary max-md:mb-3.5 max-md:text-[14px] xl:max-w-[450px]">
            {t('calc.101')}
          </p>
          {defaultView ? (
            <div data-testid="calc-recap" className="mb-3 md:hidden">
              <RecapLoader
                locale={locale}
                rateConfig={rateConfig}
                roles={roles}
                roleLabels={roleLabels}
                industryLabels={industryLabels}
                cardLabels={labels.cardView}
                labels={labels.recap}
                fallback={<RecapCard view={defaultView} labels={labels.recap} />}
              />
            </div>
          ) : null}
          <div className="flex flex-wrap justify-center gap-3.5 max-md:grid max-md:grid-cols-1 max-md:gap-2">
            <QuoteButton
              label={t('calc.105')}
              variant="primary"
              size="lg"
              className="max-md:w-full"
              testId="calc-quote-open-band"
            />
            <Button
              variant="secondary"
              size="lg"
              href="/available-workers"
              prefetch={false}
              className="max-md:w-full"
            >
              {t('calc.106')}
            </Button>
          </div>
          <p className="m-0 mt-[26px] text-body-sm text-text-secondary max-md:mt-3.5 max-md:text-[12px]">
            JobsAdmire · {t('calc.418')} · {t('calc.420')} ·{' '}
            <ContactLink
              href={mailLink(settings.email)}
              placement="page_cta"
              className="font-bold text-blue-safe no-underline hover:underline"
            >
              {settings.email}
            </ContactLink>
          </p>
        </div>
      </div>
    </Section>
  );
}
