import type { Tenant } from "@/generated/prisma/client";

export type ContratoFormData = {
  contratante: string;
  docContratante: string;
  telContratante: string;
  endContratante: string;
  dataEvento: string;
  evento: string;
  localEvento: string;
  material: string;
  valorTotal: string;
  formaPagamento: string;
  dadosBancarios: string;
  cidadeAss: string;
  dataContrato: string;
  testemunha: string;
  testemunha2: string;
};

export function escapeHtml(value: string | null | undefined): string {
  return (value ?? "").replace(/[&<>"']/g, (m) => {
    switch (m) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&#39;";
      default:
        return m;
    }
  });
}

function formatMoney(raw: string): string {
  const texto = (raw || "").trim();
  if (!texto) return "R$ 0,00";
  const limpo = texto
    .replace(/R\$\s?/g, "")
    .replace(/\./g, "")
    .replace(",", ".")
    .replace(/[^0-9.]/g, "");
  const numero = Number(limpo || 0);
  return numero.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatLongDate(dateStr: string): string {
  if (!dateStr) return "___ de __________ de ____";
  const d = new Date(`${dateStr}T12:00:00`);
  if (Number.isNaN(d.getTime())) return "___ de __________ de ____";
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function buildMaterialList(material: string): string {
  const lines = (material || "")
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);
  return (
    "<ol>" +
    lines
      .map((x) => `<li>${escapeHtml(x.replace(/^\d+[.)]\s*/, ""))}</li>`)
      .join("") +
    "</ol>"
  );
}

const STYLE = `
:root{--bg:#07090a;--paper:#ffffff;--ink:#141414;--muted:#a1a1aa;--green:#39ff6b;--yellow:#ffc100;--red:#ff3a3a;--dark:#101214;--line:#2b2b2b;--docLine:#d8dee4;--docSoft:#f3f5f7;}
*{box-sizing:border-box}
body{margin:0;font-family:Arial,Helvetica,sans-serif;background:#f2f2f3;color:#111}
.toolbar{position:sticky;top:0;z-index:5;padding:14px 24px;background:#101214;display:flex;justify-content:center;gap:12px}
.btn{border:0;border-radius:999px;padding:11px 18px;font-weight:800;cursor:pointer;font-size:14px;text-decoration:none;display:inline-flex;align-items:center}
.primary{background:linear-gradient(90deg,var(--green),var(--yellow),var(--red));color:#090909}
.secondary{background:#2b2b2b;color:#fff}
.paper{width:794px;min-height:1123px;margin:24px auto;background:#fff;color:#111;box-shadow:0 18px 60px #0003;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.5;position:relative;overflow:hidden;border-radius:2px}
.contract{padding:40px 76px 82px;position:relative}
.contract h1{text-align:center;font-size:19px;line-height:1.25;margin:0 0 24px;text-transform:uppercase;letter-spacing:.055em;color:#0f1115}
.contract h1:after{content:"";display:block;width:160px;height:3px;margin:12px auto 0;background:linear-gradient(90deg,var(--green),var(--yellow),var(--red));border-radius:999px}
.contract h3{text-align:left;font-size:13.5px;margin:22px 0 12px;padding:8px 10px;background:#f7f8fa;border-left:4px solid var(--green);border-top:1px solid var(--docLine);border-right:1px solid var(--docLine);border-bottom:1px solid var(--docLine);border-radius:6px;color:#121212;text-transform:uppercase}
.contract p{margin:0 0 9px;text-align:justify}
.contract ol{margin:12px 0 18px 24px;padding-left:18px;font-weight:700;background:#fafafa;border:1px solid #e5e7eb;border-left:4px solid var(--green);border-radius:8px;padding-top:10px;padding-bottom:10px}
.contract li{margin:4px 0;padding-left:4px}
.right{text-align:right!important;margin-top:18px!important}
.signatures{margin-top:42px}
.signature-grid{display:grid;grid-template-columns:1fr 1fr;gap:34px 38px;align-items:start}
.signature-box{min-height:88px;text-align:center}
.signature-line{border-top:1.3px solid #111;padding-top:8px;font-weight:700;line-height:1.32}
.signature-role{font-size:10.5px;text-transform:uppercase;letter-spacing:.08em;color:#555;margin-top:6px;font-weight:700}
.witnesses{display:grid;grid-template-columns:1fr 1fr;gap:38px;margin-top:32px}
.small{font-size:10.5px;color:#666;text-align:center;margin-top:22px}
@page{size:A4;margin:0}
@media print{.toolbar{display:none}body{background:#fff}.paper{box-shadow:none;width:210mm;min-height:297mm;margin:0;border-radius:0}.contract{padding:30mm 22mm 22mm}.signatures{break-inside:avoid;page-break-inside:avoid}.contract h3{break-after:avoid;page-break-after:avoid}}
`;

export function renderContratoPage(tenant: Tenant, dados: ContratoFormData): string {
  const materialHtml = buildMaterialList(dados.material);

  const body = `<h1>CONTRATO DE PRESTAÇÃO DE SERVIÇO</h1>
<p><strong>IDENTIFICAÇÃO DAS PARTES CONTRATANTES</strong></p>
<p><strong>CONTRATANTE:</strong> <strong>${escapeHtml(dados.contratante) || "_________________________"}</strong>, CNPJ/CPF: <strong>${escapeHtml(dados.docContratante) || "________________"}</strong>, Endereço: ${escapeHtml(dados.endContratante) || "_________________________"}, Tel: ${escapeHtml(dados.telContratante) || "____________"}.</p>
<p><strong>CONTRATADO:</strong> <strong>${escapeHtml(tenant.nome)}</strong>, portador do CNPJ: <strong>${escapeHtml(tenant.cnpj)}</strong>, com sede na ${escapeHtml(tenant.endereco)}. As partes acima identificadas têm, entre si, justo e acertado o presente Contrato de Prestação de Serviços, que se regerá pelas cláusulas seguintes e pelas condições de preço, forma e termo de pagamento descritas no presente.</p>
<h3>1. Do Objeto e Obrigações da Contratada</h3>
<p><strong><u>Cláusula 1ª:</u></strong> É objeto do presente contrato a locação do material:</p>
<p>Data: <strong>${formatLongDate(dados.dataEvento)}</strong></p><p>Local: <strong>${escapeHtml(dados.localEvento) || "________________"}</strong> &nbsp;&nbsp;&nbsp;&nbsp; Evento: <strong>${escapeHtml(dados.evento) || "________________"}</strong></p><p>Material contratado: <strong>Locação</strong></p>${materialHtml}
<h3>2. Obrigações do(a) Contratante</h3>
<p><strong><u>Cláusula 2ª:</u></strong> O CONTRATANTE deverá fornecer ao CONTRATADO todas as informações necessárias à realização do serviço, devendo especificar os detalhes necessários à perfeita execução do mesmo e a forma de como ele deve ser entregue.</p>
<p><strong><u>Cláusula 3ª:</u></strong> O CONTRATANTE deverá efetuar o pagamento na forma e condições estabelecidas na cláusula 6ª.</p>
<p><strong><u>Cláusula 4ª:</u></strong> É dever do CONTRATADO oferecer ao contratante a cópia do presente instrumento, contendo todas as especificidades da prestação de serviço contratada.</p>
<p><strong><u>Cláusula 5ª:</u></strong> O CONTRATADO deverá fornecer Nota Fiscal de Serviços, referente ao(s) pagamento(s) efetuado(s) pelo CONTRATANTE, caso necessário.</p>
<h3>3. Remuneração do Contratado</h3>
<p><strong><u>Cláusula 6ª:</u></strong> O presente serviço será remunerado pela quantia de <strong>${formatMoney(dados.valorTotal)}</strong> referente aos serviços efetivamente prestados, devendo ser pago em dinheiro, pix ou cartão, ou outra forma de pagamento em que ocorra a prévia concordância de ambas as partes na assinatura do contrato.</p>
<p>Forma de pagamento: <strong>${escapeHtml(dados.formaPagamento) || escapeHtml(tenant.dadosBancariosPadrao ? "PIX" : "")}</strong></p><p>DADOS BANCÁRIOS:</p><p>${escapeHtml(dados.dadosBancarios || tenant.dadosBancariosPadrao || "").replace(/\n/g, "<br>")}</p>
<h3>4. Das Penalidades</h3>
<p><strong><u>Cláusula 7ª:</u></strong> Em caso de inadimplemento por parte do CONTRATANTE quanto ao pagamento do serviço prestado, deverá incidir sobre o valor do presente instrumento, multa pecuniária de 2%, juros de mora de 1% ao mês e correção monetária.</p>
<p><strong><u>Parágrafo único.</u></strong> Em caso de cobrança judicial, devem ser acrescidas custas processuais e 20% de honorários advocatícios.</p>
<p><strong><u>Cláusula 8ª:</u></strong> No caso de não haver o cumprimento de qualquer uma das cláusulas, exceto a 6ª, do presente instrumento, a parte que não cumpriu deverá pagar uma multa de 20% do valor do contrato para a outra parte.</p>
<p><strong><u>Cláusula 9ª:</u></strong> Poderá o presente instrumento ser adiado pela CONTRATANTE, em qualquer momento, sem que haja multa contratual, a outra parte deverá ser avisada previamente por escrito, no prazo de 30 dias.</p>
<p><strong><u>Cláusula 10ª:</u></strong> Caso o CONTRATANTE já tenha realizado o pagamento pelo serviço, e mesmo assim, requisite a rescisão imotivada do presente contrato, terá o valor da quantia paga devolvido, deduzindo-se 30% de taxas administrativas.</p>
<p><strong><u>Cláusula 11ª:</u></strong> Caso seja o CONTRATADO quem requeira a rescisão imotivada, deverá devolver a quantia que se refere aos serviços por ele não prestados ao CONTRATANTE, acrescentado de 30% de taxas administrativas.</p>
<h3>5. Disposições Gerais</h3>
<p><strong><u>Cláusula 12ª:</u></strong> Responsabilidade pela operação dos equipamentos. O CONTRATADO não disponibilizará técnicos para operação dos equipamentos locados, apenas para acompanhamento, ficando essa sob a responsabilidade direta do CONTRATANTE ou de quem por este indicado.</p>
<p><strong><u>Parágrafo 1:</u></strong> O som a ser executado pelo CONTRATANTE ou por profissional por ele indicado deverá atender as exigências normativas, não podendo o volume ultrapassar os limites legais, sendo de sua inteira responsabilidade a adoção de todas as medidas determinadas pelas autoridades locais, assumindo inteiramente o CONTRATANTE e seus prepostos a responsabilidade decorrente do mau uso do equipamento sonoro locado e que está sob suas ordens, seja essa de natureza cível, administrativa ou criminal, inclusive pela utilização irregular de aparelhagem sonora pelo profissional por ele contratado, a exemplo de pagamento de multas ECAD, indenizações, apreensão dos equipamentos sonoro ou ruidoso, suspensão do evento festivo, etc., ficando assim o CONTRATADO isento de toda e qualquer responsabilidade cível, administrativa e criminal.</p>
<p><strong><u>Parágrafo 2:</u></strong> Ao utilizar os equipamentos, os profissionais terceirizados pelo CONTRATANTE para sonorização estarão cientes e terão a responsabilidade pelo cumprimento essa cláusula em toda a duração do evento.</p>
<p><strong><u>Cláusula 13ª:</u></strong> Fica compactuado entre as partes a total inexistência de vínculo trabalhista entre as partes contratantes, excluindo as obrigações previdenciárias e os encargos sociais, não havendo entre CONTRATADO e CONTRATANTE qualquer tipo de relação de subordinação.</p>
<p><strong><u>Cláusula 14ª:</u></strong> Em situações de evento ou espaço sem alvará de funcionamento para sonorização e/ou a qualquer ato de apreensão de equipamentos, a multa e o processo criminal é de responsabilidade do CONTRATANTE.</p>
<p><strong><u>Cláusula 15ª:</u></strong> Salvo com a expressa autorização do CONTRATANTE, não pode o CONTRATADO transferir ou subcontratar os serviços previstos neste instrumento, sob o risco de ocorrer a rescisão imediata.</p>
<p class="right"><strong>${escapeHtml(dados.cidadeAss) || "_______/__"}, ${formatLongDate(dados.dataContrato)}.</strong></p>
<div class="signatures">
  <div class="signature-grid">
    <div class="signature-box">
      <div class="signature-line">${escapeHtml(tenant.representante)}<br>${escapeHtml(tenant.cpfRepresentante)} ${escapeHtml(tenant.rgRepresentante)}</div>
      <div class="signature-role">Contratado</div>
    </div>
    <div class="signature-box">
      <div class="signature-line">${escapeHtml(dados.contratante) || "CONTRATANTE"}<br>CPF/CNPJ nº ${escapeHtml(dados.docContratante) || "________________"}</div>
      <div class="signature-role">Contratante</div>
    </div>
  </div>
  <div class="witnesses">
    <div class="signature-box">
      <div class="signature-line">${escapeHtml(dados.testemunha) || "Testemunha 1"}<br>CPF nº __________________</div>
      <div class="signature-role">Testemunha</div>
    </div>
    <div class="signature-box">
      <div class="signature-line">${escapeHtml(dados.testemunha2) || "Testemunha 2"}<br>CPF nº __________________</div>
      <div class="signature-role">Testemunha</div>
    </div>
  </div>
</div>
<p class="small">Documento gerado internamente. Conferir dados, valores e anexos antes da assinatura.</p>`;

  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Contrato | ${escapeHtml(tenant.nome)}</title>
<style>${STYLE}</style>
</head>
<body>
<div class="toolbar"><a class="btn secondary" href="/app">&larr; Voltar ao formulário</a><button class="btn primary" onclick="window.print()">Imprimir / Salvar PDF</button></div>
<article class="paper contract">${body}</article>
</body>
</html>`;
}
