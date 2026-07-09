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
        token.tenantId = (user as { tenantId: string }).tenantId;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.tenantId = token.tenantId as string;
      }
      return session;
    },
  },
};
