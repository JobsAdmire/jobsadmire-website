/**
 * D26 Minimum Launchable Content: the İŞKUR licence PDFs are republished at
 * `/hakkimizda#lisans`. Legacy `/certifications` 308s to `/en/about#lisans` and
 * `/tr/certifications` to `/hakkimizda#lisans` (redirects/legacy.json). The files are a
 * §10 row 3 owner input: a slot without its file renders as a named `data-placeholder` row
 * (W55), and the launch profile's content-readiness table lists it until its `file` is set. To
 * publish one, drop the PDF under `public/docs/licence/` and set its `file` here; nothing else
 * changes. The owner supplied the İŞKUR permit, three company certificates and the company
 * profile on 2026-10-06 (W246); the certificates are published with their (expired) validity
 * dates in their titles by owner decision. The annex and ÖİB slots stay placeholders. The
 * company profile joins the list because the design's `/profile/company-profile.pdf` is a 410
 * prefix on the new site (redirects/gone.json).
 */
export type LicenceDoc = {
  /** Slot id — the `data-placeholder` value while the file is missing (W55). */
  slot: `licence-pdf-${string}`;
  /** Title copy: a `sys.about.licence.docs.<key>` message, or a package id. */
  label: { kind: 'sys'; key: string } | { kind: 'package'; id: string };
  /** File name under `public/docs/licence/`, or null while the owner has not supplied it. */
  file: string | null;
};

/** The company profile's slot: the profile strip's "Şirket Profilini İndir →" button (design
 *  About l. 904), not a list row — `LicenceBlock` renders the others as the D26 list. */
export const PROFILE_SLOT = 'licence-pdf-company-profile' as const;

export const LICENCE_DOCS: readonly LicenceDoc[] = [
  {
    slot: 'licence-pdf-iskur-permit',
    label: { kind: 'sys', key: 'iskurPermit' },
    file: 'jobsadmire-iskur-izin-belgesi-1730.pdf',
  },
  { slot: 'licence-pdf-iskur-annex', label: { kind: 'sys', key: 'iskurAnnex' }, file: null },
  {
    slot: 'licence-pdf-oib-certificate',
    label: { kind: 'sys', key: 'oibCertificate' },
    file: null,
  },
  { slot: 'licence-pdf-oib-annex', label: { kind: 'sys', key: 'oibAnnex' }, file: null },
  {
    slot: 'licence-pdf-iso-21001',
    label: { kind: 'sys', key: 'iso21001' },
    file: 'jobsadmire-iso-21001-2018.pdf',
  },
  {
    slot: 'licence-pdf-iso-10002',
    label: { kind: 'sys', key: 'iso10002' },
    file: 'jobsadmire-iso-10002-2018.pdf',
  },
  {
    slot: 'licence-pdf-trusted-brand',
    label: { kind: 'sys', key: 'trustedBrand' },
    file: 'jobsadmire-guvenilir-marka-belgesi.pdf',
  },
  {
    slot: PROFILE_SLOT,
    label: { kind: 'package', id: 'about.031' },
    file: 'jobsadmire-sirket-profili.pdf',
  },
];

export function licenceDocHref(doc: LicenceDoc): string | null {
  return doc.file ? `/docs/licence/${doc.file}` : null;
}
