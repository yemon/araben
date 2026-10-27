import Link from 'next/link';
import { Icon, type IconName } from '@/components/admin/icons';
import { getAdmin } from '@/lib/admin/session';
import { prisma } from '@/lib/prisma';

export const metadata = { title: 'Dashboard' };

const SECTION_ICON: Record<string, IconName> = {
  scenarios: 'messages',
  surahs: 'book',
  hidden: 'languages',
  trace: 'penLine',
  videos: 'video',
};

const ACTION_TONE: Record<string, string> = {
  create: 'chip chip-accent',
  update: 'chip',
  delete: 'chip !bg-rose-50 !text-rose-700',
};

function timeAgo(date: Date, now = Date.now()) {
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const s = Math.round((date.getTime() - now) / 1000);
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ['year', 31_536_000],
    ['month', 2_592_000],
    ['week', 604_800],
    ['day', 86_400],
    ['hour', 3_600],
    ['minute', 60],
  ];
  for (const [unit, secs] of units) if (Math.abs(s) >= secs) return rtf.format(Math.round(s / secs), unit);
  return 'just now';
}

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
};

async function loadStats() {
  const gameType = await prisma.gameType.findUnique({ where: { code: 'word-trace' }, select: { id: true } });
  const traceWhere = { gameTypeId: gameType?.id ?? -1 };
  const lastSync = await prisma.contentSync.findFirst({ orderBy: { syncedAt: 'desc' } });
  const [
    scenarios,
    turns,
    surahs,
    verses,
    hiddenCategories,
    hiddenEntries,
    sideRows,
    words,
    published,
    drafts,
    recent,
    editsSinceSync,
  ] = await Promise.all([
    prisma.scenario.count(),
    prisma.scenarioTurn.count(),
    prisma.surah.count(),
    prisma.surahVerse.count(),
    prisma.hiddenCategory.count(),
    prisma.hiddenEntry.count(),
    Promise.all([prisma.hiddenPersianWord.count(), prisma.hiddenMixedWord.count(), prisma.hiddenEnglishWord.count()]).then(
      (n) => n.reduce((a, b) => a + b, 0),
    ),
    prisma.word.count(),
    prisma.game.count({ where: { ...traceWhere, status: 'published' } }),
    prisma.game.count({ where: { ...traceWhere, status: { not: 'published' } } }),
    prisma.contentEdit.findMany({ orderBy: { createdAt: 'desc' }, take: 8 }),
    prisma.contentEdit.count({
      where: { section: { notIn: ['trace', 'videos'] }, ...(lastSync ? { createdAt: { gt: lastSync.syncedAt } } : {}) },
    }),
  ]);
  return { scenarios, turns, surahs, verses, hiddenCategories, hiddenEntries, sideRows, words, published, drafts, recent, lastSync, editsSinceSync };
}

function StatCard({
  href,
  icon,
  label,
  value,
  detail,
}: {
  href: string;
  icon: IconName;
  label: string;
  value: number;
  detail: string;
}) {
  return (
    <Link href={href} className="card card-hover group block p-5 no-underline">
      <div className="flex items-start justify-between">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-soft text-accent">
          <Icon name={icon} size={20} strokeWidth={2} />
        </span>
        <span className="text-xs font-semibold text-muted opacity-0 transition-opacity group-hover:opacity-100">
          Manage →
        </span>
      </div>
      <p className="stat-num mt-4 text-4xl text-fg tabular-nums">{value.toLocaleString('en')}</p>
      <p className="mt-1 font-semibold text-fg">{label}</p>
      <p className="text-sm text-muted">{detail}</p>
    </Link>
  );
}

