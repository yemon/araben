'use client';

import type { DialogueTurn } from '@/types/content';
import { ArabicText } from './ArabicText';

/** A speaker is the "you" side (right-aligned, accent bubble) if the label
 *  matches common first-person markers in Bangla or English. */
function isYouSide(speaker: string): boolean {
  const s = (speaker || '').trim().toLowerCase().replace(/[:.]$/, '');
  return (
    s === 'তুমি' ||
    s === 'আমি' ||
    s === 'you' ||
    s === 'me' ||
    s === 'i' ||
    s === 'a'
  );
}

export function ChatDialogue({ turns }: { turns: DialogueTurn[] }) {
  return (
    <div
      className="rounded-3xl p-4 md:p-6 space-y-4 md:space-y-3 border border-border overflow-hidden relative"
      style={{
        background:
          'linear-gradient(180deg, color-mix(in oklab, var(--accent-soft) 55%, var(--surface)) 0%, var(--surface) 60%, color-mix(in oklab, var(--accent-2-soft) 40%, var(--surface)) 100%)',
        boxShadow: 'var(--shadow)',
      }}
    >
      {turns.map((turn, i) => (
        <ChatBubble key={i} turn={turn} you={isYouSide(turn.speaker)} />
      ))}
    </div>
  );
}

function ChatBubble({ turn, you }: { turn: DialogueTurn; you: boolean }) {
  return (
    <div className={'flex ' + (you ? 'justify-end' : 'justify-start')}>
      <div className="max-w-[92%] md:max-w-[85%] flex flex-col">
        <span
          className={
            'text-[11px] uppercase tracking-wider text-muted mb-1 px-2 font-medium ' +
            (you ? 'text-right' : 'text-left')
          }
        >
          {turn.speaker}
        </span>
        {you ? <YouBubble turn={turn} /> : <OtherBubble turn={turn} />}
      </div>
    </div>
  );
}

/** Content grid — stacked on mobile, two-columns on desktop:
 *    row 1: Arabic  |  transliteration
 *    row 2: English |  Bangla
 */
function BubbleGrid({
  turn,
  translitClass = 'translit',
  banglaClass = 'text-muted',
  englishClass = 'text-fg-2',
  arabicWrapperClass = '',
}: {
  turn: DialogueTurn;
  translitClass?: string;
  banglaClass?: string;
  englishClass?: string;
  arabicWrapperClass?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5 md:gap-2">
      {/* Row 1 — Arabic + transliteration */}
      <div className="flex flex-col md:flex-row md:items-baseline md:justify-between md:gap-5">
        <ArabicText size="md" className={arabicWrapperClass}>
          {turn.arabic}
        </ArabicText>
        <span
          className={`text-sm md:text-right md:whitespace-nowrap ${translitClass}`}
        >
          {turn.transliteration}
        </span>
      </div>
      {/* Row 2 — English + Bangla */}
      {(turn.english || turn.bangla) && (
        <div
          className="flex flex-col md:flex-row md:items-baseline md:justify-between md:gap-5 pt-1.5 md:pt-2 border-t"
          style={{ borderColor: 'color-mix(in oklab, currentColor 12%, transparent)' }}
        >
          <span className={`text-sm ${englishClass}`} lang="en">
            {turn.english}
          </span>
          {turn.bangla && (
            <span
              className={`bn text-sm md:text-right ${banglaClass}`}
              lang="bn"
            >
              {turn.bangla}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function YouBubble({ turn }: { turn: DialogueTurn }) {
  return (
    <div
      className="px-4 py-3 md:px-5 md:py-3.5"
      style={{
        background: 'var(--gradient-accent)',
        color: 'var(--accent-fg)',
        borderRadius: '22px 22px 6px 22px',
        boxShadow: '0 8px 22px -10px var(--ring)',
      }}
    >
      <BubbleGrid
        turn={turn}
        arabicWrapperClass="!text-[color:var(--accent-fg)]"
        translitClass="italic opacity-90"
        englishClass="opacity-95"
        banglaClass="opacity-85"
      />
    </div>
  );
}

function OtherBubble({ turn }: { turn: DialogueTurn }) {
  return (
    <div
      className="px-4 py-3 md:px-5 md:py-3.5"
      style={{
        background:
          'linear-gradient(135deg, var(--surface) 0%, color-mix(in oklab, var(--accent-2-soft) 55%, var(--surface)) 100%)',
        border: '1px solid var(--border)',
        borderRadius: '22px 22px 22px 6px',
      }}
    >
      <BubbleGrid turn={turn} />
    </div>
  );
}
