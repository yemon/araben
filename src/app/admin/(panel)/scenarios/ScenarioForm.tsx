'use client';

import { useState } from 'react';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { RowsEditor, type RowColumn } from '@/components/admin/RowsEditor';
import { ErrorBanner, Field, PageHeader, inputClass } from '@/components/admin/ui';
import { useAdminSave } from '@/components/admin/useAdminSave';
import { slugify } from '@/lib/slugify';

type TurnKey = 'speaker' | 'arabic' | 'transliteration' | 'english' | 'bangla';
type Turn = Record<TurnKey, string>;

export interface ScenarioFormData {
  slug: string;
  number: string;
  englishTitle: string;
  banglaTitle: string;
  newWordsNote: string;
  turns: Turn[];
}

const LIST = '/admin/scenarios/';

const TURN_COLUMNS: RowColumn<TurnKey>[] = [
  { key: 'speaker', label: 'Speaker', required: true, span: 3, placeholder: 'তুমি' },
  { key: 'arabic', label: 'Arabic', kind: 'arabic', required: true, span: 9 },
  { key: 'transliteration', label: 'Transliteration', required: true, span: 4 },
  { key: 'english', label: 'English', span: 4 },
  { key: 'bangla', label: 'Bangla', span: 4 },
];

const emptyTurn = (): Turn => ({ speaker: '', arabic: '', transliteration: '', english: '', bangla: '' });

export function ScenarioForm({ id, initial }: { id?: number; initial?: ScenarioFormData }) {
  const [form, setForm] = useState(() => initial ?? emptyScenario());
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
    save(id ? `/api/admin/scenarios/${id}` : '/api/admin/scenarios', id ? 'PUT' : 'POST', { ...form, number: Number(form.number) }, LIST);
  }

  return (
    <form onSubmit={submit}>
      <PageHeader
        title={id ? 'Edit scenario' : 'New scenario'}
        description="A dialogue for a real situation. Saving also updates the words it uses."
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
          <span className="text-xs font-bold text-muted tabular-nums">{form.turns.length} turns</span>
        </div>
        <RowsEditor
          rows={form.turns}
          columns={TURN_COLUMNS}
          onChange={(turns) => set('turns', turns)}
          emptyRow={emptyTurn}
          itemLabel="turn"
        />
      </section>
    </form>
  );
}

const emptyScenario = (): ScenarioFormData => ({
  slug: '',
  number: '',
  englishTitle: '',
  banglaTitle: '',
  newWordsNote: '',
  turns: [emptyTurn()],
});
