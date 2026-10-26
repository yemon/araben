import { redirect } from 'next/navigation';
import { getAdmin } from '@/lib/admin/session';
import { LoginForm } from './LoginForm';

export const metadata = { title: 'Sign in' };
export const dynamic = 'force-dynamic';

// Only paths inside the admin are followed after signing in, so a crafted
// link can't bounce an admin off to another site.
const safeCallback = (url: string | undefined) =>
  url && /^\/admin(\/|$)/.test(url) && !url.startsWith('/admin/login') ? url : '/admin/';

export default async function LoginPage(props: { searchParams: Promise<{ callbackUrl?: string }> }) {
  const { callbackUrl } = await props.searchParams;
  const target = safeCallback(callbackUrl);
  if (await getAdmin()) redirect(target);
  return <LoginForm callbackUrl={target} />;
}
