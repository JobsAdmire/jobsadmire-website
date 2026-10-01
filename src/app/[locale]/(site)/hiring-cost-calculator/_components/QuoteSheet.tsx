'use client';
import { useTranslations } from 'next-intl';
import { BottomSheet } from '@/design/islands/BottomSheet';
import { Field, type FieldOption } from '@/forms/client/Field';
import { FormShell } from '@/forms/client/FormShell';
import type { FormActionState } from '@/forms/types';
import type { Locale } from '@/i18n/routing';
import type { RateConfig } from '@/lib/calculator';
import { computeCardView, type CardViewLabels, type DesignRole } from '../_lib/card-view';
import { makeCardCopy } from '../_lib/copy';
import type { RecapLabels, SheetLabels } from '../_lib/ids';
import { EstimateFields } from './EstimateFields';
import { useEstimateInputs } from './estimate-store';
import { RecapCard } from './RecapCard';

export type QuoteSheetProps = {
  open: boolean;
  onClose: () => void;
  action: (prev: FormActionState, data: FormData) => Promise<FormActionState>;
  locale: Locale;
  turnstileSiteKey: string | null;
  whatsappNumber: string;
  contact: { phone: string; phoneDisplay?: string; email: string };
  countries: FieldOption[];
  roles: DesignRole[];
  rateConfig: RateConfig;
  roleLabels: Record<string, string>;
  industryLabels: Record<string, string>;
  cardLabels: CardViewLabels;
  recapLabels: RecapLabels;
  labels: SheetLabels & { close: string };
};

/** The written-quote form (W3) in a bottom sheet — its own chunk, loaded on the first quote
 *  click (W13 amended; the WP2a final review asked for exactly this). The design has no form, so
 *  every label is the kernel's `sys.form.labels.*` (W115); `name`/`email` are the door's required
 *  pair; the estimate travels as `est_*` hidden inputs and is rebuilt on the server; the fallback
 *  panel's WhatsApp prefill opens with the estimate (`whatsappIntro`, composed on click — W76). */
export function QuoteSheet({
  open,
  onClose,
  action,
  locale,
  turnstileSiteKey,
  whatsappNumber,
  contact,
  countries,
  roles,
  rateConfig,
  roleLabels,
  industryLabels,
  cardLabels,
  recapLabels,
  labels,
}: QuoteSheetProps) {
  const sys = useTranslations('sys');
  const inputs = useEstimateInputs();
  const view =
    roles.length > 0
      ? computeCardView({
          inputs,
          roles,
          rateConfig,
          locale,
          roleLabels,
          industryLabels,
          labels: cardLabels,
          copy: makeCardCopy(sys),
        })
      : null;
  return (
    <BottomSheet open={open} onClose={onClose} title={labels.title} closeLabel={labels.close}>
      <p className="m-0 mb-4 text-body-sm text-text-secondary">{labels.intro}</p>
      {view ? (
        <>
          <RecapCard view={view} labels={recapLabels} />
          <p className="m-0 mt-2 mb-4 text-body-sm text-text-tertiary">
            {sys('calc.quote.attached')}
          </p>
        </>
      ) : null}
      <FormShell
        action={action}
        formKey="calculator"
        idScope="calc-quote"
        locale={locale}
        turnstileSiteKey={turnstileSiteKey}
        whatsappNumber={whatsappNumber}
        whatsappIntro={view?.whatsappEstimate}
        contact={contact}
        submitLabel={labels.submit}
        consent="checkbox"
        headingLevel={3}
        testId="calc-quote-form"
      >
        <EstimateFields />
        <Field name="name" required autoComplete="name" />
        <Field name="email" type="email" required autoComplete="email" inputMode="email" />
        <Field name="phone" type="tel" autoComplete="tel" inputMode="tel" />
        <Field name="company" autoComplete="organization" />
        <Field name="country" as="select" autoComplete="country" options={countries} />
        <Field name="message" as="textarea" rows={3} />
      </FormShell>
    </BottomSheet>
  );
}
