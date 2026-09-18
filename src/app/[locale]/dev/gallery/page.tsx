import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getBundle, makeT } from '@/content/adapter';
import { ConsentBanner } from '@/design/chrome/ConsentBanner';
import { CookiePreferencesButton } from '@/design/chrome/CookiePreferencesButton';
import { Footer } from '@/design/chrome/Footer';
import { Header } from '@/design/chrome/Header';
import { LanguageHint } from '@/design/chrome/LanguageHint';
import { LanguageSwitcher } from '@/design/chrome/LanguageSwitcher';
import { MobileBottomBar } from '@/design/chrome/MobileBottomBar';
import { MobileNav } from '@/design/chrome/MobileNav';
import { NavLink } from '@/design/chrome/NavLink';
import { SlimBar } from '@/design/chrome/SlimBar';
import { SocialRail } from '@/design/chrome/SocialRail';
import { StickyCtaBar } from '@/design/chrome/StickyCtaBar';
import { WhatsAppFab } from '@/design/chrome/WhatsAppFab';
import {
  Accordion,
  Button,
  Card,
  Chip,
  Eyebrow,
  FormField,
  PausableMarquee,
  Section,
  SkipLink,
  Stat,
  Tabs,
  Timeline,
} from '@/design/primitives';
import { routing } from '@/i18n/routing';
import { DialogDemo } from './DialogDemo';

// Never indexed even in the environments where it does render.
export const metadata: Metadata = {
  title: 'Component gallery',
  robots: { index: false, follow: false },
};

const INPUT =
  'min-h-[44px] rounded-md border border-border-1 px-3 text-body-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe';

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-border-2 py-8">
      <h2 className="text-card-title mb-4 font-mono">{title}</h2>
      <div className="flex flex-wrap items-end gap-4">{children}</div>
    </section>
  );
}

/** R41: a dev-only catalogue of every primitive and every chrome piece that takes plain
 *  props, rendered from the real bundle. It is not a route of the site — `notFound()` is the
 *  first thing it does in production, so the page cannot ship even by accident. */
