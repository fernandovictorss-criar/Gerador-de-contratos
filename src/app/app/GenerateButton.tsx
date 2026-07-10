"use client";

import { useState } from "react";

export function GenerateButton() {
  const [pending, setPending] = useState(false);

  return (
    <div className="space-y-2">
      <button
        type="submit"
        disabled={pending}
        onClick={() => {
          setPending(true);
          setTimeout(() => setPending(false), 2500);
        }}
        className="w-full rounded-full bg-gradient-to-r from-brand-green via-brand-yellow to-brand-red text-black font-bold uppercase tracking-wide py-3 cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-wait"
      >
        {pending ? "Gerando..." : "Gerar Contrato"}
      </button>
      <p className="text-xs text-neutral-500 text-center">
        O contrato abre em uma nova aba. Permita pop-ups se o navegador bloquear.
      </p>
    </div>
  );
}
