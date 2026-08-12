"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { AmortizationRow } from "@/lib/financial-engine/types";
import { formatBRL } from "@/lib/format";

interface AmortizationChartProps {
  schedule: AmortizationRow[];
}

export function AmortizationChart({ schedule }: AmortizationChartProps) {
  const data = schedule.map((row) => ({
    month: row.month,
    "Saldo devedor": row.remainingBalance,
  }));

  return (
    <div className="rounded-card border border-line bg-paper-raised p-6 shadow-card">
      <h3 className="mb-4 font-display text-base font-semibold">
        Evolução do saldo devedor
      </h3>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data} margin={{ left: 0, right: 12, top: 8, bottom: 0 }}>
          <defs>
            <linearGradient id="balanceFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0F7A5C" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#0F7A5C" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E4E3DD" vertical={false} />
          <XAxis
            dataKey="month"
            tickFormatter={(m) => `${m}m`}
            stroke="#8A8D99"
            fontSize={12}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
            stroke="#8A8D99"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            formatter={(value: number) => formatBRL(value)}
            labelFormatter={(m) => `Mês ${m}`}
          />
          <Area
            type="monotone"
            dataKey="Saldo devedor"
            stroke="#0F7A5C"
            strokeWidth={2}
            fill="url(#balanceFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
