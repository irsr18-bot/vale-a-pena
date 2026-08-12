import { IntentInput } from "@/components/home/IntentInput";
import { CalculatorGrid } from "@/components/home/CalculatorGrid";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-6 pb-24">
      <section className="pt-16 pb-12 sm:pt-24 sm:pb-16">
        <p className="font-mono text-xs uppercase tracking-widest text-emerald">
          Decisão financeira, não achismo
        </p>
        <h1 className="mt-4 max-w-2xl font-display text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
          O que você está pensando em fazer?
        </h1>
        <p className="mt-4 max-w-xl text-ink-soft">
          Descreva a decisão em português simples. A gente identifica os
          números, roda o cálculo certo e mostra qual cenário realmente
          compensa — com as contas abertas.
        </p>
        <div className="mt-8 max-w-2xl">
          <IntentInput />
        </div>
      </section>

      <section className="py-8">
        <h2 className="font-display text-xl font-semibold">Ou escolha uma calculadora</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Cada uma compara os cenários possíveis lado a lado, com premissas
          transparentes.
        </p>
        <div className="mt-6">
          <CalculatorGrid />
        </div>
      </section>
    </div>
  );
}
