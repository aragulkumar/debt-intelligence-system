"use client";

import { TopNav } from "@/components/layout/TopNav";
import { DangerZoneForm } from "@/components/settings/DangerZoneForm";

export default function SettingsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <TopNav title="Settings" subtitle="Manage thresholds and notification preferences" />
      <div className="p-6 fade-in">
        <div className="max-w-2xl mx-auto space-y-6">
          <DangerZoneForm />
        </div>
      </div>
    </div>
  );
}
