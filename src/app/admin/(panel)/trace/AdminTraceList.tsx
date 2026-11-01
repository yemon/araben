'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { TraceGame } from '@/lib/trace/wordTraceDataManager';
import { StatusToggle } from '@/components/admin/StatusToggle';
import { arabicTraceFont } from '@/lib/fonts';
import { Icon } from './icons';

/**
 * Admin list of Arabic trace games, carried over from kids-hub's
 * AdminTraceList without its language tabs (araben traces Arabic only).
 * The rows arrive from the server component that renders this; deletes are
 * the reason it is a client component, and each row's draft/published
 * switch is the shared StatusToggle.
 */
export default function AdminTraceList({ games }: { games: TraceGame[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete(game: TraceGame) {
    if (!window.confirm(`Delete "${game.title}"? This cannot be undone.`)) {
      return;
    }
    setDeletingId(game.id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/trace/${game.id}`, { method: 'DELETE' });
      const result = await res.json();
      if (result.success) {
        router.refresh();
      } else {
        setError(result.error || 'Failed to delete');
      }
    } catch {
      setError('Error deleting game');
    } finally {
      setDeletingId(null);
    }
  }

  const published = games.filter((g) => g.status === 'published').length;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-muted transition-colors hover:border-accent hover:text-accent"
            aria-label="Back to the dashboard"
            title="Back to the dashboard"
          >
            <Icon name="arrowLeft" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-fg">Manage trace words</h1>
            <p className="text-sm text-muted">
              {games.length} word{games.length === 1 ? '' : 's'}, {published} published —
              only published ones reach the learners.
            </p>
          </div>
        </div>

        <Link href="/admin/trace/create" className="btn btn-primary">
          <Icon name="plus" size={16} strokeWidth={3} />
          New word
        </Link>
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-xl border border-rose-300 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700">
          {error}
        </p>
      )}

      {games.length === 0 ? (
        <p className="mt-6 rounded-3xl border-2 border-dashed border-border bg-surface p-8 text-center text-muted">
          No words yet. Add the first one.
        </p>
      ) : (
        <ul className="mt-6 space-y-3">
          {games.map((game) => (
            // Like the other admin lists: on phones the status sits under
            // the title and the actions stack; wider screens use one row.
            <li
              key={game.id}
              className="card grid grid-cols-[auto_minmax(0,1fr)_auto] gap-x-3 gap-y-2.5 p-4 sm:grid-cols-[auto_minmax(0,1fr)_auto_auto] sm:items-center sm:gap-x-4"
            >
              <span
                dir="rtl"
                lang="ar"
                className={`row-span-2 self-start rounded-xl bg-surface-2 px-3 py-1 text-2xl font-semibold text-fg sm:row-span-1 sm:self-auto sm:px-4 sm:text-3xl ${arabicTraceFont.className}`}
              >
                {game.word || '—'}
              </span>

              <div className="min-w-0">
                <p className="truncate font-semibold text-fg">{game.title}</p>
                <p className="truncate text-sm text-muted">
                  {game.description || 'No description'}
                </p>
              </div>

              <div className="col-start-2 row-start-2 sm:col-start-3 sm:row-start-1">
                <StatusToggle url={`/api/admin/trace/${game.id}`} method="PUT" name={game.title} status={game.status} />
              </div>

              <div className="col-start-3 row-span-2 row-start-1 flex flex-col gap-2 sm:col-start-4 sm:row-span-1 sm:flex-row">
                <Link
                  href={`/admin/trace/edit/${game.id}`}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border text-muted transition-colors hover:border-accent hover:text-accent"
                  aria-label={`Edit ${game.title}`}
                  title="Edit"
                >
                  <Icon name="pencil" size={16} />
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(game)}
                  disabled={deletingId === game.id}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border text-muted transition-colors hover:border-rose-400 hover:text-rose-600 disabled:opacity-50"
                  aria-label={`Delete ${game.title}`}
                  title="Delete"
                >
                  <Icon name="trash" size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
