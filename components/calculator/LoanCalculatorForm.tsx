"use client";

import { CurrencyInput } from "@/components/forms/CurrencyInput";
import { PercentInput } from "@/components/forms/PercentInput";
import { NumberField } from "@/components/forms/NumberField";
import type { LoanFormValues } from "@/lib/validation/schemas";

interface LoanCalculatorFormProps {
  values: LoanFormValues;
  onChange: (values: LoanFormValues) => void;
  onSubmit: () => void;
}

export function LoanCalculatorForm({ values, onChange, onSubmit }: LoanCalculatorFormProps) {
  return (
    <form
      className="grid gap-5 sm:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <CurrencyInput
        id="principal"
        label="Valor financiado"
        value={values.principal}
        onChange={(principal) => onChange({ ...values, principal })}
      />
      <PercentInput
        id="rate"
        label="Taxa de juros"
        value={values.annualInterestRate}
        onChange={(annualInterestRate) => onChange({ ...values, annualInterestRate })}
        hint="Taxa efetiva anual"
      />
      <NumberField
        id="term"
        label="Prazo"
        suffix="meses"
        value={values.termMonths}
        onChange={(termMonths) => onChange({ ...values, termMonths })}
      />
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-ink-soft">Sistema de amortização</span>
        <div className="flex gap-2">
          {(["PRICE", "SAC"] as const).map((system) => (
            <button
              key={system}
              type="button"
              onClick={() => onChange({ ...values, system })}
              className={`flex-1 rounded-card border px-4 py-3 text-sm font-medium transition-colors ${
                values.system === system
                  ? "border-emerald bg-emerald-soft text-emerald-strong"
                  : "border-line bg-paper-raised text-ink-soft hover:border-ink-faint"
              }`}
            >
              {system}
            </button>
          ))}
        </div>
      </div>
      <button
        type="submit"
        className="sm:col-span-2 rounded-card bg-ink px-6 py-3.5 font-medium text-paper transition-opacity hover:opacity-90"
      >
        Calcular
      </button>
    </form>
  );
}
