"use client";

import { CurrencyInput } from "@/components/forms/CurrencyInput";
import { PercentInput } from "@/components/forms/PercentInput";
import { NumberField } from "@/components/forms/NumberField";
import type { DebtPayoffFormValues } from "@/lib/validation/schemas";

interface DebtPayoffFormProps {
  values: DebtPayoffFormValues;
  onChange: (values: DebtPayoffFormValues) => void;
  onSubmit: () => void;
}

export function DebtPayoffForm({ values, onChange, onSubmit }: DebtPayoffFormProps) {
  const set = <K extends keyof DebtPayoffFormValues>(key: K, value: DebtPayoffFormValues[K]) =>
    onChange({ ...values, [key]: value });

  return (
    <form
      className="grid gap-5 sm:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <CurrencyInput id="outstandingBalance" label="Saldo devedor da dívida" value={values.outstandingBalance} onChange={(v) => set("outstandingBalance", v)} />
      <PercentInput id="loanAnnualInterestRate" label="Taxa de juros da dívida" value={values.loanAnnualInterestRate} onChange={(v) => set("loanAnnualInterestRate", v)} hint="Ex: cartão, cheque especial, empréstimo pessoal" />
      <NumberField id="remainingMonths" label="Meses restantes" value={values.remainingMonths} onChange={(v) => set("remainingMonths", v)} suffix="meses" />
      <CurrencyInput id="availableAmount" label="Dinheiro disponível" value={values.availableAmount} onChange={(v) => set("availableAmount", v)} />
      <PercentInput id="investmentAnnualRate" label="Retorno esperado do investimento" value={values.investmentAnnualRate} onChange={(v) => set("investmentAnnualRate", v)} />
      <button
        type="submit"
        className="sm:col-span-2 rounded-card bg-ink px-6 py-3.5 font-medium text-paper transition-opacity hover:opacity-90"
      >
        Comparar
      </button>
    </form>
  );
}
