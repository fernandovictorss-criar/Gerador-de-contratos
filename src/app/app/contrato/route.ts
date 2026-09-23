import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { renderContratoPage, ELLEN_CNPJ, type ContratoFormData } from "@/lib/contract-template";

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

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.tenantId) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const tenant = await prisma.tenant.findUnique({
    where: { id: session.user.tenantId },
  });
  if (!tenant) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  if (tenant.bloqueado) {
    return new NextResponse("Cliente bloqueado.", { status: 403 });
  }

  const form = await req.formData();
  const dados = FIELDS.reduce((acc, key) => {
    acc[key] = String(form.get(key) ?? "").trim();
    return acc;
  }, {} as ContratoFormData);

  const tipoEvento = String(form.get("tipoEvento") ?? "").trim();
  const modelo = tipoEvento
    ? await prisma.tenantContratoModelo.findUnique({
        where: { tenantId_tipoEvento: { tenantId: tenant.id, tipoEvento } },
      })
    : null;

  const identidadeContratadaId = String(form.get("identidadeContratadaId") ?? "").trim();
  const identidadeContratada = identidadeContratadaId
    ? await prisma.tenantIdentidadeContratada.findFirst({
        where: { id: identidadeContratadaId, tenantId: tenant.id },
      })
    : null;

  const html = renderContratoPage(
    tenant,
    dados,
    modelo?.html,
    Boolean(tipoEvento),
    identidadeContratada ?? undefined
  );

  // Guarda um retrato do contrato para permitir listar/corrigir depois.
  // Ainda restrito à Ellen Regina; nunca deve bloquear a geração do PDF.
  if (tenant.cnpj === ELLEN_CNPJ) {
    try {
      await prisma.contratoGerado.create({
        data: {
          tenantId: tenant.id,
          identidadeContratadaId: identidadeContratada?.id ?? null,
          createdByUserId: session.user.id || null,
          tipoEvento: tipoEvento || null,
          ...dados,
        },
      });
    } catch (err) {
      console.error("Falha ao salvar contrato gerado:", err);
    }
  }

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
