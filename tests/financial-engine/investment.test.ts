import { describe, expect, it } from "vitest";
import {
  calculateCompoundInterest,
  calculateInvestmentFutureValue,
  calculateOpportunityCost,
  calculateRealReturn,
  projectNetWorth,
} from "@/lib/financial-engine/investment";

describe("calculateCompoundInterest", () => {
  it("cresce o saldo mês a mês com aporte constante", () => {
    const result = calculateCompoundInterest({
      principal: 1000,
      monthlyContribution: 100,
      annualInterestRate: 0.12,
      months: 12,
    });
    expect(result.timeline).toHaveLength(13); // mês 0 a 12
    expect(result.futureValue).toBeGreaterThan(result.totalContributed);
    expect(result.totalContributed).toBe(1000 + 100 * 12);
  });

  it("sem aporte, sem juros, valor futuro é igual ao principal", () => {
    const result = calculateCompoundInterest({
      principal: 5000,
      annualInterestRate: 0,
      months: 24,
    });
    expect(result.futureValue).toBe(5000);
  });
});

describe("calculateInvestmentFutureValue", () => {
  it("aplica juros compostos a um valor único", () => {
    const fv = calculateInvestmentFutureValue(10000, 0.10, 12);
    expect(fv).toBeCloseTo(11000, 0);
  });
});

describe("calculateRealReturn", () => {
  it("calcula o retorno real descontando a inflação (efeito Fisher)", () => {
    const real = calculateRealReturn(0.12, 0.04);
    expect(real).toBeCloseTo(0.0769, 3);
  });
});

describe("calculateOpportunityCost", () => {
  it("é positivo quando a taxa de investimento é maior que zero", () => {
    const cost = calculateOpportunityCost({
      amount: 20000,
      annualInterestRate: 0.10,
      months: 60,
    });
    expect(cost).toBeGreaterThan(0);
  });
});

describe("projectNetWorth", () => {
  it("retorna projeções crescentes para 1, 3, 5 e 10 anos", () => {
    const projection = projectNetWorth(10000, 0.10);
    expect(projection.year1).toBeLessThan(projection.year3);
    expect(projection.year3).toBeLessThan(projection.year5);
    expect(projection.year5).toBeLessThan(projection.year10);
  });
});
