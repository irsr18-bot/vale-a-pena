import type { CarPurchaseComparison } from "@/lib/financial-engine/scenarios";
import type { LoanResult } from "@/lib/financial-engine/types";
import type { RentVsBuyResult } from "@/lib/financial-engine/rentVsBuy";
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

/**
 * Explicação em texto para o comparador comprar × alugar. Mesma lógica:
 * os números já vêm prontos do financial-engine, a função só narra.
 */
export function explainRentVsBuy(result: RentVsBuyResult): string {
  const year30 = result.timeline.find((p) => p.year === 30)!;
  const year10 = result.timeline.find((p) => p.year === 10)!;
  const favorsBuy = result.favoredScenarioAtYear30 === "buy";

  const intro = favorsBuy
    ? `Em 30 anos, comprar o imóvel projeta um patrimônio de ${formatBRL(year30.buyNetWorth)}, contra ${formatBRL(year30.rentNetWorth)} alugando e investindo a diferença — a compra sai na frente nesse horizonte.`
    : `Em 30 anos, alugar e investir a diferença projeta um patrimônio de ${formatBRL(year30.rentNetWorth)}, contra ${formatBRL(year30.buyNetWorth)} comprando o imóvel — alugar sai na frente nesse horizonte, considerando as taxas informadas.`;

  const shortTerm = `Em 10 anos, a diferença já é ${
    year10.buyNetWorth >= year10.rentNetWorth ? "favorável à compra" : "favorável ao aluguel"
  }: ${formatBRL(year10.buyNetWorth)} comprando contra ${formatBRL(year10.rentNetWorth)} alugando.`;

  const costNote = `O custo mensal de possuir o imóvel hoje (parcela + condomínio + IPTU + seguro + manutenção) é de aproximadamente ${formatBRL(result.buyMonthlyCost)}, contra ${formatBRL(result.rentMonthlyCost)} de aluguel informado.`;

  const caveat =
    "O resultado é bastante sensível à taxa de valorização do imóvel e ao retorno do investimento usados na simulação — pequenas mudanças nessas taxas podem inverter o resultado. Ajuste os valores para refletir sua realidade.";

  return [intro, shortTerm, costNote, caveat].join(" ");
}
