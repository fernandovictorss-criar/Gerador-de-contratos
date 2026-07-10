import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function FormPage() {
  const session = await auth();
  const tenant = session?.user?.tenantId
    ? await prisma.tenant.findUnique({ where: { id: session.user.tenantId } })
    : null;

  return (
    <main className="min-h-screen bg-black text-white px-4 py-10">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-3xl tracking-wide leading-none bg-gradient-to-r from-brand-green via-brand-yellow to-brand-red bg-clip-text text-transparent">
              Gerador de Contrato
            </h1>
            <p className="text-neutral-400 text-sm">{tenant?.nome}</p>
          </div>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button className="text-xs text-neutral-400 hover:text-white underline cursor-pointer">
              Sair
            </button>
          </form>
        </div>

        <form
          method="POST"
          action="/app/contrato"
          target="_blank"
          className="space-y-6 bg-brand-surface border border-brand-border rounded-2xl p-6"
        >
          <Section title="Contratante">
            <Field label="Razão social / Nome" name="contratante" />
            <div className="grid grid-cols-2 gap-3">
              <Field label="CNPJ / CPF" name="docContratante" />
              <Field label="Telefone" name="telContratante" />
            </div>
            <Field label="Endereço completo" name="endContratante" textarea />
          </Section>

          <Section title="Evento e locação">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Data" name="dataEvento" type="date" />
              <Field label="Evento" name="evento" />
            </div>
            <Field label="Local" name="localEvento" />
            <Field
              label="Material contratado (uma linha por item)"
              name="material"
              textarea
              rows={6}
            />
          </Section>

          <Section title="Pagamento">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Valor total (R$)" name="valorTotal" placeholder="R$ 0,00" />
              <Field label="Forma de pagamento" name="formaPagamento" placeholder="PIX" />
            </div>
            <Field
              label="Dados bancários (deixe em branco para usar o padrão)"
              name="dadosBancarios"
              textarea
            />
          </Section>

          <Section title="Assinatura">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Cidade/UF" name="cidadeAss" placeholder="Aracaju/SE" />
              <Field label="Data do contrato" name="dataContrato" type="date" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Testemunha 1" name="testemunha" placeholder="Nome e CPF" />
              <Field label="Testemunha 2" name="testemunha2" placeholder="Nome e CPF" />
            </div>
          </Section>

          <button
            type="submit"
            className="w-full rounded-full bg-gradient-to-r from-brand-green via-brand-yellow to-brand-red text-black font-bold uppercase tracking-wide py-3 cursor-pointer hover:opacity-90 transition-opacity"
          >
            Gerar Contrato
          </button>
        </form>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3 border-t border-brand-border pt-4 first:border-0 first:pt-0">
      <h2 className="font-display text-xl tracking-wide text-brand-green">
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
}: {
  label: string;
  name: string;
  type?: string;
  textarea?: boolean;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={name} className="text-xs font-bold text-neutral-300 block">
        {label}
      </label>
      {textarea ? (
        <textarea
          id={name}
          name={name}
          rows={rows}
          placeholder={placeholder}
          className="w-full rounded-lg border border-brand-border bg-black px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-green"
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          className="w-full rounded-lg border border-brand-border bg-black px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-green"
        />
      )}
    </div>
  );
}
