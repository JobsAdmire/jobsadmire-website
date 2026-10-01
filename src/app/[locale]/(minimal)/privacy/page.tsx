import type { Metadata } from 'next';
import { LegalDocument } from '../_legal/LegalDocument';
import { legalMetadata, loadLegal, type LegalParams } from '../_legal/load';

export function generateMetadata({ params }: { params: LegalParams }): Promise<Metadata> {
  return legalMetadata(params, 'privacy');
}

/** /gizlilik · /en/privacy — the old site's 2025 policy, seeded and re-authored (D14, W154). */
export default async function PrivacyPage({ params }: { params: LegalParams }) {
  const { common } = await loadLegal(params, 'privacy');
  return <LegalDocument {...common} />;
}
