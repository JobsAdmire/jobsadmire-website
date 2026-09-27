'use client';
import { useState } from 'react';
import { Button } from '@/design/primitives';

/** What the gallery's `LazyIsland` loads — a real `import()` chunk. Its count survives
 *  scrolling away and back, because `LazyIsland` keeps an island mounted once loaded (W132). */
export default function LazyCounter({ label }: { label: string }) {
  const [count, setCount] = useState(0);
  return (
    <Button variant="secondary" onClick={() => setCount((c) => c + 1)}>
      {`${label}: ${count}`}
    </Button>
  );
}
