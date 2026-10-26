'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { arabicTraceFont } from '@/lib/fonts';

// Colorful card backgrounds - cycling through them makes each word distinct
const TINTS = [
  'from-rose-100 to-orange-100 border-rose-200',
  'from-sky-100 to-indigo-100 border-sky-200',
  'from-emerald-100 to-teal-100 border-emerald-200',
  'from-amber-100 to-yellow-100 border-amber-200',
  'from-violet-100 to-fuchsia-100 border-violet-200',
];

interface TraceGame {
  id: string;
  slug: string;
  title: string;
  word: string;
  difficulty: string | null;
}

export default function TraceGameList() {
  const [games, setGames] = useState<TraceGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/trace/list')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setGames(data.games);
        } else {
          setError('Failed to load games');
        }
      })
      .catch(() => setError('Failed to load games'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="mt-8 flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-accent border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 rounded-2xl border-2 border-dashed border-border bg-surface p-8 text-center text-muted">
        {error}
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="mt-8 rounded-2xl border-2 border-dashed border-border bg-surface p-8 text-center text-muted">
        No trace games available yet. The database has been set up with sample words.
        <br />
        Run <code className="text-sm bg-bg px-2 py-1 rounded">npm run db:seed</code> if you
        haven't already.
      </div>
    );
  }

  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {games.map((game, i) => (
        <Link
          key={game.id}
          href={`/practice/trace/${game.slug}`}
          className={`group flex flex-col gap-3 rounded-2xl border-2 bg-gradient-to-br p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg ${
            TINTS[i % TINTS.length]
          }`}
        >
          <div className="flex items-center justify-center">
            <svg
              className="h-8 w-8 text-slate-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
              />
            </svg>
          </div>

          {/* Arabic word in trace font */}
          <span
            dir="rtl"
            lang="ar"
            className={`text-center text-4xl font-semibold leading-tight text-slate-800 ${arabicTraceFont.className}`}
          >
            {game.word || game.title}
          </span>

          {/* English title/transliteration */}
          <span className="text-center text-sm font-medium text-slate-600">
            {game.title}
          </span>

          {/* Difficulty badge */}
          {game.difficulty && (
            <span className="self-center rounded-full bg-white/50 px-3 py-1 text-xs font-bold text-slate-600">
              {game.difficulty}
            </span>
          )}
        </Link>
      ))}
    </div>
  );
}
