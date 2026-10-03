import { useTranslations } from 'next-intl';
import { makeTf } from '@/content/pure';
import { START_WHEN_KEYS } from '@/forms/options';
import { waLink } from '@/lib/contact';
import { HeroLeadForm, type HeroLeadFormProps } from '../components/HeroLeadForm';
import { HERO_SECTOR_KEYS, HERO_SECTOR_LABEL_IDS, START_WHEN_LABEL_IDS } from '../lib/forms';
import type { SectionProps } from './types';

/** Resolves the lead card's copy and options on the server (package ids through `makeTf`,
 *  `sys.*` here) and hands the client component plain strings — so neither `sys.home` nor the
 *  bundle reaches the browser for it (W148). */
export function HeroForm({
  locale,
  bundle,
  actions,
}: SectionProps & { actions: HeroLeadFormProps['actions'] }) {
  const tf = makeTf(bundle, locale);
  const sys = useTranslations('sys');
  const s = bundle.settings;
  return (
    <HeroLeadForm
      locale={locale}
      actions={actions}
      turnstileSiteKey={s.turnstileSiteKey}
      whatsappNumber={s.whatsappNumber}
      whatsappHref={waLink(s.whatsappNumber, sys('home.whatsapp.hire'))}
      contact={{ phone: s.phone, phoneDisplay: s.phoneDisplay, email: s.email }}
      options={{
        sector: HERO_SECTOR_KEYS.map((value) => ({
          value,
          label: tf(HERO_SECTOR_LABEL_IDS[value]),
        })),
        startWhen: START_WHEN_KEYS.map((value) => ({
          value,
          label: tf(START_WHEN_LABEL_IDS[value]),
        })),
      }}
      copy={{
        title: tf('home.025'),
        titleMobile: tf('home.026'),
        badge: tf('home.027'),
        sub: tf('home.028'),
        openProposal: tf('home.029'),
        openCallback: tf('home.030'),
        callbackNote: tf('home.031'),
        labels: {
          company: tf('home.032'),
          name: tf('home.033'),
          phone: tf('home.034'),
          sector: tf('home.035'),
          headcount: tf('home.041'),
          city: tf('home.042'),
          startWhen: tf('home.043'),
        },
        submitHire: tf('home.048'),
        submitCallback: sys('home.form.callbackSubmit'),
        whatsapp: tf('home.049'),
      }}
    />
  );
}
