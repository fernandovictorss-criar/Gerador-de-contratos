import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        const u = user as { tenantId: string | null; role: "ADMIN" | "USER" };
        token.tenantId = u.tenantId;
        token.role = u.role;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.tenantId = (token.tenantId as string | null) ?? null;
        session.user.role = (token.role as "ADMIN" | "USER") ?? "USER";
      }
      return session;
    },
  },
};
