import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateTenant, deleteTenant, addUser, deleteUser } from "../actions";
import { AdminField } from "../AdminField";
import { ConfirmButton } from "../ConfirmButton";

export default async function EditarClientePage({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const { tenantId } = await params;
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    include: { users: { orderBy: { createdAt: "asc" } } },
  });

  if (!tenant) notFound();

  return (
    <main className="min-h-screen bg-black text-white px-4 py-10">
      <div className="max-w-xl mx-auto w-full space-y-6">
        <div>
          <Link href="/admin" className="text-xs text-neutral-400 hover:text-white">
            &larr; Voltar
          </Link>
          <h1 className="font-display text-3xl tracking-wide leading-none mt-2 bg-gradient-to-r from-brand-green via-brand-yellow to-brand-red bg-clip-text text-transparent">
            {tenant.nome}
          </h1>
        </div>

        <form
          action={updateTenant.bind(null, tenant.id)}
          className="space-y-4 bg-brand-surface border border-brand-border rounded-2xl p-6"
        >
          <AdminField label="Razão social / Nome" name="nome" defaultValue={tenant.nome} required />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <AdminField label="CNPJ" name="cnpj" defaultValue={tenant.cnpj} required />
            <AdminField
              label="Representante legal"
              name="representante"
              defaultValue={tenant.representante}
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <AdminField
              label="CPF do representante"
              name="cpfRepresentante"
              defaultValue={tenant.cpfRepresentante}
              required
            />
            <AdminField
              label="RG do representante"
              name="rgRepresentante"
              defaultValue={tenant.rgRepresentante}
              required
            />
          </div>
          <AdminField
            label="Endereço completo"
            name="endereco"
            textarea
            defaultValue={tenant.endereco}
            required
          />
          <AdminField
            label="Dados bancários padrão (opcional)"
            name="dadosBancariosPadrao"
            textarea
            defaultValue={tenant.dadosBancariosPadrao ?? ""}
          />

          <button
            type="submit"
            className="w-full rounded-full bg-gradient-to-r from-brand-green via-brand-yellow to-brand-red text-black font-bold uppercase tracking-wide py-3 cursor-pointer hover:opacity-90 transition-opacity"
          >
            Salvar alterações
          </button>
        </form>

        <div className="bg-brand-surface border border-brand-border rounded-2xl p-6 space-y-4">
          <p className="text-xs font-bold text-neutral-300">Usuários de login</p>
          <ul className="space-y-2">
            {tenant.users.map((user) => (
              <li
                key={user.id}
                className="flex items-center justify-between text-sm bg-black border border-brand-border rounded-lg px-3 py-2"
              >
                <span>{user.email}</span>
                <form action={deleteUser.bind(null, user.id, tenant.id)}>
                  <ConfirmButton
                    label="Excluir"
                    confirmMessage={`Excluir o login ${user.email}?`}
                  />
                </form>
              </li>
            ))}
          </ul>

          <form
            action={addUser.bind(null, tenant.id)}
            className="border-t border-brand-border pt-4 space-y-3"
          >
            <p className="text-xs font-bold text-neutral-300">Adicionar novo login</p>
            <AdminField label="E-mail" name="email" type="email" required />
            <AdminField label="Senha" name="password" type="password" required />
            <button
              type="submit"
              className="w-full rounded-full bg-brand-surface border border-brand-border text-white font-bold uppercase tracking-wide text-xs py-2.5 cursor-pointer hover:border-brand-green transition-colors"
            >
              Adicionar
            </button>
          </form>
        </div>

        <form action={deleteTenant.bind(null, tenant.id)}>
          <ConfirmButton
            label="Excluir cliente"
            confirmMessage={`Excluir ${tenant.nome} e todos os seus logins? Essa ação não pode ser desfeita.`}
            className="w-full rounded-full bg-transparent border border-brand-red text-brand-red font-bold uppercase tracking-wide py-3 cursor-pointer hover:bg-brand-red/10 transition-colors"
          />
        </form>
      </div>
    </main>
  );
}
