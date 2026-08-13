'use client';

import { PageIntro } from '@/components/PageIntro';
import { ArabicText } from '@/components/ArabicText';
import type { HiddenCategory } from '@/types/content';
import { useT } from '@/lib/i18n/t';
import { dict } from '@/lib/i18n/dict';
import { CAT_LABELS } from '../HiddenClient';

const HEADS = {
  bangla: { bn: 'বাংলা', en: 'Bangla' },
  arabic: { bn: 'আরবি মূল', en: 'Arabic root' },
  sound: { bn: 'উচ্চারণ', en: 'Sound' },
  originalMeaning: { bn: 'আসল অর্থ', en: 'Original meaning' },
  note: { bn: 'নোট', en: 'Note' },
};

export function HiddenCategoryClient({ category }: { category: HiddenCategory }) {
  const t = useT();
  const label = CAT_LABELS[category.slug];
  const displayTitle = label ? t(label) : category.title;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <PageIntro
        crumbs={[
          { href: '/', labelKey: 'home', label: 'Home' },
          { href: '/hidden/', labelKey: 'hidden', label: 'Hidden in Bangla' },
          { label: displayTitle },
        ]}
        title={displayTitle}
        meta={t(dict.section.wordsCount)(category.entries.length)}
      />

      <div className="card overflow-hidden">
        <table className="w-full responsive-table">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-muted border-b border-border">
              <th className="p-3">{t(HEADS.bangla)}</th>
              <th className="p-3">{t(HEADS.arabic)}</th>
              <th className="p-3">{t(HEADS.sound)}</th>
              <th className="p-3">{t(HEADS.originalMeaning)}</th>
              <th className="p-3">{t(HEADS.note)}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[color:var(--border-2)]">
            {category.entries.map((e, i) => (
              <tr key={i} className="align-top">
                <td data-label={t(HEADS.bangla)} className="p-3 bn font-semibold" lang="bn">
                  {e.bangla}
                </td>
                <td data-label={t(HEADS.arabic)} className="p-3">
                  <ArabicText>{e.arabic}</ArabicText>
                </td>
                <td data-label={t(HEADS.sound)} className="p-3 translit">
                  {e.transliteration}
                </td>
                <td data-label={t(HEADS.originalMeaning)} className="p-3 text-sm bn" lang="bn">
                  {e.arabicMeaning}
                </td>
                <td data-label={t(HEADS.note)} className="p-3 text-sm text-muted bn" lang="bn">
                  {e.note}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
