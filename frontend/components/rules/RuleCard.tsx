"use client";

import type { Rule } from "@/types";
import { Trash2, ToggleLeft } from "lucide-react";

const TRIGGER_LABELS: Record<string, string> = {
  salary_above: "Salary above threshold",
  salary_below: "Salary below threshold",
  debt_overdue: "Debt overdue",
  utilisation_above: "Credit utilisation above",
  emi_load_above: "EMI load above",
};

const ACTION_LABELS: Record<string, string> = {
  allocate_extra: "Allocate extra payment",
  send_alert: "Send alert",
  pause_strategy: "Pause strategy",
};

interface RuleCardProps {
  rule: Rule;
  onDelete: (id: string) => void;
}

export function RuleCard({ rule, onDelete }: RuleCardProps) {
  return (
    <div className="rounded-xl p-4 border glass card-hover" style={{ borderColor: "var(--border)" }}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className="px-2 py-0.5 rounded-full text-xs border font-medium"
              style={{ background: "rgba(99,102,241,0.1)", borderColor: "rgba(99,102,241,0.3)", color: "#818cf8" }}>
              {TRIGGER_LABELS[rule.trigger] || rule.trigger}
            </span>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              threshold: <strong style={{ color: "var(--text-secondary)" }}>{rule.threshold}</strong>
            </span>
          </div>
          <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
            → {ACTION_LABELS[rule.action] || rule.action}
            {rule.amount ? ` (${new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(rule.amount)})` : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ToggleLeft size={16} style={{ color: rule.isActive ? "#10b981" : "var(--text-muted)" }} />
          <button
            onClick={() => onDelete(rule.id)}
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#ef4444")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)")}
            aria-label="Delete rule"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
