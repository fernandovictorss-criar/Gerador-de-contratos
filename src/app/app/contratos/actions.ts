"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { ContratoFormData } from "@/lib/contract-template";

const FIELDS: (keyof ContratoFormData)[] = [
  "contratante",
  "profissao",
  "docContratante",
  "telContratante",
  "endContratante",
  "dataEvento",
  "dataEventoFim",
  "dataEventoTexto",
  "horaEvento",
  "evento",
  "localEvento",
  "material",
  "quantidadeConvidados",
  "duracaoHoras",
  "duracaoCerimonia",
  "duracaoRecepcao",
  "quantidadeEquipe",
  "valorTotal",
  "valorEntrada",
  "tipoEntrada",
  "valorEntrada2",
  "quantidadeParcelas",
  "valorParcela",
  "dataInicialParcelas",
  "dataFinalParcelas",
  "formaPagamento",
  "dadosBancarios",
  "cidadeAss",
  "dataContrato",
  "testemunha",
  "testemunha2",
];

export async function updateContratoGerado(contratoId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.tenantId) {
    throw new Error("Não autorizado.");
  }

  const contrato = await prisma.contratoGerado.findFirst({
    where: { id: contratoId, tenantId: session.user.tenantId },
  });
  if (!contrato) {
    throw new Error("Contrato não encontrado.");
  }

  const dados = FIELDS.reduce((acc, key) => {
    acc[key] = String(formData.get(key) ?? "").trim();
    return acc;
  }, {} as ContratoFormData);

  const tipoEvento = String(formData.get("tipoEvento") ?? "").trim();
  const identidadeContratadaId = String(formData.get("identidadeContratadaId") ?? "").trim();

  await prisma.contratoGerado.update({
    where: { id: contratoId },
    data: {
      ...dados,
      tipoEvento: tipoEvento || null,
      identidadeContratadaId: identidadeContratadaId || null,
    },
  });

  redirect(`/app/contratos/${contratoId}/imprimir`);
}

export async function deleteContratoGerado(contratoId: string) {
  const session = await auth();
  if (!session?.user?.tenantId) {
    throw new Error("Não autorizado.");
  }

  // deleteMany com o tenantId garante que só apaga um contrato do próprio
  // cliente logado (e não falha se o id não pertencer a ele).
  await prisma.contratoGerado.deleteMany({
    where: { id: contratoId, tenantId: session.user.tenantId },
  });

  revalidatePath("/app/contratos");
  redirect("/app/contratos");
}
