import type { Metadata } from 'next';
import { Button } from '@/design/primitives/Button';
import { LegalDocument } from '../_legal/LegalDocument';
import { legalMetadata, loadLegal, type LegalParams } from '../_legal/load';

export function generateMetadata({ params }: { params: LegalParams }): Promise<Metadata> {
  return legalMetadata(params, 'privacy');
}

/** /gizlilik · /en/privacy — the old site's 2025 policy, seeded and re-authored (D14, W154).
 *  The cookies section names the Cookie Policy, so the document ends with the door to it (QA W221
 *  LEGAL-04 — the KVKK page points at this one the same way). */
export default async function PrivacyPage({ params }: { params: LegalParams }) {
  const { sys, common } = await loadLegal(params, 'privacy');
  return (
    <LegalDocument {...common}>
      <p className="m-0 mt-8">
        <Button prefetch={false} variant="secondary" href="/cookie-policy">
          {sys('legal.privacy.cookiePolicyLink')}
        </Button>
      </p>
    </LegalDocument>
  );
}
