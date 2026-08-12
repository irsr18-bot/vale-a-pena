import { z } from "zod";

/**
 * Ferramentas que a IA pode selecionar. Cada uma corresponde a uma
 * função determinística do financial-engine — a IA nunca calcula,
 * apenas escolhe e extrai parâmetros.
 */
export const toolNameSchema = z.enum([
  "car_purchase_comparison",
  "loan_financing",
  "unknown",
]);
export type ToolName = z.infer<typeof toolNameSchema>;

export const carPurchaseParamsSchema = z.object({
  assetPrice: z.number().positive(),
  availableCash: z.number().nonnegative(),
  monthlyIncome: z.number().positive(),
  financingAnnualRate: z.number().nonnegative().default(0.18),
  termMonths: z.number().int().positive().default(48),
  investmentAnnualRate: z.number().nonnegative().default(0.11),
});
export type CarPurchaseParams = z.infer<typeof carPurchaseParamsSchema>;

export const loanFinancingParamsSchema = z.object({
  principal: z.number().positive(),
  annualInterestRate: z.number().nonnegative().default(0.12),
  termMonths: z.number().int().positive().default(48),
});
export type LoanFinancingParams = z.infer<typeof loanFinancingParamsSchema>;

/**
 * Formato que uma resposta real de LLM (function calling / structured
 * output) deveria seguir. O mock em interpret.ts produz exatamente essa
 * forma, então trocar o mock por uma chamada de API não exige mudar o
 * restante da aplicação — só o conteúdo de interpret.ts.
 */
export interface AIInterpretation {
  tool: ToolName;
  params: Record<string, number>;
  confidence: number; // 0 a 1
  missingFields: string[]; // campos que a IA não conseguiu extrair do texto
}