export default async function AdminDashboard() {
  const [admin, s] = await Promise.all([getAdmin(), loadStats()]);
  const now = Date.now();

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted">{greeting()}</p>
          <h1 className="mt-1 font-serif text-3xl font-semibold text-fg">
            {admin?.name || admin?.email}
          </h1>
          <p className="mt-1 text-sm text-muted">Here’s the state of araben’s content.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/scenarios/create/" className="btn btn-ghost">
            <Icon name="plus" size={16} strokeWidth={3} /> Scenario
          </Link>
          <Link href="/admin/trace/create/" className="btn btn-primary">
            <Icon name="plus" size={16} strokeWidth={3} /> Trace word
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard href="/admin/scenarios/" icon="messages" label="Scenarios" value={s.scenarios} detail={`${s.turns} dialogue turns`} />
        <StatCard href="/admin/surahs/" icon="book" label="Surahs" value={s.surahs} detail={`${s.verses} words, word by word`} />
        <StatCard
          href="/admin/hidden/"
          icon="languages"
          label="Hidden in Bangla"
          value={s.hiddenEntries}
          detail={`${s.hiddenCategories} categories · ${s.sideRows} list rows`}
        />
        <StatCard
          href="/admin/trace/"
          icon="penLine"
          label="Trace words"
          value={s.published + s.drafts}
          detail={`${s.published} published · ${s.drafts} draft${s.drafts === 1 ? '' : 's'}`}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-5">
        <section className="card p-6 lg:col-span-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-fg">Recent activity</h2>
            <Icon name="clock" size={18} strokeWidth={2} className="text-muted" />
          </div>
          {s.recent.length === 0 ? (
            <p className="mt-6 text-sm text-muted">No changes yet. Edits made here will be listed as they happen.</p>
          ) : (
            <ul className="mt-4 divide-y divide-[color:var(--border-2)]">
              {s.recent.map((e) => (
                <li key={e.id} className="flex items-start gap-3 py-3">
                  <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface-2 text-muted">
                    <Icon name={SECTION_ICON[e.section] ?? 'pencil'} size={16} strokeWidth={2} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-fg">{e.summary}</p>
                    <p className="mt-0.5 text-xs text-muted">
                      {e.adminEmail} · <time dateTime={e.createdAt.toISOString()}>{timeAgo(e.createdAt, now)}</time>
                    </p>
                  </div>
                  <span className={ACTION_TONE[e.action] ?? 'chip'}>{e.action}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="space-y-6 lg:col-span-2">
          <section className="card p-6">
            <h2 className="text-lg font-bold text-fg">Content source</h2>
            {s.editsSinceSync > 0 ? (
              <div className="mt-4 flex gap-3 rounded-2xl bg-accent-2-soft p-4">
                <Icon name="alert" size={18} strokeWidth={2} className="mt-0.5 shrink-0 text-accent-2" />
                <p className="text-sm text-fg-2">
                  <strong>{s.editsSinceSync} admin edit{s.editsSinceSync === 1 ? '' : 's'}</strong> since content was last
                  loaded from the guide. The database is now ahead of <code>arabic-complete-guide.md</code>, so{' '}
                  <code>npm run content:sync</code> will refuse to run unless forced.
                </p>
              </div>
            ) : (
              <div className="mt-4 flex gap-3 rounded-2xl bg-accent-soft p-4">
                <Icon name="check" size={18} strokeWidth={2.5} className="mt-0.5 shrink-0 text-accent" />
                <p className="text-sm text-fg-2">The database matches the content last loaded from the guide.</p>
              </div>
            )}
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Last loaded from the guide</dt>
                <dd className="text-right font-medium text-fg">{s.lastSync ? timeAgo(s.lastSync.syncedAt, now) : 'never'}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Words in the index</dt>
                <dd className="font-medium text-fg tabular-nums">{s.words.toLocaleString('en')}</dd>
              </div>
            </dl>
          </section>

          <section className="card p-6">
            <h2 className="text-lg font-bold text-fg">Quick links</h2>
            <ul className="mt-3 space-y-1 text-sm">
              {[
                ['/admin/surahs/create/', 'Add a surah'],
                ['/admin/hidden/create/', 'Add a hidden-word category'],
                ['/admin/hidden/lists/persian/', 'Edit the Persian-not-Arabic list'],
                ['/practice/trace/', 'Open the trace game'],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="flex items-center justify-between rounded-xl px-3 py-2 text-fg-2 no-underline transition-colors hover:bg-surface-2 hover:text-accent"
                  >
                    {label}
                    <span aria-hidden>→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
