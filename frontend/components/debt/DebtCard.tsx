"use client";

import Link from "next/link";
import { DebtTypeBadge } from "./DebtTypeBadge";
import { formatCurrency, formatDate, isOverdue, isDueSoon } from "@/lib/utils";
import type { Debt } from "@/types";
import { AlertTriangle, Clock, Trash2, Pencil } from "lucide-react";

interface DebtCardProps {
  debt: Debt;
  onDelete?: (id: string) => void;
  onEdit?: (debt: Debt) => void;
  dangerThreshold?: number; // maxEmiLoadPercent from danger zone settings
}

export function DebtCard({ debt, onDelete, onEdit, dangerThreshold }: DebtCardProps) {
  const overdue = isOverdue(debt.dueDate);
  const dueSoon = !overdue && isDueSoon(debt.dueDate);

  const progress =
    debt.principal > 0
      ? Math.max(0, Math.min(100, ((debt.principal - debt.outstanding) / debt.principal) * 100))
      : 0;

  return (
    <div
      className="rounded-xl p-4 border card-hover glass"
      style={{
        borderColor: overdue ? "rgba(239,68,68,0.4)" : "var(--border)",
        boxShadow: overdue ? "0 0 16px rgba(239,68,68,0.08)" : undefined,
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <Link
            href={`/dashboard/debts/${debt.id}`}
            className="font-semibold text-sm hover:underline truncate block"
            style={{ color: "var(--text-primary)" }}
          >
            {debt.name}
          </Link>
          <div className="mt-1 flex items-center gap-2 flex-wrap">
            <DebtTypeBadge type={debt.type} />
            {debt.tag && (
              <span className="text-xs px-1.5 py-0.5 rounded" style={{ color: "var(--text-muted)", background: "var(--bg-hover)" }}>
                {debt.tag}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          {onEdit && (
            <button
              onClick={() => onEdit(debt)}
              className="p-1.5 rounded-lg transition-colors"
              style={{ color: "var(--text-muted)" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)")}
              aria-label={`Edit ${debt.name}`}
            >
              <Pencil size={14} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(debt.id)}
              className="p-1.5 rounded-lg transition-colors"
              style={{ color: "var(--text-muted)" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#ef4444")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)")}
              aria-label={`Delete ${debt.name}`}
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Amounts */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>Outstanding</p>
          <p className="text-base font-bold mt-0.5" style={{ color: "var(--text-primary)" }}>
            {formatCurrency(debt.outstanding, true)}
          </p>
        </div>
        {debt.emiAmount && (
          <div>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>Monthly EMI</p>
            <p className="text-base font-bold mt-0.5" style={{ color: "#6366f1" }}>
              {formatCurrency(debt.emiAmount, true)}
            </p>
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1" style={{ color: "var(--text-muted)" }}>
          <span>Repaid</span>
          <span>{progress.toFixed(0)}%</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg-hover)" }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              background: overdue
                ? "#ef4444"
                : "linear-gradient(90deg, #6366f1, #a855f7)",
            }}
          />
        </div>
      </div>

      {/* Due date + warnings */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
          <Clock size={12} />
          <span>Due {formatDate(debt.dueDate)}</span>
        </div>

        {/* Inline danger zone indicators — non-negotiable UX requirement */}
        {overdue && (
          <div className="flex items-center gap-1 text-xs font-medium" style={{ color: "#ef4444" }}>
            <AlertTriangle size={12} />
            <span>Overdue</span>
          </div>
        )}
        {dueSoon && !overdue && (
          <div className="flex items-center gap-1 text-xs font-medium" style={{ color: "#f59e0b" }}>
            <AlertTriangle size={12} />
            <span>Due soon</span>
          </div>
        )}
        {!overdue && !dueSoon && debt.interestRate >= (dangerThreshold ?? 24) && (
          <div className="flex items-center gap-1 text-xs font-medium" style={{ color: "#f59e0b" }}>
            <AlertTriangle size={12} />
            <span>High interest</span>
          </div>
        )}
      </div>
    </div>
  );
}
