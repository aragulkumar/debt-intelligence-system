"use client";

import { TopNav } from "@/components/layout/TopNav";
import { WhatIfSimulator } from "@/components/strategy/WhatIfSimulator";
import { Zap } from "lucide-react";

export default function SimulatePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <TopNav title="What-If Simulator" subtitle="Explore how extra payments accelerate your debt freedom" />
      <div className="p-6 fade-in">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Hero */}
          <div className="rounded-2xl p-6 border glass"
            style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(168,85,247,0.05))", borderColor: "rgba(99,102,241,0.3)" }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(245,158,11,0.15)" }}>
                <Zap size={20} style={{ color: "#f59e0b" }} />
              </div>
              <div>
                <h1 className="font-bold" style={{ color: "var(--text-primary)" }}>What-If Simulator</h1>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Move the slider to see how extra payments change your payoff date
                </p>
              </div>
            </div>
          </div>
          <WhatIfSimulator />
        </div>
      </div>
    </div>
  );
}
