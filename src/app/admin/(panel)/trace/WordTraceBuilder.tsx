'use client';

/**
 * Word Trace builder — one Arabic word per game, carried over from kids-hub
 * with its English half removed.
 *
 * The admin types (or taps, on the letter pad) a word of up to five Arabic
 * letters, each with its harakat if they like, and gives the game a title.
 * The player renders the word in the trace font and reads the strokes off
 * it. Anything that isn't an Arabic letter or a haraka is filtered out on
 * input, and harakat don't count towards the letter limit.
 */

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { TraceGame } from '@/lib/trace/wordTraceDataManager';
import { arabicTraceFont } from '@/lib/fonts';
import { TRACE_LANGUAGE, countLetters, sanitiseWord } from '@/lib/trace/traceLanguages';
import ArabicLetterPad from './ArabicLetterPad';
import { Icon } from './icons';

const LIST_ROUTE = '/admin/trace';

interface FormState {
  title: string;
  description: string;
  word: string;
  difficulty: string;
  // What the admin actually typed, before filtering — UI only, never sent.
  rawWord?: string;
}

const emptyForm = (): FormState => ({
  title: '',
  description: '',
  word: '',
  difficulty: 'easy',
});

// Keep the title in step with the word until the admin writes their own —
// then never touch it again.
function withWord(prev: FormState, raw: string): FormState {
  const cleaned = sanitiseWord(raw);
  const nextTitle =
    prev.title?.trim() && prev.title !== `Trace ${prev.word || ''}`
      ? prev.title
      : cleaned
        ? `Trace ${cleaned}`
        : '';
  return { ...prev, word: cleaned, rawWord: raw, title: nextTitle };
}

const inputClass =
  'w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-fg outline-none transition-colors focus:border-accent';

