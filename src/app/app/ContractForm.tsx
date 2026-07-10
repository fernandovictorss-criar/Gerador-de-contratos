"use client";

import { useState } from "react";

export function ContractForm({ children }: { children: React.ReactNode }) {
  const [pending, setPending] = useState(false);

  return (
    <form
      method="POST"
      action="/app/contrato"
      onSubmit={() => setPending(true)}
      className="space-y-6 bg-brand-surface border border-brand-border rounded-2xl p-6"
    >
      {children}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-gradient-to-r from-brand-green via-brand-yellow to-brand-red text-black font-bold uppercase tracking-wide py-3 cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-wait"
      >
        {pending ? "Gerando..." : "Gerar Contrato"}
      </button>
    </form>
  );
}
