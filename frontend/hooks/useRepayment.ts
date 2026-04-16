import { useMutation } from "@tanstack/react-query";
import { repaymentApi } from "@/lib/api";
import { toast } from "sonner";
import type { RepaymentRequest, SimulateRequest } from "@/types";

export function useCalculateRepayment() {
  return useMutation({
    mutationFn: (payload: RepaymentRequest) => repaymentApi.calculate(payload),
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useSimulate() {
  return useMutation({
    mutationFn: (payload: SimulateRequest) => repaymentApi.simulate(payload),
    onError: (e: Error) => toast.error(e.message),
  });
}
