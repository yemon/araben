'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { DialogueTurn, ScenarioVideo } from '@/types/content';
import { useT } from '@/lib/i18n/t';
import { dict } from '@/lib/i18n/dict';
import { ScenarioLinePanel } from './ScenarioLinePanel';

/**
 * A scenario's videos with its dialogue beside them (ScenarioLinePanel).
 * One player; with several videos, a row of buttons switches between them.
 *
 * The first video can be synced to the dialogue: each timed line starts at
 * its startSec and lasts until the next timed line starts. While it plays,
 * the panel follows the line being spoken, and with "Pause after each line"
 * on, the video stops as each line ends and waits for the learner.
 */

type Cue = { turn: number; start: number };

export function ScenarioVideos({ videos, turns }: { videos: ScenarioVideo[]; turns: DialogueTurn[] }) {
  const t = useT();
  const [activeVideo, setActiveVideo] = useState(0);
  const video = videos[activeVideo] ?? videos[0];
  const videoRef = useRef<HTMLVideoElement>(null);

  // Timed lines, in order. Times rise down the dialogue (the admin checks).
  const cues = useMemo<Cue[]>(
    () => turns.flatMap((turn, i) => (turn.startSec === undefined ? [] : [{ turn: i, start: turn.startSec }])),
    [turns],
  );
  const synced = activeVideo === 0 && cues.length > 0;

  // On for every visit: studying line by line is the point of the page.
  const [pauseEach, setPauseEach] = useState(true);

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
          // A line just ended: stop, and keep it showing until the learner
          // moves on.
          v.pause();
          setHeld(true);
          setCue(finished);
          return;
        }
        setCue(k);
      }
      raf = requestAnimationFrame(tick);
    };
    const onPlay = () => {
      // Moving on from a held line: the next one is already under way.
      if (heldRef.current) setCue(lastCue.current);
      setHeld(false);
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    };
    const onPause = () => cancelAnimationFrame(raf);
    // A seek is the learner choosing where to be: no stop at a boundary.
    const onSeeked = () => {
      setHeld(false);
      lastCue.current = cueAt(v.currentTime);
      setCue(lastCue.current);
    };
    // At the end the panel goes back to its resting state.
    const onEnded = () => {
      setHeld(false);
      lastCue.current = -1;
      setCue(-1);
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
  }, [synced, cueAt, video?.url]);

  // Switching to an unsynced video clears the line.
  useEffect(() => {
    if (!synced) {
      lastCue.current = -1;
      setCue(-1);
      setHeld(false);
    }
  }, [synced]);

  // Play the synced video from a line (the panel's list).
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
    },
    [cues, activeVideo],
  );

  // Previous / next line: jump to that line's start and play it. From a line
  // held at its end, "next" is the line that was about to start.
  const goToCue = (k: number) => {
    const target = cues[k];
    const v = videoRef.current;
    if (!target || !v) return;
    v.currentTime = target.start;
    v.play().catch(() => {});
  };

  if (!video) return null;

  const label = (v: ScenarioVideo, i: number) => v.title || `${t(dict.section.videoPart)} ${i + 1}`;
  // A header row only when there are videos to switch between; a lone video
  // starts right at the top of the card.
  const switcher = videos.length > 1;

  return (
    // On wide screens the dialogue panel sits beside the video, within the
    // page column; narrower screens stack it underneath.
    <section className="mb-8 card p-4 sm:p-5" aria-label={t(dict.section.watchDialogue)}>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_21rem] lg:gap-6">
        <div className="min-w-0">
          {switcher && (
            <div className="mb-3 flex flex-wrap gap-2" role="group" aria-label={t(dict.section.watchDialogue)}>
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
        </div>

        <ScenarioLinePanel
          className={switcher ? 'lg:mt-11' : ''}
          turns={turns}
          synced={synced}
          activeTurn={synced && cue >= 0 ? cues[cue].turn : null}
          position={synced && cue >= 0 ? cue + 1 : null}
          timedCount={cues.length}
          pauseEach={pauseEach}
          onPauseEachChange={setPauseEach}
          onPrev={cue > 0 ? () => goToCue(cue - 1) : undefined}
          onNext={cue < cues.length - 1 ? () => goToCue(cue + 1) : undefined}
          onPlayFrom={playFrom}
        />
      </div>
    </section>
  );
}
