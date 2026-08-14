import { describe, expect, it } from "vitest";
import { calculateCashVsInstallments } from "@/lib/financial-engine/cashVsInstallments";

describe("calculateCashVsInstallments", () => {
  it("favorece parcelar quando as parcelas somadas cabem bem dentro do valor à vista com desconto pequeno", () => {
    const result = calculateCashVsInstallments({
      price: 10000,
      cashDiscountPercent: 0.02, // desconto pequeno à vista
      installmentsCount: 10,
      installmentValue: 1000, // sem juros no parcelamento
      investmentAnnualRate: 0.12, // dinheiro rende bem investido
    });
    expect(result.recommendation).toBe("installments");
  });

  it("favorece à vista quando o desconto é grande", () => {
    const result = calculateCashVsInstallments({
      price: 10000,
      cashDiscountPercent: 0.15, // desconto agressivo à vista
      installmentsCount: 10,
      installmentValue: 1000,
      investmentAnnualRate: 0.11,
    });
    expect(result.recommendation).toBe("cash");
  });

  it("calcula o preço à vista aplicando o desconto", () => {
    const result = calculateCashVsInstallments({
      price: 1000,
      cashDiscountPercent: 0.1,
      installmentsCount: 5,
      installmentValue: 210,
      investmentAnnualRate: 0.1,
    });
    expect(result.cashPrice).toBe(900);
  });

  it("rejeita número de parcelas inválido", () => {
    expect(() =>
      calculateCashVsInstallments({
        price: 1000,
        cashDiscountPercent: 0.1,
        installmentsCount: 0,
        installmentValue: 100,
        investmentAnnualRate: 0.1,
      })
    ).toThrow();
  });
});
