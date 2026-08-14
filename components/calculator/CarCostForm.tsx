"use client";

import { CurrencyInput } from "@/components/forms/CurrencyInput";
import { PercentInput } from "@/components/forms/PercentInput";
import { NumberField } from "@/components/forms/NumberField";
import type { CarCostFormValues } from "@/lib/validation/schemas";

interface CarCostFormProps {
  values: CarCostFormValues;
  onChange: (values: CarCostFormValues) => void;
  title?: string;
}

export function CarCostForm({ values, onChange, title }: CarCostFormProps) {
  const set = <K extends keyof CarCostFormValues>(key: K, value: CarCostFormValues[K]) =>
    onChange({ ...values, [key]: value });

  return (
    <div className="space-y-6">
      {title && <h3 className="font-display text-sm font-semibold text-ink-soft">{title}</h3>}
      <fieldset className="grid gap-5 sm:grid-cols-2">
        <CurrencyInput id={`${title}-price`} label="Valor do veículo" value={values.vehiclePrice} onChange={(v) => set("vehiclePrice", v)} />
        <CurrencyInput id={`${title}-down`} label="Entrada" value={values.downPayment} onChange={(v) => set("downPayment", v)} />
        <PercentInput id={`${title}-rate`} label="Taxa de financiamento" value={values.financingAnnualRate} onChange={(v) => set("financingAnnualRate", v)} />
        <NumberField id={`${title}-term`} label="Prazo do financiamento" suffix="meses" value={values.financingTermMonths} onChange={(v) => set("financingTermMonths", v)} />
      </fieldset>
      <fieldset className="grid gap-5 sm:grid-cols-2">
        <NumberField id={`${title}-km`} label="Km rodados por mês" suffix="km" value={values.kmPerMonth} onChange={(v) => set("kmPerMonth", v)} />
        <NumberField id={`${title}-consumo`} label="Consumo" suffix="km/l" value={values.consumptionKmPerLiter} onChange={(v) => set("consumptionKmPerLiter", v)} />
        <CurrencyInput id={`${title}-fuel`} label="Preço do combustível (litro)" value={values.fuelPricePerLiter} onChange={(v) => set("fuelPricePerLiter", v)} />
        <PercentInput id={`${title}-dep`} label="Depreciação anual estimada" value={values.annualDepreciationRate} onChange={(v) => set("annualDepreciationRate", v)} />
      </fieldset>
      <fieldset className="grid gap-5 sm:grid-cols-2">
        <CurrencyInput id={`${title}-ipva`} label="IPVA (anual)" value={values.annualIpva} onChange={(v) => set("annualIpva", v)} />
        <CurrencyInput id={`${title}-seguro`} label="Seguro (anual)" value={values.annualInsurance} onChange={(v) => set("annualInsurance", v)} />
        <CurrencyInput id={`${title}-manutencao`} label="Manutenção (anual)" value={values.annualMaintenance} onChange={(v) => set("annualMaintenance", v)} />
        <CurrencyInput id={`${title}-estacionamento`} label="Estacionamento (mensal)" value={values.monthlyParking} onChange={(v) => set("monthlyParking", v)} />
        <CurrencyInput id={`${title}-pedagio`} label="Pedágio (mensal)" value={values.monthlyToll} onChange={(v) => set("monthlyToll", v)} />
      </fieldset>
    </div>
  );
}
