'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surfaces the real stack trace in the console instead of a silent white screen.
    console.error('Aima experience crashed:', error);
  }, [error]);

  return (
    <div
      style={{
        width: '100%',
        height: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        background: '#000',
        color: '#fff',
        fontFamily: 'system-ui, sans-serif',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>Something interrupted the experience.</p>
      <button
        type="button"
        onClick={reset}
        style={{
          padding: '0.75rem 1.5rem',
          borderRadius: '999px',
          border: '1px solid rgba(255,255,255,0.4)',
          background: 'transparent',
          color: '#fff',
          cursor: 'pointer',
        }}
      >
        Try Again
      </button>
    </div>
  );
}