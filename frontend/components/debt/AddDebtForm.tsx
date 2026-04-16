"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAddDebt, useUpdateDebt } from "@/hooks/useDebts";
import type { Debt } from "@/types";
import { X } from "lucide-react";

const schema = z.object({
  name: z.string().min(1, "Name required"),
  type: z.enum(["BNPL", "EMI", "CREDIT_CARD", "PERSONAL_LOAN", "OTHER"]),
  principal: z.number().positive("Must be positive"),
  outstanding: z.number().nonnegative(),
  interestRate: z.number().nonnegative(),
  emiAmount: z.number().optional(),
  dueDate: z.string().min(1, "Due date required"),
  tag: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface AddDebtFormProps {
  debt?: Debt;
  onClose: () => void;
}

export function AddDebtForm({ debt, onClose }: AddDebtFormProps) {
  const addDebt = useAddDebt();
  const updateDebt = useUpdateDebt();
  const isEditing = !!debt;

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: debt
      ? { ...debt, emiAmount: debt.emiAmount ?? undefined, tag: debt.tag ?? undefined, dueDate: debt.dueDate.slice(0, 10) }
      : { type: "EMI" },
  });

  const onSubmit = async (data: FormData) => {
    if (isEditing) {
      await updateDebt.mutateAsync({ id: debt.id, data });
    } else {
      await addDebt.mutateAsync(data);
    }
    onClose();
  };

  const inputStyle = {
    background: "var(--bg-elevated)", borderColor: "var(--border)", color: "var(--text-primary)",
  };

  const Field = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
    <div>
      <label className="block text-xs mb-1.5" style={{ color: "var(--text-muted)" }}>{label}</label>
      {children}
      {error && <p className="text-xs mt-1" style={{ color: "#ef4444" }}>{error}</p>}
    </div>
  );

  return (
    <div className="rounded-2xl border glass p-6" style={{ borderColor: "var(--border)" }}>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
          {isEditing ? "Edit Debt" : "Add New Debt"}
        </h2>
        <button onClick={onClose} className="p-1.5 rounded-lg transition-colors" style={{ color: "var(--text-muted)" }}>
          <X size={18} />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Debt Name" error={errors.name?.message}>
            <input id="debt-form-name" {...register("name")} className="w-full rounded-lg px-3 py-2 text-sm border outline-none" style={inputStyle} placeholder="e.g. HDFC Credit Card" />
          </Field>
          <Field label="Type">
            <select id="debt-form-type" {...register("type")} className="w-full rounded-lg px-3 py-2 text-sm border outline-none" style={inputStyle}>
              <option value="BNPL">BNPL</option>
              <option value="EMI">EMI</option>
              <option value="CREDIT_CARD">Credit Card</option>
              <option value="PERSONAL_LOAN">Personal Loan</option>
              <option value="OTHER">Other</option>
            </select>
          </Field>
          <Field label="Principal Amount" error={errors.principal?.message}>
            <input id="debt-form-principal" type="number" {...register("principal", { valueAsNumber: true })} className="w-full rounded-lg px-3 py-2 text-sm border outline-none" style={inputStyle} placeholder="100000" />
          </Field>
          <Field label="Outstanding Balance" error={errors.outstanding?.message}>
            <input id="debt-form-outstanding" type="number" {...register("outstanding", { valueAsNumber: true })} className="w-full rounded-lg px-3 py-2 text-sm border outline-none" style={inputStyle} placeholder="80000" />
          </Field>
          <Field label="Interest Rate (%)" error={errors.interestRate?.message}>
            <input id="debt-form-interest" type="number" step="0.1" {...register("interestRate", { valueAsNumber: true })} className="w-full rounded-lg px-3 py-2 text-sm border outline-none" style={inputStyle} placeholder="18" />
          </Field>
          <Field label="EMI Amount (optional)">
            <input id="debt-form-emi" type="number" {...register("emiAmount", { valueAsNumber: true })} className="w-full rounded-lg px-3 py-2 text-sm border outline-none" style={inputStyle} placeholder="5000" />
          </Field>
          <Field label="Due Date" error={errors.dueDate?.message}>
            <input id="debt-form-duedate" type="date" {...register("dueDate")} className="w-full rounded-lg px-3 py-2 text-sm border outline-none" style={inputStyle} />
          </Field>
          <Field label="Tag (optional)">
            <input id="debt-form-tag" {...register("tag")} className="w-full rounded-lg px-3 py-2 text-sm border outline-none" style={inputStyle} placeholder="e.g. Home, Car" />
          </Field>
        </div>

        <button
          type="submit"
          id="debt-form-submit"
          disabled={addDebt.isPending || updateDebt.isPending}
          className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all mt-2"
          style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)", color: "#fff", opacity: addDebt.isPending || updateDebt.isPending ? 0.7 : 1 }}
        >
          {addDebt.isPending || updateDebt.isPending ? "Saving..." : isEditing ? "Update Debt" : "Add Debt"}
        </button>
      </form>
    </div>
  );
}
