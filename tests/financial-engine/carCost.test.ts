import { describe, expect, it } from "vitest";
import { calculateCarMonthlyCost, compareCars } from "@/lib/financial-engine/carCost";

const baseCar = {
  vehiclePrice: 90000,
  downPayment: 30000,
  financingAnnualRate: 0.18,
  financingTermMonths: 48,
  kmPerMonth: 1200,
  consumptionKmPerLiter: 12,
  fuelPricePerLiter: 6,
  annualIpva: 2700,
  annualInsurance: 3600,
  annualMaintenance: 1800,
  monthlyParking: 250,
  monthlyToll: 100,
  annualDepreciationRate: 0.15,
};

describe("calculateCarMonthlyCost", () => {
  it("soma parcela, combustível, custos fixos e depreciação", () => {
    const result = calculateCarMonthlyCost(baseCar);
    const expectedTotal =
      result.monthlyInstallment +
      result.monthlyFuelCost +
      result.monthlyFixedCosts +
      result.monthlyDepreciation;
    expect(result.totalMonthlyCost).toBeCloseTo(expectedTotal, 1);
  });

  it("custo por km é o custo mensal dividido pela quilometragem", () => {
    const result = calculateCarMonthlyCost(baseCar);
    expect(result.costPerKm).toBeCloseTo(result.totalMonthlyCost / baseCar.kmPerMonth, 2);
  });

  it("carro pago à vista não tem parcela", () => {
    const result = calculateCarMonthlyCost({ ...baseCar, downPayment: baseCar.vehiclePrice });
    expect(result.monthlyInstallment).toBe(0);
  });

  it("rejeita consumo inválido quando há quilometragem", () => {
    expect(() =>
      calculateCarMonthlyCost({ ...baseCar, consumptionKmPerLiter: 0 })
    ).toThrow();
  });
});

describe("compareCars", () => {
  it("identifica qual carro tem menor custo mensal", () => {
    const cheaperCar = { ...baseCar, vehiclePrice: 60000, downPayment: 20000 };
    const result = compareCars(baseCar, cheaperCar);
    expect(result.cheaperMonthly).toBe("b");
    expect(result.monthlyDifference).toBeGreaterThan(0);
  });
});
