import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { renderContratoPage, type ContratoFormData } from "@/lib/contract-template";

const FIELDS: (keyof ContratoFormData)[] = [
  "contratante",
  "docContratante",
  "telContratante",
  "endContratante",
  "dataEvento",
  "horaEvento",
  "evento",
  "localEvento",
  "material",
  "quantidadeConvidados",
  "duracaoHoras",
  "valorTotal",
  "valorEntrada",
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

  const html = renderContratoPage(tenant, dados, modelo?.html);

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
