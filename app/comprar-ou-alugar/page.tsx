"use client";

import { useMemo, useState } from "react";
import { RentVsBuyForm } from "@/components/calculator/RentVsBuyForm";
import { ResultSummary } from "@/components/results/ResultSummary";
import { AIAnalysisCard } from "@/components/results/AIAnalysisCard";
import { PremisesList } from "@/components/results/PremisesList";
import { NetWorthTimelineChart } from "@/components/charts/NetWorthTimelineChart";
import { calculateRentVsBuy } from "@/lib/financial-engine/rentVsBuy";
import type { RentVsBuyResult } from "@/lib/financial-engine/rentVsBuy";
import { explainRentVsBuy } from "@/lib/ai/explain";
import { formatBRL, formatPercent } from "@/lib/format";
import type { RentVsBuyFormValues } from "@/lib/validation/schemas";

const defaultValues: RentVsBuyFormValues = {
  propertyPrice: 500000,
  downPayment: 100000,
  financingAnnualRate: 0.11,
  financingTermMonths: 360,
  purchaseCosts: 15000,
  currentRent: 2200,
  annualRentAdjustment: 0.05,
  annualPropertyAppreciation: 0.04,
  investmentAnnualRate: 0.11,
  monthlyCondoFee: 600,
  annualIptu: 2400,
  annualInsurance: 600,
  annualMaintenance: 3000,
};

export default function ComprarOuAlugarPage() {
  const [values, setValues] = useState<RentVsBuyFormValues>(defaultValues);
  const [result, setResult] = useState<RentVsBuyResult | null>(null);

  function run() {
    setResult(calculateRentVsBuy(values));
  }

  const explanation = useMemo(() => (result ? explainRentVsBuy(result) : null), [result]);
  const year30 = result?.timeline.find((p) => p.year === 30);

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="font-display text-3xl font-semibold tracking-tight">
        Vale a pena comprar ou alugar?
      </h1>
      <p className="mt-2 text-ink-soft">
        Compare o patrimônio projetado comprando o imóvel financiado com
        alugar e investir a diferença, em 5, 10, 15, 20 e 30 anos.
      </p>

      <div className="mt-8 rounded-card border border-line bg-paper-raised p-6 shadow-card">
        <RentVsBuyForm values={values} onChange={setValues} onSubmit={run} />
      </div>

      {result && year30 && (
        <div className="mt-10 space-y-6">
          <ResultSummary
            label="Patrimônio projetado em 30 anos"
            value={
              result.favoredScenarioAtYear30 === "buy"
                ? `Comprar: ${formatBRL(year30.buyNetWorth)}`
                : `Alugar + investir: ${formatBRL(year30.rentNetWorth)}`
            }
            tone={result.favoredScenarioAtYear30 === "buy" ? "emerald" : "amber"}
            supporting={[
              { label: "Comprar (30a)", value: formatBRL(year30.buyNetWorth) },
              { label: "Alugar + investir (30a)", value: formatBRL(year30.rentNetWorth) },
              { label: "Custo mensal de posse", value: formatBRL(result.buyMonthlyCost) },
              { label: "Aluguel informado", value: formatBRL(result.rentMonthlyCost) },
            ]}
          />
          <NetWorthTimelineChart timeline={result.timeline} />
          {explanation && <AIAnalysisCard text={explanation} />}
          <PremisesList
            items={[
              { label: "Valor do imóvel", value: formatBRL(values.propertyPrice) },
              { label: "Entrada", value: formatBRL(values.downPayment) },
              { label: "Taxa de financiamento", value: formatPercent(values.financingAnnualRate) },
              { label: "Valorização anual", value: formatPercent(values.annualPropertyAppreciation) },
              { label: "Aluguel atual", value: formatBRL(values.currentRent) },
              { label: "Reajuste anual do aluguel", value: formatPercent(values.annualRentAdjustment) },
              { label: "Retorno do investimento", value: formatPercent(values.investmentAnnualRate) },
            ]}
          />
          <p className="text-xs text-ink-faint">
            Esta é uma simulação baseada nas premissas informadas acima, não
            uma previsão financeira. Valorização de imóveis e retorno de
            investimentos variam e podem ser bem diferentes do estimado.
          </p>
        </div>
      )}
    </div>
  );
}
