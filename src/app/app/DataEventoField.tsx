"use client";

import { useEffect, useRef, useState } from "react";

export const DATA_EVENTO_CHANGED = "dataEventoChanged";

const INPUT_CLASS =
  "w-full rounded-lg border border-brand-border bg-brand-navy px-3 py-2 text-brand-light text-sm focus:outline-none focus:border-brand-gold";

export function DataEventoField() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [aDefinir, setADefinir] = useState(false);

  // Avisa quem depende da data do evento (ex: prazo das parcelas) de que o
  // campo foi trocado, já que a troca em si não dispara evento de input.
  useEffect(() => {
    containerRef.current
      ?.closest("form")
      ?.dispatchEvent(new CustomEvent(DATA_EVENTO_CHANGED));
  }, [aDefinir]);

  return (
    <div ref={containerRef} className="space-y-2">
      <div className="space-y-1">
        <label
          htmlFor={aDefinir ? "dataEventoTexto" : "dataEvento"}
          className="text-xs font-bold text-brand-light/80 block"
        >
          Data
          <span className="text-brand-gold"> *</span>
        </label>
        {/* As `key` distintas impedem que o React reaproveite o mesmo
            elemento, o que faria o campo de texto herdar a data digitada. */}
        {aDefinir ? (
          <input
            key="texto"
            id="dataEventoTexto"
            name="dataEventoTexto"
            type="text"
            maxLength={60}
            defaultValue="a definir"
            required
            className={INPUT_CLASS}
          />
        ) : (
          <input
            key="data"
            id="dataEvento"
            name="dataEvento"
            type="date"
            required
            className={INPUT_CLASS}
          />
        )}
        <p className="text-[10px] text-brand-gray">
          {aDefinir ? "Este texto aparecerá no lugar da data" : "Selecione no calendário"}
        </p>
      </div>

      <label className="flex items-center gap-2 text-xs text-brand-light/80 cursor-pointer w-fit">
        <input
          type="checkbox"
          checked={aDefinir}
          onChange={(e) => setADefinir(e.target.checked)}
          className="accent-brand-gold"
        />
        Data a definir
      </label>
    </div>
  );
}
