'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { TraceGame } from '@/lib/trace/wordTraceDataManager';
import { arabicTraceFont } from '@/lib/fonts';
import { Icon } from './icons';

/**
 * Admin list of Arabic trace games, carried over from kids-hub's
 * AdminTraceList without its language tabs (araben traces Arabic only).
 * The rows arrive from the server component that renders this; deletes and
 * the draft/published badge are the only reasons it is a client component.
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
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/practice/trace"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-muted transition-colors hover:border-accent hover:text-accent"
            aria-label="Back to the trace game"
            title="Back to the trace game"
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
            <li key={game.id} className="card flex flex-wrap items-center gap-3 p-4">
              <span
                dir="rtl"
                lang="ar"
                className={`rounded-xl bg-surface-2 px-4 py-1 text-3xl font-semibold text-fg ${arabicTraceFont.className}`}
              >
                {game.word || '—'}
              </span>

              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-fg">{game.title}</p>
                <p className="truncate text-sm text-muted">
                  {game.description || 'No description'}
                </p>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  game.status === 'published'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-amber-100 text-amber-700'
                }`}
              >
                {game.status}
              </span>

              <div className="flex gap-2">
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
