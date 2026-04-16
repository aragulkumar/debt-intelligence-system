import { Sidebar } from "@/components/layout/Sidebar";
import { AuthSyncProvider } from "@/components/providers/AuthSyncProvider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthSyncProvider>
      <div className="flex h-screen overflow-hidden" style={{ background: "var(--bg-base)" }}>
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </AuthSyncProvider>
  );
}
