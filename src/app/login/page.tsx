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
    <main className="min-h-screen flex items-center justify-center bg-neutral-950 px-4">
      <form
        action={authenticate}
        className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-2xl p-8 space-y-4"
      >
        <h1 className="text-lg font-bold uppercase tracking-wide text-white">
          Gerador de Contratos
        </h1>
        <p className="text-sm text-neutral-400">
          Acesse com o e-mail e senha fornecidos pela sua conta.
        </p>

        {error && (
          <p className="text-sm text-red-400 bg-red-950/50 border border-red-900 rounded-lg px-3 py-2">
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
            className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-white"
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
            className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-white"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 text-neutral-950 font-bold py-2.5"
        >
          Entrar
        </button>
      </form>
    </main>
  );
}
