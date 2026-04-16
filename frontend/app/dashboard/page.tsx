import type { Metadata } from "next";
import { TopNav } from "@/components/layout/TopNav";
import { OverviewCards } from "@/components/dashboard/OverviewCards";
import { DebtBreakdownChart } from "@/components/dashboard/DebtBreakdownChart";
import { UpcomingDues } from "@/components/dashboard/UpcomingDues";
import { BreathingRoomScore } from "@/components/dashboard/BreathingRoomScore";
import { DashboardClient } from "./DashboardClient";

export const metadata: Metadata = {
  title: "Dashboard — Debt Helper",
  description: "Your unified debt overview — track all debts, EMIs, and upcoming payments.",
};

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <TopNav title="Dashboard" subtitle="Your unified debt overview" />
      <div className="p-6 space-y-6 fade-in">
        <DashboardClient />
      </div>
    </div>
  );
}
