import { itemHandlers } from '@/lib/admin/routes';
import { hiddenCategoryCrud } from '../crud';

export const { GET, PUT, DELETE } = itemHandlers(hiddenCategoryCrud);
