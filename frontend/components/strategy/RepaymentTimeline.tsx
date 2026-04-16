"use client";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { formatCurrency } from "@/lib/utils";
import type { RepaymentPlan } from "@/types";

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; fill: string }>; label?: string }) => {
  if (active && payload?.length) {
    return (
      <div className="rounded-lg p-3 border text-xs space-y-1" style={{ background: "var(--bg-elevated)", borderColor: "var(--border)" }}>
        <p className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Month {label}</p>
        {payload.map((p) => (
          <p key={p.name} style={{ color: p.fill }}>
            {p.name}: {formatCurrency(p.value, true)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function RepaymentTimeline({ plan }: { plan: RepaymentPlan | undefined }) {
  if (!plan) return null;

  // Build chart data — aggregate payments per month
  const chartData = plan.plan.slice(0, 24).map((month) => {
    const entry: Record<string, number | string> = { month: month.month };
    month.payments.forEach((p) => {
      entry[p.debtName] = p.amount;
    });
    return entry;
  });

  const debtNames = plan.plan[0]?.payments.map((p) => p.debtName) ?? [];
  const COLORS = ["#6366f1", "#a855f7", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

  return (
    <div className="rounded-xl p-5 border glass" style={{ borderColor: "var(--border)" }}>
      <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
        <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          Repayment Timeline
        </h2>
        <div className="flex gap-4 text-xs flex-wrap">
          <div>
            <p style={{ color: "var(--text-muted)" }}>Total Interest</p>
            <p className="font-bold" style={{ color: "#ef4444" }}>
              {formatCurrency(plan.totalInterestPaid, true)}
            </p>
          </div>
          <div>
            <p style={{ color: "var(--text-muted)" }}>Debt-Free In</p>
            <p className="font-bold" style={{ color: "#10b981" }}>
              {plan.monthsToFreedom} months
            </p>
          </div>
          <div>
            <p style={{ color: "var(--text-muted)" }}>Debt-Free Date</p>
            <p className="font-bold" style={{ color: "var(--text-primary)" }}>
              {new Date(plan.debtFreeDate).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
            </p>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={chartData} margin={{ top: 4, right: 0, left: -24, bottom: 0 }} barSize={8}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 10, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(v) => <span style={{ color: "var(--text-secondary)", fontSize: 11 }}>{v}</span>}
          />
          {debtNames.map((name, i) => (
            <Bar key={name} dataKey={name} stackId="a" fill={COLORS[i % COLORS.length]} radius={i === debtNames.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
