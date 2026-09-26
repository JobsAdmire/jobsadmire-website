'use client';
import SiteError from '../(site)/error';

/** Same view as the `(site)` boundary, mounted inside the minimal chrome. */
export default function MinimalError(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <SiteError {...props} />;
}
