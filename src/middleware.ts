import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAdmin = req.auth?.user?.role === "ADMIN";
  const isOnApp = req.nextUrl.pathname.startsWith("/app");
  const isOnAdmin = req.nextUrl.pathname.startsWith("/admin");

  if ((isOnApp || isOnAdmin) && !isLoggedIn) {
    const loginUrl = new URL("/login", req.nextUrl);
    return NextResponse.redirect(loginUrl);
  }

  if (isOnAdmin && isLoggedIn && !isAdmin) {
    const appUrl = new URL("/app", req.nextUrl);
    return NextResponse.redirect(appUrl);
  }
});

export const config = {
  matcher: ["/app/:path*", "/admin/:path*"],
};
