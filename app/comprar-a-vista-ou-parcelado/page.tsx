"use client";

import { useMemo, useState } from "react";
import { CashVsInstallmentsForm } from "@/components/calculator/CashVsInstallmentsForm";
import { ResultSummary } from "@/components/results/ResultSummary";
import { AIAnalysisCard } from "@/components/results/AIAnalysisCard";
import { PremisesList } from "@/components/results/PremisesList";
import { calculateCashVsInstallments } from "@/lib/financial-engine/cashVsInstallments";
import type { CashVsInstallmentsResult } from "@/lib/financial-engine/cashVsInstallments";
import { explainCashVsInstallments } from "@/lib/ai/explain";
import { formatBRL, formatPercent } from "@/lib/format";
import type { CashVsInstallmentsFormValues } from "@/lib/validation/schemas";

const defaultValues: CashVsInstallmentsFormValues = {
  price: 3000,
  cashDiscountPercent: 0.05,
  installmentsCount: 10,
  installmentValue: 300,
  investmentAnnualRate: 0.11,
};

export default function CompraAVistaOuParceladoPage() {
  const [values, setValues] = useState<CashVsInstallmentsFormValues>(defaultValues);
  const [result, setResult] = useState<CashVsInstallmentsResult | null>(null);

  const explanation = useMemo(
    () => (result ? explainCashVsInstallments(result) : null),
    [result]
  );

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-display text-3xl font-semibold tracking-tight">
        Vale a pena comprar à vista ou parcelado?
      </h1>
      <p className="mt-2 text-ink-soft">
        Compare o preço à vista (com desconto) com o valor presente das
        parcelas — trazendo tudo para hoje, na mesma régua.
      </p>

      <div className="mt-8 rounded-card border border-line bg-paper-raised p-6 shadow-card">
        <CashVsInstallmentsForm
          values={values}
          onChange={setValues}
          onSubmit={() => setResult(calculateCashVsInstallments(values))}
        />
      </div>

      {result && (
        <div className="mt-10 space-y-6">
          <ResultSummary
            label={result.recommendation === "installments" ? "Parcelar compensa mais" : "Pagar à vista compensa mais"}
            value={formatBRL(result.difference)}
            tone={result.recommendation === "installments" ? "amber" : "emerald"}
            supporting={[
              { label: "Preço à vista", value: formatBRL(result.cashPrice) },
              { label: "Total parcelado", value: formatBRL(result.totalInstallmentsPaid) },
              { label: "Valor presente das parcelas", value: formatBRL(result.presentValueOfInstallments) },
            ]}
          />
          {explanation && <AIAnalysisCard text={explanation} />}
          <PremisesList
            items={[
              { label: "Preço de tabela", value: formatBRL(values.price) },
              { label: "Desconto à vista", value: formatPercent(values.cashDiscountPercent) },
              { label: "Parcelas", value: `${values.installmentsCount}x de ${formatBRL(values.installmentValue)}` },
              { label: "Retorno do investimento", value: formatPercent(values.investmentAnnualRate) },
            ]}
          />
        </div>
      )}
    </div>
  );
}
