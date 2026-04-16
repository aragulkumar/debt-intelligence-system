"use client";

import { TopNav } from "@/components/layout/TopNav";
import { BnplAnalyticsView } from "@/components/admin/BnplAnalytics";

export default function AdminBnplPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <TopNav title="BNPL Analytics" subtitle="Track BNPL dependency across the platform" />
      <div className="p-6 fade-in">
        <BnplAnalyticsView />
      </div>
    </div>
  );
}
