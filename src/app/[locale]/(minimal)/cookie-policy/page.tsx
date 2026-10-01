import type { Metadata } from 'next';
import { LegalDocument } from '../_legal/LegalDocument';
import { legalMetadata, loadLegal, type LegalParams } from '../_legal/load';

export function generateMetadata({ params }: { params: LegalParams }): Promise<Metadata> {
  return legalMetadata(params, 'cookiePolicy');
}

/** /cerez-politikasi · /en/cookie-policy — the minimal cookie notice (§10 row 6) under a named
 *  counsel placeholder (D14/D26) until the full policy lands. The consent sheet's policy link
 *  (`sys.consent.policy`) lands here. */
export default async function CookiePolicyPage({ params }: { params: LegalParams }) {
  const { sys, common } = await loadLegal(params, 'cookiePolicy');
  return (
    <LegalDocument
      {...common}
      notice={{
        testId: 'legal-pending',
        placeholder: 'legal-cookie-policy',
        title: sys('legal.cookiePolicy.pendingTitle'),
        body: sys('legal.cookiePolicy.pendingBody'),
      }}
    />
  );
}
