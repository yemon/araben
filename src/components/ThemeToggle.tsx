'use client';

import { useEffect, useState } from 'react';
import { useT } from '@/lib/i18n/t';
import { dict } from '@/lib/i18n/dict';

type Theme = 'light-gray' | 'semi-dark' | 'sepia';

function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}
function MoonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
    </svg>
  );
}
function BookIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M4 4h11a4 4 0 0 1 4 4v12H8a4 4 0 0 1-4-4Z" />
      <path d="M4 4v14a2 2 0 0 0 2 2h13" />
    </svg>
  );
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light-gray');
  const t = useT();

  useEffect(() => {
    const stored = (localStorage.getItem('theme') as Theme | null) || null;
    const initial =
      stored && ['light-gray', 'semi-dark', 'sepia'].includes(stored)
        ? stored
        : 'light-gray';
    setTheme(initial);
    document.documentElement.setAttribute('data-theme', initial);
  }, []);

  function apply(next: Theme) {
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  }

  const themes: { id: Theme; label: string; icon: React.ReactNode }[] = [
    { id: 'light-gray', label: t(dict.themeSwitcher.light), icon: <SunIcon /> },
    { id: 'semi-dark', label: t(dict.themeSwitcher.dark), icon: <MoonIcon /> },
    { id: 'sepia', label: t(dict.themeSwitcher.sepia), icon: <BookIcon /> },
  ];

  return (
    <div
      role="radiogroup"
      aria-label={t(dict.themeSwitcher.label)}
      className="inline-flex rounded-full border border-border bg-surface p-1"
    >
      {themes.map((th) => {
        const active = theme === th.id;
        return (
          <button
            key={th.id}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={th.label}
            title={th.label}
            onClick={() => apply(th.id)}
            className={
              'flex items-center justify-center w-8 h-8 rounded-full transition-colors ' +
              (active ? 'bg-fg text-bg' : 'text-muted hover:text-fg')
            }
          >
            {th.icon}
          </button>
        );
      })}
    </div>
  );
}

export const themeInitScript = `
(function(){
  try {
    var t = localStorage.getItem('theme');
    if (!['light-gray','semi-dark','sepia'].includes(t)) {
      var prefers = window.matchMedia('(prefers-color-scheme: dark)').matches;
      t = prefers ? 'semi-dark' : 'light-gray';
    }
    document.documentElement.setAttribute('data-theme', t);
  } catch(e) {}
})();
`;
