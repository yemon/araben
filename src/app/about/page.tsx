import { pageMetadata } from '@/lib/seo';
import { AboutClient } from './AboutClient';

export const metadata = pageMetadata({
  title: 'About',
  description:
    "araben.study is a free, static guide for Bangla and English speakers learning basic Arabic conversation, with the Qur'anic vocabulary and root system to back it up.",
  path: '/about/',
});

export default function AboutPage() {
  return <AboutClient />;
}
