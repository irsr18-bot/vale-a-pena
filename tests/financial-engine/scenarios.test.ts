import { describe, expect, it } from "vitest";
import { compareCarPurchaseScenarios } from "@/lib/financial-engine/scenarios";

describe("compareCarPurchaseScenarios", () => {
  const baseInput = {
    assetPrice: 100000,
    availableCash: 50000,
    monthlyIncome: 7000,
    financingAnnualRate: 0.18,
    termMonths: 48,
    investmentAnnualRate: 0.11,
  };

  it("retorna os três cenários do exemplo do brief", () => {
    const result = compareCarPurchaseScenarios(baseInput);
    expect(result.scenarios).toHaveLength(3);
    expect(result.scenarios.map((s) => s.id)).toEqual([
      "cash",
      "down_payment_finance",
      "invest_and_finance",
    ]);
  });

  it("cenário à vista não tem parcela nem juros", () => {
    const result = compareCarPurchaseScenarios(baseInput);
    const cash = result.scenarios.find((s) => s.id === "cash")!;
    expect(cash.installment).toBe(0);
    expect(cash.totalInterest).toBe(0);
    expect(cash.totalCost).toBe(baseInput.assetPrice);
  });

  it("comprometimento de renda é calculado sobre a renda informada", () => {
    const result = compareCarPurchaseScenarios(baseInput);
    const financed = result.scenarios.find((s) => s.id === "down_payment_finance")!;
    expect(financed.incomeCommitment).toBeCloseTo(financed.installment / baseInput.monthlyIncome, 4);
  });

  it("indica um cenário de menor custo total", () => {
    const result = compareCarPurchaseScenarios(baseInput);
    expect(["cash", "down_payment_finance", "invest_and_finance"]).toContain(
      result.recommendation.bestByTotalCost
    );
  });

  it("rejeita renda mensal inválida", () => {
    expect(() =>
      compareCarPurchaseScenarios({ ...baseInput, monthlyIncome: 0 })
    ).toThrow();
  });
});
