import Link from "next/link";
import { createTenant } from "../actions";
import { AdminField } from "../AdminField";

export default function NovoClientePage() {
  return (
    <main className="min-h-screen bg-brand-navy text-brand-light px-4 py-10">
      <div className="max-w-xl mx-auto w-full">
        <Link href="/admin" className="text-xs text-brand-gray hover:text-brand-light">
          &larr; Voltar
        </Link>
        <h1 className="font-bold text-3xl tracking-wide leading-none mt-2 mb-6 text-brand-light">
          Novo cliente
        </h1>

        <form
          action={createTenant}
          className="space-y-4 bg-brand-surface border border-brand-border rounded-2xl p-6"
        >
          <AdminField label="Razão social / Nome" name="nome" required />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <AdminField label="CNPJ" name="cnpj" required />
            <AdminField label="Representante legal" name="representante" required />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <AdminField label="CPF do representante" name="cpfRepresentante" required />
            <AdminField label="RG do representante" name="rgRepresentante" required />
          </div>
          <AdminField label="Endereço completo" name="endereco" textarea required />
          <AdminField
            label="Dados bancários padrão (opcional)"
            name="dadosBancariosPadrao"
            textarea
          />

          <div className="border-t border-brand-border pt-4 space-y-4">
            <p className="text-xs font-bold text-brand-light/80">Login de acesso</p>
            <AdminField label="E-mail" name="email" type="email" required />
            <AdminField label="Senha" name="password" type="password" required />
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-brand-gold text-brand-navy font-bold uppercase tracking-wide py-3 cursor-pointer hover:opacity-90 transition-opacity"
          >
            Criar cliente
          </button>
        </form>
      </div>
    </main>
  );
}
