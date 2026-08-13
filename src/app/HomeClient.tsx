'use client';

import Link from 'next/link';
import { ArabicText } from '@/components/ArabicText';
import { useT } from '@/lib/i18n/t';
import { dict } from '@/lib/i18n/dict';
import type { Word } from '@/types/content';

interface Stats {
  words: number;
  surahs: number;
  scenarios: number;
  roots: number;
  basicsCategories: number;
  verses: number;
}

interface Props {
  stats: Stats;
  featuredWords: Pick<Word, 'slug' | 'arabic' | 'transliteration'>[];
}

export function HomeClient({ stats, featuredWords }: Props) {
  const t = useT();

  return (
    <div className="mx-auto max-w-6xl px-4">
      {/* Hero */}
      <section className="hero-ornament pt-16 pb-16 md:pt-24 md:pb-20 text-center">
        <div className="mb-6" aria-hidden>
          <ArabicText size="lg" className="text-fg">
            اَلسَّلَامُ عَلَيْكُمْ
          </ArabicText>
        </div>
        <div className="chip chip-accent mb-6" role="doc-subtitle">
          <span aria-hidden>❋</span>
          <span>{t(dict.hero.heroLead)}</span>
        </div>
        <h1 className="display text-4xl md:text-6xl leading-tight tracking-tight mb-6">
          <span className="underline-flourish">{t(dict.site.shortTagline)}</span>
        </h1>
        <p className="text-lg md:text-xl text-fg-2 max-w-2xl mx-auto leading-relaxed">
          {t(dict.hero.heroLead2)}{' '}
          <strong className="text-accent">{t(dict.hero.heroLead3)}</strong>
          {t(dict.hero.heroLead4)}
        </p>
        <div className="mt-9 flex flex-wrap gap-3 justify-center">
          <Link href="/basics/greetings/" className="btn btn-primary">
            {t(dict.hero.startCta)}
          </Link>
          <Link href="/scenarios/" className="btn btn-ghost">
            {t(dict.hero.scenarioCta)}
          </Link>
        </div>

        {/* Live stats — replaces the removed meta strip */}
        <dl className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          <StatCard n={stats.words} label={t(dict.nav.search)} />
          <StatCard n={stats.surahs} label={t(dict.nav.surahs)} />
          <StatCard n={stats.scenarios} label={t(dict.nav.scenarios)} />
          <StatCard n={stats.roots} label={t(dict.nav.roots)} />
        </dl>
      </section>

      {/* Path */}
      <section aria-labelledby="path" className="mb-20">
        <div className="divider-fancy mb-8">
          <span>{t(dict.path.heading)}</span>
        </div>
        <ol className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <PathCard
            step={1}
            href="/alphabet/"
            title={t(dict.path.alphabetTitle)}
            desc={t(dict.path.alphabetDesc)}
            count={t(dict.path.alphabetCount)}
            accent="accent"
          />
          <PathCard
            step={2}
            href="/grammar/"
            title={t(dict.path.grammarTitle)}
            desc={t(dict.path.grammarDesc)}
            count={t(dict.path.grammarCount)}
            accent="accent"
          />
          <PathCard
            step={3}
            href="/basics/"
            title={t(dict.path.basicsTitle)}
            desc={t(dict.path.basicsDesc)}
            count={t(dict.path.basicsCount)(stats.basicsCategories)}
            accent="accent"
          />
          <PathCard
            step={4}
            href="/scenarios/"
            title={t(dict.path.scenariosTitle)}
            desc={t(dict.path.scenariosDesc)}
            count={t(dict.path.scenariosCount)(stats.scenarios)}
            accent="accent-2"
          />
          <PathCard
            step={5}
            href="/surahs/"
            title={t(dict.path.surahsTitle)}
            desc={t(dict.path.surahsDesc)}
            count={t(dict.path.surahsCount)(stats.surahs, stats.verses)}
            accent="accent-2"
          />
          <PathCard
            step={6}
            href="/roots/"
            title={t(dict.path.rootsTitle)}
            desc={t(dict.path.rootsDesc)}
            count={t(dict.path.rootsCount)(stats.roots)}
            accent="accent-2"
          />
          <PathCard
            step={7}
            href="/hidden/"
            title={t(dict.path.hiddenTitle)}
            desc={t(dict.path.hiddenDesc)}
            count={t(dict.path.hiddenCount)}
            accent="accent-2"
          />
          <PathCard
            step="✦"
            href="/search/"
            title={t(dict.path.searchTitle)}
            desc={t(dict.path.searchDesc)(stats.words)}
            count={t(dict.path.searchCount)}
            accent="accent"
          />
        </ol>
      </section>

      {/* Featured */}
      <section aria-labelledby="featured" className="mb-20 grid md:grid-cols-2 gap-6">
        <div className="card p-7">
          <div className="chip chip-warm mb-4">
            <span aria-hidden>◆</span>
            {t(dict.home.startHere)}
          </div>
          <h3 id="featured" className="display text-2xl mb-3">
            {t(dict.featured.wordTitle)}
          </h3>
          <p className="text-fg-2 mb-5 leading-relaxed">{t(dict.featured.wordDesc)}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {featuredWords.map((w) => (
              <Link
                key={w.slug}
                href={`/word/${w.slug}/`}
                className="card-2 p-3 no-underline hover:border-accent transition-colors flex flex-col"
              >
                <ArabicText>{w.arabic}</ArabicText>
                <span className="translit text-xs mt-0.5">{w.transliteration}</span>
              </Link>
            ))}
          </div>
        </div>
        <div className="card p-7">
          <div className="chip chip-accent mb-4">
            <span aria-hidden>❋</span>
            {t(dict.home.supportedBy)}
          </div>
          <h3 className="display text-2xl mb-3">{t(dict.featured.readTitle)}</h3>
          <p className="text-fg-2 mb-5 leading-relaxed">{t(dict.featured.readDesc)}</p>
          <ul className="space-y-3 text-sm">
            <ThemeRow
              swatchStyle={{ background: '#eef1f4', border: '1px solid #d0d4d9' }}
              name={t(dict.themeSwitcher.light)}
              desc={t(dict.featured.themeLight)}
            />
            <ThemeRow
              swatchStyle={{ background: '#22272e', border: '1px solid #3a4048' }}
              name={t(dict.themeSwitcher.dark)}
              desc={t(dict.featured.themeDark)}
            />
            <ThemeRow
              swatchStyle={{ background: '#f0e3c6', border: '1px solid #d9c9a3' }}
              name={t(dict.themeSwitcher.sepia)}
              desc={t(dict.featured.themeSepia)}
            />
          </ul>
        </div>
      </section>
    </div>
  );
}

