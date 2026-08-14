import Link from "next/link";

interface CalculatorCard {
  title: string;
  description: string;
  href?: string;
}

const calculators: CalculatorCard[] = [
  {
    title: "Financiar ou continuar alugando?",
    description: "Compare comprar um imóvel financiado com continuar alugando e investir a diferença.",
    href: "/comprar-ou-alugar",
  },
  {
    title: "Comprar carro: à vista, financiar ou investir?",
    description: "Veja qual opção tem menor custo total considerando sua renda e o que você tem disponível.",
    href: "/financiamento?mode=car",
  },
  {
    title: "Financiamento (PRICE ou SAC)",
    description: "Simule parcelas, juros totais e a tabela de amortização completa.",
    href: "/financiamento?mode=loan",
  },
  {
    title: "Quitar empréstimo ou investir?",
    description: "Descubra se vale mais a pena antecipar uma dívida ou aplicar o dinheiro.",
  },
  {
    title: "Comprar à vista ou parcelado?",
    description: "Compare o custo de pagar tudo agora com parcelar e investir o restante.",
  },
  {
    title: "Custo real de um carro",
    description: "Combustível, IPVA, seguro, manutenção e depreciação — o que o carro custa por mês.",
  },
];

export function CalculatorGrid() {
  return (
    <div id="calculadoras" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {calculators.map((calc) => {
        const content = (
          <div
            className={`h-full rounded-card border border-line bg-paper-raised p-6 transition-colors ${
              calc.href ? "hover:border-emerald" : "opacity-60"
            }`}
          >
            <h3 className="font-display text-base font-semibold">{calc.title}</h3>
            <p className="mt-2 text-sm text-ink-soft">{calc.description}</p>
            {!calc.href && (
              <span className="mt-4 inline-block rounded-full bg-amber-soft px-2.5 py-1 text-[11px] font-medium text-amber">
                Em breve
              </span>
            )}
          </div>
        );

        return calc.href ? (
          <Link key={calc.title} href={calc.href}>
            {content}
          </Link>
        ) : (
          <div key={calc.title}>{content}</div>
        );
      })}
    </div>
  );
}
