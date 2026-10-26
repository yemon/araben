import { itemHandlers } from '@/lib/admin/routes';
import { surahCrud } from '../crud';

export const { GET, PUT, DELETE } = itemHandlers(surahCrud);
