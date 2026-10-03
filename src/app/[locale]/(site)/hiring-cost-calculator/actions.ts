'use server';
import { getTranslations } from 'next-intl/server';
import { getBundle, makeTf } from '@/content/adapter';
import { getCollection, getRateConfig } from '@/content/collections';
import { createFormAction, type FormActionState } from '@/forms/action';
import { quoteSchema, toCalculatorFields } from './_lib/quote';

/** W3: the one written-quote door. The kernel validates (consent checkbox, W79), wraps the
 *  envelope and redirects to /thank-you?form=calculator (D13); `toFields` maps the parsed form
 *  onto the catalog's ten `calculator` names and rebuilds `estimateSummary` from the `est_*`
 *  inputs in the request locale (`ctx.locale`). */
const run = createFormAction({
  key: 'calculator',
  schema: quoteSchema,
  consent: 'checkbox',
  toFields: async (parsed, _data, { locale }) => {
    const [bundle, translate] = await Promise.all([
      getBundle(locale),
      getTranslations({ locale, namespace: 'sys' }),
    ]);
    return toCalculatorFields(parsed, {
      locale,
      roles: getCollection(bundle, 'calculatorRoles'),
      rateConfig: getRateConfig(bundle),
      t: makeTf(bundle, locale),
      sys: (key, values) => translate(key, values),
    });
  },
});

export async function submitCalculatorQuote(
  prev: FormActionState,
  data: FormData,
): Promise<FormActionState> {
  return run(prev, data);
}
