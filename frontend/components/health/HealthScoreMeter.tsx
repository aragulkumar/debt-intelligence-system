"use client";

import { HEALTH_BAND_CONFIG } from "@/lib/utils";
import type { HealthScore } from "@/types";

export function HealthScoreMeter({ data }: { data: HealthScore | undefined }) {
  if (!data) return null;

  const { score, band } = data;
  const cfg = HEALTH_BAND_CONFIG[band];
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="rounded-xl p-6 border glass flex flex-col items-center" style={{ borderColor: "var(--border)" }}>
      <h2 className="text-sm font-semibold mb-4 self-start" style={{ color: "var(--text-primary)" }}>
        Debt Health Score
      </h2>
      <div className="relative">
        <svg width="140" height="140" viewBox="0 0 140 140">
          {/* Track */}
          <circle cx="70" cy="70" r="54" fill="none" stroke="var(--bg-hover)" strokeWidth="10" />
          {/* Score arc */}
          <circle
            cx="70" cy="70" r="54"
            fill="none"
            stroke={cfg.color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 70 70)"
            style={{ transition: "stroke-dashoffset 1.2s ease, stroke 0.5s ease" }}
          />
          {/* Score text */}
          <text x="70" y="64" textAnchor="middle" fontSize="28" fontWeight="800" fill="var(--text-primary)">{score}</text>
          <text x="70" y="82" textAnchor="middle" fontSize="11" fill="var(--text-muted)">out of 100</text>
        </svg>
        {/* Pulse ring for excellent */}
        {band === "excellent" && (
          <div
            className="absolute inset-0 rounded-full pointer-events-none pulse-ring"
            style={{ border: `2px solid ${cfg.color}40` }}
          />
        )}
      </div>
      <div
        className={`mt-3 px-4 py-1 rounded-full text-sm font-semibold ${cfg.bg}`}
      >
        {cfg.label}
      </div>
    </div>
  );
}
