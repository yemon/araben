/**
 * Server-side admin checks. The proxy turns most strangers away early, but
 * every admin page and API route asks again here — the proxy can be skipped
 * by a misconfigured matcher; these can't.
 */
import 'server-only';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';

export interface AdminSession {
  adminId: string;
  email: string;
  name: string | null;
}

export async function getAdmin(): Promise<AdminSession | null> {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (!user?.adminId || !user.email) return null;
  return { adminId: user.adminId, email: user.email, name: user.name ?? null };
}

/** For admin pages and layouts: the admin, or a redirect to the login page. */
export async function requireAdminPage(): Promise<AdminSession> {
  const admin = await getAdmin();
  if (!admin) redirect('/admin/login/');
  return admin;
}

/**
 * For admin API routes: the admin, or a 401 response to return as is.
 *
 *   const admin = await requireAdminApi();
 *   if (admin instanceof NextResponse) return admin;
 */
export async function requireAdminApi(): Promise<AdminSession | NextResponse> {
  const admin = await getAdmin();
  if (admin) return admin;
  return NextResponse.json({ success: false, error: 'Not signed in' }, { status: 401 });
}
