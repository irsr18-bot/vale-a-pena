import { calculateAmortizationSchedule } from "./loan";
import { calculateOpportunityCost, projectNetWorth } from "./investment";
import type { NetWorthProjection } from "./types";

export interface CarPurchaseInput {
  /** valor total do bem (ex: carro) */
  assetPrice: number;
  /** dinheiro disponível hoje */
  availableCash: number;
  /** renda mensal, usada para comprometimento de renda */
  monthlyIncome: number;
  /** taxa anual do financiamento */
  financingAnnualRate: number;
  termMonths: number;
  /** taxa anual que o dinheiro renderia se investido (ex: CDI) */
  investmentAnnualRate: number;
}

export interface ScenarioResult {
  id: "cash" | "down_payment_finance" | "invest_and_finance";
  label: string;
  downPayment: number;
  financedAmount: number;
  installment: number;
  totalInterest: number;
  totalCost: number;
  incomeCommitment: number; // parcela / renda mensal, 0 se não houver financiamento
  opportunityCost: number; // custo de não ter investido o dinheiro usado
  netWorthProjection: NetWorthProjection;
}

export interface CarPurchaseComparison {
  scenarios: ScenarioResult[];
  recommendation: {
    bestByTotalCost: ScenarioResult["id"];
    notes: string[];
  };
}

/**
 * Recria o exemplo do brief: comparar comprar à vista, dar entrada e
 * financiar o restante, ou investir o dinheiro disponível e financiar
 * o valor total do bem.
 */
export function compareCarPurchaseScenarios(
  input: CarPurchaseInput
): CarPurchaseComparison {
  if (input.assetPrice <= 0) throw new Error("assetPrice deve ser maior que zero");
  if (input.availableCash < 0) throw new Error("availableCash não pode ser negativo");
  if (input.monthlyIncome <= 0) throw new Error("monthlyIncome deve ser maior que zero");

  const cashCovers = Math.min(input.availableCash, input.assetPrice);

  // Cenário A — comprar à vista com o dinheiro disponível
  const remainingCashAfterA = input.availableCash - input.assetPrice;
  const scenarioA: ScenarioResult = {
    id: "cash",
    label: "Comprar à vista",
    downPayment: cashCovers,
    financedAmount: 0,
    installment: 0,
    totalInterest: 0,
    totalCost: input.assetPrice,
    incomeCommitment: 0,
    opportunityCost: 0, // usado o próprio patrimônio, sem financiamento a comparar
    netWorthProjection: projectNetWorth(Math.max(remainingCashAfterA, 0), input.investmentAnnualRate),
  };

  // Cenário B — dar o dinheiro disponível como entrada e financiar o restante
  const downPaymentB = Math.min(input.availableCash, input.assetPrice);
  const financedB = round2(input.assetPrice - downPaymentB);
  const loanB = calculateAmortizationSchedule({
    principal: financedB,
    annualInterestRate: input.financingAnnualRate,
    termMonths: input.termMonths,
  });
  const scenarioB: ScenarioResult = {
    id: "down_payment_finance",
    label: "Dar entrada e financiar o restante",
    downPayment: downPaymentB,
    financedAmount: financedB,
    installment: loanB.firstInstallment,
    totalInterest: loanB.totalInterest,
    totalCost: round2(downPaymentB + loanB.totalPaid),
    incomeCommitment: round4(loanB.firstInstallment / input.monthlyIncome),
    opportunityCost: calculateOpportunityCost({
      amount: downPaymentB,
      annualInterestRate: input.investmentAnnualRate,
      months: input.termMonths,
    }),
    netWorthProjection: projectNetWorth(0, input.investmentAnnualRate),
  };

  // Cenário C — investir o dinheiro disponível e financiar o valor total do bem
  const loanC = calculateAmortizationSchedule({
    principal: input.assetPrice,
    annualInterestRate: input.financingAnnualRate,
    termMonths: input.termMonths,
  });
  const scenarioC: ScenarioResult = {
    id: "invest_and_finance",
    label: "Investir o dinheiro e financiar o valor total",
    downPayment: 0,
    financedAmount: input.assetPrice,
    installment: loanC.firstInstallment,
    totalInterest: loanC.totalInterest,
    totalCost: loanC.totalPaid,
    incomeCommitment: round4(loanC.firstInstallment / input.monthlyIncome),
    opportunityCost: 0, // o próprio ponto do cenário é manter o dinheiro investido
    netWorthProjection: projectNetWorth(input.availableCash, input.investmentAnnualRate),
  };

  const scenarios = [scenarioA, scenarioB, scenarioC];
  const bestByTotalCost = scenarios.reduce((best, current) =>
    current.totalCost < best.totalCost ? current : best
  ).id;

  const notes: string[] = [
    `Parcela do cenário B: R$ ${scenarioB.installment.toFixed(2)} (${(scenarioB.incomeCommitment * 100).toFixed(1)}% da renda informada).`,
    `Parcela do cenário C: R$ ${scenarioC.installment.toFixed(2)} (${(scenarioC.incomeCommitment * 100).toFixed(1)}% da renda informada).`,
    "O cenário C só compensa se o retorno líquido do investimento superar o custo efetivo do financiamento.",
  ];

  return { scenarios, recommendation: { bestByTotalCost, notes } };
}

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
function round4(value: number): number {
  return Math.round((value + Number.EPSILON) * 10000) / 10000;
}
