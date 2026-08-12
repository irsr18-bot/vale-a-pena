/**
 * Tipos do motor financeiro.
 * Nada aqui depende de IA, rede ou UI — apenas matemática financeira pura.
 */

export type AmortizationSystem = "PRICE" | "SAC";

export interface AmortizationRow {
  month: number;
  installment: number;
  interestPaid: number;
  principalPaid: number;
  extraPayment: number;
  remainingBalance: number;
}

export interface LoanInput {
  principal: number; // valor financiado
  annualInterestRate: number; // taxa efetiva anual, ex: 0.10 = 10% a.a.
  termMonths: number;
  system?: AmortizationSystem; // default: "PRICE"
  extraPayment?: number; // amortização extraordinária opcional (mês 1)
}

export interface LoanResult {
  system: AmortizationSystem;
  monthlyInterestRate: number;
  firstInstallment: number;
  totalPaid: number;
  totalInterest: number;
  schedule: AmortizationRow[];
  monthsToPayoff: number; // pode ser < termMonths se houver amortização extra
}

export interface CompoundInterestInput {
  principal: number;
  monthlyContribution?: number;
  annualInterestRate: number;
  months: number;
}

export interface CompoundInterestResult {
  futureValue: number;
  totalContributed: number;
  totalInterestEarned: number;
  timeline: { month: number; balance: number }[];
}

export interface OpportunityCostInput {
  amount: number;
  annualInterestRate: number; // taxa que o dinheiro renderia se investido
  months: number;
}

export interface NetWorthProjection {
  year1: number;
  year3: number;
  year5: number;
  year10: number;
}
