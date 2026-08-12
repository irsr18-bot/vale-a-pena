import { describe, expect, it } from "vitest";
import {
  annualToMonthlyRate,
  calculateAmortizationSchedule,
  calculateLoanPayment,
} from "@/lib/financial-engine/loan";

describe("annualToMonthlyRate", () => {
  it("converte 10% a.a. para a taxa mensal equivalente", () => {
    const monthly = annualToMonthlyRate(0.10);
    expect(monthly).toBeCloseTo(0.007974, 5);
  });

  it("lança erro para taxa negativa", () => {
    expect(() => annualToMonthlyRate(-0.1)).toThrow();
  });
});

describe("calculateLoanPayment (PRICE)", () => {
  it("calcula a parcela de um financiamento simples", () => {
    // R$ 100.000, 10% a.a., 60 meses
    const installment = calculateLoanPayment({
      principal: 100000,
      annualInterestRate: 0.10,
      termMonths: 60,
    });
    // valor de referência calculado pela fórmula PRICE padrão
    expect(installment).toBeCloseTo(2119.16, 1);
  });

  it("com taxa 0, parcela é principal dividido pelo prazo", () => {
    const installment = calculateLoanPayment({
      principal: 12000,
      annualInterestRate: 0,
      termMonths: 12,
    });
    expect(installment).toBe(1000);
  });

  it("rejeita principal inválido", () => {
    expect(() =>
      calculateLoanPayment({ principal: 0, annualInterestRate: 0.1, termMonths: 12 })
    ).toThrow();
  });
});

describe("calculateAmortizationSchedule", () => {
  it("PRICE: saldo devedor chega a zero ao final do prazo", () => {
    const result = calculateAmortizationSchedule({
      principal: 50000,
      annualInterestRate: 0.12,
      termMonths: 24,
    });
    expect(result.schedule).toHaveLength(24);
    const last = result.schedule[result.schedule.length - 1];
    expect(last?.remainingBalance).toBe(0);
    expect(result.totalInterest).toBeGreaterThan(0);
  });

  it("SAC: amortização constante e parcelas decrescentes", () => {
    const result = calculateAmortizationSchedule({
      principal: 12000,
      annualInterestRate: 0.12,
      termMonths: 12,
      system: "SAC",
    });
    const first = result.schedule[0]!;
    const last = result.schedule[result.schedule.length - 1]!;
    expect(first.principalPaid).toBeCloseTo(last.principalPaid, 2);
    expect(first.installment).toBeGreaterThan(last.installment);
  });

  it("amortização extra reduz o total de juros pagos", () => {
    const withoutExtra = calculateAmortizationSchedule({
      principal: 100000,
      annualInterestRate: 0.10,
      termMonths: 60,
    });
    const withExtra = calculateAmortizationSchedule({
      principal: 100000,
      annualInterestRate: 0.10,
      termMonths: 60,
      extraPayment: 20000,
    });
    expect(withExtra.totalInterest).toBeLessThan(withoutExtra.totalInterest);
    expect(withExtra.monthsToPayoff).toBeLessThanOrEqual(withoutExtra.monthsToPayoff);
  });
});
