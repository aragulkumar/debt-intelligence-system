"use client";

import { TopNav } from "@/components/layout/TopNav";
import { RiskHeatmap } from "@/components/admin/RiskHeatmap";
import { UserRiskTable } from "@/components/admin/UserRiskTable";

export default function AdminRiskPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <TopNav title="Risk Heatmap" subtitle="2D view of user risk by EMI load and debt outstanding" />
      <div className="p-6 space-y-6 fade-in">
        <RiskHeatmap />
        <UserRiskTable />
      </div>
    </div>
  );
}
