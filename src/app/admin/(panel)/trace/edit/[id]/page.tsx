import { notFound } from 'next/navigation';
import { getGameById } from '@/lib/trace/wordTraceDataManager';
import WordTraceBuilder from '../../WordTraceBuilder';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Edit trace word' };

export default async function EditWordTracePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const game = /^\d+$/.test(id) ? await getGameById(id) : null;
  if (!game) notFound();

  return <WordTraceBuilder mode="edit" gameId={id} initialData={game} />;
}
