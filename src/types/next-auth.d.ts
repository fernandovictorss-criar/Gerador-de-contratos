import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      tenantId: string | null;
      role: "ADMIN" | "USER";
    } & DefaultSession["user"];
  }

  interface User {
    tenantId: string | null;
    role: "ADMIN" | "USER";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    tenantId?: string | null;
    role?: "ADMIN" | "USER";
  }
}
