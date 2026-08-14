import type { AIInterpretation } from "./types";

/**
 * =========================================================================
 * MOCK — ponto de integração futura com um LLM real.
 * =========================================================================
 * Esta função hoje usa regras simples (regex/heurísticas) para simular o
 * que uma chamada de function-calling a um LLM faria: ler o texto livre
 * do usuário e devolver { tool, params, confidence, missingFields } no
 * formato definido em `AIInterpretation` (types.ts).
 *
 * Para conectar um provedor real (ex: Anthropic Messages API com tool use):
 *   1. Envie `userText` como mensagem do usuário.
 *   2. Declare as tools `car_purchase_comparison` e `loan_financing` com os
 *      schemas Zod de types.ts convertidos para JSON Schema.
 *   3. Pegue o `tool_use` retornado e devolva no mesmo formato deste mock.
 * O restante da aplicação (financial-engine, UI) não muda em nada.
 * =========================================================================
 */
export function interpretUserIntent(userText: string): AIInterpretation {
  const text = userText.toLowerCase();
  const numbers = extractCurrencyValues(text);

  const mentionsCar = /\bcarro\b|\bveículo\b|\bveiculo\b/.test(text);
  const mentionsFinancing = /financ/.test(text);
  const mentionsIncome = /ganho|renda|salário|salario/.test(text);

  if (mentionsCar && (mentionsFinancing || numbers.length >= 2)) {
    const [assetPrice, availableCash, monthlyIncome] = numbers;
    const missingFields: string[] = [];
    if (assetPrice === undefined) missingFields.push("assetPrice");
    if (availableCash === undefined) missingFields.push("availableCash");
    if (!mentionsIncome || monthlyIncome === undefined) missingFields.push("monthlyIncome");

    return {
      tool: "car_purchase_comparison",
      params: {
        assetPrice: assetPrice ?? 0,
        availableCash: availableCash ?? 0,
        monthlyIncome: monthlyIncome ?? 0,
      },
      confidence: missingFields.length === 0 ? 0.85 : 0.5,
      missingFields,
    };
  }

  if (mentionsFinancing && numbers.length >= 1) {
    return {
      tool: "loan_financing",
      params: {
        principal: numbers[0] ?? 0,
      },
      confidence: 0.6,
      missingFields: numbers.length < 1 ? ["principal"] : [],
    };
  }

  return {
    tool: "unknown",
    params: {},
    confidence: 0,
    missingFields: [],
  };
}

/**
 * Extrai valores monetários de um texto em português, aceitando formatos
 * como "R$ 80.000", "80 mil", "80000" e "7 mil por mês".
 */
function extractCurrencyValues(text: string): number[] {
  const values: number[] = [];

  const currencyRegex = /r\$\s?([\d.,]+)\s*(mil|milhão|milhões)?/g;
  const bareMilRegex = /(\d+(?:[.,]\d+)?)\s*(mil|milhão|milhões)/g;

  let match: RegExpExecArray | null;

  while ((match = currencyRegex.exec(text)) !== null) {
    const rawNumber = match[1];
    if (!rawNumber) continue;
    values.push(parseAmount(rawNumber, match[2]));
  }

  while ((match = bareMilRegex.exec(text)) !== null) {
    const rawNumber = match[1];
    if (!rawNumber) continue;
    const parsed = parseAmount(rawNumber, match[2]);
    const alreadyCaptured = values.some((v) => v === parsed);
    if (!alreadyCaptured) values.push(parsed);
  }

  return values;
}

function parseAmount(rawNumber: string, unit?: string): number {
  const normalized = rawNumber.replace(/\./g, "").replace(",", ".");
  let value = parseFloat(normalized);
  if (Number.isNaN(value)) return 0;
  if (unit === "mil") value *= 1_000;
  if (unit === "milhão" || unit === "milhões") value *= 1_000_000;
  return value;
}
