import { annualToMonthlyRate, calculateAmortizationSchedule } from "./loan";

export interface RentVsBuyInput {
  propertyPrice: number;
  downPayment: number;
  financingAnnualRate: number;
  financingTermMonths: number;
  purchaseCosts: number; // ITBI, cartório, etc. — pago uma vez, na compra
  currentRent: number;
  annualRentAdjustment: number; // ex: 0.05 = 5% a.a.
  annualPropertyAppreciation: number;
  investmentAnnualRate: number; // retorno que o dinheiro renderia se investido
  monthlyCondoFee: number;
  annualIptu: number;
  annualInsurance: number;
  annualMaintenance: number;
}

export interface RentVsBuyYearPoint {
  year: number;
  buyNetWorth: number;
  rentNetWorth: number;
}

export interface RentVsBuyResult {
  timeline: RentVsBuyYearPoint[]; // anos 5, 10, 15, 20, 30
  buyMonthlyCost: number; // custo de posse no mês 1 (parcela + encargos)
  rentMonthlyCost: number; // aluguel informado
  favoredScenarioAtYear30: "buy" | "rent";
}

const HORIZON_YEARS = [5, 10, 15, 20, 30];

function validate(input: RentVsBuyInput) {
  if (input.propertyPrice <= 0) throw new Error("propertyPrice deve ser maior que zero");
  if (input.downPayment < 0 || input.downPayment > input.propertyPrice) {
    throw new Error("downPayment deve estar entre 0 e o valor do imóvel");
  }
  if (input.currentRent <= 0) throw new Error("currentRent deve ser maior que zero");
  if (input.financingTermMonths <= 0) throw new Error("financingTermMonths deve ser maior que zero");
}

/**
 * Simula, mês a mês, dois caminhos ao longo de 30 anos:
 *  - Comprar: dá a entrada, financia o restante, paga condomínio/IPTU/
 *    seguro/manutenção, e o imóvel se valoriza com o tempo. Patrimônio =
 *    valor do imóvel projetado - saldo devedor.
 *  - Alugar: investe a entrada + custos de compra que não gastou, paga
 *    aluguel (reajustado anualmente), e investe a diferença mensal entre
 *    o custo de possuir o imóvel e o aluguel (pode ser negativa).
 */
export function calculateRentVsBuy(input: RentVsBuyInput): RentVsBuyResult {
  validate(input);

  const loanPrincipal = round2(input.propertyPrice - input.downPayment);
  const loan =
    loanPrincipal > 0
      ? calculateAmortizationSchedule({
          principal: loanPrincipal,
          annualInterestRate: input.financingAnnualRate,
          termMonths: input.financingTermMonths,
        })
      : null;

  const monthlyPropertyGrowth = annualToMonthlyRate(input.annualPropertyAppreciation);
  const monthlyInvestmentGrowth = annualToMonthlyRate(input.investmentAnnualRate);
  const monthlyOwnershipExtras =
    input.monthlyCondoFee + input.annualIptu / 12 + input.annualInsurance / 12 + input.annualMaintenance / 12;

  let propertyValue = input.propertyPrice;
  let rentAmount = input.currentRent;
  let rentBalance = input.downPayment + input.purchaseCosts;

  const maxMonths = Math.max(...HORIZON_YEARS) * 12;
  const timeline: RentVsBuyYearPoint[] = [];
  let firstBuyMonthlyCost = 0;

  for (let month = 1; month <= maxMonths; month++) {
    propertyValue *= 1 + monthlyPropertyGrowth;

    if (month > 1 && (month - 1) % 12 === 0) {
      rentAmount *= 1 + input.annualRentAdjustment;
    }

    const row = loan?.schedule[month - 1];
    const installment = row?.installment ?? 0;
    const loanBalance = row?.remainingBalance ?? 0;

    const buyMonthlyCost = installment + monthlyOwnershipExtras;
    if (month === 1) firstBuyMonthlyCost = buyMonthlyCost;

    const diff = buyMonthlyCost - rentAmount;
    rentBalance = rentBalance * (1 + monthlyInvestmentGrowth) + diff;

    if (HORIZON_YEARS.includes(month / 12)) {
      timeline.push({
        year: month / 12,
        buyNetWorth: round2(propertyValue - loanBalance),
        rentNetWorth: round2(rentBalance),
      });
    }
  }

  const last = timeline[timeline.length - 1]!;

  return {
    timeline,
    buyMonthlyCost: round2(firstBuyMonthlyCost),
    rentMonthlyCost: round2(input.currentRent),
    favoredScenarioAtYear30: last.buyNetWorth >= last.rentNetWorth ? "buy" : "rent",
  };
}

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
