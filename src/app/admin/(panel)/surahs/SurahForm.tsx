'use client';

import { useState } from 'react';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { RowsEditor, type RowColumn } from '@/components/admin/RowsEditor';
import { ErrorBanner, Field, PageHeader, arabicInputClass, inputClass } from '@/components/admin/ui';
import { useAdminSave } from '@/components/admin/useAdminSave';

type VerseKey = 'ayah' | 'arabic' | 'transliteration' | 'english' | 'bangla';
type Verse = Record<VerseKey, string>;

export interface SurahFormData {
  slug: string;
  banglaName: string;
  arabicName: string;
  englishName: string;
  mushafNumber: string;
  verses: Verse[];
}

const LIST = '/admin/surahs/';

const VERSE_COLUMNS: RowColumn<VerseKey>[] = [
  { key: 'ayah', label: 'Ayah', kind: 'number', required: true, span: 2 },
  { key: 'arabic', label: 'Arabic word', kind: 'arabic', required: true, span: 4 },
  { key: 'transliteration', label: 'Transliteration', required: true, span: 6 },
  { key: 'english', label: 'English', span: 6 },
  { key: 'bangla', label: 'Bangla', span: 6 },
];

const emptySurah = (): SurahFormData => ({
  slug: '',
  banglaName: '',
  arabicName: '',
  englishName: '',
  mushafNumber: '',
  verses: [{ ayah: '1', arabic: '', transliteration: '', english: '', bangla: '' }],
});

export function SurahForm({ id, initial }: { id?: number; initial?: SurahFormData }) {
  const [form, setForm] = useState(() => initial ?? emptySurah());
  const { saving, error, setError, save } = useAdminSave(form);
  const set = <K extends keyof SurahFormData>(key: K, value: SurahFormData[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  // A new row continues the ayah of the row above it.
  const nextVerse = (): Verse => ({
    ayah: form.verses.at(-1)?.ayah || '1',
    arabic: '',
    transliteration: '',
    english: '',
    bangla: '',
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.verses.length) {
      setError('Add at least one word');
      return;
    }
    save(
      id ? `/api/admin/surahs/${id}` : '/api/admin/surahs',
      id ? 'PUT' : 'POST',
      { ...form, mushafNumber: Number(form.mushafNumber), verses: form.verses.map((v) => ({ ...v, ayah: Number(v.ayah) })) },
      LIST,
    );
  }

  const ayahs = new Set(form.verses.map((v) => v.ayah)).size;

  return (
    <form onSubmit={submit}>
      <PageHeader
        title={id ? 'Edit surah' : 'New surah'}
        description="Word by word, in reading order. Each word links to its own study card."
        back={{ href: LIST, label: 'Back to surahs' }}
        actions={
          <>
            {id && <DeleteButton url={`/api/admin/surahs/${id}`} name={form.englishName} then={LIST} variant="button" />}
            <button type="submit" disabled={saving} className="btn btn-primary disabled:opacity-60">
              {saving ? 'Saving…' : 'Save surah'}
            </button>
          </>
        }
      />
      <ErrorBanner error={error} />

      <section className="card mt-6 p-6">
        <h2 className="mb-4 text-lg font-bold text-fg">Details</h2>
        <div className="grid gap-4 sm:grid-cols-6">
          <Field label="Mushaf number" required hint="1 – 114" className="sm:col-span-2">
            <input
              type="number"
              min={1}
              max={114}
              required
              value={form.mushafNumber}
              onChange={(e) => set('mushafNumber', e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="English name" required className="sm:col-span-4">
            <input
              required
              value={form.englishName}
              onChange={(e) => set('englishName', e.target.value)}
              placeholder="The Opening"
              className={inputClass}
            />
          </Field>
          <Field label="Bangla name" required className="sm:col-span-2">
            <input
              required
              value={form.banglaName}
              onChange={(e) => set('banglaName', e.target.value)}
              placeholder="আল-ফাতিহা"
              className={`${inputClass} bn`}
            />
          </Field>
          <Field label="Arabic name" required className="sm:col-span-2">
            <input
              required
              dir="rtl"
              lang="ar"
              value={form.arabicName}
              onChange={(e) => set('arabicName', e.target.value)}
              className={arabicInputClass}
            />
          </Field>
          <Field label="Slug" required hint={id ? 'Changing it changes the page address.' : '/surahs/<slug>/'} className="sm:col-span-2">
            <input
              required
              value={form.slug}
              onChange={(e) => set('slug', e.target.value)}
              placeholder="al-fatiha"
              className={`${inputClass} font-translit text-sm`}
            />
          </Field>
        </div>
      </section>

      <section className="card mt-6 p-6">
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-lg font-bold text-fg">Words</h2>
          <span className="text-xs font-bold text-muted tabular-nums">
            {form.verses.length} words · {ayahs} ayah{ayahs === 1 ? '' : 's'}
          </span>
        </div>
        <RowsEditor
          rows={form.verses}
          columns={VERSE_COLUMNS}
          onChange={(verses) => set('verses', verses)}
          emptyRow={nextVerse}
          itemLabel="word"
        />
      </section>
    </form>
  );
}
