'use client';

/** The last resort: it replaces the whole document, so it renders its own `<html>`/`<body>`
 *  and cannot use the layout, the design tokens or next-intl — the locale is unknown here
 *  (the layout is exactly what failed), so the copy is hard-coded in both languages rather
 *  than guessed. Styles are inline for the same reason: `globals.css` is not loaded. */
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="tr">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
          color: '#16202e',
          background: '#ffffff',
        }}
      >
        <main style={{ maxWidth: '520px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '24px', margin: '0 0 8px' }}>Bir şeyler ters gitti</h1>
          <p style={{ margin: '0 0 24px', color: '#4a5566' }}>Something went wrong.</p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              minHeight: '52px',
              padding: '0 28px',
              border: 0,
              borderRadius: '999px',
              background: '#1073a8',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '16px',
              cursor: 'pointer',
            }}
          >
            Tekrar dene / Try again
          </button>
        </main>
      </body>
    </html>
  );
}
