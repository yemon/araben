'use client';

/**
 * An editable, ordered list of rows — dialogue turns, verse words, hidden
 * words, list entries. Each row is a small card of fields; rows can be
 * added, removed and moved up or down.
 */

import { Icon } from './icons';
import { arabicInputClass, inputClass } from './ui';

export interface RowColumn<K extends string> {
  key: K;
  label: string;
  kind?: 'text' | 'arabic' | 'long' | 'number' | 'time';
  required?: boolean;
  placeholder?: string;
  // Grid span out of 12 on wide screens.
  span?: number;
  // 'time' only: fill the field from a player ("Now"), and play from the
  // time in the field (▶). Either may be left out.
  capture?: () => string | null;
  preview?: (value: string) => void;
}

const SPAN: Record<number, string> = {
  2: 'sm:col-span-2',
  3: 'sm:col-span-3',
  4: 'sm:col-span-4',
  5: 'sm:col-span-5',
  6: 'sm:col-span-6',
  7: 'sm:col-span-7',
  8: 'sm:col-span-8',
  9: 'sm:col-span-9',
  12: 'sm:col-span-12',
};

export function RowsEditor<K extends string>({
  rows,
  columns,
  onChange,
  emptyRow,
  itemLabel,
}: {
  rows: Record<K, string>[];
  columns: RowColumn<K>[];
  onChange: (rows: Record<K, string>[]) => void;
  emptyRow: () => Record<K, string>;
  itemLabel: string; // "turn", "word"…
}) {
  const update = (i: number, key: K, value: string) =>
    onChange(rows.map((r, j) => (j === i ? { ...r, [key]: value } : r)));
  const move = (i: number, by: -1 | 1) => {
    const next = rows.slice();
    [next[i], next[i + by]] = [next[i + by], next[i]];
    onChange(next);
  };
  const remove = (i: number) => onChange(rows.filter((_, j) => j !== i));
  const insertAfter = (i: number) => onChange([...rows.slice(0, i + 1), emptyRow(), ...rows.slice(i + 1)]);

  const small =
    'inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-fg disabled:opacity-30 disabled:hover:bg-transparent';

  return (
    <div>
      <ol className="space-y-3">
        {rows.map((row, i) => (
          <li key={i} className="card-2 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted">
                {itemLabel} {i + 1}
              </span>
              <div className="flex items-center gap-0.5">
                <button type="button" className={small} onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Move ${itemLabel} ${i + 1} up`} title="Move up">
                  <Icon name="chevronUp" size={16} />
                </button>
                <button type="button" className={small} onClick={() => move(i, 1)} disabled={i === rows.length - 1} aria-label={`Move ${itemLabel} ${i + 1} down`} title="Move down">
                  <Icon name="chevronDown" size={16} />
                </button>
                <button type="button" className={small} onClick={() => insertAfter(i)} aria-label={`Insert a ${itemLabel} after ${i + 1}`} title="Insert below">
                  <Icon name="plus" size={16} />
                </button>
                <button
                  type="button"
                  className={`${small} hover:!text-rose-600`}
                  onClick={() => remove(i)}
                  aria-label={`Remove ${itemLabel} ${i + 1}`}
                  title="Remove"
                >
                  <Icon name="trash" size={15} />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-12">
              {columns.map((col) => {
                const id = `row-${i}-${col.key}`;
                const value = row[col.key] ?? '';
                return (
                  <div key={col.key} className={SPAN[col.span ?? 12] ?? 'sm:col-span-12'}>
                    <label htmlFor={id} className="mb-0.5 block text-xs font-semibold text-muted">
                      {col.label}
                      {col.required && ' *'}
                    </label>
                    {col.kind === 'time' ? (
                      <div className="flex gap-1">
                        <input
                          id={id}
                          type="text"
                          inputMode="decimal"
                          value={value}
                          placeholder={col.placeholder ?? '0:00'}
                          onChange={(e) => update(i, col.key, e.target.value)}
                          className={`${inputClass} min-w-0 px-3 py-2 font-translit text-sm`}
                        />
                        {col.capture && (
                          <button
                            type="button"
                            onClick={() => {
                              const now = col.capture!();
                              if (now !== null) update(i, col.key, now);
                            }}
                            className="shrink-0 rounded-lg border border-border px-2 text-xs font-bold text-muted transition-colors hover:border-accent hover:text-accent"
                            title="Use the player's current time"
                          >
                            Now
                          </button>
                        )}
                        {col.preview && (
                          <button
                            type="button"
                            onClick={() => col.preview!(value)}
                            disabled={!value.trim()}
                            className="shrink-0 rounded-lg border border-border px-2 text-xs text-muted transition-colors hover:border-accent hover:text-accent disabled:opacity-40"
                            title="Play the video from this time"
                            aria-label={`Play ${itemLabel} ${i + 1} from ${value || 'its start'}`}
                          >
                            ▶
                          </button>
                        )}
                      </div>
                    ) : col.kind === 'long' ? (
                      <textarea
                        id={id}
                        value={value}
                        rows={2}
                        placeholder={col.placeholder}
                        onChange={(e) => update(i, col.key, e.target.value)}
                        className={`${inputClass} py-2 text-sm`}
                      />
                    ) : (
                      <input
                        id={id}
                        type={col.kind === 'number' ? 'number' : 'text'}
                        inputMode={col.kind === 'number' ? 'numeric' : undefined}
                        value={value}
                        placeholder={col.placeholder}
                        onChange={(e) => update(i, col.key, e.target.value)}
                        dir={col.kind === 'arabic' ? 'rtl' : undefined}
                        lang={col.kind === 'arabic' ? 'ar' : undefined}
                        className={col.kind === 'arabic' ? `${arabicInputClass} py-1.5` : `${inputClass} py-2 text-sm`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </li>
        ))}
      </ol>
      <button
        type="button"
        onClick={() => onChange([...rows, emptyRow()])}
        className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border px-4 py-3 text-sm font-semibold text-muted transition-colors hover:border-accent hover:text-accent"
      >
        <Icon name="plus" size={16} strokeWidth={3} />
        Add a {itemLabel}
      </button>
    </div>
  );
}
