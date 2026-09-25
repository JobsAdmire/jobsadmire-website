import { getCollection } from '@/content/collections';
import { makeTf } from '@/content/pure';
import {
  Breadcrumbs,
  ClosingCtaBand,
  EmptyState,
  FaqBlock,
  ImageSlot,
  LogoMarquee,
  MetricStrip,
  NewsletterBand,
  OfficeCard,
  PostCard,
  ProcessSteps,
  StoreBadges,
} from '@/design/blocks';
import { Section, Stat, Timeline } from '@/design/primitives';
import type { Locale } from '@/i18n/routing';
import { telLink, waLink } from '@/lib/contact';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { RadioChipsDemo } from './RadioChipsDemo';

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-border-2 py-8">
      <h2 className="text-card-title mb-4 font-mono">{title}</h2>
      <div className="flex flex-wrap items-end gap-4">{children}</div>
    </section>
  );
}

/** Task 5's additions to the gallery: every new tone/variant and every shared block, fed from
 *  the real bundle (package ids by exact id through `makeTf` — home.024/107/305 carry
 *  `{metric}` placeholders after T0b — collections from the importer). */
export function Wp2Blocks({ bundle, locale }: { bundle: Bundle; locale: Locale }) {
  const t = makeTf(bundle, locale);
  const { settings } = bundle;
  const office = getCollection(bundle, 'offices')[0];
  const post = getCollection(bundle, 'blog').find((p) => p.slug[locale] && p.title[locale]);
  const faq = [294, 296, 298, 300, 302, 304].map((q) => ({
    id: `home.${q}`,
    q: t(`home.${q}`),
    a: t(`home.${q + 1}`),
  }));
  const steps = [104, 107, 110, 113, 116].map((n, i) => ({
    n: i + 1,
    when: t(`home.${n}`),
    titleId: `home.${n + 1}`,
    bodyId: `home.${n + 2}`,
  }));

  return (
    <>
      <Block title="RadioChips / Tabs onChange">
        <RadioChipsDemo />
      </Block>

      <Block title="Stat — text / prefix / dark tone">
        <Stat text="6–8" suffix=" wk" label={t('home.052')} locale={locale} />
        <Stat value={45} prefix="~" label={t('home.052')} locale={locale} />
        <span className="rounded-md bg-navy p-4">
          <Stat value={470} suffix="+" label={t('home.050')} locale={locale} tone="dark" />
        </span>
      </Block>

      <Block title="Timeline — horizontal">
        <div className="w-full">
          <Timeline
            variant="horizontal"
            steps={[
              { when: '2019', title: 'Founded', body: 'Antalya.' },
              { when: '2022', title: 'Licensed', body: 'İŞKUR 1730.' },
              { when: '2026', title: 'Today', body: '13 source countries.' },
            ]}
          />
        </div>
      </Block>

      <Section tone="pale" className="my-8 rounded-xl">
        <div className="container-site">
          <h2 className="text-card-title font-mono">Section tone=&quot;pale&quot; + FaqBlock</h2>
          <FaqBlock
            bundle={bundle}
            locale={locale}
            items={faq}
            eyebrowId="home.180"
            headingId="home.181"
            askCard={{
              titleId: 'hire.197',
              bodyId: 'hire.198',
              whatsappNumber: settings.whatsappNumber,
              whatsappText: t('hire.252'),
              whatsappLabelId: 'hire.041',
              phone: settings.phone,
              callLabelId: 'hire.032',
            }}
            openFirst
          />
        </div>
      </Section>

      <Block title="Breadcrumbs (light / dark)">
        <Breadcrumbs
          locale={locale}
          items={[
            { name: t('home.001'), href: '/' },
            { name: t('home.010'), href: '/blog' },
            { name: 'Gallery', href: '/blog' },
          ]}
        />
        <span className="rounded-md bg-navy p-4">
          <Breadcrumbs
            locale={locale}
            tone="dark"
            items={[
              { name: t('home.001'), href: '/' },
              { name: t('home.002'), href: '/hire-workers' },
            ]}
          />
        </span>
      </Block>

      <Block title="ProcessSteps — cards / plain">
        <div className="w-full max-w-[760px]">
          <ProcessSteps bundle={bundle} locale={locale} steps={steps} />
        </div>
        <div className="w-full max-w-[760px]">
          <ProcessSteps bundle={bundle} locale={locale} steps={steps.slice(0, 3)} variant="plain" />
        </div>
      </Block>

      <Block title="MetricStrip (light) — hidden metrics are skipped">
        <div className="w-full">
          <MetricStrip
            bundle={bundle}
            locale={locale}
            metrics={['placed', 'employers', 'countries', 'permitDays']}
          />
        </div>
      </Block>
      <Section tone="dark" className="my-8 rounded-xl">
        <div className="container-site">
          <MetricStrip
            bundle={bundle}
            locale={locale}
            tone="dark"
            metrics={['placed', 'countries', 'firstDayWeeks']}
          />
        </div>
      </Section>

      <Block title="OfficeCard (offices collection)">
        {office ? (
          <div className="w-full max-w-sm rounded-xl bg-navy p-6">
            <OfficeCard bundle={bundle} locale={locale} office={office} />
          </div>
        ) : (
          <p className="text-body-sm">offices collection is empty — run npm run content:import</p>
        )}
      </Block>

      <Block title="PostCard — card / row / featured (blog collection)">
        {post ? (
          <>
            <div className="w-80">
              <PostCard bundle={bundle} locale={locale} post={post} />
            </div>
            <div className="w-96">
              <PostCard bundle={bundle} locale={locale} post={post} variant="row" />
            </div>
            <div className="w-full max-w-xl">
              <PostCard
                bundle={bundle}
                locale={locale}
                post={post}
                variant="featured"
                headingLevel={2}
                coverSrc="/brand/ja-mark.png"
              />
            </div>
          </>
        ) : (
          <p className="text-body-sm">
            no blog row is written in this locale — run npm run content:import
          </p>
        )}
      </Block>

      <Block title="ImageSlot (placeholder / asset) — EmptyState (light / dark)">
        <div className="w-64">
          <ImageSlot slot="gallery-placeholder" alt="Placeholder slot" width={4} height={3} />
        </div>
        <div className="w-24">
          <ImageSlot slot="gallery-mark" src="/brand/ja-mark.png" alt="" width={88} height={88} />
        </div>
        <div className="w-full max-w-md">
          <EmptyState
            title="Nothing signed yet"
            body="The wall stays empty until the first approvals are signed (W6)."
            cta={{
              label: t('home.221'),
              href: waLink(settings.whatsappNumber, t('hire.252')),
              external: true,
            }}
          />
        </div>
        <div className="w-full max-w-md rounded-xl bg-navy p-4">
          <EmptyState
            title="Dark tone"
            tone="dark"
            cta={{ label: t('home.022'), href: '/hire-workers' }}
          />
        </div>
      </Block>

      <Block title="StoreBadges (Android only, W8) / LogoMarquee (empty → nothing)">
        <StoreBadges
          bundle={bundle}
          locale={locale}
          android={settings.storeLinks.android}
          ios={settings.storeLinks.ios}
        />
        <StoreBadges
          bundle={bundle}
          locale={locale}
          android={settings.storeLinks.android}
          tone="light"
        />
        <LogoMarquee logos={[]} />
        <div className="w-full">
          <LogoMarquee
            logos={[
              { src: '/brand/ja-mark.png', alt: 'JobsAdmire', width: 88, height: 88 },
              { src: '/brand/ja-mark.png', alt: 'JobsAdmire', width: 88, height: 88 },
              { src: '/brand/ja-mark.png', alt: 'JobsAdmire', width: 88, height: 88 },
            ]}
          />
        </div>
      </Block>

      <Section tone="band">
        <NewsletterBand bundle={bundle} locale={locale} active={false} />
        <NewsletterBand bundle={bundle} locale={locale} active id="gallery-newsletter">
          <p className="text-body-sm m-0 text-text-secondary">
            (Phase B: the page mounts its FormShell here — active=false renders nothing above.)
          </p>
        </NewsletterBand>
      </Section>

      <Section tone="band">
        <ClosingCtaBand
          bundle={bundle}
          locale={locale}
          titleId="home.184"
          bodyId="home.185"
          primary={{ label: t('home.022'), href: '/hire-workers' }}
          secondary={{
            label: t('home.221'),
            href: waLink(settings.whatsappNumber, t('hire.249')),
            external: true,
          }}
          extra={[
            { label: t('home.202'), href: settings.telegramUrl, external: true },
            { label: t('home.187'), href: telLink(settings.phone) },
          ]}
          ticks={[t('hire.019'), t('home.024')]}
        />
      </Section>
      <Section tone="band">
        <ClosingCtaBand
          bundle={bundle}
          locale={locale}
          titleId="home.184"
          primary={{ label: t('home.022'), href: '/hire-workers' }}
          tone="green"
        />
      </Section>

      {/* The sticky bar's hideNearId target: scroll here and the bar (lg+) disappears. */}
      <div id="gallery-end" className="h-24" />
    </>
  );
}
