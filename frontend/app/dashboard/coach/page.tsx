"use client";

import { TopNav } from "@/components/layout/TopNav";
import { DebtCoachChat } from "@/components/coach/DebtCoachChat";

export default function CoachPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <TopNav title="AI Debt Coach" subtitle="Your personal financial advisor" />
      <div className="p-6 fade-in flex-1 flex flex-col">
        <DebtCoachChat />
      </div>
    </div>
  );
}
