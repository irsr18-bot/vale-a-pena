"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { interpretUserIntent } from "@/lib/ai/interpret";

export function IntentInput() {
  const router = useRouter();
  const [text, setText] = useState("");

  function handleAnalyze() {
    if (!text.trim()) return;
    const interpretation = interpretUserIntent(text);

    if (interpretation.tool === "car_purchase_comparison") {
      const p = interpretation.params;
      const params = new URLSearchParams({
        mode: "car",
        assetPrice: String(p.assetPrice ?? 0),
        availableCash: String(p.availableCash ?? 0),
        monthlyIncome: String(p.monthlyIncome ?? 0),
      });
      router.push(`/financiamento?${params.toString()}`);
      return;
    }

    if (interpretation.tool === "loan_financing") {
      const params = new URLSearchParams({
        mode: "loan",
        principal: String(interpretation.params.principal ?? 0),
      });
      router.push(`/financiamento?${params.toString()}`);
      return;
    }

    // Não conseguiu identificar uma ferramenta — manda para a calculadora
    // genérica de financiamento, onde o usuário preenche manualmente.
    router.push("/financiamento");
  }

  return (
    <div className="rounded-card border border-line bg-paper-raised p-2 shadow-card">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ex: Estou pensando em financiar um carro de R$ 80.000, tenho R$ 20 mil de entrada e ganho 7 mil por mês..."
        rows={3}
        className="w-full resize-none rounded-card bg-transparent p-4 text-base outline-none placeholder:text-ink-faint"
      />
      <div className="flex justify-end p-2">
        <button
          onClick={handleAnalyze}
          className="rounded-card bg-emerald px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          Analisar
        </button>
      </div>
    </div>
  );
}
