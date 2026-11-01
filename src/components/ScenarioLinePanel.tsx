'use client';

import { useEffect, useRef, useState } from 'react';
import type { DialogueTurn } from '@/types/content';
import { useT } from '@/lib/i18n/t';
import { useLang } from '@/lib/i18n/LangProvider';
import { dict } from '@/lib/i18n/dict';

/**
 * The dialogue beside a scenario's video, in two tabs:
 *
 * - Now playing: the line being spoken, large, with both translations. Only
 *   offered when lines are timed (and the timed video is the one showing).
 * - All lines: the whole dialogue in a scrolling list; the line being spoken
 *   is highlighted and kept in view, and a timed line plays from its start.
 *
 * Both tabs are always in the page, so the full dialogue is there for
 * search engines and screen readers whichever one is showing. Playback
 * itself lives in ScenarioVideos; this only shows it.
 */
export function ScenarioLinePanel({
  turns,
  synced,
  activeTurn,
  position,
  timedCount,
  pauseEach,
  onPauseEachChange,
  onPrev,
  onNext,
  onPlayFrom,
  className = '',
}: {
  className?: string;
  turns: DialogueTurn[];
  // The timed video is playing: lines can be followed and played from.
  synced: boolean;
  activeTurn: number | null;
  // 1-based place of the active line among the timed lines.
  position: number | null;
  timedCount: number;
  pauseEach: boolean;
  onPauseEachChange: (on: boolean) => void;
  // Missing at the first / last line.
  onPrev?: () => void;
  onNext?: () => void;
  onPlayFrom: (turn: number) => void;
}) {
  const t = useT();
  const { lang } = useLang();
  const [tab, setTab] = useState<'now' | 'all'>(synced ? 'now' : 'all');
  useEffect(() => {
    if (!synced) setTab('all');
  }, [synced]);

  // Keep the active line in view inside the list — scrolling the list, not
  // the page, so the video stays where it is.
  const listRef = useRef<HTMLOListElement>(null);
  useEffect(() => {
    const list = listRef.current;
    if (!list || tab !== 'all' || activeTurn === null) return;
    const item = list.children[activeTurn] as HTMLElement | undefined;
    if (!item) return;
    const top = item.offsetTop - list.offsetTop;
    if (top < list.scrollTop || top + item.offsetHeight > list.scrollTop + list.clientHeight) {
      list.scrollTo({ top: Math.max(0, top - 12), behavior: 'smooth' });
    }
  }, [activeTurn, tab]);

  // Both translations, the site's language first.
  const translations = (turn: DialogueTurn) =>
    [
      { text: turn.bangla, lang: 'bn' as const },
      { text: turn.english, lang: 'en' as const },
    ]
      .sort((a, b) => (a.lang === lang ? -1 : b.lang === lang ? 1 : 0))
      .filter((x) => x.text);

  const line = activeTurn === null ? null : turns[activeTurn];
  const tabButton = (id: 'now' | 'all', label: string) => (
    <button
      type="button"
      role="tab"
      aria-selected={tab === id}
      onClick={() => setTab(id)}
      className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
        tab === id ? 'bg-accent text-[color:var(--accent-fg)]' : 'text-muted hover:text-fg'
      }`}
    >
      {label}
    </button>
  );

  return (
    // On wide screens the panel takes its height from the video beside it
    // (absolute fill), and scrolls inside; stacked, it gets its own height.
    <aside className={`relative min-h-[18rem] lg:min-h-0 ${className}`}>
      <div className="flex h-full max-h-[30rem] flex-col rounded-2xl border border-border bg-surface-2 lg:absolute lg:inset-0 lg:max-h-none">
        <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2">
          {synced ? (
            <div className="flex shrink-0 gap-1" role="tablist" aria-label={t(dict.section.watchDialogue)}>
              {tabButton('now', t(dict.section.nowPlaying))}
              {tabButton('all', t(dict.section.allLines))}
            </div>
          ) : (
            <span className={`px-1 text-xs font-semibold text-fg-2 ${lang === 'en' ? '' : 'bn'}`}>{t(dict.section.allLines)}</span>
          )}
          {synced && (
            <label className="flex cursor-pointer items-center gap-1.5 text-[11px] leading-tight text-fg-2" title={t(dict.section.pauseEachLine)}>
              <input
                type="checkbox"
                checked={pauseEach}
                onChange={(e) => onPauseEachChange(e.target.checked)}
                className="h-3.5 w-3.5 shrink-0 accent-[color:var(--accent)]"
              />
              {t(dict.section.pauseEachLine)}
            </label>
          )}
        </div>

        {/* Now playing: each new line replaces the last. Centred with an
            auto margin rather than justify-center, so a line too long for
            the panel scrolls from its top instead of being cut off. */}
        <div className={`min-h-0 flex-1 overflow-y-auto px-4 py-2 ${tab === 'now' ? 'flex' : 'hidden'} flex-col text-center`} aria-live="polite">
          <div className="my-auto flex flex-col gap-1.5">
            {line ? (
              <>
                <span className="text-xs font-semibold uppercase tracking-wider text-accent">{line.speaker}</span>
                {/* One size smaller for long lines, so they fit the panel. */}
                <p className="ar text-fg" lang="ar" style={{ fontSize: line.arabic.length > 32 ? '1.5rem' : '1.75rem', lineHeight: 1.55 }}>
                  {line.arabic}
                </p>
                <p className="translit text-sm">{line.transliteration}</p>
                {translations(line).length > 0 && (
                  <div className="mt-0.5 space-y-1 border-t border-border pt-2">
                    {translations(line).map((x) => (
                      <p key={x.lang} className={x.lang === 'bn' ? 'bn text-[0.95rem] text-fg' : 'text-sm text-fg-2'} lang={x.lang}>
                        {x.text}
                      </p>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <p className={`mx-auto max-w-[16rem] text-sm text-muted ${lang === 'en' ? '' : 'bn'}`}>{t(dict.section.syncHint)}</p>
            )}
          </div>
        </div>

        {/* All lines. */}
        <ol ref={listRef} className={`min-h-0 flex-1 space-y-1.5 overflow-y-auto p-2 ${tab === 'all' ? 'block' : 'hidden'}`}>
          {turns.map((turn, i) => {
            const active = i === activeTurn;
            const playable = synced && turn.startSec !== undefined;
            const body = (
              <>
                <span className={`block text-[11px] font-semibold uppercase tracking-wider ${active ? 'text-accent' : 'text-muted'}`}>
                  {turn.speaker}
                </span>
                <span className="ar block text-fg" lang="ar" style={{ fontSize: '1.15rem', lineHeight: 1.6 }}>
                  {turn.arabic}
                </span>
                <span className="translit block text-xs">{turn.transliteration}</span>
                {translations(turn).map((x) => (
                  <span key={x.lang} className={`block text-xs ${x.lang === 'bn' ? 'bn text-fg-2' : 'text-muted'}`} lang={x.lang}>
                    {x.text}
                  </span>
                ))}
              </>
            );
            const cls = `block w-full rounded-xl px-3 py-2 text-left transition-colors ${
              active ? 'bg-accent-soft ring-2 ring-[color:var(--accent)]' : playable ? 'hover:bg-surface' : ''
            }`;
            return (
              <li key={i} aria-current={active ? 'true' : undefined}>
                {playable ? (
                  <button type="button" onClick={() => onPlayFrom(i)} className={cls} title="Play from this line">
                    {body}
                  </button>
                ) : (
                  <div className={cls}>{body}</div>
                )}
              </li>
            );
          })}
        </ol>

        {synced && (
          // Step through the dialogue either way, line by line.
          <div className="flex items-center justify-between gap-2 border-t border-border px-3 py-2">
            <button
              type="button"
              onClick={onPrev}
              disabled={!onPrev}
              className="btn btn-ghost whitespace-nowrap !px-3 !py-1.5 text-xs disabled:pointer-events-none disabled:opacity-40"
            >
              ◀ {t(dict.section.prevLine)}
            </button>
            <span className="whitespace-nowrap text-xs tabular-nums text-muted">
              {position !== null ? `${position} / ${timedCount}` : `— / ${timedCount}`}
            </span>
            <button
              type="button"
              onClick={onNext}
              disabled={!onNext}
              className="btn btn-primary whitespace-nowrap !px-3 !py-1.5 text-xs disabled:pointer-events-none disabled:opacity-40"
            >
              {t(dict.section.nextLine)} ▶
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
