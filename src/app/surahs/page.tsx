import { getAllSurahs } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';
import { SurahsClient } from './SurahsClient';

export const metadata = pageMetadata({
  title: 'Surahs — word by word',
  description:
    "19 short surahs of the Qur'an, mapped word by word to English and Bangla. Every word links to its own study card.",
  path: '/surahs/',
});

export default function SurahsPage() {
  return <SurahsClient surahs={getAllSurahs()} />;
}
