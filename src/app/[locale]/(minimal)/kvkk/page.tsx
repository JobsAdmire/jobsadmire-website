import type { Metadata } from 'next';
import { Button } from '@/design/primitives/Button';
import { LegalDocument } from '../_legal/LegalDocument';
import { legalMetadata, loadLegal, type LegalParams } from '../_legal/load';

export function generateMetadata({ params }: { params: LegalParams }): Promise<Metadata> {
  return legalMetadata(params, 'kvkk');
}

/** /kvkk · /en/kvkk — the KVKK aydınlatma metni is counsel's (D14); until it lands the page is a
 *  named placeholder pointing at the Privacy Policy (W79: no form links here meanwhile). */
export default async function KvkkPage({ params }: { params: LegalParams }) {
  const { sys, common } = await loadLegal(params, 'kvkk');
  return (
    <LegalDocument
      {...common}
      notice={{
        testId: 'legal-pending',
        placeholder: 'legal-kvkk',
        title: sys('legal.kvkk.pendingTitle'),
        body: sys('legal.kvkk.pendingBody'),
        action: (
          <Button variant="secondary" href="/privacy">
            {sys('legal.kvkk.privacyLink')}
          </Button>
        ),
      }}
    />
  );
}
