import { signIn, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import { LoginIntro } from "./LoginIntro";
import { LoginButton } from "./LoginButton";

async function authenticate(formData: FormData) {
  "use server";
  const email = String(formData.get("email") || "").toLowerCase().trim();
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect("/login?error=1");
    }
    throw error;
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { role: true, tenant: { select: { bloqueado: true } } },
  });

  if (user?.tenant?.bloqueado) {
    await signOut({ redirect: false });
    redirect("/login?error=bloqueado");
  }

  redirect(user?.role === "ADMIN" ? "/admin" : "/app");
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <LoginIntro>
      <main className="min-h-screen flex items-center justify-center bg-brand-light px-4">
        <form
          action={authenticate}
          className="w-full max-w-sm bg-brand-navy rounded-2xl p-8 space-y-5 shadow-xl"
        >
          <div className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 rounded-full bg-brand-light flex items-center justify-center shadow-md overflow-hidden">
              <Image
                src="/prosperar360-logo.png"
                alt="Prosperar 360"
                width={153}
                height={153}
                priority
              />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-brand-light">
              Prosperar<span className="text-brand-gold">360°</span>
            </h1>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-gray">
              Ecossistema de Soluções Empresariais
            </p>
          </div>

          <p className="text-sm text-brand-gray text-center">
            Acesse com o e-mail e senha fornecidos pela sua conta.
          </p>

          {error && (
            <p className="text-sm text-brand-light bg-brand-surface border border-brand-gold/50 rounded-lg px-3 py-2">
              {error === "bloqueado"
                ? "Cliente bloqueado. Entre em contato com o suporte."
                : "E-mail ou senha inválidos."}
            </p>
          )}

          <div className="space-y-1">
            <label htmlFor="email" className="text-xs font-semibold text-brand-light">
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-lg border border-brand-surface bg-brand-surface/40 px-3 py-2 text-brand-light focus:outline-none focus:border-brand-gold"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="text-xs font-semibold text-brand-light">
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full rounded-lg border border-brand-surface bg-brand-surface/40 px-3 py-2 text-brand-light focus:outline-none focus:border-brand-gold"
            />
          </div>

          <LoginButton />
        </form>
      </main>
    </LoginIntro>
  );
}
