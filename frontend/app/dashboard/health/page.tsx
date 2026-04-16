"use client";

import { TopNav } from "@/components/layout/TopNav";
import { HealthScoreMeter } from "@/components/health/HealthScoreMeter";
import { ScoreBreakdown } from "@/components/health/ScoreBreakdown";
import { ScoreHistory } from "@/components/health/ScoreHistory";
import { SuggestionCards } from "@/components/health/SuggestionCards";
import { useHealthScore, useHealthHistory, useHealthSuggestions } from "@/hooks/useHealth";

export default function HealthPage() {
  const { data: health } = useHealthScore();
  const { data: history } = useHealthHistory();
  const { data: suggestions } = useHealthSuggestions();

  return (
    <div className="flex flex-col min-h-screen">
      <TopNav title="Debt Health Score" subtitle="Track and improve your financial health" />
      <div className="p-6 space-y-6 fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <HealthScoreMeter data={health} />
          <ScoreBreakdown breakdown={health?.breakdown} />
        </div>
        <ScoreHistory history={history} />
        <SuggestionCards suggestions={suggestions} />
      </div>
    </div>
  );
}
