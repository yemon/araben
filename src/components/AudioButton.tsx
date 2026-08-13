'use client';

import { useRef, useState } from 'react';
import { useT } from '@/lib/i18n/t';
import { dict } from '@/lib/i18n/dict';

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" aria-hidden>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" aria-hidden>
      <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
    </svg>
  );
}
function MutedIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="12"
      height="12"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M11 5 6 9H2v6h4l5 4V5z" />
      <path d="M22 9l-6 6M16 9l6 6" />
    </svg>
  );
}

export function AudioButton({
  src,
  label,
}: {
  src: string | null;
  label: string;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(false);
  const t = useT();

  if (!src) {
    return (
      <button
        type="button"
        disabled
        title={t(dict.word.noAudio)}
        aria-label={t(dict.word.ariaNoAudio)(label)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-muted text-xs cursor-not-allowed opacity-60"
      >
        <MutedIcon />
        <span>{t(dict.word.listen)}</span>
      </button>
    );
  }

  function toggle() {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      a.play().catch(() => setError(true));
    } else {
      a.pause();
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={t(dict.word.ariaPlay)(label)}
      className={
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all font-medium ' +
        (playing
          ? 'text-[color:var(--accent-fg)] shadow-sm'
          : 'border border-border hover:border-accent hover:text-accent bg-surface')
      }
      style={playing ? { background: 'var(--gradient-accent)' } : undefined}
    >
      {error ? <MutedIcon /> : playing ? <PauseIcon /> : <PlayIcon />}
      <span>{playing ? t(dict.word.playing) : t(dict.word.listen)}</span>
      <audio
        ref={audioRef}
        src={src}
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onError={() => setError(true)}
      />
    </button>
  );
}
