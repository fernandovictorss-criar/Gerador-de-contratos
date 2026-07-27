"use client";

import { useEffect, useRef, useState } from "react";

function normalizar(valor: string): string {
  return valor
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function DuracaoFields() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ehCasamento, setEhCasamento] = useState(false);

  useEffect(() => {
    const form = containerRef.current?.closest("form");
    const select = form?.querySelector<HTMLSelectElement>('[name="tipoEvento"]');
    if (!select) return;

    const sincronizar = () => setEhCasamento(normalizar(select.value).includes("casamento"));

    sincronizar();
    select.addEventListener("change", sincronizar);
    return () => select.removeEventListener("change", sincronizar);
  }, []);

  return (
    <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {ehCasamento ? (
        <>
          <DuracaoField
            label="Duração da cerimônia (horas)"
            name="duracaoCerimonia"
            placeholder="Ex: 02 (duas)"
          />
          <DuracaoField
            label="Duração da recepção (horas)"
            name="duracaoRecepcao"
            placeholder="Ex: 7 (sete)"
          />
        </>
      ) : (
        <DuracaoField label="Duração do evento (horas)" name="duracaoHoras" placeholder="Ex: 6" />
      )}
    </div>
  );
}

function DuracaoField({
  label,
  name,
  placeholder,
}: {
  label: string;
  name: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={name} className="text-xs font-bold text-brand-light/80 block">
        {label}
        <span className="text-brand-gold"> *</span>
      </label>
      <input
        id={name}
        name={name}
        type="text"
        placeholder={placeholder}
        required
        className="w-full rounded-lg border border-brand-border bg-brand-navy px-3 py-2 text-brand-light text-sm focus:outline-none focus:border-brand-gold"
      />
    </div>
  );
}
