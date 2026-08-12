"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LoanCalculatorForm } from "@/components/calculator/LoanCalculatorForm";
import { CarComparisonForm } from "@/components/calculator/CarComparisonForm";
import { ResultSummary } from "@/components/results/ResultSummary";
import { ScenarioComparisonTable } from "@/components/results/ScenarioComparisonTable";
import { AIAnalysisCard } from "@/components/results/AIAnalysisCard";
import { PremisesList } from "@/components/results/PremisesList";
import { AmortizationChart } from "@/components/charts/AmortizationChart";
import { ScenarioCostChart } from "@/components/charts/ScenarioCostChart";
import {
  calculateAmortizationSchedule,
} from "@/lib/financial-engine/loan";
import { compareCarPurchaseScenarios } from "@/lib/financial-engine/scenarios";
import type { LoanResult } from "@/lib/financial-engine/types";
import type { CarPurchaseComparison } from "@/lib/financial-engine/scenarios";
import { explainCarPurchaseComparison, explainLoanResult } from "@/lib/ai/explain";
import { formatBRL, formatPercent } from "@/lib/format";
import type { CarPurchaseFormValues, LoanFormValues } from "@/lib/validation/schemas";

type Mode = "loan" | "car";

function FinanciamentoContent() {
  const searchParams = useSearchParams();
  const initialMode = (searchParams.get("mode") as Mode) ?? "car";
  const [mode, setMode] = useState<Mode>(initialMode);

  const [loanValues, setLoanValues] = useState<LoanFormValues>({
    principal: Number(searchParams.get("principal")) || 80000,
    annualInterestRate: 0.12,
    termMonths: 48,
    system: "PRICE",
  });
  const [loanResult, setLoanResult] = useState<LoanResult | null>(null);

  const [carValues, setCarValues] = useState<CarPurchaseFormValues>({
    assetPrice: Number(searchParams.get("assetPrice")) || 100000,
    availableCash: Number(searchParams.get("availableCash")) || 50000,
    monthlyIncome: Number(searchParams.get("monthlyIncome")) || 7000,
    financingAnnualRate: 0.18,
    termMonths: 48,
    investmentAnnualRate: 0.11,
  });
  const [carResult, setCarResult] = useState<CarPurchaseComparison | null>(null);

  function runLoanCalculation() {
    setLoanResult(calculateAmortizationSchedule(loanValues));
  }

  function runCarComparison() {
    setCarResult(compareCarPurchaseScenarios(carValues));
  }

  const loanExplanation = useMemo(
    () => (loanResult ? explainLoanResult(loanResult, loanValues.principal) : null),
    [loanResult, loanValues.principal]
  );
  const carExplanation = useMemo(
    () => (carResult ? explainCarPurchaseComparison(carResult) : null),
    [carResult]
  );

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="font-display text-3xl font-semibold tracking-tight">
        {mode === "car" ? "Comprar carro: à vista, financiar ou investir?" : "Calculadora de financiamento"}
      </h1>
      <p className="mt-2 text-ink-soft">
        Preencha os dados abaixo. Todo o cálculo é feito por funções
        determinísticas — a IA só interpreta e explica o resultado.
      </p>

      <div className="mt-6 flex gap-2">
        <button
          onClick={() => setMode("car")}
          className={`rounded-full px-4 py-2 text-sm font-medium ${
            mode === "car" ? "bg-ink text-paper" : "bg-paper-raised text-ink-soft border border-line"
          }`}
        >
          Comparar cenários
        </button>
        <button
          onClick={() => setMode("loan")}
          className={`rounded-full px-4 py-2 text-sm font-medium ${
            mode === "loan" ? "bg-ink text-paper" : "bg-paper-raised text-ink-soft border border-line"
          }`}
        >
          Financiamento simples
        </button>
      </div>

      <div className="mt-8 rounded-card border border-line bg-paper-raised p-6 shadow-card">
        {mode === "car" ? (
          <CarComparisonForm values={carValues} onChange={setCarValues} onSubmit={runCarComparison} />
        ) : (
          <LoanCalculatorForm values={loanValues} onChange={setLoanValues} onSubmit={runLoanCalculation} />
        )}
      </div>

      {mode === "car" && carResult && (
        <div className="mt-10 space-y-6">
          <ResultSummary
            label="Cenário com menor custo total"
            value={carResult.scenarios.find((s) => s.id === carResult.recommendation.bestByTotalCost)!.label}
            tone="emerald"
            supporting={carResult.scenarios.map((s) => ({
              label: s.label,
              value: formatBRL(s.totalCost),
            }))}
          />
          <ScenarioComparisonTable
            scenarios={carResult.scenarios}
            bestId={carResult.recommendation.bestByTotalCost}
          />
          <ScenarioCostChart scenarios={carResult.scenarios} bestId={carResult.recommendation.bestByTotalCost} />
          {carExplanation && <AIAnalysisCard text={carExplanation} />}
          <PremisesList
            items={[
              { label: "Valor do carro", value: formatBRL(carValues.assetPrice) },
              { label: "Dinheiro disponível", value: formatBRL(carValues.availableCash) },
              { label: "Renda mensal", value: formatBRL(carValues.monthlyIncome) },
              { label: "Taxa de financiamento", value: formatPercent(carValues.financingAnnualRate) },
              { label: "Taxa de investimento", value: formatPercent(carValues.investmentAnnualRate) },
              { label: "Prazo", value: `${carValues.termMonths} meses` },
            ]}
          />
        </div>
      )}

      {mode === "loan" && loanResult && (
        <div className="mt-10 space-y-6">
          <ResultSummary
            label={loanResult.system === "PRICE" ? "Parcela fixa" : "Primeira parcela"}
            value={formatBRL(loanResult.firstInstallment)}
            tone="ink"
            supporting={[
              { label: "Juros totais", value: formatBRL(loanResult.totalInterest) },
              { label: "Total pago", value: formatBRL(loanResult.totalPaid) },
              { label: "Prazo efetivo", value: `${loanResult.monthsToPayoff} meses` },
              {
                label: "Juros / financiado",
                value: formatPercent(loanResult.totalInterest / loanValues.principal),
              },
            ]}
          />
          <AmortizationChart schedule={loanResult.schedule} />
          {loanExplanation && <AIAnalysisCard text={loanExplanation} />}
          <PremisesList
            items={[
              { label: "Valor financiado", value: formatBRL(loanValues.principal) },
              { label: "Taxa de juros", value: formatPercent(loanValues.annualInterestRate) },
              { label: "Prazo", value: `${loanValues.termMonths} meses` },
              { label: "Sistema", value: loanValues.system },
            ]}
          />
        </div>
      )}
    </div>
  );
}

export default function FinanciamentoPage() {
  return (
    <Suspense fallback={null}>
      <FinanciamentoContent />
    </Suspense>
  );
}
