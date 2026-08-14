import { z } from "zod";

export const loanFormSchema = z.object({
  principal: z.number().positive("Informe um valor financiado maior que zero"),
  annualInterestRate: z
    .number()
    .min(0, "A taxa não pode ser negativa")
    .max(1, "Informe a taxa como decimal, ex: 0.12 para 12% a.a."),
  termMonths: z
    .number()
    .int("O prazo deve ser um número inteiro de meses")
    .positive("O prazo deve ser maior que zero"),
  system: z.enum(["PRICE", "SAC"]),
});
export type LoanFormValues = z.infer<typeof loanFormSchema>;

export const carPurchaseFormSchema = z.object({
  assetPrice: z.number().positive("Informe o valor do veículo"),
  availableCash: z.number().nonnegative("Informe quanto dinheiro está disponível"),
  monthlyIncome: z.number().positive("Informe sua renda mensal"),
  financingAnnualRate: z.number().min(0).max(1),
  termMonths: z.number().int().positive(),
  investmentAnnualRate: z.number().min(0).max(1),
});
export type CarPurchaseFormValues = z.infer<typeof carPurchaseFormSchema>;

export const rentVsBuyFormSchema = z.object({
  propertyPrice: z.number().positive(),
  downPayment: z.number().nonnegative(),
  financingAnnualRate: z.number().min(0).max(1),
  financingTermMonths: z.number().int().positive(),
  purchaseCosts: z.number().nonnegative(),
  currentRent: z.number().positive(),
  annualRentAdjustment: z.number().min(0).max(1),
  annualPropertyAppreciation: z.number().min(-0.5).max(1),
  investmentAnnualRate: z.number().min(0).max(1),
  monthlyCondoFee: z.number().nonnegative(),
  annualIptu: z.number().nonnegative(),
  annualInsurance: z.number().nonnegative(),
  annualMaintenance: z.number().nonnegative(),
});
export type RentVsBuyFormValues = z.infer<typeof rentVsBuyFormSchema>;

export const debtPayoffFormSchema = z.object({
  outstandingBalance: z.number().positive(),
  loanAnnualInterestRate: z.number().min(0).max(3),
  remainingMonths: z.number().int().positive(),
  availableAmount: z.number().positive(),
  investmentAnnualRate: z.number().min(0).max(1),
});
export type DebtPayoffFormValues = z.infer<typeof debtPayoffFormSchema>;

export const cashVsInstallmentsFormSchema = z.object({
  price: z.number().positive(),
  cashDiscountPercent: z.number().min(0).max(1),
  installmentsCount: z.number().int().positive(),
  installmentValue: z.number().positive(),
  investmentAnnualRate: z.number().min(0).max(1),
});
export type CashVsInstallmentsFormValues = z.infer<typeof cashVsInstallmentsFormSchema>;

export const carCostFormSchema = z.object({
  vehiclePrice: z.number().positive(),
  downPayment: z.number().nonnegative(),
  financingAnnualRate: z.number().min(0).max(1),
  financingTermMonths: z.number().int().positive(),
  kmPerMonth: z.number().nonnegative(),
  consumptionKmPerLiter: z.number().positive(),
  fuelPricePerLiter: z.number().positive(),
  annualIpva: z.number().nonnegative(),
  annualInsurance: z.number().nonnegative(),
  annualMaintenance: z.number().nonnegative(),
  monthlyParking: z.number().nonnegative(),
  monthlyToll: z.number().nonnegative(),
  annualDepreciationRate: z.number().min(0).max(1),
});
export type CarCostFormValues = z.infer<typeof carCostFormSchema>;
