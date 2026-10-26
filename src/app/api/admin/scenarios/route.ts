import { collectionHandlers } from '@/lib/admin/routes';
import { scenarioCrud } from './crud';

export const { GET, POST } = collectionHandlers(scenarioCrud);
