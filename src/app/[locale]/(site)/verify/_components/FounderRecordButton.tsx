'use client';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import type { Representative } from '../_lib/register';
import type { RecordCaps, RecordLabels } from './RecordDialog';

// The dialog is its own chunk, fetched on the first click (`ssr: false` is legal only because
// this module is 'use client').
const RecordDialog = dynamic(() => import('./RecordDialog'), { ssr: false });

/**
 * The founder strip's "Open record" (S3.1, Verify l. 717): opens the record dialog for the
 * founder — the one record the page shows while the register is unpublished (owner ruling). Every
 * label and the record arrive resolved from the server; the photo is the server-rendered slot.
 * `linkable`: the record has a permanent `?id=` URL that opens it (the v1.1 register with the
 * lookup's record view on) — only then does the dialog offer "Copy record link".
 */
export function FounderRecordButton({
  label,
  className,
  record,
  labels,
  caps,
  photo,
  linkable,
  whatsappNumber,
}: {
  label: string;
  className: string;
  record: Representative;
  labels: RecordLabels;
  caps: RecordCaps;
  photo: ReactNode;
  linkable: boolean;
  whatsappNumber: string;
}) {
  const [open, setOpen] = useState(false);
  // R35: the real URL path, never next-intl's internal key.
  const page = usePathname() ?? '/';
  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
        className={className}
      >
        {label}
      </button>
      {open ? (
        <RecordDialog
          open
          record={record}
          labels={labels}
          caps={caps}
          photo={photo}
          recordUrl={linkable ? `${page}?id=${encodeURIComponent(record.id)}` : null}
          whatsappNumber={whatsappNumber}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </>
  );
}
