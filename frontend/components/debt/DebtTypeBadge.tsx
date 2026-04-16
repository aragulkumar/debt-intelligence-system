import { DEBT_BG } from "@/lib/utils";
import type { DebtType } from "@/types";

const LABELS: Record<DebtType, string> = {
  BNPL: "BNPL",
  EMI: "EMI",
  CREDIT_CARD: "Credit Card",
  PERSONAL_LOAN: "Personal Loan",
  OTHER: "Other",
};

export function DebtTypeBadge({ type }: { type: DebtType }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${DEBT_BG[type]}`}
    >
      {LABELS[type]}
    </span>
  );
}
