'use client';
import { useState } from 'react';
import { Button, Dialog } from '@/design/primitives';

/** The one gallery entry that cannot be driven from a server component: `Dialog` needs an
 *  `onClose` function, which never crosses the RSC boundary. */
export function DialogDemo({
  open,
  title,
  body,
  close,
}: Record<'open' | 'title' | 'body' | 'close', string>) {
  const [isOpen, setIsOpen] = useState(false);
  const titleId = 'gallery-dialog-title';
  return (
    <>
      <Button variant="secondary" onClick={() => setIsOpen(true)}>
        {open}
      </Button>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} titleId={titleId}>
        <h3 id={titleId} className="text-card-title">
          {title}
        </h3>
        <p className="text-body-sm text-text-secondary">{body}</p>
        <Button variant="primary" onClick={() => setIsOpen(false)}>
          {close}
        </Button>
      </Dialog>
    </>
  );
}
