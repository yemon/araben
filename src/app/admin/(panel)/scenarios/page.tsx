import Link from 'next/link';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { Icon } from '@/components/admin/icons';
import { EditLink, EmptyState, PageHeader } from '@/components/admin/ui';
import { listScenarios } from '@/lib/admin/scenarios';

export const metadata = { title: 'Scenarios' };

export default async function AdminScenariosPage() {
  const scenarios = await listScenarios();
  return (
    <div>
      <PageHeader
        title="Scenarios"
        description={`${scenarios.length} real-life dialogue${scenarios.length === 1 ? '' : 's'}, in the order the site lists them.`}
        actions={
          <Link href="/admin/scenarios/create/" className="btn btn-primary">
            <Icon name="plus" size={16} strokeWidth={3} />
            New scenario
          </Link>
        }
      />

      {scenarios.length === 0 ? (
        <EmptyState>No scenarios yet. Add the first one.</EmptyState>
      ) : (
        <ul className="mt-6 space-y-3">
          {scenarios.map((s) => (
            // Phones: number · title with its badges underneath · actions
            // stacked on the right. Wider screens: everything on one row.
            <li
              key={s.id}
              className="card grid grid-cols-[auto_minmax(0,1fr)_auto] gap-x-3 gap-y-2.5 p-4 sm:grid-cols-[auto_minmax(0,1fr)_auto_auto] sm:items-center sm:gap-x-4"
            >
              <span className="stat-num row-span-2 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-accent-soft text-lg text-accent sm:row-span-1 sm:h-12 sm:w-12 sm:text-xl">
                {s.number}
              </span>
              <div className="min-w-0">
                <p className="line-clamp-2 font-semibold leading-snug text-fg sm:truncate">{s.englishTitle}</p>
                <p className="bn mt-0.5 line-clamp-1 text-sm text-muted sm:truncate">{s.banglaTitle}</p>
              </div>
              <div className="col-start-2 row-start-2 flex min-w-0 flex-wrap items-center gap-1.5 sm:col-start-3 sm:row-start-1 sm:gap-2">
                <span className="chip">{s._count.turns} turns</span>
                {s._count.videos > 0 && (
                  <span className="chip chip-accent" title={`${s._count.videos} video${s._count.videos === 1 ? '' : 's'}`}>
                    <Icon name="video" size={12} strokeWidth={2} /> {s._count.videos}
                  </span>
                )}
                <Link
                  href={`/scenarios/${s.slug}/`}
                  target="_blank"
                  className="chip min-w-0 max-w-full no-underline hover:text-accent"
                  title={`Open /scenarios/${s.slug}/ on the site`}
                >
                  <span className="truncate">/{s.slug}</span>
                  <Icon name="external" size={12} strokeWidth={2} />
                </Link>
              </div>
              <div className="col-start-3 row-span-2 row-start-1 flex flex-col gap-2 sm:col-start-4 sm:row-span-1 sm:flex-row">
                <EditLink href={`/admin/scenarios/edit/${s.id}/`} label={`Edit ${s.englishTitle}`} />
                <DeleteButton url={`/api/admin/scenarios/${s.id}`} name={s.englishTitle} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
