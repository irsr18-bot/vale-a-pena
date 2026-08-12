import { annualToMonthlyRate } from "./loan";
import type {
  CompoundInterestInput,
  CompoundInterestResult,
  NetWorthProjection,
  OpportunityCostInput,
} from "./types";

/**
 * Calcula a evolução de um investimento com aporte mensal constante
 * e juros compostos, mês a mês.
 */
export function calculateCompoundInterest(
  input: CompoundInterestInput
): CompoundInterestResult {
  if (input.principal < 0) throw new Error("principal não pode ser negativo");
  if (input.months <= 0 || !Number.isInteger(input.months)) {
    throw new Error("months deve ser um inteiro positivo");
  }
  const monthlyContribution = input.monthlyContribution ?? 0;
  const i = annualToMonthlyRate(input.annualInterestRate);

  let balance = input.principal;
  let totalContributed = input.principal;
  const timeline: { month: number; balance: number }[] = [
    { month: 0, balance: round2(balance) },
  ];

  for (let month = 1; month <= input.months; month++) {
    balance = balance * (1 + i) + monthlyContribution;
    totalContributed += monthlyContribution;
    timeline.push({ month, balance: round2(balance) });
  }

  return {
    futureValue: round2(balance),
    totalContributed: round2(totalContributed),
    totalInterestEarned: round2(balance - totalContributed),
    timeline,
  };
}

/** Valor futuro de um valor único aplicado, sem aportes. */
export function calculateInvestmentFutureValue(
  principal: number,
  annualInterestRate: number,
  months: number
): number {
  return calculateCompoundInterest({ principal, annualInterestRate, months }).futureValue;
}

/**
 * Ajusta um retorno nominal pela inflação para obter o retorno real
 * aproximado (efeito de Fisher).
 * real = (1 + nominal) / (1 + inflação) - 1
 */
export function calculateRealReturn(
  nominalAnnualRate: number,
  inflationAnnualRate: number
): number {
  return round4((1 + nominalAnnualRate) / (1 + inflationAnnualRate) - 1);
}

/**
 * Custo de oportunidade: quanto um valor teria rendido se, em vez de
 * usado agora (ex: como entrada), tivesse sido investido pelo período.
 */
export function calculateOpportunityCost(input: OpportunityCostInput): number {
  const futureValue = calculateInvestmentFutureValue(
    input.amount,
    input.annualInterestRate,
    input.months
  );
  return round2(futureValue - input.amount);
}

/**
 * Projeta o valor futuro de um montante investido em 1, 3, 5 e 10 anos,
 * usado para comparar cenários lado a lado.
 */
export function projectNetWorth(
  principal: number,
  annualInterestRate: number,
  monthlyContribution = 0
): NetWorthProjection {
  const at = (years: number) =>
    calculateCompoundInterest({
      principal,
      monthlyContribution,
      annualInterestRate,
      months: years * 12,
    }).futureValue;

  return {
    year1: at(1),
    year3: at(3),
    year5: at(5),
    year10: at(10),
  };
}

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
function round4(value: number): number {
  return Math.round((value + Number.EPSILON) * 10000) / 10000;
}
