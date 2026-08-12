import type { ScenarioResult } from "@/lib/financial-engine/scenarios";
import { formatBRL, formatPercent } from "@/lib/format";

interface ScenarioComparisonTableProps {
  scenarios: ScenarioResult[];
  bestId: ScenarioResult["id"];
}

const rows: { label: string; get: (s: ScenarioResult) => string }[] = [
  { label: "Entrada", get: (s) => formatBRL(s.downPayment) },
  { label: "Valor financiado", get: (s) => formatBRL(s.financedAmount) },
  { label: "Parcela", get: (s) => (s.installment ? formatBRL(s.installment) : "—") },
  { label: "Juros totais", get: (s) => formatBRL(s.totalInterest) },
  { label: "Custo total", get: (s) => formatBRL(s.totalCost) },
  {
    label: "Comprometimento de renda",
    get: (s) => (s.incomeCommitment ? formatPercent(s.incomeCommitment) : "—"),
  },
  { label: "Custo de oportunidade", get: (s) => formatBRL(s.opportunityCost) },
  { label: "Patrimônio projetado (5 anos)", get: (s) => formatBRL(s.netWorthProjection.year5) },
  { label: "Patrimônio projetado (10 anos)", get: (s) => formatBRL(s.netWorthProjection.year10) },
];

export function ScenarioComparisonTable({ scenarios, bestId }: ScenarioComparisonTableProps) {
  return (
    <div className="overflow-x-auto rounded-card border border-line bg-paper-raised">
      <table className="w-full min-w-[560px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-line">
            <th className="px-4 py-3 text-left font-medium text-ink-faint">Indicador</th>
            {scenarios.map((s) => (
              <th
                key={s.id}
                className={`px-4 py-3 text-right font-display font-semibold ${
                  s.id === bestId ? "text-emerald" : "text-ink"
                }`}
              >
                {s.label}
                {s.id === bestId && (
                  <span className="ml-1.5 rounded-full bg-emerald-soft px-2 py-0.5 text-[10px] font-medium text-emerald-strong">
                    menor custo
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.label} className={i % 2 === 0 ? "bg-paper" : "bg-paper-raised"}>
              <td className="px-4 py-3 text-ink-soft">{row.label}</td>
              {scenarios.map((s) => (
                <td key={s.id} className="px-4 py-3 text-right font-mono tabular-nums">
                  {row.get(s)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
