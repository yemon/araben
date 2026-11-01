'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { DialogueTurn, ScenarioVideo } from '@/types/content';
import { useT } from '@/lib/i18n/t';
import { useLang } from '@/lib/i18n/LangProvider';
import { dict } from '@/lib/i18n/dict';

/**
 * The videos illustrating a scenario's dialogue. One player; with several
 * videos, a row of buttons switches between them.
 *
 * The first video can be synced to the dialogue: each timed line starts at
 * its startSec and lasts until the next timed line starts. While it plays,
 * the current line shows as a caption under the video and is reported to
 * the page (onActiveTurn) to highlight in the transcript; with "Pause after
 * each line" on, the video stops as each line ends and waits for the learner.
 */

const PAUSE_KEY = 'araben.pauseEachLine';

type Cue = { turn: number; start: number };

export function ScenarioVideos({
  videos,
  turns = [],
  onActiveTurn,
  seekRef,
}: {
  videos: ScenarioVideo[];
  turns?: DialogueTurn[];
  onActiveTurn?: (turn: number | null) => void;
  // Filled with a function that plays the synced video from a given line.
  seekRef?: React.MutableRefObject<((turn: number) => void) | null>;
}) {
  const t = useT();
  const { lang } = useLang();
  const [activeVideo, setActiveVideo] = useState(0);
  const video = videos[activeVideo] ?? videos[0];
  const videoRef = useRef<HTMLVideoElement>(null);

  // Timed lines, in order. Times rise down the dialogue (the admin checks).
  const cues = useMemo<Cue[]>(
    () => turns.flatMap((turn, i) => (turn.startSec === undefined ? [] : [{ turn: i, start: turn.startSec }])),
    [turns],
  );
  const synced = activeVideo === 0 && cues.length > 0;

  const [pauseEach, setPauseEach] = useState(true);
  useEffect(() => {
    try {
      if (localStorage.getItem(PAUSE_KEY) === 'off') setPauseEach(false);
    } catch {}
  }, []);
  const togglePause = (on: boolean) => {
    setPauseEach(on);
    try {
      localStorage.setItem(PAUSE_KEY, on ? 'on' : 'off');
    } catch {}
  };

  const [cue, setCue] = useState(-1); // index into cues; -1 before the first line
  const [held, setHeld] = useState(false); // paused by us at the end of a line
  const heldRef = useRef(false);
  heldRef.current = held;
  const lastCue = useRef(-1);
  const pauseEachRef = useRef(pauseEach);
  pauseEachRef.current = pauseEach;

  const cueAt = useCallback(
    (time: number) => {
      let k = -1;
      // A hair of slack so a seek to a line's exact start lands in it.
      for (let i = 0; i < cues.length; i++) if (time + 0.02 >= cues[i].start) k = i;
      return k;
    },
    [cues],
  );

  const show = useCallback(
    (k: number) => {
      setCue(k);
      onActiveTurn?.(k >= 0 ? cues[k].turn : null);
    },
    [cues, onActiveTurn],
  );

  // Follow playback frame by frame — timeupdate fires only ~4 times a second,
  // too coarse to stop at the end of a line.
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !synced) return;
    let raf = 0;
    const tick = () => {
      const k = cueAt(v.currentTime);
      if (k !== lastCue.current) {
        const finished = lastCue.current;
        lastCue.current = k;
        if (pauseEachRef.current && k === finished + 1 && finished >= 0) {
          // A line just ended: stop, and keep it highlighted until the
          // learner moves on.
          v.pause();
          setHeld(true);
          show(finished);
          return;
        }
        show(k);
      }
      raf = requestAnimationFrame(tick);
    };
    const onPlay = () => {
      // Moving on from a held line: the next one is already under way.
      if (heldRef.current) show(lastCue.current);
      setHeld(false);
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    };
    const onPause = () => cancelAnimationFrame(raf);
    // A seek is the learner choosing where to be: no stop at a boundary.
    const onSeeked = () => {
      setHeld(false);
      lastCue.current = cueAt(v.currentTime);
      show(lastCue.current);
    };
    // At the end the transcript goes back to normal reading.
    const onEnded = () => {
      setHeld(false);
      lastCue.current = -1;
      show(-1);
    };
    v.addEventListener('play', onPlay);
    v.addEventListener('pause', onPause);
    v.addEventListener('seeked', onSeeked);
    v.addEventListener('ended', onEnded);
    if (!v.paused) onPlay();
    return () => {
      cancelAnimationFrame(raf);
      v.removeEventListener('play', onPlay);
      v.removeEventListener('pause', onPause);
      v.removeEventListener('seeked', onSeeked);
      v.removeEventListener('ended', onEnded);
    };
  }, [synced, cueAt, show, video?.url]);

  // Switching to an unsynced video clears the highlight.
  useEffect(() => {
    if (!synced) {
      lastCue.current = -1;
      setCue(-1);
      setHeld(false);
      onActiveTurn?.(null);
    }
  }, [synced, onActiveTurn]);

  // Play the synced video from a line (the transcript's ▶ buttons).
  const pendingSeek = useRef<number | null>(null);
  const playFrom = useCallback(
    (turn: number) => {
      const target = cues.find((c) => c.turn === turn);
      if (!target) return;
      if (activeVideo !== 0) {
        pendingSeek.current = target.start;
        setActiveVideo(0);
        return;
      }
      const v = videoRef.current;
      if (!v) return;
      v.currentTime = target.start;
      v.play().catch(() => {});
      v.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    },
    [cues, activeVideo],
  );
  useEffect(() => {
    if (seekRef) seekRef.current = playFrom;
  }, [seekRef, playFrom]);

  if (!video) return null;

  const label = (v: ScenarioVideo, i: number) => v.title || `${t(dict.section.videoPart)} ${i + 1}`;
  const line = synced && cue >= 0 ? turns[cues[cue].turn] : null;
  // Both translations, the site's language first.
  const translations = line
    ? [
        { text: line.bangla, lang: 'bn', className: 'bn text-base text-fg' },
        { text: line.english, lang: 'en', className: 'text-sm text-fg-2' },
      ]
        .sort((a, b) => (a.lang === lang ? -1 : b.lang === lang ? 1 : 0))
        .filter((x) => x.text)
    : [];

  const player = (
    <>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="chip chip-accent">▶ {t(dict.section.watchDialogue)}</div>
        {videos.length > 1 && (
          <div className="flex flex-wrap gap-2" role="group" aria-label={t(dict.section.watchDialogue)}>
            {videos.map((v, i) => (
              <button
                key={v.url}
                type="button"
                onClick={() => setActiveVideo(i)}
                aria-pressed={i === activeVideo}
                className={`chip transition-colors ${i === activeVideo ? 'chip-accent' : 'hover:text-fg'}`}
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
        ref={videoRef}
        controls
        preload="metadata"
        playsInline
        className="aspect-video w-full rounded-xl bg-black"
        aria-label={label(video, activeVideo)}
        onLoadedMetadata={(e) => {
          if (pendingSeek.current !== null) {
            e.currentTarget.currentTime = pendingSeek.current;
            pendingSeek.current = null;
            e.currentTarget.play().catch(() => {});
          }
        }}
      >
        <source src={video.url} type={video.mimeType} />
      </video>
    </>
  );

  if (!synced) {
    return (
      <section className="my-8 card p-4 sm:p-6" aria-label={t(dict.section.watchDialogue)}>
        {player}
        {videos.length === 1 && video.title && <p className="mt-2 text-sm text-muted">{video.title}</p>}
      </section>
    );
  }

  return (
    // On wide screens the line panel sits beside the video, within the page
    // column; narrower screens stack it underneath.
    <section className="my-8 card p-4 sm:p-6" aria-label={t(dict.section.watchDialogue)}>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_16.5rem] lg:gap-5">
        <div className="min-w-0">{player}</div>

        {/* The line being spoken; each new line replaces the last. */}
        <aside className="flex min-h-[14rem] flex-col rounded-2xl border border-border bg-surface-2 p-4 lg:mt-11">
          <div className="flex min-h-[1rem] items-center justify-between gap-2 text-xs">
            <span className="font-semibold uppercase tracking-wider text-accent">{line?.speaker}</span>
            {cue >= 0 && <span className="tabular-nums text-muted">{t(dict.section.lineOf)(cue + 1, cues.length)}</span>}
          </div>

          <div className="flex flex-1 flex-col justify-center gap-2 py-4 text-center" aria-live="polite">
            {line ? (
              <>
                <p className="ar text-fg" lang="ar" style={{ fontSize: '1.6rem', lineHeight: 1.65 }}>
                  {line.arabic}
                </p>
                <p className="translit text-sm">{line.transliteration}</p>
                {translations.length > 0 && (
                  <div className="mt-1 space-y-1.5 border-t border-border pt-3">
                    {translations.map((x) => (
                      <p key={x.lang} className={x.className} lang={x.lang}>
                        {x.text}
                      </p>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <p className={`mx-auto max-w-[16rem] text-sm text-muted ${lang === 'en' ? '' : 'bn'}`}>
                {t(dict.section.syncHint)}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-fg-2">
              <input
                type="checkbox"
                checked={pauseEach}
                onChange={(e) => togglePause(e.target.checked)}
                className="h-4 w-4 accent-[color:var(--accent)]"
              />
              {t(dict.section.pauseEachLine)}
            </label>
            {held && (
              <button
                type="button"
                onClick={() => videoRef.current?.play().catch(() => {})}
                className="btn btn-primary !px-4 !py-2 text-sm"
              >
                {t(dict.section.nextLine)} ▶
              </button>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}
