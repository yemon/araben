import 'next-auth';
import 'next-auth/jwt';

// The admin's row id rides along in the JWT and the session.
declare module 'next-auth' {
  interface Session {
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      adminId?: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    adminId?: string;
  }
}
