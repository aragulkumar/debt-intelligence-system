"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAddRule } from "@/hooks/useRules";
import { useDebts } from "@/hooks/useDebts";
import { Plus } from "lucide-react";
import type { Debt } from "@/types";

const schema = z.object({
  trigger: z.enum(["salary_above", "salary_below", "debt_overdue", "utilisation_above", "emi_load_above"]),
  threshold: z.number().positive(),
  action: z.enum(["allocate_extra", "send_alert", "pause_strategy"]),
  amount: z.number().optional(),
  targetDebt: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function RuleBuilder({ onClose }: { onClose?: () => void }) {
  const addRule = useAddRule();
  const { data: debts } = useDebts();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { trigger: "salary_above", action: "send_alert", threshold: 50000 },
  });

  const onSubmit = async (data: FormData) => {
    await addRule.mutateAsync(data);
    onClose?.();
  };

  const inputStyle = {
    background: "var(--bg-elevated)", borderColor: "var(--border)", color: "var(--text-primary)",
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-xl p-5 border glass" style={{ borderColor: "var(--border)" }}>
      <h2 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
        Create Automation Rule
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs mb-1.5" style={{ color: "var(--text-muted)" }}>Trigger</label>
          <select {...register("trigger")} className="w-full rounded-lg px-3 py-2 text-sm border outline-none" style={inputStyle}>
            <option value="salary_above">Salary above</option>
            <option value="salary_below">Salary below</option>
            <option value="debt_overdue">Debt overdue</option>
            <option value="utilisation_above">Utilisation above</option>
            <option value="emi_load_above">EMI load above</option>
          </select>
        </div>
        <div>
          <label className="block text-xs mb-1.5" style={{ color: "var(--text-muted)" }}>Threshold</label>
          <input
            type="number"
            {...register("threshold", { valueAsNumber: true })}
            className="w-full rounded-lg px-3 py-2 text-sm border outline-none"
            style={inputStyle}
            placeholder="e.g. 50000"
          />
          {errors.threshold && <p className="text-xs mt-1" style={{ color: "#ef4444" }}>{errors.threshold.message}</p>}
        </div>
        <div>
          <label className="block text-xs mb-1.5" style={{ color: "var(--text-muted)" }}>Action</label>
          <select {...register("action")} className="w-full rounded-lg px-3 py-2 text-sm border outline-none" style={inputStyle}>
            <option value="allocate_extra">Allocate extra payment</option>
            <option value="send_alert">Send alert</option>
            <option value="pause_strategy">Pause strategy</option>
          </select>
        </div>
        <div>
          <label className="block text-xs mb-1.5" style={{ color: "var(--text-muted)" }}>Amount (optional)</label>
          <input
            type="number"
            {...register("amount", { valueAsNumber: true })}
            className="w-full rounded-lg px-3 py-2 text-sm border outline-none"
            style={inputStyle}
            placeholder="e.g. 5000"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs mb-1.5" style={{ color: "var(--text-muted)" }}>Target Debt (optional)</label>
          <select {...register("targetDebt")} className="w-full rounded-lg px-3 py-2 text-sm border outline-none" style={inputStyle}>
            <option value="">None</option>
            {debts?.map((d: Debt) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>
      </div>
      <button
        type="submit"
        id="rule-builder-submit"
        disabled={addRule.isPending}
        className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-sm transition-all"
        style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)", color: "#fff" }}
      >
        <Plus size={16} />
        {addRule.isPending ? "Creating..." : "Create Rule"}
      </button>
    </form>
  );
}