export default async function Gallery({ params }: { params: Promise<{ locale: string }> }) {
  if (process.env.NODE_ENV === 'production') notFound();
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const [bundle, sys] = await Promise.all([getBundle(locale), getTranslations('sys')]);
  const t = makeT(bundle);
  const navItems = bundle.nav
    .filter((n) => n.group === 'desktopNav')
    .sort((a, b) => a.order - b.order)
    .map((n) => ({ href: n.href, label: t(n.labelId), external: n.external }));

  return (
    <div className="container-site py-10">
      <h1 className="text-h2">Component gallery</h1>
      <p className="text-body-sm text-text-secondary">
        {`locale: ${locale} · dev only (404 in production)`}
      </p>

      <Block title="Button">
        <Button variant="primary">primary</Button>
        <Button variant="secondary">secondary</Button>
        <Button variant="ghost">ghost</Button>
        <Button variant="danger">danger</Button>
        <Button variant="primary" size="lg">
          primary lg
        </Button>
        <Button variant="primary" disabled>
          disabled
        </Button>
        <Button variant="secondary" href="/">
          internal link
        </Button>
        <Button variant="ghost" href="https://wa.me/905011240340" external>
          external link
        </Button>
      </Block>

      <Block title="Eyebrow / Chip / Stat">
        <Eyebrow>{t('home.001')}</Eyebrow>
        {/* `onToggle` is optional, so the static states render straight from the server. */}
        <Chip>unselected</Chip>
        <Chip selected>selected</Chip>
        <Stat value={1240} suffix="+" label={t('home.024')} locale={locale} />
      </Block>

      <Block title="Card">
        <Card className="w-72">
          <h3 className="text-card-title">Card</h3>
          <p className="text-body-sm text-text-secondary">Flat.</p>
        </Card>
        <Card hover as="article" className="w-72">
          <h3 className="text-card-title">Card (hover, article)</h3>
          <p className="text-body-sm text-text-secondary">Lifts on hover.</p>
        </Card>
      </Block>

      <Block title="FormField">
        <div className="w-72">
          <FormField id="g-name" label="Label" hint="A hint" required>
            {(p) => <input {...p} className={INPUT} />}
          </FormField>
        </div>
        <div className="w-72">
          <FormField id="g-mail" label="With an error" error="This field is required">
            {(p) => <input {...p} className={INPUT} type="email" />}
          </FormField>
        </div>
      </Block>

      <Block title="Accordion / Tabs / Timeline">
        <div className="w-full max-w-xl">
          <Accordion
            defaultOpenId="a1"
            items={[
              { id: 'a1', title: 'First', body: <p>First panel.</p> },
              { id: 'a2', title: 'Second', body: <p>Second panel.</p> },
            ]}
          />
        </div>
        <div className="w-full max-w-xl">
          <Tabs
            defaultId="t1"
            tabs={[
              { id: 't1', label: 'One', panel: <p>Panel one.</p> },
              { id: 't2', label: 'Two', panel: <p>Panel two.</p> },
            ]}
          />
        </div>
        <div className="w-full max-w-xl">
          <Timeline
            steps={[
              { when: '01', title: 'Step one', body: 'What happens first.' },
              { title: 'Step two (no `when`)', body: 'What happens next.' },
            ]}
          />
        </div>
      </Block>

      <Block title="Dialog (client wrapper) / SkipLink">
        <DialogDemo open="Open dialog" title="Dialog" body="Focus is trapped." close="Close" />
        {/* Visible only while focused — tab into it from the button on its left. */}
        <SkipLink label={sys('skipToContent')} />
      </Block>

      <Block title="PausableMarquee">
        <div className="w-full">
          <PausableMarquee
            durationSec={30}
            labelPause={sys('marquee.pause')}
            labelPlay={sys('marquee.play')}
          >
            <span className="px-4 font-bold">{t('home.019')}</span>
            <span className="px-4 font-bold">{t('home.020')}</span>
            <span className="px-4 font-bold">{t('home.021')}</span>
          </PausableMarquee>
        </div>
      </Block>

      <Section tone="dark" className="my-8 rounded-xl">
        <div className="container-site">
          <h2 className="text-card-title font-mono">Section tone=&quot;dark&quot;</h2>
          <p className="text-body-sm">The light tone is what this whole page sits on.</p>
        </div>
      </Section>

      <Block title="Chrome — LanguageSwitcher / NavLink / CookiePreferencesButton">
        <LanguageSwitcher locale={locale} label={t('home.016')} />
        <span className="bg-navy p-3">
          <LanguageSwitcher locale={locale} label={t('home.016')} variant="dark" />
        </span>
        <LanguageSwitcher locale={locale} label={t('home.016')} variant="block" />
        {navItems[0] && (
          <NavLink item={navItems[0]} className="font-bold text-blue-safe underline" />
        )}
        <span className="bg-navy p-3">
          <CookiePreferencesButton label={sys('consent.manage')} />
        </span>
      </Block>

      <Block title="Chrome — MobileNav (below lg) / SlimBar / Header">
        <MobileNav
          items={navItems}
          locale={locale}
          menuLabel={sys('nav.main')}
          closeLabel={sys('nav.close')}
          languageLabel={t('home.016')}
        />
        <div className="w-full">
          <SlimBar bundle={bundle} />
          <Header locale={locale} bundle={bundle} primaryCta={{ href: '/hire-workers' }} />
        </div>
      </Block>

      <Block title="Chrome — Footer">
        <div className="w-full">
          <Footer locale={locale} bundle={bundle} />
        </div>
      </Block>

      {/* Fixed-position chrome: these mount at the viewport, not here, so on this page they
          stack on the copies `SiteChrome` already renders. Listed anyway — the gallery is
          where you check they still render at all. `ConsentBanner` is the exception: the
          layout only mounts it when a GTM container id exists, which Phase A has not. */}
      <LanguageHint locale={locale} />
      <SocialRail bundle={bundle} />
      <WhatsAppFab bundle={bundle} />
      <MobileBottomBar bundle={bundle} />
      <StickyCtaBar
        message={t('home.003')}
        ctas={[
          { label: t('home.004'), href: '/hire-workers' },
          {
            label: t('home.012'),
            href: bundle.settings.portal.host,
            variant: 'secondary',
            external: true,
          },
        ]}
      />
      <ConsentBanner />
    </div>
  );
}
