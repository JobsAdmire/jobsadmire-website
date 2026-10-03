/**
 * Package ids per consumer, keyed by the design dictionary's own names (`k` in
 * design-package/strings/calculator.json) so every label traces back to the design. The page
 * resolves each map once on the server through `makeTf` (W1) and hands an island only its own
 * resolved strings — no bundle, no id ever reaches a client module (D6).
 */
export const CARD_IDS = {
  cReq: 'calc.008',
  cPerMonth: 'calc.009',
  cOneOff: 'calc.010',
  cQuoteArrow: 'calc.011',
  cProfession: 'calc.012',
  cWorkers: 'calc.013',
  cContract: 'calc.014',
  cSalary: 'calc.015',
  cCover: 'calc.016',
  cFlight: 'calc.017',
  cAcc: 'calc.018',
  cAccNote: 'calc.019',
  cSupport: 'calc.020',
  cSupportNote: 'calc.021',
  cSgkDisc: 'calc.022',
  cEst: 'calc.023',
  cMonthly: 'calc.024',
  cGross: 'calc.025',
  cSgkEmp: 'calc.026',
  cState: 'calc.027',
  cMonthlyTotal: 'calc.028',
  cOneOffY1: 'calc.029',
  cPermitFees: 'calc.030',
  cFlightTravel: 'calc.031',
  cServiceFee: 'calc.032',
  cQuotedWritten: 'calc.033',
  cOneOffTotal: 'calc.034',
  cFeeNote: 'calc.035',
  cQuoteBtn: 'calc.036',
  cPrint: 'calc.037',
  sea1: 'calc.038',
  sea2: 'calc.039',
  cQuotaQ1: 'calc.041',
  cQuotaQ2: 'calc.042',
  cQuotaD1: 'calc.043',
  cQuotaStaff: 'calc.044',
  cQuotaD2: 'calc.045',
  cQuotaM1: 'calc.046',
  cQuotaStaffShort: 'calc.047',
  cQuotaM2: 'calc.048',
  cQuotaLink: 'calc.049',
  sheetPick: 'calc.399',
  brkHide: 'calc.421',
  brkShow: 'calc.422',
  advFew: 'calc.423',
  advMore: 'calc.424',
  perWorker: 'calc.463',
  perMonthSuffix: 'calc.464',
  tierManuf: 'calc.466',
  tierOther: 'calc.467',
  tierNone: 'calc.468',
  firstYear: 'calc.469',
  fullYear: 'calc.470',
  chip6: 'calc.471',
  chip9: 'calc.472',
  chip12: 'calc.473',
  allShort: 'calc.475',
} as const;

export const QUOTA_IDS = {
  qG1: 'calc.140',
  qLive: 'calc.141',
  qStaffLbl: 'calc.142',
  qSameBranch: 'calc.143',
  qSplit: 'calc.144',
  qLegTr: 'calc.145',
  qLegPlace: 'calc.146',
  qLegInc: 'calc.147',
  qPicked1: 'calc.148',
  qPicked2: 'calc.149',
  qmS1: 'calc.175',
  qmS1T: 'calc.176',
  qmAns: 'calc.177',
  quotaNone: 'calc.425',
  quotaTitleNo: 'calc.426',
  quotaTitleYes: 'calc.427',
  quotaMsgExact: 'calc.428',
  quotaVsOk: 'calc.429',
} as const;

export const PASS_IDS = {
  pcK: 'calc.376',
  pcReset: 'calc.377',
  pcPriv: 'calc.378',
  pcFix: 'calc.379',
  pcSend: 'calc.413',
  pcYes: 'calc.433',
  pcNo: 'calc.434',
  pcMaybe: 'calc.435',
  pcClear: 'calc.436',
  pcShort: 'calc.437',
  vIdleK: 'calc.438',
  vIdleT: 'calc.439',
  vIdleB: 'calc.440',
  vProgK: 'calc.441',
  vProgT: 'calc.442',
  vProgB: 'calc.443',
  pcConfirm: 'calc.444',
  ckCapT: 'calc.445',
  ckCapB: 'calc.446',
  ckCapF: 'calc.447',
  ckQuoT: 'calc.448',
  ckSgkT: 'calc.449',
  ckSgkB: 'calc.450',
  ckSgkF: 'calc.451',
  ckSalT: 'calc.452',
  ckDocT: 'calc.453',
  ckDocB: 'calc.454',
  ckDocF: 'calc.455',
  vRes: 'calc.456',
  vGreenT: 'calc.457',
  vGreenB: 'calc.458',
  vAmber1: 'calc.459',
  vAmberB: 'calc.460',
  vRed1: 'calc.461',
  vRedB: 'calc.462',
} as const;

export const GUIDE_IDS = {
  sGrossMo: 'calc.096',
  sEmpCost: 'calc.097',
  allInd: 'calc.474',
  skilled: 'calc.476',
  standard: 'calc.477',
  inCalc: 'calc.478',
  useCalc: 'calc.479',
} as const;

export const RECAP_IDS = {
  zEst: 'calc.102',
  zRough: 'calc.103',
  zFee: 'calc.104',
  perMonthSuffix: 'calc.464',
} as const;

export const SHEET_IDS = { title: 'calc.036', intro: 'calc.050', submit: 'calc.105' } as const;

export type Labels<T extends Record<string, string>> = { readonly [K in keyof T]: string };
export type CardLabels = Labels<typeof CARD_IDS>;
export type QuotaLabels = Labels<typeof QUOTA_IDS>;
export type PassLabels = Labels<typeof PASS_IDS>;
export type GuideLabels = Labels<typeof GUIDE_IDS>;
export type RecapLabels = Labels<typeof RECAP_IDS>;
export type SheetLabels = Labels<typeof SHEET_IDS>;

/** One id map resolved through the page's `makeTf` — the only place package copy meets an island. */
export function pickLabels<T extends Record<string, string>>(
  t: (id: string) => string,
  ids: T,
): Labels<T> {
  return Object.fromEntries(Object.entries(ids).map(([k, id]) => [k, t(id)])) as Labels<T>;
}
