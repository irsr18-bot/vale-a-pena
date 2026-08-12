import type { CarPurchaseComparison } from "@/lib/financial-engine/scenarios";
import type { LoanResult } from "@/lib/financial-engine/types";
import { formatBRL, formatPercent } from "@/lib/format";

/**
 * =========================================================================
 * MOCK — ponto de integração futura com um LLM real.
 * =========================================================================
 * Recebe os NÚMEROS JÁ CALCULADOS pelo financial-engine e monta um texto
 * explicativo em português. A IA (real, no futuro) deve fazer exatamente
 * isso: transformar resultado em explicação — nunca calcular por conta
 * própria. Trocar este mock por uma chamada de LLM não muda a interface:
 * a função continua recebendo `CarPurchaseComparison` e devolvendo string.
 * =========================================================================
 */
export function explainCarPurchaseComparison(result: CarPurchaseComparison): string {
  const { scenarios, recommendation } = result;
  const best = scenarios.find((s) => s.id === recommendation.bestByTotalCost)!;
  const others = scenarios.filter((s) => s.id !== best.id);

  const intro = `Considerando os valores informados, o cenário "${best.label}" apresenta o menor custo total estimado: ${formatBRL(best.totalCost)}.`;

  const comparisons = others
    .map((s) => {
      const diff = s.totalCost - best.totalCost;
      return `Em comparação, "${s.label}" custaria aproximadamente ${formatBRL(diff)} a mais ao longo do período.`;
    })
    .join(" ");

  const incomeNote = scenarios
    .filter((s) => s.installment > 0)
    .map((s) => `No cenário "${s.label}", a parcela compromete cerca de ${formatPercent(s.incomeCommitment)} da renda mensal informada.`)
    .join(" ");

  const caveat =
    "Esta é uma simulação baseada nas premissas informadas — taxas reais de financiamento e de investimento variam por instituição e por momento, então vale confirmar as condições exatas antes de decidir.";

  return [intro, comparisons, incomeNote, ...recommendation.notes, caveat]
    .filter(Boolean)
    .join(" ");
}

/**
 * Explicação em texto para um financiamento simples (sem comparação de
 * cenários) — mesma lógica: números vêm prontos do financial-engine.
 */
export function explainLoanResult(result: LoanResult, principal: number): string {
  const interestShare = result.totalInterest / principal;
  const parts = [
    `Com esses parâmetros, a parcela ${result.system === "PRICE" ? "fixa" : "inicial"} fica em ${formatBRL(result.firstInstallment)}.`,
    `Ao longo do financiamento, você pagaria ${formatBRL(result.totalInterest)} em juros — o equivalente a ${formatPercent(interestShare)} do valor financiado.`,
    result.system === "SAC"
      ? "No sistema SAC as parcelas começam mais altas e vão diminuindo com o tempo, o que reduz o total de juros pagos em relação ao PRICE."
      : "No sistema PRICE as parcelas são fixas do início ao fim, o que facilita o planejamento mensal.",
    "Esta é uma simulação baseada na taxa informada — confirme as condições exatas com a instituição financeira antes de decidir.",
  ];
  return parts.join(" ");
}
