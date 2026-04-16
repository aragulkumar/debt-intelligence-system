import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, isAfter, isBefore, addDays } from "date-fns";
import type { DebtType, HealthBand, SuggestionPriority } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, compact = false): string {
  if (compact && amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }
  if (compact && amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`;
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  return format(new Date(dateStr), "dd MMM yyyy");
}

export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

export function isOverdue(dueDateStr: string): boolean {
  return isBefore(new Date(dueDateStr), new Date());
}

export function isDueSoon(dueDateStr: string, days = 7): boolean {
  const dueDate = new Date(dueDateStr);
  const now = new Date();
  return isAfter(dueDate, now) && isBefore(dueDate, addDays(now, days));
}

export const DEBT_COLORS: Record<DebtType, string> = {
  BNPL: "#f59e0b",
  EMI: "#3b82f6",
  CREDIT_CARD: "#a855f7",
  PERSONAL_LOAN: "#ef4444",
  OTHER: "#6b7280",
};

export const DEBT_BG: Record<DebtType, string> = {
  BNPL: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  EMI: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  CREDIT_CARD: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  PERSONAL_LOAN: "bg-red-500/10 text-red-400 border-red-500/30",
  OTHER: "bg-gray-500/10 text-gray-400 border-gray-500/30",
};

export const HEALTH_BAND_CONFIG: Record<
  HealthBand,
  { color: string; bg: string; label: string }
> = {
  poor: { color: "#ef4444", bg: "bg-red-500/10 text-red-400", label: "Poor" },
  fair: { color: "#f59e0b", bg: "bg-amber-500/10 text-amber-400", label: "Fair" },
  good: { color: "#3b82f6", bg: "bg-blue-500/10 text-blue-400", label: "Good" },
  excellent: { color: "#10b981", bg: "bg-emerald-500/10 text-emerald-400", label: "Excellent" },
};

export const SUGGESTION_PRIORITY_CONFIG: Record<
  SuggestionPriority,
  { color: string; icon: string }
> = {
  high: { color: "text-red-400 border-red-500/30 bg-red-500/10", icon: "🔴" },
  medium: { color: "text-amber-400 border-amber-500/30 bg-amber-500/10", icon: "🟡" },
  low: { color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10", icon: "🟢" },
};
