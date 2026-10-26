import { notFound } from 'next/navigation';
import { HIDDEN_LISTS, getHiddenList, isHiddenListKey } from '@/lib/admin/hidden';
import { HiddenListForm } from './HiddenListForm';

export async function generateMetadata(props: { params: Promise<{ list: string }> }) {
  const { list } = await props.params;
  return { title: isHiddenListKey(list) ? HIDDEN_LISTS[list].title : 'List' };
}

export default async function HiddenListPage(props: { params: Promise<{ list: string }> }) {
  const { list } = await props.params;
  if (!isHiddenListKey(list)) notFound();
  const { title, description, columns } = HIDDEN_LISTS[list];
  return (
    <HiddenListForm
      listKey={list}
      title={title}
      description={description}
      columns={columns.map((c) => ({ key: c.key, label: c.label, required: c.required, long: c.long }))}
      initial={await getHiddenList(list)}
    />
  );
}
