import 'server-only';
import { qrSvg } from '@/lib/qr';

/** Inline QR for wa.me / Play Store / verify-record links (Contact "In a hurry?", Portal
 *  entry app card, Verify record). Server-rendered markup, zero client JS (W14). The `label`
 *  is the accessible name — pass the localized alt (e.g. contact.089). Renders nothing for
 *  empty text or text too big to encode (`qrSvg` returns `''`), never throwing mid-render. */
export function QrCode({
  text,
  label,
  size = 86,
  className,
}: {
  text: string;
  label: string;
  size?: number;
  className?: string;
}) {
  const svg = qrSvg(text, { size, label });
  if (!svg) return null;
  return (
    <span
      className={['inline-block leading-none', className].filter(Boolean).join(' ')}
      style={{ width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
