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
            <li key={s.id} className="card flex flex-wrap items-center gap-4 p-4">
              <span className="stat-num inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent-soft text-xl text-accent">
                {s.number}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-fg">{s.englishTitle}</p>
                <p className="bn truncate text-sm text-muted">{s.banglaTitle}</p>
              </div>
              <span className="chip">{s._count.turns} turns</span>
              <Link href={`/scenarios/${s.slug}/`} target="_blank" className="chip no-underline hover:text-accent">
                /{s.slug} <Icon name="external" size={12} strokeWidth={2} />
              </Link>
              <div className="flex gap-2">
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
