"use client";

import { CurrencyInput } from "@/components/forms/CurrencyInput";
import { PercentInput } from "@/components/forms/PercentInput";
import { NumberField } from "@/components/forms/NumberField";
import type { CashVsInstallmentsFormValues } from "@/lib/validation/schemas";

interface CashVsInstallmentsFormProps {
  values: CashVsInstallmentsFormValues;
  onChange: (values: CashVsInstallmentsFormValues) => void;
  onSubmit: () => void;
}

export function CashVsInstallmentsForm({ values, onChange, onSubmit }: CashVsInstallmentsFormProps) {
  const set = <K extends keyof CashVsInstallmentsFormValues>(
    key: K,
    value: CashVsInstallmentsFormValues[K]
  ) => onChange({ ...values, [key]: value });

  return (
    <form
      className="grid gap-5 sm:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <CurrencyInput id="price" label="Preço de tabela" value={values.price} onChange={(v) => set("price", v)} />
      <PercentInput id="cashDiscountPercent" label="Desconto pagando à vista" value={values.cashDiscountPercent} onChange={(v) => set("cashDiscountPercent", v)} />
      <NumberField id="installmentsCount" label="Número de parcelas" value={values.installmentsCount} onChange={(v) => set("installmentsCount", v)} suffix="parcelas" />
      <CurrencyInput id="installmentValue" label="Valor de cada parcela" value={values.installmentValue} onChange={(v) => set("installmentValue", v)} />
      <PercentInput id="investmentAnnualRate" label="Retorno esperado do investimento" value={values.investmentAnnualRate} onChange={(v) => set("investmentAnnualRate", v)} hint="Se você não parcelar, o dinheiro fica investido a essa taxa" />
      <button
        type="submit"
        className="sm:col-span-2 rounded-card bg-ink px-6 py-3.5 font-medium text-paper transition-opacity hover:opacity-90"
      >
        Comparar
      </button>
    </form>
  );
}
