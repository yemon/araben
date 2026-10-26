/**
 * NextAuth configuration for the admin panel.
 *
 * Admins sign in with an email and password checked against admin_users
 * (bcrypt hashes; create one with npm run admin:create). Sessions are JWTs
 * in an httpOnly cookie — the credentials provider can't use database
 * sessions — and last ADMIN_SESSION_HOURS.
 */
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

const ADMIN_SESSION_HOURS = 8;

// Brute-force brake: after MAX_FAILURES wrong passwords for one email, that
// email is locked for LOCK_MINUTES. Kept in memory, so it resets when the
// server restarts — enough to make guessing slow, not a full rate limiter.
const MAX_FAILURES = 5;
const LOCK_MINUTES = 15;
const failures = new Map<string, { count: number; lockedUntil: number }>();

function isLocked(email: string) {
  const f = failures.get(email);
  return Boolean(f && f.lockedUntil > Date.now());
}

function recordFailure(email: string) {
  const f = failures.get(email) ?? { count: 0, lockedUntil: 0 };
  f.count += 1;
  if (f.count >= MAX_FAILURES) {
    f.lockedUntil = Date.now() + LOCK_MINUTES * 60_000;
    f.count = 0;
  }
  failures.set(email, f);
}

// Compared against when the email is unknown, so a wrong email takes as long
// as a wrong password and response times don't reveal which emails exist.
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', 10);

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt', maxAge: ADMIN_SESSION_HOURS * 60 * 60 },
  pages: { signIn: '/admin/login' },
  providers: [
    CredentialsProvider({
      name: 'Email and password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? '').trim().toLowerCase();
        const password = String(credentials?.password ?? '');
        if (!email || !password || isLocked(email)) return null;

        const admin = await prisma.adminUser.findUnique({ where: { email } });
        const ok = await bcrypt.compare(password, admin?.passwordHash ?? DUMMY_HASH);
        if (!admin || !ok) {
          recordFailure(email);
          return null;
        }

        failures.delete(email);
        await prisma.adminUser.update({
          where: { id: admin.id },
          data: { lastLoginAt: new Date() },
        });
        return { id: String(admin.id), email: admin.email, name: admin.name };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.adminId = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.adminId = token.adminId as string | undefined;
      return session;
    },
  },
};
