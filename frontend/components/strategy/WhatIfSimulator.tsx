"use client";

import { useState, useEffect, useCallback } from "react";
import { useDebts } from "@/hooks/useDebts";
import { useSimulate } from "@/hooks/useRepayment";
import { formatCurrency } from "@/lib/utils";
import { Zap } from "lucide-react";
import type { SimulateResult, Debt } from "@/types";

export function WhatIfSimulator() {
  const { data: debts } = useDebts();
  const simulate = useSimulate();

  const [selectedDebtId, setSelectedDebtId] = useState("");
  const [extraAmount, setExtraAmount] = useState(1000);
  const [result, setResult] = useState<SimulateResult | null>(null);

  const runSimulation = useCallback(async () => {
    if (!selectedDebtId) return;
    const res = await simulate.mutateAsync({ debt_id: selectedDebtId, extra_amount: extraAmount });
    setResult(res);
  }, [selectedDebtId, extraAmount, simulate]);

  // Debounce 300ms per spec
  useEffect(() => {
    if (!selectedDebtId) return;
    const t = setTimeout(runSimulation, 300);
    return () => clearTimeout(t);
  }, [selectedDebtId, extraAmount, runSimulation]);

  return (
    <div className="rounded-xl p-5 border glass" style={{ borderColor: "var(--border)" }}>
      <div className="flex items-center gap-2 mb-4">
        <Zap size={16} style={{ color: "#f59e0b" }} />
        <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          What-If Simulator
        </h2>
      </div>

      <div className="space-y-4">
        {/* Debt selector */}
        <div>
          <label className="block text-xs mb-1.5" style={{ color: "var(--text-muted)" }}>
            Select Debt
          </label>
          <select
            id="simulator-debt-select"
            value={selectedDebtId}
            onChange={(e) => setSelectedDebtId(e.target.value)}
            className="w-full rounded-lg px-3 py-2 text-sm border outline-none transition-colors"
            style={{
              background: "var(--bg-elevated)",
              borderColor: "var(--border)",
              color: "var(--text-primary)",
            }}
          >
            <option value="">Choose a debt...</option>
            {debts?.map((d: Debt) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>

        {/* Extra amount slider */}
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <label style={{ color: "var(--text-muted)" }}>Extra Monthly Payment</label>
            <span className="font-bold" style={{ color: "#6366f1" }}>
              {formatCurrency(extraAmount, true)}
            </span>
          </div>
          <input
            id="simulator-extra-slider"
            type="range"
            min={500}
            max={50000}
            step={500}
            value={extraAmount}
            onChange={(e) => setExtraAmount(Number(e.target.value))}
            className="w-full accent-indigo-500"
            style={{ accentColor: "#6366f1" }}
          />
          <div className="flex justify-between text-xs mt-1" style={{ color: "var(--text-muted)" }}>
            <span>₹500</span>
            <span>₹50,000</span>
          </div>
        </div>

        {/* Results */}
        {simulate.isPending && (
          <div className="text-center py-4">
            <div className="inline-block w-5 h-5 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
          </div>
        )}

        {result && !simulate.isPending && (
          <div className="grid grid-cols-2 gap-3 pt-2 border-t" style={{ borderColor: "var(--border)" }}>
            <div className="p-3 rounded-lg" style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Months Saved</p>
              <p className="text-2xl font-bold mt-1" style={{ color: "#10b981" }}>
                {result.monthsSaved}
              </p>
            </div>
            <div className="p-3 rounded-lg" style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)" }}>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Interest Saved</p>
              <p className="text-2xl font-bold mt-1" style={{ color: "#6366f1" }}>
                {formatCurrency(result.interestSaved, true)}
              </p>
            </div>
            <div className="col-span-2 p-3 rounded-lg" style={{ background: "var(--bg-hover)" }}>
              <div className="flex justify-between text-xs">
                <div>
                  <p style={{ color: "var(--text-muted)" }}>Current Payoff</p>
                  <p className="font-semibold mt-0.5" style={{ color: "#ef4444" }}>
                    {new Date(result.currentPayoffDate).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                  </p>
                </div>
                <div className="text-right">
                  <p style={{ color: "var(--text-muted)" }}>New Payoff</p>
                  <p className="font-semibold mt-0.5" style={{ color: "#10b981" }}>
                    {new Date(result.newPayoffDate).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