export default function WordTraceBuilder({
  mode = 'create',
  gameId = null,
  initialData = null,
}: {
  mode?: 'create' | 'edit';
  gameId?: string | null;
  initialData?: TraceGame | null;
}) {
  const router = useRouter();

  const [form, setForm] = useState<FormState>(() =>
    initialData
      ? {
          title: initialData.title,
          description: initialData.description,
          word: initialData.word,
          difficulty: initialData.difficulty || 'easy',
        }
      : emptyForm()
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const word = form.word || '';
  const lang = TRACE_LANGUAGE;
  // Letters only — harakat don't count towards the limit.
  const charCount = countLetters(word);
  const rawWord = form.rawWord ?? word;

  // What the admin typed that we silently dropped — worth saying out loud,
  // otherwise a vanished character reads as a broken input box.
  const invalidChars = useMemo(
    () =>
      (form.rawWord || '')
        .normalize('NFKC')
        .split('')
        .filter((ch) => ch !== ' ' && !lang.isAllowed(ch)),
    [form.rawWord, lang]
  );

  const setWord = (raw: string) => setForm((prev) => withWord(prev, raw));

  const validate = () => {
    if (!form.title?.trim()) return 'Please enter a game title';
    if (!word) return 'Please type a word to trace';
    return null;
  };

  const persist = async (status: 'draft' | 'published') => {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const { rawWord: _rawWord, ...cleanData } = form;
      const res = await fetch(
        mode === 'edit' ? `/api/admin/trace/${gameId}` : '/api/admin/trace',
        {
          method: mode === 'edit' ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...cleanData, status }),
        }
      );
      const result = await res.json();

      if (result.success) {
        // The list is the confirmation: the saved row is there, badged.
        router.push(LIST_ROUTE);
        router.refresh();
      } else {
        setError(result.error || 'Failed to save game');
        setSaving(false);
      }
    } catch (saveError) {
      console.error('Save error:', saveError);
      setError('Error saving game');
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href={LIST_ROUTE}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-muted transition-colors hover:border-accent hover:text-accent"
            aria-label="Back to the word list"
            title="Back to the word list"
          >
            <Icon name="arrowLeft" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-fg">
              {mode === 'edit' ? 'Edit word' : 'New word'}
            </h1>
            <p className="text-sm text-muted">
              Learners trace every letter in order, right to left.
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => persist('draft')}
            disabled={saving}
            className="btn btn-ghost disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save as draft'}
          </button>
          <button
            type="button"
            onClick={() => persist('published')}
            disabled={saving}
            className="btn btn-primary disabled:opacity-60"
          >
            {saving ? 'Publishing…' : 'Save & publish'}
          </button>
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-xl border border-rose-300 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700">
          {error}
        </p>
      )}

      <section className="card mt-6 p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-fg">Type the word</h2>
          <span className="text-xs font-bold text-muted tabular-nums">
            {charCount} / {lang.maxLength}
          </span>
        </div>

        <p className="mb-4 text-sm text-muted">
          {`Letters join up just as they are written — up to ${lang.maxLength} Arabic letters, ` +
            'each with its harakat (fatha, damma, kasra, sukun, shadda, tanween) if you like; ' +
            "harakat don't count towards the limit. Type, paste, or tap below — a haraka goes " +
            'straight after its letter.'}
        </p>

        <input
          type="text"
          value={rawWord}
          onChange={(e) => setWord(e.target.value)}
          placeholder="مثال: بَابٌ"
          // Room for each letter's harakat too; sanitiseWord trims it.
          maxLength={lang.maxLength * 4}
          dir="rtl"
          lang="ar"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          aria-label="Arabic word"
          // No letter-spacing: it pulls joined Arabic letters apart.
          className={`w-full rounded-xl border border-border bg-surface px-4 py-3 text-center font-bold text-fg outline-none transition-colors focus:border-accent ${arabicTraceFont.className}`}
          // Inline so no stylesheet's input reset can shrink it — Arabic at
          // body size is hard to check letter by letter.
          style={{ fontSize: '1.75rem', lineHeight: 1.4 }}
        />

        {invalidChars.length > 0 && (
          <p className="mt-2 text-xs font-bold text-amber-600">
            {`Skipped ${invalidChars.length} character${invalidChars.length > 1 ? 's' : ''} ` +
              "that aren't Arabic letters."}
          </p>
        )}

        <ArabicLetterPad
          disabled={charCount >= lang.maxLength}
          onLetter={(ch) => setWord(word + ch)}
          onMark={(mark) => setWord(word + mark)}
          canMark={charCount > 0}
          onBackspace={() => setWord(word.slice(0, -1))}
          onClear={() => setWord('')}
          canErase={charCount > 0}
        />

        {word && (
          <div className="mt-6 flex flex-wrap items-center gap-4 rounded-2xl border-2 border-dashed border-accent bg-accent-soft p-4">
            <div className="flex items-center gap-1 rounded-xl border border-border bg-surface px-4 py-3">
              {/* One text run, so the letters join as they will on the
                  trace paper — per-letter spans would break them apart. */}
              <span
                dir="rtl"
                lang="ar"
                className={`${arabicTraceFont.className} text-5xl font-semibold leading-tight text-accent sm:text-6xl`}
              >
                {word}
              </span>
            </div>
            <div>
              <p className="text-sm text-muted">Trace target</p>
              <p className="text-lg font-bold text-fg">
                {charCount} letter{charCount === 1 ? '' : 's'}
              </p>
            </div>
          </div>
        )}
      </section>

      <section className="card mt-6 p-6">
        <h2 className="mb-4 text-lg font-bold text-fg">Details</h2>

        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-bold text-muted">Title *</span>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              placeholder="e.g. Kitāb (Book)"
              className={`mt-1 ${inputClass}`}
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold text-muted">Description</span>
            <textarea
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              placeholder="A note for whoever manages the words"
              rows={3}
              className={`mt-1 ${inputClass}`}
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold text-muted">Difficulty</span>
            <select
              value={form.difficulty || 'easy'}
              onChange={(e) => setForm((p) => ({ ...p, difficulty: e.target.value }))}
              className={`mt-1 ${inputClass}`}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </label>
        </div>
      </section>
    </div>
  );
}
