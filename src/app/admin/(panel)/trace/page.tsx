import { getAllGames } from '@/lib/trace/wordTraceDataManager';
import AdminTraceList from './AdminTraceList';

// Drafts and published rows both, read fresh on every request so a save in
// the builder shows up as soon as it lands back here.
export const dynamic = 'force-dynamic';

export const metadata = { title: 'Trace words' };

export default async function AdminTracePage() {
  const games = await getAllGames();
  return <AdminTraceList games={games} />;
}
