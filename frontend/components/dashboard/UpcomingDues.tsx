"use client";

import { useMemo } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from "date-fns";
import type { Debt } from "@/types";
import { cn } from "@/lib/utils";

interface UpcomingDuesProps {
  debts: Debt[] | undefined;
}

export function UpcomingDues({ debts }: UpcomingDuesProps) {
  const today = new Date();
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(today),
    end: endOfMonth(today),
  });

  const dueDates = useMemo(
    () => (debts || []).map((d) => new Date(d.dueDate)),
    [debts]
  );

  const upcomingList = useMemo(
    () =>
      (debts || [])
        .filter((d) => {
          const dd = new Date(d.dueDate);
          const diff = (dd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
          return diff >= -1 && diff <= 30;
        })
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
        .slice(0, 5),
    [debts]
  );

  return (
    <div className="rounded-xl p-5 border glass" style={{ borderColor: "var(--border)" }}>
      <h2 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
        Upcoming Dues — {format(today, "MMMM yyyy")}
      </h2>

      {/* Mini calendar grid */}
      <div className="mb-4">
        <div className="grid grid-cols-7 gap-0.5 mb-1">
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
            <div key={i} className="text-center text-xs py-1" style={{ color: "var(--text-muted)" }}>
              {d}
            </div>
          ))}
        </div>
        {/* Pad first week */}
        <div className="grid grid-cols-7 gap-0.5">
          {Array.from({ length: daysInMonth[0].getDay() }).map((_, i) => (
            <div key={`pad-${i}`} />
          ))}
          {daysInMonth.map((day) => {
            const hasDue = dueDates.some((dd) => isSameDay(dd, day));
            const isCurrentDay = isToday(day);
            return (
              <div
                key={day.toISOString()}
                className={cn(
                  "text-center text-xs py-1.5 rounded-lg relative transition-colors",
                  isCurrentDay && "font-bold"
                )}
                style={{
                  color: hasDue ? "#fff" : isCurrentDay ? "#6366f1" : "var(--text-secondary)",
                  background: hasDue
                    ? "linear-gradient(135deg, #ef4444, #f97316)"
                    : isCurrentDay
                    ? "rgba(99,102,241,0.15)"
                    : "transparent",
                }}
              >
                {day.getDate()}
                {hasDue && (
                  <span
                    className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming list */}
      {upcomingList.length === 0 ? (
        <p className="text-xs text-center py-2" style={{ color: "var(--text-muted)" }}>
          No upcoming dues this month
        </p>
      ) : (
        <div className="space-y-2">
          {upcomingList.map((debt) => {
            const daysLeft = Math.ceil(
              (new Date(debt.dueDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
            );
            return (
              <div
                key={debt.id}
                className="flex items-center justify-between text-xs py-2 px-3 rounded-lg"
                style={{ background: "var(--bg-hover)" }}
              >
                <span className="font-medium truncate" style={{ color: "var(--text-primary)" }}>
                  {debt.name}
                </span>
                <span
                  className="font-semibold ml-2 flex-shrink-0"
                  style={{ color: daysLeft < 0 ? "#ef4444" : daysLeft <= 3 ? "#f59e0b" : "var(--text-muted)" }}
                >
                  {daysLeft < 0 ? `${Math.abs(daysLeft)}d overdue` : daysLeft === 0 ? "Today" : `${daysLeft}d left`}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
