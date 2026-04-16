"use client";

import { useState } from "react";
import type { Rule } from "@/types";
import { TopNav } from "@/components/layout/TopNav";
import { RuleCard } from "@/components/rules/RuleCard";
import { RuleBuilder } from "@/components/rules/RuleBuilder";
import { useRules, useDeleteRule } from "@/hooks/useRules";
import { Plus } from "lucide-react";

export default function RulesPage() {
  const { data: rules, isLoading } = useRules();
  const deleteRule = useDeleteRule();
  const [showBuilder, setShowBuilder] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <TopNav title="Automation Rules" subtitle="Set rules that trigger automatic actions" />
      <div className="p-6 space-y-6 fade-in">
        <div className="flex justify-between items-center">
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {rules?.length ?? 0} active rules
          </p>
          <button
            id="rules-add-btn"
            onClick={() => setShowBuilder(!showBuilder)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
            style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)", color: "#fff" }}
          >
            <Plus size={16} /> New Rule
          </button>
        </div>

        {showBuilder && <RuleBuilder onClose={() => setShowBuilder(false)} />}

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-xl p-4 border glass h-20" style={{ borderColor: "var(--border)" }} />
            ))}
          </div>
        ) : rules?.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">⚡</p>
            <p className="font-semibold" style={{ color: "var(--text-primary)" }}>No rules yet</p>
            <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
              Create rules to automate debt actions based on triggers
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {rules?.map((rule: Rule) => (
              <RuleCard key={rule.id} rule={rule} onDelete={(id) => deleteRule.mutate(id)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
