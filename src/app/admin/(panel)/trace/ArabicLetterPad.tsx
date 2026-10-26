'use client';

import { arabicTraceFont } from '@/lib/fonts';
import {
  ARABIC_ALPHABET,
  ARABIC_EXTRA_LETTERS,
  ARABIC_HARAKAT,
} from '@/lib/trace/traceLanguages';
import { Icon } from './icons';

/**
 * Tap-to-type Arabic letters, for an admin whose keyboard has no Arabic
 * layout — carried over from kids-hub. Laid out right to left in alphabet
 * order, with the hamza forms and the word-final letters on a row of their
 * own, then the harakat. A haraka lands on the letter before it; the
 * builder drops one that has no letter to sit on, or that its letter
 * already carries.
 */
export default function ArabicLetterPad({
  onLetter,
  onMark,
  onBackspace,
  onClear,
  disabled,
  canMark,
  canErase,
}: {
  onLetter: (ch: string) => void;
  onMark: (mark: string) => void;
  onBackspace: () => void;
  onClear: () => void;
  disabled: boolean;
  canMark: boolean;
  canErase: boolean;
}) {
  const key =
    'flex h-11 items-center justify-center rounded-lg border border-border bg-surface text-2xl text-fg transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border disabled:hover:text-fg';

  const letters = (list: string[], width = '') =>
    list.map((ch) => (
      <button
        key={ch}
        type="button"
        onClick={() => onLetter(ch)}
        disabled={disabled}
        className={`${key} ${width} ${arabicTraceFont.className}`}
        aria-label={`Add ${ch}`}
      >
        {ch}
      </button>
    ));

  return (
    <div className="mt-4 rounded-2xl border border-border bg-surface-2 p-3">
      <div dir="rtl" lang="ar" className="grid grid-cols-7 gap-1.5 sm:grid-cols-10">
        {letters(ARABIC_ALPHABET)}
      </div>
      <div className="mt-1.5 flex flex-wrap-reverse items-center justify-between gap-1.5">
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={onClear}
            disabled={!canErase}
            className={`${key} px-3 text-sm font-bold`}
          >
            Clear
          </button>
          <button
            type="button"
            onClick={onBackspace}
            disabled={!canErase}
            className={`${key} w-14`}
            aria-label="Delete last letter"
          >
            <Icon name="backspace" />
          </button>
        </div>
        <div dir="rtl" lang="ar" className="flex flex-wrap gap-1.5">
          {letters(ARABIC_EXTRA_LETTERS, 'w-10')}
        </div>
      </div>
      <div
        dir="rtl"
        lang="ar"
        className="mt-1.5 grid grid-cols-4 gap-1.5 border-t border-dashed border-border pt-2 sm:grid-cols-8"
      >
        {ARABIC_HARAKAT.map(({ mark, name }) => (
          <button
            key={mark}
            type="button"
            onClick={() => onMark(mark)}
            disabled={!canMark}
            className={`${key} h-14 flex-col gap-0 leading-none`}
            aria-label={`Add ${name}`}
            title={name}
          >
            {/* Shown on a dotted circle, the usual stand-in for "a letter". */}
            <span className={`text-3xl ${arabicTraceFont.className}`}>{'◌' + mark}</span>
            {/* font-latin: the row is lang="ar", which the site styles in its
                Arabic serif — wrong for these English names. */}
            <span className="font-latin text-[10px] text-muted" dir="ltr" lang="en">
              {name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