function StatCard({ n, label }: { n: number; label: string }) {
  return (
    <div className="card p-4 text-center">
      <div className="stat-num">{n}</div>
      <dt className="text-xs text-muted uppercase tracking-wider mt-1">{label}</dt>
    </div>
  );
}

function PathCard({
  step,
  href,
  title,
  desc,
  count,
  accent = 'accent',
}: {
  step: number | string;
  href: string;
  title: string;
  desc: string;
  count: string;
  accent?: 'accent' | 'accent-2';
}) {
  return (
    <li>
      <Link
        href={href}
        className="card card-hover p-6 flex flex-col h-full no-underline text-fg"
      >
        <div className="flex items-center gap-3 mb-3">
          <span
            className="inline-flex items-center justify-center w-9 h-9 rounded-xl font-semibold text-sm"
            style={{
              background:
                accent === 'accent'
                  ? 'var(--gradient-accent)'
                  : 'var(--gradient-accent-2)',
              color: 'var(--accent-fg)',
            }}
            aria-hidden
          >
            {step}
          </span>
          <h3 className="display text-xl">{title}</h3>
        </div>
        <p className="text-fg-2 text-[15px] leading-relaxed mb-4">{desc}</p>
        <div className="mt-auto text-xs text-muted">{count}</div>
      </Link>
    </li>
  );
}

function ThemeRow({
  swatchStyle,
  name,
  desc,
}: {
  swatchStyle: React.CSSProperties;
  name: string;
  desc: string;
}) {
  return (
    <li className="flex items-start gap-3">
      <span
        className="mt-0.5 w-6 h-6 rounded-full shrink-0"
        style={swatchStyle}
        aria-hidden
      />
      <div>
        <div className="font-medium">{name}</div>
        <div className="text-muted text-sm">{desc}</div>
      </div>
    </li>
  );
}
