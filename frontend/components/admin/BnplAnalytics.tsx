"use client";

import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/lib/api";
import type { BnplAnalytics } from "@/types";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  LineChart, Line, ResponsiveContainer, Legend,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

export function BnplAnalyticsView() {
  const { data, isLoading } = useQuery<BnplAnalytics>({
    queryKey: ["admin", "bnpl"],
    queryFn: () => adminApi.getBnplAnalytics(),
  });

  if (isLoading) return (
    <div className="animate-pulse space-y-4">
      <div className="rounded-xl p-5 border glass h-40" style={{ borderColor: "var(--border)" }} />
      <div className="rounded-xl p-5 border glass h-64" style={{ borderColor: "var(--border)" }} />
    </div>
  );

  if (!data) return null;

  const trendData = data.trend.map((t) => ({
    date: new Date(t.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
    count: t.count,
  }));

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total BNPL Users", value: data.totalBnplUsers, color: "#f59e0b" },
          { label: "Heavy Dependents", value: data.heavyDependentCount, color: "#ef4444" },
          { label: "Avg BNPL Accounts", value: data.avgBnplAccountsPerUser.toFixed(1), color: "#6366f1" },
          { label: "BNPL/Total Ratio", value: `${(data.bnplToTotalDebtRatio * 100).toFixed(1)}%`, color: "#a855f7" },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-xl p-4 border glass" style={{ borderColor: "var(--border)" }}>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</p>
            <p className="text-2xl font-bold mt-1" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Trend chart */}
      <div className="rounded-xl p-5 border glass" style={{ borderColor: "var(--border)" }}>
        <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>BNPL User Trend</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={trendData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: "var(--text-muted)" }}
            />
            <Line type="monotone" dataKey="count" stroke="#f59e0b" strokeWidth={2} dot={{ fill: "#f59e0b", r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
