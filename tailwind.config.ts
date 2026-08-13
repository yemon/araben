import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: ['class', '[data-theme="semi-dark"]'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        'bg-2': 'var(--bg-2)',
        surface: 'var(--surface)',
        'surface-2': 'var(--surface-2)',
        'surface-3': 'var(--surface-3)',
        fg: 'var(--fg)',
        'fg-2': 'var(--fg-2)',
        muted: 'var(--muted)',
        accent: 'var(--accent)',
        'accent-2': 'var(--accent-2)',
        'accent-soft': 'var(--accent-soft)',
        'accent-2-soft': 'var(--accent-2-soft)',
        'accent-fg': 'var(--accent-fg)',
        border: 'var(--border)',
        'border-2': 'var(--border-2)',
        highlight: 'var(--highlight)',
      },
      fontFamily: {
        arabic: ['var(--font-arabic)', 'Amiri', 'Scheherazade New', 'serif'],
        bangla: ['var(--font-bangla)', 'Noto Sans Bengali', 'sans-serif'],
        latin: ['var(--font-latin)', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Source Serif Pro', 'Charter', 'Georgia', 'serif'],
        translit: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      maxWidth: {
        prose: '68ch',
      },
    },
  },
  plugins: [],
};

export default config;
