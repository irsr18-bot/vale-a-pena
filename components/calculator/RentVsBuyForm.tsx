"use client";

import { CurrencyInput } from "@/components/forms/CurrencyInput";
import { PercentInput } from "@/components/forms/PercentInput";
import { NumberField } from "@/components/forms/NumberField";
import type { RentVsBuyFormValues } from "@/lib/validation/schemas";

interface RentVsBuyFormProps {
  values: RentVsBuyFormValues;
  onChange: (values: RentVsBuyFormValues) => void;
  onSubmit: () => void;
}

export function RentVsBuyForm({ values, onChange, onSubmit }: RentVsBuyFormProps) {
  const set = <K extends keyof RentVsBuyFormValues>(key: K, value: RentVsBuyFormValues[K]) =>
    onChange({ ...values, [key]: value });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="space-y-8"
    >
      <fieldset className="grid gap-5 sm:grid-cols-2">
        <legend className="mb-1 font-display text-sm font-semibold text-ink-soft sm:col-span-2">
          O imóvel
        </legend>
        <CurrencyInput id="propertyPrice" label="Valor do imóvel" value={values.propertyPrice} onChange={(v) => set("propertyPrice", v)} />
        <CurrencyInput id="downPayment" label="Entrada" value={values.downPayment} onChange={(v) => set("downPayment", v)} />
        <CurrencyInput id="purchaseCosts" label="Custos de compra (ITBI, cartório)" value={values.purchaseCosts} onChange={(v) => set("purchaseCosts", v)} />
        <PercentInput id="financingAnnualRate" label="Taxa de financiamento" value={values.financingAnnualRate} onChange={(v) => set("financingAnnualRate", v)} />
        <NumberField id="financingTermMonths" label="Prazo do financiamento" suffix="meses" value={values.financingTermMonths} onChange={(v) => set("financingTermMonths", v)} />
        <PercentInput id="annualPropertyAppreciation" label="Valorização anual estimada" value={values.annualPropertyAppreciation} onChange={(v) => set("annualPropertyAppreciation", v)} />
      </fieldset>

      <fieldset className="grid gap-5 sm:grid-cols-2">
        <legend className="mb-1 font-display text-sm font-semibold text-ink-soft sm:col-span-2">
          Custos de manter o imóvel
        </legend>
        <CurrencyInput id="monthlyCondoFee" label="Condomínio (mensal)" value={values.monthlyCondoFee} onChange={(v) => set("monthlyCondoFee", v)} />
        <CurrencyInput id="annualIptu" label="IPTU (anual)" value={values.annualIptu} onChange={(v) => set("annualIptu", v)} />
        <CurrencyInput id="annualInsurance" label="Seguro (anual)" value={values.annualInsurance} onChange={(v) => set("annualInsurance", v)} />
        <CurrencyInput id="annualMaintenance" label="Manutenção (anual)" value={values.annualMaintenance} onChange={(v) => set("annualMaintenance", v)} />
      </fieldset>

      <fieldset className="grid gap-5 sm:grid-cols-2">
        <legend className="mb-1 font-display text-sm font-semibold text-ink-soft sm:col-span-2">
          A alternativa: alugar e investir
        </legend>
        <CurrencyInput id="currentRent" label="Aluguel atual" value={values.currentRent} onChange={(v) => set("currentRent", v)} />
        <PercentInput id="annualRentAdjustment" label="Reajuste anual do aluguel" value={values.annualRentAdjustment} onChange={(v) => set("annualRentAdjustment", v)} />
        <PercentInput id="investmentAnnualRate" label="Retorno esperado do investimento" value={values.investmentAnnualRate} onChange={(v) => set("investmentAnnualRate", v)} hint="Ex: CDI, Tesouro Selic" />
      </fieldset>

      <button
        type="submit"
        className="w-full rounded-card bg-ink px-6 py-3.5 font-medium text-paper transition-opacity hover:opacity-90"
      >
        Comparar
      </button>
    </form>
  );
}
