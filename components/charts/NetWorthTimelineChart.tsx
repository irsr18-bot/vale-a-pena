"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { RentVsBuyYearPoint } from "@/lib/financial-engine/rentVsBuy";
import { formatBRL } from "@/lib/format";

interface NetWorthTimelineChartProps {
  timeline: RentVsBuyYearPoint[];
}

export function NetWorthTimelineChart({ timeline }: NetWorthTimelineChartProps) {
  const data = timeline.map((p) => ({
    year: `${p.year}a`,
    Comprar: p.buyNetWorth,
    "Alugar + investir": p.rentNetWorth,
  }));

  return (
    <div className="rounded-card border border-line bg-paper-raised p-6 shadow-card">
      <h3 className="mb-4 font-display text-base font-semibold">
        Patrimônio projetado ao longo do tempo
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ left: 0, right: 12, top: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E4E3DD" vertical={false} />
          <XAxis dataKey="year" stroke="#8A8D99" fontSize={12} tickLine={false} />
          <YAxis
            tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
            stroke="#8A8D99"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip formatter={(value: number) => formatBRL(value)} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Line type="monotone" dataKey="Comprar" stroke="#0F7A5C" strokeWidth={2.5} dot={{ r: 3 }} />
          <Line
            type="monotone"
            dataKey="Alugar + investir"
            stroke="#C98A1F"
            strokeWidth={2.5}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
