'use client';

import { useRef, useState } from 'react';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { RowsEditor, type RowColumn } from '@/components/admin/RowsEditor';
import { ErrorBanner, Field, PageHeader, inputClass } from '@/components/admin/ui';
import { useAdminSave } from '@/components/admin/useAdminSave';
import { slugify } from '@/lib/slugify';
import { formatTimecode, parseTimecode } from '@/lib/timecode';

type TurnKey = 'speaker' | 'arabic' | 'transliteration' | 'english' | 'bangla' | 'startTime';
type Turn = Record<TurnKey, string>;

export interface ScenarioFormData {
  slug: string;
  number: string;
  englishTitle: string;
  banglaTitle: string;
  newWordsNote: string;
  turns: Turn[];
}

// The scenario's first video: the one the dialogue's start times refer to.
export interface SyncVideo {
  url: string;
  mimeType: string;
  title: string;
}

const LIST = '/admin/scenarios/';

const emptyTurn = (): Turn => ({ speaker: '', arabic: '', transliteration: '', english: '', bangla: '', startTime: '' });

export function ScenarioForm({
  id,
  initial,
  syncVideo,
}: {
  id?: number;
  initial?: ScenarioFormData;
  syncVideo?: SyncVideo | null;
}) {
  const [form, setForm] = useState(() => initial ?? emptyScenario());
  const playerRef = useRef<HTMLVideoElement>(null);
  const [playerTime, setPlayerTime] = useState(0);

  // Start times are only offered once there is a video to time against;
  // times already saved are kept either way.
  const turnColumns: RowColumn<TurnKey>[] = [
    { key: 'speaker', label: 'Speaker', required: true, span: 3, placeholder: 'তুমি' },
    ...(syncVideo
      ? [
          {
            key: 'startTime' as const,
            label: 'Starts at',
            kind: 'time' as const,
            span: 4,
            capture: () => (playerRef.current ? formatTimecode(playerRef.current.currentTime * 1000) : null),
            preview: (value: string) => {
              const ms = parseTimecode(value);
              const v = playerRef.current;
              if (!v || ms === null || Number.isNaN(ms)) return;
              v.currentTime = ms / 1000;
              v.play().catch(() => {});
            },
          },
        ]
      : []),
    { key: 'arabic', label: 'Arabic', kind: 'arabic', required: true, span: syncVideo ? 5 : 9 },
    { key: 'transliteration', label: 'Transliteration', required: true, span: 4 },
    { key: 'english', label: 'English', span: 4 },
    { key: 'bangla', label: 'Bangla', span: 4 },
  ];
  // On a new scenario the slug follows the English title until edited.
  const [slugTouched, setSlugTouched] = useState(id !== undefined);
  const { saving, error, setError, save } = useAdminSave(form);
  const set = <K extends keyof ScenarioFormData>(key: K, value: ScenarioFormData[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.turns.length) {
      setError('Add at least one turn');
      return;
    }
    const err = timingProblem(form.turns);
    if (err) {
      setError(err);
      return;
    }
    save(id ? `/api/admin/scenarios/${id}` : '/api/admin/scenarios', id ? 'PUT' : 'POST', { ...form, number: Number(form.number) }, LIST);
  }

  return (
    <form onSubmit={submit}>
      <PageHeader
        title={id ? 'Edit scenario' : 'New scenario'}
        description={
          <>
            A dialogue for a real situation. Saving also updates the words it uses.
            {id && (
              <>
                {' '}
                <a href="#videos-heading" className="font-semibold text-accent">
                  Videos ↓
                </a>
              </>
            )}
          </>
        }
        back={{ href: LIST, label: 'Back to scenarios' }}
        actions={
          <>
            {id && <DeleteButton url={`/api/admin/scenarios/${id}`} name={form.englishTitle} then={LIST} variant="button" />}
            <button type="submit" disabled={saving} className="btn btn-primary disabled:opacity-60">
              {saving ? 'Saving…' : 'Save scenario'}
            </button>
          </>
        }
      />
      <ErrorBanner error={error} />

      <section className="card mt-6 p-6">
        <h2 className="mb-4 text-lg font-bold text-fg">Details</h2>
        <div className="grid gap-4 sm:grid-cols-6">
          <Field label="Number" required className="sm:col-span-1">
            <input
              type="number"
              min={1}
              required
              value={form.number}
              onChange={(e) => set('number', e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="English title" required className="sm:col-span-5">
            <input
              required
              value={form.englishTitle}
              onChange={(e) => {
                set('englishTitle', e.target.value);
                if (!slugTouched) set('slug', slugify(e.target.value));
              }}
              placeholder="Ordering tea at a café"
              className={inputClass}
            />
          </Field>
          <Field label="Bangla title" required className="sm:col-span-3">
            <input
              required
              value={form.banglaTitle}
              onChange={(e) => set('banglaTitle', e.target.value)}
              className={`${inputClass} bn`}
            />
          </Field>
          <Field
            label="Slug"
            required
            hint={id ? 'Changing it changes the page address.' : 'The page address: /scenarios/<slug>/'}
            className="sm:col-span-3"
          >
            <input
              required
              value={form.slug}
              onChange={(e) => {
                setSlugTouched(true);
                set('slug', e.target.value);
              }}
              className={`${inputClass} font-translit text-sm`}
            />
          </Field>
          <Field label="New words note" hint="Shown under the dialogue." className="sm:col-span-6">
            <textarea
              rows={3}
              value={form.newWordsNote}
              onChange={(e) => set('newWordsNote', e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>
      </section>

      <section className="card mt-6 p-6">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-lg font-bold text-fg">Dialogue</h2>
          <span className="text-xs font-bold text-muted tabular-nums">
            {form.turns.length} turns
            {syncVideo && ` · ${form.turns.filter((t) => t.startTime.trim()).length} timed`}
          </span>
        </div>
        <div className={syncVideo ? 'grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]' : ''}>
          <RowsEditor
            rows={form.turns}
            columns={turnColumns}
            onChange={(turns) => set('turns', turns)}
            emptyRow={emptyTurn}
            itemLabel="turn"
          />
          {syncVideo && (
            // Stays in view while the rows scroll past, so a line can be timed
            // without hunting for the player.
            <aside className="order-first lg:order-none">
              <div className="space-y-2 lg:sticky lg:top-6">
                <video
                  key={syncVideo.url}
                  ref={playerRef}
                  controls
                  preload="metadata"
                  playsInline
                  onTimeUpdate={(e) => setPlayerTime(e.currentTarget.currentTime)}
                  onSeeked={(e) => setPlayerTime(e.currentTarget.currentTime)}
                  className="aspect-video w-full rounded-xl bg-black"
                >
                  <source src={syncVideo.url} type={syncVideo.mimeType} />
                </video>
                <p className="flex items-center justify-between text-xs">
                  <span className="truncate font-semibold text-fg">{syncVideo.title || 'First video'}</span>
                  <span className="font-translit tabular-nums text-accent">{formatTimecode(playerTime * 1000)}</span>
                </p>
                <p className="rounded-xl bg-surface-2 p-3 text-xs leading-relaxed text-muted">
                  Each line&apos;s <strong className="text-fg-2">Starts at</strong> is a time in this video — the first one under
                  Videos. Pause where a line begins and press <strong className="text-fg-2">Now</strong> on it, or type a time
                  like 0:12.5. A line lasts until the next one starts; lines left empty aren&apos;t highlighted.
                </p>
              </div>
            </aside>
          )}
        </div>
      </section>

      {!id && (
        <p className="mt-6 rounded-2xl border-2 border-dashed border-border p-5 text-center text-sm text-muted">
          Save the scenario first — then open it again to add videos.
        </p>
      )}
    </form>
  );
}

// The server checks these too; saying so here spares a round trip.
function timingProblem(turns: Turn[]): string | null {
  let last: { ms: number; row: number } | null = null;
  for (const [i, t] of turns.entries()) {
    const ms = parseTimecode(t.startTime);
    if (ms === null) continue;
    if (Number.isNaN(ms)) return `Turn ${i + 1}: write the start time like 0:12 or 0:12.5`;
    if (last && ms <= last.ms) {
      return `Turn ${i + 1} starts at ${formatTimecode(ms)}, which isn't after turn ${last.row} (${formatTimecode(last.ms)})`;
    }
    last = { ms, row: i + 1 };
  }
  return null;
}

const emptyScenario = (): ScenarioFormData => ({
  slug: '',
  number: '',
  englishTitle: '',
  banglaTitle: '',
  newWordsNote: '',
  turns: [emptyTurn()],
});
