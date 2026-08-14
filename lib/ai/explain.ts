import type { CarPurchaseComparison } from "@/lib/financial-engine/scenarios";
import type { LoanResult } from "@/lib/financial-engine/types";
import type { RentVsBuyResult } from "@/lib/financial-engine/rentVsBuy";
import type { DebtPayoffResult } from "@/lib/financial-engine/debtPayoff";
import type { CashVsInstallmentsResult } from "@/lib/financial-engine/cashVsInstallments";
import type { CarComparisonResult, CarCostResult } from "@/lib/financial-engine/carCost";
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

/** Explicação em texto para quitar dívida x investir. */
export function explainDebtPayoffVsInvest(result: DebtPayoffResult): string {
  const favorsPayoff = result.recommendation === "payoff";
  const intro = favorsPayoff
    ? `Quitar ${formatBRL(result.payoffAmountUsed)} da dívida evita ${formatBRL(result.interestSaved)} em juros — um ganho garantido, já que essa taxa está contratada.`
    : `Investir ${formatBRL(result.payoffAmountUsed)} em vez de quitar a dívida projeta um ganho de ${formatBRL(result.investmentGain)} no período — maior que os ${formatBRL(result.interestSaved)} que seriam economizados quitando.`;

  const comparison = `Em números: quitar evita ${formatBRL(result.interestSaved)} de juros (ganho certo), enquanto investir renderia cerca de ${formatBRL(result.investmentGain)} (ganho esperado, sujeito a variação de mercado).`;

  const caveat = favorsPayoff
    ? "Vale lembrar: o ganho de quitar é garantido, enquanto o retorno de investir depende do mercado — para a dívida compensar menos, o investimento precisaria performar bem acima do estimado aqui."
    : "Vale lembrar: o retorno do investimento não é garantido como o juro evitado ao quitar a dívida — essa diferença de risco importa na decisão, não só o número final.";

  return [intro, comparison, caveat].join(" ");
}

/** Explicação em texto para comprar à vista x parcelado. */
export function explainCashVsInstallments(result: CashVsInstallmentsResult): string {
  const favorsInstallments = result.recommendation === "installments";
  const intro = favorsInstallments
    ? `Parcelar sai mais vantajoso: o valor presente das parcelas (${formatBRL(result.presentValueOfInstallments)}) é menor que o preço à vista (${formatBRL(result.cashPrice)}), uma diferença de ${formatBRL(result.difference)} a favor de parcelar — considerando que o dinheiro renderia investido nesse meio-tempo.`
    : `Pagar à vista sai mais vantajoso: o preço com desconto (${formatBRL(result.cashPrice)}) é menor que o valor presente das parcelas (${formatBRL(result.presentValueOfInstallments)}), uma diferença de ${formatBRL(result.difference)} a favor de pagar à vista.`;

  const caveat =
    "Essa comparação assume que, ao parcelar, o dinheiro que sobra fica investido rendendo a taxa informada — se esse não for o seu caso na prática, o resultado pode não se aplicar.";

  return [intro, caveat].join(" ");
}

/** Explicação em texto para o custo real de um carro (ou comparação entre dois). */
export function explainCarCost(result: CarCostResult): string {
  const parts = [
    `O custo mensal real deste carro, somando parcela, combustível, custos fixos e depreciação, é de aproximadamente ${formatBRL(result.totalMonthlyCost)} — o equivalente a ${formatBRL(result.costPerKm)} por km rodado.`,
    `Em 5 anos, isso soma cerca de ${formatBRL(result.totalCostFiveYears)}, sem contar reajustes de preços ao longo do tempo.`,
    "A depreciação costuma ser o item mais subestimado nesse tipo de conta — vale revisar a taxa anual usada se ela não refletir bem o modelo do carro.",
  ];
  return parts.join(" ");
}

/** Explicação em texto para a comparação entre dois carros. */
export function explainCarComparison(result: CarComparisonResult): string {
  const cheaper = result.cheaperMonthly === "a" ? result.a : result.b;
  const pricier = result.cheaperMonthly === "a" ? result.b : result.a;
  const parts = [
    `"${cheaper.label}" tem o menor custo mensal real: ${formatBRL(cheaper.totalMonthlyCost)}, contra ${formatBRL(pricier.totalMonthlyCost)} de "${pricier.label}" — uma diferença de ${formatBRL(result.monthlyDifference)} por mês.`,
    `Em 5 anos, essa diferença mensal se acumula em aproximadamente ${formatBRL(result.monthlyDifference * 60)}.`,
  ];
  return parts.join(" ");
}
