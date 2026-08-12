import type {
  AmortizationRow,
  AmortizationSystem,
  LoanInput,
  LoanResult,
} from "./types";

/**
 * Converte uma taxa efetiva anual em taxa efetiva mensal equivalente.
 * i_m = (1 + i_a)^(1/12) - 1
 */
export function annualToMonthlyRate(annualRate: number): number {
  if (annualRate < 0) throw new Error("annualInterestRate não pode ser negativa");
  return Math.pow(1 + annualRate, 1 / 12) - 1;
}

function validateLoanInput(input: LoanInput) {
  if (input.principal <= 0) throw new Error("principal deve ser maior que zero");
  if (input.termMonths <= 0 || !Number.isInteger(input.termMonths)) {
    throw new Error("termMonths deve ser um inteiro positivo");
  }
  if (input.annualInterestRate < 0) {
    throw new Error("annualInterestRate não pode ser negativa");
  }
  if (input.extraPayment !== undefined && input.extraPayment < 0) {
    throw new Error("extraPayment não pode ser negativo");
  }
}

/**
 * Calcula a parcela fixa do Sistema PRICE (parcelas constantes).
 * installment = P * i / (1 - (1 + i)^-n)
 * Caso a taxa seja 0, a parcela é simplesmente P / n.
 */
export function calculateLoanPayment(input: LoanInput): number {
  validateLoanInput(input);
  const i = annualToMonthlyRate(input.annualInterestRate);
  const n = input.termMonths;
  if (i === 0) return input.principal / n;
  const installment = (input.principal * i) / (1 - Math.pow(1 + i, -n));
  return round2(installment);
}

/**
 * Gera a tabela de amortização completa (PRICE ou SAC).
 * Se `extraPayment` for informado, ele é aplicado como amortização
 * extraordinária logo no início (mês 0), reduzindo o saldo devedor
 * antes de montar a tabela — isso antecipa a quitação mantendo a
 * parcela original (PRICE) ou reduz a amortização total (SAC).
 */
export function calculateAmortizationSchedule(input: LoanInput): LoanResult {
  validateLoanInput(input);
  const system: AmortizationSystem = input.system ?? "PRICE";
  const i = annualToMonthlyRate(input.annualInterestRate);
  const n = input.termMonths;
  const extra = input.extraPayment ?? 0;

  let balance = input.principal - extra;
  if (balance < 0) balance = 0;

  const schedule: AmortizationRow[] = [];
  let totalPaid = 0;
  let totalInterest = 0;

  if (system === "PRICE") {
    const installment =
      i === 0 ? input.principal / n : (input.principal * i) / (1 - Math.pow(1 + i, -n));

    for (let month = 1; month <= n && balance > 0.005; month++) {
      const interestPaid = balance * i;
      let principalPaid = installment - interestPaid;
      let paidInstallment = installment;

      if (principalPaid > balance) {
        // última parcela: ajusta para não pagar a mais
        principalPaid = balance;
        paidInstallment = principalPaid + interestPaid;
      }

      balance = round2(balance - principalPaid);
      totalPaid += paidInstallment;
      totalInterest += interestPaid;

      schedule.push({
        month,
        installment: round2(paidInstallment),
        interestPaid: round2(interestPaid),
        principalPaid: round2(principalPaid),
        extraPayment: month === 1 ? extra : 0,
        remainingBalance: round2(Math.max(balance, 0)),
      });
    }
  } else {
    // SAC: amortização constante, parcela decrescente
    const baseAmortization = input.principal / n; // amortização calculada sobre o principal original
    for (let month = 1; month <= n && balance > 0.005; month++) {
      const interestPaid = balance * i;
      const principalPaid = Math.min(baseAmortization, balance);
      const paidInstallment = principalPaid + interestPaid;

      balance = round2(balance - principalPaid);
      totalPaid += paidInstallment;
      totalInterest += interestPaid;

      schedule.push({
        month,
        installment: round2(paidInstallment),
        interestPaid: round2(interestPaid),
        principalPaid: round2(principalPaid),
        extraPayment: month === 1 ? extra : 0,
        remainingBalance: round2(Math.max(balance, 0)),
      });
    }
  }

  return {
    system,
    monthlyInterestRate: i,
    firstInstallment: schedule[0]?.installment ?? 0,
    totalPaid: round2(totalPaid + extra),
    totalInterest: round2(totalInterest),
    schedule,
    monthsToPayoff: schedule.length,
  };
}

/** Soma total de juros pagos ao longo do financiamento. */
export function calculateTotalInterest(input: LoanInput): number {
  return calculateAmortizationSchedule(input).totalInterest;
}

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
