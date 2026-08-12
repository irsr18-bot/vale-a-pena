"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ScenarioResult } from "@/lib/financial-engine/scenarios";
import { formatBRL } from "@/lib/format";

interface ScenarioCostChartProps {
  scenarios: ScenarioResult[];
  bestId: ScenarioResult["id"];
}

export function ScenarioCostChart({ scenarios, bestId }: ScenarioCostChartProps) {
  const data = scenarios.map((s) => ({
    name: s.label,
    id: s.id,
    "Custo total": s.totalCost,
  }));

  return (
    <div className="rounded-card border border-line bg-paper-raised p-6 shadow-card">
      <h3 className="mb-4 font-display text-base font-semibold">
        Custo total por cenário
      </h3>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ left: 0, right: 12, top: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E4E3DD" vertical={false} />
          <XAxis dataKey="name" stroke="#8A8D99" fontSize={11} tickLine={false} />
          <YAxis
            tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
            stroke="#8A8D99"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip formatter={(value: number) => formatBRL(value)} />
          <Bar dataKey="Custo total" radius={[6, 6, 0, 0]}>
            {data.map((entry) => (
              <Cell key={entry.id} fill={entry.id === bestId ? "#0F7A5C" : "#C4B89A"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
