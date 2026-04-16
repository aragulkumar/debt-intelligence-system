"use client";

import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/lib/api";
import type { UserRisk } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { useState } from "react";

const RISK_COLORS: Record<string, string> = {
  low: "#10b981",
  medium: "#f59e0b",
  high: "#ef4444",
};

export function UserRiskTable() {
  const { data, isLoading } = useQuery<{ data: UserRisk[] }>({
    queryKey: ["admin", "risk-heatmap"],
    queryFn: () => adminApi.getRiskHeatmap(),
  });
  const [sortKey, setSortKey] = useState<keyof UserRisk>("riskScore");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const toggleSort = (key: keyof UserRisk) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("desc"); }
  };

  const rows = [...(data?.data ?? [])].sort((a, b) => {
    const diff = a[sortKey] > b[sortKey] ? 1 : -1;
    return sortDir === "asc" ? diff : -diff;
  });

  if (isLoading) return (
    <div className="animate-pulse rounded-xl p-5 border glass" style={{ borderColor: "var(--border)", height: 300 }} />
  );

  return (
    <div className="rounded-xl border glass overflow-hidden" style={{ borderColor: "var(--border)" }}>
      <div className="px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
        <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>User Risk Table</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: "var(--bg-elevated)", borderBottom: "1px solid var(--border)" }}>
              {[
                { key: "userId", label: "User ID" },
                { key: "riskScore", label: "Risk Score" },
                { key: "riskLabel", label: "Risk Level" },
                { key: "totalOutstanding", label: "Outstanding" },
                { key: "emiLoadPercent", label: "EMI Load" },
              ].map(({ key, label }) => (
                <th
                  key={key}
                  onClick={() => toggleSort(key as keyof UserRisk)}
                  className="px-4 py-3 text-left cursor-pointer select-none transition-colors"
                  style={{ color: sortKey === key ? "#6366f1" : "var(--text-muted)", fontWeight: 500 }}
                >
                  {label} {sortKey === key ? (sortDir === "asc" ? "↑" : "↓") : ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.userId} className="border-b transition-colors"
                style={{ borderColor: "var(--border)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-elevated)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <td className="px-4 py-3 font-mono text-xs" style={{ color: "var(--text-muted)" }}>
                  {row.userId.slice(0, 12)}…
                </td>
                <td className="px-4 py-3 font-bold" style={{ color: "var(--text-primary)" }}>
                  {(row.riskScore * 100).toFixed(0)}
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{ background: `${RISK_COLORS[row.riskLabel]}18`, color: RISK_COLORS[row.riskLabel] }}>
                    {row.riskLabel.toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-3" style={{ color: "var(--text-primary)" }}>
                  {formatCurrency(row.totalOutstanding, true)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg-hover)", minWidth: 60 }}>
                      <div className="h-full rounded-full" style={{ width: `${row.emiLoadPercent}%`, background: RISK_COLORS[row.riskLabel] }} />
                    </div>
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>{row.emiLoadPercent.toFixed(0)}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && (
          <p className="text-center py-8 text-sm" style={{ color: "var(--text-muted)" }}>No data available</p>
        )}
      </div>
    </div>
  );
}
