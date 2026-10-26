import { collectionHandlers } from '@/lib/admin/routes';
import { surahCrud } from './crud';

export const { GET, POST } = collectionHandlers(surahCrud);
