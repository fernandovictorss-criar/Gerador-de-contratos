import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { LandingPage } from "./_landing/LandingPage";

export default async function Home() {
  const session = await auth();
  if (session?.user) {
    redirect(session.user.role === "ADMIN" ? "/admin" : "/app");
  }
  return <LandingPage />;
}
