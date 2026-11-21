"use client";

import { useEffect, useRef, useState } from "react";

function normalizar(valor: string): string {
  return valor
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

const INPUT_CLASS =
  "w-full rounded-lg border border-brand-border bg-brand-navy px-3 py-2 text-brand-light text-sm focus:outline-none focus:border-brand-gold";

export function SegundoContratanteFields() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ehCasamento, setEhCasamento] = useState(false);
  const [ativo, setAtivo] = useState(false);

  // O tipo de evento fica mais abaixo no formulário, então o botão acompanha
  // a escolha dele (mesma ideia dos campos de duração do casamento).
  useEffect(() => {
    const form = containerRef.current?.closest("form");
    const select = form?.querySelector<HTMLSelectElement>('[name="tipoEvento"]');
    if (!select) return;

    const sincronizar = () => setEhCasamento(normalizar(select.value).includes("casamento"));

    sincronizar();
    select.addEventListener("change", sincronizar);
    return () => select.removeEventListener("change", sincronizar);
  }, []);

  const visivel = ehCasamento && ativo;

  return (
    <div ref={containerRef} className="space-y-3">
      {ehCasamento && (
        <button
          type="button"
          onClick={() => setAtivo((v) => !v)}
          className="rounded-full bg-transparent border border-brand-border text-brand-light font-bold uppercase tracking-wide text-xs px-4 py-2 cursor-pointer hover:border-brand-gold transition-colors"
        >
          {ativo ? "Remover 2º contratante" : "+ Adicionar 2º contratante"}
        </button>
      )}

      {/* Um fieldset desabilitado não envia os campos nem exige os "required",
          e ainda guarda o que foi digitado caso o botão ou o tipo de evento
          sejam alternados. */}
      <fieldset disabled={!visivel} hidden={!visivel} className="space-y-3 border-0 p-0 m-0 min-w-0">
        <p className="text-xs font-bold uppercase tracking-wide text-brand-gold">2º contratante</p>
        <Campo label="Nome completo" name="contratante2" required />
        <Campo label="Profissão" name="profissao2" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Campo label="CPF" name="docContratante2" required />
          <Campo label="Telefone" name="telContratante2" />
        </div>
        <Campo
          label="Endereço completo"
          name="endContratante2"
          textarea
          hint="Deixe em branco se for o mesmo endereço do 1º contratante"
        />
      </fieldset>
    </div>
  );
}

function Campo({
  label,
  name,
  required = false,
  textarea = false,
  hint,
}: {
  label: string;
  name: string;
  required?: boolean;
  textarea?: boolean;
  hint?: string;
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={name} className="text-xs font-bold text-brand-light/80 block">
        {label}
        {required && <span className="text-brand-gold"> *</span>}
      </label>
      {textarea ? (
        <textarea id={name} name={name} rows={3} className={INPUT_CLASS} />
      ) : (
        <input id={name} name={name} type="text" required={required} className={INPUT_CLASS} />
      )}
      {hint && <p className="text-[10px] text-brand-gray">{hint}</p>}
    </div>
  );
}
