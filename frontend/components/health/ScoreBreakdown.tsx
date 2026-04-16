"use client";

import type { HealthScore } from "@/types";

const CATEGORIES = [
  { key: "paymentBehaviour", label: "Payment Behaviour", color: "#6366f1" },
  { key: "utilisation", label: "Credit Utilisation", color: "#a855f7" },
  { key: "debtLoad", label: "Debt Load", color: "#3b82f6" },
  { key: "diversity", label: "Debt Diversity", color: "#10b981" },
] as const;

export function ScoreBreakdown({ breakdown }: { breakdown: HealthScore["breakdown"] | undefined }) {
  if (!breakdown) return null;
  return (
    <div className="rounded-xl p-5 border glass" style={{ borderColor: "var(--border)" }}>
      <h2 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
        Score Breakdown
      </h2>
      <div className="space-y-4">
        {CATEGORIES.map(({ key, label, color }) => {
          const val = breakdown[key];
          return (
            <div key={key}>
              <div className="flex justify-between text-xs mb-1.5">
                <span style={{ color: "var(--text-secondary)" }}>{label}</span>
                <span className="font-semibold" style={{ color }}>{val.toFixed(0)}</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--bg-hover)" }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${val}%`, background: color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
