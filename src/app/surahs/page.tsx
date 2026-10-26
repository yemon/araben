import { getAllSurahs } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';
import { SurahsClient } from './SurahsClient';

export const metadata = pageMetadata({
  title: 'Surahs — word by word',
  description:
    "19 short surahs of the Qur'an, mapped word by word to English and Bangla. Every word links to its own study card.",
  path: '/surahs/',
});

// Re-read the content from the database at most every 5 minutes.
export const revalidate = 300;

export default async function SurahsPage() {
  return <SurahsClient surahs={await getAllSurahs()} />;
}
