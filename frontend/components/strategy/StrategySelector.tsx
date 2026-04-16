"use client";

import { cn } from "@/lib/utils";
import type { RepaymentStrategy } from "@/types";

const STRATEGIES: Array<{ key: RepaymentStrategy; label: string; desc: string; emoji: string }> = [
  { key: "snowball", label: "Snowball", desc: "Pay smallest debts first for quick wins", emoji: "❄️" },
  { key: "avalanche", label: "Avalanche", desc: "Pay highest-interest first — saves most money", emoji: "🏔️" },
  { key: "hybrid", label: "Hybrid", desc: "Balance of speed and savings", emoji: "⚖️" },
  { key: "custom", label: "Custom", desc: "Set your own weights per debt", emoji: "🎯" },
];

interface StrategySelectorProps {
  value: RepaymentStrategy;
  onChange: (s: RepaymentStrategy) => void;
}

export function StrategySelector({ value, onChange }: StrategySelectorProps) {
  return (
    <div className="rounded-xl p-5 border glass" style={{ borderColor: "var(--border)" }}>
      <h2 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
        Repayment Strategy
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {STRATEGIES.map(({ key, label, desc, emoji }) => (
          <button
            key={key}
            id={`strategy-${key}`}
            onClick={() => onChange(key)}
            className={cn(
              "flex flex-col gap-1 p-3 rounded-xl border text-left transition-all duration-200"
            )}
            style={
              value === key
                ? {
                    background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.08))",
                    borderColor: "#6366f1",
                    color: "#818cf8",
                  }
                : {
                    background: "var(--bg-hover)",
                    borderColor: "var(--border)",
                    color: "var(--text-secondary)",
                  }
            }
          >
            <span className="text-xl">{emoji}</span>
            <span className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{label}</span>
            <span className="text-xs leading-tight" style={{ color: "var(--text-muted)" }}>{desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
