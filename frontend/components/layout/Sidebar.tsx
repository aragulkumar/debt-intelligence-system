"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useDebtStore } from "@/store/useDebtStore";
import {
  LayoutDashboard,
  CreditCard,
  TrendingUp,
  Heart,
  Zap,
  Settings,
  Bot,
  BookOpen,
  Shield,
  Users,
  BarChart3,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const userNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/debts", label: "My Debts", icon: CreditCard },
  { href: "/dashboard/strategy", label: "Strategy", icon: TrendingUp },
  { href: "/dashboard/health", label: "Health Score", icon: Heart },
  { href: "/dashboard/simulate", label: "What-If Simulator", icon: Zap },
  { href: "/dashboard/rules", label: "Rules", icon: BookOpen },
  { href: "/dashboard/coach", label: "AI Coach", icon: Bot },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

const adminNavItems = [
  { href: "/admin", label: "Admin Overview", icon: Shield },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/risk", label: "Risk Heatmap", icon: BarChart3 },
  { href: "/admin/bnpl", label: "BNPL Analytics", icon: CreditCard },
  { href: "/admin/compliance", label: "Compliance", icon: FileText },
];

export function Sidebar({ isAdmin = false }: { isAdmin?: boolean }) {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useDebtStore();

  const navItems = isAdmin ? adminNavItems : userNavItems;

  return (
    <aside
      className={cn(
        "flex flex-col h-screen sticky top-0 border-r transition-all duration-300 ease-in-out",
        sidebarOpen ? "w-60" : "w-16"
      )}
      style={{
        background: "var(--bg-card)",
        borderColor: "var(--border)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b" style={{ borderColor: "var(--border)" }}>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}
        >
          <span className="text-white text-sm font-bold">D</span>
        </div>
        {sidebarOpen && (
          <span className="font-bold text-sm whitespace-nowrap" style={{ color: "var(--text-primary)" }}>
            Debt Helper
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        {sidebarOpen && (
          <p className="text-xs font-semibold uppercase tracking-wider px-2 mb-2"
            style={{ color: "var(--text-muted)" }}>
            {isAdmin ? "Admin" : "Menu"}
          </p>
        )}
        <ul className="space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || (href !== "/dashboard" && href !== "/admin" && pathname.startsWith(href));
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "flex items-center gap-3 px-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                    isActive
                      ? "text-white"
                      : "hover:text-white"
                  )}
                  style={
                    isActive
                      ? {
                          background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(168,85,247,0.1))",
                          color: "#818cf8",
                          borderLeft: "2px solid #6366f1",
                        }
                      : { color: "var(--text-secondary)" }
                  }
                  title={!sidebarOpen ? label : undefined}
                >
                  <Icon size={18} className="flex-shrink-0" />
                  {sidebarOpen && <span className="truncate">{label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Toggle */}
      <div className="p-2 border-t" style={{ borderColor: "var(--border)" }}>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-full flex items-center justify-center p-2 rounded-lg transition-colors"
          style={{ color: "var(--text-muted)" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-hover)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>
    </aside>
  );
}
