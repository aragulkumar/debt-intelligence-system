"use client";

import { useState } from "react";
import { TopNav } from "@/components/layout/TopNav";
import { DebtCard } from "@/components/debt/DebtCard";
import { useDebts, useDeleteDebt } from "@/hooks/useDebts";
import { AddDebtForm } from "@/components/debt/AddDebtForm";
import { Plus, Search } from "lucide-react";
import type { Debt, DebtType } from "@/types";

export default function DebtsPage() {
  const { data: debts, isLoading } = useDebts();
  const deleteMutation = useDeleteDebt();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editDebt, setEditDebt] = useState<Debt | null>(null);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<DebtType | "ALL">("ALL");

  const filtered = (debts ?? []).filter((d: Debt) => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "ALL" || d.type === filterType;
    return matchSearch && matchType;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <TopNav title="My Debts" subtitle={`${debts?.length ?? 0} debts tracked`} />
      <div className="p-6 space-y-6 fade-in">
        {/* Controls */}
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
              <input
                id="debts-search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search debts..."
                className="pl-8 pr-4 py-2 rounded-lg text-sm border outline-none"
                style={{ background: "var(--bg-elevated)", borderColor: "var(--border)", color: "var(--text-primary)", width: 200 }}
              />
            </div>
            <select
              id="debts-type-filter"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as DebtType | "ALL")}
              className="px-3 py-2 rounded-lg text-sm border outline-none"
              style={{ background: "var(--bg-elevated)", borderColor: "var(--border)", color: "var(--text-primary)" }}
            >
              <option value="ALL">All Types</option>
              <option value="BNPL">BNPL</option>
              <option value="EMI">EMI</option>
              <option value="CREDIT_CARD">Credit Card</option>
              <option value="PERSONAL_LOAN">Personal Loan</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <button
            id="debts-add-btn"
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)", color: "#fff" }}
          >
            <Plus size={16} /> Add Debt
          </button>
        </div>

        {/* Add / Edit form modal overlay */}
        {(showAddForm || editDebt) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.7)" }}
            onClick={(e) => { if (e.target === e.currentTarget) { setShowAddForm(false); setEditDebt(null); } }}
          >
            <div className="w-full max-w-lg">
              <AddDebtForm
                debt={editDebt ?? undefined}
                onClose={() => { setShowAddForm(false); setEditDebt(null); }}
              />
            </div>
          </div>
        )}

        {/* Debt grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl p-4 border glass animate-pulse h-44" style={{ borderColor: "var(--border)" }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-3">💳</p>
            <p className="font-semibold" style={{ color: "var(--text-primary)" }}>No debts yet</p>
            <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Add your first debt to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((debt: Debt) => (
              <DebtCard
                key={debt.id}
                debt={debt}
                onDelete={(id) => deleteMutation.mutate(id)}
                onEdit={(d: Debt) => setEditDebt(d)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
