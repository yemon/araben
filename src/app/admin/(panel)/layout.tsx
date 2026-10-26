import { AdminShell } from '@/components/admin/AdminShell';
import { requireAdminPage } from '@/lib/admin/session';

// Everything behind the sign-in: checked here on the server for every page,
// on top of the proxy's early check.
export const dynamic = 'force-dynamic';

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdminPage();
  return (
    <AdminShell email={admin.email} name={admin.name}>
      {children}
    </AdminShell>
  );
}
