"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { DEBT_COLORS, formatCurrency } from "@/lib/utils";
import type { DebtSummary } from "@/types";

interface DebtBreakdownChartProps {
  summary: DebtSummary | undefined;
  isLoading: boolean;
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number }> }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg px-3 py-2 border text-sm" style={{ background: "var(--bg-elevated)", borderColor: "var(--border)" }}>
        <p style={{ color: "var(--text-primary)" }}>{payload[0].name}</p>
        <p style={{ color: "var(--text-secondary)" }}>{formatCurrency(payload[0].value, true)}</p>
      </div>
    );
  }
  return null;
};

export function DebtBreakdownChart({ summary, isLoading }: DebtBreakdownChartProps) {
  if (isLoading) {
    return (
      <div className="rounded-xl p-5 border glass" style={{ borderColor: "var(--border)" }}>
        <div className="h-4 w-36 rounded mb-4 animate-pulse" style={{ background: "var(--bg-hover)" }} />
        <div className="h-48 rounded animate-pulse" style={{ background: "var(--bg-hover)" }} />
      </div>
    );
  }

  if (!summary) return null;

  const data = [
    { name: "BNPL", value: summary.debtsByType.BNPL, color: DEBT_COLORS.BNPL },
    { name: "EMI", value: summary.debtsByType.EMI, color: DEBT_COLORS.EMI },
    { name: "Credit Card", value: summary.debtsByType.CREDIT_CARD, color: DEBT_COLORS.CREDIT_CARD },
    { name: "Personal Loan", value: summary.debtsByType.PERSONAL_LOAN, color: DEBT_COLORS.PERSONAL_LOAN },
  ].filter((d) => d.value > 0);

  return (
    <div className="rounded-xl p-5 border glass" style={{ borderColor: "var(--border)" }}>
      <h2 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
        Debt Breakdown by Type
      </h2>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(value) => (
              <span style={{ color: "var(--text-secondary)", fontSize: 12 }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
