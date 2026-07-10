import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

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
    <main className="min-h-screen flex items-center justify-center bg-black px-4">
      <form
        action={authenticate}
        className="w-full max-w-sm bg-brand-surface border border-brand-border rounded-2xl p-8 space-y-5"
      >
        <div className="text-center space-y-1">
          <h1 className="font-display text-6xl tracking-wide leading-none">
            <span className="text-brand-green">D</span>
            <span className="text-brand-yellow">M</span>
            <span className="text-brand-red">S</span>
          </h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400">
            Iluminação, Som e LED&apos;s
          </p>
        </div>

        <p className="text-sm text-neutral-400 text-center">
          Acesse com o e-mail e senha fornecidos pela sua conta.
        </p>

        {error && (
          <p className="text-sm text-brand-red bg-red-950/50 border border-red-900 rounded-lg px-3 py-2">
            E-mail ou senha inválidos.
          </p>
        )}

        <div className="space-y-1">
          <label htmlFor="email" className="text-xs font-bold text-neutral-300">
            E-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-lg border border-brand-border bg-black px-3 py-2 text-white focus:outline-none focus:border-brand-green"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="text-xs font-bold text-neutral-300">
            Senha
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full rounded-lg border border-brand-border bg-black px-3 py-2 text-white focus:outline-none focus:border-brand-green"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-full bg-gradient-to-r from-brand-green via-brand-yellow to-brand-red text-black font-bold uppercase tracking-wide py-2.5 cursor-pointer hover:opacity-90 transition-opacity"
        >
          Entrar
        </button>
      </form>
    </main>
  );
}
