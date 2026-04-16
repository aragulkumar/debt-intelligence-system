"use client";

import { useState } from "react";
import { TopNav } from "@/components/layout/TopNav";
import { StrategySelector } from "@/components/strategy/StrategySelector";
import { RepaymentTimeline } from "@/components/strategy/RepaymentTimeline";
import { WhatIfSimulator } from "@/components/strategy/WhatIfSimulator";
import { useDebtStore } from "@/store/useDebtStore";
import { useCalculateRepayment } from "@/hooks/useRepayment";
import type { RepaymentPlan, RepaymentStrategy } from "@/types";
import { Play } from "lucide-react";

export default function StrategyPage() {
  const { selectedStrategy, setSelectedStrategy, extraPayment, setExtraPayment } = useDebtStore();
  const calculate = useCalculateRepayment();
  const [plan, setPlan] = useState<RepaymentPlan | null>(null);

  const runStrategy = async () => {
    const res = await calculate.mutateAsync({ strategy: selectedStrategy, extra_payment: extraPayment });
    setPlan(res);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <TopNav title="Repayment Strategy" subtitle="Build your debt-free plan" />
      <div className="p-6 space-y-6 fade-in">
        <StrategySelector value={selectedStrategy} onChange={(s: RepaymentStrategy) => setSelectedStrategy(s)} />

        {/* Extra payment input */}
        <div className="rounded-xl p-5 border glass" style={{ borderColor: "var(--border)" }}>
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-48">
              <label className="block text-xs mb-1.5" style={{ color: "var(--text-muted)" }}>
                Extra Monthly Payment (₹)
              </label>
              <input
                id="strategy-extra-payment"
                type="number"
                value={extraPayment}
                onChange={(e) => setExtraPayment(Number(e.target.value))}
                className="w-full rounded-lg px-3 py-2 text-sm border outline-none"
                style={{ background: "var(--bg-elevated)", borderColor: "var(--border)", color: "var(--text-primary)" }}
                placeholder="e.g. 5000"
              />
            </div>
            <button
              id="strategy-calculate-btn"
              onClick={runStrategy}
              disabled={calculate.isPending}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all"
              style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)", color: "#fff" }}
            >
              <Play size={16} />
              {calculate.isPending ? "Calculating..." : "Calculate Plan"}
            </button>
          </div>
        </div>

        {plan && <RepaymentTimeline plan={plan} />}
        <WhatIfSimulator />
      </div>
    </div>
  );
}
