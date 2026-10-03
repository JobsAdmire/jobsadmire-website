import type { Locale } from '@/i18n/routing';

/**
 * A `sys` translator as the templates need it. next-intl's `useTranslations('sys')` (islands) and
 * `getTranslations({ locale, namespace: 'sys' })` (server) both satisfy it — the repo's messages
 * are un-augmented (`Record<string, any>`), so keys are plain strings. Client islands pass their
 * translator itself (`makeCardCopy(sys)`), never a `(k, v) => sys(k, v)` wrapper: the W148 scan
 * in `client-messages.test.ts` must be able to read every key a client module passes to `sys`.
 */
export type SysT = (key: string, values?: Record<string, string | number>) => string;

/** The card's composed sentences (`sys.calc.card.*` + the estimate WhatsApp prefill). */
export type CardCopy = {
  forWorkers: (n: string) => string;
  nMonths: (months: number) => string;
  seasonTotal: (months: number) => string;
  threshold: (amount: string, multiplier: string) => string;
  yearNote: (months: number, headcount: number) => string;
  whatsappEstimate: (headcount: string, role: string, salary: string, months: number) => string;
};

export function makeCardCopy(sys: SysT): CardCopy {
  return {
    forWorkers: (n) => sys('calc.card.forWorkers', { n }),
    nMonths: (months) => sys('calc.card.nMonths', { months }),
    seasonTotal: (months) => sys('calc.card.seasonTotal', { months }),
    threshold: (amount, multiplier) => sys('calc.card.threshold', { amount, multiplier }),
    yearNote: (months, headcount) => sys('calc.card.yearNote', { months, headcount }),
    whatsappEstimate: (headcount, role, salary, months) =>
      sys('calc.whatsapp.estimate', { headcount, role, salary, months }),
  };
}

/** Gate 1's live sentences (`sys.calc.quota.*`); plural arguments are numbers, the rest strings. */
export type QuotaCopy = {
  allowed: (n: number) => string;
  msgNo: (staff: number, ratio: number, need: string) => string;
  msgMore: (ratio: number, m: number) => string;
  vsOver: (over: string, need: string) => string;
  vizNone: (n: string) => string;
  vizFull: (staff: string, blocks: number, ratio: number) => string;
  vizPart: (blocks: number, spare: number, need: string) => string;
  vizCap: (blocks: string, cap: number, spare: number, need: string) => string;
};

export function makeQuotaCopy(sys: SysT): QuotaCopy {
  return {
    allowed: (n) => sys('calc.quota.allowed', { n }),
    msgNo: (staff, ratio, need) => sys('calc.quota.msgNo', { staff, ratio, need }),
    msgMore: (ratio, m) => sys('calc.quota.msgMore', { ratio, m }),
    vsOver: (over, need) => sys('calc.quota.vsOver', { over, need }),
    vizNone: (n) => sys('calc.quota.vizNone', { n }),
    vizFull: (staff, blocks, ratio) => sys('calc.quota.vizFull', { staff, blocks, ratio }),
    vizPart: (blocks, spare, need) => sys('calc.quota.vizPart', { blocks, spare, need }),
    vizCap: (blocks, cap, spare, need) => sys('calc.quota.vizCap', { blocks, cap, spare, need }),
  };
}

/** The pass check's live sentences (`sys.calc.pass.*` + its WhatsApp prefill). */
export type PassCopy = {
  count: (clear: number, total: number, unanswered: number) => string;
  quotaOk: (staff: string, allowed: string, headcount: string) => string;
  quotaNo: (headcount: string, need: string, staff: string) => string;
  quotaFix: (need: string, headcount: string) => string;
  salary: (role: string, amount: string, multiplier: string) => string;
  salaryFix: (amount: string) => string;
  amberN: (n: number) => string;
  redN: (n: number) => string;
  unanswered: () => string;
  whatsapp: (role: string, headcount: number, staff: string, summary: string) => string;
};

export function makePassCopy(sys: SysT): PassCopy {
  return {
    count: (clear, total, unanswered) => sys('calc.pass.count', { clear, total, unanswered }),
    quotaOk: (staff, allowed, headcount) => sys('calc.pass.quotaOk', { staff, allowed, headcount }),
    quotaNo: (headcount, need, staff) => sys('calc.pass.quotaNo', { headcount, need, staff }),
    quotaFix: (need, headcount) => sys('calc.pass.quotaFix', { need, headcount }),
    salary: (role, amount, multiplier) => sys('calc.pass.salary', { role, amount, multiplier }),
    salaryFix: (amount) => sys('calc.pass.salaryFix', { amount }),
    amberN: (n) => sys('calc.pass.amberN', { n }),
    redN: (n) => sys('calc.pass.redN', { n }),
    unanswered: () => sys('calc.pass.unanswered'),
    whatsapp: (role, headcount, staff, summary) =>
      sys('calc.whatsapp.passCheck', { role, headcount, staff, summary }),
  };
}

const MULTIPLIER: Record<Locale, Intl.NumberFormat> = {
  tr: new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 2 }),
  en: new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }),
};

/** The bare multiplier ("1,5" / "1.5") — the templates own the `×` / `katı` wording, which is why
 *  the engine's `multiplierLabel` ("1,5×") does not fit the TR sentence. */
export function multiplierNumber(m: number, locale: Locale): string {
  return MULTIPLIER[locale].format(m);
}
