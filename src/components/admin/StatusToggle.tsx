'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { PublishStatus } from '@/lib/publishStatus';

/**
 * A row's draft / published switch, for the admin lists. One click sends the
 * other status to `url` and refreshes the list; the switch flips at once and
 * flips back if the save fails.
 *
 * The content sections take PATCH { status }; the trace API takes the same
 * body on PUT, hence `method`.
 */
export function StatusToggle({
  url,
  name,
  status,
  method = 'PATCH',
}: {
  url: string;
  name: string;
  status: string;
  method?: 'PATCH' | 'PUT';
}) {
  const router = useRouter();
  const [current, setCurrent] = useState(status);
  const [busy, setBusy] = useState(false);
  const published = current === 'published';

  async function toggle() {
    const next: PublishStatus = published ? 'draft' : 'published';
    setBusy(true);
    setCurrent(next);
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: next }),
      });
      const result = await res.json().catch(() => ({}));
      if (!result.success) {
        setCurrent(status);
        window.alert(result.error || `Couldn't change the status (error ${res.status})`);
      } else {
        router.refresh();
      }
    } catch {
      setCurrent(status);
      window.alert("Couldn't reach the server — try again");
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={published}
      aria-label={`${name}: ${published ? 'published' : 'draft'}`}
      title={published ? 'Published — click to move back to draft' : 'Draft — click to publish'}
      onClick={toggle}
      disabled={busy}
      className={`inline-flex h-8 shrink-0 items-center gap-2 rounded-full border px-2.5 text-xs font-bold transition-colors disabled:opacity-60 ${
        published
          ? 'border-[color:var(--accent)] bg-accent-soft text-accent'
          : 'border-border bg-accent-2-soft text-accent-2 hover:border-[color:var(--accent-2)]'
      }`}
    >
      {/* The track: knob on the right when published. */}
      <span
        aria-hidden
        className={`relative h-4 w-7 shrink-0 rounded-full transition-colors ${published ? 'bg-accent' : 'bg-[color:var(--border)]'}`}
      >
        <span
          className={`absolute top-0.5 h-3 w-3 rounded-full bg-surface shadow-sm transition-[left] duration-150 ${
            published ? 'left-[0.875rem]' : 'left-0.5'
          }`}
        />
      </span>
      <span className="w-[4.25rem] text-left">{published ? 'Published' : 'Draft'}</span>
    </button>
  );
}
