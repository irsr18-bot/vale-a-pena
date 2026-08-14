"use client";

import { useMemo, useState } from "react";
import { DebtPayoffForm } from "@/components/calculator/DebtPayoffForm";
import { ResultSummary } from "@/components/results/ResultSummary";
import { AIAnalysisCard } from "@/components/results/AIAnalysisCard";
import { PremisesList } from "@/components/results/PremisesList";
import { calculateDebtPayoffVsInvest } from "@/lib/financial-engine/debtPayoff";
import type { DebtPayoffResult } from "@/lib/financial-engine/debtPayoff";
import { explainDebtPayoffVsInvest } from "@/lib/ai/explain";
import { formatBRL, formatPercent } from "@/lib/format";
import type { DebtPayoffFormValues } from "@/lib/validation/schemas";

const defaultValues: DebtPayoffFormValues = {
  outstandingBalance: 15000,
  loanAnnualInterestRate: 0.35,
  remainingMonths: 18,
  availableAmount: 8000,
  investmentAnnualRate: 0.11,
};

export default function QuitarDividaPage() {
  const [values, setValues] = useState<DebtPayoffFormValues>(defaultValues);
  const [result, setResult] = useState<DebtPayoffResult | null>(null);

  const explanation = useMemo(() => (result ? explainDebtPayoffVsInvest(result) : null), [result]);

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-display text-3xl font-semibold tracking-tight">
        Vale a pena quitar a dívida ou investir?
      </h1>
      <p className="mt-2 text-ink-soft">
        Compare o ganho garantido de quitar uma dívida (juros que deixam de
        ser pagos) com o ganho esperado de investir o mesmo valor.
      </p>

      <div className="mt-8 rounded-card border border-line bg-paper-raised p-6 shadow-card">
        <DebtPayoffForm
          values={values}
          onChange={setValues}
          onSubmit={() => setResult(calculateDebtPayoffVsInvest(values))}
        />
      </div>

      {result && (
        <div className="mt-10 space-y-6">
          <ResultSummary
            label={result.recommendation === "payoff" ? "Quitar a dívida compensa mais" : "Investir compensa mais"}
            value={
              result.recommendation === "payoff"
                ? formatBRL(result.interestSaved)
                : formatBRL(result.investmentGain)
            }
            tone={result.recommendation === "payoff" ? "emerald" : "amber"}
            supporting={[
              { label: "Juros evitados (quitar)", value: formatBRL(result.interestSaved) },
              { label: "Ganho esperado (investir)", value: formatBRL(result.investmentGain) },
              { label: "Valor usado", value: formatBRL(result.payoffAmountUsed) },
            ]}
          />
          {explanation && <AIAnalysisCard text={explanation} />}
          <PremisesList
            items={[
              { label: "Saldo devedor", value: formatBRL(values.outstandingBalance) },
              { label: "Taxa da dívida", value: formatPercent(values.loanAnnualInterestRate) },
              { label: "Meses restantes", value: `${values.remainingMonths} meses` },
              { label: "Dinheiro disponível", value: formatBRL(values.availableAmount) },
              { label: "Retorno do investimento", value: formatPercent(values.investmentAnnualRate) },
            ]}
          />
        </div>
      )}
    </div>
  );
}
