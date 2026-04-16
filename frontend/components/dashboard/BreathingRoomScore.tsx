"use client";

import { formatCurrency } from "@/lib/utils";

interface BreathingRoomScoreProps {
  emiToIncomeRatio: number | undefined;
  monthlyEmi: number | undefined;
}

export function BreathingRoomScore({ emiToIncomeRatio, monthlyEmi }: BreathingRoomScoreProps) {
  const pct = emiToIncomeRatio ? Math.min(100, emiToIncomeRatio * 100) : 0;
  const freeRatio = Math.max(0, 100 - pct);

  const getStatus = () => {
    if (pct > 60) return { label: "Critical", color: "#ef4444", bg: "rgba(239,68,68,0.1)" };
    if (pct > 40) return { label: "Strained", color: "#f59e0b", bg: "rgba(245,158,11,0.1)" };
    if (pct > 20) return { label: "Moderate", color: "#3b82f6", bg: "rgba(59,130,246,0.1)" };
    return { label: "Healthy", color: "#10b981", bg: "rgba(16,185,129,0.1)" };
  };

  const status = getStatus();

  return (
    <div className="rounded-xl p-5 border glass" style={{ borderColor: "var(--border)" }}>
      <h2 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
        Breathing Room Score
      </h2>

      {/* Ring */}
      <div className="flex items-center gap-4">
        <div className="relative flex-shrink-0">
          <svg width="80" height="80" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="34" fill="none" stroke="var(--bg-hover)" strokeWidth="8" />
            <circle
              cx="40" cy="40" r="34"
              fill="none"
              stroke={status.color}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 34}`}
              strokeDashoffset={`${2 * Math.PI * 34 * (1 - freeRatio / 100)}`}
              transform="rotate(-90 40 40)"
              style={{ transition: "stroke-dashoffset 0.8s ease" }}
            />
            <text x="40" y="44" textAnchor="middle" fontSize="14" fontWeight="700" fill="var(--text-primary)">
              {freeRatio.toFixed(0)}%
            </text>
          </svg>
        </div>
        <div>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>Free Income</p>
          <div
            className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-semibold"
            style={{ background: status.bg, color: status.color }}
          >
            {status.label}
          </div>
          {monthlyEmi && (
            <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
              EMI Load: <span style={{ color: status.color }}>{formatCurrency(monthlyEmi, true)}/mo</span>
            </p>
          )}
        </div>
      </div>

      {/* Bar */}
      <div className="mt-4">
        <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--bg-hover)" }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${pct}%`, background: status.color }}
          />
        </div>
        <div className="flex justify-between text-xs mt-1" style={{ color: "var(--text-muted)" }}>
          <span>EMI {pct.toFixed(0)}%</span>
          <span>Free {freeRatio.toFixed(0)}%</span>
        </div>
      </div>
    </div>
  );
}
