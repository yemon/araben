import { notFound } from 'next/navigation';
import { getHiddenCategoryInput } from '@/lib/admin/hidden';
import { HiddenCategoryForm } from '../../HiddenCategoryForm';

export const metadata = { title: 'Edit hidden-word category' };

export default async function EditHiddenCategoryPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const category = /^\d+$/.test(id) ? await getHiddenCategoryInput(Number(id)) : null;
  if (!category) notFound();
  const { id: categoryId, ...initial } = category;
  return <HiddenCategoryForm id={categoryId} initial={initial} />;
}
