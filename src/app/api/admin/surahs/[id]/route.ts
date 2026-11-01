import { itemHandlers } from '@/lib/admin/routes';
import { surahCrud } from '../crud';

export const { GET, PUT, PATCH, DELETE } = itemHandlers(surahCrud);
