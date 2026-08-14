import { calculateAmortizationSchedule } from "./loan";
import { calculateInvestmentFutureValue } from "./investment";

export interface DebtPayoffInput {
  outstandingBalance: number;
  loanAnnualInterestRate: number;
  remainingMonths: number;
  availableAmount: number; // dinheiro disponível para quitar (total ou parcial) ou investir
  investmentAnnualRate: number;
}

export interface DebtPayoffResult {
  interestWithoutPayoff: number;
  interestWithPayoff: number;
  interestSaved: number; // ganho garantido ao quitar (juros que deixam de ser pagos)
  investmentFutureValue: number;
  investmentGain: number; // ganho esperado ao investir em vez de quitar
  recommendation: "payoff" | "invest";
  payoffAmountUsed: number;
}

function validate(input: DebtPayoffInput) {
  if (input.outstandingBalance <= 0) throw new Error("outstandingBalance deve ser maior que zero");
  if (input.remainingMonths <= 0) throw new Error("remainingMonths deve ser maior que zero");
  if (input.availableAmount <= 0) throw new Error("availableAmount deve ser maior que zero");
}

/**
 * Compara dois caminhos para um dinheiro disponível: quitar (parcial ou
 * totalmente) uma dívida existente, ou investir esse valor pelo mesmo
 * período. A comparação é feita entre um ganho GARANTIDO (juros evitados
 * ao quitar) e um ganho ESPERADO (retorno do investimento, sujeito a
 * variação de mercado).
 */
export function calculateDebtPayoffVsInvest(input: DebtPayoffInput): DebtPayoffResult {
  validate(input);

  const payoffAmountUsed = Math.min(input.availableAmount, input.outstandingBalance);

  const withoutPayoff = calculateAmortizationSchedule({
    principal: input.outstandingBalance,
    annualInterestRate: input.loanAnnualInterestRate,
    termMonths: input.remainingMonths,
  });

  const withPayoff = calculateAmortizationSchedule({
    principal: input.outstandingBalance,
    annualInterestRate: input.loanAnnualInterestRate,
    termMonths: input.remainingMonths,
    extraPayment: payoffAmountUsed,
  });

  const interestSaved = round2(withoutPayoff.totalInterest - withPayoff.totalInterest);

  const investmentFutureValue = calculateInvestmentFutureValue(
    input.availableAmount,
    input.investmentAnnualRate,
    input.remainingMonths
  );
  const investmentGain = round2(investmentFutureValue - input.availableAmount);

  return {
    interestWithoutPayoff: withoutPayoff.totalInterest,
    interestWithPayoff: withPayoff.totalInterest,
    interestSaved,
    investmentFutureValue,
    investmentGain,
    recommendation: interestSaved >= investmentGain ? "payoff" : "invest",
    payoffAmountUsed,
  };
}

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
