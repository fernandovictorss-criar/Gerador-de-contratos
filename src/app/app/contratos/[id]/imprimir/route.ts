import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { renderContratoPage, type ContratoFormData } from "@/lib/contract-template";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.tenantId) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const contrato = await prisma.contratoGerado.findFirst({
    where: { id, tenantId: session.user.tenantId },
    include: { identidadeContratada: true },
  });
  if (!contrato) {
    return new NextResponse("Contrato não encontrado.", { status: 404 });
  }

  const tenant = await prisma.tenant.findUnique({ where: { id: contrato.tenantId } });
  if (!tenant) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const modelo = contrato.tipoEvento
    ? await prisma.tenantContratoModelo.findUnique({
        where: { tenantId_tipoEvento: { tenantId: tenant.id, tipoEvento: contrato.tipoEvento } },
      })
    : null;

  const dados: ContratoFormData = {
    contratante: contrato.contratante,
    profissao: contrato.profissao,
    docContratante: contrato.docContratante,
    telContratante: contrato.telContratante,
    endContratante: contrato.endContratante,
    dataEvento: contrato.dataEvento,
    dataEventoFim: contrato.dataEventoFim,
    dataEventoTexto: contrato.dataEventoTexto,
    horaEvento: contrato.horaEvento,
    evento: contrato.evento,
    localEvento: contrato.localEvento,
    material: contrato.material,
    quantidadeConvidados: contrato.quantidadeConvidados,
    duracaoHoras: contrato.duracaoHoras,
    duracaoCerimonia: contrato.duracaoCerimonia,
    duracaoRecepcao: contrato.duracaoRecepcao,
    quantidadeEquipe: contrato.quantidadeEquipe,
    valorTotal: contrato.valorTotal,
    valorEntrada: contrato.valorEntrada,
    tipoEntrada: contrato.tipoEntrada,
    valorEntrada2: contrato.valorEntrada2,
    quantidadeParcelas: contrato.quantidadeParcelas,
    valorParcela: contrato.valorParcela,
    dataInicialParcelas: contrato.dataInicialParcelas,
    dataFinalParcelas: contrato.dataFinalParcelas,
    formaPagamento: contrato.formaPagamento,
    dadosBancarios: contrato.dadosBancarios,
    cidadeAss: contrato.cidadeAss,
    dataContrato: contrato.dataContrato,
    testemunha: contrato.testemunha,
    testemunha2: contrato.testemunha2,
  };

  const html = renderContratoPage(
    tenant,
    dados,
    modelo?.html,
    Boolean(contrato.tipoEvento),
    contrato.identidadeContratada ?? undefined
  );

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
