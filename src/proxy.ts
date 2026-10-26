/**
 * First line of defence for the admin panel: no session cookie, no admin.
 *
 * - /admin pages without a valid session redirect to /admin/login.
 * - /api/admin calls without one get a 401, and a write sent from another
 *   site (an Origin that isn't ours) gets a 403.
 *
 * This only checks the signed JWT; every admin page and API route checks the
 * session again on the server (src/lib/admin/session.ts), as Next.js advises.
 */
import { NextResponse, type NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const LOGIN_PATH = '/admin/login/';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isApi = pathname.startsWith('/api/admin');

  if (isApi && request.method !== 'GET' && request.method !== 'HEAD') {
    const origin = request.headers.get('origin');
    if (origin && origin !== request.nextUrl.origin) {
      return NextResponse.json({ success: false, error: 'Cross-site request refused' }, { status: 403 });
    }
  }

  if (pathname.startsWith(LOGIN_PATH.slice(0, -1))) return NextResponse.next();

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (token?.adminId) return NextResponse.next();

  if (isApi) {
    return NextResponse.json({ success: false, error: 'Not signed in' }, { status: 401 });
  }
  const login = new URL(LOGIN_PATH, request.url);
  login.searchParams.set('callbackUrl', pathname + request.nextUrl.search);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
