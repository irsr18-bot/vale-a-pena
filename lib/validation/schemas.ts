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
