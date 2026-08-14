import { describe, expect, it } from "vitest";
import { calculateRentVsBuy } from "@/lib/financial-engine/rentVsBuy";

const baseInput = {
  propertyPrice: 500000,
  downPayment: 100000,
  financingAnnualRate: 0.11,
  financingTermMonths: 360,
  purchaseCosts: 15000,
  currentRent: 2200,
  annualRentAdjustment: 0.05,
  annualPropertyAppreciation: 0.04,
  investmentAnnualRate: 0.11,
  monthlyCondoFee: 600,
  annualIptu: 2400,
  annualInsurance: 600,
  annualMaintenance: 3000,
};

describe("calculateRentVsBuy", () => {
  it("retorna pontos para os anos 5, 10, 15, 20 e 30", () => {
    const result = calculateRentVsBuy(baseInput);
    expect(result.timeline.map((p) => p.year)).toEqual([5, 10, 15, 20, 30]);
  });

  it("patrimônio de comprar cresce com o tempo quando o imóvel se valoriza", () => {
    const result = calculateRentVsBuy(baseInput);
    const year5 = result.timeline.find((p) => p.year === 5)!;
    const year30 = result.timeline.find((p) => p.year === 30)!;
    expect(year30.buyNetWorth).toBeGreaterThan(year5.buyNetWorth);
  });

  it("aluguel muito mais barato que o custo de posse favorece alugar+investir", () => {
    const result = calculateRentVsBuy({
      ...baseInput,
      currentRent: 800,
      annualRentAdjustment: 0.02,
      investmentAnnualRate: 0.15,
    });
    const year30 = result.timeline.find((p) => p.year === 30)!;
    expect(year30.rentNetWorth).toBeGreaterThan(0);
  });

  it("rejeita entrada maior que o valor do imóvel", () => {
    expect(() =>
      calculateRentVsBuy({ ...baseInput, downPayment: 600000 })
    ).toThrow();
  });

  it("rejeita aluguel inválido", () => {
    expect(() => calculateRentVsBuy({ ...baseInput, currentRent: 0 })).toThrow();
  });
});
