import { notFound } from 'next/navigation';
import { getSurahInput } from '@/lib/admin/surahs';
import { SurahForm } from '../../SurahForm';

export const metadata = { title: 'Edit surah' };

export default async function EditSurahPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const surah = /^\d+$/.test(id) ? await getSurahInput(Number(id)) : null;
  if (!surah) notFound();
  const { id: surahId, mushafNumber, verses, ...rest } = surah;
  return (
    <SurahForm
      id={surahId}
      initial={{
        ...rest,
        mushafNumber: String(mushafNumber),
        verses: verses.map((v) => ({ ...v, ayah: String(v.ayah) })),
      }}
    />
  );
}
