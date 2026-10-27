'use client';

import { useState } from 'react';
import type { ScenarioVideo } from '@/types/content';
import { useT } from '@/lib/i18n/t';
import { dict } from '@/lib/i18n/dict';

/**
 * The videos illustrating a scenario's dialogue. One player; with several
 * videos, a row of buttons switches between them.
 */
export function ScenarioVideos({ videos }: { videos: ScenarioVideo[] }) {
  const t = useT();
  const [active, setActive] = useState(0);
  const video = videos[active] ?? videos[0];
  if (!video) return null;

  const label = (v: ScenarioVideo, i: number) => v.title || `${t(dict.section.videoPart)} ${i + 1}`;

  return (
    <section className="mt-8 card p-4 sm:p-6" aria-label={t(dict.section.watchDialogue)}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="chip chip-accent">▶ {t(dict.section.watchDialogue)}</div>
        {videos.length > 1 && (
          <div className="flex flex-wrap gap-2" role="group" aria-label={t(dict.section.watchDialogue)}>
            {videos.map((v, i) => (
              <button
                key={v.url}
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={i === active}
                className={`chip transition-colors ${i === active ? 'chip-accent' : 'hover:text-fg'}`}
              >
                {label(v, i)}
              </button>
            ))}
          </div>
        )}
      </div>
      {/* Keyed by URL so switching videos loads the new one from the start. */}
      <video
        key={video.url}
        controls
        preload="metadata"
        playsInline
        className="aspect-video w-full rounded-xl bg-black"
        aria-label={label(video, active)}
      >
        <source src={video.url} type={video.mimeType} />
      </video>
      {videos.length === 1 && video.title && <p className="mt-2 text-sm text-muted">{video.title}</p>}
    </section>
  );
}
