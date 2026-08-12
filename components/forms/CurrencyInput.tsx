"use client";

import { useState, useEffect } from "react";

interface CurrencyInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  hint?: string;
  id: string;
}

export function CurrencyInput({ label, value, onChange, hint, id }: CurrencyInputProps) {
  const [raw, setRaw] = useState(formatForDisplay(value));

  useEffect(() => {
    setRaw(formatForDisplay(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-ink-soft">
        {label}
      </label>
      <div className="flex items-center rounded-card border border-line bg-paper-raised px-4 py-3 focus-within:border-emerald">
        <span className="mr-2 font-mono text-sm text-ink-faint">R$</span>
        <input
          id={id}
          inputMode="decimal"
          className="w-full bg-transparent font-mono text-base tabular-nums outline-none"
          value={raw}
          onChange={(e) => {
            const next = e.target.value;
            setRaw(next);
            const parsed = parseCurrency(next);
            onChange(parsed);
          }}
          onBlur={() => setRaw(formatForDisplay(value))}
        />
      </div>
      {hint && <p className="text-xs text-ink-faint">{hint}</p>}
    </div>
  );
}

function formatForDisplay(value: number): string {
  if (!value) return "";
  return value.toLocaleString("pt-BR", { maximumFractionDigits: 2 });
}

function parseCurrency(raw: string): number {
  const normalized = raw.replace(/\./g, "").replace(",", ".").replace(/[^\d.]/g, "");
  const value = parseFloat(normalized);
  return Number.isNaN(value) ? 0 : value;
}
