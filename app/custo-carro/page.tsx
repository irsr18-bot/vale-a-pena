"use client";

import { useMemo, useState } from "react";
import { CarCostForm } from "@/components/calculator/CarCostForm";
import { ResultSummary } from "@/components/results/ResultSummary";
import { AIAnalysisCard } from "@/components/results/AIAnalysisCard";
import { compareCars, calculateCarMonthlyCost } from "@/lib/financial-engine/carCost";
import type { CarComparisonResult, CarCostResult } from "@/lib/financial-engine/carCost";
import { explainCarComparison, explainCarCost } from "@/lib/ai/explain";
import { formatBRL } from "@/lib/format";
import type { CarCostFormValues } from "@/lib/validation/schemas";

const defaultCar: CarCostFormValues = {
  vehiclePrice: 90000,
  downPayment: 30000,
  financingAnnualRate: 0.18,
  financingTermMonths: 48,
  kmPerMonth: 1200,
  consumptionKmPerLiter: 12,
  fuelPricePerLiter: 6,
  annualIpva: 2700,
  annualInsurance: 3600,
  annualMaintenance: 1800,
  monthlyParking: 250,
  monthlyToll: 100,
  annualDepreciationRate: 0.15,
};

export default function CustoCarroPage() {
  const [compareMode, setCompareMode] = useState(false);
  const [carA, setCarA] = useState<CarCostFormValues>(defaultCar);
  const [carB, setCarB] = useState<CarCostFormValues>({ ...defaultCar, vehiclePrice: 60000, downPayment: 20000 });

  const [single, setSingle] = useState<CarCostResult | null>(null);
  const [comparison, setComparison] = useState<CarComparisonResult | null>(null);

  function run() {
    if (compareMode) {
      setComparison(compareCars({ ...carA, label: "Carro A" }, { ...carB, label: "Carro B" }));
      setSingle(null);
    } else {
      setSingle(calculateCarMonthlyCost(carA));
      setComparison(null);
    }
  }

  const explanation = useMemo(() => {
    if (comparison) return explainCarComparison(comparison);
    if (single) return explainCarCost(single);
    return null;
  }, [comparison, single]);

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-display text-3xl font-semibold tracking-tight">
        Quanto custa realmente ter este carro?
      </h1>
      <p className="mt-2 text-ink-soft">
        Combustível, IPVA, seguro, manutenção e depreciação — não só a
        parcela.
      </p>

      <div className="mt-6 flex gap-2">
        <button
          onClick={() => setCompareMode(false)}
          className={`rounded-full px-4 py-2 text-sm font-medium ${
            !compareMode ? "bg-ink text-paper" : "bg-paper-raised text-ink-soft border border-line"
          }`}
        >
          Um carro
        </button>
        <button
          onClick={() => setCompareMode(true)}
          className={`rounded-full px-4 py-2 text-sm font-medium ${
            compareMode ? "bg-ink text-paper" : "bg-paper-raised text-ink-soft border border-line"
          }`}
        >
          Comparar Carro A × Carro B
        </button>
      </div>

      <div className="mt-8 space-y-8">
        <div className="rounded-card border border-line bg-paper-raised p-6 shadow-card">
          <CarCostForm values={carA} onChange={setCarA} title={compareMode ? "Carro A" : undefined} />
        </div>
        {compareMode && (
          <div className="rounded-card border border-line bg-paper-raised p-6 shadow-card">
            <CarCostForm values={carB} onChange={setCarB} title="Carro B" />
          </div>
        )}
        <button
          onClick={run}
          className="w-full rounded-card bg-ink px-6 py-3.5 font-medium text-paper transition-opacity hover:opacity-90"
        >
          Calcular
        </button>
      </div>

      {single && (
        <div className="mt-10 space-y-6">
          <ResultSummary
            label="Custo mensal real"
            value={formatBRL(single.totalMonthlyCost)}
            tone="ink"
            supporting={[
              { label: "Parcela", value: formatBRL(single.monthlyInstallment) },
              { label: "Combustível", value: formatBRL(single.monthlyFuelCost) },
              { label: "Custos fixos", value: formatBRL(single.monthlyFixedCosts) },
              { label: "Depreciação", value: formatBRL(single.monthlyDepreciation) },
              { label: "Custo por km", value: formatBRL(single.costPerKm) },
              { label: "Custo em 5 anos", value: formatBRL(single.totalCostFiveYears) },
            ]}
          />
          {explanation && <AIAnalysisCard text={explanation} />}
        </div>
      )}

      {comparison && (
        <div className="mt-10 space-y-6">
          <ResultSummary
            label={`${comparison.cheaperMonthly === "a" ? "Carro A" : "Carro B"} tem menor custo mensal`}
            value={formatBRL(comparison.monthlyDifference)}
            tone="emerald"
            supporting={[
              { label: "Carro A / mês", value: formatBRL(comparison.a.totalMonthlyCost) },
              { label: "Carro B / mês", value: formatBRL(comparison.b.totalMonthlyCost) },
              { label: "Carro A / 5 anos", value: formatBRL(comparison.a.totalCostFiveYears) },
              { label: "Carro B / 5 anos", value: formatBRL(comparison.b.totalCostFiveYears) },
            ]}
          />
          {explanation && <AIAnalysisCard text={explanation} />}
        </div>
      )}
    </div>
  );
}
