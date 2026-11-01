import Link from 'next/link';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { Icon } from '@/components/admin/icons';
import { StatusToggle } from '@/components/admin/StatusToggle';
import { EditLink, EmptyState, PageHeader } from '@/components/admin/ui';
import { listSurahs } from '@/lib/admin/surahs';

export const metadata = { title: 'Surahs' };

export default async function AdminSurahsPage() {
  const surahs = await listSurahs();
  return (
    <div>
      <PageHeader
        title="Surahs"
        description={`${surahs.length} surah${surahs.length === 1 ? '' : 's'}, mapped word by word.`}
        actions={
          <Link href="/admin/surahs/create/" className="btn btn-primary">
            <Icon name="plus" size={16} strokeWidth={3} />
            New surah
          </Link>
        }
      />

      {surahs.length === 0 ? (
        <EmptyState>No surahs yet. Add the first one.</EmptyState>
      ) : (
        <ul className="mt-6 space-y-3">
          {surahs.map((s) => (
            // Laid out like the scenario cards: on phones the status sits
            // under the names, wider screens keep everything on one row.
            <li
              key={s.id}
              className="card grid grid-cols-[auto_minmax(0,1fr)_auto] gap-x-3 gap-y-2.5 p-4 sm:grid-cols-[auto_minmax(0,1fr)_auto_auto] sm:items-center sm:gap-x-4"
            >
              {/* Full size on phones too: three-digit numbers need it. */}
              <span className="stat-num row-span-2 inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent-soft text-lg text-accent sm:row-span-1">
                {s.mushafNumber}
              </span>
              <div className="min-w-0">
                <p className="truncate font-semibold text-fg">{s.englishName}</p>
                <p className="truncate text-sm text-muted">
                  <span className="bn">{s.banglaName}</span> · {s._count.verses} words
                </p>
              </div>
              <div className="col-start-2 row-start-2 flex items-center gap-3 sm:col-start-3 sm:row-start-1">
                <span dir="rtl" lang="ar" className="hidden font-arabic text-2xl text-fg sm:inline">
                  {s.arabicName}
                </span>
                <StatusToggle url={`/api/admin/surahs/${s.id}`} name={s.englishName} status={s.status} />
              </div>
              <div className="col-start-3 row-span-2 row-start-1 flex flex-col gap-2 sm:col-start-4 sm:row-span-1 sm:flex-row">
                <EditLink href={`/admin/surahs/edit/${s.id}/`} label={`Edit ${s.englishName}`} />
                <DeleteButton url={`/api/admin/surahs/${s.id}`} name={s.englishName} />
              </div>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-6 text-center text-xs text-muted">
        Surahs open on the site at{' '}
        <Link href="/surahs/" target="_blank" className="text-accent">
          /surahs
        </Link>
        .
      </p>
    </div>
  );
}
