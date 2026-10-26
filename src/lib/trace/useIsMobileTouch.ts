'use client';

/**
 * Client-only viewport detection for the trace player, carried over from
 * kids-hub's deviceHooks.
 */

import { useEffect, useState } from 'react';

// A "mobile" viewport is purely a size question: anything at or under
// 1024px gets the phone layout, on any device — no pointer/touch
// requirement, so a narrowed desktop window and a real phone behave the
// same way.
const MOBILE_QUERY = '(max-width: 1024px)';

// Subscribe to a matchMedia query. Returns `false` on the server and during
// the first paint so SSR stays deterministic; the effect upgrades to the
// real value on mount.
function useMediaQuery(query: string, initial = false): boolean {
  const [matches, setMatches] = useState(initial);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [query]);

  return matches;
}

export function useIsMobileTouch(): boolean {
  return useMediaQuery(MOBILE_QUERY);
}
