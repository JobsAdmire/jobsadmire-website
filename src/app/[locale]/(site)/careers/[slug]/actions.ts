'use server';
import { getTranslations } from 'next-intl/server';
import { createFormAction, type FormActionState } from '@/forms/action';
import { uploadCv } from '@/forms/uploads';
import { getOpening } from '@/lib/careers';
import { applySchema, applyToFields } from './_lib/apply';

/**
 * The per-opening application → form key `careers` (CAREERS_APPLY, I5). The opening is read
 * again here — the rules are checked against what Operations serves now, never against what
 * the page sent — and the CV goes to the public upload door first, inside this one action call
 * (W73/W116). An Operations outage while reading the opening throws out of `toFields`, which the
 * kernel answers with the `unavailable` panel (D11). Success is `/tesekkurler?form=careers` (D13).
 */
const submit = createFormAction({
  key: 'careers',
  schema: applySchema,
  consent: 'checkbox',
  toFields: async (parsed, _data, { locale }) => {
    const sys = await getTranslations({ locale, namespace: 'sys' });
    return applyToFields(parsed, {
      opening: await getOpening(parsed.openingSlug),
      upload: (file) => uploadCv(file, { field: 'cv' }),
      messages: {
        closed: sys('careers.form.closed'),
        portfolioGate: sys('careers.form.portfolioGate'),
      },
    });
  },
});

export async function submitCareersApplication(
  prev: FormActionState,
  data: FormData,
): Promise<FormActionState> {
  return submit(prev, data);
}
