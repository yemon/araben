import type { SectionCrud } from '@/lib/admin/routes';
import {
  deleteHiddenCategory,
  getHiddenCategoryInput,
  listHiddenCategories,
  readHiddenCategoryInput,
  saveHiddenCategory,
  type HiddenCategoryInput,
} from '@/lib/admin/hidden';

export const hiddenCategoryCrud: SectionCrud<HiddenCategoryInput> = {
  label: 'Category',
  list: listHiddenCategories,
  get: getHiddenCategoryInput,
  read: readHiddenCategoryInput,
  save: saveHiddenCategory,
  remove: deleteHiddenCategory,
};
