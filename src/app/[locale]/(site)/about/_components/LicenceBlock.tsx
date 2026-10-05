import Image from 'next/image';
import { BRAND } from '@/design/assets/brand';
import { liquidSizes } from '@/design/zoom';

export type LicenceRow = { slot: string; title: string; href: string | null };

/** The strip's download: the company profile PDF (`licence-pdf-company-profile`). */
export type ProfileDownload = {
  slot: string;
  /** about.109 "Şirket Profilini İndir →" */
  label: string;
  href: string | null;
  /** `sys.about.profileSoon` — shown under the disabled button while there is no file */
  soonNote: string;
};

/** The download button's face: the design's r10 blue rectangle on desktop (About l. 904,
 *  #1899D5 → the contrast-safe blue, D20), and on phones (≤ 900, l. 382) a full-width 46 px pill
 *  in the pale #f4f9fc / #bfdff0 / #1073a8 face. */
const DOWNLOAD =
  'inline-flex items-center justify-center rounded-[10px] bg-blue-safe px-6.5 py-3.25 text-[14.5px] font-extrabold whitespace-nowrap text-white no-underline xl:text-[11px] max-lg:min-h-[46px] max-lg:w-full max-lg:rounded-pill max-lg:border-[1.5px] max-lg:border-tint-border max-lg:bg-pale-1 max-lg:text-blue-safe';

/**
 * The `#lisans` block (D26) in the design's profile strip (About l. 898–905): one white r16 row
 * under the offices — the İŞKUR mark, the legal line (about.108, legal-flagged, verbatim) and
 * "Şirket Profilini İndir →" (about.109). The company profile PDF is not in the repo yet, so the
 * button is a disabled `<button>` named `data-placeholder="licence-pdf-company-profile"` with the
 * `sys.about.profileSoon` note under it (never a dead link, W55/D20); once the file is set it is a
 * PDF link in the same face. D26 still republishes the four İŞKUR licence documents here, so a
 * compact list follows under a hairline, headed by `sys.about.licence.title`: a slot with no
 * file is a list item marked `data-placeholder`, never a dead link. Phones (≤ 900, l. 378–382):
 * the logo in a pale tile, the legal line full width, the button a full-width pale pill. Copy
 * arrives resolved from the page, so this server component takes plain strings.
 */
export function LicenceBlock({
  title,
  body,
  legal,
  openLabel,
  pendingLabel,
  profile,
  rows,
}: {
  title: string;
  body: string;
  legal: string;
  openLabel: string;
  pendingLabel: string;
  profile: ProfileDownload;
  rows: readonly LicenceRow[];
}) {
  const noteId = `${profile.slot}-note`;
  return (
    <section
      id="lisans"
      data-testid="about-lisans"
      aria-labelledby="lisans-title"
      className="mt-7 scroll-mt-24 rounded-base border border-border-4 bg-white px-7 py-5 max-lg:rounded-md max-lg:border-edge-soft max-lg:px-4 max-lg:py-3.5 max-lg:shadow-[0_8px_22px_rgba(22,60,90,0.06)]"
    >
      <div className="flex flex-wrap items-center justify-between gap-6 max-lg:gap-3">
        <div className="flex min-w-0 items-center gap-4 max-lg:basis-full max-lg:gap-3">
          {/* `h-[42px]` is 31.5 from 1101: above 1440 it is fetched for 31.5 px' share (W231) */}
          <Image
            src={BRAND.iskur.src}
            width={42}
            height={42}
            sizes={liquidSizes(31.5, '42px')}
            alt=""
            className="h-[42px] w-[42px] shrink-0 object-contain xl:h-[31.5px] xl:w-[31.5px] max-lg:box-content max-lg:h-8 max-lg:w-8 max-lg:rounded-[10px] max-lg:border max-lg:border-edge-soft max-lg:bg-pale-1 max-lg:px-2 max-lg:py-1.5"
          />
          <p className="m-0 text-body-sm leading-[1.55] text-text-secondary max-lg:text-[12.5px] max-lg:leading-[1.6]">
            {legal}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1.5 max-lg:basis-full max-lg:items-stretch">
          {profile.href ? (
            <a
              href={profile.href}
              type="application/pdf"
              className={`${DOWNLOAD} ja-hover-lift hover:bg-blue-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe`}
            >
              {profile.label}
            </a>
          ) : (
            <>
              <button
                type="button"
                disabled
                data-placeholder={profile.slot}
                aria-describedby={noteId}
                className={`${DOWNLOAD} cursor-not-allowed opacity-60`}
              >
                {profile.label}
              </button>
              <p
                id={noteId}
                className="m-0 text-[12px] font-semibold text-text-tertiary xl:text-[11px] max-lg:text-center"
              >
                {profile.soonNote}
              </p>
            </>
          )}
        </div>
      </div>
      <div className="mt-5 border-t border-border-4 pt-4 max-lg:mt-3.5 max-lg:pt-3">
        <h2 id="lisans-title" className="m-0 text-eyebrow tracking-[1.2px] text-ink uppercase">
          {title}
        </h2>
        <p className="m-0 mt-1 mb-3 text-body-sm text-text-secondary">{body}</p>
        <ul className="m-0 grid list-none gap-2 p-0 md:grid-cols-2">
          {rows.map((row) => (
            <li
              key={row.slot}
              data-placeholder={row.href ? undefined : row.slot}
              className="flex min-h-[44px] items-center justify-between gap-3 rounded-sm border border-border-2 bg-pale-2 px-3.5 py-1.5"
            >
              <span id={`${row.slot}-title`} className="text-body-sm font-bold">
                {row.title}
              </span>
              {row.href ? (
                <a
                  href={row.href}
                  type="application/pdf"
                  aria-describedby={`${row.slot}-title`}
                  className="inline-flex min-h-[44px] shrink-0 items-center text-body-sm font-extrabold text-blue-safe underline-offset-4 hover:underline"
                >
                  {openLabel}
                </a>
              ) : (
                <span className="shrink-0 rounded-pill bg-tint px-3 py-1 text-[12px] font-extrabold text-blue-safe xl:text-[11px]">
                  {pendingLabel}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
