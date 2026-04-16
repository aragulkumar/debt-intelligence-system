"use client";

import { TopNav } from "@/components/layout/TopNav";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/lib/api";
import type { RepaymentSuccess } from "@/types";
import { FileText, CheckCircle, XCircle } from "lucide-react";

export default function AdminCompliancePage() {
  const { data } = useQuery<RepaymentSuccess>({
    queryKey: ["admin", "repayment-success"],
    queryFn: () => adminApi.getRepaymentSuccess(),
  });

  return (
    <div className="flex flex-col min-h-screen">
      <TopNav title="Compliance Report" subtitle="Regulatory metrics and repayment health" />
      <div className="p-6 space-y-6 fade-in">
        <div className="rounded-xl p-6 border glass" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(99,102,241,0.15)" }}>
              <FileText size={20} style={{ color: "#6366f1" }} />
            </div>
            <div>
              <h1 className="font-bold" style={{ color: "var(--text-primary)" }}>Regulatory Compliance Report</h1>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                Generated — {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}
              </p>
            </div>
          </div>

          {data && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl" style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle size={16} style={{ color: "#10b981" }} />
                  <p className="text-sm font-semibold" style={{ color: "#10b981" }}>On Track</p>
                </div>
                <p className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>{data.onTrackCount}</p>
                <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>users following their plan</p>
              </div>
              <div className="p-4 rounded-xl" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <XCircle size={16} style={{ color: "#ef4444" }} />
                  <p className="text-sm font-semibold" style={{ color: "#ef4444" }}>Off Track</p>
                </div>
                <p className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>{data.offTrackCount}</p>
                <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>users needing intervention</p>
              </div>
              <div className="p-4 rounded-xl" style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)" }}>
                <p className="text-sm font-semibold mb-2" style={{ color: "#6366f1" }}>Overall Success</p>
                <p className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>{data.successRate.toFixed(1)}%</p>
                <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>repayment success rate</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
