import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { updateContratoGerado } from "../actions";

export default async function EditarContratoGeradoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.tenantId) redirect("/login");

  const [contrato, tenant] = await Promise.all([
    prisma.contratoGerado.findFirst({
      where: { id, tenantId: session.user.tenantId },
    }),
    prisma.tenant.findUnique({
      where: { id: session.user.tenantId },
      include: {
        modelosContrato: { orderBy: { tipoEvento: "asc" } },
        identidades: { orderBy: { nome: "asc" } },
      },
    }),
  ]);

  if (!contrato || !tenant) notFound();

  return (
    <main className="min-h-screen bg-brand-navy text-brand-light px-4 py-10">
      <div className="max-w-xl mx-auto w-full space-y-6">
        <div>
          <Link href="/app/contratos" className="text-xs text-brand-gray hover:text-brand-light">
            &larr; Voltar para contratos gerados
          </Link>
          <h1 className="font-bold text-2xl tracking-wide leading-none mt-2 text-brand-light">
            Corrigir contrato
          </h1>
          <p className="text-brand-gray text-xs mt-1">
            Ajuste os dados abaixo e salve para gerar o contrato corrigido.
          </p>
        </div>

        <form
          action={updateContratoGerado.bind(null, contrato.id)}
          className="space-y-6 bg-brand-surface border border-brand-border rounded-2xl p-6"
        >
          {tenant.identidades.length > 0 && (
            <EditSelect
              label="CNPJ contratado"
              name="identidadeContratadaId"
              defaultValue={contrato.identidadeContratadaId ?? ""}
              options={[
                { value: "", label: tenant.nome },
                ...tenant.identidades.map((i) => ({ value: i.id, label: i.nome })),
              ]}
            />
          )}
          {tenant.modelosContrato.length > 0 && (
            <EditSelect
              label="Tipo de evento"
              name="tipoEvento"
              defaultValue={contrato.tipoEvento ?? ""}
              options={[
                { value: "", label: "Selecione..." },
                ...tenant.modelosContrato.map((m) => ({ value: m.tipoEvento, label: m.tipoEvento })),
              ]}
            />
          )}

          <Group title="Contratante">
            <EditField label="Razão social / Nome" name="contratante" defaultValue={contrato.contratante} />
            <EditField label="Profissão" name="profissao" defaultValue={contrato.profissao} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <EditField label="CNPJ / CPF" name="docContratante" defaultValue={contrato.docContratante} />
              <EditField label="Telefone" name="telContratante" defaultValue={contrato.telContratante} />
            </div>
            <EditField label="Endereço completo" name="endContratante" defaultValue={contrato.endContratante} textarea />
          </Group>

          <Group title="Evento">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <EditField label="Data" name="dataEvento" type="date" defaultValue={contrato.dataEvento} />
              <EditField label="Data final (se mais de um dia)" name="dataEventoFim" type="date" defaultValue={contrato.dataEventoFim} />
            </div>
            <EditField label='Texto da data (se "a definir")' name="dataEventoTexto" defaultValue={contrato.dataEventoTexto} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <EditField label="Horário" name="horaEvento" defaultValue={contrato.horaEvento} />
              <EditField label="Nome do evento" name="evento" defaultValue={contrato.evento} />
            </div>
            <EditField label="Local do evento" name="localEvento" defaultValue={contrato.localEvento} />
            <EditField label="Material / serviço contratado" name="material" defaultValue={contrato.material} textarea rows={4} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <EditField label="Número de convidados" name="quantidadeConvidados" defaultValue={contrato.quantidadeConvidados} />
              <EditField label="Quantidade de pessoas da equipe" name="quantidadeEquipe" defaultValue={contrato.quantidadeEquipe} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <EditField label="Duração (horas)" name="duracaoHoras" defaultValue={contrato.duracaoHoras} />
              <EditField label="Duração cerimônia (horas)" name="duracaoCerimonia" defaultValue={contrato.duracaoCerimonia} />
              <EditField label="Duração recepção (horas)" name="duracaoRecepcao" defaultValue={contrato.duracaoRecepcao} />
            </div>
          </Group>

          <Group title="Pagamento">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <EditField label="Valor total (R$)" name="valorTotal" defaultValue={contrato.valorTotal} />
              <EditField label="Forma de pagamento" name="formaPagamento" defaultValue={contrato.formaPagamento} />
            </div>
            <EditSelect
              label="Forma da entrada"
              name="tipoEntrada"
              defaultValue={contrato.tipoEntrada}
              options={[
                { value: "unica", label: "Entrada única (40%)" },
                { value: "parcelada", label: "Entrada parcelada (20% + 20%)" },
              ]}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <EditField label="Valor da entrada / 1ª parcela (R$)" name="valorEntrada" defaultValue={contrato.valorEntrada} />
              <EditField label="Valor da 2ª parcela da entrada (R$)" name="valorEntrada2" defaultValue={contrato.valorEntrada2} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <EditField label="Quantidade de parcelas" name="quantidadeParcelas" defaultValue={contrato.quantidadeParcelas} />
              <EditField label="Valor de cada parcela (R$)" name="valorParcela" defaultValue={contrato.valorParcela} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <EditField label="Data da 1ª parcela" name="dataInicialParcelas" type="date" defaultValue={contrato.dataInicialParcelas} />
              <EditField label="Data da última parcela" name="dataFinalParcelas" type="date" defaultValue={contrato.dataFinalParcelas} />
            </div>
            <EditField label="Dados bancários" name="dadosBancarios" defaultValue={contrato.dadosBancarios} textarea />
          </Group>

          <Group title="Assinatura">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <EditField label="Cidade/UF" name="cidadeAss" defaultValue={contrato.cidadeAss} />
              <EditField label="Data do contrato" name="dataContrato" type="date" defaultValue={contrato.dataContrato} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <EditField label="Testemunha 1" name="testemunha" defaultValue={contrato.testemunha} />
              <EditField label="Testemunha 2" name="testemunha2" defaultValue={contrato.testemunha2} />
            </div>
          </Group>

          <button
            type="submit"
            className="w-full rounded-full bg-brand-gold text-brand-navy font-bold uppercase tracking-wide py-3 cursor-pointer hover:opacity-90 transition-opacity"
          >
            Salvar e gerar contrato corrigido
          </button>
        </form>
      </div>
    </main>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3 pt-4 border-t border-brand-border first:pt-0 first:border-t-0">
      <p className="text-xs font-bold uppercase tracking-wide text-brand-gold">{title}</p>
      {children}
    </div>
  );
}

function EditField({
  label,
  name,
  type = "text",
  defaultValue,
  textarea = false,
  rows = 2,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  textarea?: boolean;
  rows?: number;
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={name} className="text-xs font-bold text-brand-light/80 block">
        {label}
      </label>
      {textarea ? (
        <textarea
          id={name}
          name={name}
          rows={rows}
          defaultValue={defaultValue}
          className="w-full rounded-lg border border-brand-border bg-brand-navy px-3 py-2 text-brand-light text-sm focus:outline-none focus:border-brand-gold"
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          defaultValue={defaultValue}
          className="w-full rounded-lg border border-brand-border bg-brand-navy px-3 py-2 text-brand-light text-sm focus:outline-none focus:border-brand-gold"
        />
      )}
    </div>
  );
}

function EditSelect({
  label,
  name,
  defaultValue,
  options,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={name} className="text-xs font-bold text-brand-light/80 block">
        {label}
      </label>
      <select
        id={name}
        name={name}
        defaultValue={defaultValue}
        className="w-full rounded-lg border border-brand-border bg-brand-navy px-3 py-2 text-brand-light text-sm focus:outline-none focus:border-brand-gold"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
