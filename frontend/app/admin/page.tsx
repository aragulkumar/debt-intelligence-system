"use client";

import { TopNav } from "@/components/layout/TopNav";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/lib/api";
import type { RepaymentSuccess } from "@/types";
import { Shield, TrendingUp, Users, CheckCircle } from "lucide-react";

export default function AdminPage() {
  const { data: success } = useQuery<RepaymentSuccess>({
    queryKey: ["admin", "repayment-success"],
    queryFn: () => adminApi.getRepaymentSuccess(),
  });

  return (
    <div className="flex flex-col min-h-screen">
      <TopNav title="Admin Overview" subtitle="Platform-wide debt analytics" />
      <div className="p-6 space-y-6 fade-in">
        {success && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Success Rate", value: `${success.successRate.toFixed(1)}%`, icon: TrendingUp, color: "#10b981" },
                { label: "On Track Users", value: success.onTrackCount, icon: CheckCircle, color: "#6366f1" },
                { label: "Off Track Users", value: success.offTrackCount, icon: Users, color: "#ef4444" },
                { label: "Avg Months to Freedom", value: success.avgMonthsToFreedom.toFixed(0), icon: Shield, color: "#f59e0b" },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="rounded-xl p-5 border glass" style={{ borderColor: "var(--border)" }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>{label}</p>
                      <p className="text-2xl font-bold mt-2" style={{ color }}>{value}</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}18` }}>
                      <Icon size={20} style={{ color }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Strategy breakdown */}
            <div className="rounded-xl p-5 border glass" style={{ borderColor: "var(--border)" }}>
              <h2 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
                Success Rate by Strategy
              </h2>
              <div className="space-y-3">
                {Object.entries(success.byStrategy).map(([strategy, rate]) => (
                  <div key={strategy}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="capitalize" style={{ color: "var(--text-secondary)" }}>{strategy}</span>
                      <span className="font-bold" style={{ color: "#6366f1" }}>{rate.toFixed(0)}%</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--bg-hover)" }}>
                      <div className="h-full rounded-full" style={{ width: `${rate}%`, background: "linear-gradient(90deg, #6366f1, #a855f7)" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
