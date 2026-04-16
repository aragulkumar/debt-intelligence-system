"use client";

import { SUGGESTION_PRIORITY_CONFIG } from "@/lib/utils";
import type { Suggestion } from "@/types";

export function SuggestionCards({ suggestions }: { suggestions: Suggestion[] | undefined }) {
  if (!suggestions?.length) return null;
  return (
    <div className="rounded-xl p-5 border glass" style={{ borderColor: "var(--border)" }}>
      <h2 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
        Improvement Suggestions
      </h2>
      <div className="space-y-3">
        {suggestions.map((s, i) => {
          const cfg = SUGGESTION_PRIORITY_CONFIG[s.priority];
          return (
            <div
              key={i}
              className={`flex gap-3 p-3 rounded-lg border ${cfg.color}`}
            >
              <span className="flex-shrink-0 text-base">{cfg.icon}</span>
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                  {s.message}
                </p>
                <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                  {s.action}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
