"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { settingsApi } from "@/lib/api";
import { toast } from "sonner";
import type { DangerZoneSettings } from "@/types";
import { ShieldAlert } from "lucide-react";

const schema = z.object({
  overdueWarningDays: z.number().min(1).max(30),
  maxEmiLoadPercent: z.number().min(1).max(100),
  interestRateAlertThreshold: z.number().min(1).max(60),
  creditUtilisationWarning: z.number().min(1).max(100),
});

type FormData = z.infer<typeof schema>;

const FIELDS: Array<{ key: keyof FormData; label: string; min: number; max: number; unit: string }> = [
  { key: "overdueWarningDays", label: "Overdue Warning Days", min: 1, max: 30, unit: "days" },
  { key: "maxEmiLoadPercent", label: "Max EMI Load", min: 1, max: 100, unit: "%" },
  { key: "interestRateAlertThreshold", label: "Interest Rate Alert", min: 1, max: 60, unit: "%" },
  { key: "creditUtilisationWarning", label: "Credit Utilisation Warning", min: 1, max: 100, unit: "%" },
];

export function DangerZoneForm() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery<DangerZoneSettings>({
    queryKey: ["settings", "danger-zone"],
    queryFn: () => settingsApi.getDangerZone(),
  });

  const mutation = useMutation({
    mutationFn: (body: Partial<FormData>) => settingsApi.updateDangerZone(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["settings"] });
      toast.success("Settings saved");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const { register, handleSubmit, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    values: data,
  });

  const values = watch();

  if (isLoading) return (
    <div className="animate-pulse rounded-xl p-5 border glass" style={{ borderColor: "var(--border)", height: 300 }} />
  );

  return (
    <form
      onSubmit={handleSubmit((d) => mutation.mutate(d))}
      className="rounded-xl p-5 border glass"
      style={{ borderColor: "rgba(239,68,68,0.3)", boxShadow: "0 0 20px rgba(239,68,68,0.05)" }}
    >
      <div className="flex items-center gap-2 mb-4">
        <ShieldAlert size={16} style={{ color: "#ef4444" }} />
        <h2 className="text-sm font-semibold" style={{ color: "#ef4444" }}>Danger Zone Settings</h2>
      </div>

      <div className="space-y-5">
        {FIELDS.map(({ key, label, min, max, unit }) => (
          <div key={key}>
            <div className="flex justify-between text-xs mb-1.5">
              <label style={{ color: "var(--text-secondary)" }}>{label}</label>
              <span className="font-bold" style={{ color: "#ef4444" }}>
                {values[key]} {unit}
              </span>
            </div>
            <input
              type="range"
              min={min}
              max={max}
              {...register(key, { valueAsNumber: true })}
              className="w-full"
              style={{ accentColor: "#ef4444" }}
            />
            <div className="flex justify-between text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
              <span>{min}{unit}</span>
              <span>{max}{unit}</span>
            </div>
          </div>
        ))}
      </div>

      <button
        type="submit"
        id="danger-zone-save"
        disabled={mutation.isPending}
        className="mt-6 w-full py-2.5 rounded-lg text-sm font-medium transition-all"
        style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.4)", color: "#ef4444" }}
      >
        {mutation.isPending ? "Saving..." : "Save Danger Zone Settings"}
      </button>
    </form>
  );
}
