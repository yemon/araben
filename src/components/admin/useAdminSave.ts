'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Saving an admin form: send it, go back to the list on success (the list is
 * the confirmation), show the server's message on failure. While there are
 * unsaved changes the browser asks before leaving the page.
 */
export function useAdminSave<T>(form: T) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dirty = differs from the form as first loaded (or as last saved).
  const initial = useRef(JSON.stringify(form));
  const latest = useRef(form);
  latest.current = form;
  const dirty = JSON.stringify(form) !== initial.current;

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const save = useCallback(
    async (url: string, method: 'POST' | 'PUT', body: unknown, then: string) => {
      setSaving(true);
      setError(null);
      try {
        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        const result = await res.json().catch(() => ({}));
        if (result.success) {
          // What was on screen is now what's saved. (Not `body`: forms send
          // a reshaped copy of their state.)
          initial.current = JSON.stringify(latest.current);
          setSaving(false);
          router.push(then);
          router.refresh();
          return;
        }
        setError(result.error || `Couldn't save (error ${res.status})`);
      } catch {
        setError("Couldn't reach the server — check your connection and try again");
      }
      setSaving(false);
    },
    [router],
  );

  return { saving, error, setError, dirty, save };
}
