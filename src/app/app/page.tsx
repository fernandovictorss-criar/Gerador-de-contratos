import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { ContractForm } from "./ContractForm";
import { LogoutButton } from "./LogoutButton";

export default async function FormPage() {
  const session = await auth();
  const tenant = session?.user?.tenantId
    ? await prisma.tenant.findUnique({
        where: { id: session.user.tenantId },
        include: { modelosContrato: { orderBy: { tipoEvento: "asc" } } },
      })
    : null;

  if (tenant?.bloqueado) {
    return (
      <main className="min-h-screen bg-brand-navy text-brand-light px-4 py-10 flex items-center justify-center">
        <div className="max-w-sm w-full bg-brand-surface border border-brand-border rounded-2xl p-6 text-center space-y-4">
          <p className="font-bold">Acesso bloqueado</p>
          <p className="text-sm text-brand-gray">
            Este cliente está bloqueado. Entre em contato com o suporte para mais informações.
          </p>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <LogoutButton />
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-brand-navy text-brand-light px-4 py-10 flex flex-col">
      <div className="max-w-xl mx-auto w-full flex-1">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Image
              src="/prosperar360-logo.png"
              alt="Prosperar 360"
              width={36}
              height={36}
              className="rounded-full bg-brand-light shrink-0"
            />
            <div>
              <h1 className="font-bold text-2xl tracking-wide leading-none text-brand-light">
                Gerador de Contrato
              </h1>
              <p className="text-brand-gray text-sm">{tenant?.nome}</p>
            </div>
          </div>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <LogoutButton />
          </form>
        </div>

        <p className="text-brand-gray text-xs mb-4">
          Preencha os dados abaixo para gerar o contrato pronto para assinatura. Nenhum dado é salvo após a geração.
        </p>

        <nav className="flex gap-4 text-xs text-brand-gray overflow-x-auto pb-3 mb-2 border-b border-brand-border">
          <a href="#sec-contratante" className="hover:text-brand-gold whitespace-nowrap">
            Contratante
          </a>
          <a href="#sec-evento" className="hover:text-brand-gold whitespace-nowrap">
            Evento
          </a>
          <a href="#sec-pagamento" className="hover:text-brand-gold whitespace-nowrap">
            Pagamento
          </a>
          <a href="#sec-assinatura" className="hover:text-brand-gold whitespace-nowrap">
            Assinatura
          </a>
        </nav>

        <ContractForm>
          <Section id="sec-contratante" title="Contratante">
            <Field label="Razão social / Nome" name="contratante" required />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="CNPJ / CPF" name="docContratante" required />
              <Field label="Telefone" name="telContratante" />
            </div>
            <Field label="Endereço completo" name="endContratante" textarea required />
          </Section>

          <Section id="sec-evento" title="Evento e locação">
            {tenant && tenant.modelosContrato.length > 0 && (
              <div className="space-y-1">
                <label htmlFor="tipoEvento" className="text-xs font-bold text-brand-light/80 block">
                  Tipo de evento
                  <span className="text-brand-gold"> *</span>
                </label>
                <select
                  id="tipoEvento"
                  name="tipoEvento"
                  required
                  className="w-full rounded-lg border border-brand-border bg-brand-navy px-3 py-2 text-brand-light text-sm focus:outline-none focus:border-brand-gold"
                >
                  <option value="">Selecione...</option>
                  {tenant.modelosContrato.map((modelo) => (
                    <option key={modelo.id} value={modelo.tipoEvento}>
                      {modelo.tipoEvento}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Data" name="dataEvento" type="date" required hint="Selecione no calendário" />
              <Field label="Evento" name="evento" required />
            </div>
            <Field label="Local" name="localEvento" required />
            {tenant && tenant.modelosContrato.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Field label="Horário do evento" name="horaEvento" placeholder="21h" />
                <Field label="Número de convidados" name="quantidadeConvidados" />
                <Field label="Duração do evento (horas)" name="duracaoHoras" />
              </div>
            )}
            <Field
              label="Material contratado (uma linha por item)"
              name="material"
              textarea
              rows={6}
              required
            />
          </Section>

          <Section id="sec-pagamento" title="Pagamento">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Valor total (R$)" name="valorTotal" placeholder="R$ 0,00" required />
              <Field label="Forma de pagamento" name="formaPagamento" placeholder="PIX" />
            </div>
            {tenant && tenant.modelosContrato.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Valor de entrada (R$)" name="valorEntrada" placeholder="R$ 0,00" />
                  <Field label="Valor de cada parcela (R$)" name="valorParcela" placeholder="R$ 0,00" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Field label="Quantidade de parcelas" name="quantidadeParcelas" />
                  <Field
                    label="Data da 1ª parcela"
                    name="dataInicialParcelas"
                    type="date"
                    hint="Selecione no calendário"
                  />
                  <Field
                    label="Data da última parcela"
                    name="dataFinalParcelas"
                    type="date"
                    hint="Selecione no calendário"
                  />
                </div>
              </>
            )}
            <Field
              label="Dados bancários (deixe em branco para usar o padrão)"
              name="dadosBancarios"
              textarea
              placeholder={tenant?.dadosBancariosPadrao || undefined}
            />
          </Section>

          <Section id="sec-assinatura" title="Assinatura">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Cidade/UF" name="cidadeAss" placeholder="Aracaju/SE" required />
              <Field label="Data do contrato" name="dataContrato" type="date" required hint="Selecione no calendário" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Testemunha 1" name="testemunha" placeholder="Nome e CPF" />
              <Field label="Testemunha 2" name="testemunha2" placeholder="Nome e CPF" />
            </div>
          </Section>
        </ContractForm>
      </div>

      <footer className="text-center text-[10px] uppercase tracking-[0.2em] text-brand-gray pt-10">
        Prosperar 360 · Ecossistema de Soluções Empresariais
      </footer>
    </main>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div id={id} className="space-y-3 border-t border-brand-border pt-4 first:border-0 first:pt-0 scroll-mt-4">
      <h2 className="font-bold text-sm tracking-widest uppercase text-brand-gold">
        {title}
      </h2>
      {children}
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  textarea = false,
  placeholder,
  rows = 3,
  required = false,
  hint,
}: {
  label: string;
  name: string;
  type?: string;
  textarea?: boolean;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  hint?: string;
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={name} className="text-xs font-bold text-brand-light/80 block">
        {label}
        {required && <span className="text-brand-gold"> *</span>}
      </label>
      {textarea ? (
        <textarea
          id={name}
          name={name}
          rows={rows}
          placeholder={placeholder}
          required={required}
          className="w-full rounded-lg border border-brand-border bg-brand-navy px-3 py-2 text-brand-light text-sm focus:outline-none focus:border-brand-gold"
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          required={required}
          className="w-full rounded-lg border border-brand-border bg-brand-navy px-3 py-2 text-brand-light text-sm focus:outline-none focus:border-brand-gold"
        />
      )}
      {hint && <p className="text-[10px] text-brand-gray">{hint}</p>}
    </div>
  );
}
