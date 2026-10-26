import Link from 'next/link';
import TraceGameList from '@/components/trace/TraceGameList';

export const metadata = {
  title: 'Arabic Trace Game',
  description: 'Practice writing Arabic words by tracing them. Pick a word and follow the stroke paths.',
};

export default function TraceListPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[var(--bg)] to-[var(--surface)]">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-fg transition-colors mb-6"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M10 12L6 8l4-4" />
          </svg>
          Back to home
        </Link>

        <h1 className="mt-6 text-3xl font-bold text-fg">
          Arabic Trace Game
        </h1>
        <p className="mt-2 text-base text-muted">
          Pick an Arabic word and practice writing it by following the stroke paths
        </p>

        <TraceGameList />

        {/* Info section */}
        <div className="mt-12 rounded-xl bg-surface border border-border p-6">
          <h2 className="text-lg font-bold text-fg mb-3">How to play</h2>
          <ul className="space-y-2 text-sm text-muted">
            <li className="flex items-start gap-2">
              <span className="text-accent mt-0.5">1.</span>
              <span>Pick a word from the list above</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-0.5">2.</span>
              <span>Start on the numbered badge and follow the arrow</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-0.5">3.</span>
              <span>Stay on the road and trace each stroke to completion</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-0.5">4.</span>
              <span>Letters are traced right to left, one at a time</span>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
