import type { Metadata } from 'next';
import { LegalDocument } from '../_legal/LegalDocument';
import { legalMetadata, loadLegal, type LegalParams } from '../_legal/load';

export function generateMetadata({ params }: { params: LegalParams }): Promise<Metadata> {
  return legalMetadata(params, 'terms');
}

/** /kullanim-kosullari · /en/terms. §10 row 6: the Terms exist in English only until counsel's
 *  Turkish text lands — the TR route says so in a named placeholder (D26/W55) and marks the
 *  English text with `lang="en"` (WCAG 3.1.2); the EN route renders neither. */
export default async function TermsPage({ params }: { params: LegalParams }) {
  const { locale, sys, common } = await loadLegal(params, 'terms');
  const englishOnly = locale === 'tr';
  return (
    <LegalDocument
      {...common}
      bodyLang={englishOnly ? 'en' : undefined}
      notice={
        englishOnly
          ? {
              testId: 'legal-notice',
              placeholder: 'legal-terms-tr',
              body: sys('legal.terms.englishOnlyNotice'),
            }
          : null
      }
    >
      <p
        data-testid="legal-final-note"
        className="mt-10 border-t border-border-2 pt-6 text-body-sm font-semibold text-text-secondary"
      >
        {sys('legal.terms.finalNote')}
      </p>
    </LegalDocument>
  );
}
