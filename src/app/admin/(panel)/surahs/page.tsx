import Link from 'next/link';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { Icon } from '@/components/admin/icons';
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
        <ul className="mt-6 grid gap-3 md:grid-cols-2">
          {surahs.map((s) => (
            <li key={s.id} className="card flex items-center gap-4 p-4">
              <span className="stat-num inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent-soft text-lg text-accent">
                {s.mushafNumber}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-fg">{s.englishName}</p>
                <p className="truncate text-sm text-muted">
                  <span className="bn">{s.banglaName}</span> · {s._count.verses} words
                </p>
              </div>
              <span dir="rtl" lang="ar" className="hidden font-arabic text-2xl text-fg sm:inline">
                {s.arabicName}
              </span>
              <div className="flex gap-2">
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
