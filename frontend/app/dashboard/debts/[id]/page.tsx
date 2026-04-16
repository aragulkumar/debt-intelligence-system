"use client";

import { useDebt } from "@/hooks/useDebts";
import { TopNav } from "@/components/layout/TopNav";
import { DebtTypeBadge } from "@/components/debt/DebtTypeBadge";
import { formatCurrency, formatDate, isOverdue } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";
import { useParams } from "next/navigation";

export default function DebtDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: debt, isLoading } = useDebt(id);

  if (isLoading) return (
    <div>
      <TopNav title="Debt Detail" />
      <div className="p-6">
        <div className="animate-pulse rounded-xl p-6 border glass h-64" style={{ borderColor: "var(--border)" }} />
      </div>
    </div>
  );

  if (!debt) return (
    <div>
      <TopNav title="Debt Not Found" />
      <div className="p-6 text-center" style={{ color: "var(--text-muted)" }}>Debt not found.</div>
    </div>
  );

  const overdue = isOverdue(debt.dueDate);
  const progress = debt.principal > 0
    ? Math.max(0, Math.min(100, ((debt.principal - debt.outstanding) / debt.principal) * 100))
    : 0;

  return (
    <div className="flex flex-col min-h-screen">
      <TopNav title={debt.name} subtitle="Debt Detail" />
      <div className="p-6 fade-in">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Main card */}
          <div className="rounded-2xl p-6 border glass"
            style={{ borderColor: overdue ? "rgba(239,68,68,0.4)" : "var(--border)" }}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>{debt.name}</h1>
                <div className="flex items-center gap-2 mt-2">
                  <DebtTypeBadge type={debt.type} />
                  {debt.tag && (
                    <span className="text-xs px-2 py-0.5 rounded" style={{ background: "var(--bg-hover)", color: "var(--text-muted)" }}>
                      {debt.tag}
                    </span>
                  )}
                </div>
              </div>
              {overdue && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium"
                  style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.3)" }}>
                  <AlertTriangle size={14} />
                  Overdue
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {[
                { label: "Principal", value: formatCurrency(debt.principal) },
                { label: "Outstanding", value: formatCurrency(debt.outstanding), color: "#ef4444" },
                { label: "Interest Rate", value: `${debt.interestRate}%` },
                { label: "Monthly EMI", value: debt.emiAmount ? formatCurrency(debt.emiAmount) : "—" },
                { label: "Due Date", value: formatDate(debt.dueDate), color: overdue ? "#ef4444" : undefined },
                { label: "Status", value: debt.isActive ? "Active" : "Closed", color: debt.isActive ? "#10b981" : "var(--text-muted)" },
              ].map(({ label, value, color }) => (
                <div key={label} className="p-3 rounded-xl" style={{ background: "var(--bg-hover)" }}>
                  <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>{label}</p>
                  <p className="font-bold text-sm" style={{ color: color || "var(--text-primary)" }}>{value}</p>
                </div>
              ))}
            </div>

            {/* Progress */}
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span style={{ color: "var(--text-muted)" }}>Repayment Progress</span>
                <span className="font-bold" style={{ color: "#6366f1" }}>{progress.toFixed(1)}%</span>
              </div>
              <div className="h-3 rounded-full overflow-hidden" style={{ background: "var(--bg-hover)" }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${progress}%`, background: "linear-gradient(90deg, #6366f1, #a855f7)" }}
                />
              </div>
              <div className="flex justify-between text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                <span>Paid: {formatCurrency(debt.principal - debt.outstanding, true)}</span>
                <span>Remaining: {formatCurrency(debt.outstanding, true)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
