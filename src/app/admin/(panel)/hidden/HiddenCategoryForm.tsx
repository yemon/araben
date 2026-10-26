'use client';

import { useState } from 'react';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { RowsEditor, type RowColumn } from '@/components/admin/RowsEditor';
import { ErrorBanner, Field, PageHeader, inputClass } from '@/components/admin/ui';
import { useAdminSave } from '@/components/admin/useAdminSave';

type EntryKey = 'bangla' | 'arabic' | 'transliteration' | 'arabicMeaning' | 'note';
type Entry = Record<EntryKey, string>;

export interface HiddenCategoryFormData {
  slug: string;
  title: string;
  entries: Entry[];
}

const LIST = '/admin/hidden/';

const ENTRY_COLUMNS: RowColumn<EntryKey>[] = [
  { key: 'bangla', label: 'Bangla word', required: true, span: 4, placeholder: 'আদালত' },
  { key: 'arabic', label: 'Arabic', kind: 'arabic', required: true, span: 4 },
  { key: 'transliteration', label: 'Transliteration', span: 4 },
  { key: 'arabicMeaning', label: 'Meaning in Arabic', span: 6 },
  { key: 'note', label: 'Note', span: 6 },
];

const emptyEntry = (): Entry => ({ bangla: '', arabic: '', transliteration: '', arabicMeaning: '', note: '' });

export function HiddenCategoryForm({ id, initial }: { id?: number; initial?: HiddenCategoryFormData }) {
  const [form, setForm] = useState<HiddenCategoryFormData>(() => initial ?? { slug: '', title: '', entries: [emptyEntry()] });
  const { saving, error, setError, save } = useAdminSave(form);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.entries.length) {
      setError('Add at least one word');
      return;
    }
    save(id ? `/api/admin/hidden/${id}` : '/api/admin/hidden', id ? 'PUT' : 'POST', form, LIST);
  }

  return (
    <form onSubmit={submit}>
      <PageHeader
        title={id ? 'Edit category' : 'New category'}
        description="Bangla words that came from Arabic. Saving also updates the word index."
        back={{ href: LIST, label: 'Back to Hidden in Bangla' }}
        actions={
          <>
            {id && <DeleteButton url={`/api/admin/hidden/${id}`} name={form.title} then={LIST} variant="button" />}
            <button type="submit" disabled={saving} className="btn btn-primary disabled:opacity-60">
              {saving ? 'Saving…' : 'Save category'}
            </button>
          </>
        }
      />
      <ErrorBanner error={error} />

      <section className="card mt-6 p-6">
        <h2 className="mb-4 text-lg font-bold text-fg">Details</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Title" required>
            <input
              required
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="আইন-আদালত ও প্রশাসন"
              className={`${inputClass} bn`}
            />
          </Field>
          <Field label="Slug" required hint={id ? 'Changing it changes the page address.' : '/hidden/<slug>/ — e.g. law-and-administration'}>
            <input
              required
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              className={`${inputClass} font-translit text-sm`}
            />
          </Field>
        </div>
      </section>

      <section className="card mt-6 p-6">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-lg font-bold text-fg">Words</h2>
          <span className="text-xs font-bold text-muted tabular-nums">{form.entries.length} words</span>
        </div>
        <RowsEditor
          rows={form.entries}
          columns={ENTRY_COLUMNS}
          onChange={(entries) => setForm((f) => ({ ...f, entries }))}
          emptyRow={emptyEntry}
          itemLabel="word"
        />
      </section>
    </form>
  );
}
