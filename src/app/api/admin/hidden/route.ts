import { collectionHandlers } from '@/lib/admin/routes';
import { hiddenCategoryCrud } from './crud';

export const { GET, POST } = collectionHandlers(hiddenCategoryCrud);
