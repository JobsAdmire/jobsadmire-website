import Image from 'next/image';
import { BRAND } from '@/design/assets/brand';
import { liquidSizes } from '@/design/zoom';

export type LicenceRow = { slot: string; title: string; href: string | null };

/** The `#lisans` block (D26). The design has no such block; it sits where the design's profile
 *  strip is (right under the offices, design 898–905) and carries that strip's legal line
 *  (about.108, legal-flagged, verbatim) and the İŞKUR mark (local, W14; decorative beside the
 *  heading). A slot with no file is a list item marked `data-placeholder`, never a dead link
 *  (D20/W55). Copy arrives resolved from the page, so this server component takes plain strings. */
export function LicenceBlock({
  title,
  body,
  legal,
  openLabel,
  pendingLabel,
  rows,
}: {
  title: string;
  body: string;
  legal: string;
  openLabel: string;
  pendingLabel: string;
  rows: readonly LicenceRow[];
}) {
  return (
    <section
      id="lisans"
      data-testid="about-lisans"
      aria-labelledby="lisans-title"
      className="mt-7 scroll-mt-24 rounded-base border border-border-4 bg-white p-6 sm:p-8"
    >
      <div className="mb-5 flex flex-wrap items-center gap-4">
        {/* `h-12` is 48 px, 36 from 1101: above 1440 it is fetched for 36 px' share (W231) */}
        <Image
          src={BRAND.iskur.src}
          width={48}
          height={48}
          sizes={liquidSizes(36, '48px')}
          alt=""
          className="h-12 w-12 shrink-0 object-contain"
        />
        <div className="min-w-0 flex-1">
          <h2 id="lisans-title" className="m-0 text-card-title">
            {title}
          </h2>
          <p className="m-0 mt-1 text-body-sm text-text-secondary">{body}</p>
        </div>
      </div>
      <p className="m-0 mb-5 text-body-sm text-text-secondary">{legal}</p>
      <ul className="m-0 grid list-none gap-3 p-0 md:grid-cols-2">
        {rows.map((row) => (
          <li
            key={row.slot}
            data-placeholder={row.href ? undefined : row.slot}
            className="flex min-h-[52px] items-center justify-between gap-3 rounded-sm border border-border-2 bg-pale-2 px-4 py-2"
          >
            <span id={`${row.slot}-title`} className="text-body-sm font-extrabold">
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
              <span className="shrink-0 rounded-pill bg-tint px-3 py-1 text-body-sm font-extrabold text-blue-safe">
                {pendingLabel}
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
