// ─── Debt ────────────────────────────────────────────────────────────────────

export type DebtType = "BNPL" | "EMI" | "CREDIT_CARD" | "PERSONAL_LOAN" | "OTHER";

export interface Debt {
  id: string;
  name: string;
  type: DebtType;
  principal: number;
  outstanding: number;
  interestRate: number;
  emiAmount: number | null;
  dueDate: string;
  tag: string | null;
  isActive: boolean;
}

export interface DebtSummary {
  totalOutstanding: number;
  totalMonthlyEmi: number;
  emiToIncomeRatio: number;
  overdueCount: number;
  upcomingDueCount: number;
  debtsByType: {
    BNPL: number;
    EMI: number;
    CREDIT_CARD: number;
    PERSONAL_LOAN: number;
  };
}

export interface AddDebtPayload {
  name: string;
  type: DebtType;
  principal: number;
  outstanding: number;
  interestRate: number;
  emiAmount?: number;
  dueDate: string;
  tag?: string;
}

// ─── Repayment ───────────────────────────────────────────────────────────────

export type RepaymentStrategy = "snowball" | "avalanche" | "hybrid" | "custom";

export interface RepaymentPayment {
  debtId: string;
  debtName: string;
  amount: number;
  remainingBalance: number;
}

export interface RepaymentMonth {
  month: number;
  payments: RepaymentPayment[];
}

export interface RepaymentPlan {
  plan: RepaymentMonth[];
  totalInterestPaid: number;
  debtFreeDate: string;
  monthsToFreedom: number;
}

export interface RepaymentRequest {
  strategy: RepaymentStrategy;
  extra_payment: number;
  weights?: Array<{ debt_id: string; weight: number }>;
}

export interface SimulateRequest {
  debt_id: string;
  extra_amount: number;
}

export interface SimulateResult {
  currentPayoffDate: string;
  newPayoffDate: string;
  monthsSaved: number;
  interestSaved: number;
}

// ─── Health Score ─────────────────────────────────────────────────────────────

export type HealthBand = "poor" | "fair" | "good" | "excellent";

export interface HealthScore {
  score: number;
  band: HealthBand;
  breakdown: {
    paymentBehaviour: number;
    utilisation: number;
    debtLoad: number;
    diversity: number;
  };
}

export interface HealthHistoryEntry {
  date: string;
  score: number;
}

export type SuggestionPriority = "high" | "medium" | "low";

export interface Suggestion {
  priority: SuggestionPriority;
  message: string;
  action: string;
}

// ─── Danger Zone Settings ─────────────────────────────────────────────────────

export interface DangerZoneSettings {
  overdueWarningDays: number;
  maxEmiLoadPercent: number;
  interestRateAlertThreshold: number;
  creditUtilisationWarning: number;
}

// ─── Rules ───────────────────────────────────────────────────────────────────

export type RuleTrigger =
  | "salary_above"
  | "salary_below"
  | "debt_overdue"
  | "utilisation_above"
  | "emi_load_above";

export type RuleAction = "allocate_extra" | "send_alert" | "pause_strategy";

export interface Rule {
  id: string;
  trigger: RuleTrigger;
  threshold: number;
  action: RuleAction;
  amount: number | null;
  targetDebt: string | null;
  isActive: boolean;
}

export interface AddRulePayload {
  trigger: RuleTrigger;
  threshold: number;
  action: RuleAction;
  amount?: number;
  targetDebt?: string;
}

// ─── AI Coach ────────────────────────────────────────────────────────────────

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatRequest {
  message: string;
  conversation_history: ChatMessage[];
}

export interface ChatResponse {
  reply: string;
}

// ─── Admin ───────────────────────────────────────────────────────────────────

export type RiskLabel = "low" | "medium" | "high";

export interface UserRisk {
  userId: string;
  riskScore: number;
  riskLabel: RiskLabel;
  totalOutstanding: number;
  emiLoadPercent: number;
}

export interface BnplAnalytics {
  totalBnplUsers: number;
  heavyDependentCount: number;
  avgBnplAccountsPerUser: number;
  bnplToTotalDebtRatio: number;
  trend: Array<{ date: string; count: number }>;
}

export interface RepaymentSuccess {
  successRate: number;
  onTrackCount: number;
  offTrackCount: number;
  avgMonthsToFreedom: number;
  byStrategy: {
    snowball: number;
    avalanche: number;
    hybrid: number;
    custom: number;
  };
}
