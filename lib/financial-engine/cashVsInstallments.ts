import { annualToMonthlyRate } from "./loan";

export interface CashVsInstallmentsInput {
  price: number; // preço "cheio" / de tabela
  cashDiscountPercent: number; // desconto pagando à vista, ex: 0.05 = 5%
  installmentsCount: number;
  installmentValue: number; // valor de cada parcela
  investmentAnnualRate: number; // taxa que o dinheiro renderia se investido
}

export interface CashVsInstallmentsResult {
  cashPrice: number;
  totalInstallmentsPaid: number;
  presentValueOfInstallments: number;
  recommendation: "cash" | "installments";
  difference: number;
}

function validate(input: CashVsInstallmentsInput) {
  if (input.price <= 0) throw new Error("price deve ser maior que zero");
  if (input.installmentsCount <= 0) throw new Error("installmentsCount deve ser maior que zero");
  if (input.installmentValue <= 0) throw new Error("installmentValue deve ser maior que zero");
  if (input.cashDiscountPercent < 0 || input.cashDiscountPercent > 1) {
    throw new Error("cashDiscountPercent deve estar entre 0 e 1");
  }
}

/**
 * Compara pagar à vista (com desconto) x parcelado, trazendo o fluxo de
 * parcelas a valor presente, descontado pela taxa que o dinheiro renderia
 * se ficasse investido. Se o valor presente das parcelas for menor que o
 * preço à vista, parcelar é financeiramente mais vantajoso (o dinheiro
 * rende mais investido do que o desconto à vista compensa) — e vice-versa.
 */
export function calculateCashVsInstallments(
  input: CashVsInstallmentsInput
): CashVsInstallmentsResult {
  validate(input);

  const cashPrice = round2(input.price * (1 - input.cashDiscountPercent));
  const totalInstallmentsPaid = round2(input.installmentValue * input.installmentsCount);

  const i = annualToMonthlyRate(input.investmentAnnualRate);
  let presentValue = 0;
  for (let k = 1; k <= input.installmentsCount; k++) {
    presentValue += input.installmentValue / Math.pow(1 + i, k);
  }
  presentValue = round2(presentValue);

  return {
    cashPrice,
    totalInstallmentsPaid,
    presentValueOfInstallments: presentValue,
    recommendation: presentValue < cashPrice ? "installments" : "cash",
    difference: round2(Math.abs(cashPrice - presentValue)),
  };
}

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
