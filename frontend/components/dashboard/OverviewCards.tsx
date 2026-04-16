"use client";

import { formatCurrency, formatPercent } from "@/lib/utils";
import type { DebtSummary } from "@/types";
import { TrendingDown, Calendar, AlertCircle, DollarSign } from "lucide-react";

interface OverviewCardsProps {
  summary: DebtSummary | undefined;
  isLoading: boolean;
}

function StatCard({
  label, value, sub, icon: Icon, accent, danger,
}: {
  label: string; value: string; sub?: string;
  icon: React.ElementType; accent: string; danger?: boolean;
}) {
  return (
    <div
      className="rounded-xl p-5 border glass card-hover slide-in"
      style={{ borderColor: danger ? "rgba(239,68,68,0.3)" : "var(--border)" }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
            {label}
          </p>
          <p className="text-2xl font-bold mt-2" style={{ color: danger ? "#ef4444" : "var(--text-primary)" }}>
            {value}
          </p>
          {sub && <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{sub}</p>}
        </div>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${accent}18` }}
        >
          <Icon size={20} style={{ color: accent }} />
        </div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-xl p-5 border glass animate-pulse" style={{ borderColor: "var(--border)" }}>
      <div className="h-3 w-24 rounded mb-3" style={{ background: "var(--bg-hover)" }} />
      <div className="h-7 w-32 rounded" style={{ background: "var(--bg-hover)" }} />
    </div>
  );
}

export function OverviewCards({ summary, isLoading }: OverviewCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (!summary) return null;

  const emiRatioPct = summary.emiToIncomeRatio * 100;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Total Outstanding"
        value={formatCurrency(summary.totalOutstanding, true)}
        sub="across all debts"
        icon={DollarSign}
        accent="#6366f1"
      />
      <StatCard
        label="Monthly EMI"
        value={formatCurrency(summary.totalMonthlyEmi, true)}
        sub={`${emiRatioPct.toFixed(0)}% of income`}
        icon={TrendingDown}
        accent={emiRatioPct > 50 ? "#ef4444" : "#10b981"}
        danger={emiRatioPct > 50}
      />
      <StatCard
        label="Overdue Debts"
        value={summary.overdueCount.toString()}
        sub={summary.overdueCount > 0 ? "needs immediate attention" : "all payments on time"}
        icon={AlertCircle}
        accent={summary.overdueCount > 0 ? "#ef4444" : "#10b981"}
        danger={summary.overdueCount > 0}
      />
      <StatCard
        label="Due This Week"
        value={summary.upcomingDueCount.toString()}
        sub="upcoming payments"
        icon={Calendar}
        accent="#f59e0b"
      />
    </div>
  );
}
