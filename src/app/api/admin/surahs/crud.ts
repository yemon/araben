import type { SectionCrud } from '@/lib/admin/routes';
import {
  deleteSurah,
  getSurahInput,
  listSurahs,
  readSurahInput,
  saveSurah,
  setSurahStatus,
  type SurahInput,
} from '@/lib/admin/surahs';

export const surahCrud: SectionCrud<SurahInput> = {
  label: 'Surah',
  list: listSurahs,
  get: getSurahInput,
  read: readSurahInput,
  save: saveSurah,
  remove: deleteSurah,
  setStatus: setSurahStatus,
};
