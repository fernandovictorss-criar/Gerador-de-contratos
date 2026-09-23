import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ELLEN_CNPJ } from "@/lib/contract-template";
import { ConfirmButton } from "@/app/admin/ConfirmButton";
import { deleteContratoGerado } from "./actions";

export default async function ContratosGeradosPage() {
  const session = await auth();
  if (!session?.user?.tenantId) redirect("/login");

  const tenant = await prisma.tenant.findUnique({ where: { id: session.user.tenantId } });
  if (!tenant || tenant.cnpj !== ELLEN_CNPJ) redirect("/app");

  const contratos = await prisma.contratoGerado.findMany({
    where: { tenantId: tenant.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-brand-navy text-brand-light px-4 py-10">
      <div className="max-w-xl mx-auto w-full space-y-6">
        <div>
          <Link href="/app" className="text-xs text-brand-gray hover:text-brand-light">
            &larr; Voltar ao formulário
          </Link>
          <h1 className="font-bold text-2xl tracking-wide leading-none mt-2 text-brand-light">
            Contratos gerados
          </h1>
          <p className="text-brand-gray text-xs mt-1">
            Encontrou algum dado errado num contrato já gerado? Abra e corrija aqui.
          </p>
        </div>

        {contratos.length === 0 ? (
          <p className="text-sm text-brand-gray bg-brand-surface border border-brand-border rounded-2xl p-6">
            Nenhum contrato gerado ainda.
          </p>
        ) : (
          <ul className="space-y-2">
            {contratos.map((contrato) => (
              <li
                key={contrato.id}
                className="bg-brand-surface border border-brand-border rounded-2xl p-4 flex items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <p className="font-bold text-sm truncate">
                    {contrato.contratante || "(sem nome)"}
                  </p>
                  <p className="text-xs text-brand-gray truncate">
                    {contrato.evento || "Evento"} ·{" "}
                    {contrato.dataEventoTexto || contrato.dataEvento || "data não informada"} ·{" "}
                    {contrato.valorTotal ? `R$ ${contrato.valorTotal}` : "sem valor"}
                  </p>
                  <p className="text-[10px] text-brand-gray/70 mt-0.5">
                    Gerado em{" "}
                    {contrato.createdAt.toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Link
                    href={`/app/contratos/${contrato.id}/imprimir`}
                    target="_blank"
                    className="rounded-full bg-transparent border border-brand-border text-brand-light font-bold uppercase tracking-wide text-xs px-3 py-2 hover:border-brand-gold transition-colors whitespace-nowrap"
                  >
                    Ver
                  </Link>
                  <Link
                    href={`/app/contratos/${contrato.id}`}
                    className="rounded-full bg-brand-gold text-brand-navy font-bold uppercase tracking-wide text-xs px-3 py-2 hover:opacity-90 transition-opacity whitespace-nowrap"
                  >
                    Corrigir
                  </Link>
                  <form action={deleteContratoGerado.bind(null, contrato.id)}>
                    <ConfirmButton
                      label="Excluir"
                      confirmMessage={`Excluir o contrato de "${contrato.contratante || "sem nome"}"? Essa ação não pode ser desfeita.`}
                      className="rounded-full bg-transparent border border-brand-border text-brand-gray font-bold uppercase tracking-wide text-xs px-3 py-2 hover:border-brand-gold hover:text-brand-light transition-colors whitespace-nowrap cursor-pointer"
                    />
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
