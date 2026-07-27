"use client";

import { useEffect, useRef, useState } from "react";
import { DATA_EVENTO_CHANGED } from "./DataEventoField";

function parseMoney(raw: string): number {
  const limpo = (raw || "")
    .replace(/R\$\s?/g, "")
    .replace(/\./g, "")
    .replace(",", ".")
    .replace(/[^0-9.]/g, "");
  const numero = Number(limpo);
  return Number.isFinite(numero) ? numero : 0;
}

function formatMoneyInput(n: number): string {
  return n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function addMonths(dateStr: string, months: number): string {
  const d = new Date(`${dateStr}T12:00:00`);
  if (Number.isNaN(d.getTime())) return "";
  d.setMonth(d.getMonth() + months);
  return d.toISOString().slice(0, 10);
}

function diffDays(a: string, b: string): number {
  const da = new Date(`${a}T12:00:00`);
  const db = new Date(`${b}T12:00:00`);
  return Math.round((db.getTime() - da.getTime()) / 86400000);
}

export function ParcelamentoFields() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  useEffect(() => {
    const form = containerRef.current?.closest("form");
    if (!form) return;

    const getInput = (name: string) =>
      form.querySelector<HTMLInputElement>(`[name="${name}"]`);

    const valorTotalEl = getInput("valorTotal");
    const valorEntradaEl = getInput("valorEntrada");
    const quantidadeParcelasEl = getInput("quantidadeParcelas");
    const valorParcelaEl = getInput("valorParcela");
    const dataInicialEl = getInput("dataInicialParcelas");
    const dataFinalEl = getInput("dataFinalParcelas");
    // Consultado a cada verificação: o campo de data pode ser trocado pelo
    // texto livre quando a data do evento está "a definir".
    const getDataEventoEl = () => getInput("dataEvento");

    function recomputeParcela() {
      if (!valorParcelaEl) return;
      const valorTotal = parseMoney(valorTotalEl?.value || "");
      const valorEntrada = parseMoney(valorEntradaEl?.value || "");
      const qtd = Number(quantidadeParcelasEl?.value || "");
      if (valorTotal > 0 && qtd > 0) {
        const restante = Math.max(valorTotal - valorEntrada, 0);
        valorParcelaEl.value = formatMoneyInput(restante / qtd);
      }
    }

    function checkPrazo() {
      if (!dataFinalEl) return;
      const dataFinal = dataFinalEl.value;
      const dataEvento = getDataEventoEl()?.value || "";
      if (dataFinal && dataEvento) {
        const dias = diffDays(dataFinal, dataEvento);
        if (dias < 15) {
          dataFinalEl.setCustomValidity(
            "A última parcela deve vencer pelo menos 15 dias antes da data do evento."
          );
          setAviso(
            "A última parcela ficou a menos de 15 dias da data do evento — ajuste a quantidade de parcelas ou a data da 1ª parcela."
          );
          return;
        }
      }
      dataFinalEl.setCustomValidity("");
      setAviso(null);
    }

    function recomputeDataFinal() {
      if (!dataFinalEl) return;
      const dataInicial = dataInicialEl?.value || "";
      const qtd = Number(quantidadeParcelasEl?.value || "");
      if (dataInicial && qtd > 0) {
        dataFinalEl.value = addMonths(dataInicial, qtd - 1);
      }
      checkPrazo();
    }

    const onParcelaInputs = () => recomputeParcela();
    const onDataInputs = () => recomputeDataFinal();
    // Delegado no formulário: o campo de data do evento pode ser
    // remontado quando o usuário marca "Data a definir".
    const onFormInput = (e: Event) => {
      if ((e.target as HTMLElement | null)?.getAttribute?.("name") === "dataEvento") {
        checkPrazo();
      }
    };

    valorTotalEl?.addEventListener("input", onParcelaInputs);
    valorEntradaEl?.addEventListener("input", onParcelaInputs);
    quantidadeParcelasEl?.addEventListener("input", onParcelaInputs);
    quantidadeParcelasEl?.addEventListener("input", onDataInputs);
    dataInicialEl?.addEventListener("input", onDataInputs);
    form.addEventListener("input", onFormInput);
    form.addEventListener(DATA_EVENTO_CHANGED, checkPrazo);

    return () => {
      valorTotalEl?.removeEventListener("input", onParcelaInputs);
      valorEntradaEl?.removeEventListener("input", onParcelaInputs);
      quantidadeParcelasEl?.removeEventListener("input", onParcelaInputs);
      quantidadeParcelasEl?.removeEventListener("input", onDataInputs);
      dataInicialEl?.removeEventListener("input", onDataInputs);
      form.removeEventListener("input", onFormInput);
      form.removeEventListener(DATA_EVENTO_CHANGED, checkPrazo);
    };
  }, []);

  return (
    <div ref={containerRef} className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <ParcelaField label="Valor de entrada (R$)" name="valorEntrada" placeholder="R$ 0,00" required />
        <ParcelaField label="Quantidade de parcelas" name="quantidadeParcelas" required />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <ParcelaField
          label="Valor de cada parcela (R$)"
          name="valorParcela"
          placeholder="R$ 0,00"
          required
          hint="Calculado automaticamente"
        />
        <ParcelaField
          label="Data da 1ª parcela"
          name="dataInicialParcelas"
          type="date"
          required
          hint="Selecione no calendário"
        />
        <ParcelaField
          label="Data da última parcela"
          name="dataFinalParcelas"
          type="date"
          required
          hint="Calculada automaticamente"
        />
      </div>
      {aviso && (
        <p className="text-xs text-brand-gold bg-brand-surface border border-brand-gold/40 rounded-lg px-3 py-2">
          {aviso}
        </p>
      )}
    </div>
  );
}

function ParcelaField({
  label,
  name,
  type = "text",
  placeholder,
  required = false,
  hint,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  hint?: string;
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={name} className="text-xs font-bold text-brand-light/80 block">
        {label}
        {required && <span className="text-brand-gold"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-lg border border-brand-border bg-brand-navy px-3 py-2 text-brand-light text-sm focus:outline-none focus:border-brand-gold"
      />
      {hint && <p className="text-[10px] text-brand-gray">{hint}</p>}
    </div>
  );
}
