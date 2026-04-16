"use client";

import { TopNav } from "@/components/layout/TopNav";
import { UserRiskTable } from "@/components/admin/UserRiskTable";

export default function AdminUsersPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <TopNav title="User Risk Overview" subtitle="All users with debt load indicators" />
      <div className="p-6 fade-in">
        <UserRiskTable />
      </div>
    </div>
  );
}
