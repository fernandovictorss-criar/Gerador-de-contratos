import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { LogoutButton } from "../app/LogoutButton";

export default async function AdminPage() {
  await auth();
  const tenants = await prisma.tenant.findMany({
    include: { users: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-black text-white px-4 py-10">
      <div className="max-w-3xl mx-auto w-full">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-3xl tracking-wide leading-none bg-gradient-to-r from-brand-green via-brand-yellow to-brand-red bg-clip-text text-transparent">
            Painel Admin
          </h1>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <LogoutButton />
          </form>
        </div>

        <div className="flex justify-end mb-4">
          <Link
            href="/admin/novo"
            className="rounded-full bg-gradient-to-r from-brand-green via-brand-yellow to-brand-red text-black font-bold uppercase tracking-wide text-xs px-5 py-2.5 hover:opacity-90 transition-opacity"
          >
            + Novo cliente
          </Link>
        </div>

        <div className="space-y-3">
          {tenants.length === 0 && (
            <p className="text-neutral-500 text-sm">Nenhum cliente cadastrado ainda.</p>
          )}
          {tenants.map((tenant) => (
            <Link
              key={tenant.id}
              href={`/admin/${tenant.id}`}
              className="block bg-brand-surface border border-brand-border rounded-2xl p-4 hover:border-brand-green transition-colors"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-bold">{tenant.nome}</p>
                  <p className="text-xs text-neutral-400">{tenant.cnpj}</p>
                  <p className="text-xs text-neutral-500">
                    {tenant.users.map((u) => u.email).join(", ") || "Sem usuário"}
                  </p>
                </div>
                <p className="text-[10px] text-neutral-600 uppercase tracking-wide whitespace-nowrap">
                  {tenant.createdAt.toLocaleDateString("pt-BR")}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
