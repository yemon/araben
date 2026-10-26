'use client';

import { useState } from 'react';
import { RowsEditor, type RowColumn } from '@/components/admin/RowsEditor';
import { ErrorBanner, PageHeader } from '@/components/admin/ui';
import { useAdminSave } from '@/components/admin/useAdminSave';

type Row = Record<string, string>;

/** One of the hidden-word side lists, edited and saved as a whole. */
export function HiddenListForm({
  listKey,
  title,
  description,
  columns,
  initial,
}: {
  listKey: string;
  title: string;
  description: string;
  columns: { key: string; label: string; required: boolean; long: boolean }[];
  initial: Row[];
}) {
  const [rows, setRows] = useState(initial);
  const { saving, error, dirty, save } = useAdminSave(rows);

  const rowColumns: RowColumn<string>[] = columns.map((c) => ({
    key: c.key,
    label: c.label,
    required: c.required,
    kind: c.long ? 'long' : 'text',
    span: c.long ? 12 : 6,
  }));
  const emptyRow = () => Object.fromEntries(columns.map((c) => [c.key, ''])) as Row;
  const here = `/admin/hidden/lists/${listKey}/`;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save(`/api/admin/hidden/lists/${listKey}`, 'PUT', { rows }, here);
      }}
    >
      <PageHeader
        title={title}
        description={description}
        back={{ href: '/admin/hidden/', label: 'Back to Hidden in Bangla' }}
        actions={
          <button type="submit" disabled={saving || !dirty} className="btn btn-primary disabled:opacity-60">
            {saving ? 'Saving…' : dirty ? 'Save list' : 'Saved'}
          </button>
        }
      />
      <ErrorBanner error={error} />
      <section className="card mt-6 p-6">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-lg font-bold text-fg">Rows</h2>
          <span className="text-xs font-bold text-muted tabular-nums">{rows.length} rows</span>
        </div>
        <RowsEditor rows={rows} columns={rowColumns} onChange={setRows} emptyRow={emptyRow} itemLabel="row" />
      </section>
    </form>
  );
}
