// Runtime-agnostic (no `server-only`): the Turkish names of the portal's industries, for the
// available workers' "industry" (the feed's `position.group`, contract `candidates.v1`). The
// portal keeps ONE English name per industry and sends `label.tr: null` (owner 2026-11-11, "Make
// them work"), so the site names the industry in Turkish itself; `./pool-candidates.ts` reads this
// only when the feed's Turkish label is missing.

/**
 * The portal's industries (production, 2026-11-11), English name → the Turkish sector name a
 * Turkish job site would print. Matched by the English name — trimmed, case-insensitive — never
 * by the id (the id is the portal's own row id). A name not listed here (a new portal industry)
 * shows its English name on the Turkish page too (`bothLocales`), never a blank: add it here.
 */
export const INDUSTRY_TR: Readonly<Record<string, string>> = {
  Manufacturing: 'Üretim',
  Hospitality: 'Turizm ve Otelcilik',
  Construction: 'İnşaat',
  Agriculture: 'Tarım',
  Textile: 'Tekstil',
  Automotive: 'Otomotiv',
  'Food Processing': 'Gıda Üretimi',
  Logistics: 'Lojistik',
  Mining: 'Madencilik',
  'Healthcare Support': 'Sağlık Destek Hizmetleri',
  'Cleaning Services': 'Temizlik Hizmetleri',
  Security: 'Güvenlik',
  Retail: 'Perakende',
  'Warehousing & Packaging': 'Depolama ve Paketleme',
  Education: 'Eğitim',
  'IT & Software': 'Bilişim ve Yazılım',
  'Office & Administration': 'Ofis ve İdari İşler',
  'Finance & Insurance': 'Finans ve Sigorta',
  'Media & Arts': 'Medya ve Sanat',
  'Sports & Recreation': 'Spor ve Rekreasyon',
  'Public Service & Military': 'Kamu Hizmetleri ve Savunma',
  'Beauty & Personal Care': 'Güzellik ve Kişisel Bakım',
  'Metal & Machinery': 'Metal ve Makine',
  'Chemicals & Plastics': 'Kimya ve Plastik',
  'Wood & Furniture': 'Ağaç İşleri ve Mobilya',
  'Telecommunications & Electronics': 'Telekomünikasyon ve Elektronik',
  'Energy & Utilities': 'Enerji ve Altyapı',
  'Maritime & Fishing': 'Denizcilik ve Balıkçılık',
};

/** Trimmed, inner spaces collapsed, lower case: "  IT  &  software " → "it & software". */
const fold = (name: string): string => name.trim().replace(/\s+/g, ' ').toLowerCase();

const BY_NAME: ReadonlyMap<string, string> = new Map(
  Object.entries(INDUSTRY_TR).map(([en, tr]) => [fold(en), tr]),
);

/** The Turkish name of a portal industry by its English name, or `null` when the list has none. */
export function industryNameTr(english: string | null | undefined): string | null {
  return english ? (BY_NAME.get(fold(english)) ?? null) : null;
}
