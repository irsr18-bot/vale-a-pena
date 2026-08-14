import { calculateLoanPayment } from "./loan";

export interface CarCostInput {
  label?: string;
  vehiclePrice: number;
  downPayment: number;
  financingAnnualRate: number;
  financingTermMonths: number;
  kmPerMonth: number;
  consumptionKmPerLiter: number;
  fuelPricePerLiter: number;
  annualIpva: number;
  annualInsurance: number;
  annualMaintenance: number;
  monthlyParking: number;
  monthlyToll: number;
  annualDepreciationRate: number; // ex: 0.15 = 15% ao ano
}

export interface CarCostResult {
  label: string;
  monthlyInstallment: number;
  monthlyFuelCost: number;
  monthlyFixedCosts: number;
  monthlyDepreciation: number;
  totalMonthlyCost: number;
  totalAnnualCost: number;
  costPerKm: number;
  totalCostFiveYears: number;
}

function validate(input: CarCostInput) {
  if (input.vehiclePrice <= 0) throw new Error("vehiclePrice deve ser maior que zero");
  if (input.downPayment < 0 || input.downPayment > input.vehiclePrice) {
    throw new Error("downPayment deve estar entre 0 e o valor do veículo");
  }
  if (input.kmPerMonth < 0) throw new Error("kmPerMonth não pode ser negativo");
  if (input.kmPerMonth > 0 && input.consumptionKmPerLiter <= 0) {
    throw new Error("consumptionKmPerLiter deve ser maior que zero quando há quilometragem");
  }
}

/** Quanto custa, por mês, ter e usar este carro — não só a parcela. */
export function calculateCarMonthlyCost(input: CarCostInput): CarCostResult {
  validate(input);

  const financedAmount = round2(input.vehiclePrice - input.downPayment);
  const monthlyInstallment =
    financedAmount > 0
      ? calculateLoanPayment({
          principal: financedAmount,
          annualInterestRate: input.financingAnnualRate,
          termMonths: input.financingTermMonths,
        })
      : 0;

  const monthlyFuelCost =
    input.consumptionKmPerLiter > 0
      ? round2((input.kmPerMonth / input.consumptionKmPerLiter) * input.fuelPricePerLiter)
      : 0;

  const monthlyFixedCosts = round2(
    input.annualIpva / 12 + input.annualInsurance / 12 + input.annualMaintenance / 12 + input.monthlyParking + input.monthlyToll
  );

  const monthlyDepreciation = round2((input.vehiclePrice * input.annualDepreciationRate) / 12);

  const totalMonthlyCost = round2(
    monthlyInstallment + monthlyFuelCost + monthlyFixedCosts + monthlyDepreciation
  );

  return {
    label: input.label ?? "Carro",
    monthlyInstallment: round2(monthlyInstallment),
    monthlyFuelCost,
    monthlyFixedCosts,
    monthlyDepreciation,
    totalMonthlyCost,
    totalAnnualCost: round2(totalMonthlyCost * 12),
    costPerKm: input.kmPerMonth > 0 ? round2(totalMonthlyCost / input.kmPerMonth) : 0,
    totalCostFiveYears: round2(totalMonthlyCost * 60),
  };
}

export interface CarComparisonResult {
  a: CarCostResult;
  b: CarCostResult;
  cheaperMonthly: "a" | "b";
  monthlyDifference: number;
}

/** Compara o custo mensal real de dois carros lado a lado. */
export function compareCars(carA: CarCostInput, carB: CarCostInput): CarComparisonResult {
  const a = calculateCarMonthlyCost({ ...carA, label: carA.label ?? "Carro A" });
  const b = calculateCarMonthlyCost({ ...carB, label: carB.label ?? "Carro B" });
  return {
    a,
    b,
    cheaperMonthly: a.totalMonthlyCost <= b.totalMonthlyCost ? "a" : "b",
    monthlyDifference: round2(Math.abs(a.totalMonthlyCost - b.totalMonthlyCost)),
  };
}

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
