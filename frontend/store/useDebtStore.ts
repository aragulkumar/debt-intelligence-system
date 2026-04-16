import { create } from "zustand";
import type { Debt, DebtSummary, HealthScore, RepaymentStrategy } from "@/types";

interface DebtStore {
  // Data
  debts: Debt[];
  summary: DebtSummary | null;
  healthScore: HealthScore | null;
  selectedStrategy: RepaymentStrategy;
  extraPayment: number;

  // UI state
  sidebarOpen: boolean;
  activeDebtId: string | null;

  // Actions
  setDebts: (debts: Debt[]) => void;
  setSummary: (summary: DebtSummary) => void;
  setHealthScore: (score: HealthScore) => void;
  setSelectedStrategy: (strategy: RepaymentStrategy) => void;
  setExtraPayment: (amount: number) => void;
  setSidebarOpen: (open: boolean) => void;
  setActiveDebtId: (id: string | null) => void;
}

export const useDebtStore = create<DebtStore>((set) => ({
  debts: [],
  summary: null,
  healthScore: null,
  selectedStrategy: "avalanche",
  extraPayment: 0,
  sidebarOpen: true,
  activeDebtId: null,

  setDebts: (debts) => set({ debts }),
  setSummary: (summary) => set({ summary }),
  setHealthScore: (healthScore) => set({ healthScore }),
  setSelectedStrategy: (selectedStrategy) => set({ selectedStrategy }),
  setExtraPayment: (extraPayment) => set({ extraPayment }),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  setActiveDebtId: (activeDebtId) => set({ activeDebtId }),
}));
