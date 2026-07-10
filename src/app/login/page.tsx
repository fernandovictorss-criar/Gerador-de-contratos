import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import Image from "next/image";

async function authenticate(formData: FormData) {
  "use server";
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/app",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect("/login?error=1");
    }
    throw error;
  }
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#E6E8EB] px-4">
      <form
        action={authenticate}
        className="w-full max-w-sm bg-[#0D1B2A] rounded-2xl p-8 space-y-5 shadow-xl"
      >
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 rounded-full bg-[#E6E8EB] flex items-center justify-center p-2.5 shadow-md">
            <Image
              src="/prosperar360-logo.png"
              alt="Prosperar 360"
              width={44}
              height={44}
              priority
            />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Prosperar<span className="text-[#D4A017]">360°</span>
          </h1>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6B7177]">
            Ecossistema de Soluções Empresariais
          </p>
        </div>

        <p className="text-sm text-[#6B7177] text-center">
          Acesse com o e-mail e senha fornecidos pela sua conta.
        </p>

        {error && (
          <p className="text-sm text-red-400 bg-red-950/50 border border-red-900 rounded-lg px-3 py-2">
            E-mail ou senha inválidos.
          </p>
        )}

        <div className="space-y-1">
          <label htmlFor="email" className="text-xs font-semibold text-[#E6E8EB]">
            E-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-lg border border-[#1B365D] bg-[#1B365D]/40 px-3 py-2 text-white focus:outline-none focus:border-[#D4A017]"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="text-xs font-semibold text-[#E6E8EB]">
            Senha
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full rounded-lg border border-[#1B365D] bg-[#1B365D]/40 px-3 py-2 text-white focus:outline-none focus:border-[#D4A017]"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-full bg-[#D4A017] text-[#0D1B2A] font-bold uppercase tracking-wide py-2.5 cursor-pointer hover:opacity-90 transition-opacity"
        >
          Entrar
        </button>
      </form>
    </main>
  );
}
