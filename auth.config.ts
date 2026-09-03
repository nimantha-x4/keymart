import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe Auth.js config. Contains no database or bcrypt access so it can be
 * imported by middleware. The Credentials provider (with `authorize`) is added
 * in `lib/auth.ts`, which only runs in the Node.js runtime.
 */
export const authConfig = {
  trustHost: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = (user as { role?: "USER" | "ADMIN" }).role ?? "USER";
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) ?? token.sub ?? "";
        session.user.role = (token.role as "USER" | "ADMIN") ?? "USER";
      }
      return session;
    },
  },
} satisfies NextAuthConfig;

export default authConfig;
