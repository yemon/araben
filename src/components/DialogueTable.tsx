import type { DialogueTurn } from '@/types/content';
import { ArabicText } from './ArabicText';

export function DialogueTable({ turns }: { turns: DialogueTurn[] }) {
  return (
    <div className="card overflow-hidden">
      <table className="w-full responsive-table">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wider text-muted border-b border-border">
            <th className="p-3 w-24">Who</th>
            <th className="p-3">Arabic</th>
            <th className="p-3">Transliteration</th>
            <th className="p-3">English</th>
            <th className="p-3 bn">বাংলা</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[color:var(--border)]">
          {turns.map((t, i) => (
            <tr key={i} className="align-top">
              <td data-label="Who" className="p-3 text-muted text-sm">
                {t.speaker}
              </td>
              <td data-label="Arabic" className="p-3">
                <ArabicText>{t.arabic}</ArabicText>
              </td>
              <td data-label="Transliteration" className="p-3 translit">
                {t.transliteration}
              </td>
              <td data-label="English" className="p-3">
                {t.english}
              </td>
              <td data-label="বাংলা" className="p-3 bn" lang="bn">
                {t.bangla}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
