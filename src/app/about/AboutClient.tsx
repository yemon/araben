'use client';

import { PageIntro } from '@/components/PageIntro';
import { useT } from '@/lib/i18n/t';

const ABOUT = {
  title: { bn: 'পরিচিতি', en: 'About araben.study' },
  intro: {
    bn:
      'বাংলাভাষী শিক্ষার্থীর জন্য একটি শান্ত, নিজে থেকে চলার আরবি গাইড। সবকিছু বিনামূল্যে, সম্পূর্ণ স্ট্যাটিক, একবার লোড হলে অফলাইনেও চলে। কোনো ডাটাবেস নেই, লগইন নেই, ট্র্যাকিং নেই। তোমার নির্বাচিত থিম ছাড়া কিছুই সংরক্ষিত হয় না।',
    en:
      "A calm, self-paced guide to Arabic for Bangla and English speakers. Everything is free, fully static, and works offline once the site is loaded. There is no database. There is no login. There is no tracking. The only thing saved on your device is your chosen reading theme.",
  },
  buildHead: { bn: 'কীভাবে তৈরি', en: "How it's built" },
  buildBody: {
    bn:
      'পুরো কারিকুলাম একটি মার্কডাউন ফাইলে। একটি পার্সার প্রতিটি টেবিলকে JSON-এ রূপান্তরিত করে, আর প্রতিটি শব্দ পায় নিজের URL — প্রায় ৯০০টি পাতা, সবই আগেই রেন্ডার করা। তিনটি রিডিং থিম (লাইট গ্রে, সেমি-ডার্ক, সেপিয়া) global CSS-এ থাকে, পেজ রিলোড ছাড়াই সঙ্গে সঙ্গে বদলায়।',
    en:
      'The curriculum lives in a single markdown file. A parser turns every table into structured JSON, and every word gets its own URL — around 900 pages, all pre-rendered. The three reading themes (light gray, semi-dark, sepia) live in the global CSS and switch instantly without a page reload.',
  },
  focusHead: { bn: 'ফোকাস', en: 'Focus' },
  focusBody: {
    bn:
      'সাইটটি মূলত বেসিক কথোপকথনের জন্য বানানো। শুরু করার সেরা জায়গা: বেসিক অথবা বাস্তব দৃশ্য। সূরা, মূল-শব্দ, আর বাংলায় লুকানো আরবি অংশগুলো শেখাকে আরো গভীর ও দৃঢ় করে।',
    en:
      "The site is optimised for basic conversation. Start at Basics or Scenarios if that's your goal. The Surahs, Roots, and Hidden-in-Bangla sections are there to deepen and reinforce what you learn.",
  },
  audioHead: { bn: 'অডিও', en: 'Audio' },
  audioBody: {
    bn:
      'উচ্চারণের অডিও Eleven Labs দিয়ে তৈরি করা। প্রথম সেটআপে ১০০টি মূল কথ্য শব্দে অডিও যোগ হয়; বাকিগুলো একটি কমান্ডেই যোগ করা যায়। যে শব্দে এখনো অডিও নেই সেখানে Listen বোতাম নিষ্ক্রিয়—আর কিছু বদলায় না।',
    en:
      'Pronunciation clips are generated with Eleven Labs. On the very first setup, 100 core conversational words get audio; adding more is a one-command re-run. If a word has no audio yet, the Listen button is disabled — nothing else changes.',
  },
};

export function AboutClient() {
  const t = useT();
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <PageIntro
        crumbs={[
          { href: '/', labelKey: 'home', label: 'Home' },
          { labelKey: 'about', label: 'About' },
        ]}
        title={t(ABOUT.title)}
      />
      <div className="read-body space-y-6">
        <p>{t(ABOUT.intro)}</p>
        <h2 className="display text-xl mt-8 text-fg">{t(ABOUT.buildHead)}</h2>
        <p>{t(ABOUT.buildBody)}</p>
        <h2 className="display text-xl mt-8 text-fg">{t(ABOUT.focusHead)}</h2>
        <p>{t(ABOUT.focusBody)}</p>
        <h2 className="display text-xl mt-8 text-fg">{t(ABOUT.audioHead)}</h2>
        <p>{t(ABOUT.audioBody)}</p>
      </div>
    </div>
  );
}
