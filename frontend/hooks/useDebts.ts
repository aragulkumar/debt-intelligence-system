import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { debtsApi } from "@/lib/api";
import { toast } from "sonner";
import type { AddDebtPayload } from "@/types";

export function useDebts() {
  return useQuery({
    queryKey: ["debts"],
    queryFn: () => debtsApi.getAll(),
    select: (data) => data.debts,
  });
}

export function useDebtSummary() {
  return useQuery({
    queryKey: ["debts", "summary"],
    queryFn: () => debtsApi.getSummary(),
  });
}

export function useDebt(id: string) {
  return useQuery({
    queryKey: ["debts", id],
    queryFn: () => debtsApi.getOne(id),
    enabled: !!id,
  });
}

export function useAddDebt() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: AddDebtPayload) => debtsApi.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["debts"] });
      toast.success("Debt added successfully");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateDebt() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AddDebtPayload> }) =>
      debtsApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["debts"] });
      toast.success("Debt updated successfully");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteDebt() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => debtsApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["debts"] });
      toast.success("Debt deleted");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
