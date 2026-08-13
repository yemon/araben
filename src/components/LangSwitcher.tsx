'use client';

import { useLang } from '@/lib/i18n/LangProvider';
import { dict } from '@/lib/i18n/dict';
import { useT } from '@/lib/i18n/t';

export function LangSwitcher() {
  const { lang, setLang } = useLang();
  const t = useT();

  const Btn = ({ id }: { id: 'bn' | 'en' }) => {
    const active = lang === id;
    const label = t(dict.langSwitcher[id]);
    return (
      <button
        type="button"
        role="radio"
        aria-checked={active}
        aria-label={label}
        title={label}
        onClick={() => setLang(id)}
        className={
          'px-3 py-1 text-xs md:text-sm rounded-full transition-colors ' +
          (active ? 'bg-fg text-bg font-medium' : 'text-muted hover:text-fg')
        }
      >
        {label}
      </button>
    );
  };

  return (
    <div
      role="radiogroup"
      aria-label={t(dict.langSwitcher.label)}
      className="inline-flex rounded-full border border-border bg-surface p-1"
    >
      <Btn id="bn" />
      <Btn id="en" />
    </div>
  );
}
