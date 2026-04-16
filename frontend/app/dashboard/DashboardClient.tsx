"use client";

import { useDebts, useDebtSummary } from "@/hooks/useDebts";
import { OverviewCards } from "@/components/dashboard/OverviewCards";
import { DebtBreakdownChart } from "@/components/dashboard/DebtBreakdownChart";
import { UpcomingDues } from "@/components/dashboard/UpcomingDues";
import { BreathingRoomScore } from "@/components/dashboard/BreathingRoomScore";

export function DashboardClient() {
  const { data: debts, isLoading: debtsLoading } = useDebts();
  const { data: summary, isLoading: summaryLoading } = useDebtSummary();

  return (
    <>
      <OverviewCards summary={summary} isLoading={summaryLoading} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DebtBreakdownChart summary={summary} isLoading={summaryLoading} />
        </div>
        <BreathingRoomScore
          emiToIncomeRatio={summary?.emiToIncomeRatio}
          monthlyEmi={summary?.totalMonthlyEmi}
        />
      </div>
      <UpcomingDues debts={debts} />
    </>
  );
}
