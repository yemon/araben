'use client';

import Link from 'next/link';
import { useT } from '@/lib/i18n/t';
import { dict } from '@/lib/i18n/dict';

export default function NotFound() {
  const t = useT();
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="display text-4xl md:text-5xl mb-4">
        <span className="underline-flourish">{t(dict.notFound.title)}</span>
      </h1>
      <p className="text-fg-2 mb-8 read-body mx-auto">{t(dict.notFound.body)}</p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link href="/" className="btn btn-ghost">
          {t(dict.nav.home)}
        </Link>
        <Link href="/basics/" className="btn btn-ghost">
          {t(dict.nav.basics)}
        </Link>
        <Link href="/search/" className="btn btn-primary">
          {t(dict.nav.search)}
        </Link>
      </div>
    </div>
  );
}
