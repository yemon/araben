import { itemHandlers } from '@/lib/admin/routes';
import { scenarioCrud } from '../crud';

export const { GET, PUT, PATCH, DELETE } = itemHandlers(scenarioCrud);
