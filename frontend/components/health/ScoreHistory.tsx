"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { format } from "date-fns";
import type { HealthHistoryEntry } from "@/types";

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
  if (active && payload?.length) {
    return (
      <div className="rounded-lg px-3 py-2 border text-xs" style={{ background: "var(--bg-elevated)", borderColor: "var(--border)" }}>
        <p style={{ color: "var(--text-muted)" }}>{label}</p>
        <p className="font-bold mt-0.5" style={{ color: "#6366f1" }}>Score: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export function ScoreHistory({ history }: { history: HealthHistoryEntry[] | undefined }) {
  if (!history?.length) return null;

  const data = history.map((h) => ({
    date: format(new Date(h.date), "dd MMM"),
    score: h.score,
  }));

  return (
    <div className="rounded-xl p-5 border glass" style={{ borderColor: "var(--border)" }}>
      <h2 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
        Score History
      </h2>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#6366f1"
            strokeWidth={2}
            dot={{ fill: "#6366f1", r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
