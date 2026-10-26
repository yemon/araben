'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from './icons';
import { iconButton } from './ui';

/**
 * Delete one row after a confirm. `then` is where to go afterwards; without
 * it the current page just refreshes (a list loses the row).
 */
export function DeleteButton({
  url,
  name,
  then,
  variant = 'icon',
}: {
  url: string;
  name: string;
  then?: string;
  variant?: 'icon' | 'button';
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleDelete() {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setBusy(true);
    try {
      const res = await fetch(url, { method: 'DELETE' });
      const result = await res.json().catch(() => ({}));
      if (!result.success) {
        window.alert(result.error || `Couldn't delete (error ${res.status})`);
        setBusy(false);
        return;
      }
      if (then) router.push(then);
      router.refresh();
    } catch {
      window.alert("Couldn't reach the server — try again");
      setBusy(false);
    }
  }

  if (variant === 'button') {
    return (
      <button
        type="button"
        onClick={handleDelete}
        disabled={busy}
        className="btn btn-ghost text-rose-600 hover:!border-rose-400 hover:!text-rose-700 disabled:opacity-60"
      >
        <Icon name="trash" size={16} />
        {busy ? 'Deleting…' : 'Delete'}
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={busy}
      className={`${iconButton} hover:border-rose-400 hover:text-rose-600 disabled:opacity-50`}
      aria-label={`Delete ${name}`}
      title="Delete"
    >
      <Icon name="trash" size={16} />
    </button>
  );
}
