import { describe, expect, it } from "vitest";
import { calculateDebtPayoffVsInvest } from "@/lib/financial-engine/debtPayoff";

describe("calculateDebtPayoffVsInvest", () => {
  const baseInput = {
    outstandingBalance: 50000,
    loanAnnualInterestRate: 0.24, // dívida cara, ex: cheque especial/cartão
    remainingMonths: 24,
    availableAmount: 20000,
    investmentAnnualRate: 0.11,
  };

  it("recomenda quitar quando a taxa da dívida é muito maior que a do investimento", () => {
    const result = calculateDebtPayoffVsInvest(baseInput);
    expect(result.recommendation).toBe("payoff");
    expect(result.interestSaved).toBeGreaterThan(result.investmentGain);
  });

  it("recomenda investir quando a taxa de investimento supera a da dívida", () => {
    const result = calculateDebtPayoffVsInvest({
      ...baseInput,
      loanAnnualInterestRate: 0.03,
      investmentAnnualRate: 0.15,
    });
    expect(result.recommendation).toBe("invest");
  });

  it("limita o valor de quitação ao saldo devedor", () => {
    const result = calculateDebtPayoffVsInvest({ ...baseInput, availableAmount: 90000 });
    expect(result.payoffAmountUsed).toBe(baseInput.outstandingBalance);
  });

  it("rejeita saldo devedor inválido", () => {
    expect(() =>
      calculateDebtPayoffVsInvest({ ...baseInput, outstandingBalance: 0 })
    ).toThrow();
  });
});
