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
    console.error('Dashboard error:', error);
  }, [error]);

  return (
    <div className="p-4">
      <h2 className="text-xl text-red-500">Something went wrong!</h2>
      <p>{error.message || 'Failed to load dashboard.'}</p>
      <button
        onClick={reset}
        className="mt-4 bg-blue-500 text-white p-2 rounded"
      >
        Try Again
      </button>
    </div>
  );
}