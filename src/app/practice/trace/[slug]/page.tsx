'use client';

/**
 * Arabic Word Trace Player
 *
 * The child traces an Arabic word stroke by stroke — start on the numbered dot,
 * follow the arrow to the end of the line — letter after letter, right to left.
 *
 * The frame follows kids-hub's player: on a wide screen, a header (Back, Home,
 * title bar) over a content card holding the paper; on a phone, the page goes
 * `fixed inset-0` with Back and Home stacked beside the paper.
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ArabicTraceSurface from '@/components/trace/ArabicTraceSurface';
import TraceGameHeader, { TraceNavButtons } from '@/components/trace/TraceGameHeader';
import { arabicTraceFont } from '@/lib/fonts';
import { isTraceableWord } from '@/lib/trace/traceLanguages';
import { useIsMobileTouch } from '@/lib/trace/useIsMobileTouch';

const BACK_HREF = '/practice/trace';

export default function TracePlayerPage() {
  const params = useParams();
  const slug = params.slug as string;

  const isMobile = useIsMobileTouch();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gameData, setGameData] = useState<any>(null);
  const [finished, setFinished] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  // Bumped by "Trace again" to remount the surface: its canvas and stroke
  // engine live inside it, so resetting page state alone leaves the paper
  // fully traced.
  const [round, setRound] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      setGameData(null);
      setFinished(false);
      setCelebrating(false);

      try {
        const res = await fetch(`/api/trace/${slug}`);
        const result = await res.json();

        if (cancelled) return;

        if (result.success) {
          setGameData(result.data);
        } else {
          setError('Game not found');
        }
      } catch (err) {
        if (!cancelled) setError('Failed to load game');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const word = gameData?.word || '';
  const validWord = isTraceableWord(word);

  const celebrateTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleTraceDone = useCallback(() => {
    setCelebrating(true);
    celebrateTimerRef.current = setTimeout(() => setFinished(true), 2400);
  }, []);

  const handleTraceRestart = useCallback(() => {
    if (celebrateTimerRef.current) clearTimeout(celebrateTimerRef.current);
    setFinished(false);
    setCelebrating(false);
  }, []);

  useEffect(() => {
    return () => {
      if (celebrateTimerRef.current) clearTimeout(celebrateTimerRef.current);
    };
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-accent border-t-transparent mb-4" />
          <p className="text-muted">Loading trace game...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !gameData) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <h1 className="text-2xl font-bold text-fg mb-4">
            {error || 'Game not available'}
          </h1>
          <Link
            href={BACK_HREF}
            className="inline-block px-6 py-3 bg-accent text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            Back to games
          </Link>
        </div>
      </div>
    );
  }

  const finishOverlay = finished && (
    <div className="absolute inset-0 z-10 rounded-3xl bg-gradient-to-br from-emerald-400/95 to-teal-500/95 flex items-center justify-center backdrop-blur-sm trace-fade-in">
      <div className="text-center text-white px-8">
        <div className="mb-6 text-8xl animate-bounce">🎉</div>
        <h2 className="text-4xl font-bold mb-4">Excellent!</h2>
        <p className="text-xl mb-8 opacity-90">You traced the word perfectly!</p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => {
              handleTraceRestart();
              setRound((r) => r + 1);
            }}
            className="px-6 py-3 bg-white text-emerald-600 rounded-xl font-bold hover:bg-emerald-50 transition-colors"
          >
            Trace again
          </button>
          <Link
            href={BACK_HREF}
            className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl font-bold hover:bg-white/30 transition-colors"
          >
            Pick another word
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={
        isMobile
          ? 'fixed inset-0 z-50 flex bg-bg p-3 gap-2'
          : 'flex flex-col items-center px-4 md:px-6 pt-1 pb-4 lg:pb-0 gap-2'
      }
    >
      {isMobile ? (
        <div className="flex flex-col items-start gap-2 shrink-0">
          <TraceNavButtons backHref={BACK_HREF} />
        </div>
      ) : (
        <TraceGameHeader
          title={gameData.title || 'Word Trace'}
          backHref={BACK_HREF}
          subtitle={
            validWord ? (
              <>
                Trace the word{' '}
                <span lang="ar" dir="rtl" className={`text-sm ${arabicTraceFont.className}`}>
                  {word}
                </span>
              </>
            ) : (
              'No word configured'
            )
          }
        />
      )}

      {/* The content card. The paper inside has no height of its own (its
          canvases are absolutely positioned and the engine measures its box
          before drawing), so this card's min-height, handed down through
          items-stretch, is what it gets to draw in. */}
      <div
        className={
          isMobile
            ? 'relative flex-1 flex items-stretch gap-3 min-h-0'
            : 'relative w-full min-h-[80vh] max-h-[85vh] bg-surface backdrop-blur-sm rounded-3xl p-3 shadow-xl border-2 border-[#b8ddd8] flex items-stretch gap-3'
        }
      >
        {finishOverlay}

        <div className="flex-1 flex items-center justify-center min-w-0">
          <div className="w-full h-full max-w-[min(100%,140vh)] max-h-[calc(100vh-96px)] flex flex-col">
            <div className="flex-1 flex flex-col rounded-2xl overflow-hidden bg-[#FDFBF4] border-2 border-[#E7E1D2] shadow-lg">
              {validWord ? (
                <ArabicTraceSurface
                  key={round}
                  word={word}
                  celebrating={celebrating}
                  onComplete={handleTraceDone}
                  onRestart={handleTraceRestart}
                />
              ) : (
                <div className="flex-1 flex items-center justify-center p-8">
                  <p className="text-center text-muted">
                    No valid Arabic word configured for this game
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
