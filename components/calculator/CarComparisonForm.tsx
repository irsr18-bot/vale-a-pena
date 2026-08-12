"use client";

import { CurrencyInput } from "@/components/forms/CurrencyInput";
import { PercentInput } from "@/components/forms/PercentInput";
import { NumberField } from "@/components/forms/NumberField";
import type { CarPurchaseFormValues } from "@/lib/validation/schemas";

interface CarComparisonFormProps {
  values: CarPurchaseFormValues;
  onChange: (values: CarPurchaseFormValues) => void;
  onSubmit: () => void;
}

export function CarComparisonForm({ values, onChange, onSubmit }: CarComparisonFormProps) {
  return (
    <form
      className="grid gap-5 sm:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <CurrencyInput
        id="assetPrice"
        label="Valor do carro"
        value={values.assetPrice}
        onChange={(assetPrice) => onChange({ ...values, assetPrice })}
      />
      <CurrencyInput
        id="availableCash"
        label="Dinheiro disponível hoje"
        value={values.availableCash}
        onChange={(availableCash) => onChange({ ...values, availableCash })}
      />
      <CurrencyInput
        id="monthlyIncome"
        label="Renda mensal"
        value={values.monthlyIncome}
        onChange={(monthlyIncome) => onChange({ ...values, monthlyIncome })}
      />
      <NumberField
        id="termMonths"
        label="Prazo do financiamento"
        suffix="meses"
        value={values.termMonths}
        onChange={(termMonths) => onChange({ ...values, termMonths })}
      />
      <PercentInput
        id="financingRate"
        label="Taxa do financiamento"
        value={values.financingAnnualRate}
        onChange={(financingAnnualRate) => onChange({ ...values, financingAnnualRate })}
      />
      <PercentInput
        id="investmentRate"
        label="Taxa de retorno do investimento"
        value={values.investmentAnnualRate}
        onChange={(investmentAnnualRate) => onChange({ ...values, investmentAnnualRate })}
        hint="Ex: rendimento estimado do seu CDB/Tesouro"
      />
      <button
        type="submit"
        className="sm:col-span-2 rounded-card bg-ink px-6 py-3.5 font-medium text-paper transition-opacity hover:opacity-90"
      >
        Comparar cenários
      </button>
    </form>
  );
}
