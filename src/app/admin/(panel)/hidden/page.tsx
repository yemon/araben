import Link from 'next/link';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { Icon } from '@/components/admin/icons';
import { StatusToggle } from '@/components/admin/StatusToggle';
import { EditLink, EmptyState, PageHeader } from '@/components/admin/ui';
import { HIDDEN_LISTS, getHiddenList, listHiddenCategories, type HiddenListKey } from '@/lib/admin/hidden';

export const metadata = { title: 'Hidden in Bangla' };

export default async function AdminHiddenPage() {
  const keys = Object.keys(HIDDEN_LISTS) as HiddenListKey[];
  const [categories, ...lists] = await Promise.all([listHiddenCategories(), ...keys.map((k) => getHiddenList(k))]);

  return (
    <div>
      <PageHeader
        title="Hidden in Bangla"
        description="Arabic words that live on in everyday Bangla, by category, and three side lists."
        actions={
          <Link href="/admin/hidden/create/" className="btn btn-primary">
            <Icon name="plus" size={16} strokeWidth={3} />
            New category
          </Link>
        }
      />

      <h2 className="mt-8 text-sm font-bold uppercase tracking-wider text-muted">Categories</h2>
      {categories.length === 0 ? (
        <EmptyState>No categories yet. Add the first one.</EmptyState>
      ) : (
        <ul className="mt-3 space-y-3">
          {categories.map((c) => (
            // Phones: title, then words and status underneath, actions
            // stacked on the right. Wider screens: everything on one row.
            <li
              key={c.id}
              className="card grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 gap-y-2.5 p-4 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center sm:gap-x-4"
            >
              <div className="min-w-0">
                <p className="bn truncate font-semibold text-fg">{c.title}</p>
                <p className="font-translit truncate text-xs text-muted">/hidden/{c.slug}</p>
              </div>
              <div className="col-start-1 row-start-2 flex flex-wrap items-center gap-2 sm:col-start-2 sm:row-start-1">
                <span className="chip">{c._count.entries} words</span>
                <StatusToggle url={`/api/admin/hidden/${c.id}`} name={c.title} status={c.status} />
              </div>
              <div className="col-start-2 row-span-2 row-start-1 flex flex-col gap-2 sm:col-start-3 sm:row-span-1 sm:flex-row">
                <EditLink href={`/admin/hidden/edit/${c.id}/`} label={`Edit ${c.title}`} />
                <DeleteButton url={`/api/admin/hidden/${c.id}`} name={c.title} />
              </div>
            </li>
          ))}
        </ul>
      )}

      <h2 className="mt-10 text-sm font-bold uppercase tracking-wider text-muted">Side lists</h2>
      <div className="mt-3 grid gap-4 md:grid-cols-3">
        {keys.map((key, i) => (
          <Link key={key} href={`/admin/hidden/lists/${key}/`} className="card card-hover block p-5 no-underline">
            <div className="flex items-center justify-between">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-accent-2-soft text-accent-2">
                <Icon name="list" size={18} strokeWidth={2} />
              </span>
              <span className="stat-num text-2xl text-fg tabular-nums">{lists[i].length}</span>
            </div>
            <p className="mt-3 font-semibold text-fg">{HIDDEN_LISTS[key].title}</p>
            <p className="mt-1 text-sm text-muted">{HIDDEN_LISTS[key].description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
